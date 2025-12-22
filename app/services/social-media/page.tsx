import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `${siteContent.servicePages.socialMedia.header.title} | Activid Services`,
    description: siteContent.servicePages.socialMedia.header.description,
};

export default function SocialMediaPage() {
    const { header, showcases } = siteContent.servicePages.socialMedia;

    return (
        <main className="min-h-screen w-full bg-[#0B0F19] text-white overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24 items-center">
                    <div className="w-full lg:w-1/2 space-y-8 animate-fade-right">
                        <div className="inline-block px-4 py-2 rounded-full border border-white/20 text-sm font-medium tracking-wider uppercase text-[#F8EFDE]">
                            Our Services
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight font-sans leading-tight text-[#F8EFDE]">
                            {header.title}
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed font-sans">
                            {header.description}
                        </p>
                    </div>
                </div>

                {/* Showcases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {showcases.map((item, index) => (
                        <div key={index} className="bg-[#F8EFDE] rounded-3xl p-6 text-[#1a1a3e] flex flex-col gap-6 h-full hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl">
                            {/* Color Palette */}
                            <div className="flex justify-center gap-4">
                                {item.colors.map((color, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full shadow-md border border-black/5" style={{ backgroundColor: color }} />
                                ))}
                            </div>

                            {/* Instagram-Style Grid Mockup */}
                            <div className="bg-white rounded-xl overflow-hidden shadow-inner">

                                {/* Instagram Grid */}
                                <div className="relative aspect-square bg-gray-200">
                                    <Image
                                        src={item.image}
                                        alt={`${item.category} instagram grid`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-center leading-relaxed mt-auto font-medium opacity-90">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <CTA />
        </main>
    );
}
