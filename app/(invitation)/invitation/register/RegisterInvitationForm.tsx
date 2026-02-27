"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CoupleData, EventDetail, InvitationConfig } from "@/types/invitation";
import { RegisterInvitationState, VerifyRegisterPasswordState } from "./actions";

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
  slug,
  fieldKey,
}: {
  file: File;
  slug: string;
  fieldKey: string;
}): Promise<string> {
  if (!slug) {
    throw new Error("Slug is required before uploading images.");
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
  form.set("folder", `activid web/invitation/${slug}`);
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
  slug,
  fieldKey,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  slug: string;
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
                const url = await uploadToImageKit({ file, slug, fieldKey });
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
  slug,
  fieldKey,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  slug: string;
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
                  const url = await uploadToImageKit({ file, slug, fieldKey });
                  nextItems = [...nextItems, url];
                  onChange(nextItems);
                  setPending((prev) => {
                    const next = prev.filter((p) => p.id !== id);
                    return next;
                  });
                  URL.revokeObjectURL(previewUrl);
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

const COUPLE_FIELDS: Array<[keyof CoupleData, string]> = [
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

function normalizeHostsList(raw: InvitationConfig["hosts"] | undefined, fallback: InvitationConfig["couple"]) {
  const emptyHost: CoupleData = {
    firstName: "",
    fullName: "",
    shortName: "",
    role: "",
    parents: "",
    photo: "",
  };

  const list = Array.isArray(raw) ? raw.filter(Boolean) : [];
  if (list.length) return list;
  return [fallback.groom, fallback.bride].filter(Boolean).length
    ? [fallback.groom, fallback.bride]
    : [emptyHost];
}

function deriveCoupleFromHosts(hosts: CoupleData[]): InvitationConfig["couple"] {
  const empty: CoupleData = {
    firstName: "",
    fullName: "",
    shortName: "",
    role: "",
    parents: "",
    photo: "",
  };

  return {
    groom: hosts[0] ?? empty,
    bride: hosts[1] ?? empty,
  };
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function tryParseIsoDate(value: string): string | null {
  const v = (value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return null;
}

function tryParseIndonesianDate(value: string): string | null {
  const raw = (value || "").trim();
  if (!raw) return null;

  const normalized = raw
    .replace(/^[A-Za-z]+\s*,\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const monthMap: Record<string, number> = {
    januari: 1,
    jan: 1,
    februari: 2,
    feb: 2,
    maret: 3,
    mar: 3,
    april: 4,
    apr: 4,
    mei: 5,
    juni: 6,
    jun: 6,
    juli: 7,
    jul: 7,
    agustus: 8,
    agu: 8,
    ags: 8,
    september: 9,
    sep: 9,
    oktober: 10,
    okt: 10,
    november: 11,
    nov: 11,
    desember: 12,
    des: 12,
  };

  const parts = normalized.split(" ").filter(Boolean);
  if (parts.length < 3) return null;

  const day = Number(parts[0]);
  const monthToken = parts[1]!.toLowerCase().replace(/[^a-z]/g, "");
  const year = Number(parts[2]!.replace(/[^0-9]/g, ""));
  const month = monthMap[monthToken];

  if (!day || !year || !month) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900) return null;

  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function toDateInputValue(value: string) {
  return tryParseIsoDate(value) ?? tryParseIndonesianDate(value) ?? "";
}

function toTimeInputValue(value: string) {
  const m = (value || "").match(/(\d{1,2}:\d{2})/);
  if (!m) return "";
  const parts = m[1]!.split(":");
  const hh = Number(parts[0]);
  const mm = Number(parts[1]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return "";
  return `${pad2(hh)}:${pad2(mm)}`;
}

function normalizeEventList(raw: InvitationConfig["sections"]["event"]["events"]): EventDetail[] {
  const emptyEvent: EventDetail = {
    title: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    mapUrl: "",
  };

  if (Array.isArray(raw)) {
    return raw.length ? raw : [emptyEvent];
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
  return list.length ? list : [emptyEvent];
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
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
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toDateInputValue(value)}
        type="date"
        onChange={(e) => onChange(e.target.value)}
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
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toTimeInputValue(value)}
        type="time"
        onChange={(e) => onChange(e.target.value)}
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
    <label className="flex items-center gap-2 text-sm text-white/70">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-white/20 bg-white/10"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
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
  const [open, setOpen] = useState(true);
  const effectiveOpen = enabled && open;

  return (
    <details
      open={effectiveOpen}
      className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
      onToggle={(e) => {
        if (!enabled) return;
        setOpen((e.currentTarget as HTMLDetailsElement).open);
      }}
    >
      <summary
        className={`flex list-none items-center justify-between gap-3 text-sm font-black text-white ${
          enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70"
        }`}
        onClick={(e) => {
          if (!enabled) e.preventDefault();
        }}
      >
        <span>{title}</span>
        <span
          className="cursor-default"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Checkbox
            label="Enabled"
            checked={enabled}
            onChange={(nextEnabled) => {
              if (!nextEnabled) {
                setOpen(false);
              }
              onEnabledChange(nextEnabled);
            }}
          />
        </span>
      </summary>

      {children}
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
  const [password, setPassword] = useState("");
  const [purpose, setPurpose] = useState<"marriage" | "birthday" | "event">(
    initialConfig.purpose ?? "marriage",
  );

  const initialHosts = useMemo(
    () => normalizeHostsList(initialConfig.hosts, initialConfig.couple),
    [initialConfig.couple, initialConfig.hosts],
  );

  const [config, setConfig] = useState<InvitationConfig>(() => ({
    ...initialConfig,
    id: "",
    templateId: templateId,
    purpose: initialConfig.purpose ?? "marriage",
    hosts: initialHosts,
    couple: deriveCoupleFromHosts(initialHosts),
    sections: {
      ...initialConfig.sections,
      hosts: initialConfig.sections.hosts ?? {
        enabled: initialConfig.sections.couple.enabled,
        disableGrayscale: initialConfig.sections.couple.disableGrayscale,
      },
      event: {
        ...initialConfig.sections.event,
        events: normalizeEventList(initialConfig.sections.event.events),
      },
    },
  }));

  function setHosts(nextHosts: CoupleData[]) {
    setConfig((prev) => ({
      ...prev,
      hosts: nextHosts,
      couple: deriveCoupleFromHosts(nextHosts),
    }));
  }

  const handleSlugChange = (nextSlug: string) => {
    setSlug(nextSlug);
    setConfig((prev) => ({
      ...prev,
      id: nextSlug,
    }));
  };

  const handleTemplateChange = (nextTemplateId: string) => {
    setTemplateId(nextTemplateId);
    setConfig((prev) => ({
      ...prev,
      templateId: nextTemplateId,
    }));
  };

  const handlePurposeChange = (nextPurpose: "marriage" | "birthday" | "event") => {
    setPurpose(nextPurpose);
    setConfig((prev) => ({
      ...prev,
      purpose: nextPurpose,
    }));
  };

  const configJson = useMemo(() => JSON.stringify(config), [config]);

  if (!isUnlocked) {
    return (
      <form action={verifyAction} className="grid gap-6">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-black text-white">Register Invitation</div>

          {verifyState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {verifyState.error}
            </div>
          ) : null}

          <TextInput label="Password" value={password} type="password" onChange={setPassword} />
          <input type="hidden" name="password" value={password} />

          <button
            type="submit"
            disabled={verifying}
            className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-black text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {verifying ? "Verifying..." : "Unlock"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="configJson" value={configJson} />

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-lg font-black text-white">Register Invitation</div>

        {state.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}

        <TextInput label="Slug (document id)" value={slug} onChange={handleSlugChange} />

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Template</span>
          <select
            className="rounded-xl border border-white/10 bg-[#0b0b16] px-3 py-2 text-white outline-none focus:border-indigo-500/60"
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {templateOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Purpose</span>
          <select
            name="purpose"
            className="rounded-xl border border-white/10 bg-[#0b0b16] px-3 py-2 text-white outline-none focus:border-indigo-500/60"
            value={purpose}
            onChange={(e) =>
              handlePurposeChange(e.target.value as "marriage" | "birthday" | "event")
            }
          >
            <option value="marriage">Marriage</option>
            <option value="birthday">Birthday</option>
            <option value="event">Event</option>
          </select>
        </label>
      </div>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <summary className="cursor-pointer text-base font-black text-white">Basics</summary>
        <div className="mt-4 grid gap-6">
          <details open className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <summary className="cursor-pointer text-sm font-black text-white">Music</summary>
            <TextInput
              label="Title (optional)"
              value={config.music.title ?? ""}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["music", "title"], v))}
            />
            <TextInput
              label="URL"
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
          </details>

          <details open className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <summary className="cursor-pointer text-sm font-black text-white">
              Background Photos
            </summary>
            <StringListEditor
              label="Photos"
              items={config.backgroundPhotos}
              onChange={(items) => setConfig((prev) => updateAtPath(prev, ["backgroundPhotos"], items))}
            />
          </details>
        </div>
      </details>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <summary className="cursor-pointer text-base font-black text-white">Hosts</summary>
        <div className="mt-4 grid gap-6">
          {(config.hosts ?? []).map((host, idx) => (
            <div
              key={idx}
              className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-black text-white">
                  {idx === 0 ? "Host 1 (Groom)" : idx === 1 ? "Host 2 (Bride)" : `Host ${idx + 1}`}
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10 disabled:opacity-50"
                  disabled={(config.hosts?.length ?? 0) <= 1}
                  onClick={() => {
                    const next = (config.hosts ?? []).filter((_, i) => i !== idx);
                    setHosts(next.length ? next : [host]);
                  }}
                >
                  Remove
                </button>
              </div>

              {COUPLE_FIELDS.map(([key, label]) =>
                key === "photo" ? (
                  <ImageUrlPicker
                    key={key}
                    label={label}
                    value={host.photo}
                    slug={slug}
                    fieldKey={`host-${idx}-photo`}
                    onChange={(v) => {
                      const next = [...(config.hosts ?? [])];
                      next[idx] = { ...next[idx]!, photo: v };
                      setHosts(next);
                    }}
                  />
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
          ))}

          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10"
            onClick={() => {
              const emptyHost: CoupleData = {
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
            Add Host
          </button>
        </div>
      </details>

      <details className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <summary className="cursor-pointer text-base font-black text-white">Sections</summary>
        <div className="mt-4 grid gap-6">
          <SectionCard
            title="Hero"
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
            <TextInput
              label="Subtitle"
              value={config.sections.hero.subtitle}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "hero", "subtitle"], v))
              }
            />
            <ImageUrlPicker
              label="Cover Image"
              value={config.sections.hero.coverImage}
              slug={slug}
              fieldKey="hero-cover"
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "hero", "coverImage"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="Title"
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
              label="Heading"
              value={config.sections.title.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "title", "heading"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="Countdown"
            enabled={asBoolean(config.sections.countdown.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "countdown", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "countdown", "heading"], "");
                  next = updateAtPath(next, ["sections", "countdown", "photos"], []);
                }
                return next;
              })
            }
          >
            <TextInput
              label="Heading"
              value={config.sections.countdown.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "countdown", "heading"], v))
              }
            />
            <StringListEditor
              label="Photos"
              items={config.sections.countdown.photos}
              onChange={(items) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "countdown", "photos"], items))
              }
            />
          </SectionCard>

          <SectionCard
            title="Quote"
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
              label="Text"
              value={config.sections.quote.text}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "quote", "text"], v))}
              rows={3}
            />
            <TextInput
              label="Author"
              value={config.sections.quote.author}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "quote", "author"], v))
              }
            />
          </SectionCard>

          <SectionCard
            title="Hosts Section"
            enabled={asBoolean(config.sections.hosts?.enabled ?? config.sections.couple.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(prev, ["sections", "couple", "enabled"], v);
                next = updateAtPath(next, ["sections", "hosts", "enabled"], v);
                if (!v) {
                  next = updateAtPath(next, ["sections", "couple", "disableGrayscale"], false);
                  next = updateAtPath(next, ["sections", "hosts", "disableGrayscale"], false);
                }
                return next;
              })
            }
          >
            <Checkbox
              label="Disable Grayscale"
              checked={asBoolean(
                config.sections.hosts?.disableGrayscale ?? config.sections.couple.disableGrayscale,
              )}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(
                    updateAtPath(prev, ["sections", "couple", "disableGrayscale"], v),
                    ["sections", "hosts", "disableGrayscale"],
                    v,
                  ),
                )
              }
            />
          </SectionCard>

          <SectionCard
            title="Story"
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
              label="Heading"
              value={config.sections.story.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "story", "heading"], v))
              }
            />

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Stories</div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60"
                  onClick={() =>
                    setConfig((prev) =>
                      updateAtPath(prev, ["sections", "story", "stories"], [
                        ...prev.sections.story.stories,
                        { date: "", description: "" },
                      ]),
                    )
                  }
                >
                  Add
                </button>
              </div>

              <div className="grid gap-3">
                {config.sections.story.stories.map((story, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black text-white">Item {idx + 1}</div>
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-red-500/60"
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
                    <TextInput
                      label="Date"
                      value={story.date}
                      onChange={(v) => {
                        const nextStories = [...config.sections.story.stories];
                        nextStories[idx] = { ...nextStories[idx], date: v };
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
                    <TextInput
                      label="Title (optional)"
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
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Event"
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
            <TextInput
              label="Heading"
              value={config.sections.event.heading}
              onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "event", "heading"], v))}
            />

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Events</div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60"
                  onClick={() => {
                    const nextEvents = [
                      ...(config.sections.event.events as EventDetail[]),
                      {
                        title: "",
                        date: "",
                        time: "",
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
                  Add
                </button>
              </div>

              <div className="grid gap-3">
                {(config.sections.event.events as EventDetail[]).map((event, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black text-white">Event {idx + 1}</div>
                      <button
                        type="button"
                        disabled={(config.sections.event.events as EventDetail[]).length <= 1}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-red-500/60 disabled:opacity-50"
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

                    {EVENT_FIELDS.map(([field, fieldLabel]) => (
                      <TextInput
                        key={field}
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
                      value={event.time}
                      onChange={(v) => {
                        const nextEvents = [...(config.sections.event.events as EventDetail[])];
                        nextEvents[idx] = { ...nextEvents[idx]!, time: v };
                        setConfig((prev) =>
                          updateAtPath(prev, ["sections", "event", "events"], nextEvents),
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Gallery"
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
            <TextInput
              label="Heading"
              value={config.sections.gallery.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "gallery", "heading"], v))
              }
            />
            <ImageUrlListPicker
              label="Photos"
              items={config.sections.gallery.photos}
              slug={slug}
              fieldKey="gallery-photo"
              onChange={(items) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "gallery", "photos"], items))
              }
            />
          </SectionCard>

          <SectionCard
            title="RSVP"
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
            {RSVP_FIELDS.map(([field, label]) => (
              <TextArea
                key={field}
                label={label}
                value={config.sections.rsvp[field]}
                onChange={(v) => setConfig((prev) => updateAtPath(prev, ["sections", "rsvp", field], v))}
                rows={2}
              />
            ))}
          </SectionCard>

          <SectionCard
            title="Gift"
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
            <TextInput
              label="Heading"
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

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Bank Accounts</div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-indigo-500/60"
                  onClick={() => {
                    const nextAccounts = [
                      ...config.sections.gift.bankAccounts,
                      { bankName: "", accountNumber: "", accountHolder: "" },
                    ];
                    setConfig((prev) => updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts));
                  }}
                >
                  Add
                </button>
              </div>
              <div className="grid gap-3">
                {config.sections.gift.bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black text-white">Item {idx + 1}</div>
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-red-500/60"
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
                    <TextInput
                      label="Bank Name"
                      value={acc.bankName}
                      onChange={(v) => {
                        const nextAccounts = [...config.sections.gift.bankAccounts];
                        nextAccounts[idx] = { ...nextAccounts[idx], bankName: v };
                        setConfig((prev) => updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts));
                      }}
                    />
                    <TextInput
                      label="Account Number"
                      value={acc.accountNumber}
                      onChange={(v) => {
                        const nextAccounts = [...config.sections.gift.bankAccounts];
                        nextAccounts[idx] = { ...nextAccounts[idx], accountNumber: v };
                        setConfig((prev) => updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts));
                      }}
                    />
                    <TextInput
                      label="Account Holder"
                      value={acc.accountHolder}
                      onChange={(v) => {
                        const nextAccounts = [...config.sections.gift.bankAccounts];
                        nextAccounts[idx] = { ...nextAccounts[idx], accountHolder: v };
                        setConfig((prev) => updateAtPath(prev, ["sections", "gift", "bankAccounts"], nextAccounts));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Wishes"
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
            <TextInput
              label="Heading"
              value={config.sections.wishes.heading}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "heading"], v))
              }
            />
            <TextInput
              label="Placeholder"
              value={config.sections.wishes.placeholder}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "placeholder"], v))
              }
            />
            <TextArea
              label="Thank You Message"
              value={config.sections.wishes.thankYouMessage}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "wishes", "thankYouMessage"], v))
              }
              rows={2}
            />
          </SectionCard>

          <SectionCard
            title="Footer"
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
            <TextArea
              label="Message"
              value={config.sections.footer.message}
              onChange={(v) =>
                setConfig((prev) => updateAtPath(prev, ["sections", "footer", "message"], v))
              }
              rows={3}
            />
          </SectionCard>
        </div>
      </details>

      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-black text-white hover:bg-indigo-400 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save (overwrite)"}
      </button>
    </form>
  );
}
