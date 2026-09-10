"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ProductDetail } from "../data";
import BboldActionLink from "./BboldActionLink";
import BboldLogo from "./BboldLogo";
import ProductShowcase from "./ProductShowcase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function BboldDetailClient({ product }: { product: ProductDetail }) {
  return (
    <main className="min-h-screen bg-[#d4c3b0] px-4 py-8 sm:py-12 text-[#241a15]">
      <div className="mx-auto max-w-lg sm:max-w-xl">
        {/* Header with Back button and stable BboldLogo */}
        <div className="relative flex items-center justify-center">
          <Link
            href="/bbold"
            aria-label="Back to bbold gallery"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-[#241a15]/10 px-3 py-1.5 text-xs font-medium text-[#241a15] backdrop-blur-md transition-all hover:bg-[#241a15]/20 hover:text-black border border-[#241a15]/15 active:scale-95 z-20"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <BboldLogo compact />
        </div>

        {/* Coordinated, snappy content entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-4 sm:pt-6"
        >
          <motion.div variants={itemVariants}>
            <ProductShowcase images={product.images} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div
              className="flex items-center justify-center gap-3 pb-3 pt-6 text-center text-5xl text-[#241a15]"
              style={{ fontFamily: "var(--font-bbold-display)" }}
            >
              {product.id.length < 3 ? <span className="text-lg">size</span> : null}
              <span>{product.id}</span>
            </div>
          </motion.div>

          <div className="px-6 text-[#3c2d24]" style={{ fontFamily: "var(--font-bbold-body)" }}>
            {product.introLines?.length ? (
              <motion.div variants={itemVariants} className="pt-4">
                {product.introLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </motion.div>
            ) : null}

            {product.priceBlocks?.map((block) => (
              <motion.div
                key={block.label}
                variants={itemVariants}
                className="flex flex-col py-2 text-xl text-[#241a15]"
                style={{ fontFamily: "var(--font-bbold-display)" }}
              >
                <span>{block.label}</span>
                <span>{block.price}</span>
              </motion.div>
            ))}

            {product.notes?.length ? (
              <motion.div variants={itemVariants} className="flex flex-col gap-1 text-xs italic text-[#5e4b3e]">
                {product.notes.map((note) => (
                  <em key={note}>- {note}</em>
                ))}
              </motion.div>
            ) : null}

            {product.offerGroups?.length ? (
              <div className="space-y-4 pt-4">
                {product.offerGroups.map((group) => (
                  <motion.div key={group.title} variants={itemVariants}>
                    <div>
                      <span className="text-[#241a15] font-bold" style={{ fontFamily: "var(--font-bbold-display)" }}>
                        {group.title}
                      </span>
                      <ul className="list-none pl-0 pt-2 text-[#3c2d24]">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            {product.footerNote ? (
              <motion.div
                variants={itemVariants}
                className="pt-4 text-xl font-bold text-[#241a15]"
                style={{ fontFamily: "var(--font-bbold-display)" }}
              >
                {product.footerNote}
              </motion.div>
            ) : null}
          </div>

          <motion.div variants={itemVariants} className="my-3 flex flex-col px-6">
            <BboldActionLink href={product.links.whatsApp} label="Pesan" tone="highlight" />
            {product.links.mapLocations.length > 0 ? (
              <div className="my-1">
                <div className="flex gap-2">
                  {product.links.mapLocations.map((loc) => (
                    <div key={loc.label} className="flex-1">
                      <a
                        href={loc.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full rounded-xl bg-[#241a15] p-3 text-center text-stone-50 transition-all duration-200 hover:bg-[#18110d] hover:scale-[0.99] shadow-md"
                      >
                        <span className="text-lg" style={{ fontFamily: "var(--font-bbold-display)" }}>
                          📍 Kunjungi - {loc.label}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {product.links.tokopedia ? (
              <BboldActionLink href={product.links.tokopedia} label="Tokopedia" />
            ) : null}
            {product.links.shopee ? (
              <BboldActionLink href={product.links.shopee} label="Shopee" />
            ) : null}
          </motion.div>

          <div className="h-9" />
        </motion.div>
      </div>
    </main>
  );
}
