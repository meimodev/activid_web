import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `${siteContent.servicePages.productPhotography.header.title} | Activid Services`,
    description: siteContent.servicePages.productPhotography.header.description,
};

export default function ProductPhotographyPage() {
    const { header, projects, overview } = siteContent.servicePages.productPhotography;

    return (
        <main className="min-h-screen w-full overflow-hidden">
            <section className="bg-[#F8EFDE] text-[#1a1a3e] py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
                        <div className="w-full lg:w-1/2 space-y-8 animate-fade-right">
                            <div className="inline-block px-4 py-2 rounded-full border border-[#1a1a3e]/20 text-sm font-medium tracking-wider uppercase">
                                Our Services
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight font-sans leading-tight">
                                {header.title}
                            </h1>
                            <p className="text-xl lg:text-2xl text-[#1a1a3e]/80 leading-relaxed font-sans">
                                {header.description}
                            </p>
                        </div>

                        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-left">
                            <Image
                                src={header.image}
                                alt={header.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Loop */}
            {projects.map((project, index) => (
                <section key={index} className={`py-24 lg:py-32 relative text-white ${index === 0 ? 'bg-[#050511]' : 'bg-[#050511] border-t border-white/5'}`}>
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-[#1a0b2e] to-[#050511] opacity-50 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-start`}>
                            {/* Text Content */}
                            <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
                                <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE]">
                                    Project
                                </h2>
                                <div className="space-y-6">
                                    <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                        {project.title}
                                    </h3>
                                    <div className="w-20 h-1 bg-[#F8EFDE]/20" />
                                    <div>
                                        <h4 className="text-xl font-bold text-[#F8EFDE] mb-2">{project.client}</h4>
                                        <p className="text-white/70 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Grid - Adapted for Dynamic Data */}
                            <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                                {project.images.map((img, i) => {
                                    let gridClass = "relative rounded-2xl overflow-hidden group";
                                    // Use consistent bento grid logic
                                    if (i === 0) gridClass += " row-span-2";
                                    else if (i === 1) gridClass += " col-span-2";
                                    else if (i === 4) gridClass += " col-span-2";

                                    return (
                                        <div key={i} className={gridClass}>
                                            <Image
                                                src={img}
                                                alt={`${project.title} ${i + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Overview & CTA Section */}
            <section className="bg-[#F8EFDE] text-[#1a1a3e] py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold font-sans">{overview.title}</h2>
                        <p className="text-lg text-[#1a1a3e]/80 leading-relaxed">
                            {overview.content}
                        </p>
                    </div>
                </div>
            </section>
            <CTA />
        </main>
    );
}
