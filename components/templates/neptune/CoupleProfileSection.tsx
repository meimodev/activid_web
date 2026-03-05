"use client";

import Image from "next/image";
import type { Host } from "@/types/invitation";

import { SplitText } from "@/components/animations";

import { neptuneScript, neptuneSerif } from "./fonts";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";
import { NeptuneStagger } from "./reveal";

export function CoupleProfileSection({
  hosts,
  inviteLine,
}: {
  hosts: Host[];
  inviteLine: string;
}) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
    <section id="couple" className="relative scroll-mt-24">
      <CoupleProfileCard
        id="hosts-1"
        intro={inviteLine}
        nameScript={primary?.firstName ?? ""}
        nameFull={primary?.fullName ?? ""}
        city={primary?.role ?? ""}
        parents={primary?.parents ?? ""}
        photo={primary?.photo ?? ""}
        isBride={false}
        showAnd={false}
      />
      {secondary ? (
        <CoupleProfileCard
          id="hosts-2"
          intro={null}
          nameScript={secondary.firstName}
          nameFull={secondary.fullName}
          city={secondary.role}
          parents={secondary.parents}
          photo={secondary.photo}
          isBride={true}
          showAnd
        />
      ) : null}
    </section>
  );
}

function CoupleProfileCard({
  id,
  intro,
  nameScript,
  nameFull,
  city,
  parents,
  photo,
  isBride,
  showAnd,
}: {
  id: string;
  intro: string | null;
  nameScript: string;
  nameFull: string;
  city: string;
  parents: string;
  photo: string;
  isBride: boolean;
  showAnd: boolean;
}) {
  return (
    <section
      id={id}
      className="relative min-h-[820px] overflow-hidden bg-wedding-bg text-wedding-text px-6 pt-16"
    >
      <NeptuneStagger
        className="relative z-10 max-w-md mx-auto text-center"
        baseDelay={0.12}
      >
        {showAnd ? (
          <div className="flex items-center justify-center gap-4 text-xs tracking-[0.35em] uppercase text-wedding-text-light">
            <div className="h-px w-16 bg-wedding-text/20" />
            <span
              className={`${neptuneSerif.className} text-sm tracking-[0.32em]`}
            >
              AND
            </span>
            <div className="h-px w-16 bg-wedding-text/20" />
          </div>
        ) : null}

        {intro ? (
          <div className="mt-4 flex justify-center">
            <NeptuneOverlayFloat
              src={NEPTUNE_OVERLAY_ASSETS.flourishes}
              alt=""
              className="w-[240px] max-w-[72vw]"
              amplitude={4.6}
              duration={8.1}
              loading="lazy"
              draggable={false}
            />
          </div>
        ) : null}
        {intro ? (
          <p className="mt-6 text-lg leading-relaxed text-wedding-text-light">
            {intro}
          </p>
        ) : null}

        <div className={intro ? "mt-10" : "mt-14"}>
          <ArchedPortrait
            photo={photo}
            alt={nameScript}
            flowerSide={isBride ? "left" : "right"}
          />
        </div>

        <p
          className={`${neptuneScript.className} mt-10 text-5xl leading-none text-wedding-accent-light`}
        >
          <SplitText
            text={nameScript}
            splitBy="character"
            staggerDelay={0.045}
          />
        </p>
        <p
          className={`${neptuneSerif.className} mt-5 text-4xl leading-none text-wedding-text`}
        >
          {nameFull}
        </p>
        <p className="mt-6 text-xl font-bold text-wedding-text font-body">
          {city}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-wedding-text-light">
          {parents}
        </p>

        <div className="pt-10 -mx-6 pointer-events-none">
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.flowerDivider}
            alt=""
            className="w-full"
            amplitude={4.8}
            duration={8.6}
            delay={0.2}
            loading="lazy"
            draggable={false}
          />
        </div>
      </NeptuneStagger>
    </section>
  );
}

function ArchedPortrait({
  photo,
  alt,
  flowerSide,
}: {
  photo: string;
  alt: string;
  flowerSide: "left" | "right";
}) {
  return (
    <div className="flex justify-center">
      <div className="relative w-[260px] ">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
          {flowerSide === "left" ? (
            <NeptuneOverlayFloat
              src={NEPTUNE_OVERLAY_ASSETS.flower}
              alt=""
              className="absolute top-1/2 -translate-y-1/2 -left-40 w-40 opacity-80 scale-x-[-1]"
              amplitude={5.8}
              duration={8.8}
              rotate={1.6}
              breeze
              loading="lazy"
              draggable={false}
            />
          ) : null}
          {flowerSide === "right" ? (
            <NeptuneOverlayFloat
              src={NEPTUNE_OVERLAY_ASSETS.flower}
              alt=""
              className="absolute top-1/2 -translate-y-1/2 -right-40 w-40 opacity-80 scale-x-[-1]"
              amplitude={5.8}
              duration={8.8}
              delay={0.25}
              rotate={-1.6}
              breeze
              loading="lazy"
              draggable={false}
            />
          ) : null}
        </div>

        <div className="relative z-10 rounded-t-[999px] rounded-b-none border border-wedding-text/25 bg-wedding-bg p-[7px] shadow-[0_16px_50px_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]">
          <div className="relative aspect-[4/4.3] rounded-t-[999px] rounded-b-none overflow-hidden border border-wedding-text/25 bg-wedding-bg">
            <Image
              src={photo}
              alt={alt}
              fill
              sizes="320px"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
