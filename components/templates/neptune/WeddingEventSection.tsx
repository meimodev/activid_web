"use client";

import type { InvitationDateTimeValue } from "@/types/invitation";

import { SplitText } from "@/components/animations";
import {
  formatInvitationDateLong,
  formatInvitationTime,
} from "@/lib/date-utils";

import { neptuneScript, neptuneSerif } from "./fonts";
import {
  ClassicFlourishDivider,
  IconClock,
  IconPin,
  NEPTUNE_OVERLAY_ASSETS,
  NeptuneOverlayFloat,
} from "./graphics";
import { NeptuneReveal } from "./reveal";
import type { NavSectionId } from "./types";

export function WeddingEventSection({
  id,
  heading,
  events,
}: {
  id: NavSectionId;
  heading: string;
  events: Array<{
    key: string;
    title: string;
    date: InvitationDateTimeValue;
    venue: string;
    address: string;
    mapUrl: string;
  }>;
}) {
  const words = heading.trim().split(/\s+/);
  const topWord = words[0] ?? "Wedding";
  const scriptWord = words.slice(1).join(" ") || "Event";

  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-wedding-dark text-wedding-on-dark px-6 pt-18 pb-20"
    >
      <div className="absolute inset-0 bg-linear-to-b from-wedding-accent-2/20 via-wedding-dark to-wedding-dark" />
      <div className="absolute inset-0 pointer-events-none">
        <NeptuneReveal
          direction="up"
          delay={0.12}
          className="absolute -left-10 top-16 "
        >
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
            alt=""
            className="w-[150px]  opacity-45"
            amplitude={5.2}
            duration={8.8}
            rotate={1.2}
            breeze
            loading="lazy"
            draggable={false}
          />
        </NeptuneReveal>

        <NeptuneReveal
          direction="up"
          delay={0.22}
          className="absolute -right-10 bottom-10 "
        >
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.leafRight}
            alt=""
            className="w-[160px]  opacity-42"
            amplitude={5.4}
            duration={9.2}
            delay={0.16}
            rotate={-1.2}
            breeze
            loading="lazy"
            draggable={false}
          />
        </NeptuneReveal>
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <NeptuneReveal direction="up" width="100%" delay={0.18}>
          <div className="flex items-start gap-4">
            <div className="leading-none">
              <div
                className={`${neptuneSerif.className} text-6xl text-wedding-on-dark/95`}
              >
                <SplitText text={topWord} splitBy="word" staggerDelay={0.1} />
              </div>
              <div
                className={`${neptuneScript.className} mt-2 text-5xl text-wedding-on-dark/90`}
              >
                <SplitText
                  text={scriptWord}
                  splitBy="word"
                  staggerDelay={0.12}
                />
              </div>
            </div>
            <div className="mt-6 h-px flex-1 bg-wedding-on-dark/55" />
          </div>
        </NeptuneReveal>

        <div className="mt-10 space-y-10">
          {events.map((e, idx) => (
            <NeptuneReveal
              key={e.key}
              width="100%"
              direction="up"
              delay={0.35 + idx * 0.25}
            >
              <EventCardClassic
                title={e.title}
                date={e.date}
                venue={e.venue}
                address={e.address}
                mapUrl={e.mapUrl}
              />
            </NeptuneReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCardClassic({
  title,
  date,
  venue,
  address,
  mapUrl,
}: {
  title: string;
  date: InvitationDateTimeValue;
  venue: string;
  address: string;
  mapUrl: string;
}) {
  const isLinkOnly = Boolean(mapUrl) && !address && !venue;

  return (
    <div className="relative rounded-[28px] bg-wedding-bg text-wedding-text shadow-[0_26px_70px_color-mix(in_srgb,var(--invitation-dark)_35%,transparent)]">
      <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_25%_20%,color-mix(in_srgb,var(--invitation-dark)_6%,transparent),transparent_60%),radial-gradient(circle_at_80%_70%,color-mix(in_srgb,var(--invitation-dark)_5%,transparent),transparent_55%)] opacity-50" />
      <div className="relative rounded-[28px] border border-wedding-text/10 px-8 py-12">
        <h4
          className={`${neptuneSerif.className} text-6xl leading-none text-wedding-accent text-center`}
        >
          <SplitText text={title} splitBy="word" staggerDelay={0.1} />
        </h4>
        <div className="mt-7 flex justify-center">
          <div className="text-wedding-text-light">
            <ClassicFlourishDivider />
          </div>
        </div>

        {!isLinkOnly ? (
          <div className="mt-7 text-center">
            {date ? (
              <p className="text-md leading-none tracking-[0.14em] uppercase text-wedding-text font-body">
                {formatInvitationDateLong(date)}
              </p>
            ) : null}

            <div className="mt-7 flex items-center justify-center gap-3 text-wedding-text-light">
              {date ? (
                <>
                  <IconClock />
                  <p className="text-[22px] tracking-[0.22em] uppercase font-body">
                    {formatInvitationTime(date)}
                  </p>
                </>
              ) : null}
            </div>

            {venue ? (
              <p className="mt-6 text-md font-semibold text-wedding-text font-body">
                {venue}
              </p>
            ) : null}
            {address ? (
              <p className="mt-2 text-xl leading-tight text-wedding-text font-body whitespace-pre-line">
                {address}
              </p>
            ) : null}
          </div>
        ) : null}

        {mapUrl ? (
          <div className="mt-10 flex justify-center">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-wedding-text/30 bg-transparent px-10 py-4 text-wedding-text hover:bg-wedding-text/5 transition"
            >
              <IconPin />
              <span className="text-md font-semibold font-body">
                {title.toLowerCase().includes("live") ||
                title.toLowerCase().includes("stream")
                  ? "Open Link"
                  : "Link Map"}
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
