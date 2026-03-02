"use client";

import type { InvitationConfig } from "@/types/invitation";
import type { InvitationDateTimeValue } from "@/types/invitation";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";
import { SectionWrap } from "./SectionWrap";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";

export function EventSection({
  events,
  heading,
}: {
  events: InvitationConfig["sections"]["event"]["events"];
  heading: string;
}) {
  const list = events
    .map((e, idx) => ({ key: String(idx), ...e }))
    .filter((e) => Boolean(e?.title));

  return (
    <SectionWrap id="event" title={heading || "Event"}>
      <div className="grid grid-cols-1 gap-6">
        {list.map((e, idx) => (
          <EventCard
            key={e.key}
            title={e.title}
            date={e.date}
            venue={e.venue}
            address={e.address}
            mapUrl={e.mapUrl}
            revealDelay={0.16 + idx * 0.12}
          />
        ))}
      </div>
    </SectionWrap>
  );
}

function EventCard({
  title,
  date,
  venue,
  address,
  mapUrl,
  revealDelay,
}: {
  title: string;
  date: InvitationDateTimeValue;
  venue: string;
  address: string;
  mapUrl: string;
  revealDelay?: number;
}) {
  const isLinkOnly = Boolean(mapUrl) && !address && !venue;

  return (
    <VenusReveal direction="up" width="100%" delay={revealDelay}>
      <div className="rounded-3xl border border-wedding-text/10 bg-wedding-bg/60 backdrop-blur p-6">
        <div className="text-center">
          <h4 className={`${venusScript.className} text-4xl leading-none text-wedding-text`}>
            {title}
          </h4>

          {!isLinkOnly ? (
            <div className="mt-5 space-y-2 text-sm text-wedding-text">
              {date ? <p className="font-body">{formatInvitationDateLong(date)}</p> : null}
              {date ? (
                <p className="text-wedding-text-light">{formatInvitationTime(date)}</p>
              ) : null}
              {venue ? <p className="font-body">{venue}</p> : null}
              {address ? (
                <p className="text-wedding-text-light whitespace-pre-line">{address}</p>
              ) : null}
            </div>
          ) : null}

          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center w-full rounded-full px-5 py-3 border border-wedding-text/10 bg-wedding-bg/60 hover:bg-wedding-bg transition"
            >
              <span className="text-xs uppercase tracking-[0.25em] font-body text-wedding-text">
                {title.toLowerCase().includes("live") ||
                title.toLowerCase().includes("stream")
                  ? "Open Link"
                  : "Google Map"}
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </VenusReveal>
  );
}
