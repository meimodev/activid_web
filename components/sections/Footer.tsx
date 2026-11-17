'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { siteContent } from '@/lib/site-content';
import { trackFooter } from '@/lib/analytics';

// The agency at work: a camera over a plate, cropped closer than anywhere above.
const PHOTO = 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_2.jpg';

/** Photograph half, menu half. The menu is the site's whole map, set large. */
export function Footer() {
  const { footer, navigation, services, contactPage } = siteContent;
  const { whatsapp, email, instagram } = contactPage.methods;
  const legal = [
    ['privacy', footer.legal.privacy],
    ['terms', footer.legal.terms],
    ['accountDeletion', footer.legal.accountDeletion],
  ] as const;

  return (
    <footer className="on-ink grid bg-(--ink) text-(--paper) lg:min-h-svh lg:grid-cols-2">
      <div className="relative h-[50svh] overflow-hidden lg:h-auto">
        <Image
          src={PHOTO}
          alt="A camera held over a plated dish during a product shoot"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="drift origin-[70%_60%] scale-[1.35] object-cover object-[78%_60%]"
        />
      </div>

      <div className="flex flex-col gap-14 px-(--gutter) pt-14 pb-8 lg:pl-[8vw]">
        <p className="t-lead max-w-[22ch] font-medium">{footer.brand.title}</p>

        <ul className="flex flex-col gap-3">
          {navigation.map(item => (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackFooter.navLinkClick(item.label)}
                  className="t-head inline-block transition-[color,translate] duration-300 hover:translate-x-3 hover:text-(--pop)"
                >
                  {item.label} <span aria-hidden>↗</span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => trackFooter.navLinkClick(item.label)}
                  className="t-head inline-block transition-[color,translate] duration-300 hover:translate-x-3 hover:text-(--pop)"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="t-small grid gap-10 sm:grid-cols-3">
          <div>
            <h2 className="mb-3 font-bold">Services</h2>
            <ul className="space-y-2">
              {services.items.map(service => (
                <li key={service.id}>
                  <Link
                    href={service.buttonLink}
                    onClick={() => trackFooter.navLinkClick(service.title)}
                    className="link decoration-transparent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-bold">Contact</h2>
            <ul className="space-y-2">
              {[whatsapp, email, instagram].map(method => (
                <li key={method.label}>
                  <a href={method.href} target="_blank" rel="noopener noreferrer" className="link decoration-transparent">
                    {method.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-bold">Office</h2>
            <ul className="space-y-4">
              {footer.locations.map(location => (
                <li key={location.name}>
                  <a
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackFooter.officeClick(location.name)}
                    className="link block whitespace-pre-line decoration-transparent"
                  >
                    <span className="font-bold">{location.name}</span>
                    {'\n'}
                    {location.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="t-small mt-auto flex flex-wrap justify-between gap-x-8 gap-y-3">
          <p>
            © <span suppressHydrationWarning>{DateTime.now().year}</span> Activid. {footer.legal.copyright}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map(([key, item]) => (
              <li key={key}>
                <Link
                  href={item.href}
                  onClick={() => trackFooter.legalLinkClick(key)}
                  className="link decoration-transparent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
