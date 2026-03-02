"use client";

import { Host } from "@/types/invitation";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { StarDivider } from "./graphics/ornaments";

interface HostsSectionProps {
  hosts: Host[];
}

export function HostsSection({ hosts }: HostsSectionProps) {
  if (!hosts || hosts.length === 0) return null;

  return (
    <section className="py-32 relative text-wedding-on-dark overflow-hidden bg-wedding-dark">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-wedding-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-wedding-accent-2/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col gap-32">
          {hosts.map((host, index) => {
            const isEven = index % 2 === 0;
            const parentName = host.parents ? (
              <span className="text-wedding-on-dark/60 font-body text-sm mt-4 block leading-relaxed italic">
                <span className="text-wedding-on-dark/90 font-medium not-italic">{host.parents}</span>
              </span>
            ) : null;

            return (
                <div key={`${host.fullName}-${index}`}>
                  <StaggerRevealOnScroll
                    direction={isEven ? "right" : "left"}
                    width="100%"
                    staggerDelay={0.16}
                    className="flex flex-col items-center gap-12 w-full"
                  >
                    {/* Photo Side */}
                    <div className="w-full flex justify-center">
                      <div className="relative group">
                        {/* Decorative orbits */}
                        <div className="absolute -inset-8 border border-wedding-on-dark/10 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute -inset-12 border border-wedding-accent/20 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed" />

                        <div className="w-64 h-64 rounded-full p-2 bg-linear-to-tr from-wedding-accent via-wedding-on-dark/20 to-wedding-accent-2 relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          {host.photo ? (
                            <img
                              src={host.photo}
                              alt={host.fullName}
                              className="w-full h-full object-cover rounded-full transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-wedding-on-dark/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <span className="font-heading text-5xl capitalize text-wedding-on-dark/30">
                                {host.firstName?.[0] || "?"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Side */}
                    <div className="w-full text-center">
                      <h3 className="font-heading text-3xl capitalize tracking-[0.2em] text-wedding-on-dark mb-4 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-on-dark)_20%,transparent)]">
                        {host.fullName}
                      </h3>

                      <div className="flex items-center gap-4 mb-6 justify-center">
                        <div className="h-px w-12 bg-wedding-accent/50" />
                        <span className="font-heading text-xs uppercase tracking-[0.3em] text-wedding-accent">
                          {host.role}
                        </span>
                        <div className="h-px w-12 bg-wedding-accent/50" />
                      </div>

                      {parentName}
                    </div>
                  </StaggerRevealOnScroll>
                </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full opacity-50">
        <StarDivider />
      </div>
    </section>
  );
}
