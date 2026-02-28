"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  EventDetail,
  Host,
  InvitationConfig,
  InvitationDateTime,
  InvitationDateTimeValue,
} from "@/types/invitation";
import { DateTime } from "luxon";
import { INVITATION_ZONE, parseInvitationDateTime } from "@/lib/date-time";
import {
  getInvitationTemplateThemes,
  INVITATION_TEMPLATE_LISTINGS,
  type InvitationTemplateTheme,
} from "@/data/invitation-templates";
import { RegisterInvitationState, VerifyRegisterPasswordState } from "./actions";
import { useDeferredEffect } from "@/hooks/useDeferredEffect";

type TemplateOption = {
  id: string;
  label: string;
};

type RegisterInvitationFormProps = {
  initialConfig: InvitationConfig;
  templateOptions: TemplateOption[];
  action: (
    prevState: RegisterInvitationState,
    formData: FormData,
  ) => Promise<RegisterInvitationState>;
  verifyPasswordAction: (
    prevState: VerifyRegisterPasswordState,
    formData: FormData,
  ) => Promise<VerifyRegisterPasswordState>;
  initialUnlocked?: boolean;
};

function updateAtPath<T extends object>(obj: T, path: string[], value: unknown): T {
  const next = structuredClone(obj) as unknown as Record<string, unknown>;
  let cursor: Record<string, unknown> = next;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!;

    const existing = cursor[key];
    if (!existing || typeof existing !== "object") {
      cursor[key] = {};
    }

    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[path[path.length - 1]!] = value;
  return next as unknown as T;
}

function asBoolean(value: boolean | undefined): boolean {
  return !!value;
}

function normalizeSlugSegment(value: string): string {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function deriveBaseSlug(purpose: "marriage" | "birthday" | "event", hosts: Host[]): string {
  const hostParts = (hosts ?? [])
    .map((h) => normalizeSlugSegment(h.firstName ?? ""))
    .filter(Boolean);

  const hostSegment = hostParts.length ? hostParts.join("-") : "untitled";
  return `${purpose}-${hostSegment}`;
}

function deriveImagekitFolderKey(
  purpose: "marriage" | "birthday" | "event",
  hosts: Host[],
  unixEpochSeconds: number,
): string {
  const firstHostName = normalizeSlugSegment(hosts?.[0]?.firstName ?? "");
  const hostSegment = firstHostName || "untitled";
  return `${purpose}-${hostSegment}-${unixEpochSeconds}`;
}

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Upload failed.";
}

function validateImageFile(file: File): string | null {
  if (!file.type || !file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }
  if (file.size >= MAX_IMAGE_SIZE_BYTES) {
    return "Image must be smaller than 25MB.";
  }
  return null;
}

async function uploadToImageKit({
  file,
  folderKey,
  fieldKey,
}: {
  file: File;
  folderKey: string;
  fieldKey: string;
}): Promise<string> {
  if (!folderKey) {
    throw new Error("Upload folder is required before uploading images.");
  }

  const authRes = await fetch("/api/imagekit/auth", { method: "GET" });
  if (!authRes.ok) {
    throw new Error("Unauthorized. Please unlock the register page again.");
  }

  const auth = (await authRes.json()) as {
    token: string;
    expire: number;
    signature: string;
    publicKey: string;
  };

  const form = new FormData();
  form.set("file", file);
  form.set("fileName", `${fieldKey}-${Date.now()}-${file.name}`);
  form.set("publicKey", auth.publicKey);
  form.set("signature", auth.signature);
  form.set("token", auth.token);
  form.set("expire", String(auth.expire));
  form.set("folder", `activid web/invitation/${folderKey}`);
  form.set("useUniqueFileName", "true");

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(text || "Upload failed.");
  }

  const uploaded = (await uploadRes.json()) as { url?: string };
  if (!uploaded.url) {
    throw new Error("Upload failed: missing URL.");
  }
  return uploaded.url;
}

function ImageUrlPicker({
  label,
  value,
  onChange,
  folderKey,
  fieldKey,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folderKey: string;
  fieldKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewSrc = localPreview ?? value;

  return (
    <div className="grid gap-2">
      <TextInput label={label} value={value} onChange={onChange} />
      <div className="flex items-center justify-between gap-3">
        <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-indigo-500/60">
          {uploading ? "Uploading..." : "Choose Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;

              const validationError = validateImageFile(file);
              if (validationError) {
                setError(validationError);
                return;
              }

              setError(null);
              setUploading(true);

              const objectUrl = URL.createObjectURL(file);
              setLocalPreview(objectUrl);

              try {
                const url = await uploadToImageKit({ file, folderKey, fieldKey });
                onChange(url);
                setLocalPreview(null);
              } catch (err) {
                setError(getErrorMessage(err));
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>

        {previewSrc && !imgError ? (
          <img
            src={previewSrc}
            alt=""
            className="h-16 w-16 rounded-xl border border-white/10 bg-white/5 object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-16 w-16 rounded-xl border border-white/10 bg-white/5" />
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}

type PendingUpload = {
  id: string;
  previewUrl: string;
  name: string;
  status: "uploading" | "error";
  error?: string;
};

function ImageUrlListPicker({
  label,
  items,
  onChange,
  folderKey,
  fieldKey,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  folderKey: string;
  fieldKey: string;
}) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [pending]);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">{label}</div>
        <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60">
          Add Images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (files.length === 0) return;

              setError(null);

              let nextItems = [...(items ?? [])];

              for (const file of files) {
                const validationError = validateImageFile(file);
                if (validationError) {
                  setError(validationError);
                  continue;
                }

                const id = globalThis.crypto?.randomUUID
                  ? globalThis.crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`;
                const previewUrl = URL.createObjectURL(file);

                setPending((prev) => [...prev, { id, previewUrl, name: file.name, status: "uploading" }]);

                try {
                  const url = await uploadToImageKit({ file, folderKey, fieldKey });
                  nextItems = [...nextItems, url];
                  onChange(nextItems);
                  setPending((prev) => prev.filter((p) => p.id !== id));
                } catch (err) {
                  setPending((prev) =>
                    prev.map((p) =>
                      p.id === id ? { ...p, status: "error", error: getErrorMessage(err) } : p,
                    ),
                  );
                }
              }
            }}
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-2">
        {(items ?? []).map((item, idx) => (
          <div key={`${item}-${idx}`} className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <img
                src={item}
                alt=""
                className="h-16 w-16 rounded-xl border border-white/10 bg-black/20 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <input
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/60"
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
              />
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-red-500/60"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {pending.length ? (
        <div className="grid gap-2">
          {pending.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
            >
              <img
                src={p.previewUrl}
                alt=""
                className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 object-cover"
              />
              <div className="flex-1 text-xs text-white/70">{p.name}</div>
              <div className="text-xs text-white/70">
                {p.status === "uploading" ? "Uploading..." : p.error ?? "Failed"}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const HOST_FIELDS: Array<[keyof Host, string]> = [
  ["firstName", "First Name"],
  ["fullName", "Full Name"],
  ["shortName", "Short Name"],
  ["role", "Role"],
  ["parents", "Parents"],
  ["photo", "Photo URL"],
];

const RSVP_FIELDS: Array<
  [
    "heading" | "description" | "successMessage" | "alreadySubmittedMessage" | "seeYouMessage",
    string,
  ]
> = [
  ["heading", "Heading"],
  ["description", "Description"],
  ["successMessage", "Success Message"],
  ["alreadySubmittedMessage", "Already Submitted Message"],
  ["seeYouMessage", "See You Message"],
];

const EVENT_FIELDS: Array<["title" | "venue" | "address" | "mapUrl", string]> = [
  ["title", "Title"],
  ["venue", "Venue"],
  ["address", "Address"],
  ["mapUrl", "Map URL"],
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function createTodayDateTime(): InvitationDateTime {
  const now = DateTime.now().setZone(INVITATION_ZONE);
  return {
    date: { year: now.year, month: now.month, day: now.day },
    time: { hour: 0, minute: 0 },
  };
}

function isInvitationDateTime(value: unknown): value is InvitationDateTime {
  if (!value || typeof value !== "object") return false;

  const v = value as {
    date?: { year?: unknown; month?: unknown; day?: unknown };
    time?: { hour?: unknown; minute?: unknown };
  };

  return (
    !!v.date &&
    Number.isInteger(v.date.year) &&
    Number.isInteger(v.date.month) &&
    Number.isInteger(v.date.day) &&
    !!v.time &&
    Number.isInteger(v.time.hour) &&
    Number.isInteger(v.time.minute)
  );
}

function tryParseDateStringToDateTime(input: string): InvitationDateTime | null {
  const raw = (input || "").trim();
  if (!raw) return null;

  const normalized = raw.replace(/,/g, " ").replace(/\s+/g, " ").trim();

  const iso = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (year && month && day) {
      return { date: { year, month, day }, time: { hour: 0, minute: 0 } };
    }
  }

  const monthMap: Record<string, number> = {
    january: 1,
    jan: 1,
    januari: 1,
    february: 2,
    feb: 2,
    februari: 2,
    march: 3,
    mar: 3,
    maret: 3,
    april: 4,
    apr: 4,
    may: 5,
    mei: 5,
    june: 6,
    jun: 6,
    juni: 6,
    july: 7,
    jul: 7,
    juli: 7,
    august: 8,
    aug: 8,
    agustus: 8,
    agu: 8,
    ags: 8,
    september: 9,
    sep: 9,
    october: 10,
    oct: 10,
    oktober: 10,
    okt: 10,
    november: 11,
    nov: 11,
    december: 12,
    dec: 12,
    desember: 12,
    des: 12,
  };

  const lower = normalized.toLowerCase();

  const dmy = lower.match(/^(?:[a-z]+\s+)?(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = monthMap[dmy[2]] ?? 0;
    const year = Number(dmy[3]);
    if (year && month && day) {
      return { date: { year, month, day }, time: { hour: 0, minute: 0 } };
    }
  }

  const my = lower.match(/^([a-z]+)\s+(\d{4})$/);
  if (my) {
    const month = monthMap[my[1]] ?? 0;
    const year = Number(my[2]);
    if (year && month) {
      return { date: { year, month, day: 1 }, time: { hour: 0, minute: 0 } };
    }
  }

  const tahun = lower.match(/^tahun\s+(\d{4})$/);
  if (tahun) {
    const year = Number(tahun[1]);
    if (year) {
      return { date: { year, month: 1, day: 1 }, time: { hour: 0, minute: 0 } };
    }
  }

  return null;
}

function coerceInvitationDateTime(value: unknown): InvitationDateTime {
  if (isInvitationDateTime(value)) return value;

  if (value && typeof value === "object") {
    const v = value as { year?: unknown; month?: unknown; day?: unknown };
    if (
      Number.isInteger(v.year) &&
      Number.isInteger(v.month) &&
      Number.isInteger(v.day)
    ) {
      return {
        date: {
          year: v.year as number,
          month: v.month as number,
          day: v.day as number,
        },
        time: { hour: 0, minute: 0 },
      };
    }
  }

  if (typeof value === "string") {
    const dt = parseInvitationDateTime(value);
    if (dt) {
      const zoned = dt.setZone(INVITATION_ZONE);
      return {
        date: { year: zoned.year, month: zoned.month, day: zoned.day },
        time: { hour: zoned.hour, minute: zoned.minute },
      };
    }

    const parsed = tryParseDateStringToDateTime(value);
    if (parsed) return parsed;
  }

  return createTodayDateTime();
}

function toDateInputValue(value: InvitationDateTime) {
  if (!value?.date) return "";
  return `${value.date.year}-${pad2(value.date.month)}-${pad2(value.date.day)}`;
}

function toTimeInputValue(value: InvitationDateTime) {
  if (!value?.time) return "00:00";
  return `${pad2(value.time.hour)}:${pad2(value.time.minute)}`;
}

function withDateFromInput(value: InvitationDateTime, input: string): InvitationDateTime {
  const parts = (input || "").split("-");
  if (parts.length !== 3) return value;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!Number.isInteger(year) || year < 1900) return value;
  if (!Number.isInteger(month) || month < 1 || month > 12) return value;
  if (!Number.isInteger(day) || day < 1 || day > 31) return value;
  const dt = DateTime.fromObject({ year, month, day }, { zone: INVITATION_ZONE });
  if (!dt.isValid) return value;
  return { ...value, date: { year, month, day } };
}

function withTimeFromInput(value: InvitationDateTime, input: string): InvitationDateTime {
  const parts = (input || "").split(":");
  if (parts.length !== 2) return value;
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return value;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return value;
  return { ...value, time: { hour, minute } };
}

function normalizeEventList(raw: InvitationConfig["sections"]["event"]["events"]): EventDetail[] {
  const emptyEvent: EventDetail = {
    title: "",
    date: createTodayDateTime(),
    venue: "",
    address: "",
    mapUrl: "",
  };

  if (Array.isArray(raw)) {
    const list = raw.length ? raw : [emptyEvent];
    return list.map((e) => ({
      ...emptyEvent,
      ...(e as unknown as Partial<EventDetail>),
      date: coerceInvitationDateTime((e as { date?: unknown })?.date),
    })) as EventDetail[];
  }
  if (!raw || typeof raw !== "object") return [emptyEvent];

  const orderedKeys = ["holyMatrimony", "reception"];
  const record = raw as Record<string, EventDetail>;
  const prioritized = orderedKeys.map((key) => record[key]).filter(Boolean);
  const rest = Object.entries(record)
    .filter(([key]) => !orderedKeys.includes(key))
    .map(([, value]) => value)
    .filter(Boolean);
  const list = [...prioritized, ...rest];
  const ensured = list.length ? list : [emptyEvent];
  return ensured.map((e) => ({
    ...emptyEvent,
    ...(e as unknown as Partial<EventDetail>),
    date: coerceInvitationDateTime((e as { date?: unknown })?.date),
  })) as EventDetail[];
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className={`rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60 ${
          readOnly ? "cursor-default" : ""
        }`}
        value={value}
        type={type}
        readOnly={readOnly}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
      />
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: InvitationDateTimeValue;
  onChange: (value: InvitationDateTime) => void;
}) {
  const normalized = coerceInvitationDateTime(value);
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toDateInputValue(normalized)}
        type="date"
        onChange={(e) => onChange(withDateFromInput(normalized, e.target.value))}
      />
    </label>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: InvitationDateTimeValue;
  onChange: (value: InvitationDateTime) => void;
}) {
  const normalized = coerceInvitationDateTime(value);
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toTimeInputValue(normalized)}
        type="time"
        onChange={(e) => onChange(withTimeFromInput(normalized, e.target.value))}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <textarea
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group inline-flex items-center gap-2.5 text-sm text-white/80 select-none cursor-pointer">
      <span className="relative grid h-5 w-5 place-items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-md border border-white/20 bg-white/5 shadow-[0_1px_0_rgba(255,255,255,0.06)] transition-colors peer-checked:border-indigo-400/60 peer-checked:bg-indigo-500/20 group-hover:border-white/30 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/60"
        />
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="relative z-10 h-3.5 w-3.5 text-indigo-100 opacity-0 scale-90 transition-all peer-checked:opacity-100 peer-checked:scale-100"
        >
          <path
            d="M16.667 5.833 8.333 14.167 4.167 10"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-none">{label}</span>
    </label>
  );
}

function SectionCard({
  title,
  enabled,
  onEnabledChange,
  children,
}: {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const effectiveOpen = enabled && open;

  return (
    <details
      open={effectiveOpen}
      className="group rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-5 shadow-[0_0_30px_-10px_rgba(34,211,238,0.05)] transition-all overflow-hidden relative"
      onToggle={(e) => {
        if (!enabled) return;
        setOpen((e.currentTarget as HTMLDetailsElement).open);
      }}
    >
      <summary
        className={`cursor-pointer text-lg font-black tracking-tight text-white flex items-center justify-between gap-3 list-none ${
          enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70"
        }`}
        onClick={(e) => {
          if (!enabled) e.preventDefault();
        }}
      >
        <span>{title}</span>
        <span className="flex items-center gap-3">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
              enabled
                ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-100 hover:bg-indigo-500/20"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const nextEnabled = !enabled;
              if (!nextEnabled) {
                setOpen(false);
              }
              onEnabledChange(nextEnabled);
            }}
            role="switch"
            aria-checked={enabled}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${enabled ? "bg-emerald-400" : "bg-white/25"}`}
            />
            Enabled
          </button>
          <span className="text-white/40 group-open:rotate-180 transition-transform duration-300">▼</span>
        </span>
      </summary>

      <div className="mt-6 grid gap-6 relative z-10">{children}</div>
    </details>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">{label}</div>
        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60"
          onClick={() => onChange([...(items ?? []), ""])}
        >
          Add
        </button>
      </div>
      <div className="grid gap-2">
        {(items ?? []).map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-red-500/60"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegisterInvitationForm({
  initialConfig,
  templateOptions,
  action,
  verifyPasswordAction,
  initialUnlocked,
}: RegisterInvitationFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [verifyState, verifyAction, verifying] = useActionState(verifyPasswordAction, {});

  const isUnlocked = Boolean(initialUnlocked || verifyState.ok);

  const [slug, setSlug] = useState("");
  const [templateId, setTemplateId] = useState(templateOptions[0]?.id ?? "flow");
  const initialTheme = useMemo(() => getInvitationTemplateThemes(templateId)[0], [templateId]);
  const [themeId, setThemeId] = useState(() => initialTheme?.id ?? "");
  const [password, setPassword] = useState("");
  const initialPurpose = initialConfig.purpose ?? "marriage";
  const imagekitEpochSecondsRef = useRef<number>(0);
  const [purpose, setPurpose] = useState<"marriage" | "birthday" | "event">(initialPurpose);
  const [config, setConfig] = useState<InvitationConfig>(() => ({
    ...initialConfig,
    id: "",
    imagekitFolderKey:
      initialConfig.imagekitFolderKey
      ?? deriveImagekitFolderKey(initialPurpose, initialConfig.hosts ?? [], 0),
    templateId: templateId,
    theme: initialTheme
      ? { mainColor: initialTheme.mainColor, accentColor: initialTheme.accentColor }
      : initialConfig.theme,
    purpose: initialPurpose,
    sections: {
      ...initialConfig.sections,
      story: {
        ...initialConfig.sections.story,
        stories: (initialConfig.sections.story.stories ?? []).map((s) => ({
          ...s,
          date: coerceInvitationDateTime((s as { date?: unknown }).date),
        })),
      },
      event: {
        ...initialConfig.sections.event,
        events: normalizeEventList(initialConfig.sections.event.events),
      },
    },
  }));

  function setHosts(nextHosts: Host[]) {
    setConfig((prev) => ({
      ...prev,
      hosts: nextHosts,
    }));
  }

  useDeferredEffect(() => {
    const nextSlug = deriveBaseSlug(purpose, config.hosts ?? []);
    setSlug((prev) => (prev === nextSlug ? prev : nextSlug));
    setConfig((prev) => (prev.id === nextSlug ? prev : { ...prev, id: nextSlug }));
  }, [config.hosts, purpose]);
  const hasImageUploads = Boolean(config.sections?.hero?.coverImage)
    || Boolean((config.hosts ?? []).some((h) => Boolean(h.photo)))
    || Boolean((config.sections?.gallery?.photos ?? []).length);

  useDeferredEffect(() => {
    if (hasImageUploads) return;
    if (!imagekitEpochSecondsRef.current) {
      imagekitEpochSecondsRef.current = Math.floor(Date.now() / 1000);
    }

    const nextFolderKey = deriveImagekitFolderKey(
      purpose,
      config.hosts ?? [],
      imagekitEpochSecondsRef.current,
    );

    setConfig((prev) =>
      prev.imagekitFolderKey === nextFolderKey ? prev : { ...prev, imagekitFolderKey: nextFolderKey },
    );
  }, [config.hosts, hasImageUploads, purpose]);

  const handleTemplateChange = (nextTemplateId: string) => {
    const nextTheme = getInvitationTemplateThemes(nextTemplateId)[0];
    setTemplateId(nextTemplateId);
    setThemeId(nextTheme?.id ?? "");
    setConfig((prev) => ({
      ...prev,
      templateId: nextTemplateId,
      theme: nextTheme
        ? { mainColor: nextTheme.mainColor, accentColor: nextTheme.accentColor }
        : prev.theme,
    }));
  };

  const templateThemes = useMemo(() => getInvitationTemplateThemes(templateId), [templateId]);

  const handleThemeChange = (nextTheme: InvitationTemplateTheme) => {
    setThemeId(nextTheme.id);
    setConfig((prev) => ({
      ...prev,
      theme: {
        mainColor: nextTheme.mainColor,
        accentColor: nextTheme.accentColor,
      },
    }));
  };

  const handlePurposeChange = (nextPurpose: "marriage" | "birthday" | "event") => {
    setPurpose(nextPurpose);
    setConfig((prev) => ({
      ...prev,
      purpose: nextPurpose,
    }));
  };

  const templateListingByTemplateId = useMemo(() => {
    return new Map(INVITATION_TEMPLATE_LISTINGS.map((t) => [t.templateId, t] as const));
  }, []);

  const templateCards = useMemo(() => {
    return templateOptions.map((opt) => {
      const listing = templateListingByTemplateId.get(opt.id);

      return {
        id: opt.id,
        label: opt.label,
        image: listing?.image ?? "",
        priceDiscount: listing?.priceDiscount ?? "",
      };
    });
  }, [templateListingByTemplateId, templateOptions]);

  const templateScrollerRef = useRef<HTMLDivElement | null>(null);
  const templateCounterRafRef = useRef<number | null>(null);
  const templateDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startClientX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startClientX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const templateIgnoreClickRef = useRef(false);
  const [templateDragging, setTemplateDragging] = useState(false);
  const [templateDisplayedIndex, setTemplateDisplayedIndex] = useState(1);

  const themeScrollerRef = useRef<HTMLDivElement | null>(null);
  const themeCounterRafRef = useRef<number | null>(null);
  const themeDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startClientX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startClientX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const themeIgnoreClickRef = useRef(false);
  const [themeDragging, setThemeDragging] = useState(false);
  const [themeDisplayedIndex, setThemeDisplayedIndex] = useState(1);

  const getDisplayedIndexFromScroller = (el: HTMLDivElement): number => {
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return 1;

    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    return bestIdx + 1;
  };

  const updateTemplateDisplayedIndex = () => {
    const el = templateScrollerRef.current;
    if (!el) return;
    setTemplateDisplayedIndex(getDisplayedIndexFromScroller(el));
  };

  const updateThemeDisplayedIndex = () => {
    const el = themeScrollerRef.current;
    if (!el) return;
    setThemeDisplayedIndex(getDisplayedIndexFromScroller(el));
  };

  const handleTemplateScrollerScroll = () => {
    if (templateCounterRafRef.current != null) return;
    templateCounterRafRef.current = window.requestAnimationFrame(() => {
      templateCounterRafRef.current = null;
      updateTemplateDisplayedIndex();
    });
  };

  const handleThemeScrollerScroll = () => {
    if (themeCounterRafRef.current != null) return;
    themeCounterRafRef.current = window.requestAnimationFrame(() => {
      themeCounterRafRef.current = null;
      updateThemeDisplayedIndex();
    });
  };

  useEffect(() => {
    updateTemplateDisplayedIndex();
    return () => {
      if (templateCounterRafRef.current != null) {
        window.cancelAnimationFrame(templateCounterRafRef.current);
        templateCounterRafRef.current = null;
      }
    };
  }, [templateCards.length]);

  useDeferredEffect(() => {
    setThemeDisplayedIndex(1);
    const el = themeScrollerRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
    updateThemeDisplayedIndex();

    return () => {
      if (themeCounterRafRef.current != null) {
        window.cancelAnimationFrame(themeCounterRafRef.current);
        themeCounterRafRef.current = null;
      }
    };
  }, [templateThemes.length]);

  const templatePosition = {
    current: Math.min(Math.max(templateDisplayedIndex, 1), templateCards.length || 1),
    total: templateCards.length,
  };

  const themePosition = {
    current: Math.min(Math.max(themeDisplayedIndex, 1), templateThemes.length || 1),
    total: templateThemes.length,
  };

  const handleThemeScrollerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = themeScrollerRef.current;
    if (!el) return;

    themeDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setThemeDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const handleThemeScrollerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = themeScrollerRef.current;
    const drag = themeDragRef.current;
    if (!el || !drag.active) return;

    const deltaX = e.clientX - drag.startClientX;
    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
    }
    el.scrollLeft = drag.startScrollLeft - deltaX;
    if (drag.moved) {
      e.preventDefault();
    }
  };

  const handleThemeScrollerPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = themeScrollerRef.current;
    const drag = themeDragRef.current;
    if (!el || !drag.active) return;

    themeIgnoreClickRef.current = drag.moved;
    if (drag.moved) {
      window.setTimeout(() => {
        themeIgnoreClickRef.current = false;
      }, 0);
    }
    if (drag.pointerId !== null && el.hasPointerCapture(drag.pointerId)) {
      el.releasePointerCapture(drag.pointerId);
    }
    themeDragRef.current.active = false;
    themeDragRef.current.pointerId = null;
    setThemeDragging(false);
  };

  const handleTemplateScrollerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = templateScrollerRef.current;
    if (!el) return;

    templateDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setTemplateDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const handleTemplateScrollerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = templateScrollerRef.current;
    const drag = templateDragRef.current;
    if (!el || !drag.active) return;

    const deltaX = e.clientX - drag.startClientX;
    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
    }
    el.scrollLeft = drag.startScrollLeft - deltaX;
    if (drag.moved) {
      e.preventDefault();
    }
  };

  const handleTemplateScrollerPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = templateScrollerRef.current;
    const drag = templateDragRef.current;
    if (!el || !drag.active) return;

    templateIgnoreClickRef.current = drag.moved;
    if (drag.moved) {
      window.setTimeout(() => {
        templateIgnoreClickRef.current = false;
      }, 0);
    }
    if (drag.pointerId !== null && el.hasPointerCapture(drag.pointerId)) {
      el.releasePointerCapture(drag.pointerId);
    }
    templateDragRef.current.active = false;
    templateDragRef.current.pointerId = null;
    setTemplateDragging(false);
  };

  const configJson = useMemo(() => JSON.stringify(config), [config]);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [confirmedSubmit, setConfirmedSubmit] = useState(false);
  const confirmedSubmitRef = useRef(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useDeferredEffect(() => {
    if (!pending) {
      setConfirmedSubmit(false);
      confirmedSubmitRef.current = false;
    }
  }, [pending]);

  const templateLabel = useMemo(() => {
    const found = templateCards.find((c) => c.id === templateId);
    return found?.label ?? templateId;
  }, [templateCards, templateId]);

  const themeLabel = useMemo(() => {
    const found = templateThemes.find((t) => t.id === themeId);
    return found?.title ?? themeId;
  }, [templateThemes, themeId]);

  const hostLabel = useMemo(() => {
    const hosts = config.hosts ?? [];
    const primary = hosts[0]?.firstName || hosts[0]?.fullName || "";
    const secondary = hosts[1]?.firstName || hosts[1]?.fullName || "";
    if (primary && secondary) return `${primary} & ${secondary}`;
    return primary || secondary || "";
  }, [config.hosts]);

  const firstEventSummary = useMemo(() => {
    const eventsRaw = config.sections?.event?.events as unknown;
    const list = normalizeEventList(eventsRaw as InvitationConfig["sections"]["event"]["events"]);
    const first = list[0];
    if (!first) return null;

    const dt = coerceInvitationDateTime((first as { date?: unknown }).date);
    const dateText = dt?.date
      ? `${dt.date.year}-${pad2(dt.date.month)}-${pad2(dt.date.day)}`
      : "";
    const timeText = dt?.time ? `${pad2(dt.time.hour)}:${pad2(dt.time.minute)}` : "";
    const title = (first as { title?: string } | null)?.title ?? "";
    const venue = (first as { venue?: string } | null)?.venue ?? "";

    return {
      title,
      venue,
      dateText,
      timeText,
    };
  }, [config.sections?.event?.events]);

  const validateBeforeReview = (): string | null => {
    if (!templateId) return "Ship Template is required.";
    const hosts = config.hosts ?? [];
    const hasHostName = Boolean(
      (hosts[0]?.firstName || hosts[0]?.fullName || "").trim()
        || (hosts[1]?.firstName || hosts[1]?.fullName || "").trim(),
    );
    if (!hosts.length || !hasHostName) return "At least 1 host name is required.";

    const eventsRaw = config.sections?.event?.events as unknown;
    const list = normalizeEventList(eventsRaw as InvitationConfig["sections"]["event"]["events"]);
    if (!list.length) return "At least 1 event is required.";

    const first = list[0] as { date?: unknown };
    const dt = coerceInvitationDateTime(first?.date);
    if (!dt?.date?.year) return "First event date is required.";

    return null;
  };

  const invitationUrl = state.invitationUrl ?? (state.slug ? `https://invitation.activid.id/${state.slug}` : "");
  const whatsappMessages = useMemo(() => {
    if (!state.ok || !invitationUrl) return [];
    const who = hostLabel || "kami";
    return [
      {
        key: "formal",
        title: "Formal",
        text: `Assalamu'alaikum / Salam sejahtera.\n\nDengan hormat, kami ${who} mengundang Anda untuk hadir dan menyaksikan momen spesial kami.\n\nSilakan akses undangan digital melalui tautan berikut:\n${invitationUrl}\n\nTerima kasih.`,
      },
      {
        key: "warm",
        title: "Hangat",
        text: `Halo!\n\nKami ${who} punya kabar bahagia. Kami ingin mengundang kamu untuk ikut merayakan bersama.\n\nDetail lengkap ada di link ini ya:\n${invitationUrl}\n\nSampai ketemu!`,
      },
      {
        key: "short",
        title: "Singkat",
        text: `Undangan dari ${who}:\n${invitationUrl}`,
      },
    ];
  }, [hostLabel, invitationUrl, state.ok]);

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1200);
    } catch {
      setCopiedKey(null);
    }
  };

  if (!isUnlocked) {
    return (
      <form action={verifyAction} className="grid gap-6">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-xl font-black tracking-tight bg-linear-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent relative z-10">
            Command Station Access
          </div>

          {verifyState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 relative z-10">
              {verifyState.error}
            </div>
          ) : null}

          <div className="relative z-10">
            <TextInput label="Access Password" value={password} type="password" onChange={setPassword} />
          </div>
          <input type="hidden" name="password" value={password} />

          <button
            type="submit"
            disabled={verifying}
            className="mt-2 relative z-10 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-400/40 px-6 py-3 text-sm font-black uppercase tracking-wider text-indigo-100 hover:bg-indigo-500/30 hover:border-indigo-300/70 transition-all disabled:opacity-60 disabled:hover:bg-indigo-500/20 disabled:hover:border-indigo-400/40"
          >
            {verifying ? "Verifying..." : "Unlock Access"}
          </button>
        </div>
      </form>
    );
  }

  if (state.ok && state.slug && invitationUrl) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-5 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />
          <div className="text-xl font-black tracking-tight bg-linear-to-r from-emerald-200 via-white to-emerald-200 bg-clip-text text-transparent relative z-10 flex items-center gap-3">
            <span className="text-xl">✅</span> Mission Created
          </div>

          <div className="grid gap-3 relative z-10">
            <div className="rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-4">
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Mission Code</div>
              <div className="mt-1 text-lg font-black tracking-tight text-white">{state.slug}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-4">
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Invitation Link</div>
              <div className="mt-1 break-all text-sm font-mono text-white/80">{invitationUrl}</div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:border-emerald-400/60"
                  onClick={() => void copyText("link", invitationUrl)}
                >
                  {copiedKey === "link" ? "Copied" : "Copy Link"}
                </button>
                <a
                  href={invitationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500/30 via-green-500/25 to-cyan-500/25 border border-emerald-400/40 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-100 hover:border-emerald-300/70"
                >
                  Open Invitation
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:border-indigo-400/60"
                  onClick={() => window.location.reload()}
                >
                  New Mission
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="text-sm font-black tracking-tight text-white/90">WhatsApp Messages</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {whatsappMessages.map((m) => {
              const waUrl = `https://wa.me/?text=${encodeURIComponent(m.text)}`;
              return (
                <div
                  key={m.key}
                  className="grid gap-3 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 shadow-[0_0_30px_-12px_rgba(34,211,238,0.25)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase tracking-wider text-white/80">{m.title}</div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:border-emerald-400/60"
                      onClick={() => void copyText(m.key, m.text)}
                    >
                      {copiedKey === m.key ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-3 text-[12px] leading-relaxed text-white/80 font-mono">
                    {m.text}
                  </pre>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/10 border border-green-500/40 px-4 py-2 text-xs font-black uppercase tracking-wider text-green-100 hover:bg-green-500/20 hover:border-green-400/70"
                  >
                    Open WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-6"
      onSubmit={(e) => {
        if (confirmedSubmitRef.current || confirmedSubmit) return;
        e.preventDefault();
        const err = validateBeforeReview();
        setClientError(err);
        if (!err) setReviewOpen(true);
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="configJson" value={configJson} />

      <div className="grid gap-5 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />
        
        <div className="text-xl font-black tracking-tight bg-linear-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent relative z-10 flex items-center gap-3">
          <span className="text-xl">🚀</span> Create New Mission
        </div>

        {state.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 relative z-10">
            {state.error}
          </div>
        ) : null}

        {clientError ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 relative z-10">
            {clientError}
          </div>
        ) : null}

        <div className="grid gap-4 relative z-10 sm:grid-cols-2">
          <TextInput
            label="Mission Code (slug/document id)"
            value={slug}
            onChange={() => {}}
            readOnly
          />

          <div className="grid gap-2 text-sm sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-indigo-200/70 font-medium tracking-wide">Ship Template</span>
              <span className="text-[11px] font-mono text-white/40">
                {templatePosition.current}/{templatePosition.total}
              </span>
            </div>
            <div
              ref={templateScrollerRef}
              className={`-mx-1 px-1 flex gap-3 overflow-x-auto pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                templateDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "pan-y" }}
              onScroll={handleTemplateScrollerScroll}
              onPointerDown={handleTemplateScrollerPointerDown}
              onPointerMove={handleTemplateScrollerPointerMove}
              onPointerUp={handleTemplateScrollerPointerEnd}
              onPointerCancel={handleTemplateScrollerPointerEnd}
              onPointerLeave={handleTemplateScrollerPointerEnd}
            >
              {templateCards.map((card) => {
                const selected = card.id === templateId;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`shrink-0 w-36 rounded-2xl border bg-[#0b0b16]/70 overflow-hidden text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                      selected
                        ? "border-indigo-400/70 shadow-[0_0_20px_-8px_rgba(99,102,241,0.5)]"
                        : "border-white/10 hover:border-indigo-500/50"
                    }`}
                    onClick={() => {
                      if (templateIgnoreClickRef.current) {
                        templateIgnoreClickRef.current = false;
                        return;
                      }
                      handleTemplateChange(card.id);
                    }}
                    aria-pressed={selected}
                  >
                    <div className="relative aspect-[4/5] bg-black/20">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.label}
                          className="h-full w-full object-cover grayscale-[0.6]"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/5" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#020205]/70 via-black/10 to-transparent" />
                      {selected ? (
                        <div className="absolute top-2 right-2 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                          Selected
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-1 p-2">
                      <div className="text-sm font-black tracking-tight text-white">{card.label}</div>
                      <div className="text-sm font-black tracking-tight text-white/90">
                        {card.priceDiscount || "-"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-indigo-200/70 font-medium tracking-wide">Color Combination</span>
              <span className="text-[11px] font-mono text-white/40">
                {themePosition.current}/{themePosition.total}
              </span>
            </div>
            <div
              ref={themeScrollerRef}
              className={`-mx-1 px-1 flex gap-3 overflow-x-auto pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                themeDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "pan-y" }}
              onScroll={handleThemeScrollerScroll}
              onPointerDown={handleThemeScrollerPointerDown}
              onPointerMove={handleThemeScrollerPointerMove}
              onPointerUp={handleThemeScrollerPointerEnd}
              onPointerCancel={handleThemeScrollerPointerEnd}
              onPointerLeave={handleThemeScrollerPointerEnd}
            >
              {templateThemes.map((theme) => {
                const selected = theme.id === themeId;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`shrink-0 min-w-[11rem] rounded-2xl border bg-[#0b0b16]/70 px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                      selected
                        ? "border-indigo-400/70 shadow-[0_0_20px_-8px_rgba(99,102,241,0.5)]"
                        : "border-white/10 hover:border-indigo-500/50"
                    }`}
                    onClick={() => {
                      if (themeIgnoreClickRef.current) {
                        themeIgnoreClickRef.current = false;
                        return;
                      }
                      handleThemeChange(theme);
                    }}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex shrink-0 items-center overflow-hidden rounded-full border border-white/15">
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.mainColor }}
                        />
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black tracking-tight text-white">
                          {theme.title}
                        </span>
                      </span>

                      {selected ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[13px] font-black text-indigo-200">
                          ✓
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="text-indigo-200/70 font-medium tracking-wide">Mission Purpose</span>
            <select
              name="purpose"
              className="rounded-xl border border-white/10 bg-[#0b0b16]/80 px-3 py-2 text-white outline-none focus:border-indigo-500/60 transition-colors"
              value={purpose}
              onChange={(e) =>
                handlePurposeChange(e.target.value as "marriage" | "birthday" | "event")
              }
            >
              <option value="marriage">Marriage</option>
              <option value="birthday">Birthday</option>
              <option value="event">Other Event</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-5 shadow-inner relative z-10">
          <div className="text-sm font-black text-indigo-100 uppercase tracking-wide">
            Audio Transmission (Music)
          </div>
          <div className="grid gap-4">
            <TextInput
              label="Title (optional)"
              value={config.music.title ?? ""}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["music", "title"], v))}
            />
            <TextInput
              label="Audio URL"
              value={config.music.url}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["music", "url"], v))}
            />
            <div className="flex gap-6">
              <Checkbox
                label="Auto Play"
                checked={asBoolean(config.music.autoPlay)}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["music", "autoPlay"], v))}
              />
              <Checkbox
                label="Loop"
                checked={asBoolean(config.music.loop)}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["music", "loop"], v))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 relative z-10">
          <SectionCard
            title="👋 Greeting / Quote (Hero)"
            enabled={asBoolean(config.sections.hero.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "hero", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "hero", "subtitle"], "");
                  next = updateAtPath(next, ["sections", "hero", "coverImage"], "");
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextArea
                label="Subtitle (Greeting)"
                value={config.sections.hero.subtitle}
                onChange={(v) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "hero", "subtitle"], v))
                }
              />
              <ImageUrlPicker
                label="Cover Image"
                value={config.sections.hero.coverImage}
                folderKey={config.imagekitFolderKey ?? ""}
                fieldKey="hero-cover"
                onChange={(v) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "hero", "coverImage"], v))
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="🏷️ Main Title"
            enabled={asBoolean(config.sections.title.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "title", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "title", "heading"], "");
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.title.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "title", "heading"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="⏳ Countdown"
            enabled={asBoolean(config.sections.countdown.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "countdown", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "countdown", "heading"], "");
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.countdown.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "countdown", "heading"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="💬 Quote"
            enabled={asBoolean(config.sections.quote.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "quote", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "quote", "text"], "");
                  next = updateAtPath(next, ["sections", "quote", "author"], "");
                }
                return next;
              })
            }
          >
            <TextArea
              label="Quote Text"
              value={config.sections.quote.text}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "quote", "text"], v))}
              rows={3}
            />
            <TextInput
              label="Author / Source"
              value={config.sections.quote.author}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "quote", "author"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="🧑‍🤝‍🧑 Hosts"
            enabled={asBoolean(config.sections.hosts.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => updateAtPath(prev, ["sections", "hosts", "enabled"], v))
            }
          >
            <Checkbox
              label="Disable Grayscale Effect"
              checked={asBoolean(config.sections.hosts.disableGrayscale)}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(
                    prev,
                    ["sections", "hosts", "disableGrayscale"],
                    v,
                  ),
                )
              }
            />

            {(config.hosts ?? []).map((host, idx) => (
              <div
                key={idx}
                className="grid gap-5 rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-5 shadow-inner relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40 rounded-l-2xl" />
                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">
                    {`Host ${idx + 1}`}
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    disabled={(config.hosts?.length ?? 0) <= 1}
                    onClick={() => {
                      const next = (config.hosts ?? []).filter((_, i) => i !== idx);
                      setHosts(next.length ? next : [host]);
                    }}
                  >
                    Remove Host
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {HOST_FIELDS.map(([key, label]) =>
                    key === "photo" ? (
                      <div key={key} className="sm:col-span-2">
                        <ImageUrlPicker
                          label={label}
                          value={host.photo}
                          folderKey={config.imagekitFolderKey ?? ""}
                          fieldKey={`host-${idx}-photo`}
                          onChange={(v) => {
                            const next = [...(config.hosts ?? [])];
                            next[idx] = { ...next[idx]!, photo: v };
                            setHosts(next);
                          }}
                        />
                      </div>
                    ) : (
                      <TextInput
                        key={key}
                        label={label}
                        value={host[key]}
                        onChange={(v) => {
                          const next = [...(config.hosts ?? [])];
                          next[idx] = { ...next[idx]!, [key]: v };
                          setHosts(next);
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                const emptyHost: Host = {
                  firstName: "",
                  fullName: "",
                  shortName: "",
                  role: "",
                  parents: "",
                  photo: "",
                };
                setHosts([...(config.hosts ?? []), emptyHost]);
              }}
            >
              + Add Host
            </button>
          </SectionCard>

          <SectionCard
            title="📖 Journey (Story)"
            enabled={asBoolean(config.sections.story.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "story", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "story", "heading"], "");
                  next = updateAtPath(next, ["sections", "story", "stories"], []);
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.story.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "story", "heading"], v))
              }
            />

            <div className="grid gap-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-indigo-100">Story List</div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60 transition-colors"
                  onClick={() =>
                    setConfig((prev) =>
                      updateAtPath(prev, ["sections", "story", "stories"], [
                        ...prev.sections.story.stories,
                        { date: createTodayDateTime(), description: "" },
                      ]),
                    )
                  }
                >
                  + Add
                </button>
              </div>

              <div className="grid gap-4 mt-2">
                {config.sections.story.stories.map((story, idx) => (
                  <div
                    key={idx}
                    className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-5 shadow-inner"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">Story {idx + 1}</div>
                      <button
                        type="button"
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors"
                        onClick={() => {
                          const nextStories = config.sections.story.stories.filter((_, i) => i !== idx);
                          setConfig((prev) =>
                            updateAtPath(prev, ["sections", "story", "stories"], nextStories),
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <DateInput
                      label="Date"
                      value={story.date}
                      onChange={(v) => {
                        const nextStories = [...config.sections.story.stories];
                        nextStories[idx] = {
                          ...nextStories[idx],
                          date: { ...v, time: { hour: 0, minute: 0 } },
                        };
                        setConfig((prev) => updateAtPath(prev, ["sections", "story", "stories"], nextStories));
                      }}
                    />
                    <TextArea
                      label="Description"
                      value={story.description}
                      onChange={(v) => {
                        const nextStories = [...config.sections.story.stories];
                        nextStories[idx] = { ...nextStories[idx], description: v };
                        setConfig((prev) => updateAtPath(prev, ["sections", "story", "stories"], nextStories));
                      }}
                      rows={3}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput
                        label="Story Title (optional)"
                        value={story.title ?? ""}
                        onChange={(v) => {
                          const nextStories = [...config.sections.story.stories];
                          nextStories[idx] = { ...nextStories[idx], title: v };
                          setConfig((prev) => updateAtPath(prev, ["sections", "story", "stories"], nextStories));
                        }}
                      />
                      <TextInput
                        label="Image URL (optional)"
                        value={story.imageUrl ?? ""}
                        onChange={(v) => {
                          const nextStories = [...config.sections.story.stories];
                          nextStories[idx] = { ...nextStories[idx], imageUrl: v };
                          setConfig((prev) => updateAtPath(prev, ["sections", "story", "stories"], nextStories));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="📅 Event Schedule (Event Section)"
            enabled={asBoolean(config.sections.event.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "event", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "event", "heading"], "");
                  next = updateAtPath(next, ["sections", "event", "events"], []);
                }
                return next;
              })
            }
          >
            <div className="grid gap-6 mt-2">
              <TextInput
                label="Title"
                value={config.sections.event.heading}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "event", "heading"], v))}
              />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-indigo-100">Event List</div>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60 transition-colors"
                    onClick={() => {
                      const nextEvents = [
                        ...(config.sections.event.events as EventDetail[]),
                        {
                          title: "",
                          date: createTodayDateTime(),
                          venue: "",
                          address: "",
                          mapUrl: "",
                        },
                      ];
                      setConfig((prev) =>
                        updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                      );
                    }}
                  >
                    + Add
                  </button>
                </div>

                <div className="grid gap-4">
                  {(config.sections.event.events as EventDetail[]).map((event, idx) => (
                    <div
                      key={idx}
                      className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-5 shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">Event {idx + 1}</div>
                        <button
                          type="button"
                          disabled={(config.sections.event.events as EventDetail[]).length <= 1}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          onClick={() => {
                            const nextEvents = (config.sections.event.events as EventDetail[]).filter(
                              (_, i) => i !== idx,
                            );
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                            );
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {EVENT_FIELDS.map(([field, fieldLabel]) => (
                          <div key={field} className={field === "address" || field === "mapUrl" ? "sm:col-span-2" : ""}>
                            <TextInput
                              label={fieldLabel}
                              value={event[field]}
                              onChange={(v) => {
                                const nextEvents = [...(config.sections.event.events as EventDetail[])];
                                nextEvents[idx] = { ...nextEvents[idx]!, [field]: v };
                                setConfig((prev) =>
                                  updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                                );
                              }}
                            />
                          </div>
                        ))}

                        <DateInput
                          label="Date"
                          value={event.date}
                          onChange={(v) => {
                            const nextEvents = [...(config.sections.event.events as EventDetail[])];
                            nextEvents[idx] = { ...nextEvents[idx]!, date: v };
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                            );
                          }}
                        />

                        <TimeInput
                          label="Time"
                          value={event.date}
                          onChange={(v) => {
                            const nextEvents = [...(config.sections.event.events as EventDetail[])];
                            nextEvents[idx] = { ...nextEvents[idx]!, date: v };
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="🖼️ Visual Gallery"
            enabled={asBoolean(config.sections.gallery.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "gallery", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "gallery", "heading"], "");
                  next = updateAtPath(next, ["sections", "gallery", "photos"], []);
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextInput
                label="Title"
                value={config.sections.gallery.heading}
                onChange={(v) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "gallery", "heading"], v))
                }
              />
              <ImageUrlListPicker
                label="Gallery Photos"
                items={config.sections.gallery.photos}
                folderKey={config.imagekitFolderKey ?? ""}
                fieldKey="gallery-photo"
                onChange={(items) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "gallery", "photos"], items))
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="RSVP (Confirmation)"
            enabled={asBoolean(config.sections.rsvp.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "rsvp", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "rsvp", "heading"], "");
                  next = updateAtPath(next, ["sections", "rsvp", "description"], "");
                  next = updateAtPath(next, ["sections", "rsvp", "successMessage"], "");
                  next = updateAtPath(next, ["sections", "rsvp", "alreadySubmittedMessage"], "");
                  next = updateAtPath(next, ["sections", "rsvp", "seeYouMessage"], "");
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              {RSVP_FIELDS.map(([field, label]) => (
                <TextArea
                  key={field}
                  label={label}
                  value={config.sections.rsvp[field]}
                  onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "rsvp", field], v))}
                  rows={2}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="🎁 Gift / Angpao"
            enabled={asBoolean(config.sections.gift.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "gift", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "gift", "heading"], "");
                  next = updateAtPath(next, ["sections", "gift", "description"], "");
                  next = updateAtPath(next, ["sections", "gift", "bankAccounts"], []);
                }
                return next;
              })
            }
          >
            <div className="grid gap-6 mt-2">
              <TextInput
                label="Title"
                value={config.sections.gift.heading}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "gift", "heading"], v))}
              />
              <TextArea
                label="Description"
                value={config.sections.gift.description}
                onChange={(v) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "gift", "description"], v))
                }
                rows={2}
              />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-indigo-100">Bank Accounts / E-Wallet</div>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60 transition-colors"
                    onClick={() => {
                      const nextAccounts = [
                        ...config.sections.gift.bankAccounts,
                        { bankName: "", accountNumber: "", accountHolder: "" },
                      ];
                      setConfig((prev) => updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts));
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div className="grid gap-4">
                  {config.sections.gift.bankAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-5 shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">Account {idx + 1}</div>
                        <button
                          type="button"
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors"
                          onClick={() => {
                            const nextAccounts = config.sections.gift.bankAccounts.filter((_, i) => i !== idx);
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts),
                            );
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput
                          label="Bank / Platform Name"
                          value={acc.bankName}
                          onChange={(v) => {
                            const nextAccounts = [...config.sections.gift.bankAccounts];
                            nextAccounts[idx] = { ...nextAccounts[idx], bankName: v };
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts),
                            );
                          }}
                        />
                        <TextInput
                          label="Account Number"
                          value={acc.accountNumber}
                          onChange={(v) => {
                            const nextAccounts = [...config.sections.gift.bankAccounts];
                            nextAccounts[idx] = { ...nextAccounts[idx], accountNumber: v };
                            setConfig((prev) =>
                              updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts),
                            );
                          }}
                        />
                        <div className="sm:col-span-2">
                          <TextInput
                            label="Account Holder Name"
                            value={acc.accountHolder}
                            onChange={(v) => {
                              const nextAccounts = [...config.sections.gift.bankAccounts];
                              nextAccounts[idx] = { ...nextAccounts[idx], accountHolder: v };
                              setConfig((prev) =>
                                updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts),
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="📝 Guestbook / Wishes"
            enabled={asBoolean(config.sections.wishes.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "wishes", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "wishes", "heading"], "");
                  next = updateAtPath(next, ["sections", "wishes", "placeholder"], "");
                  next = updateAtPath(next, ["sections", "wishes", "thankYouMessage"], "");
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextInput
                label="Title"
                value={config.sections.wishes.heading ?? ""}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "heading"], v))}
              />
              <TextInput
                label="Placeholder Text"
                value={config.sections.wishes.placeholder ?? ""}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "placeholder"], v))}
              />
              <TextArea
                label="Thank You Message"
                value={config.sections.wishes.thankYouMessage ?? ""}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "thankYouMessage"], v))}
                rows={2}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="🔻 Footer"
            enabled={asBoolean(config.sections.footer.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "footer", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "footer", "message"], "");
                }
                return next;
              })
            }
          >
            <div className="mt-2">
              <TextArea
                label="Footer Message"
                value={config.sections.footer.message}
                onChange={(v) =>
                  setConfig((prev) => updateAtPath(prev, ["sections", "footer", "message"], v))
                }
                rows={3}
              />
            </div>
          </SectionCard>
      </div>

      <button
        type="button"
        disabled={pending}
        className="sticky bottom-6 z-50 rounded-2xl bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)] transition-all disabled:opacity-60 disabled:hover:shadow-none mb-10 w-full"
        onClick={() => {
          const err = validateBeforeReview();
          setClientError(err);
          if (!err) setReviewOpen(true);
        }}
      >
        {pending ? "Launching Mission..." : "Launch Mission (Save)"}
      </button>

      {reviewOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setReviewOpen(false)}
            aria-label="Close review"
          />
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-[0_0_60px_-15px_rgba(79,70,229,0.35)] overflow-hidden">
            <div className="absolute -top-32 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-[70px] pointer-events-none" />
            <div className="relative z-10 grid gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">Review Summary</div>
                  <div className="mt-1 text-lg font-black tracking-tight text-white">Ready to create this mission?</div>
                </div>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:border-white/25"
                  onClick={() => setReviewOpen(false)}
                >
                  Back
                </button>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Mission Code</div>
                    <div className="mt-1 font-mono text-sm text-white/80 break-all">{slug}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Purpose</div>
                    <div className="mt-1 text-sm font-black text-white/90">{purpose}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Template</div>
                    <div className="mt-1 text-sm font-black text-white/90">{templateLabel}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Color Combination</div>
                    <div className="mt-1 text-sm font-black text-white/90">{themeLabel}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Hosts</div>
                    <div className="mt-1 text-sm font-black text-white/90">{hostLabel || "-"}</div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="grid gap-2">
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">First Event</div>
                  {firstEventSummary ? (
                    <div className="grid gap-1 text-sm text-white/85">
                      <div className="font-black text-white">
                        {firstEventSummary.title || "Event"}
                      </div>
                      <div className="text-white/80">
                        {firstEventSummary.dateText}{firstEventSummary.timeText ? ` • ${firstEventSummary.timeText}` : ""}
                      </div>
                      <div className="text-white/70">{firstEventSummary.venue || ""}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/60">-</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-wider text-white hover:border-white/25 disabled:opacity-60"
                  disabled={pending}
                  onClick={() => setReviewOpen(false)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)] disabled:opacity-60"
                  disabled={pending}
                  onClick={() => {
                    setClientError(null);
                    setReviewOpen(false);
                    confirmedSubmitRef.current = true;
                    setConfirmedSubmit(true);
                    window.setTimeout(() => {
                      formRef.current?.requestSubmit();
                    }, 0);
                  }}
                >
                  {pending ? "Creating..." : "Create Mission"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
