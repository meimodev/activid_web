import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Photography | Activid Services",
    description: "Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional.",
};

export default function ProductPhotographyPage() {
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
                                Product Photography
                            </h1>
                            <p className="text-xl lg:text-2xl text-[#1a1a3e]/80 leading-relaxed font-sans">
                                Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.
                            </p>
                        </div>

                        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-left">
                            <Image
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
                                alt="Product Photography"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Project 1: F&B */}
            <section className="bg-[#050511] text-white py-24 lg:py-32 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] to-[#050511] opacity-50 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
                            <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE]">
                                Project
                            </h2>
                            <div className="space-y-6">
                                <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                    Food and Beverage Photography
                                </h3>
                                <div className="w-20 h-1 bg-[#F8EFDE]/20" />
                                <div>
                                    <h4 className="text-xl font-bold text-[#F8EFDE] mb-2">DNA Cafe & Resto</h4>
                                    <p className="text-white/70 leading-relaxed">
                                        Kami membantu client untuk menghasilkan foto makanan dan minuman dengan visual yang rapi dan menggugah selera, menonjolkan detail dan kualitas agar terlihat lebih menarik dan siap digunakan untuk kebutuhan branding maupun promosi
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Grid */}
                        <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                            {/* Tall image */}
                            <div className="row-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                                    alt="Drink"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Wide image */}
                            <div className="col-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
                                    alt="Burger"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Tall image */}
                            <div className="row-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop"
                                    alt="Pizza"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Square image */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800&auto=format&fit=crop"
                                    alt="Fries"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Square image */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop"
                                    alt="Coffee"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Tall image */}
                            <div className="row-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"
                                    alt="Drink"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project 2: Property Photography */}
            <section className="bg-[#050511] text-white py-24 lg:py-32 relative border-t border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-[#1a0b2e] to-[#050511] opacity-50 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
                            <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-[#F8EFDE]">
                                Project
                            </h2>
                            <div className="space-y-6">
                                <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                    Property Photography
                                </h3>
                                <div className="w-20 h-1 bg-[#F8EFDE]/20" />
                                <div>
                                    <h4 className="text-xl font-bold text-[#F8EFDE] mb-2">Yama Resort</h4>
                                    <p className="text-white/70 leading-relaxed">
                                        Kami membantu client menghasilkan foto resort dengan visual yang estetik dan profesional, menonjolkan suasana, fasilitas, dan keindahan lingkungan agar terlihat lebih menarik dan mampu menggambarkan pengalaman menginap secara optimal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Grid */}
                        <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                            {/* Tall image (Bedroom) */}
                            <div className="row-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop"
                                    alt="Bedroom"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Vertical image (Detail) */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"
                                    alt="Interior Detail"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Square image (Lounge) */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
                                    alt="Lounge"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Wide image (Hall) */}
                            <div className="col-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
                                    alt="Hall"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Square image (Exterior) */}
                            <div className="relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop"
                                    alt="Exterior"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            {/* Wide image (Twin Beds) */}
                            <div className="col-span-2 relative rounded-2xl overflow-hidden group">
                                <Image
                                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"
                                    alt="Twin Beds"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview & CTA Section */}
            <section className="bg-[#F8EFDE] text-[#1a1a3e] py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-8 space-y-8">
                            <h2 className="text-3xl lg:text-4xl font-bold font-sans">Overview</h2>
                            <p className="text-lg text-[#1a1a3e]/80 leading-relaxed">
                                Foto produk yang baik dapat meningkatkan nilai jual secara signifikan. Kami menggunakan teknik pencahayaan dan styling profesional untuk menonjolkan fitur terbaik produk Anda, membuatnya terlihat menggoda dan premium di mata calon pelanggan.
                            </p>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="lg:col-span-4">
                            <div className="bg-[#1a1a3e] text-[#F8EFDE] p-8 rounded-3xl">
                                <h3 className="text-2xl font-bold mb-4">Interested in this service?</h3>
                                <p className="text-[#F8EFDE]/80 mb-8">
                                    Let's discuss how we can help you achieve your goals with our Product Photography services.
                                </p>
                                <a
                                    href="/contact"
                                    className="block w-full py-4 px-6 bg-[#F8EFDE] text-[#1a1a3e] text-center font-bold rounded-xl hover:bg-white transition-colors duration-300"
                                >
                                    Start a Project
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
