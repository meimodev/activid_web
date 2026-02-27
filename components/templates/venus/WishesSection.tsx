"use client";

import {
  WishesFirestore as NeptuneWishesFirestore,
  WishesSectionClassic,
} from "../neptune";

export function WishesSection({
  invitationId,
  inviteeName,
  heading,
  placeholder,
  thankYouMessage,
}: {
  invitationId: string;
  inviteeName: string | null;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
}) {
  return (
    <WishesSectionClassic id="wishes" heading={heading || "Friends Wishes"}>
      <NeptuneWishesFirestore
        invitationId={invitationId}
        inviteeName={inviteeName}
        placeholder={placeholder}
        thankYouMessage={
          thankYouMessage || "Terima kasih atas konfirmasi dan ucapannya."
        }
        mode="both"
        withAttendance={false}
        submitLabel="Kirim Ucapan"
        uiVariant="classic"
      />
    </WishesSectionClassic>
  );
}
