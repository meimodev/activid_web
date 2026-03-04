"use client";

import {
  WishesFirestore as NeptuneWishesFirestore,
} from "../neptune";
import { SectionWrap } from "./SectionWrap";

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
    <SectionWrap id="wishes" title={heading || "Friends Wishes"}>
      <div className="mx-auto w-full max-w-3xl">
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
      </div>
    </SectionWrap>
  );
}
