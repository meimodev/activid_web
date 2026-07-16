'use client';

import Link from 'next/link';
import localFont from 'next/font/local';
import { motion } from 'framer-motion';
import { AnimatedGradientBackground } from '@/components/ui';

// The root layout carries no fonts or theme class (those live in each route
// group). This page is global, so it loads the (main) surface's fonts itself
// to match the landing page's look.
const poppins = localFont({
  src: '../public/fonts/poppins-regular.ttf',
  variable: '--font-geist-sans',
  display: 'swap',
});

const garet = localFont({
  src: '../public/fonts/garet-book.ttf',
  variable: '--font-bricolage',
  display: 'swap',
});

const CREAM = '#F8EFDE';

// Destinations that actually exist under app/(main). Home is the primary CTA;
// these are the "somewhere specific" fallbacks.
const destinations = [
  { label: 'Services', href: '/services', hint: 'What we make' },
  { label: 'Work', href: '/work', hint: 'Selected projects' },
  { label: 'About', href: '/about', hint: 'Who we are' },
  { label: 'Contact', href: '/contact', hint: 'Start a project' },
];

const ease = [0.22, 1, 0.36, 1] as const; // ease-out-quint

export default function NotFound() {
  return (
    <div
      className={`dark ${poppins.variable} ${garet.variable} antialiased font-sans relative min-h-screen overflow-hidden bg-[#0B0F19] text-white`}
    >
      <AnimatedGradientBackground className="fixed inset-0 -z-50" />
      {/* Depth vignette so the centered content reads over the moving gradient */}
      <div
        className="pointer-events-none fixed inset-0 -z-40"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(11,15,25,0.45) 55%, rgba(11,15,25,0.9) 100%)',
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-xs font-bold uppercase tracking-[0.35em]"
          style={{ color: CREAM }}
        >
          404 · Page not found
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="relative mt-4 select-none"
          aria-hidden
        >
          <span
            className="block font-black leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-bricolage)',
              fontSize: 'clamp(6rem, 28vw, 13rem)',
              color: CREAM,
              textShadow:
                '0 0 60px rgba(107,39,55,0.55), 0 0 120px rgba(74,45,82,0.4)',
            }}
          >
            404
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
          style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          You&apos;ve reached the edge of the site.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.22 }}
          className="mt-4 max-w-md text-base leading-relaxed text-white/60"
        >
          This link is broken or the page has moved. Pick up the trail below and
          we&apos;ll get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#0B0F19] transition-transform duration-300 will-change-transform hover:-translate-y-0.5"
            style={{ backgroundColor: CREAM }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Take me home
          </Link>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          aria-label="Suggested pages"
          className="mt-12 border-t border-white/10 pt-6"
        >
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
            Or head somewhere specific
          </p>
          <ul>
            {destinations.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="group flex items-center justify-between gap-4 border-b border-white/5 py-4 transition-colors hover:border-white/20"
                >
                  <span className="flex flex-col">
                    <span
                      className="text-lg font-semibold transition-colors group-hover:text-[color:var(--cream)]"
                      style={{ ['--cream' as string]: CREAM }}
                    >
                      {d.label}
                    </span>
                    <span className="text-sm text-white/45">{d.hint}</span>
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={CREAM}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </main>
    </div>
  );
}
