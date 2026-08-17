import Image from "next/image";
import Link from "next/link";
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
            {/* Ambient Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[900px] h-[900px] bg-purple-900/25 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] right-[-15%] w-[800px] h-[800px] bg-rose-900/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[750px] h-[750px] bg-blue-900/25 rounded-full blur-[140px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
                {/* Mobile-First Hero Section (No Static Main Image) */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 mb-20 sm:mb-28 items-center">
                    {/* Left Column: Typography & Strategic Value */}
                    <div className="w-full lg:col-span-7 space-y-6 sm:space-y-8 animate-fade-right">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#F8EFDE]/20 bg-white/5 backdrop-blur-md text-xs sm:text-sm font-medium tracking-wider uppercase text-[#F8EFDE]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            ✦ Strategi & Pertumbuhan Media Sosial
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight font-sans leading-[1.1] text-[#F8EFDE]">
                                Social Media <br />
                                <span className="bg-linear-to-r from-[#F8EFDE] via-orange-200 to-[#FF6B52] bg-clip-text text-transparent">
                                    Management
                                </span>
                            </h1>
                            <p className="text-base sm:text-xl lg:text-2xl text-gray-300 leading-relaxed font-sans max-w-2xl font-normal pt-1 sm:pt-2">
                                {header.description}
                            </p>
                        </div>

                        {/* Core Pillars / Value Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2 max-w-xl">
                            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-200">Identitas Brand & Palet Warna</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-200">Strategi Konten & Copywriting</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-200">Estetika Feed & Video Reels</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-200">Pertumbuhan Organik & Jangkauan</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Creative Social Command Architecture Widget (Indonesian) */}
                    <div className="w-full lg:col-span-5 relative animate-fade-left">
                        {/* Glow Behind Card */}
                        <div className="absolute inset-0 bg-linear-to-tr from-purple-600/20 via-pink-600/20 to-orange-500/20 rounded-3xl blur-2xl -z-10" />

                        <div className="relative rounded-3xl p-5 sm:p-7 lg:p-8 bg-[#111625]/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6">


                            {/* Performance Metric Showcase */}
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                                    <span className="text-[11px] sm:text-xs text-gray-400 font-medium">Rata-rata Engagement</span>
                                    <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                                        <span className="text-xl sm:text-3xl font-black text-[#F8EFDE]">+60%</span>
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400">Naik</span>
                                    </div>
                                </div>
                                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                                    <span className="text-[11px] sm:text-xs text-gray-400 font-medium">Identitas Visual</span>
                                    <div className="flex items-baseline gap-1.5 mt-1.5 sm:mt-2">
                                        <span className="text-xl sm:text-3xl font-black text-[#FF6B52]">100%</span>
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300">Kustom</span>
                                    </div>
                                </div>
                            </div>

                            {/* Strategy Pipeline Preview */}
                            <div className="space-y-2 sm:space-y-2.5">
                                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                                    Tahapan Kerja & Eksekusi
                                </span>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-[#FF6B52] shrink-0" />
                                            <span className="truncate">01. Moodboard Visual & Palet Warna</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">Terkurasi</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-[#D9A066] shrink-0" />
                                            <span className="truncate">02. Perencanaan Konten & Copywriting</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">Terjadwal</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-[#FF6FA5] shrink-0" />
                                            <span className="truncate">03. Tata Letak Grid & Video Reels</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">Dipublikasi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Showcases */}
                <div className="mb-12 sm:mb-16">
                    <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE] mb-2">{showcasesTitle}</h2>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-300">{showcasesSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {showcases.map((item, index) => (
                        <div key={index} className="bg-[#F8EFDE] rounded-3xl p-5 sm:p-6 text-[#1a1a3e] flex flex-col gap-5 sm:gap-6 h-full hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl">
                            {/* Color Palette */}
                            <div className="flex justify-center gap-3 sm:gap-4">
                                {item.colors.map((color, i) => (
                                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md border border-black/5" style={{ backgroundColor: color }} />
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
                            <p className="text-xs sm:text-sm text-center tracking-wider uppercase mt-auto font-bold opacity-70">
                                {item.category}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Case Studies */}
                <div className="mt-20 sm:mt-32">
                    <div className="mb-12 sm:mb-16">
                        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE] mb-2">{projectsTitle}</h2>
                        <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-300">{projectsSubtitle}</p>
                    </div>

                    <div className="space-y-10 sm:space-y-16">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="group relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 backdrop-blur-sm"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 sm:gap-8">
                                    {/* Left Content */}
                                    <div className="flex-1 space-y-5 sm:space-y-6">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white/15 select-none font-mono">
                                                {project.id}.
                                            </span>
                                            {project.handle && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                                                    <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                    </svg>
                                                    {project.handle}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${project.color}`}>
                                                {project.client}{" "}
                                                <span className="text-[#F8EFDE] font-medium text-base sm:text-xl lg:text-2xl">
                                                    | {project.service}
                                                </span>
                                            </h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-3xl">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Result Box */}
                                        <div className="bg-white/[0.04] p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-sm max-w-3xl">
                                            <span className="font-bold text-[#F8EFDE] text-xs sm:text-sm uppercase tracking-wider block mb-1">
                                                Hasil Utama:
                                            </span>
                                            <p className="text-gray-200 font-medium text-sm sm:text-base lg:text-lg">
                                                {project.result}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right / Action: Clickable Instagram Link */}
                                    {project.link && (
                                        <div className="lg:self-center shrink-0 pt-2 lg:pt-0 w-full sm:w-auto">
                                            <Link
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex sm:inline-flex items-center justify-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-white/20 hover:border-white/40 text-white font-semibold text-sm sm:text-base group/btn hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 w-full sm:w-auto"
                                            >
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md shrink-0">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                    </svg>
                                                </div>
                                                <span>Lihat di Instagram</span>
                                                <svg
                                                    className="w-4 h-4 text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
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


