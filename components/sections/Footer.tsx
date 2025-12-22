'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { siteContent } from '@/lib/site-content';

export interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const { footer, navigation } = siteContent;
  const currentYear = new Date().getFullYear();


  return (
    <footer className={`relative bg-linear-to-b from-[#0B0F19] to-[#1a1d3a] text-white overflow-hidden ${className}`}>
      {/* Subtle Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-[120px]" />
      </div>

      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Brand & CTA Section */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight leading-tight">
                {footer.brand.title.replace(footer.brand.highlight, '')}
                <span className="bg-linear-to-r from-[#F8EFDE] via-purple-300 to-blue-300 bg-clip-text text-transparent animate-gradient">
                  {footer.brand.highlight}
                </span>
              </h2>
            </motion.div>
          </div>

          {/* Navigation & Office Info */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 lg:gap-8">
            {/* Sitemap Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-xs uppercase tracking-wider text-[#F8EFDE] mb-4 font-bold font-sans">
                Sitemap
              </h4>
              <ul className="space-y-2">
                {navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-[#F8EFDE] transition-colors duration-200 font-sans block w-fit"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-xs uppercase tracking-wider text-[#F8EFDE] mb-4 font-bold font-sans">
                Office
              </h4>
              <div className="space-y-4 font-sans">
                {footer.locations.map((location) => (
                  <a
                    key={location.name}
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <h5 className="text-white font-semibold mb-1 text-sm">{location.name}</h5>
                    <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                      {location.address}
                    </p>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h3 className="text-lg font-black font-sans text-white">
              Activid
            </h3>
            <p className="text-xs text-white/40 font-sans">
              © <span suppressHydrationWarning>{currentYear}</span> All rights reserved.
            </p>
          </div>

          <div className="flex gap-6 text-xs font-sans text-white/50">
            <Link
              href={footer.legal.privacy.href}
              className="hover:text-[#F8EFDE] transition-colors duration-200"
            >
              {footer.legal.privacy.label}
            </Link>
            <Link
              href={footer.legal.terms.href}
              className="hover:text-[#F8EFDE] transition-colors duration-200"
            >
              {footer.legal.terms.label}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Animated CSS for gradient */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </footer>
  );
}
