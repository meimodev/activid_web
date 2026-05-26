"use client";

import { Host } from "@/types/invitation";
import { Flourish } from "./graphics";

interface FooterSectionProps {
  hosts: Host[];
}

export function FooterSection({ hosts }: FooterSectionProps) {
  return (
    <div className="text-center pt-6 pb-16 px-6">
      <div className="flex justify-center mb-4">
        <Flourish width={240} />
      </div>
      <div className="font-[var(--font-royal-script)] text-[28px] text-[var(--invitation-accent)]">
        {hosts?.[0]?.fullName ?? hosts?.[0]?.firstName ?? ""}
        {hosts && hosts.length >= 2 && (
          <>
            {" "}&amp;{" "}
            {hosts[1]?.fullName ?? hosts[1]?.firstName ?? ""}
          </>
        )}
      </div>
      <div
        className="mt-4 font-[var(--font-royal-sans)] text-[10px] tracking-[0.3em] uppercase"
        style={{
          color: "color-mix(in srgb, var(--invitation-text) 40%, transparent)",
        }}
      >
        Made with love · Activid · 2026
      </div>
    </div>
  );
}
