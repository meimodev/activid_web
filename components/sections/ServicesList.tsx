'use client';

import Link from 'next/link';
import { siteContent } from '@/lib/site-content';
import { trackService } from '@/lib/analytics';

/** One service per row: its name, what it covers, and the way to its page. */
export function ServicesList() {
  const { title, subtitle, items } = siteContent.services;

  return (
    <section id="services" className="wrap pt-(--gap-section)">
      <div className="grid gap-x-12 gap-y-3 lg:grid-cols-2 lg:items-end">
        <h2 data-rise className="t-head">
          {title}
        </h2>
        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead max-w-[40ch]">
          {subtitle}
        </p>
      </div>

      <ul className="mt-8 space-y-2 lg:mt-12">
        {items.map((service, i) => (
          <li key={service.id} data-rise style={{ '--i': i % 3 } as React.CSSProperties}>
            <Link
              href={service.buttonLink}
              onClick={() => trackService.viewService(service.title, service.id)}
              className="row group"
            >
              <span className="grid gap-x-12 gap-y-0.5 lg:grid-cols-[20rem_1fr] lg:items-baseline">
                <span className="t-lead font-medium">{service.title}</span>
                <span className="text-(--soft)">{service.detail}</span>
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
