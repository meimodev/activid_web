import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
    title: "Social Media Management | Activid Services",
    description: "Mengelola dan mengembangkan citra brand Anda di media sosial.",
};

export default function SocialMediaPage() {
    const showcases = [
        {
            category: "Coffee Shop",
            colors: ["#2C4A3B", "#E8DCCA", "#5C4033"],
            image: "/images/social-media/coffee-grid.jpg",
            description: (
                <>
                    Kami <strong>merancang visual yang hangat, estetis, dan mengundang</strong> yang menangkap suasana unik kedai kopi Anda, membuat merek Anda terasa nyaman, modern, dan sulit ditolak.
                </>
            )
        },
        {
            category: "Beauty",
            colors: ["#FFB7B2", "#FFFFFF", "#C08552"],
            image: "/images/social-media/beauty-grid.png",
            description: (
                <>
                    Kami <strong>menciptakan desain media sosial yang bersih, elegan, dan terlihat premium</strong> yang meningkatkan nilai produk kecantikan Anda, membuatnya tampak lebih terpercaya, menarik, dan berkelas.
                </>
            )
        },
        {
            category: "F&B",
            colors: ["#E67E22", "#1A1A1A", "#F1C40F"],
            image: "/images/social-media/fnb-grid.png",
            description: (
                <>
                    Kami <strong>membuat desain media sosial</strong> yang mengubah setiap hidangan menjadi pengalaman visual yang menggugah selera, membantu restoran Anda menonjol, menarik perhatian, dan membangkitkan selera makan bahkan sebelum pelanggan masuk.
                </>
            )
        },
        {
            category: "Automotive",
            colors: ["#C0392B", "#000000", "#922B21"],
            image: "/images/social-media/automotive-grid.png",
            description: (
                <>
                    Kami <strong>menciptakan visual yang berani, tajam, dan berdampak tinggi</strong> yang mencerminkan kekuatan dan keandalan, sempurna untuk merek otomotif dan bengkel yang menginginkan tampilan modern, profesional, dan berorientasi performa.
                </>
            )
        }
    ];

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
                            Social Media Management
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed font-sans">
                            Mengelola dan mengembangkan citra brand Anda di media sosial. Mulai dari strategi konten, desain, copywriting, hingga analisis performa.
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
