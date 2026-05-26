"use client";

import { SectionWrap } from "./SectionWrap";
import { Flourish, GrandDivider } from "./graphics";
import { VineWavy } from "@/components/assets/vine-wavy";

interface QuoteSectionProps {
  text: string;
  author: string;
}

export function QuoteSection({ text, author }: QuoteSectionProps) {
  return (
    <SectionWrap
      className="text-center !px-7 overflow-hidden"
      style={{ padding: "88px 28px" }}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-0 overflow-hidden">
          <VineWavy className="w-full h-full opacity-50" />
        </div>
        <div className="flex justify-center mb-4.5">
          <Flourish width={320} />
        </div>
      </div>
      <div
        className="text-[var(--invitation-accent)] text-[96px] leading-none font-[var(--font-royal-script)] pt-[0.1em]"
      >
        &ldquo;
      </div>
      <p
        className="font-[var(--font-royal-serif)] italic text-2xl leading-relaxed text-[var(--invitation-text)] max-w-[320px] mx-auto my-5"
      >
        {text}
      </p>
      <div className="mt-6">
        <GrandDivider width={220} />
      </div>
      <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.3em] uppercase text-[var(--invitation-accent-light)] mt-3.5">
        &mdash; {author || "a vow, unspoken"}
      </div>
      <div className="flex justify-center mt-5.5 rotate-180">
        <Flourish width={320} />
      </div>
    </SectionWrap>
  );
}
