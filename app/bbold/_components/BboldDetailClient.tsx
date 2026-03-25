"use client";

import { motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import type { ProductDetail } from "../data";
import BboldActionLink from "./BboldActionLink";
import BboldLogo from "./BboldLogo";
import ProductShowcase from "./ProductShowcase";

function RevealItem({
  order,
  children,
}: {
  order: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: order * 0.14, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function BboldDetailClient({ product }: { product: ProductDetail }) {
  const revealPlan = useMemo(() => {
    let order = 0;
    const nextOrder = () => order++;

    return {
      logo: nextOrder(),
      showcase: nextOrder(),
      title: nextOrder(),
      intro: product.introLines?.length ? nextOrder() : null,
      prices: product.priceBlocks?.map(() => nextOrder()) ?? [],
      notes: product.notes?.length ? nextOrder() : null,
      offers: product.offerGroups?.map(() => nextOrder()) ?? [],
      footer: product.footerNote ? nextOrder() : null,
      links: {
        whatsApp: nextOrder(),
        map: nextOrder(),
        tokopedia: product.links.tokopedia ? nextOrder() : null,
        shopee: product.links.shopee ? nextOrder() : null,
      },
    };
  }, [product]);

  return (
    <main className="min-h-screen bg-stone-700 px-4 py-12 text-neutral-100">
      <div className="mx-auto max-w-2xl">
        <RevealItem order={revealPlan.logo}>
          <BboldLogo compact />
        </RevealItem>
        <div className="pt-8">
          <RevealItem order={revealPlan.showcase}>
            <ProductShowcase images={product.images} />
          </RevealItem>
          <RevealItem order={revealPlan.title}>
            <div
              className="flex items-center justify-center gap-3 pb-3 pt-6 text-center text-5xl text-neutral-100"
              style={{ fontFamily: "var(--font-bbold-display)" }}
            >
              {product.id.length < 3 ? <span className="text-lg">size</span> : null}
              <span>{product.id}</span>
            </div>
          </RevealItem>
          <div className="px-6 text-neutral-300" style={{ fontFamily: "var(--font-bbold-body)" }}>
            {product.introLines?.length ? (
              <RevealItem order={revealPlan.intro ?? 0}>
                <div className="pt-4">
                  {product.introLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </RevealItem>
            ) : null}
            {product.priceBlocks?.map((block, blockIndex) => (
              <RevealItem key={block.label} order={revealPlan.prices[blockIndex] ?? 0}>
                <div className="flex flex-col py-2 text-xl text-neutral-100" style={{ fontFamily: "var(--font-bbold-display)" }}>
                  <span>{block.label}</span>
                  <span>{block.price}</span>
                </div>
              </RevealItem>
            ))}
            {product.notes?.length ? (
              <RevealItem order={revealPlan.notes ?? 0}>
                <div className="flex flex-col gap-1 text-xs italic">
                  {product.notes.map((note) => (
                    <em key={note}>- {note}</em>
                  ))}
                </div>
              </RevealItem>
            ) : null}
            {product.offerGroups?.length ? (
              <div className="space-y-4 pt-4">
                {product.offerGroups.map((group, groupIndex) => (
                  <RevealItem key={group.title} order={revealPlan.offers[groupIndex] ?? 0}>
                    <div>
                      <span className="text-neutral-50" style={{ fontFamily: "var(--font-bbold-display)" }}>
                        {group.title}
                      </span>
                      <ul className="list-none pl-0 pt-2">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </RevealItem>
                ))}
              </div>
            ) : null}
            {product.footerNote ? (
              <RevealItem order={revealPlan.footer ?? 0}>
                <div className="pt-4 text-xl font-bold text-neutral-50" style={{ fontFamily: "var(--font-bbold-display)" }}>
                  {product.footerNote}
                </div>
              </RevealItem>
            ) : null}
          </div>
          <div className="my-3 flex flex-col px-6">
            <RevealItem order={revealPlan.links.whatsApp}>
              <BboldActionLink href={product.links.whatsApp} label="Pesan" tone="highlight" />
            </RevealItem>
            <RevealItem order={revealPlan.links.map}>
              <BboldActionLink href={product.links.map} label="Kunjungi" />
            </RevealItem>
            {product.links.tokopedia ? (
              <RevealItem order={revealPlan.links.tokopedia ?? 0}>
                <BboldActionLink href={product.links.tokopedia} label="Tokopedia" />
              </RevealItem>
            ) : null}
            {product.links.shopee ? (
              <RevealItem order={revealPlan.links.shopee ?? 0}>
                <BboldActionLink href={product.links.shopee} label="Shopee" />
              </RevealItem>
            ) : null}
          </div>
          <div className="h-9" />
        </div>
      </div>
    </main>
  );
}
