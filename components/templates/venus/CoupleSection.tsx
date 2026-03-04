"use client";

import Image from "next/image";
import type { Host } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";
import { OverlayReveal, VENUS_OVERLAY_ASSETS } from "./graphics";
import { motion } from "framer-motion";

export function CoupleSection({
  hosts,
  title,
}: {
  hosts: Host[];
  title: string;
}) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
    <SectionWrap id="couple" title={title} maskBackground>
      <div className="relative">
        {/* Decorative elements behind cards */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <OverlayReveal
            delay={0.1}
            className="absolute -left-12 top-0 h-[280px] w-[280px] opacity-70"
          >
            <motion.div
              className="h-full w-full bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${VENUS_OVERLAY_ASSETS.leafSide})` }}
              animate={{ x: [0, 8, 0], y: [0, -5, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </OverlayReveal>
          
          <OverlayReveal
            delay={0.2}
            className="absolute -right-12 bottom-0 h-[280px] w-[280px] scale-x-[-1] opacity-70"
          >
            <motion.div
              className="h-full w-full bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${VENUS_OVERLAY_ASSETS.leafSide})` }}
              animate={{ x: [0, -8, 0], y: [0, 5, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </OverlayReveal>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-10">
        {primary ? (
          <PersonCard
            variant="groom"
            name={primary.firstName}
            fullName={primary.fullName}
            meta={primary.role}
            parents={primary.parents}
            photo={primary.photo}
            revealDelay={0.18}
          />
        ) : null}
        {secondary ? (
          <PersonCard
            variant="bride"
            name={secondary.firstName}
            fullName={secondary.fullName}
            meta={secondary.role}
            parents={secondary.parents}
            photo={secondary.photo}
            revealDelay={0.28}
          />
        ) : null}
        </div>
      </div>
    </SectionWrap>
  );
}

function PersonCard({
  variant,
  name,
  fullName,
  meta,
  parents,
  photo,
  revealDelay,
}: {
  variant: "groom" | "bride";
  name: string;
  fullName: string;
  meta: string;
  parents: string;
  photo: string;
  revealDelay?: number;
}) {
  return (
    <VenusReveal direction="up" width="100%" delay={revealDelay}>
      <div className="rounded-3xl overflow-hidden border border-wedding-text/10 bg-wedding-bg/80 backdrop-blur shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
        <div className="aspect-[4/3] w-full overflow-hidden bg-black/5 relative">
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
            priority={false}
          />
        </div>
        <div className="p-6 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-wedding-text-light font-body">
            {variant === "groom" ? "Mempelai Pria" : "Mempelai Wanita"}
          </p>
          <h4 className={`mt-3 ${venusScript.className} text-4xl text-wedding-accent`}>
            {name}
          </h4>
          <p className="mt-2 font-body text-sm text-wedding-text">{fullName}</p>
          <p className="mt-3 text-xs text-wedding-text-light">{parents}</p>
          {meta ? (
            <p className="mt-4 text-xs tracking-[0.25em] uppercase text-wedding-text-light">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </VenusReveal>
  );
}
