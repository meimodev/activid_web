export const BB_FIRESTORE = {
  BOOKINGS_COLLECTION: "bb_bookings",
  PACKAGES_COLLECTION: "bb_packages",
  ACCOUNTS_COLLECTION: "bb_accounts",
  ADDS_COLLECTION: "bb_adds",
  ADDS_DOC_ID: "adds",
  PUBLIC_COLLECTION: "bb_public",
  PUBLIC_DOC_ID: "bol_bol_studio",
} as const;

export const BB_DEFAULTS = {
  TIME_STEP_MINUTES: 30,
  TIMEZONE_LABEL: "WITA",
  OPENING_HOURS: {
    openMinutes: 11 * 60,
    closeMinutes: 21 * 60,
  },
  SOCIALS: {
    instagramUrl: "https://www.instagram.com/bolbol_studio",
    instagramHandle: "@bolbol_studio",
    tiktokUrl: "https://www.tiktok.com/",
    tiktokHandle: "@bolbol_studio",
    facebookUrl: "https://www.facebook.com/share/168ARZJr3N/?mibextid=wwXIfr",
    facebookLabel: "Bolbol Pss",
  },
  ADMIN_PHONE: "+6289503162551",
  HERO_IMAGE:
    "https://ik.imagekit.io/geb6bfhmhx/bol-bol-studio/main.jpg?updatedAt=1754041084936",
} as const;

export type StudioBooking = {
  id: string;
  startMs: number;
  endMs: number;
  bookingTimestampMs: number;
  name: string;
  phone: string;
  note: string;
  package: string;
  instagram?: string;
};

export type StudioPackage = {
  id: string;
  name: string;
  price: number;
  duration: number;
  capacity: number;
  notes?: string[];
};

export type StudioAddOn = {
  title: string;
  price: number;
};

export type StudioSocials = {
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  facebookUrl: string;
  facebookLabel: string;
};

export type StudioInfo = {
  openingHours: {
    openMinutes: number;
    closeMinutes: number;
  };
  timezoneLabel: string;
  socials: StudioSocials;
  adminPhone: string;
  timeStepMinutes: number;
  packages: StudioPackage[];
  addsOn: StudioAddOn[];
};

export type StudioPageData = {
  bookings: StudioBooking[];
  studioInfo: StudioInfo;
  warning: string | null;
};

export function minutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function withMinutesSinceMidnight(date: Date, minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const nextDate = new Date(date);
  nextDate.setHours(hours, mins, 0, 0);
  return nextDate;
}

export function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export function timeOptions({
  openMinutes,
  closeMinutes,
  stepMinutes,
}: {
  openMinutes?: number;
  closeMinutes?: number;
  stepMinutes?: number;
}) {
  const options: number[] = [];
  if (
    typeof openMinutes !== "number" ||
    typeof closeMinutes !== "number" ||
    typeof stepMinutes !== "number" ||
    stepMinutes <= 0
  ) {
    return options;
  }

  for (let value = openMinutes; value < closeMinutes; value += stepMinutes) {
    options.push(value);
  }

  return options;
}

export function normalizeStudioInfo(raw: unknown): Omit<StudioInfo, "packages" | "addsOn" | "timeStepMinutes"> {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const rawOpening =
    record.openingHours && typeof record.openingHours === "object"
      ? (record.openingHours as Record<string, unknown>)
      : {};
  const rawSocials =
    record.socials && typeof record.socials === "object"
      ? (record.socials as Record<string, unknown>)
      : {};

  return {
    openingHours: {
      openMinutes:
        typeof rawOpening.openMinutes === "number"
          ? rawOpening.openMinutes
          : BB_DEFAULTS.OPENING_HOURS.openMinutes,
      closeMinutes:
        typeof rawOpening.closeMinutes === "number"
          ? rawOpening.closeMinutes
          : BB_DEFAULTS.OPENING_HOURS.closeMinutes,
    },
    timezoneLabel:
      typeof record.timezoneLabel === "string" && record.timezoneLabel.trim()
        ? record.timezoneLabel
        : BB_DEFAULTS.TIMEZONE_LABEL,
    socials: {
      instagramUrl:
        typeof rawSocials.instagramUrl === "string" && rawSocials.instagramUrl.trim()
          ? rawSocials.instagramUrl
          : BB_DEFAULTS.SOCIALS.instagramUrl,
      instagramHandle:
        typeof rawSocials.instagramHandle === "string" && rawSocials.instagramHandle.trim()
          ? rawSocials.instagramHandle
          : BB_DEFAULTS.SOCIALS.instagramHandle,
      tiktokUrl:
        typeof rawSocials.tiktokUrl === "string" && rawSocials.tiktokUrl.trim()
          ? rawSocials.tiktokUrl
          : BB_DEFAULTS.SOCIALS.tiktokUrl,
      tiktokHandle:
        typeof rawSocials.tiktokHandle === "string" && rawSocials.tiktokHandle.trim()
          ? rawSocials.tiktokHandle
          : BB_DEFAULTS.SOCIALS.tiktokHandle,
      facebookUrl:
        typeof rawSocials.facebookUrl === "string" && rawSocials.facebookUrl.trim()
          ? rawSocials.facebookUrl
          : BB_DEFAULTS.SOCIALS.facebookUrl,
      facebookLabel:
        typeof rawSocials.facebookLabel === "string" && rawSocials.facebookLabel.trim()
          ? rawSocials.facebookLabel
          : BB_DEFAULTS.SOCIALS.facebookLabel,
    },
    adminPhone:
      typeof record.adminPhone === "string" && record.adminPhone.trim()
        ? record.adminPhone
        : BB_DEFAULTS.ADMIN_PHONE,
  };
}

function formatWithIntl(
  dateInput: Date | number,
  options: Intl.DateTimeFormatOptions,
) {
  const date = typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

export function formatTimeLabel(minutes: number) {
  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return formatWithIntl(date, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDateLabel(dateInput: Date | number) {
  return formatWithIntl(dateInput, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMonthLabel(dateInput: Date | number) {
  return formatWithIntl(dateInput, { month: "long", year: "numeric" });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function obfuscateLabel(value: string, reveal: boolean) {
  if (reveal) return value;
  if (!value) return "";
  if (value.length > 4) return `${value.slice(0, -4)}****`;
  if (value.length > 2) return `${value.slice(0, 2)}****`;
  return `${value.slice(0, 1)}****`;
}
