import { siteContent } from '@/lib/site-content';

/**
 * Name block, quote block: two flat fields butted together per client, the
 * speaker on ink and their words on colour, both starting on one line. On a phone the words come first.
 */
export function Testimonials() {
  const { title, items } = siteContent.testimonials;

  return (
    <section id="feedback" className="pt-(--gap-section)">
      <h2 data-rise className="t-head px-(--gutter) pb-8">
        {title}
      </h2>
      <ul>
        {items.map((item, i) => (
          <li key={item.author} className="grid lg:grid-cols-[5fr_7fr]">
            <blockquote
              className={`t-lead px-(--gutter) pt-8 pb-16 font-medium lg:order-2 lg:p-12 lg:pb-24 ${i % 2 ? 'bg-(--paper)' : 'bg-(--pop)'}`}
            >
              <p data-rise className="max-w-[34ch] -indent-[0.45em]">
                “{item.quote}”
              </p>
            </blockquote>
            <p className="bg-(--ink) px-(--gutter) py-6 font-bold text-(--paper) lg:p-12">
              <span data-rise>{item.author}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
