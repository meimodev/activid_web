'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { siteContent } from '@/lib/site-content';

export interface OurClientsProps {
  className?: string;
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

  return (
    <section id="clients" ref={containerRef} className={`relative min-h-[600px] overflow-hidden flex items-center justify-center ${className}`}>
      {/* Carousel Layer (Background) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 z-0 opacity-60">
        {/* Row 1 - Normal Direction */}
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`row1-${client.name}-${index}`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`row1-${client.name}-${index}-duplicate`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Reverse Direction */}
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`row2-${client.name}-${index}`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 flex animate-marquee2-reverse whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`row2-${client.name}-${index}-duplicate`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Normal Direction - Slower Speed */}
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {[...clients.reverse(), ...clients.reverse()].map((client, index) => (
              <div
                key={`row3-${client.name}-${index}`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 flex animate-marquee2-slow whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`row3-${client.name}-${index}-duplicate`}
                className="mx-4 w-32 md:w-48 opacity-50"
              >
                <div className="relative h-16 md:h-24 w-full flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 overflow-hidden">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-[#1a1d3a]/10 z-10" />

      {/* Text Content Layer (Foreground) */}
      <div className="container relative mx-auto px-4 z-20">
        <motion.div
          style={{ y, opacity }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#F8EFDE] mb-6 font-(family-name:--font-bricolage) drop-shadow-lg">
            {title}
          </h2>

          <p className="text-2xl text-[#F8EFDE] mb-6 font-(family-name:--font-bricolage) drop-shadow-lg">
            <span className="font-black">{clients.length}</span> {subtitlePart1}
          </p>

        </motion.div>
      </div>
    </section>
  );
}
