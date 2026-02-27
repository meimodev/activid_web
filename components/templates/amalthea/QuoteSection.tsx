"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

interface QuoteSectionProps {
  quote: {
    text: string;
    author: string;
  };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  if (!quote || !quote.text) return null;

  return (
    <section className="relative overflow-hidden bg-[#F6FBFF] pt-4 text-[#0B1B2A]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="relative mx-auto max-w-3xl translate-y-3">
          <div className="absolute -inset-x-8 -inset-y-10 rounded-[28px]" />
          <div className="relative overflow-hidden rounded-t-[28px] border-2 border-[#38BDF8]/30 px-6 py-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.12)] ">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[10px] rounded-t-[20px] border-[#38BDF8]/25 bg-[#0B1B2A]/80" />
            </div>

            <div className="relative z-10 pb-8">
              <RevealOnScroll
                direction="up"
                distance={18}
                delay={0.1}
                width="100%"
              >
                <blockquote className="mx-auto font-poppins text-[18px] leading-tight text-white ">
                  {quote.text}
                </blockquote>
              </RevealOnScroll>

              <RevealOnScroll
                direction="up"
                distance={18}
                delay={0.22}
                width="100%"
              >
                <p className="mt-1 font-poppins text-[18px] text-white/95 ">
                  ({quote.author})
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
