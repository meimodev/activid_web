"use client";

import {
  GiftBlock as NeptuneGiftBlock,
  GiftSectionClassic,
} from "../neptune";

export function GiftSection({
  bankAccounts,
  description,
  heading,
  templateName,
  eventDate,
}: {
  heading: string;
  bankAccounts: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
  description: string;
  templateName: string;
  eventDate: string;
}) {
  return (
    <GiftSectionClassic id="gift" heading={heading || "Wedding Gift"}>
      <NeptuneGiftBlock
        bankAccounts={bankAccounts}
        description={description}
        templateName={templateName}
        eventDate={eventDate}
        uiVariant="classic"
      />
    </GiftSectionClassic>
  );
}
