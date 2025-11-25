import Image from "next/image";
import { Metadata } from "next";

import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Project | Food and Beverage Photography",
  description: "Showcase of food and beverage photography for DNA Cafe & Resto.",
};

export default function ProjectPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-[#F8EFDE] overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:py-24 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

        {/* Left Content Section */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center space-y-8 animate-fade-right">
          <h1 className="text-8xl lg:text-9xl font-bold tracking-tighter text-[#F8EFDE] font-sans">
            Project
          </h1>

          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-medium leading-tight">
              Food and Beverage <br /> Photography
            </h2>
            <div className="w-24 h-1 bg-[#F8EFDE]/30 mt-4"></div>
          </div>

          <div className="space-y-6 max-w-md">
            <h3 className="text-xl font-bold text-white/90">
              DNA Cafe & Resto
            </h3>
            <p className="text-lg text-[#F8EFDE]/80 leading-relaxed">
              Kami membantu client untuk menghasilkan foto makanan dan minuman dengan visual yang rapi dan menggugah selera, menonjolkan detail dan kualitas agar terlihat lebih menarik dan siap digunakan untuk kebutuhan branding maupun promosi.
            </p>
          </div>
        </div>

        {/* Right Image Grid Section */}
        <div className="w-full lg:w-7/12 h-[600px] lg:h-[800px] p-4">
          <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full w-full animate-fade-left">

            {/* Tall Drink Image - Spans 2 rows */}
            <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&h=800"
                alt="Fresh Drink"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Wide Burger Image - Spans 2 cols */}
            <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&h=400"
                alt="Black Burger"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Pizza Image */}
            <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=600"
                alt="Pizza"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Fries Image */}
            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=400&h=400"
                alt="French Fries"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Coffee Image - Bottom Left */}
            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&h=400"
                alt="Coffee Latte"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Small Food Image - Bottom Middle */}
            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1563729768-b692965b7cf4?auto=format&fit=crop&w=400&h=400"
                alt="Dessert"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

          </div>
        </div>
      </div>
      <CTA />
    </main>
  );
}
