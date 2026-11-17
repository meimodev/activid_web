import Link from 'next/link';
import localFont from 'next/font/local';
import './not-found.css'; // a private copy of the agency styles: see the file
import Navigation from '@/components/layouts/Navigation';
import { PageHero } from '@/components/sections/Hero';
import { Footer } from '@/components/sections/Footer';

// The root layout carries no fonts or theme class (those live in each route
// group). This page is global, so it dresses itself as the agency site.
// This fallback is included in every route; load its font only when it renders.
const sans = localFont({
  src: './fonts/google/dmsans/normal.woff2',
  variable: '--font-agency',
  weight: '400 600',
  display: 'swap',
  preload: false,
});

// Destinations that actually exist under app/(main). Home is the primary CTA;
// these are the "somewhere specific" fallbacks.
const destinations = [
  { label: 'Services', href: '/services', hint: 'What we make' },
  { label: 'Work', href: '/work', hint: 'Selected projects' },
  { label: 'About', href: '/about', hint: 'Who we are' },
  { label: 'Contact', href: '/contact', hint: 'Start a project' },
];

export default function NotFound() {
  return (
    <div className={`agency ${sans.variable} min-h-svh antialiased`}>
      <Navigation />
      <main>
        <PageHero title="Page not found" cta={{ text: 'Back to home', href: '/' }} facts={['Error 404']}>
          <p>This link is broken or the page has moved. Head back home, or pick a page below.</p>
        </PageHero>

        <nav aria-label="Suggested pages" className="wrap pt-10 lg:pt-14">
          <ul className="space-y-2">
            {destinations.map((d, i) => (
              <li key={d.href} className="on-load" style={{ '--i': 3 + i } as React.CSSProperties}>
                <Link href={d.href} className="row group">
                  <span className="grid gap-x-12 gap-y-0.5 lg:grid-cols-[20rem_1fr] lg:items-baseline">
                    <span className="t-lead font-medium">{d.label}</span>
                    <span className="text-(--soft)">{d.hint}</span>
                  </span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
