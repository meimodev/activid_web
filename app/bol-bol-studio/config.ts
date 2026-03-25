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
} as const;

export type StudioPackage = {
  id?: string;
  name: string;
  price: number;
  duration: number;
  capacity: number;
  notes?: string[];
};

export type AddOn = {
  title: string;
  price: number;
};

export type Account = {
  id?: string;
  phone?: string;
  pin?: string;
  admin?: boolean;
  name?: string;
};

export type Booking = {
  id: string;
  start: number;
  end: number;
  booking_timestamp: number;
  name: string;
  phone: string;
  note?: string;
  package?: string;
};

export type StudioInfo = {
  openingHours: {
    openMinutes: number;
    closeMinutes: number;
  };
  timezoneLabel: string;
  socials: {
    instagramUrl: string;
    instagramHandle: string;
    tiktokUrl: string;
    tiktokHandle: string;
    facebookUrl: string;
    facebookLabel: string;
  };
  adminPhone: string;
  timeStepMinutes: number;
  packages: StudioPackage[];
  addsOn: AddOn[];
};

export function minutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function withMinutesSinceMidnight(date: Date, minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const next = new Date(date);
  next.setHours(hours, mins, 0, 0);
  return next;
}

export function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
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

export function normalizeStudioInfo(raw: Partial<StudioInfo> | undefined): Omit<StudioInfo, "timeStepMinutes" | "packages" | "addsOn"> {
  return {
    openingHours: {
      openMinutes:
        typeof raw?.openingHours?.openMinutes === "number"
          ? raw.openingHours.openMinutes
          : BB_DEFAULTS.OPENING_HOURS.openMinutes,
      closeMinutes:
        typeof raw?.openingHours?.closeMinutes === "number"
          ? raw.openingHours.closeMinutes
          : BB_DEFAULTS.OPENING_HOURS.closeMinutes,
    },
    timezoneLabel: raw?.timezoneLabel ?? BB_DEFAULTS.TIMEZONE_LABEL,
    socials: {
      instagramUrl: raw?.socials?.instagramUrl ?? BB_DEFAULTS.SOCIALS.instagramUrl,
      instagramHandle: raw?.socials?.instagramHandle ?? BB_DEFAULTS.SOCIALS.instagramHandle,
      tiktokUrl: raw?.socials?.tiktokUrl ?? BB_DEFAULTS.SOCIALS.tiktokUrl,
      tiktokHandle: raw?.socials?.tiktokHandle ?? BB_DEFAULTS.SOCIALS.tiktokHandle,
      facebookUrl: raw?.socials?.facebookUrl ?? BB_DEFAULTS.SOCIALS.facebookUrl,
      facebookLabel: raw?.socials?.facebookLabel ?? BB_DEFAULTS.SOCIALS.facebookLabel,
    },
    adminPhone: raw?.adminPhone ?? BB_DEFAULTS.ADMIN_PHONE,
  };
}
