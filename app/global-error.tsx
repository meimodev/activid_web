'use client';

import { useState } from 'react';
import localFont from 'next/font/local';
import { motion } from 'framer-motion';
import { AnimatedGradientBackground } from '@/components/ui';

// global-error replaces the root layout entirely (it renders its own <html>),
// so it carries no fonts or theme from app/layout.tsx. Load the (main) surface's
// fonts here so this reads as a sibling of not-found.tsx and the landing page.
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

const ease = [0.22, 1, 0.36, 1] as const; // ease-out-quint

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Secure by construction: we never surface error.message or error.stack, which
  // can leak internals (paths, queries, tokens). The digest is the opaque hash
  // Next.js logs server-side; showing it lets a user quote a reference that maps
  // to the real error in our logs, without exposing anything about it.
  const reference = error.digest ?? null;
  const [copied, setCopied] = useState(false);

  const copyReference = () => {
    if (!reference) return;
    void navigator.clipboard?.writeText(reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <html lang="en" className={`${poppins.variable} ${garet.variable}`}>
      <body
        className={`dark antialiased font-sans relative min-h-screen overflow-hidden bg-[#0B0F19] text-white`}
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
            500 · Something broke on our end
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
                // Warmer, fault-tinted glow to distinguish this from the 404's
                // navigational feel: the error should read as heat, not a wrong turn.
                textShadow:
                  '0 0 60px rgba(168,58,52,0.5), 0 0 120px rgba(120,42,74,0.4)',
              }}
            >
              500
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            This one&apos;s on us, not you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.22 }}
            className="mt-4 max-w-md text-base leading-relaxed text-white/60"
          >
            An unexpected error stopped this page from loading. Our team has been
            notified. Give it another try, and if it keeps happening, head home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={reset}
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
                className="transition-transform duration-500 group-hover:rotate-180"
                aria-hidden
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Try again
            </button>

            {/* Hard <a> nav is intentional here: global-error runs when the app
                (root layout included) is broken, so a full reload to reset all
                state is safer than a client-side Link transition. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white"
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
            </a>
          </motion.div>

          {reference && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.4 }}
              className="mt-12 border-t border-white/10 pt-6"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                Reference code
              </p>
              <div className="flex items-center gap-3">
                <code className="rounded-md bg-white/5 px-3 py-2 font-mono text-sm text-white/70">
                  {reference}
                </code>
                <button
                  type="button"
                  onClick={copyReference}
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45 transition-colors hover:text-[color:var(--cream)]"
                  style={{ ['--cream' as string]: CREAM }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-3 max-w-md text-sm text-white/45">
                Quote this if you reach out. It points our team at what went
                wrong, without exposing any details here.
              </p>
            </motion.div>
          )}
        </main>
      </body>
    </html>
  );
}
