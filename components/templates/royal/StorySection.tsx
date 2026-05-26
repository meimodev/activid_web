"use client";

import { StoryItem } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Flourish } from "./graphics";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";
import { VineVertical } from "@/components/assets/vine-vertical";

interface StorySectionProps {
  stories: StoryItem[];
}

export function StorySection({ stories }: StorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <SectionWrap id="story">
      <div className="relative">
        <div className="absolute top-0 left-0 bottom-0 w-10 pointer-events-none z-0 overflow-hidden opacity-35">
          <VineVertical className="w-full h-full" />
        </div>
        <SectionHead eyebrow="How it began" title="Our" em="story" />
      </div>
      <div className="relative pl-9">
        <div
          className="absolute left-3.5 top-1.5 bottom-1.5 w-px opacity-50"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--invitation-accent) 10%, var(--invitation-accent) 90%, transparent)",
          }}
        />
        {stories.map((s, i) => {
          const dateInfo = deriveInvitationPrimaryDateInfo(s.date);
          const dateStr = dateInfo?.displayShort ?? s.date?.toString() ?? "";
          const title = s.title || "";
          return (
            <div key={i} className="relative mb-9">
              <div
                className="absolute left-[-29px] top-1.5 w-3 h-3 rotate-45"
                style={{
                  border: "1px solid var(--invitation-accent)",
                  background: "var(--invitation-bg)",
                  animation: `pulse-soft ${2 + i * 0.3}s ease-in-out infinite`,
                }}
              />
              <div className="font-[var(--font-royal-sans)] text-[10px] tracking-[0.18em] uppercase text-[var(--invitation-accent-light)]">
                {dateStr}
              </div>
              {title && (
                <div className="font-[var(--font-royal-serif)] font-light text-2xl text-[var(--invitation-text)] mt-1">
                  {title}
                </div>
              )}
              <div className="font-[var(--font-royal-serif)] text-sm leading-relaxed text-[var(--invitation-text-light)] mt-1.5">
                {s.description}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-3">
        <Flourish width={260} />
      </div>
    </SectionWrap>
  );
}
