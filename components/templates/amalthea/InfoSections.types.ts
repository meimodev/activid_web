import type { InvitationConfig } from "@/types/invitation";

export type Hosts = InvitationConfig["hosts"];

export type EventsConfig = InvitationConfig["sections"]["event"]["events"];

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface TitleSectionProps {
  hosts: Hosts;
  date: string;
  heading: string;
  countdownTarget: string;
  galleryPhotos: string[];
  showCountdown?: boolean;
  purpose?: InvitationConfig["purpose"];
}

export interface HostSectionProps {
  hosts: Hosts;
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
  hosts: Hosts;
  message: string;
}
