import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BboldDetailClient from "../_components/BboldDetailClient";
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

  return <BboldDetailClient product={product} />;
}
