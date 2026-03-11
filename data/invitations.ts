import { DateTime } from "luxon";
import { InvitationConfig } from "@/types/invitation";
import { INVITATION_ZONE, toInvitationIso } from "@/lib/date-time";

const dt = (year: number, month: number, day: number, hour = 0, minute = 0) =>
  toInvitationIso({ year, month, day, hour, minute }) ??
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;

function getRelativeDemoBaseDateTime(): DateTime {
  return DateTime.now()
    .setZone(INVITATION_ZONE)
    .plus({ days: 3 })
    .set({ hour: 13, minute: 0, second: 0, millisecond: 0 });
}

function withRelativeDemoEventDates(config: InvitationConfig): InvitationConfig {
  const events = config.sections.event.events;
  if (!Array.isArray(events) || events.length < 1) return config;

  const base = getRelativeDemoBaseDateTime();
  const nextEvents = events.map((event, index) => {
    const iso = toInvitationIso(base.plus({ hours: index * 5 }));
    return iso ? { ...event, date: iso } : event;
  });

  return {
    ...config,
    sections: {
      ...config.sections,
      event: {
        ...config.sections.event,
        events: nextEvents as InvitationConfig["sections"]["event"]["events"],
      },
    },
  };
}

type Purpose = "marriage" | "birthday" | "event";

export const DEMO_COVER_IMAGE_URL =
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/cover.webp" as const;

export const DEMO_GROOM_PROFILE_IMAGE_URL =
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/grooms_profile.webp" as const;

export const DEMO_BRIDE_PROFILE_IMAGE_URL =
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/brides_profile.webp" as const;

export const DEMO_GALLERY_IMAGEKIT_URLS = [
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/1.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/3.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/4.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/5.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/6.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/7.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/9.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/10.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/12.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/13.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/14.webp",
  "https://ik.imagekit.io/geb6bfhmhx/activid-web/invitation/assets/15.webp",
] as const;

export const DEMO_MARRIAGE_MUSIC_URLS = [
  "https://www.dropbox.com/scl/fi/1pouwgrjv6a5cy9nkra5k/Carpenters-Close-to-you.mp3?rlkey=eord3gjxoautf9j48hj5ro5dh&st=vwx6q4xw&dl=1",
  "https://www.dropbox.com/scl/fi/ufkmtkrtl959yx0oqvmh2/Michael-Bubl-feat.-C-cile-McLorin-Salvant-La-vie-en-rose.mp3?rlkey=b7ni3b2g7tmiv81uqjfr91mr3&st=tpur1kzc&dl=1",
  "https://www.dropbox.com/scl/fi/ix1jaxuz8o1jg0mz0funz/Elvis-Presley-Can-t-Help-Falling-In-Love.mp3?rlkey=02wjb0gpvma31l9vf465hsra1&st=vfxagrzl&dl=1",
  "https://www.dropbox.com/scl/fi/b5sb1zdpv2x9fz3d192dx/Michael-Bubl-L.O.V.E.mp3?rlkey=b1o4rd26c060144gd1cfza9iy&st=twv5bhwb&dl=1",
  "https://www.dropbox.com/scl/fi/42ivyxp3vlquwlvvd3fz3/Take-My-Hand-Emily-Hackett-Will-Anderson-of-Parachute.mp3?rlkey=jytais4j6m4gtif79l22rqo7x&st=zbe60ame&dl=1",
  "https://www.dropbox.com/scl/fi/z8fnzyzbdv7jiplpfmgx2/Boyce-Avenue-Beautiful-Soul.mp3?rlkey=ky1pvj6p0s4fkr32crrnhju5d&st=mpbddf2v&dl=1",
  "https://www.dropbox.com/scl/fi/sfpu18ukc1n7i4qzw93ef/Boyce-Avenue-Say-You-Won-t-Let-Go.mp3?rlkey=5y5wt29xdq1jh10maijs57oa0&st=q2aqvkhn&dl=1",
  "https://www.dropbox.com/scl/fi/0w731ekqg1wlpwp5qmhvv/Shane-Filan-Beautiful-In-White.mp3?rlkey=qo4agwhv931nrpozo7o4e95o1&st=rp576tln&dl=1",
] as const;

export const DEMO_BIRTHDAY_MUSIC_URLS = [
  "https://www.dropbox.com/scl/fi/h7ifzjltghy5hz9311750/Pamungkas-Happy-Birthday-To-You.mp3?rlkey=esy51sf2rrsbo9gaojc81vltp&st=pkguab2h&dl=1",
  "https://www.dropbox.com/scl/fi/6mfrg76gr31p4iakc7byl/Nosstress-Semoga-Ya.mp3?rlkey=l2lazj9usofashaq0kilbyo89&st=lbiwx0pe&dl=1",
  "https://www.dropbox.com/scl/fi/r1ymtmmbogk8lla0fytdm/Jhon-Legend-Happy-Birthday.mp3?rlkey=tt2a2dhjvzgmnfm7pc0eizoiy&st=x6tig9k0&dl=1",
  "https://www.dropbox.com/scl/fi/ck3bes25c6coyu5s7bbzj/Anne-Marie-Birthday.mp3?rlkey=r43wnhibjxkoa8f83rq85tqcp&st=g18mpkwz&dl=1",
] as const;

function pickRandomIndex(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

export function pickRandomDemoMusicUrl(purpose: InvitationConfig["purpose"]): string {
  const pool = purpose === "birthday" ? DEMO_BIRTHDAY_MUSIC_URLS : DEMO_MARRIAGE_MUSIC_URLS;
  return pool[pickRandomIndex(pool.length)] ?? pool[0] ?? "";
}

function getDefaultGratitudeMessage(purpose: Purpose): string {
  if (purpose === "marriage") {
    return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.";
  }
  if (purpose === "birthday") {
    return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk merayakan ulang tahun ini bersama kami.";
  }
  return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk merayakan momen spesial ini bersama kami.";
}

type InvitationConfigOverrides = Omit<Partial<InvitationConfig>, "metadata" | "music" | "sections"> & {
  metadata?: Omit<Partial<InvitationConfig["metadata"]>, "openGraph" | "twitter"> & {
    openGraph?: Partial<InvitationConfig["metadata"]["openGraph"]>;
    twitter?: Partial<InvitationConfig["metadata"]["twitter"]>;
  };
  music?: Partial<InvitationConfig["music"]>;
  sections?: Partial<{
    [K in keyof InvitationConfig["sections"]]: Partial<InvitationConfig["sections"][K]>;
  }>;
};

function mergeInvitationConfig(base: InvitationConfig, overrides: InvitationConfigOverrides): InvitationConfig {
  const nextMetadata = overrides.metadata
    ? {
        ...base.metadata,
        ...overrides.metadata,
        openGraph: {
          ...base.metadata.openGraph,
          ...(overrides.metadata.openGraph ?? {}),
        },
        twitter: {
          ...base.metadata.twitter,
          ...(overrides.metadata.twitter ?? {}),
        },
      }
    : base.metadata;

  const nextMusic = overrides.music
    ? {
        ...base.music,
        ...overrides.music,
      }
    : base.music;

  const nextSections = overrides.sections
    ? {
        hero: {
          ...base.sections.hero,
          ...(overrides.sections.hero ?? {}),
        },
        title: {
          ...base.sections.title,
          ...(overrides.sections.title ?? {}),
        },
        countdown: {
          ...base.sections.countdown,
          ...(overrides.sections.countdown ?? {}),
        },
        quote: {
          ...base.sections.quote,
          ...(overrides.sections.quote ?? {}),
        },
        hosts: {
          ...base.sections.hosts,
          ...(overrides.sections.hosts ?? {}),
        },
        story: {
          ...base.sections.story,
          ...(overrides.sections.story ?? {}),
        },
        event: {
          ...base.sections.event,
          ...(overrides.sections.event ?? {}),
        },
        gallery: {
          ...base.sections.gallery,
          ...(overrides.sections.gallery ?? {}),
        },
        rsvp: {
          ...base.sections.rsvp,
          ...(overrides.sections.rsvp ?? {}),
        },
        gift: {
          ...base.sections.gift,
          ...(overrides.sections.gift ?? {}),
        },
        wishes: {
          ...base.sections.wishes,
          ...(overrides.sections.wishes ?? {}),
        },
        gratitude: {
          ...base.sections.gratitude,
          ...(overrides.sections.gratitude ?? {}),
        },
        footer: {
          ...base.sections.footer,
          ...(overrides.sections.footer ?? {}),
        },
      }
    : base.sections;

  const { metadata: _metadata, music: _music, sections: _sections, ...restOverrides } = overrides;
  void _metadata;
  void _music;
  void _sections;

  return {
    ...base,
    ...restOverrides,
    metadata: nextMetadata,
    music: nextMusic,
    sections: nextSections,
  };
}

function makeMetadata({
  slug,
  title,
  description,
  coverImage,
}: {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
}): InvitationConfig["metadata"] {
  const url = `https://activid.web.id/invitation/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Activid Web Invitation",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  };
}

const INVITATION_PURPOSE_SEEDS_BASE: Record<Purpose, InvitationConfig> = {
  marriage: {
    id: "seed-marriage",
    templateId: "flow",
    purpose: "marriage",
    theme: {
      mainColor: "#F9F7F2",
      accentColor: "#800020",
      accent2Color: "#C5A059",
      darkColor: "#2A1B1B",
    },
    metadata: makeMetadata({
      slug: "seed-marriage",
      title: "The Wedding of Alex & Maya",
      description: "You are invited to the wedding of Alex & Maya.",
      coverImage: DEMO_COVER_IMAGE_URL,
    }),
    music: {
      title: "Theme",
      url: DEMO_MARRIAGE_MUSIC_URLS[0] ?? "",
    },
    sections: {
      hero: {
        enabled: true,
        subtitle: "The Wedding",
        coverImage: DEMO_COVER_IMAGE_URL,
      },
      title: {
        enabled: true,
        heading: "The Wedding",
      },
      countdown: {
        enabled: true,
        heading: "Save The Date",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[0],
          DEMO_GALLERY_IMAGEKIT_URLS[1],
          DEMO_GALLERY_IMAGEKIT_URLS[2],
        ],
      },
      quote: {
        enabled: true,
        text: "Love is not just looking at each other, it's looking in the same direction.",
        author: "Antoine de Saint-Exupéry",
      },
      hosts: {
        enabled: true,
        hosts: [
          {
            firstName: "Alex",
            fullName: "Alexandra Pratama",
            shortName: "Alex",
            role: "The Groom",
            parents: "Putra dari Bapak Hendra & Ibu Rina",
            photo: DEMO_GROOM_PROFILE_IMAGE_URL,
          },
          {
            firstName: "Maya",
            fullName: "Maya Aurelia",
            shortName: "Maya",
            role: "The Bride",
            parents: "Putri dari Bapak Samuel & Ibu Maria",
            photo: DEMO_BRIDE_PROFILE_IMAGE_URL,
          },
        ],
      },
      story: {
        enabled: true,
        heading: "Our Story",
        stories: [
          {
            date: dt(2022, 6, 12),
            description: "First met at a small coffee shop and talked until midnight.",
          },
          {
            date: dt(2024, 10, 5),
            description: "The day we decided to build a future together.",
          },
        ],
      },
      event: {
        enabled: true,
        heading: "The Event",
        events: [
          {
            title: "Wedding Ceremony",
            date: dt(2026, 1, 1, 10, 0),
            venue: "Grand Cathedral",
            address: "123 Wedding Street, Love City",
            mapUrl: "https://maps.google.com",
          },
          {
            title: "Reception",
            date: dt(2026, 1, 1, 19, 0),
            venue: "Royal Ballroom",
            address: "456 Party Lane, Celebration City",
            mapUrl: "https://maps.google.com",
          },
        ],
      },
      gallery: {
        enabled: true,
        heading: "The Moments",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[3],
          DEMO_GALLERY_IMAGEKIT_URLS[4],
          DEMO_GALLERY_IMAGEKIT_URLS[5],
          DEMO_GALLERY_IMAGEKIT_URLS[6],
        ],
      },
      rsvp: {
        enabled: true,
        heading: "RSVP",
        description: "Kehadiran anda sangat kami nantikan",
        successMessage: "Terima kasih atas konfirmasi anda",
        alreadySubmittedMessage: "Konfirmasi anda sudah kami terima",
        seeYouMessage: "Sampai jumpa di acara kami",
      },
      gift: {
        enabled: true,
        heading: "Wedding Gift",
        description:
          "Kehadiran dan doa anda sangat berharga bagi kami.\nNamun, jika menjadi kerelaan anda untuk memberi lebih lagi,\nkami mempermudah niat berharga anda lewat nomor rekening berikut:",
        bankAccounts: [
          {
            bankName: "BCA",
            accountNumber: "1234567890",
            accountHolder: "ALEXANDRA PRATAMA",
          },
        ],
      },
      wishes: {
        enabled: true,
        heading: "Wedding Wishes",
        placeholder: "Tuliskan pesanmu",
        thankYouMessage: "Pesanmu sudah diterima dengan baik",
      },
      gratitude: {
        enabled: false,
        message: "",
      },
      footer: {
        enabled: true,
        message: "Terima kasih telah merayakan bersama Activid",
      },
    },
  },
  birthday: {
    id: "seed-birthday",
    templateId: "flow",
    purpose: "birthday",
    theme: {
      mainColor: "#FFF4F6",
      accentColor: "#612A35",
      accent2Color: "#C5A059",
      darkColor: "#12060A",
    },
    metadata: makeMetadata({
      slug: "seed-birthday",
      title: "Birthday Invitation - Raka",
      description: "You are invited to celebrate Raka's birthday.",
      coverImage: DEMO_COVER_IMAGE_URL,
    }),
    music: {
      title: "Theme",
      url: DEMO_BIRTHDAY_MUSIC_URLS[0] ?? "",
    },
    sections: {
      hero: {
        enabled: true,
        subtitle: "Birthday Party",
        coverImage: DEMO_COVER_IMAGE_URL,
      },
      title: {
        enabled: true,
        heading: "Birthday Party",
      },
      countdown: {
        enabled: true,
        heading: "Counting Down",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[4],
          DEMO_GALLERY_IMAGEKIT_URLS[5],
        ],
      },
      quote: {
        enabled: true,
        text: "Make a wish, take a chance, make a change.",
        author: "",
      },
      hosts: {
        enabled: true,
        hosts: [
          {
            firstName: "Raka",
            fullName: "Raka Mahendra",
            shortName: "Raka",
            role: "Birthday Star",
            parents: "Putra dari Bapak Mahendra & Ibu Kristina",
            photo: DEMO_GROOM_PROFILE_IMAGE_URL,
          },
        ],
      },
      story: {
        enabled: true,
        heading: "Party Notes",
        stories: [
          {
            date: dt(2026, 4, 12),
            description: "Bring your best smile and your loudest laugh.",
          },
          {
            date: dt(2026, 4, 12),
            description: "Dress code: colorful and fun.",
          },
        ],
      },
      event: {
        enabled: true,
        heading: "Event Details",
        events: [
          {
            title: "Birthday Celebration",
            date: dt(2026, 4, 12, 16, 0),
            venue: "Garden Venue",
            address: "Jl. Bahagia No. 12",
            mapUrl: "https://maps.google.com",
          },
        ],
      },
      gallery: {
        enabled: true,
        heading: "Gallery",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[7],
          DEMO_GALLERY_IMAGEKIT_URLS[8],
        ],
      },
      rsvp: {
        enabled: true,
        heading: "RSVP",
        description: "Kehadiran anda sangat kami nantikan",
        successMessage: "Terima kasih atas konfirmasi anda",
        alreadySubmittedMessage: "Konfirmasi anda sudah kami terima",
        seeYouMessage: "Sampai jumpa di acara kami",
      },
      gift: {
        enabled: false,
        heading: "Gift",
        description: "",
        bankAccounts: [],
      },
      wishes: {
        enabled: true,
        heading: "Wishes",
        placeholder: "Tuliskan pesanmu",
        thankYouMessage: "Pesanmu sudah diterima dengan baik",
      },
      gratitude: {
        enabled: false,
        message: "",
      },
      footer: {
        enabled: true,
        message: "See you at the party!",
      },
    },
  },
  event: {
    id: "seed-event",
    templateId: "flow",
    purpose: "event",
    theme: {
      mainColor: "#0B0D17",
      accentColor: "#7DD3FC",
      accent2Color: "#D4AF37",
      darkColor: "#020615",
    },
    metadata: makeMetadata({
      slug: "seed-event",
      title: "Event Invitation - Activid Meetup",
      description: "You are invited to our event.",
      coverImage: DEMO_COVER_IMAGE_URL,
    }),
    music: {
      title: "Theme",
      url: DEMO_MARRIAGE_MUSIC_URLS[0] ?? "",
    },
    sections: {
      hero: {
        enabled: true,
        subtitle: "The Event",
        coverImage: DEMO_COVER_IMAGE_URL,
      },
      title: {
        enabled: true,
        heading: "The Event",
      },
      countdown: {
        enabled: true,
        heading: "Starting Soon",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[9],
        ],
      },
      quote: {
        enabled: true,
        text: "Meet. Learn. Build.",
        author: "",
      },
      hosts: {
        enabled: true,
        hosts: [
          {
            firstName: "Activid",
            fullName: "Activid Team",
            shortName: "Activid",
            role: "Organizer",
            parents: "",
            photo: DEMO_GROOM_PROFILE_IMAGE_URL,
          },
        ],
      },
      story: {
        enabled: true,
        heading: "Agenda",
        stories: [
          {
            date: dt(2026, 8, 2),
            description: "Keynote, networking, and demo showcase.",
          },
          {
            date: dt(2026, 8, 2),
            description: "Bring your laptop for hands-on sessions.",
          },
        ],
      },
      event: {
        enabled: true,
        heading: "Schedule",
        events: [
          {
            title: "Registration",
            date: dt(2026, 8, 2, 9, 0),
            venue: "Main Hall",
            address: "Jl. Angkasa No. 8",
            mapUrl: "https://maps.google.com",
          },
          {
            title: "Main Session",
            date: dt(2026, 8, 2, 10, 0),
            venue: "Auditorium",
            address: "Jl. Angkasa No. 8",
            mapUrl: "https://maps.google.com",
          },
        ],
      },
      gallery: {
        enabled: true,
        heading: "Highlights",
        photos: [
          DEMO_GALLERY_IMAGEKIT_URLS[10],
          DEMO_GALLERY_IMAGEKIT_URLS[11],
        ],
      },
      rsvp: {
        enabled: true,
        heading: "RSVP",
        description: "Kehadiran anda sangat kami nantikan",
        successMessage: "Terima kasih atas konfirmasi anda",
        alreadySubmittedMessage: "Konfirmasi anda sudah kami terima",
        seeYouMessage: "Sampai jumpa di acara kami",
      },
      gift: {
        enabled: false,
        heading: "Gift",
        description: "",
        bankAccounts: [],
      },
      wishes: {
        enabled: true,
        heading: "Messages",
        placeholder: "Tuliskan pesanmu",
        thankYouMessage: "Pesanmu sudah diterima dengan baik",
      },
      gratitude: {
        enabled: false,
        message: "",
      },
      footer: {
        enabled: true,
        message: "Terima kasih telah merayakan bersama Activid",
      },
    },
  },
};

export function getInvitationPurposeSeed(purpose: Purpose): InvitationConfig {
  const seed = INVITATION_PURPOSE_SEEDS_BASE[purpose] ?? INVITATION_PURPOSE_SEEDS_BASE.marriage;
  return withRelativeDemoEventDates(seed);
}

export function getInvitationPurposeSeeds(): Record<Purpose, InvitationConfig> {
  return {
    marriage: getInvitationPurposeSeed("marriage"),
    birthday: getInvitationPurposeSeed("birthday"),
    event: getInvitationPurposeSeed("event"),
  };
}

const DEMO_TEMPLATE_OVERRIDES: Record<string, InvitationConfigOverrides> = {
  flow: {
    templateId: "flow",
    theme: {
      mainColor: "#F9F7F2",
      accentColor: "#800020",
      accent2Color: "#C5A059",
      darkColor: "#2A1B1B",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  saturn: {
    templateId: "saturn",
    theme: {
      mainColor: "#0B0D17",
      accentColor: "#D4AF37",
      accent2Color: "#22D3EE",
      darkColor: "#0B0D17",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  venus: {
    templateId: "venus",
    theme: {
      mainColor: "#F8F4EC",
      accentColor: "#C5A059",
      accent2Color: "#800020",
      darkColor: "#2B2424",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  neptune: {
    templateId: "neptune",
    theme: {
      mainColor: "#F8F4EC",
      accentColor: "#7DD3FC",
      accent2Color: "#C5A059",
      darkColor: "#020615",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  mercury: {
    templateId: "mercury",
    theme: {
      mainColor: "#F7F3EA",
      accentColor: "#612A35",
      accent2Color: "#C5A059",
      darkColor: "#12060A",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  pluto: {
    templateId: "pluto",
    theme: {
      mainColor: "#EFE7D6",
      accentColor: "#7A5A2A",
      accent2Color: "#1F4D3A",
      darkColor: "#2A1B1B",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  amalthea: {
    templateId: "amalthea",
    theme: {
      mainColor: "#F6FBFF",
      accentColor: "#0B1B2A",
      accent2Color: "#38BDF8",
      darkColor: "#0B1B2A",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  "kids-birthday": {
    templateId: "kids-birthday",
    theme: {
      mainColor: "#FFF7FB",
      accentColor: "#EC4899",
      accent2Color: "#60A5FA",
      darkColor: "#7C3AED",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
  jupiter: {
    templateId: "jupiter",
    theme: {
      mainColor: "#F7F3EA",
      accentColor: "#C5A059",
      accent2Color: "#38BDF8",
      darkColor: "#0D0D1F",
    },
    sections: {
      hero: {
        coverImage: DEMO_COVER_IMAGE_URL,
      },
    },
  },
};

export function buildInvitationDemoConfig({
  slug,
  templateId,
  purpose,
}: {
  slug: string;
  templateId: string;
  purpose: Purpose;
}): InvitationConfig {
  const seed = getInvitationPurposeSeed(purpose);
  const templateOverrides = DEMO_TEMPLATE_OVERRIDES[templateId] ?? { templateId };

  const gratitudeMessage = seed.sections.gratitude.message?.trim()
    ? seed.sections.gratitude.message
    : getDefaultGratitudeMessage(purpose);

  const next = mergeInvitationConfig(seed, {
    ...templateOverrides,
    sections: {
      ...(templateOverrides.sections ?? {}),
      gratitude: {
        enabled: true,
        message: gratitudeMessage,
      },
    },
    id: slug,
    templateId,
    purpose,
    metadata: {
      title: `Demo Invitation - ${templateId} | Activid`,
      description: `This is a demo preview of the ${templateId} invitation template.`,
      openGraph: {
        title: `Demo Invitation - ${templateId}`,
        description: `This is a demo preview of the ${templateId} invitation template.`,
        url: `https://activid.web.id/invitation/${slug}`,
      },
      twitter: {
        title: `Demo Invitation - ${templateId}`,
        description: `This is a demo preview of the ${templateId} invitation template.`,
      },
    },
  });

  const coverImage = next.sections.hero.coverImage;

  const withMetadata = mergeInvitationConfig(next, {
    metadata: {
      openGraph: {
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: next.metadata.title,
          },
        ],
      },
      twitter: {
        images: [coverImage],
      },
    },
  });

  return withRelativeDemoEventDates(withMetadata);
}

export const INVITATION_DEFAULTS: Record<string, InvitationConfig> = {
  "flow-demo": buildInvitationDemoConfig({
    slug: "flow-demo",
    templateId: "flow",
    purpose: "marriage",
  }),
  "saturn-demo": buildInvitationDemoConfig({
    slug: "saturn-demo",
    templateId: "saturn",
    purpose: "marriage",
  }),
  "venus-demo": buildInvitationDemoConfig({
    slug: "venus-demo",
    templateId: "venus",
    purpose: "marriage",
  }),
  "neptune-demo": buildInvitationDemoConfig({
    slug: "neptune-demo",
    templateId: "neptune",
    purpose: "marriage",
  }),
  "mercury-demo": buildInvitationDemoConfig({
    slug: "mercury-demo",
    templateId: "mercury",
    purpose: "marriage",
  }),
  "pluto-demo": buildInvitationDemoConfig({
    slug: "pluto-demo",
    templateId: "pluto",
    purpose: "marriage",
  }),
  "amalthea-demo": buildInvitationDemoConfig({
    slug: "amalthea-demo",
    templateId: "amalthea",
    purpose: "marriage",
  }),
  "kids-birthday-demo": buildInvitationDemoConfig({
    slug: "kids-birthday-demo",
    templateId: "kids-birthday",
    purpose: "birthday",
  }),
  "jupiter-demo": buildInvitationDemoConfig({
    slug: "jupiter-demo",
    templateId: "jupiter",
    purpose: "marriage",
  }),
};
