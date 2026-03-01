"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { FooterSectionProps } from "./InfoSections.types";
import { DateTime } from "luxon";

export function FooterSection({ hosts, message }: FooterSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;
  const year = DateTime.now().year;

  void message;

  return (
    <footer className="relative overflow-hidden bg-wedding-dark border-t border-wedding-on-dark/10">
      <div className="absolute inset-0 opacity-12 bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')]" />
      <div className="absolute inset-0 bg-linear-to-b from-wedding-dark/0 via-wedding-dark/20 to-wedding-dark/55" />

      <div className="relative px-6 py-14">
        <div className="max-w-3xl mx-auto text-center text-wedding-on-dark">
          <RevealOnScroll
            direction="up"
            width="100%"
            delay={0.15}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-on-dark/10 border border-wedding-on-dark/20 text-xs font-mono text-wedding-on-dark/90 backdrop-blur-md relative overflow-hidden">
              <span className="relative w-2 h-2 rounded-full bg-wedding-accent shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent)_55%,transparent)]" />
              <span className="relative">{names}</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.35}>
            <h3 className="font-tan-mon-cheri mt-12 text-[44px] leading-none text-wedding-on-dark">
              Misi Selesai!
            </h3>
            <p className="font-poppins mt-4 text-sm text-wedding-on-dark/75 whitespace-pre-line">
              Kabar bahagia berhasil disebar diseluruh pelosok antariksa
            </p>
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.55}>
            <div className="mt-7 flex items-center justify-center">
              <a
                href="https://invitation.activid.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 bg-wedding-on-dark/10 border border-wedding-on-dark/20 text-xs font-mono text-wedding-on-dark backdrop-blur-md transition-all hover:border-wedding-on-dark/35 hover:bg-wedding-on-dark/15"
              >
                <span className="uppercase tracking-[0.25em]">
                  Kembali Pulang 🚀
                </span>
              </a>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.75}>
            <div className="mt-10 h-px w-full bg-wedding-on-dark/15" />
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.95}>
            <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-wedding-on-dark/55 font-poppins">
              © {year} Activid Invitation
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </footer>
  );
}
