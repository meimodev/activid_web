'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/lib/site-content';
import { trackNavigation } from '@/lib/analytics';
import type { NavigationItem } from '@/types/site-content.types';

const LOGO = 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/0_LOGO_WHITE.PNG';

// Home is the wordmark; Contact is the bar's one action.
const items = siteContent.navigation.filter(item => item.href !== '/');
const isAction = (item: NavigationItem) => item.href === '/contact';

/** The logo is white-on-transparent, so it always rides its own ink disc. */
export function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 font-extrabold tracking-tight">
      <span className="relative block size-10 overflow-hidden rounded-full bg-(--ink)">
        <Image src={LOGO} alt="" fill sizes="40px" className="object-contain p-0.5" />
      </span>
      <span className="text-xl">activid</span>
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
 * The site's one navigation: a plain bar. From lg every link sits in it; below
 * that the links move into a full-screen menu, which is a native <dialog> so
 * the focus trap, Escape and the inert page behind it come from the browser.
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

  return (
    <header className="sticky top-0 z-40 bg-(--paper) text-(--ink)">
      <nav aria-label="Main" className="flex h-16 items-center justify-between px-(--gutter)">
        <Wordmark onClick={() => trackNavigation.logoClick()} />

        <ul className="t-small hidden items-center gap-7 font-medium lg:flex">
          {items.map(item => (
            <li key={item.href}>
              <NavLink
                item={item}
                onClick={() => track(item)}
                className={
                  isAction(item)
                    ? 'btn min-h-11 px-5 py-2'
                    : 'link decoration-transparent aria-[current=page]:decoration-current'
                }
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="-mr-2 min-h-11 px-2 font-bold lg:hidden"
        >
          Menu
        </button>
      </nav>

      <dialog ref={menu} aria-label="Menu" className="menu on-ink bg-(--ink) text-(--paper)">
        <div className="flex min-h-full flex-col px-(--gutter) pb-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <span className="text-xl font-extrabold tracking-tight">activid</span>
            <button type="button" onClick={close} className="-mr-2 min-h-11 px-2 font-bold">
              Close
            </button>
          </div>
          <ul className="my-auto flex flex-col gap-3 py-8">
            {siteContent.navigation.map((item, i) => (
              <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
                <NavLink
                  item={item}
                  onClick={() => {
                    track(item);
                    close();
                  }}
                  className="t-head block transition-colors hover:text-(--pop) aria-[current=page]:text-(--pop)"
                />
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </header>
  );
}
