import { siteContent } from '@/lib/site-content';

/** What clients said, in their words: the heading on the left, the quotes in two columns beside it. */
export function Testimonials() {
  const { title, items } = siteContent.testimonials;

  return (
    <section id="feedback" className="wrap grid gap-x-12 gap-y-8 pt-(--gap-section) lg:grid-cols-12">
      <h2 data-rise className="t-head lg:col-span-4">
        {title}
      </h2>
      <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-8">
        {items.map((item, i) => (
          <li key={item.author} data-rise style={{ '--i': i % 2 } as React.CSSProperties}>
            <figure>
              <blockquote>
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption className="t-small mt-3 font-medium">{item.author}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
