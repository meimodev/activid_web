'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';



export interface OurClientsProps {
  className?: string;
}

const clients = [
  { name: 'Client 1', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/1_PGE%20LAHENDONG.png?updatedAt=1763786723964' },
  { name: 'Client 2', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/2_BRI_PEDULI.png?updatedAt=1763786723909' },
  { name: 'Client 3', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/3_UNFORGETTABLE_MINAHASA.png?updatedAt=1763786722690' },
  { name: 'Client 4', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/4_BADAN_PROMOSI_PARIWISATA_DAERAH_%20MINAAHASA.png?updatedAt=1763786722582' },
  { name: 'Client 5', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/5_STRATA_KITCHEN.png?updatedAt=1763786723954' },
  { name: 'Client 6', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/6_YAMA_RESORT.png?updatedAt=1763786723863' },
  { name: 'Client 7', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/7_MEIMO%20SOFTWARE_DEVELOPER.png?updatedAt=1763786722638' },
  { name: 'Client 8', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/8_BOOST_SNACK.png?updatedAt=1763786722825' },
  { name: 'Client 9', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/9_NIKE_TOLEJO.png?updatedAt=1763786724023' },
  { name: 'Client 10', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/10_MAPALUS_E-COMMERCE.png?updatedAt=1763786724070' },
  { name: 'Client 11', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/11_KLAND.png?updatedAt=1763786724129' },
  { name: 'Client 12', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/12_FOUREVER_GIFTS.png?updatedAt=1763786723929' },
  { name: 'Client 13', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/13_BAKSO_DENNY.png?updatedAt=1763786725645' },
  { name: 'Client 14', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/14_ITAEWON%20KOREAN_GRILL.png?updatedAt=1763786722576' },
  { name: 'Client 15', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/15_ESSPECTO_COFFEE.png?updatedAt=1763786722809' },
  { name: 'Client 16', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/16_BBOLD.png?updatedAt=1763786722953' },
  { name: 'Client 17', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/17_MARS_FOOD_&_DRINK.png?updatedAt=1763786724077' },
  { name: 'Client 18', logo: 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/18_DONATO.png?updatedAt=1763786724059' },
];

export function OurClients({ className = '' }: OurClientsProps) {
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
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#F8EFDE] mb-6 font-[family-name:var(--font-bricolage)] drop-shadow-lg">
            Our Clients
          </h2>

          <p className="text-2xl text-[#F8EFDE] mb-6 font-[family-name:var(--font-bricolage)] drop-shadow-lg">
            <span className="font-black">{clients.length}</span>  endeavours and still counting up          </p>

        </motion.div>
      </div>
    </section>
  );
}
