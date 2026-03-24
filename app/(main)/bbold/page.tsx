import type { Metadata } from "next";

import ProductCard from "./_components/ProductCard";
import { bboldProductOrder } from "./data";

export const metadata: Metadata = {
  title: "BBOLD | ACTIVID",
  description: "BBOLD MMXX Tondano custom wall decor, merch, and gift products.",
};

export default function BboldPage() {
  return (
    <main className="min-h-screen bg-[#1e1a19] text-stone-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-stone-400">activid.id/bbold</p>
          <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.08em] text-stone-50 md:text-7xl">
            BBOLD MMXX Tondano
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            All picture have good moment to remember. Explore BBOLD&apos;s wall decor, souvenir,
            and custom merch catalog in an isolated route section that now works with the current
            app router setup.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bboldProductOrder.map((productId, index) => (
            <ProductCard key={productId} productId={productId} priority={index === 0} />
          ))}
        </div>
      </section>
    </main>
  );
}
