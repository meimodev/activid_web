"use client";

import { Host } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Arch, PhotoPlaceholder, BloomStar } from "./graphics";
import { Vine } from "@/components/assets/vine";
import { Reveal } from "./graphics/reveal";

function Person({
  role,
  name,
  parents,
}: {
  role: string;
  name: string;
  parents: string;
}) {
  return (
    <div className="text-center">
      <div>
        <Arch w={180} h={240}>
          <PhotoPlaceholder label={`${role.toUpperCase()} PHOTO`} />
        </Arch>
      </div>
      <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent)] mt-4">
        {role}
      </div>
      <div className="font-[var(--font-royal-script)] text-[52px] leading-[1.25] text-[var(--invitation-accent)] mt-1.5 py-[0.05em] shimmer-text">
        {name}
      </div>
      <div className="font-[var(--font-royal-serif)] text-sm text-[var(--invitation-text-light)] mt-2.5">
        {parents}
      </div>
    </div>
  );
}

interface CoupleSectionProps {
  hosts: Host[];
}

export function CoupleSection({ hosts }: CoupleSectionProps) {
  const bride = hosts[0];
  const groom = hosts[1];

  return (
    <SectionWrap id="couple">
      <Reveal>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-0 overflow-hidden">
            <Vine className="w-full h-full" />
          </div>
          <SectionHead
            eyebrow="With joyful hearts"
            title="The"
            em="couple"
            sub="Together with their families, they ask for your blessing on this sacred day."
          />
        </div>
      </Reveal>
      <div className="flex flex-col gap-11">
        {bride && (
          <Reveal delay={0.1}>
            <Person
              role="The Bride"
              name={bride.fullName || bride.firstName}
              parents={bride.parents}
            />
          </Reveal>
        )}
        <Reveal delay={0.15}>
          <div className="text-center text-[var(--invitation-accent)] relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-55 pointer-events-none">
              <BloomStar size={80} />
            </div>
            <span className="font-[var(--font-royal-script)] text-[64px] relative">&amp;</span>
          </div>
        </Reveal>
        {groom && (
          <Reveal delay={0.2}>
            <Person
              role="The Groom"
              name={groom.fullName || groom.firstName}
              parents={groom.parents}
            />
          </Reveal>
        )}
      </div>
    </SectionWrap>
  );
}
