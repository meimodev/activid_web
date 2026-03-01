"use client";

import { SectionDivider, GoldLeafBorder } from "./graphics";
import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";
import type { Host } from "@/types/invitation";

interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
  isOpen?: boolean;
}

const getVariants = (delay: number, direction: "up" | "down" | "left" | "right" | "scale" = "up"): Variants => {
  const hidden: { opacity: number; scale: number; x: number; y: number } = {
    opacity: 0,
    scale: 1,
    x: 0,
    y: 0,
  };
  if (direction === "up") hidden.y = 40;
  if (direction === "down") hidden.y = -40;
  if (direction === "left") hidden.x = 40;
  if (direction === "right") hidden.x = -40;
  if (direction === "scale") hidden.scale = 0.5;

  return {
    hidden: {
      ...hidden,
      transition: { duration: 0.6, ease: "easeIn" }
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, delay, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };
};

export function TitleSection({ hosts, date, heading, isOpen = false }: TitleSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const shouldShow = isOpen && isInView;

  return (
    <section ref={ref} className="min-h-screen relative flex flex-col items-center justify-end overflow-hidden">
      <GoldLeafBorder position="top" />

      {/* Smooth Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[90vh] bg-linear-to-t from-wedding-bg via-wedding-bg/60 to-transparent pointer-events-none z-0" />

      <div className="absolute inset-x-0 top-0 h-[80vh] bg-linear-to-b from-wedding-dark/60 to-transparent pointer-events-none z-0 mix-blend-multiply" />

      <div className="relative z-10 w-full flex flex-col items-center text-center pb-24 px-4">
        <motion.div
          variants={getVariants(0.2, "down")}
          initial="hidden"
          animate={shouldShow ? "visible" : "hidden"}
        >
          <h2 className="font-garet-book font-bold text-sm uppercase tracking-[0.4em] mb-6 text-wedding-text-dark text-center font-semibold drop-shadow-sm">
            {heading}
          </h2>
        </motion.div>

        <div className="font-brittany-signature text-7xl text-wedding-dark mb-8 leading-[1.08] py-1 text-center drop-shadow-lg">
          <div className="flex flex-col gap-4">
            <motion.div
              variants={getVariants(0.4, "left")}
              initial="hidden"
              animate={shouldShow ? "visible" : "hidden"}
            >
              <span>{hosts[0]?.firstName ?? ""}</span>
            </motion.div>
            
            {hosts.length > 1 && (
              <>
                <motion.div
                  variants={getVariants(0.6, "scale")}
                  initial="hidden"
                  animate={shouldShow ? "visible" : "hidden"}
                >
                  <span className="text-2xl font-stoic text-wedding-accent-light opacity-80">
                    &
                  </span>
                </motion.div>
                
                <motion.div
                  variants={getVariants(0.8, "right")}
                  initial="hidden"
                  animate={shouldShow ? "visible" : "hidden"}
                >
                  <span>{hosts[1]?.firstName ?? ""}</span>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <motion.div
          className="relative"
          variants={getVariants(1.0, "up")}
          initial="hidden"
          animate={shouldShow ? "visible" : "hidden"}
        >
          <div className="absolute inset-0  -z-10  rounded-full"></div>
          <p className="font-garet-book text-xl tracking-[0.3em] text-wedding-dark border-t border-b border-wedding-accent/40 py-6 ">
            {date}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 w-full pb-4"
        variants={getVariants(1.2, "up")}
        initial="hidden"
        animate={shouldShow ? "visible" : "hidden"}
      >
        <SectionDivider />
      </motion.div>
    </section>
  );
}
