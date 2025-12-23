import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `${siteContent.servicePages.branding.header.title} | Activid Services`,
    description: Array.isArray(siteContent.servicePages.branding.header.description)
        ? siteContent.servicePages.branding.header.description.join(' ')
        : siteContent.servicePages.branding.header.description,
};

export default function BrandingPage() {
    const { header, projects } = siteContent.servicePages.branding;

    return (
        <main className="min-h-screen w-full bg-[#F8EFDE] text-[#1a1a3e] overflow-hidden">
            <div className="container mx-auto px-4 py-24 lg:py-32">

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
                        {header.image && (
                            <Image
                                src={header.image}
                                alt={header.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        )}
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mt-24">
                    <div className="mb-16">
                        <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#1a1a3e] mb-2">Project</h2>
                        <p className="text-2xl lg:text-3xl font-medium text-[#1a1a3e]/80">{header.title}</p>
                    </div>

                    <div className="space-y-32">
                        {projects.map((project, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Image Card */}
                                <div className="lg:col-span-5 relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 bg-[#1a1a3e]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    {project.image && (
                                        <Image
                                            src={project.image}
                                            alt={project.client || 'Project Image'}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    )}
                                    {/* Mockup Overlay Effect */}
                                    <div className="absolute inset-0 border-12 border-[#1a1a3e] rounded-3xl pointer-events-none opacity-10" />
                                </div>

                                {/* Content */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="text-6xl font-black text-[#1a1a3e]/10 select-none">{project.id}.</div>
                                    <div>
                                        <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${project.color}`}>
                                            {project.client} <span className="text-[#1a1a3e] font-medium">| {project.service}</span>
                                        </h3>
                                        <p className="text-lg text-[#1a1a3e]/80 leading-relaxed mb-6">
                                            {project.description}
                                        </p>
                                        <div className="bg-white/40 p-6 rounded-2xl border border-[#1a1a3e]/5 backdrop-blur-sm">
                                            <span className="font-bold text-[#1a1a3e] block mb-1">Result:</span>
                                            <p className="text-[#1a1a3e]/90 font-medium">
                                                {project.result}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <CTA />

            </div>
        </main>
    );
}
