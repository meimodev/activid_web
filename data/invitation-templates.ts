export type InvitationTemplateListing = {
  id: string;
  templateId: string;
  title: string;
  video: string;
  tags: string[];
  priceOriginal: string;
  priceDiscount: string;
};

export type InvitationTemplateTheme = {
  id: string;
  title: string;
  mainColor: string;
  accentColor: string;
  accent2Color?: string;
  darkColor?: string;
};

const JUPITER_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/vbgby2wd7no73093qxpi9/cover-jupiter.mp4?rlkey=5zsk6843oadwlb1sbjs15d4c3&st=3sg4lz86&raw=1";
const AMALTHEA_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/r178zucgwqxapqyqw6ajp/cover-amalthea.mp4?rlkey=1sop6kyp39jx2iq6vqjg3k080&st=ye89deab&raw=1";
const KIDS_BIRTHDAY_TEMPLATE_LISTING_VIDEO = AMALTHEA_TEMPLATE_LISTING_VIDEO;
const PLUTO_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/wwq0rwtfkie9euynabrya/cover-pluto.mp4?rlkey=545p3ztpjqdkuhuoj68eh2wye&st=qnx0fsuj&raw=1";
const MERCURY_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/kcvvy9g4dibqu6zdn4x03/cover-mercury.mp4?rlkey=yhprmhutdod9vdc84t6t1a1hh&st=55cn2sea&raw=1";
const SATURN_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/ikbpbo7j08ybsn379pi26/cover-saturn.mp4?rlkey=3f6vk2gdcrpr2c6ez2ag0ivj3&st=vdud5ugr&raw=1";
const FLOW_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/iqkjwien6k1s43nszlhdp/cover-flow.mp4?rlkey=zbvw7kthvytdamnhu89p0cz87&st=c4ikn6nt&raw=1";
const VENUS_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/37vgv0kosi8r03e6q5uy4/cover-venus.mp4?rlkey=y8kekeeathod4jdjunnw9969r&st=47bibpc1&raw=1";
const NEPTUNE_TEMPLATE_LISTING_VIDEO =
  "https://www.dropbox.com/scl/fi/zs82qg0jzi4qpwntxowse/cover-neptune.mp4?rlkey=fesndch0v3vpmhscwd8swan6o&st=titl871c&raw=1";


export const INVITATION_TEMPLATE_THEMES: Record<string, InvitationTemplateTheme[]> = {
  flow: [
    {
      id: "classic",
      title: "Classic",
      mainColor: "#F9F7F2",
      accentColor: "#800020",
      accent2Color: "#C5A059",
      darkColor: "#2A1B1B",
    },
    {
      id: "emerald",
      title: "Emerald",
      mainColor: "#F9F7F2",
      accentColor: "#1F7A5C",
      accent2Color: "#C5A059",
      darkColor: "#0F2A22",
    },
  ],
  saturn: [
    {
      id: "night-gold",
      title: "Night Gold",
      mainColor: "#0B0D17",
      accentColor: "#D4AF37",
      accent2Color: "#22D3EE",
      darkColor: "#0B0D17",
    },
    {
      id: "deep-space-cyan",
      title: "Deep Space",
      mainColor: "#020615",
      accentColor: "#7DD3FC",
      accent2Color: "#D4AF37",
      darkColor: "#020615",
    },
  ],
  venus: [
    {
      id: "cream-gold",
      title: "Cream Gold",
      mainColor: "#F8F4EC",
      accentColor: "#C5A059",
      accent2Color: "#800020",
      darkColor: "#2B2424",
    },
    {
      id: "cream-maroon",
      title: "Cream Maroon",
      mainColor: "#F8F4EC",
      accentColor: "#800020",
      accent2Color: "#C5A059",
      darkColor: "#2B2424",
    },
  ],
  neptune: [
    {
      id: "daylight-cyan",
      title: "Daylight Cyan",
      mainColor: "#F8F4EC",
      accentColor: "#5E737A",
      accent2Color: "#C5A059",
      darkColor: "#020615",
    },
    {
      id: "midnight-gold",
      title: "Midnight Gold",
      mainColor: "#020615",
      accentColor: "#C5A059",
      accent2Color: "#7DD3FC",
      darkColor: "#020615",
    },
  ],
  mercury: [
    {
      id: "ivory-maroon",
      title: "Ivory Maroon",
      mainColor: "#F7F3EA",
      accentColor: "#612A35",
      accent2Color: "#C5A059",
      darkColor: "#12060A",
    },
    {
      id: "blush-maroon",
      title: "Blush Maroon",
      mainColor: "#FFF4F6",
      accentColor: "#612A35",
      accent2Color: "#C5A059",
      darkColor: "#12060A",
    },
  ],
  pluto: [
    {
      id: "sand-bronze",
      title: "Sand Bronze",
      mainColor: "#EFE7D6",
      accentColor: "#7A5A2A",
      accent2Color: "#1F4D3A",
      darkColor: "#2A1B1B",
    },
    {
      id: "pearl-forest",
      title: "Pearl Forest",
      mainColor: "#F3EFE7",
      accentColor: "#1F4D3A",
      accent2Color: "#7A5A2A",
      darkColor: "#101915",
    },
  ],
  eden: [
    {
      id: "garden-sage",
      title: "Garden Sage",
      mainColor: "#F4F7F2",
      accentColor: "#4A6741",
      accent2Color: "#C19A6B",
      darkColor: "#1E291C",
    },
    {
      id: "blush-flora",
      title: "Blush Flora",
      mainColor: "#FFF8F5",
      accentColor: "#A66D71",
      accent2Color: "#6B8E6B",
      darkColor: "#332223",
    },
  ],
  amalthea: [
    {
      id: "sky-navy",
      title: "Sky Navy",
      mainColor: "#F6FBFF",
      accentColor: "#0B1B2A",
      accent2Color: "#38BDF8",
      darkColor: "#0B1B2A",
    },
    {
      id: "mist-blue",
      title: "Mist Blue",
      mainColor: "#E7F5FF",
      accentColor: "#2B6CB0",
      accent2Color: "#7DD3FC",
      darkColor: "#123B63",
    },
  ],
  "kids-birthday": [
    {
      id: "cotton-candy",
      title: "Cotton Candy",
      mainColor: "#FFF7FB",
      accentColor: "#EC4899",
      accent2Color: "#60A5FA",
      darkColor: "#7C3AED",
    },
    {
      id: "ocean-explorer",
      title: "Ocean Explorer",
      mainColor: "#F0F9FF",
      accentColor: "#0369A1",
      accent2Color: "#F59E0B",
      darkColor: "#0C4A6E",
    },
    {
      id: "soccer-argentina",
      title: "Soccer Argentina",
      mainColor: "#EAF4FF",
      accentColor: "#1A6FC4",
      accent2Color: "#F5C400",
      darkColor: "#00205B",
    },
  ],
  jupiter: [
    {
      id: "ivory-gold",
      title: "Ivory Gold",
      mainColor: "#F7F3EA",
      accentColor: "#C5A059",
      accent2Color: "#38BDF8",
      darkColor: "#0D0D1F",
    },
    {
      id: "night-gold",
      title: "Night Gold",
      mainColor: "#0B0D17",
      accentColor: "#C5A059",
      accent2Color: "#38BDF8",
      darkColor: "#0B0D17",
    },
  ],
  "comic-book": [
    {
      id: "cosmic-commander",
      title: "Cosmic Commander",
      mainColor: "#0A1628",
      accentColor: "#3B82F6",
      accent2Color: "#06B6D4",
      darkColor: "#05101A",
    },
    {
      id: "mars-mission",
      title: "Mars Mission",
      mainColor: "#0D0808",
      accentColor: "#EF4444",
      accent2Color: "#F59E0B",
      darkColor: "#050202",
    },
    {
      id: "star-princess",
      title: "Star Princess",
      mainColor: "#1A0A1E",
      accentColor: "#EC4899",
      accent2Color: "#A855F7",
      darkColor: "#0D0412",
    },
    {
      id: "unicorn-dreams",
      title: "Unicorn Dreams",
      mainColor: "#0B1820",
      accentColor: "#E879F9",
      accent2Color: "#2DD4BF",
      darkColor: "#041014",
    },
  ],
  "arcade-retro": [
    {
      id: "cyber-arcade",
      title: "Cyber Arcade",
      mainColor: "#0c061a",
      accentColor: "#ff007f",
      accent2Color: "#00f0ff",
      darkColor: "#05020a",
    },
    {
      id: "gameboy-classic",
      title: "Gameboy Classic",
      mainColor: "#8bac0f",
      accentColor: "#306230",
      accent2Color: "#9bbc0f",
      darkColor: "#0f380f",
    },
    {
      id: "neon-sunset",
      title: "Neon Sunset",
      mainColor: "#1a052e",
      accentColor: "#ff5e00",
      accent2Color: "#ffe600",
      darkColor: "#0d021a",
    },
  ],
  royal: [
    {
      id: "aubergine-gold",
      title: "Aubergine Gold",
      mainColor: "#2b1a2e",
      accentColor: "#c9a961",
      accent2Color: "#f2e3d5",
      darkColor: "#1d1020",
    },
    {
      id: "cream-plum",
      title: "Cream Plum",
      mainColor: "#f2e3d5",
      accentColor: "#5c2a4d",
      accent2Color: "#c9a961",
      darkColor: "#2b1a2e",
    },
  ],
  candyland: [
    {
      id: "cotton-candy",
      title: "Cotton Candy",
      mainColor: "#FFF5F8",
      accentColor: "#EC4899",
      accent2Color: "#60A5FA",
      darkColor: "#7C3AED",
    },
    {
      id: "honey-peach",
      title: "Honey Peach",
      mainColor: "#FFFBEB",
      accentColor: "#F97316",
      accent2Color: "#EC4899",
      darkColor: "#7C2D12",
    },
  ],
};

export function getInvitationTemplateThemes(templateId: string): InvitationTemplateTheme[] {
  return INVITATION_TEMPLATE_THEMES[templateId] ?? INVITATION_TEMPLATE_THEMES.flow;
}

export const INVITATION_TEMPLATE_LISTINGS: InvitationTemplateListing[] = [
  {
    id: "flow-demo",
    templateId: "flow",
    title: "Flow",
    video: FLOW_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Maroon"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "saturn-demo",
    templateId: "saturn",
    title: "Saturn",
    video: SATURN_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Saturn"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "venus-demo",
    templateId: "venus",
    title: "Venus",
    video: VENUS_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Haruki"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "neptune-demo",
    templateId: "neptune",
    title: "Neptune",
    video: NEPTUNE_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Neptune"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "mercury-demo",
    templateId: "mercury",
    title: "Mercury",
    video: MERCURY_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Floral"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "pluto-demo",
    templateId: "pluto",
    title: "Pluto",
    video: PLUTO_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Pluto"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "eden-demo",
    templateId: "eden",
    title: "Eden",
    video: FLOW_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Garden", "Floral"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "amalthea-demo",
    templateId: "amalthea",
    title: "Amalthea",
    video: AMALTHEA_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Sky Blue"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "kids-birthday-demo",
    templateId: "kids-birthday",
    title: "Kids Birthday",
    video: KIDS_BIRTHDAY_TEMPLATE_LISTING_VIDEO,
    tags: ["Birthday", "Pastel"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "comic-book-demo",
    templateId: "comic-book",
    title: "Comic Book",
    video: KIDS_BIRTHDAY_TEMPLATE_LISTING_VIDEO,
    tags: ["Birthday", "Cosmic", "Comic"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "arcade-retro-demo",
    templateId: "arcade-retro",
    title: "Arcade Retro",
    video: KIDS_BIRTHDAY_TEMPLATE_LISTING_VIDEO,
    tags: ["Birthday", "Retro", "Gaming"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "jupiter-demo",
    templateId: "jupiter",
    title: "Jupiter",
    video: JUPITER_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Jupiter"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "royal-demo",
    templateId: "royal",
    title: "Royal",
    video: JUPITER_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Royal", "Art-Deco"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
  {
    id: "candyland-demo",
    templateId: "candyland",
    title: "Candyland",
    video: KIDS_BIRTHDAY_TEMPLATE_LISTING_VIDEO,
    tags: ["Birthday", "Pastel", "Candy"],
    priceOriginal: "450.000",
    priceDiscount: "120.000",
  },
];
