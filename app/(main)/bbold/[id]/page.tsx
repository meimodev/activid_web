import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ActionLinks from "../_components/ActionLinks";
import { BboldProductId, bboldProducts, getBboldProduct } from "../data";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return (Object.keys(bboldProducts) as BboldProductId[]).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getBboldProduct(id);

  if (!product) {
    return {
      title: "BBOLD | ACTIVID",
    };
  }

  return {
    title: `${product.title} | BBOLD | ACTIVID`,
    description: product.summary,
  };
}

export default async function BboldProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getBboldProduct(id);

  if (!product) {
    notFound();
  }

  const actionLinks = [
    { href: product.links.whatsApp, label: "Order via WhatsApp", variant: "primary" as const },
    { href: product.links.map, label: "Visit location" },
    ...(product.links.tokopedia ? [{ href: product.links.tokopedia, label: "Tokopedia" }] : []),
    ...(product.links.shopee ? [{ href: product.links.shopee, label: "Shopee" }] : []),
  ];

  return (
    <main className="min-h-screen bg-[#171312] text-stone-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400">
          <Link href="/bbold" className="transition-colors hover:text-stone-50">
            BBOLD
          </Link>
          <span>/</span>
          <span className="uppercase tracking-[0.24em]">{product.title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.map((image, index) => (
              <div key={`${product.id}-${index}`} className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-stone-900">
                <Image
                  src={image}
                  alt={`${product.title} preview ${index + 1}`}
                  fill
                  priority={index < 2}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>

          <div className="sticky top-24 rounded-[2rem] border border-stone-700 bg-stone-900/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-400">{product.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[0.08em] text-stone-50">{product.title}</h1>
            <p className="mt-5 text-base leading-7 text-stone-300">{product.summary}</p>

            <div className="mt-8 space-y-3">
              {product.highlights.map((item) => (
                <div key={item} className="rounded-2xl bg-stone-800 px-4 py-3 text-sm text-stone-100">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-2 text-sm leading-6 text-stone-300">
              {product.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>

            <div className="mt-8">
              <ActionLinks links={actionLinks} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
