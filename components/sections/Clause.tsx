/**
 * One numbered clause of a legal page: its title on the left, its text across
 * the wide column, like every other section here. The text is plain tags
 * (p, ul, strong), styled from this one place.
 */
export function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-x-12 gap-y-3 lg:grid-cols-12">
      <h2 className="t-lead font-medium lg:col-span-4">{title}</h2>
      <div className="max-w-[64ch] space-y-4 lg:col-span-8 [&_li+li]:mt-2 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
