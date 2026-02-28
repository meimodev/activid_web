export interface Host {
    firstName: string;
    fullName: string;
    shortName: string;
    role: string;
    parents: string;
    photo: string;
}

export interface InvitationDate {
    year: number;
    month: number;
    day: number;
}

export interface InvitationTime {
    hour: number;
    minute: number;
}

export interface InvitationDateTime {
    date: InvitationDate;
    time: InvitationTime;
}

export interface WeddingDate {
    display: string;
    displayShort: string;
    countdownTarget: string; // ISO format
    rsvpDeadline: string;
}

export interface EventDetail {
    title: string;
    date: InvitationDateTime;
    venue: string;
    address: string;
    mapUrl: string;
}

export interface StoryItem {
    date: InvitationDateTime;
    description: string;
    imageUrl?: string;
    title?: string;
}

export interface BankAccount {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export interface MusicConfig {
    title?: string;
    url: string;
    autoPlay: boolean;
    loop: boolean;
}

export interface MetadataConfig {
    title: string;
    description: string;
    openGraph: {
        title: string;
        description: string;
        url: string;
        siteName: string;
        images: Array<{
            url: string;
            width: number;
            height: number;
            alt: string;
        }>;
        locale: string;
        type: string;
    };
    twitter: {
        card: string;
        title: string;
        description: string;
        images: string[];
    };
}

// Section Configs

export interface SectionBase {
    enabled: boolean;
}

export interface HeroSection extends SectionBase {
    subtitle: string;
    coverImage: string;
}

export interface TitleSection extends SectionBase {
    heading: string;
}

export interface CountdownSection extends SectionBase {
    heading: string;
    photos: string[]; // Carousel photos
}

export interface QuoteSection extends SectionBase {
    text: string;
    author: string;
}

export interface CoupleSection extends SectionBase {
   // Couple data is shared, this section config might just be for the UI component
   disableGrayscale?: boolean;
}

export interface HostsSection extends SectionBase {
   disableGrayscale?: boolean;
}

export interface StorySection extends SectionBase {
    heading: string;
    stories: StoryItem[];
}

export interface EventSection extends SectionBase {
    heading: string;
    events:
        | {
              holyMatrimony: EventDetail;
              reception: EventDetail;
              [key: string]: EventDetail;
          }
        | EventDetail[];
}

export interface GallerySection extends SectionBase {
    heading: string;
    photos: string[];
}

export interface RsvpSection extends SectionBase {
    heading: string;
    description: string;
    successMessage: string;
    alreadySubmittedMessage: string;
    seeYouMessage: string;
}

export interface GiftSection extends SectionBase {
    heading: string;
    description: string;
    bankAccounts: BankAccount[];
}

export interface WishesSection extends SectionBase {
    heading: string;
    placeholder: string;
    thankYouMessage: string;
}

export interface FooterSection extends SectionBase {
    message: string;
}

// Main Config Interface
export interface InvitationConfig {
    id: string; // matches document ID in firebase
    imagekitFolderKey?: string;
    templateId?: string; // e.g. "flow"
    theme?: {
        mainColor: string;
        accentColor: string;
    };
    purpose?: "marriage" | "birthday" | "event";
    metadata: MetadataConfig;
    music: MusicConfig;
    backgroundPhotos: string[];
    weddingDate: WeddingDate;

    hosts: Host[];

    sections: {
        hero: HeroSection;
        title: TitleSection;
        countdown: CountdownSection;
        quote: QuoteSection;
        hosts: HostsSection;
        story: StorySection;
        event: EventSection;
        gallery: GallerySection;
        rsvp: RsvpSection;
        gift: GiftSection;
        wishes: WishesSection;
        footer: FooterSection;
    };
}
