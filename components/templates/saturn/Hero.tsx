"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import type { Host } from "@/types/invitation";
import { OrbitDivider } from "./graphics";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
}

export function Hero({ onOpen, hosts, date, subtitle, coverImage }: HeroProps) {
  const primary = hosts[0];
  const secondary = hosts[1];
  const extraHosts = hosts.slice(2).filter(Boolean);
  const displayHosts = [primary, secondary, ...extraHosts].filter(Boolean);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpen = () => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 800); // Wait for staggered exit animation to play out smoothly
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(0px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.0,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 1.05,
      filter: "blur(8px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg">
      {/* Background Image - Full Screen with Fade */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(${coverImage})`,
          scale: 1,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-wedding-bg via-transparent to-wedding-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-wedding-bg via-transparent to-wedding-bg" />
      </motion.div>

      {/* Scanning Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-[2px] bg-wedding-accent/20 blur-[1px] animate-scan-slow opacity-50" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
          className="flex flex-col items-center gap-6 w-full"
        >
          {/* Top Tagline */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <motion.div 
              animate={{ width: ["1rem", "3rem", "1rem"], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-px bg-gradient-to-r from-transparent to-wedding-accent" 
            />
            <span className="font-heading text-xl tracking-[0.5em]  text-wedding-accent/80">
              {subtitle }
            </span>
            <motion.div 
              animate={{ width: ["1rem", "3rem", "1rem"], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="h-px bg-gradient-to-l from-transparent to-wedding-accent" 
            />
          </motion.div>

          {displayHosts.length <= 2 ? (
            <>
              {/* Primary Name */}
              <motion.div variants={itemVariants} className="relative py-4">
                <motion.div
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 -left-4 w-8 h-8 border-t border-l border-wedding-accent/50"
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute top-0 -right-4 w-8 h-8 border-t border-r border-wedding-accent/50"
                />
                <h1 className="font-heading text-5xl text-wedding-on-dark leading-tight filter drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent-2)_30%,transparent)]">
                  {primary?.firstName ?? ""}
                </h1>
              </motion.div>

              {/* Ampersand & Secondary Name */}
              {secondary ? (
                <>
                  <motion.div variants={itemVariants} className="text-2xl font-heading text-wedding-accent opacity-80" aria-hidden="true">
                    &amp;
                  </motion.div>
                  <motion.div variants={itemVariants} className="relative py-4">
                    <div className="absolute bottom-0 -left-4 w-8 h-8 border-b border-l border-wedding-accent/50" />
                    <div className="absolute bottom-0 -right-4 w-8 h-8 border-b border-r border-wedding-accent/50" />
                    <h1 className="font-heading text-5xl text-wedding-on-dark leading-tight filter drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent-2)_30%,transparent)]">
                      {secondary.firstName}
                    </h1>
                  </motion.div>
                </>
              ) : null}
            </>
          ) : (
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
              {displayHosts.map((host, idx) => (
                <div key={`${host.firstName}-${idx}`} className="relative py-2">
                  {idx === 0 ? (
                    <>
                      <motion.div
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 -left-4 w-8 h-8 border-t border-l border-wedding-accent/50"
                      />
                      <motion.div
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute top-0 -right-4 w-8 h-8 border-t border-r border-wedding-accent/50"
                      />
                    </>
                  ) : null}

                  <h1 className="font-heading text-5xl text-wedding-on-dark leading-tight filter drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent-2)_30%,transparent)]">
                    {host.firstName}
                  </h1>

                  {idx === displayHosts.length - 1 ? (
                    <>
                      <div className="absolute bottom-0 -left-4 w-8 h-8 border-b border-l border-wedding-accent/50" />
                      <div className="absolute bottom-0 -right-4 w-8 h-8 border-b border-r border-wedding-accent/50" />
                    </>
                  ) : null}
                </div>
              ))}
            </motion.div>
          )}

          {/* Date */}
          <motion.div variants={itemVariants} className="mt-4">
            <p className="font-body uppercase tracking-[0.3em] text-sm text-wedding-text-light">
              {date}
            </p>
          </motion.div>

          {/* OrbitDivider */}
          <motion.div variants={itemVariants} className="w-full max-w-xs -my-2 opacity-50">
            <OrbitDivider />
          </motion.div>

          {/* Initialize Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05, letterSpacing: "0.4em" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="mt-12 group relative px-10 py-4 bg-wedding-bg-alt/30 border border-wedding-accent/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-wedding-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-wedding-accent animate-pulse" />
                <span className="font-body text-xs uppercase tracking-[0.3em] text-wedding-accent-light group-hover:text-wedding-on-dark transition-colors">
                  Open Message
                </span>
              </div>

              {/* Button Corner Accents */}
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-0 left-0 w-2 h-2 border-t border-l border-wedding-accent" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-wedding-accent" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* HUD Elements - Corners */}
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute top-8 left-8 hidden"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] items-center text-wedding-accent-2/40 font-mono tracking-widest">
            SYS.READY
          </span>
          <motion.div 
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-[1px] bg-gradient-to-r from-wedding-accent-2/50 to-transparent origin-left" 
          />
        </div>
      </motion.div>
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 right-8 hidden"
      >
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] items-center text-wedding-accent-2/40 font-mono tracking-widest">
            V.1.0.4
          </span>
          <motion.div 
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="w-24 h-[1px] bg-gradient-to-l from-wedding-accent-2/50 to-transparent origin-right" 
          />
        </div>
      </motion.div>

      {/* Vertical Data Lines */}
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute top-1/2 left-6 -translate-y-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-wedding-accent-2/20 to-transparent hidden overflow-hidden" 
      >
        <motion.div 
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-wedding-accent-light to-transparent opacity-60"
        />
      </motion.div>
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute top-1/2 right-6 -translate-y-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-wedding-accent-2/20 to-transparent hidden overflow-hidden" 
      >
        <motion.div 
          animate={{ y: ["200%", "-100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-wedding-accent-light to-transparent opacity-60"
        />
      </motion.div>
    </div>
  );
}
