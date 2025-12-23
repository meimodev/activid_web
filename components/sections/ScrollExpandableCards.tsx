'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { trackService } from '@/lib/analytics';

/**
 * Data structure for individual card content
 */
export interface CardData {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon?: React.ReactNode;
  color?: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * Props for ScrollExpandableCards component
 */
export interface ScrollExpandableCardsProps {
  cards: CardData[];
  title: string;
  className?: string;
}

/**
 * ScrollExpandableCards component (Redesigned)
 * 
 * Displays services in a responsive grid layout with premium hover effects.
 * Removed scroll hijacking for better accessibility and user experience.
 */
export function ScrollExpandableCards({ cards, title, className = '' }: ScrollExpandableCardsProps) {
  return (
    <section id="services" className={`relative py-24 overflow-hidden ${className}`}>
      {/* Background Elements */}
      {/* Background Elements - Removed for transparency */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Optional: Keep subtle orbs if desired, but user asked for transparent. 
            I will remove the solid background and gradient. 
            If I remove everything, it will be fully transparent. 
        */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#F8EFDE] mb-6 font-sans">
            {title}
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <Link
                href={card.buttonLink || '#'}
                className="block h-full w-full"
                onClick={() => trackService.viewService(card.title, card.id)}
              >
                {/* Card Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a1d3a] via-[#1a1d3a]/80 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
                </div>

                {/* Card Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="mb-6 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F8EFDE] border border-white/20 shadow-lg group-hover:bg-[#F8EFDE] group-hover:text-[#1a1d3a] transition-colors duration-300">
                      {card.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#F8EFDE] mb-3 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0 font-sans">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-80 transition-all duration-500 ease-in-out">
                    <p className="text-[#F8EFDE]/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {card.description}
                    </p>

                    {card.buttonText && (
                      <span className="inline-flex items-center text-sm font-semibold text-[#F8EFDE] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 hover:text-white">
                        {card.buttonText}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* Border Glow Effect */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
