"use client";

import { VerticalLine, HeartDivider, GoldLeafBorder } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { Host } from "@/types/invitation";

interface CoupleSectionProps {
  hosts: Host[];
  disableGrayscale?: boolean;
}

export function CoupleSection({ hosts, disableGrayscale = false }: CoupleSectionProps) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
    <section className="section-curved py-24 bg-wedding-bg-alt/90 backdrop-blur-md relative border-b border-wedding-accent/30">
      <GoldLeafBorder position="top" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-16 ">
          {/* Groom */}
          <div className="text-center group">
            <RevealOnScroll direction="right" delay={0.2} width="100%">
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden mb-8 border border-wedding-accent p-2 shadow-xl bg-wedding-bg rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src={primary?.photo ?? ""}
                  alt="Groom"
                  className={`w-full h-full object-cover rounded-full transition-all duration-700 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4} width="100%">
              <h3 className="font-stoic text-6xl text-wedding-accent mb-2">{primary?.firstName ?? ""}</h3>
              <p className="font-garet-book text-xl mb-4 text-wedding-dark">{primary?.fullName ?? ""}</p>
              <div className="w-12 h-px bg-wedding-accent mx-auto mb-4"></div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.5} width="100%">
              <p className="font-body text-sm text-wedding-text-light italic">{primary?.role ?? ""}</p>
              <p className="font-body text-xs text-wedding-text-light mt-2 uppercase tracking-wider">{primary?.parents ?? ""}</p>
            </RevealOnScroll>
          </div>

          <div className="hidden flex-col items-center">
            <RevealOnScroll direction="down" delay={0.4}><VerticalLine /></RevealOnScroll>
            <RevealOnScroll delay={0.6}><HeartDivider /></RevealOnScroll>
            <RevealOnScroll direction="up" delay={0.4}><VerticalLine /></RevealOnScroll>
          </div>

          {/* Bride */}
          {secondary ? (
            <div className="text-center group">
              <RevealOnScroll direction="left" delay={0.2} width="100%">
                <div className="w-64 h-64 mx-auto rounded-full overflow-hidden mb-8 border border-wedding-accent p-2 shadow-xl bg-wedding-bg -rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <img
                    src={secondary.photo}
                    alt="Bride"
                    className={`w-full h-full object-cover rounded-full transition-all duration-700 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                  />
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.4} width="100%">
                <h3 className="font-brittany-signature text-6xl text-wedding-accent mb-2 leading-[1.1] py-1">
                  {secondary.firstName}
                </h3>
                <p className="font-garet-book text-xl mb-4 text-wedding-dark">{secondary.fullName}</p>
                <div className="w-12 h-px bg-wedding-accent mx-auto mb-4"></div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.5} width="100%">
                <p className="font-poppins-bold text-sm text-wedding-text-light italic">{secondary.role}</p>
                <p className="font-garet-book text-xs text-wedding-text-light mt-2 uppercase tracking-wider">{secondary.parents}</p>
              </RevealOnScroll>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
