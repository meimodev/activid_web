/** A heading on the left and what it says across the wide column. */
export function Statement({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`wrap grid gap-x-12 gap-y-4 lg:grid-cols-12 ${className}`}>
      <h2 data-rise className="t-head lg:col-span-4">
        {title}
      </h2>
      <div data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead max-w-[56ch] space-y-4 lg:col-span-8">
        {children}
      </div>
    </section>
  );
}
