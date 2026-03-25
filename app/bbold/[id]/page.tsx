import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BboldActionLink from "../_components/BboldActionLink";
import BboldLogo from "../_components/BboldLogo";
import ProductShowcase from "../_components/ProductShowcase";
import { BBOLD_META, getBboldProduct } from "../data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getBboldProduct(id);
  if (!product) {
    return {
      title: BBOLD_META.title,
      description: BBOLD_META.description,
    };
  }

  return {
    title: `${product.displayName} | ${BBOLD_META.title}`,
    description: BBOLD_META.description,
  };
}

export default async function BboldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getBboldProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-700 px-4 py-12 text-neutral-100">
      <div className="mx-auto max-w-2xl">
        <BboldLogo compact />
        <div className="pt-8">
          <ProductShowcase images={product.images} />
          <div className="flex items-center justify-center gap-3 pb-3 pt-6 text-center text-5xl text-neutral-100" style={{ fontFamily: "var(--font-bbold-display)" }}>
            {product.id.length < 3 ? <span className="text-lg">size</span> : null}
            <span>{product.id}</span>
          </div>
          <div className="px-6 text-neutral-300" style={{ fontFamily: "var(--font-bbold-body)" }}>
            {product.introLines?.length ? (
              <div className="pt-4">
                {product.introLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            ) : null}
            {product.priceBlocks?.map((block) => (
              <div key={block.label} className="flex flex-col py-2 text-xl text-neutral-100" style={{ fontFamily: "var(--font-bbold-display)" }}>
                <span>{block.label}</span>
                <span>{block.price}</span>
              </div>
            ))}
            {product.notes?.length ? (
              <div className="flex flex-col gap-1 text-xs italic">
                {product.notes.map((note) => (
                  <em key={note}>- {note}</em>
                ))}
              </div>
            ) : null}
            {product.offerGroups?.length ? (
              <div className="space-y-4 pt-4">
                {product.offerGroups.map((group) => (
                  <div key={group.title}>
                    <span className="text-neutral-50" style={{ fontFamily: "var(--font-bbold-display)" }}>
                      {group.title}
                    </span>
                    <ul className="list-none pl-0 pt-2">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
            {product.footerNote ? (
              <div className="pt-4 text-xl font-bold text-neutral-50" style={{ fontFamily: "var(--font-bbold-display)" }}>
                {product.footerNote}
              </div>
            ) : null}
          </div>
          <div className="my-3 flex flex-col px-6">
            <BboldActionLink href={product.links.whatsApp} label="Pesan" tone="highlight" />
            <BboldActionLink href={product.links.map} label="Kunjungi" />
            {product.links.tokopedia ? <BboldActionLink href={product.links.tokopedia} label="Tokopedia" /> : null}
            {product.links.shopee ? <BboldActionLink href={product.links.shopee} label="Shopee" /> : null}
          </div>
          <div className="h-9" />
        </div>
      </div>
    </main>
  );
}
