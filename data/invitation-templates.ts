export type InvitationTemplateListing = {
  id: string;
  templateId: string;
  title: string;
  image: string;
  tags: string[];
  priceOriginal: string;
  priceDiscount: string;
};

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
