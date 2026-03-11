"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { formatRelativeToNow } from "@/lib/date-time";
import { normalizeInvitationGuestName } from "@/lib/utils";
import { useOverlayAssets } from "./overlays";

interface Wish {
  id: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: Timestamp;
  invitationId: string;
}

interface WishApiWish {
  id: string;
  invitationId: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: number | null;
}

interface WishesProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
  isReady?: boolean;
}

export function Wishes({
  invitationId,
  heading,
  placeholder,
  thankYouMessage,
  isReady = true,
}: WishesProps) {
  const overlayAssets = useOverlayAssets();
  const searchParams = useSearchParams();
  const inviteeName = normalizeInvitationGuestName(searchParams.get("to"));

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [error, setError] = useState("");
  const [existingWish, setExistingWish] = useState<Wish | null>(null);

  const isDemo = useMemo(() => invitationId.endsWith("-demo"), [invitationId]);
  const effectiveInviteeName = inviteeName ?? (isDemo ? "Demo Guest" : null);

  const normalizeNameKey = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const toClientWish = (wish: WishApiWish): Wish => {
    const createdAt =
      typeof wish.createdAt === "number"
        ? Timestamp.fromMillis(wish.createdAt)
        : Timestamp.now();

    return {
      id: wish.id,
      invitationId: wish.invitationId,
      name: wish.name,
      nameKey: wish.nameKey,
      message: wish.message,
      createdAt,
    };
  };

  const inviteeNameKey = useMemo(() => {
    if (!inviteeName) return null;
    return normalizeNameKey(inviteeName);
  }, [inviteeName]);

  const demoSeedWishes = useMemo(() => {
    if (!isDemo) return [] as Wish[];
    const now = Date.now();
    return [
      {
        id: `demo_${invitationId}_1`,
        invitationId,
        name: "Nadia",
        message: "Happy birthday! Semoga pestanya seru banget dan penuh kejutan manis.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 16),
      },
      {
        id: `demo_${invitationId}_2`,
        invitationId,
        name: "Rafa",
        message: "Semoga sehat selalu, makin ceria, dan semua cita-citanya tercapai ya!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
      },
      {
        id: `demo_${invitationId}_3`,
        invitationId,
        name: "Caca",
        message: "Selamat ulang tahun! Jangan lupa sisain kue dan waktunya buat main bareng ya!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 8),
      },
    ];
  }, [invitationId, isDemo]);

  useEffect(() => {
    if (!invitationId) return;

    if (isDemo) {
      setWishes(demoSeedWishes);
      return;
    }

    const controller = new AbortController();

    const fetchWishes = async () => {
      try {
        const res = await fetch(
          `/api/wishes?invitationId=${encodeURIComponent(invitationId)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as { wishes?: WishApiWish[] };
        setWishes((json.wishes ?? []).map(toClientWish));
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
      }
    };

    void fetchWishes();
    return () => controller.abort();
  }, [demoSeedWishes, invitationId, isDemo]);

  useEffect(() => {
    const checkExisting = async () => {
      if (isDemo || !inviteeName || !inviteeNameKey) return;
      try {
        const res = await fetch(
          `/api/wishes?invitationId=${encodeURIComponent(invitationId)}&nameKey=${encodeURIComponent(inviteeNameKey)}`,
        );
        if (!res.ok) return;
        const json = (await res.json()) as { wish: WishApiWish | null };
        if (json.wish) {
          const wish = toClientWish(json.wish);
          setExistingWish(wish);
          setHasPosted(true);
        }
      } catch {
        return;
      }
    };

    void checkExisting();
  }, [invitationId, inviteeName, inviteeNameKey, isDemo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDemo) {
      setIsSubmitting(true);
      setError("");
      try {
        const next: Wish = {
          id: `demo_post_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          invitationId,
          name: effectiveInviteeName ?? "Demo Guest",
          message: message.trim(),
          createdAt: Timestamp.now(),
        };
        setWishes((prev) => [next, ...prev]);
        setMessage("");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!inviteeName || !inviteeNameKey) {
      setError("Fitur ini hanya tersedia melalui link undangan pribadi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextData: Omit<Wish, "id"> = {
        invitationId,
        name: inviteeName,
        nameKey: inviteeNameKey,
        message: message.trim(),
        createdAt: Timestamp.now(),
      };

      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          invitationId,
          name: inviteeName,
          nameKey: inviteeNameKey,
          message: message.trim(),
        }),
      });

      if (res.status === 409) {
        const json = (await res.json()) as { wish?: WishApiWish | null };
        if (json.wish) setExistingWish(toClientWish(json.wish));
        setHasPosted(true);
        setError("Ucapan kamu sudah terkirim sebelumnya. Terima kasih ya!");
        return;
      }

      if (!res.ok) throw new Error("failed");

      const json = (await res.json()) as { wish?: WishApiWish | null };
      setMessage("");
      setExistingWish(json.wish ? toClientWish(json.wish) : { id: `local_${Date.now()}`, ...nextData });
      setHasPosted(true);
    } catch {
      setError("Terjadi kendala. Coba lagi ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
        <motion.div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-48 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-20 top-20 h-[300px] w-[300px] bg-contain bg-no-repeat opacity-50 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.stars})` }}
          animate={{ rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-0 top-10 h-[150px] w-[150px] bg-contain bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${overlayAssets.cake})` }}
          animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center pt-8">
            <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent/80 inline-block px-5 py-1.5 rounded-full border-2 border-white/40 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)] rotate-2">Pesan Ulang Tahun</p>
            <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent-2)]">
              {heading}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={18} delay={0.16} width="100%" isReady={isReady}>
          <motion.div 
            className="mt-12 rounded-[48px] border-4 border-white bg-white/80 p-6 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent),0_30px_70px_rgba(63,19,91,0.14)] backdrop-blur-xl"
            animate={{ rotate: [1, -1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            {!effectiveInviteeName ? (
              <div className="text-center font-poppins text-[14px] leading-relaxed text-wedding-dark/72">
                Untuk menulis ucapan, buka undangan ini dari link pribadi yang kamu terima.
              </div>
            ) : hasPosted && !isDemo ? (
              <div className="text-center py-4">
                <p className="font-poppins-bold text-[13px] uppercase tracking-[0.2em] text-wedding-accent">{effectiveInviteeName}</p>
                <h3 className="mt-4 font-black text-[38px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent)]">Terima Kasih!</h3>
                <p className="mt-5 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 bg-black/5 p-4 rounded-2xl border border-black/5">{thankYouMessage}</p>
                {existingWish?.message ? (
                  <p className="mt-5 rounded-[24px] bg-wedding-accent-2/10 px-5 py-5 font-poppins text-[15px] leading-relaxed text-wedding-dark/80 whitespace-pre-line border-2 border-wedding-accent-2/20">
                    {existingWish.message}
                  </p>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center bg-black/5 p-4 rounded-3xl border border-black/5">
                  <p className="font-poppins-bold text-[12px] uppercase tracking-[0.2em] text-wedding-accent">Dari</p>
                  <p className="mt-2 font-black text-[22px] text-wedding-dark">{effectiveInviteeName}</p>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[140px] w-full rounded-[32px] border-4 border-white bg-[linear-gradient(135deg,var(--invitation-bg),white)] px-5 py-5 font-poppins font-medium text-[15px] text-wedding-dark outline-none transition-all focus:ring-4 focus:ring-wedding-accent/20 placeholder:text-wedding-dark/40 shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]"
                  placeholder={placeholder}
                  disabled={isSubmitting}
                />

                {error ? (
                  <p className="text-center font-poppins-bold text-[13px] text-wedding-accent bg-wedding-accent/10 py-2 px-4 rounded-xl">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full rounded-full bg-wedding-accent px-6 py-4 font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)] transition-all hover:bg-wedding-accent/90 hover:scale-[1.02] active:scale-[0.98] active:translate-y-[4px] active:shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:translate-y-0 disabled:active:shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)]"
                >
                  {isSubmitting ? "Mengirim ..." : "Kirim Ucapan"}
                </button>
              </form>
            )}
          </motion.div>
        </RevealOnScroll>

        <div className="mt-12 space-y-5">
          {wishes.length === 0 ? (
            <RevealOnScroll direction="up" distance={18} delay={0.22} width="100%" isReady={isReady}>
              <div className="rounded-[36px] border-4 border-white bg-white/80 px-6 py-8 text-center font-poppins font-medium text-[15px] text-wedding-dark/70 backdrop-blur-xl shadow-[0_12px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]">
                Jadi yang pertama mengirim doa dan ucapan seru di sini.
              </div>
            </RevealOnScroll>
          ) : (
            wishes.map((wish, idx) => (
              <RevealOnScroll
                key={wish.id}
                direction="up"
                distance={18}
                delay={0.22 + Math.min(idx, 8) * 0.06}
                width="100%"
                isReady={isReady}
              >
                <motion.div 
                  className="relative rounded-[36px] border-4 border-white bg-white/90 px-6 py-6 shadow-[0_12px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)] backdrop-blur-xl"
                  animate={{ rotate: (idx % 2 === 0 ? [1, -1, 1] : [-1, 1, -1]) }}
                  transition={{ duration: 8 + idx, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-poppins-bold text-[13px] uppercase tracking-[0.2em] text-wedding-accent bg-wedding-accent/10 inline-block px-3 py-1 rounded-lg border border-wedding-accent/20">{wish.name}</p>
                      <p className="mt-3 font-poppins-bold text-[11px] uppercase tracking-[0.2em] text-wedding-dark/40">
                        {wish.createdAt ? formatRelativeToNow(wish.createdAt) || "Baru saja" : "Baru saja"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 whitespace-pre-line">
                    {wish.message}
                  </p>
                </motion.div>
              </RevealOnScroll>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
