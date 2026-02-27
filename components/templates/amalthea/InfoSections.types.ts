import type { InvitationConfig } from "@/types/invitation";

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

export type EventsConfig = InvitationConfig["sections"]["event"]["events"];

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
  purpose?: InvitationConfig["purpose"];
}

export interface HostSectionProps {
  couple: CoupleInfo;
  purpose?: InvitationConfig["purpose"];
}

export interface EventSectionProps {
  events: EventsConfig;
  heading: string;
  purpose?: InvitationConfig["purpose"];
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
