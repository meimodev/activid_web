"use client";

import { EventDetail } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Sprig, RoseSm } from "./graphics";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";
import { VineOrnamental } from "@/components/assets/vine-ornamental";
import { Reveal } from "./graphics/reveal";

function EventCard({
  kind,
  title,
  when,
  where,
  address,
}: {
  kind: string;
  title: string;
  when: string;
  where: string;
  address: string;
}) {
  return (
    <div
      className="p-8 relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18))",
        border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
      }}
    >
      {/* Corner accents */}
      <span
        className="absolute -top-px -left-px w-3.5 h-3.5 border-l border-t border-[var(--invitation-accent)] opacity-70"
      />
      <span
        className="absolute -bottom-px -right-px w-3.5 h-3.5 border-r border-b border-[var(--invitation-accent)] opacity-70"
      />
      <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)] text-center">
        {kind}
      </div>
      <div className="font-[var(--font-royal-serif)] font-light text-[30px] text-[var(--invitation-text)] text-center mt-1.5">
        {title}
      </div>
      <div className="flex justify-center my-3.5">
        <Sprig width={80} />
      </div>
      <div className="grid gap-3 mt-2.5">
        <Row label="When" value={when} />
        <Row label="Where" value={where} />
        <Row label="Address" value={address} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[70px_1fr] gap-2 items-baseline">
      <div className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent)]">
        {label}
      </div>
      <div className="font-[var(--font-royal-serif)] text-sm text-[var(--invitation-text)] text-left">
        {value}
      </div>
    </div>
  );
}

interface EventSectionProps {
  events: EventDetail[];
}

export function EventSection({ events }: EventSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <SectionWrap id="events">
      <Reveal>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0 overflow-hidden opacity-40">
            <VineOrnamental className="w-full h-full" />
          </div>
          <SectionHead eyebrow="The celebration" title="Event" em="details" />
        </div>
      </Reveal>
      <div className="flex flex-col gap-6">
        {events.map((e, i) => {
          const dateInfo = deriveInvitationPrimaryDateInfo(e.date);
          return (
            <div key={i}>
              <Reveal delay={0.08 * i}>
                <EventCard
                  kind={i === 0 ? "Ceremony" : events.length > 1 ? "Reception" : "Event"}
                  title={e.title || (i === 0 ? "The Vows" : "The Banquet")}
                  when={dateInfo?.display ?? ""}
                  where={e.venue}
                  address={e.address}
                />
              </Reveal>
              {i < events.length - 1 && (
                <Reveal delay={0.12}>
                  <div className="text-center text-[var(--invitation-accent)] mt-3">
                    <RoseSm size={36} />
                  </div>
                </Reveal>
              )}
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}
