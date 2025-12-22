'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import Image from 'next/image';
import { siteContent } from '@/lib/site-content';

export interface AboutUsProps {
  className?: string;
}

/**
 * About Us section component matching the provided design.
 * Features:
 * - Split layout with image on left
 * - Large "About Us" heading
 * - Company info and mission statements
 * - Responsive design
 */
export function AboutUs({ className = '' }: AboutUsProps) {
  return (
    <section
      id="about"
      className={`relative  py-20 px-4 sm:px-6 lg:px-8 bg-[#F8EFDE] ${className}`}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Number */}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image and Title */}
          <ScrollReveal direction="left" className="relative">
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl bg-linear-to-br from-[#3d2645] via-[#1a1d3a] to-[#6b2737]">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src={siteContent.aboutUs.image}
                  alt="Creative workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>


              <div className="absolute -right-10 -top-14 bg-[#F8EFDE]  p-8 " >

                {/* Large "About Us" Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1a1a3e] leading-none font-(family-name:--font-bricolage) whitespace-pre-line"
                >
                  {siteContent.aboutUs.title}
                </motion.h2>

                {/* Bottom Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex justify-between pt-30"
                >
                  <div >
                    <p className="text-sm font-bold text-[#1a1a3e] font-(family-name:--font-bricolage)">
                      {siteContent.aboutUs.tagline}
                    </p>
                  </div>
                  <div className="text-sm font-black text-[#1a1a3e] font-(family-name:--font-bricolage)">
                    {new Date().getFullYear()}
                  </div>
                </motion.div>

              </div>


            </div>
          </ScrollReveal>

          {/* Right Side - Content */}
          <ScrollReveal direction="right" className="flex flex-col justify-center ">
            <div className="space-y-8 ">
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}

              >
                <h3 className="text-right text-2xl md:text-3xl font-bold text-[#1a1a3e] font-(family-name:--font-bricolage)">
                  {siteContent.aboutUs.heading}
                </h3>
                <div className="absolute border-b-2 border-[#1a1a3e] w-60 md:w-80 ml-auto -right-8">

                </div>

              </motion.div>


              {/* Content Points */}
              <div className="space-y-6">
                {/* Point 1 */}
                {siteContent.aboutUs.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-16 border-t-[#1a1a3e] -rotate-90" />
                    </div>
                    <div>
                      <p className="text-base md:text-lg text-[#1a1a3e] leading-relaxed text-justify font-(family-name:--font-bricolage)">
                        {point.text} <span className="font-bold text-[#c41e3a]">{point.highlight}</span> {point.suffix}{' '}
                        {point.highlight2 && <span className="font-bold text-[#c41e3a]">{point.highlight2}</span>}
                        {point.suffix2 && <span> {point.suffix2}</span>}
                      </p>
                    </div>
                  </motion.div>
                ))}


              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
