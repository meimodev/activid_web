/** A heading on the left margin and what it says across the wide column. */
export function Statement({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`grid gap-x-8 gap-y-5 px-(--gutter) lg:grid-cols-12 ${className}`}>
      <h2 data-rise className="t-head lg:col-span-4">
        {title}
      </h2>
      <div data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead max-w-[52ch] space-y-5 lg:col-start-5 lg:col-end-13">
        {children}
      </div>
    </section>
  );
}
