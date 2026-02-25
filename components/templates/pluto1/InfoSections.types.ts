export interface CoupleInfo {
  groom: {
    firstName: string;
    fullName: string;
    shortName: string;
    role: string;
    parents: string;
    photo: string;
  };
  bride: {
    firstName: string;
    fullName: string;
    shortName: string;
    role: string;
    parents: string;
    photo: string;
  };
}

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
}

export interface EventsConfig {
  holyMatrimony: EventInfo;
  reception: EventInfo;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface TitleSectionProps {
  couple: CoupleInfo;
  date: string;
  heading: string;
  countdownTarget: string;
  galleryPhotos: string[];
  showCountdown?: boolean;
}

export interface CoupleSectionProps {
  couple: CoupleInfo;
}

export interface EventSectionProps {
  events: EventsConfig;
  heading: string;
}

export interface ConfirmationSectionProps {
  invitationId: string;
  rsvpDeadline: string;
}

export interface GiftSectionProps {
  bankAccounts: BankAccount[];
  heading: string;
  description: string;
  templateName: string;
  eventDate: string;
}

export interface FooterSectionProps {
  couple: CoupleInfo;
  message: string;
}
