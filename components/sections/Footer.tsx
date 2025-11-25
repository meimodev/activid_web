'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/contact' },
  ];


  return (
    <footer className={`relative bg-gradient-to-b from-[#0B0F19] to-[#1a1d3a] text-white overflow-hidden ${className}`}>
      {/* Subtle Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-[120px]" />
      </div>

      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

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
                Let's build something{' '}
                <span className="bg-gradient-to-r from-[#F8EFDE] via-purple-300 to-blue-300 bg-clip-text text-transparent animate-gradient">
                  extraordinary.
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
                {navigationLinks.map((link) => (
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
                <a
                  href="https://maps.app.goo.gl/1Hc3a9AwZ3Rgq11z7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <h5 className="text-white font-semibold mb-1 text-sm">Tondano</h5>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Kompleks Pasar Bawah, Kel. Wawalintouan<br />
                    Kab. Minahasa, Sulawesi Utara
                  </p>
                </a>
                <a
                  href="https://maps.app.goo.gl/6mu8xWkfThW6quTa9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <h5 className="text-white font-semibold mb-1 text-sm">Manado</h5>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Jl. Toar No.19, Kel. Mahakeret<br />
                    Kota Manado, Sulawesi Utara
                  </p>
                </a>
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
              href="/privacy"
              className="hover:text-[#F8EFDE] transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#F8EFDE] transition-colors duration-200"
            >
              Terms
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
