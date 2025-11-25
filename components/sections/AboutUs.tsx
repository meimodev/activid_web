'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import Image from 'next/image';

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
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl bg-gradient-to-br from-[#3d2645] via-[#1a1d3a] to-[#6b2737]">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
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
                  className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1a1a3e] leading-none font-[family-name:var(--font-bricolage)]"
                >
                  About<br />Us
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
                    <p className="text-sm font-bold text-[#1a1a3e] font-[family-name:var(--font-bricolage)]">
                      Agensi Kreatif
                    </p>
                  </div>
                  <div className="text-sm font-black text-[#1a1a3e] font-[family-name:var(--font-bricolage)]">
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
                <h3 className="text-right text-2xl md:text-3xl font-bold text-[#1a1a3e] font-[family-name:var(--font-bricolage)]">
                  kenalan dulu yuk
                </h3>
                <div className="absolute border-b-2 border-[#1a1a3e] w-60 md:w-80 ml-auto -right-8">

                </div>

              </motion.div>


              {/* Content Points */}
              <div className="space-y-6">
                {/* Point 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-[#1a1a3e] -rotate-90" />
                  </div>
                  <div>
                    <p className="text-base md:text-lg text-[#1a1a3e] leading-relaxed text-justify font-[family-name:var(--font-bricolage)]">
                      Activid adalah agensi kreatif yang bergerak di bidang industri kreatif  <span className="font-bold text-[#c41e3a]">sejak 2015</span>  dengan kantor fisik pertama berlokasi di Tondano dan masih aktif hingga sekarang dengan jumlah 2 cabang kantor <span className="font-bold text-[#c41e3a]">Tondano dan Manado</span>
                    </p>
                  </div>
                </motion.div>

                {/* Point 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-[#1a1a3e] -rotate-90" />
                  </div>
                  <div>
                    <p className="text-base md:text-lg text-[#1a1a3e] leading-relaxed text-justify font-[family-name:var(--font-bricolage)]">
                      Misi kita adalah membantu  <span className="font-bold text-[#c41e3a]">brand dan individu</span> membangun identitas visual <span className="font-bold text-[#c41e3a]">yang kuat dan berkarakter</span> Kami percaya bahwa setiap ide memiliki potensi besar untuk berkembang dengan cara yang tepat.
                    </p>
                  </div>
                </motion.div>

                {/* Point 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-[#1a1a3e] -rotate-90" />
                  </div>
                  <div>
                    <p className="text-base md:text-lg text-[#1a1a3e] leading-relaxed text-justify font-[family-name:var(--font-bricolage)]">
                      Solusi melalui <span className="font-bold text-[#c41e3a]">strategi kreatif dan eksekusi yang solid</span>, mulai dari branding building, social media campaign, hingga produksi video dan website, agar pesan kamu tersampaikan dengan <span className="font-bold text-[#c41e3a]">efektif dan berkesan</span>.
                    </p>
                  </div>
                </motion.div>


              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
