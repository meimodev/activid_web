export type InvitationTemplateListing = {
  id: string;
  templateId: string;
  title: string;
  image: string;
  tags: string[];
  priceOriginal: string;
  priceDiscount: string;
};

export type InvitationTemplateTheme = {
  id: string;
  title: string;
  mainColor: string;
  accentColor: string;
};

export const INVITATION_TEMPLATE_THEMES: Record<string, InvitationTemplateTheme[]> = {
  flow: [
    {
      id: "classic",
      title: "Classic",
      mainColor: "#F9F7F2",
      accentColor: "#800020",
    },
    {
      id: "emerald",
      title: "Emerald",
      mainColor: "#F9F7F2",
      accentColor: "#1F7A5C",
    },
  ],
  saturn: [
    {
      id: "night-gold",
      title: "Night Gold",
      mainColor: "#0B0D17",
      accentColor: "#D4AF37",
    },
    {
      id: "deep-space-cyan",
      title: "Deep Space",
      mainColor: "#020615",
      accentColor: "#7DD3FC",
    },
  ],
  venus: [
    {
      id: "cream-gold",
      title: "Cream Gold",
      mainColor: "#F8F4EC",
      accentColor: "#C5A059",
    },
    {
      id: "cream-maroon",
      title: "Cream Maroon",
      mainColor: "#F8F4EC",
      accentColor: "#800020",
    },
  ],
  neptune: [
    {
      id: "midnight-cyan",
      title: "Midnight Cyan",
      mainColor: "#020615",
      accentColor: "#7DD3FC",
    },
    {
      id: "midnight-gold",
      title: "Midnight Gold",
      mainColor: "#020615",
      accentColor: "#C5A059",
    },
  ],
  mercury: [
    {
      id: "ivory-maroon",
      title: "Ivory Maroon",
      mainColor: "#F7F3EA",
      accentColor: "#612A35",
    },
    {
      id: "blush-maroon",
      title: "Blush Maroon",
      mainColor: "#FFF4F6",
      accentColor: "#612A35",
    },
  ],
  pluto: [
    {
      id: "sand-bronze",
      title: "Sand Bronze",
      mainColor: "#EFE7D6",
      accentColor: "#7A5A2A",
    },
    {
      id: "pearl-forest",
      title: "Pearl Forest",
      mainColor: "#F3EFE7",
      accentColor: "#1F4D3A",
    },
  ],
  amalthea: [
    {
      id: "sky-navy",
      title: "Sky Navy",
      mainColor: "#F6FBFF",
      accentColor: "#0B1B2A",
    },
    {
      id: "mist-blue",
      title: "Mist Blue",
      mainColor: "#F6FBFF",
      accentColor: "#2B6CB0",
    },
  ],
  jupiter: [
    {
      id: "ivory-gold",
      title: "Ivory Gold",
      mainColor: "#F7F3EA",
      accentColor: "#C5A059",
    },
    {
      id: "night-gold",
      title: "Night Gold",
      mainColor: "#0B0D17",
      accentColor: "#C5A059",
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
    image:
      "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Maroon"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "saturn-demo",
    templateId: "saturn",
    title: "Saturn",
    image:
      "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Saturn"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "venus-demo",
    templateId: "venus",
    title: "Venus",
    image:
      "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Haruki"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "neptune-demo",
    templateId: "neptune",
    title: "Neptune",
    image:
      "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Neptune"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "mercury-demo",
    templateId: "mercury",
    title: "Mercury",
    image:
      "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Floral"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "pluto-demo",
    templateId: "pluto",
    title: "Pluto",
    image:
      "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Pluto"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "amalthea-demo",
    templateId: "amalthea",
    title: "Amalthea",
    image:
      "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Sky Blue"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
  {
    id: "jupiter-demo",
    templateId: "jupiter",
    title: "Jupiter",
    image:
      "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Wedding", "Jupiter"],
    priceOriginal: "450.000",
    priceDiscount: "159.000",
  },
];
