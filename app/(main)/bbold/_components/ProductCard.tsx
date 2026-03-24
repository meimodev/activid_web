import Image from "next/image";
import Link from "next/link";

import { BboldProductId, bboldProducts } from "../data";

interface ProductCardProps {
  productId: BboldProductId;
  priority?: boolean;
}

export default function ProductCard({ productId, priority = false }: ProductCardProps) {
  const product = bboldProducts[productId];

  return (
    <article className="overflow-hidden rounded-[2rem] border border-stone-700 bg-stone-900/80 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="relative aspect-[4/5] bg-stone-800">
        <Image
          src={product.images[0]}
          alt={`Preview ${product.title}`}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 text-stone-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{product.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-bold uppercase tracking-[0.06em]">{product.title}</h2>
          </div>
        </div>
        <p className="text-sm leading-6 text-stone-300">{product.summary}</p>
        <ul className="space-y-2 text-sm text-stone-200">
          {product.highlights.slice(0, 2).map((item) => (
            <li key={item} className="rounded-2xl bg-stone-800 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/bbold/${product.id}`}
            className="inline-flex items-center rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-900 transition-transform hover:-translate-y-0.5"
          >
            View details
          </Link>
          <a
            href={product.links.whatsApp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-stone-500 px-4 py-2 text-sm font-semibold text-stone-100 transition-transform hover:-translate-y-0.5"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
