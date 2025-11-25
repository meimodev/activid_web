import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
    title: "Branding & Design | Activid Services",
    description: "Membentuk identitas visual yang kuat dari logo, palet warna, tipografi, hingga panduan brand lengkap.",
};

export default function BrandingPage() {
    const projects = [
        {
            id: "01",
            client: "@baksodenny",
            service: "re-branding",
            description: "Kami bantu klien membangun kembali branding mulai dari logo, strategi konten kreatif, visual konsisten, dan tone komunikasi yang relevan.",
            result: "Engagement naik 60% dalam 2 bulan, dengan citra brand yang lebih profesional.",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop", // Food
            color: "text-[#D9381E]"
        },
        {
            id: "02",
            client: "@bbold.mmxx",
            service: "Brand Kickstart & Social Media Setup",
            description: "Kami mendampingi klien sejak awal membangun identitas digital mulai dari konsep visual, tone warna, hingga gaya komunikasi di media sosial agar tampil konsisten dan siap bersaing secara online.",
            result: "Brand berhasil hadir dengan tampilan digital yang rapi, terarah, dan mudah dikenali audiens.",
            image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=600&fit=crop", // Interior/Style
            color: "text-[#8B4513]"
        },
        {
            id: "03",
            client: "@fourevergift_",
            service: "Social Media Setup",
            description: "Kami bantu klien mengembangkan tampilan media sosial yang menyesuaikan keinginan dan karakter owner dari pemilihan warna, dan tema visual.",
            result: "Tujuan tercapai untuk pembuatan Feed yang ceria dan menarik, serta berhasil membangun kedekatan dengan audiens.",
            image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop", // Gift
            color: "text-[#E91E63]"
        }
    ];

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
                            Branding & Design
                        </h1>
                        <p className="text-xl lg:text-2xl text-[#1a1a3e]/80 leading-relaxed font-sans">
                            Membentuk identitas visual yang kuat dari logo, palet warna, tipografi, hingga panduan brand lengkap yang menggambarkan nilai dan karakter bisnis Anda.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-left">
                        <Image
                            src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
                            alt="Branding & Design"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mt-24">
                    <div className="mb-16">
                        <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#1a1a3e] mb-2">Project</h2>
                        <p className="text-2xl lg:text-3xl font-medium text-[#1a1a3e]/80">Branding & Design</p>
                    </div>

                    <div className="space-y-32">
                        {projects.map((project, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Image Card */}
                                <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 bg-[#1a1a3e]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <Image
                                        src={project.image}
                                        alt={project.client}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Mockup Overlay Effect */}
                                    <div className="absolute inset-0 border-[12px] border-[#1a1a3e] rounded-3xl pointer-events-none opacity-10" />
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
