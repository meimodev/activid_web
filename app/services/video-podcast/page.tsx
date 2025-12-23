import Image from "next/image";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
    title: `${siteContent.servicePages.videoPodcast.header.title} | Activid Services`,
    description: Array.isArray(siteContent.servicePages.videoPodcast.header.description)
        ? siteContent.servicePages.videoPodcast.header.description.join(' ')
        : siteContent.servicePages.videoPodcast.header.description,
};

export default function VideoPodcastPage() {
    const { header, mainProject, thumbnails } = siteContent.servicePages.videoPodcast;

    return (
        <main className="min-h-screen w-full bg-[#F8EFDE] text-[#1a1a3e] overflow-x-hidden">
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
                            header.image.endsWith(".mp4") ? (
                                <VideoPlayer
                                    src={header.image}
                                    className="absolute inset-0 hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <Image
                                    src={header.image}
                                    alt={header.title}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                            )
                        )}
                    </div>
                </div>

            </div>

            {/* Projects Section - Full Width */}
            <div className="w-full mb-24">
                <div className="container mx-auto px-4 mb-16">
                    <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#1a1a3e] mb-2">Project</h2>
                    <p className="text-2xl lg:text-3xl font-medium text-[#1a1a3e]/80">{header.title}</p>
                </div>

                <div className="w-screen ml-[calc(50%-50vw)] bg-[#1a1a3e]/5 py-24 overflow-hidden relative">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column - Main Video Preview */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1a1a3e]">
                                    {mainProject.image.endsWith(".mp4") ? (
                                        <VideoPlayer
                                            src={mainProject.image}
                                            className="absolute inset-0"
                                        />
                                    ) : (
                                        <Image
                                            src={mainProject.image}
                                            alt={mainProject.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Thumbnails & Content */}
                            <div className="lg:col-span-5 space-y-12">
                                {/* Thumbnails Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="relative aspect-9/16 rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src={thumbnails[0].src}
                                                alt={thumbnails[0].alt}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-2 left-2 text-white text-xs font-bold shadow-black drop-shadow-md">Behind The Scene</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src={thumbnails[1].src}
                                                alt={thumbnails[1].alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src={thumbnails[2].src}
                                                alt={thumbnails[2].alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="relative">
                                    <h3 className="text-3xl lg:text-4xl font-bold text-[#1a1a3e] mb-4">{mainProject.title}</h3>
                                    <p className="text-[#1a1a3e]/80 leading-relaxed mb-6">
                                        {mainProject.description}
                                    </p>

                                    <div className="bg-white/60 p-6 rounded-2xl border border-[#1a1a3e]/10 backdrop-blur-sm relative z-10">
                                        <span className="font-bold text-[#1a1a3e] block mb-2">Result:</span>
                                        <p className="text-[#1a1a3e]/90 text-sm leading-relaxed">
                                            {mainProject.result}
                                        </p>
                                    </div>

                                    {/* Team Image Overlay (Decorative) */}
                                    <div className="hidden lg:block absolute -bottom-24 -right-24 w-64 h-64 pointer-events-none opacity-20 grayscale">
                                        <Image
                                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop"
                                            alt="Team"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">

                <CTA />

            </div>
        </main>
    );
}
