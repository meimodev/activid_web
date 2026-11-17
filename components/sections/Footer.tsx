'use client';

import Link from 'next/link';
import { DateTime } from 'luxon';
import { Wordmark } from '@/components/layouts/Navigation';
import { siteContent } from '@/lib/site-content';
import { trackFooter } from '@/lib/analytics';

/** The close of every page: who this is, then the whole site in four short lists. */
export function Footer() {
  const { footer, navigation, services, contactPage } = siteContent;
  const { whatsapp, email, instagram } = contactPage.methods;
  const legal = [
    ['privacy', footer.legal.privacy],
    ['terms', footer.legal.terms],
    ['accountDeletion', footer.legal.accountDeletion],
  ] as const;
  const quiet = 'link decoration-transparent hover:decoration-current';

  return (
    <footer className="wrap pt-(--gap-section) pb-8">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark />
          <p className="mt-4 max-w-[26ch] text-(--soft)">{footer.brand.title}</p>
        </div>

        <div className="t-small grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">
          <div>
            <h2 className="mb-3 font-medium">Menu</h2>
            <ul className="space-y-2">
              {navigation.map(item => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackFooter.navLinkClick(item.label)}
                      className={quiet}
                    >
                      {item.label} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <Link href={item.href} onClick={() => trackFooter.navLinkClick(item.label)} className={quiet}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-medium">Services</h2>
            <ul className="space-y-2">
              {services.items.map(service => (
                <li key={service.id}>
                  <Link
                    href={service.buttonLink}
                    onClick={() => trackFooter.navLinkClick(service.title)}
                    className={quiet}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-medium">Contact</h2>
            <ul className="space-y-2">
              {[whatsapp, email, instagram].map(method => (
                <li key={method.label}>
                  <a href={method.href} target="_blank" rel="noopener noreferrer" className={quiet}>
                    {method.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-medium">Office</h2>
            <ul className="space-y-4">
              {footer.locations.map(location => (
                <li key={location.name}>
                  <a
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackFooter.officeClick(location.name)}
                    className={`${quiet} block whitespace-pre-line`}
                  >
                    <span className="font-medium">{location.name}</span>
                    {'\n'}
                    {location.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="t-small mt-14 flex flex-wrap justify-between gap-x-8 gap-y-3 text-(--soft)">
        <p>
          © <span suppressHydrationWarning>{DateTime.now().year}</span> Activid. {footer.legal.copyright}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {legal.map(([key, item]) => (
            <li key={key}>
              <Link href={item.href} onClick={() => trackFooter.legalLinkClick(key)} className={quiet}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
