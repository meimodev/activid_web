import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Video & Podcast Production | Activid Services",
    description: "Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal.",
};

export default function VideoPodcastPage() {
    // No features list needed for this specific layout anymore

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
                            Video & Podcast Production
                        </h1>
                        <p className="text-xl lg:text-2xl text-[#1a1a3e]/80 leading-relaxed font-sans">
                            Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal. Dari konsep, shooting, editing, hingga final rendering, kami siap bantu Anda bercerita lewat video promosi, company profile, hingga podcast profesional.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-left">
                        <Image
                            src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop"
                            alt="Video & Podcast Production"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                </div>

            </div>

            {/* Projects Section - Full Width */}
            <div className="w-full mb-24">
                <div className="container mx-auto px-4 mb-16">
                    <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#1a1a3e] mb-2">Project</h2>
                    <p className="text-2xl lg:text-3xl font-medium text-[#1a1a3e]/80">Video & Podcast Production</p>
                </div>

                <div className="w-screen ml-[calc(50%-50vw)] bg-[#1a1a3e]/5 py-24 overflow-hidden relative">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column - Main Video Preview */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1a1a3e]">
                                    <Image
                                        src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=1200&h=800&fit=crop"
                                        alt="Tou Minaesa Podcast Studio"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/10 transition-colors">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                                            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                                        </div>
                                    </div>
                                    {/* UI Mockup Elements */}
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                                        <div className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-red-600 rounded-full" />
                                        </div>
                                        <div className="flex gap-2 text-white/80">
                                            <div className="w-6 h-6 rounded-full border border-white/50" />
                                            <div className="w-6 h-6 rounded-full border border-white/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Thumbnails & Content */}
                            <div className="lg:col-span-5 space-y-12">
                                {/* Thumbnails Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=600&fit=crop"
                                                alt="Short Video 1"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-2 left-2 text-white text-xs font-bold shadow-black drop-shadow-md">Behind The Scene</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop"
                                                alt="Short Video 2"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-[#1a1a3e]/20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
                                                alt="Short Video 3"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="relative">
                                    <h3 className="text-3xl lg:text-4xl font-bold text-[#1a1a3e] mb-4">Tou Minaesa Project</h3>
                                    <p className="text-[#1a1a3e]/80 leading-relaxed mb-6">
                                        Kami bantu klien membangun identitas digital podcast dari nol, mulai dari proses produksi video, set up studio, pengambilan gambar, desain thumbnail, hingga pengemasan ulang konten menjadi reels yang menarik di berbagai platform.
                                    </p>

                                    <div className="bg-white/60 p-6 rounded-2xl border border-[#1a1a3e]/10 backdrop-blur-sm relative z-10">
                                        <span className="font-bold text-[#1a1a3e] block mb-2">Result:</span>
                                        <p className="text-[#1a1a3e]/90 text-sm leading-relaxed">
                                            Dalam 6 bulan pengelolaan oleh Activid, podcast tumbuh pesat dari 0 subscriber menjadi 600 di YouTube, 2.7K di TikTok, dan 1K followers di Instagram. Dan sekarang sudah ada 3 Segmen turunan dari Tou Minaesa Project.
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

                {/* CTA Section */}
                <div className="mt-32 bg-[#1a1a3e] text-[#F8EFDE] p-12 lg:p-24 rounded-[3rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-[#F8EFDE] blur-[100px]" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tight">Ready to start your podcast?</h2>
                        <p className="text-xl text-[#F8EFDE]/80">
                            Let's create high-quality content that resonates with your audience.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block py-4 px-12 bg-[#F8EFDE] text-[#1a1a3e] text-lg font-bold rounded-full hover:scale-105 transition-transform duration-300"
                        >
                            Start Production
                        </a>
                    </div>
                </div>

            </div>
        </main>
    );
}
