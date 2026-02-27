import { HeroContent } from './hero.types';

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface AboutUsPoint {
  text: string;
  highlight: string;
  suffix: string;
  highlight2: string; 
  suffix2?: string;
}

export interface AboutUsContent {
  title: string;
  tagline: string;
  image: string;
  heading: string;
  points: AboutUsPoint[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  color: string;
  buttonText: string;
  buttonLink: string;
}

export interface ServicesContent {
  title: string;
  items: ServiceItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsContent {
  title: string;
  items: TestimonialItem[];
}

export interface FooterLocation {
  name: string;
  address: string;
  mapLink: string;
}

export interface FooterContent {
  brand: {
    title: string;
    highlight: string;
  };
  locations: FooterLocation[];
  socials: Record<string, string>;
  legal: {
    privacy: { label: string; href: string };
    terms: { label: string; href: string };
    copyright: string;
  };
}

export interface CtaSectionContent {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

export interface ClientItem {
    name: string;
    logo: string;
}

export interface ClientsContent {
    title: string;
    subtitlePart1: string;
    items: ClientItem[];
}

// Service Pages Types

export interface ServicePageHeader {
    title: string;
    description: string | string[];
    image?: string;
    projectTitle?: string;
}

export interface ProjectItem {
    id?: string;
    client?: string;
    service?: string;
    title?: string;
    description: string;
    result?: string;
    image?: string;
    images?: string[];
    color?: string;
}

export interface ShowcaseItem {
    category: string;
    colors: string[];
    image: string;
    description: string;
}

export interface VideoThumbnail {
    src: string;
    alt: string;
}

export interface TechStack {
    title: string;
    description: string;
}

export interface BrandingPageContent {
    header: ServicePageHeader;
    projects: ProjectItem[];
}

export interface SocialMediaPageContent {
    header: ServicePageHeader;
    showcases: ShowcaseItem[];
}

export interface EventDocumentationPageContent {
    header: ServicePageHeader;
    projects: ProjectItem[];
    overview: { title: string; content: string; };
}

export interface VideoPodcastPageContent {
    header: ServicePageHeader;
    mainProject: {
        title: string;
        description: string;
        result: string;
        image: string;
    };
    thumbnails: VideoThumbnail[];
}

export interface WebsiteAppPageContent {
    header: ServicePageHeader;
    mockups: string[];
    techStack: TechStack;
}

export interface ProductPhotographyPageContent {
    header: ServicePageHeader;
    projects: ProjectItem[];
    overview: { title: string; content: string; };
}

export interface ContactMethod {
    label: string;
    value: string;
    href: string;
}

export interface OfficeLocation {
    city: string;
    type: string;
    address: string | string[];
    mapLink: string;
    image: string;
}

export interface ContactPageContent {
    header: {
        title: string;
        subtitle: string;
    };
    methods: {
        whatsapp: ContactMethod;
        email: ContactMethod;
        instagram: ContactMethod;
    };
    officesTitle: string;
    offices: OfficeLocation[];
}

export interface ServicePagesContent {
    branding: BrandingPageContent;
    socialMedia: SocialMediaPageContent;
    eventDocumentation: EventDocumentationPageContent;
    videoPodcast: VideoPodcastPageContent;
    websiteApp: WebsiteAppPageContent;
    productPhotography: ProductPhotographyPageContent;
}

export interface SiteContent {
  navigation: NavigationItem[];
  hero: HeroContent;
  aboutUs: AboutUsContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  footer: FooterContent;
  ctaSection: CtaSectionContent;
  clients: ClientsContent;
  servicePages: ServicePagesContent;
  contactPage: ContactPageContent;
}
