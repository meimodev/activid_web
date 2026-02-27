"use client";

import Image from "next/image";
import type { InvitationConfig } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";

export function CoupleSection({
  couple,
  title,
}: {
  couple: InvitationConfig["couple"];
  title: string;
}) {
  return (
    <SectionWrap id="couple" title={title}>
      <div className="grid grid-cols-1 gap-10">
        <PersonCard
          variant="groom"
          name={couple.groom.firstName}
          fullName={couple.groom.fullName}
          meta={couple.groom.role}
          parents={couple.groom.parents}
          photo={couple.groom.photo}
          revealDelay={0.18}
        />
        <PersonCard
          variant="bride"
          name={couple.bride.firstName}
          fullName={couple.bride.fullName}
          meta={couple.bride.role}
          parents={couple.bride.parents}
          photo={couple.bride.photo}
          revealDelay={0.28}
        />
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
