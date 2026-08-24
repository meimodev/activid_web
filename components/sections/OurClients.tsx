'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { siteContent } from '@/lib/site-content';
import type { ClientItem } from '@/types/site-content.types';

export interface OurClientsProps {
  className?: string;
}

function LogoTile({ client }: { client: ClientItem }) {
  return (
    <div className="mx-4 w-32 shrink-0 opacity-50 md:w-48">
      {/* No backdrop-blur here: at 30% effective opacity it buys nothing
          visible, and it cost one compositing layer per tile. */}
      <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/5 md:h-24">
        <Image
          src={client.logo}
          alt={client.name}
          fill
          quality={50}
          className="object-contain p-2"
          sizes="(max-width: 768px) 128px, 192px"
        />
      </div>
    </div>
  );
}

/**
 * One marquee lane. The track holds the logos twice and slides by exactly half
 * its width, so the second copy is under the cursor the moment the first
 * scrolls out — seamless with 2x the logos, where the old two-track
 * (`marquee` + `marquee2`) version needed 4x.
 */
function MarqueeRow({ clients, animation }: { clients: readonly ClientItem[]; animation: string }) {
  return (
    <div className="relative flex overflow-x-hidden">
      <div className={`flex whitespace-nowrap ${animation}`}>
        {[...clients, ...clients].map((client, index) => (
          <LogoTile key={`${client.name}-${index}`} client={client} />
        ))}
      </div>
    </div>
  );
}

export function OurClients({ className = '' }: OurClientsProps) {
  const { items: clients, title, subtitlePart1 } = siteContent.clients;
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  // toReversed, not reverse: `clients` is siteContent's module-level array, and
  // reversing it in place mutated shared data during render.
  const reversedClients = clients.toReversed();

  return (
    <section id="clients" ref={containerRef} className={`relative min-h-[600px] overflow-hidden flex items-center justify-center ${className}`}>
      {/* Carousel Layer (Background) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 z-0 opacity-60">
        <MarqueeRow clients={clients} animation="animate-marquee" />
        <MarqueeRow clients={clients} animation="animate-marquee-reverse" />
        <MarqueeRow clients={reversedClients} animation="animate-marquee-slow" />
      </div>

      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-[#1a1d3a]/10 z-10" />

      {/* Text Content Layer (Foreground) */}
      <div className="container relative mx-auto px-4 z-20">
        <motion.div
          style={{ y, opacity }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#F8EFDE] mb-6 font-sans drop-shadow-lg">
            {title}
          </h2>

          <p className="text-2xl text-[#F8EFDE] mb-6 font-sans drop-shadow-lg">
            <span className="font-black">{clients.length}</span> {subtitlePart1}
          </p>

        </motion.div>
      </div>
    </section>
  );
}
