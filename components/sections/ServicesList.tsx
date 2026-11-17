'use client';

import Link from 'next/link';
import { siteContent } from '@/lib/site-content';
import { trackService } from '@/lib/analytics';

/**
 * One service per poster line: giant names flush left, one small fact flush
 * right on the same baseline. Each line is the link to that service.
 */
export function ServicesList() {
  const { title, subtitle, items } = siteContent.services;

  return (
    <section id="services" className="on-ink mt-(--gap-section) bg-(--ink) px-(--gutter) py-16 text-(--paper) lg:py-24">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-8">
        <h2 data-rise className="t-lead font-bold lg:col-span-4">
          {title}
        </h2>
        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[46ch] lg:col-start-5 lg:col-end-13">
          {subtitle}
        </p>
      </div>

      <ul className="mt-12 lg:mt-16">
        {items.map((service, i) => (
          <li key={service.id} data-rise style={{ '--i': i % 3 } as React.CSSProperties}>
            <Link
              href={service.buttonLink}
              onClick={() => trackService.viewService(service.title, service.id)}
              className="group flex flex-col pb-5 transition-colors duration-200 hover:text-(--pop) lg:flex-row lg:items-baseline lg:justify-between lg:gap-8 lg:pb-0"
            >
              <span className="poster max-lg:text-[12.5vw]">{service.short}</span>
              <span className="mt-1.5 shrink-0 lg:mt-0 lg:text-right">
                {service.detail}{' '}
                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
