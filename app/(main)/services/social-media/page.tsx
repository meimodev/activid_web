import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `${siteContent.servicePages.socialMedia.header.title} | Activid Services`,
    description: Array.isArray(siteContent.servicePages.socialMedia.header.description)
        ? siteContent.servicePages.socialMedia.header.description.join(' ')
        : siteContent.servicePages.socialMedia.header.description,
};

export default function SocialMediaPage() {
    const {
        header,
        showcasesTitle,
        showcasesSubtitle,
        showcases,
        projectsTitle,
        projectsSubtitle,
        projects,
    } = siteContent.servicePages.socialMedia;

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

                {/* Showcases */}
                <div className="mb-16">
                    <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE] mb-2">{showcasesTitle}</h2>
                    <p className="text-2xl lg:text-3xl font-medium text-gray-300">{showcasesSubtitle}</p>
                </div>

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

                            {/* Industry Label */}
                            <p className="text-sm text-center tracking-wider uppercase mt-auto font-bold opacity-70">
                                {item.category}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Case Studies */}
                <div className="mt-32">
                    <div className="mb-16">
                        <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE] mb-2">{projectsTitle}</h2>
                        <p className="text-2xl lg:text-3xl font-medium text-gray-300">{projectsSubtitle}</p>
                    </div>

                    <div className="space-y-32">
                        {projects.map((project, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Image Card */}
                                <div className="lg:col-span-5 relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    {project.image && (
                                        <Image
                                            src={project.image}
                                            alt={project.client || 'Project Image'}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    )}
                                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
                                </div>

                                {/* Content */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="text-6xl font-black text-white/10 select-none">{project.id}.</div>
                                    <div>
                                        <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${project.color}`}>
                                            {project.client} <span className="text-[#F8EFDE] font-medium">| {project.service}</span>
                                        </h3>
                                        <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                            {project.description}
                                        </p>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <span className="font-bold text-[#F8EFDE] block mb-1">Result:</span>
                                            <p className="text-gray-200 font-medium">
                                                {project.result}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <CTA />
        </main>
    );
}
