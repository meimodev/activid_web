import Image from "next/image";
import { Metadata } from "next";

import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

// Determine which project to show. Using product photography first project as default.
const project = siteContent.servicePages.productPhotography.projects[0];

export const metadata: Metadata = {
  title: `Project | ${project.title || 'Food and Beverage Photography'}`,
  description: project.description,
};

export default function ProjectPage() {
  const images = project.images || [];

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-[#F8EFDE] overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:py-24 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

        {/* Left Content Section */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center space-y-8 animate-fade-right">
          <h1 className="text-8xl lg:text-9xl font-bold tracking-tighter text-[#F8EFDE] font-sans">
            Project
          </h1>

          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-medium leading-tight whitespace-pre-line">
              {project.title || "Food and Beverage \n Photography"}
            </h2>
            <div className="w-24 h-1 bg-[#F8EFDE]/30 mt-4"></div>
          </div>

          <div className="space-y-6 max-w-md">
            <h3 className="text-xl font-bold text-white/90">
              {project.client}
            </h3>
            <p className="text-lg text-[#F8EFDE]/80 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Image Grid Section */}
        <div className="w-full lg:w-7/12 h-[600px] lg:h-[800px] p-4">
          <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full w-full animate-fade-left">

            {/* Tall Drink Image - Spans 2 rows - Index 3 */}
            {images[3] && (
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[3]}
                  alt="Fresh Drink"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

            {/* Wide Burger Image - Spans 2 cols - Index 1 */}
            {images[1] && (
              <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[1]}
                  alt="Black Burger"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

            {/* Pizza Image - Index 2 */}
            {images[2] && (
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[2]}
                  alt="Pizza"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

            {/* Fries Image - Index 5 (last) */}
            {images[5] && (
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[5]}
                  alt="French Fries"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

            {/* Coffee Image - Bottom Left - Index 0 */}
            {images[0] && (
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[0]}
                  alt="Coffee Latte"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

            {/* Small Food Image - Bottom Middle - Index 4 */}
            {images[4] && (
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={images[4]}
                  alt="Dessert"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}

          </div>
        </div>
      </div>
      <CTA />
    </main>
  );
}
