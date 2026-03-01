"use client";

import { Host } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { StarDivider, CosmicDivider } from "./graphics/ornaments";
import { MapPinIcon } from "./graphics/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

function FloatingParallax({ children, speed = 1 }: { children: ReactNode, speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
}

interface CoupleSectionProps {
  hosts: Host[];
  disableGrayscale?: boolean;
}

export function CoupleSection({ hosts, disableGrayscale = false }: CoupleSectionProps) {
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
                {host.gender === "male" ? "Putra" : "Putri"} dari
                <br />
                <span className="text-wedding-on-dark/90 font-medium not-italic">{host.parents}</span>
              </span>
            ) : null;

            return (
              <RevealOnScroll
                key={host.id || index}
                direction={isEven ? "right" : "left"}
                width="100%"
              >
                <FloatingParallax speed={0.2}>
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}>
                    {/* Photo Side */}
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className="relative group">
                        {/* Decorative orbits */}
                        <div className="absolute -inset-8 border border-wedding-on-dark/10 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute -inset-12 border border-wedding-accent/20 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed" />
                        
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-linear-to-tr from-wedding-accent via-wedding-on-dark/20 to-wedding-accent-2 relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          {host.image ? (
                            <img
                              src={host.image}
                              alt={host.firstName}
                              className={`w-full h-full object-cover rounded-full ${!disableGrayscale ? "grayscale hover:grayscale-0" : ""} transition-all duration-700`}
                            />
                          ) : (
                            <div className="w-full h-full bg-wedding-on-dark/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <span className="font-script text-6xl text-wedding-on-dark/30">
                                {host.firstName?.[0] || "?"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Side */}
                    <div className={`w-full md:w-1/2 text-center ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                      <h3 className="font-script text-5xl md:text-6xl text-wedding-on-dark mb-4 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-on-dark)_20%,transparent)]">
                        {host.firstName} {host.lastName}
                      </h3>
                      
                      <div className={`flex items-center gap-4 mb-6 justify-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                        <div className="h-px w-12 bg-wedding-accent/50" />
                        <span className="font-heading text-xs uppercase tracking-[0.3em] text-wedding-accent">
                          {host.role}
                        </span>
                        <div className="h-px w-12 bg-wedding-accent/50" />
                      </div>

                      {parentName}

                      {host.instagram && (
                        <a
                          href={`https://instagram.com/${host.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-2 border border-wedding-on-dark/20 rounded-full hover:bg-wedding-on-dark hover:text-wedding-dark text-wedding-on-dark/80 transition-all duration-300 font-heading text-xs uppercase tracking-widest group"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                          @{host.instagram}
                        </a>
                      )}
                    </div>
                  </div>
                </FloatingParallax>
              </RevealOnScroll>
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
