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
      mainColor: "#F6FBFF",
      accentColor: "#2B6CB0",
      accent2Color: "#38BDF8",
      darkColor: "#0B1B2A",
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
    id: "amalthea-demo",
    templateId: "amalthea",
    title: "Amalthea",
    video: AMALTHEA_TEMPLATE_LISTING_VIDEO,
    tags: ["Wedding", "Sky Blue"],
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
];
