"use client";

import Image from "next/image";
import type { Host } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";

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
    <SectionWrap id="couple" title={title}>
      <div className="grid grid-cols-1 gap-10">
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
      <div className="rounded-3xl overflow-hidden border border-black/10 bg-white/60 backdrop-blur">
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
          <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">
            {variant === "groom" ? "Mempelai Pria" : "Mempelai Wanita"}
          </p>
          <h4 className={`mt-3 ${venusScript.className} text-4xl text-[#2B2424]`}>
            {name}
          </h4>
          <p className="mt-2 font-body text-sm text-[#2B2424]">{fullName}</p>
          <p className="mt-3 text-xs text-[#6B5B5B]">{parents}</p>
          {meta ? (
            <p className="mt-4 text-xs tracking-[0.25em] uppercase text-[#6B5B5B]">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </VenusReveal>
  );
}
