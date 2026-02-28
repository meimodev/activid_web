"use client";

import type { InvitationConfig } from "@/types/invitation";
import type { InvitationDateTime } from "@/types/invitation";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import { SectionWrap } from "./SectionWrap";
import { VenusReveal } from "./reveal";

export function StorySection({
  heading,
  stories,
}: {
  heading: string;
  stories: InvitationConfig["sections"]["story"]["stories"];
}) {
  return (
    <SectionWrap id="story" title={heading || "Story"}>
      <div className="space-y-10">
        {stories.map((s, idx) => (
          <StoryItem
            key={idx}
            date={s.date}
            description={s.description}
            revealDelay={0.18 + idx * 0.08}
          />
        ))}
      </div>
    </SectionWrap>
  );
}

function StoryItem({
  date,
  description,
  revealDelay,
}: {
  date: InvitationDateTime;
  description: string;
  revealDelay?: number;
}) {
  return (
    <VenusReveal direction="up" width="100%" delay={revealDelay}>
      <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-7">
        <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">
          {formatInvitationMonthYear(date)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#3A2F2F] whitespace-pre-line">
          {description}
        </p>
      </div>
    </VenusReveal>
  );
}
