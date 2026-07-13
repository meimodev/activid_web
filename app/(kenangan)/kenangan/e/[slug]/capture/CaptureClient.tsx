"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getKenanganLutPreset, type KenanganLutId } from "@/data/kenangan-luts";
import {
  createKenanganGl,
  drawKenanganFrame,
  ensureKenanganLut,
  type KenanganGlState,
} from "@/lib/kenangan-lut-webgl";
import KkProgress from "@/app/(kenangan)/kenangan/KkProgress";

const GUEST_SESSION_STORAGE_KEY = "kk_guest_session";
const WATERMARK_TEXT = "K E N A N G A N K I T A";

type Phase = "idle" | "starting" | "live" | "countdown" | "review" | "sending" | "done";
type Facing = "environment" | "user";

function getGuestSessionId(): string {
  let id = localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_SESSION_STORAGE_KEY, id);
  }
  return id;
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const pad = Math.round(width * 0.035);
  const size = Math.max(14, Math.round(width * 0.02));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `${size}px serif`;
  ctx.fillStyle = "rgba(247, 242, 234, 0.82)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(WATERMARK_TEXT, width - pad, height - pad);
}

export default function CaptureClient({
  slug,
  lutIds,
}: {
  slug: string;
  lutIds: KenanganLutId[];
}) {
  const token = useSearchParams().get("t");
  const presets = lutIds.map(getKenanganLutPreset);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<KenanganGlState | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // The blob that gets uploaded: UNGRADED frame + watermark. The LUT is never
  // baked into the original — lutId travels as metadata and is re-applied
  // (WebGL on feed thumbs, sharp at publish) so full-res re-grades stay clean.
  const uploadBlobRef = useRef<Blob | null>(null);

  const [phase, setPhase] = useState<Phase>("starting");
  const [count, setCount] = useState(3);
  const [lutId, setLutId] = useState<KenanganLutId>(lutIds[0] ?? "natural");
  const [facing, setFacing] = useState<Facing>("environment");
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sendMsg, setSendMsg] = useState("Mengirim…");
  // Upload-leg byte progress: 0-100 while bytes ship to imagekit, null on the
  // quick auth/commit legs (bar falls back to indeterminate there).
  const [uploadPct, setUploadPct] = useState<number | null>(null);

  // Render loop: create GL lazily, keep LUT in sync, draw video every frame.
  useEffect(() => {
    if (phase !== "live" && phase !== "countdown") return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let state = glRef.current;
    if (!state) {
      state = createKenanganGl(canvas);
      if (!state) {
        setErrorMsg("Perangkat ini tidak mendukung pratinjau kamera (WebGL).");
        setPhase("idle");
        return;
      }
      glRef.current = state;
    }
    ensureKenanganLut(state, lutId);

    const mirror = facing === "user";
    let raf = 0;
    const loop = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        drawKenanganFrame(state, video, mirror);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, facing, lutId]);

  // Countdown: 3-2-1 then capture.
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      void capture();
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, count]);

  // Stop the camera on unmount.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Auto-start on mount — no "Mulai Kamera" gate. The permission prompt fires
  // immediately; ref guard stops StrictMode's double-invoke from double-calling.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startCamera(facing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera(mode: Facing) {
    setPhase("starting");
    setErrorMsg("");
    // getUserMedia is undefined outside a secure context (HTTP on a LAN IP).
    // Guard up front so the message names the real cause instead of blaming permissions.
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Kamera butuh koneksi aman. Buka halaman ini lewat HTTPS lalu coba lagi.");
      setPhase("idle");
      return;
    }
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        // ideal 1920: default capture resolution is the #1 silent quality killer
        video: { facingMode: mode, width: { ideal: 1920 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setPhase("live");
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError") {
        setErrorMsg("Akses kamera ditolak. Izinkan kamera di pengaturan browser lalu coba lagi.");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setErrorMsg("Kamera tidak ditemukan di perangkat ini.");
      } else if (name === "NotReadableError") {
        setErrorMsg("Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu lalu coba lagi.");
      } else {
        setErrorMsg("Kamera tidak dapat diakses. Coba lagi.");
      }
      setPhase("idle");
    }
  }

  function flipCamera() {
    const next: Facing = facing === "environment" ? "user" : "environment";
    setFacing(next);
    void startCamera(next);
  }

  function startCountdown() {
    setCount(3);
    setPhase("countdown");
  }

  // Shutter: tap = shoot now, hold = 3-2-1 timer (group selfies). A tap while
  // the countdown runs aborts it. pressTimer distinguishes tap from hold;
  // longPressed suppresses the capture on the release that follows a hold.
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);
  function onShutterDown() {
    if (phase === "countdown") {
      setPhase("live");
      setCount(3);
      return;
    }
    longPressed.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      startCountdown();
    }, 350);
  }
  function onShutterUp() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (longPressed.current) return;
    if (phase === "live") void capture();
  }

  async function capture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const state = glRef.current;
    if (!canvas || !video || !state) return;

    setFlash(true);
    const width = canvas.width;
    const height = canvas.height;
    const mirror = facing === "user";
    drawKenanganFrame(state, video, mirror);

    // Review image: graded preview + watermark — exactly what will be published.
    const graded = document.createElement("canvas");
    graded.width = width;
    graded.height = height;
    const gradedCtx = graded.getContext("2d");
    if (!gradedCtx) return;
    gradedCtx.drawImage(canvas, 0, 0);
    drawWatermark(gradedCtx, width, height);

    // Upload image: ungraded frame + watermark, mirrored to match the preview.
    const raw = document.createElement("canvas");
    raw.width = width;
    raw.height = height;
    const rawCtx = raw.getContext("2d");
    if (!rawCtx) return;
    if (mirror) {
      rawCtx.translate(width, 0);
      rawCtx.scale(-1, 1);
    }
    rawCtx.drawImage(video, 0, 0, width, height);
    drawWatermark(rawCtx, width, height);

    const [gradedBlob, rawBlob] = await Promise.all([canvasToJpeg(graded), canvasToJpeg(raw)]);
    if (!gradedBlob || !rawBlob) {
      setErrorMsg("Gagal memproses foto. Coba lagi.");
      setPhase("live");
      return;
    }
    uploadBlobRef.current = rawBlob;
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl(URL.createObjectURL(gradedBlob));
    setPhase("review");
  }

  function retake() {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    setReviewUrl(null);
    uploadBlobRef.current = null;
    setErrorMsg("");
    setPhase("live");
  }

  async function kirim() {
    const blob = uploadBlobRef.current;
    if (!blob || !token) return;
    setPhase("sending");
    setErrorMsg("");
    setUploadPct(null);
    setSendMsg("Menyiapkan…");
    try {
      const guestSessionId = getGuestSessionId();

      const authRes = await fetch("/api/kenangan/upload-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, guestSessionId }),
      });
      if (!authRes.ok) throw new Error("auth");
      const auth = await authRes.json();

      const form = new FormData();
      form.append("file", blob, auth.fileName);
      form.append("fileName", auth.fileName);
      form.append("folder", auth.folder);
      form.append("useUniqueFileName", "false");
      form.append("token", auth.token);
      form.append("expire", String(auth.expire));
      form.append("signature", auth.signature);
      form.append("publicKey", auth.publicKey);
      // The one slow leg on venue wifi. XHR (not fetch) so upload.onprogress
      // drives a real % bar; 45s timeout so a stalled upload surfaces a retry
      // instead of an infinite spinner.
      setSendMsg("Mengunggah foto…");
      setUploadPct(0);
      const uploaded = await new Promise<{ width?: number; height?: number }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
        xhr.timeout = 45000;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadPct(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              reject(new Error("upload"));
            }
          } else {
            reject(new Error("upload"));
          }
        };
        xhr.onerror = () => reject(new Error("upload"));
        xhr.ontimeout = () => reject(new Error("upload"));
        xhr.send(form);
      });

      setUploadPct(null);
      setSendMsg("Menyimpan…");
      const commitRes = await fetch("/api/kenangan/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          guestSessionId,
          photoId: auth.photoId,
          lutId,
          width: uploaded.width ?? canvasRef.current?.width ?? 0,
          height: uploaded.height ?? canvasRef.current?.height ?? 0,
        }),
      });
      if (!commitRes.ok) throw new Error("commit");
      setPhase("done");
    } catch {
      setErrorMsg("Gagal mengirim foto. Periksa koneksi lalu coba lagi.");
      setPhase("review");
    }
  }

  const tokenQuery = token ? `?t=${encodeURIComponent(token)}` : "";

  if (!token) {
    return (
      <main className="kk-capture">
        <div className="kk-capture-stage">
          <div className="kk-capture-start">
            <p className="kk-capture-hint">
              Tautan tidak valid. Silakan pindai ulang kode QR di lokasi acara.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="kk-capture">
      <div className="kk-capture-stage">
        <video ref={videoRef} playsInline muted autoPlay hidden />
        <canvas ref={canvasRef} style={{ display: phase === "idle" || phase === "starting" ? "none" : "block" }} />

        {reviewUrl && (phase === "review" || phase === "sending" || phase === "done") ? (
          <img
            src={reviewUrl}
            alt="Pratinjau foto"
            className="kk-review-img"
            style={{ position: "absolute", inset: 0, margin: "auto" }}
          />
        ) : null}

        {flash ? <div className="kk-flash" onAnimationEnd={() => setFlash(false)} /> : null}

        {phase === "starting" ? (
          <div className="kk-capture-start">
            <div className="kk-spinner" aria-hidden />
            <p className="kk-capture-hint">Menyiapkan kamera…</p>
          </div>
        ) : null}

        {phase === "idle" ? (
          <div className="kk-capture-start">
            <p className="kk-capture-hint">{errorMsg || "Kamera tidak dapat diakses."}</p>
            <button
              type="button"
              className="kk-btn kk-btn-primary"
              onClick={() => startCamera(facing)}
            >
              Coba Lagi
            </button>
          </div>
        ) : null}

        {phase === "countdown" && count > 0 ? (
          <div className="kk-countdown" key={count} role="status" aria-live="assertive">{count}</div>
        ) : null}

        {phase === "done" ? (
          <div className="kk-capture-start" style={{ background: "rgba(26, 23, 20, 0.75)" }}>
            <svg
              className="kk-check"
              viewBox="0 0 52 52"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l7 7 15-15" />
            </svg>
            <p className="kk-display" style={{ fontSize: 28, animation: "kk-rise 0.4s var(--kk-ease) 0.5s both" }}>
              Foto terkirim!
            </p>
            <p className="kk-capture-hint">Foto kamu sudah tampil di galeri langsung.</p>
          </div>
        ) : null}
      </div>

      {phase === "live" || phase === "countdown" ? (
        <>
          <div className="kk-lut-row">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="kk-lut-chip"
                data-active={preset.id === lutId}
                onClick={() => setLutId(preset.id)}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <p className="kk-capture-tip">
            {phase === "countdown" ? "Ketuk untuk batal" : "Ketuk untuk foto · tahan untuk timer"}
          </p>
          <div className="kk-capture-controls">
            <div className="kk-capture-side">
              <Link href={`/kenangan/e/${slug}/feed${tokenQuery}`} className="kk-icon-btn" aria-label="Lihat galeri">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                </svg>
              </Link>
              <span className="kk-icon-label">Galeri</span>
            </div>
            <button
              type="button"
              className="kk-shutter"
              aria-label="Ambil foto — ketuk untuk foto, tahan untuk timer"
              onPointerDown={onShutterDown}
              onPointerUp={onShutterUp}
              onPointerLeave={() => {
                if (pressTimer.current) {
                  clearTimeout(pressTimer.current);
                  pressTimer.current = null;
                }
              }}
            />
            <div className="kk-capture-side">
              <button type="button" className="kk-icon-btn" aria-label="Balik kamera" onClick={flipCamera}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
              <span className="kk-icon-label">Balik</span>
            </div>
          </div>
        </>
      ) : null}

      {phase === "review" || phase === "sending" ? (
        <>
          {errorMsg ? <p className="kk-status-msg" style={{ color: "var(--kk-error-on-dark)" }}>{errorMsg}</p> : null}
          {phase === "sending" ? (
            <KkProgress value={uploadPct ?? undefined} className="kk-send-progress" />
          ) : null}
          <div className="kk-review-actions">
            <button type="button" className="kk-btn kk-btn-dark-ghost" onClick={retake} disabled={phase === "sending"}>
              Ulangi
            </button>
            <button type="button" className="kk-btn kk-btn-primary" onClick={kirim} disabled={phase === "sending"}>
              {phase === "sending" ? sendMsg : "Kirim"}
            </button>
          </div>
        </>
      ) : null}

      {phase === "done" ? (
        <div className="kk-review-actions">
          <button type="button" className="kk-btn kk-btn-dark-ghost" onClick={retake}>
            Foto Lagi
          </button>
          <Link href={`/kenangan/e/${slug}/feed${tokenQuery}`} className="kk-btn kk-btn-primary">
            Lihat Galeri
          </Link>
        </div>
      ) : null}
    </main>
  );
}
