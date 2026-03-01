import { InvitationConfig } from "@/types/invitation";
import { toInvitationIso } from "@/lib/date-time";

const dt = (year: number, month: number, day: number, hour = 0, minute = 0) =>
  toInvitationIso({ year, month, day, hour, minute }) ??
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;

const cd = (year: number, month: number, day: number) => dt(year, month, day, 0, 0);

type Purpose = "marriage" | "birthday" | "event";

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

export const INVITATION_PURPOSE_SEEDS: Record<Purpose, InvitationConfig> = {
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
      coverImage:
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
    }),
    music: {
      title: "Theme",
      url: "https://www.dropbox.com/scl/fi/836uloz6uqs28nlvk38sl/theme.mp3?rlkey=e53vsdwfkz59a13y2vngsbmuv&e=1&st=4c2q7ea2&dl=1",
      autoPlay: true,
      loop: true,
    },
    backgroundPhotos: [],
    weddingDate: {
      display: "01 Januari 2026",
      displayShort: "01 . 01 . 2026",
      countdownTarget: cd(2026, 1, 1),
      rsvpDeadline: "31 Desember 2025",
    },
    hosts: [
      {
        firstName: "Alex",
        fullName: "Alexandra Pratama",
        shortName: "Alex",
        role: "The Groom",
        parents: "Putra dari Bapak Hendra & Ibu Rina",
        photo:
          "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        firstName: "Maya",
        fullName: "Maya Aurelia",
        shortName: "Maya",
        role: "The Bride",
        parents: "Putri dari Bapak Samuel & Ibu Maria",
        photo:
          "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
    sections: {
      hero: {
        enabled: true,
        subtitle: "The Wedding",
        coverImage:
          "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      title: {
        enabled: true,
        heading: "The Wedding",
      },
      countdown: {
        enabled: true,
        heading: "Save The Date",
        photos: [
          "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=1200",
        ],
      },
      quote: {
        enabled: true,
        text: "Love is not just looking at each other, it's looking in the same direction.",
        author: "Antoine de Saint-Exupéry",
      },
      hosts: {
        enabled: true,
        disableGrayscale: false,
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
          "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      coverImage:
        "https://images.pexels.com/photos/847141/pexels-photo-847141.jpeg?auto=compress&cs=tinysrgb&w=1200",
    }),
    music: {
      title: "Theme",
      url: "https://www.dropbox.com/scl/fi/836uloz6uqs28nlvk38sl/theme.mp3?rlkey=e53vsdwfkz59a13y2vngsbmuv&e=1&st=4c2q7ea2&dl=1",
      autoPlay: true,
      loop: true,
    },
    backgroundPhotos: [],
    weddingDate: {
      display: "Sabtu, 12 April 2026",
      displayShort: "12 Apr 2026",
      countdownTarget: cd(2026, 4, 12),
      rsvpDeadline: "10 April 2026",
    },
    hosts: [
      {
        firstName: "Raka",
        fullName: "Raka Mahendra",
        shortName: "Raka",
        role: "Birthday Star",
        parents: "Putra dari Bapak Mahendra & Ibu Kristina",
        photo:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
    sections: {
      hero: {
        enabled: true,
        subtitle: "Birthday Party",
        coverImage:
          "https://images.pexels.com/photos/847141/pexels-photo-847141.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      title: {
        enabled: true,
        heading: "Birthday Party",
      },
      countdown: {
        enabled: true,
        heading: "Counting Down",
        photos: [
          "https://images.pexels.com/photos/847141/pexels-photo-847141.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1200",
        ],
      },
      quote: {
        enabled: true,
        text: "Make a wish, take a chance, make a change.",
        author: "",
      },
      hosts: {
        enabled: true,
        disableGrayscale: true,
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
          "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/847141/pexels-photo-847141.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      coverImage:
        "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200",
    }),
    music: {
      title: "Theme",
      url: "https://www.dropbox.com/scl/fi/836uloz6uqs28nlvk38sl/theme.mp3?rlkey=e53vsdwfkz59a13y2vngsbmuv&e=1&st=4c2q7ea2&dl=1",
      autoPlay: true,
      loop: true,
    },
    backgroundPhotos: [],
    weddingDate: {
      display: "Minggu, 02 Agustus 2026",
      displayShort: "02 Aug 2026",
      countdownTarget: cd(2026, 8, 2),
      rsvpDeadline: "01 Agustus 2026",
    },
    hosts: [
      {
        firstName: "Activid",
        fullName: "Activid Team",
        shortName: "Activid",
        role: "Organizer",
        parents: "",
        photo:
          "https://images.pexels.com/photos/3184307/pexels-photo-3184307.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
    sections: {
      hero: {
        enabled: true,
        subtitle: "The Event",
        coverImage:
          "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      title: {
        enabled: true,
        heading: "The Event",
      },
      countdown: {
        enabled: true,
        heading: "Starting Soon",
        photos: [
          "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200",
        ],
      },
      quote: {
        enabled: true,
        text: "Meet. Learn. Build.",
        author: "",
      },
      hosts: {
        enabled: true,
        disableGrayscale: false,
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
          "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/3184307/pexels-photo-3184307.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      footer: {
        enabled: true,
        message: "Terima kasih telah merayakan bersama Activid",
      },
    },
  },
};

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
        coverImage:
          "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  neptune: {
    templateId: "neptune",
    theme: {
      mainColor: "#020615",
      accentColor: "#7DD3FC",
      accent2Color: "#C5A059",
      darkColor: "#020615",
    },
    sections: {
      hero: {
        coverImage:
          "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        coverImage:
          "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
  const seed = INVITATION_PURPOSE_SEEDS[purpose] ?? INVITATION_PURPOSE_SEEDS.marriage;
  const templateOverrides = DEMO_TEMPLATE_OVERRIDES[templateId] ?? { templateId };

  const next = mergeInvitationConfig(seed, {
    ...templateOverrides,
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

  return mergeInvitationConfig(next, {
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
  "jupiter-demo": buildInvitationDemoConfig({
    slug: "jupiter-demo",
    templateId: "jupiter",
    purpose: "marriage",
  }),
};
