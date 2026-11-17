'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/lib/site-content';
import { trackNavigation } from '@/lib/analytics';
import type { NavigationItem } from '@/types/site-content.types';

const LOGO = 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/0_LOGO_WHITE.PNG';

// The bar carries the site's own pages: Home is the wordmark and Contact is the
// one action. Everything that leaves the site (our other products, the contact
// channels) and document checking live in the menu, which opens at every width.
const pages = siteContent.navigation.filter(item => !item.external);
const products = siteContent.navigation.filter(item => item.external);
const barLinks = pages.filter(item => !['/', '/verify', '/contact'].includes(item.href));
const contact = pages.find(item => item.href === '/contact')!;
const { whatsapp, email, instagram } = siteContent.contactPage.methods;
const quiet = 'link decoration-transparent hover:decoration-current aria-[current=page]:decoration-current';

/** The logo is white-on-transparent, so it always rides its own ink disc. */
export function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="relative block size-9 overflow-hidden rounded-full bg-(--ink)">
        <Image src={LOGO} alt="" fill sizes="36px" className="object-contain p-0.5" />
      </span>
      <span className="text-lg">activid</span>
    </Link>
  );
}

function NavLink({ item, className, onClick }: { item: NavigationItem; className?: string; onClick: () => void }) {
  const pathname = usePathname();
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {item.label} <span aria-hidden>↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={pathname === item.href ? 'page' : undefined}
      className={className}
    >
      {item.label}
    </Link>
  );
}

/**
 * The site's one navigation: a plain bar and a full-screen menu. From lg the
 * bar shows the main pages; the menu lists every page and every link that
 * leaves the site. It is a native <dialog>, so the focus trap, Escape and the
 * inert page behind it come from the browser.
 */
export default function Navigation() {
  const menu = useRef<HTMLDialogElement>(null);

  const track = (item: NavigationItem) => trackNavigation.linkClick(item.label, item.href);
  const open = () => {
    menu.current?.showModal();
    trackNavigation.mobileMenuToggle(true);
  };
  const close = () => {
    menu.current?.close();
    trackNavigation.mobileMenuToggle(false);
  };
  const follow = (item: NavigationItem) => {
    track(item);
    close();
  };

  return (
    <header className="sticky top-0 z-40 bg-(--paper) text-(--ink)">
      <nav aria-label="Main" className="wrap flex h-16 items-center justify-between">
        <Wordmark onClick={() => trackNavigation.logoClick()} />

        <div className="t-small flex items-center gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {barLinks.map(item => (
              <li key={item.href}>
                <NavLink item={item} onClick={() => track(item)} className={quiet} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="-mr-2 min-h-11 px-2 text-base font-medium lg:mr-0 lg:px-0 lg:text-[length:inherit] lg:font-normal"
          >
            Menu
          </button>
          <NavLink item={contact} onClick={() => track(contact)} className="btn hidden min-h-10 px-5 py-2 lg:inline-flex" />
        </div>
      </nav>

      <dialog ref={menu} aria-label="Menu" className="menu on-ink">
        <div className="wrap flex min-h-full flex-col pb-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">activid</span>
            <button type="button" onClick={close} className="-mr-2 min-h-11 px-2 font-medium">
              Close
            </button>
          </div>
          <div className="my-auto grid gap-x-12 gap-y-10 py-8 lg:grid-cols-2">
            <ul className="flex flex-col gap-3">
              {pages.map((item, i) => (
                <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
                  <NavLink item={item} onClick={() => follow(item)} className={`t-head block ${quiet}`} />
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-8">
              <ul aria-label="More from Activid" className="flex flex-col gap-3">
                {products.map((item, i) => (
                  <li key={item.href} style={{ '--i': pages.length + i } as React.CSSProperties}>
                    <NavLink item={item} onClick={() => follow(item)} className={`t-head block ${quiet}`} />
                  </li>
                ))}
              </ul>
              <ul aria-label="Contact" className="flex flex-col gap-2 text-(--soft)">
                {[whatsapp, email, instagram].map((method, i) => (
                  <li key={method.label} style={{ '--i': pages.length + products.length + i } as React.CSSProperties}>
                    <a href={method.href} target="_blank" rel="noopener noreferrer" onClick={close} className={quiet}>
                      {method.label}: {method.value}
                      {method.href.startsWith('http') && <span aria-hidden> ↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
