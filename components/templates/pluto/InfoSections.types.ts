import type { Host, InvitationConfig } from "@/types/invitation";

export type EventsConfig = InvitationConfig["sections"]["event"]["events"];

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
  countdownTarget: string;
  galleryPhotos: string[];
  showCountdown?: boolean;
}

export interface CoupleSectionProps {
  hosts: Host[];
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
  hosts: Host[];
  message: string;
}
