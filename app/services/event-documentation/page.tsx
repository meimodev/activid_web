import Image from "next/image";
import { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
    title: "Event & Documentation | Activid Services",
    description: "Menangkap momen terbaik dari setiap acara Anda dengan kualitas visual yang hidup.",
};

export default function EventDocumentationPage() {


    const projects = [
        {
            title: "Pertamina Geothermal Energy Tbk",
            description: "Kami memproduksi video company profile PT Pertamina Geothermal yang menampilkan operasi panas bumi, teknologi dan komitmen terhadap energi bersih dalam visual yang profesional dan terstruktur, untuk memperkuat citra perusahaan sebagai pemimpin di sektor energi terbarukan.",
            image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "PT. Bank Rakyat Indonesia (Persero) Tbk",
            description: "Kami mendokumentasikan dan memproduksi video event BRI Peduli - Srikandi BRI dengan fokus pada penyampaian momen penting, nilai sosial, serta semangat pemberdayaan perempuan yang menjadi inti acara.",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Wedding of Toar & Taya",
            description: "Kami memproduksi video wedding cinematic yang menangkap setiap momen dengan sentuhan visual artistik, alur cerita yang emosional, dan pengambilan gambar yang dramatis.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
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
                            Event & Documentation
                        </h1>
                        <p className="text-xl lg:text-2xl text-[#1a1a3e]/80 leading-relaxed font-sans">
                            Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-left">
                        <Image
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
                            alt="Event & Documentation"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                </div>



            </div>

            {/* Project Section */}
            <div className="w-full">
                <div className="container mx-auto px-4 mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-2 lg:gap-6">
                        <h2 className="text-6xl lg:text-8xl font-black text-[#1a1a3e] tracking-tight">Project</h2>
                        <span className="text-2xl lg:text-3xl font-medium text-[#1a1a3e] mb-2 lg:mb-4">
                            Event &<br />Documentation
                        </span>
                    </div>
                </div>

                <div className="w-full bg-[#1a1a3e] rounded-t-[3rem] lg:rounded-t-[5rem] py-16 lg:py-24 px-4">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <div key={index} className="group rounded-3xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors duration-300 border border-white/10">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-[#F8EFDE] mb-4 font-sans">
                                            {project.title}
                                        </h3>
                                        <p className="text-[#F8EFDE]/70 text-sm leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-24 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl lg:text-4xl font-bold font-sans">Overview</h2>
                    <p className="text-lg text-[#1a1a3e]/80 leading-relaxed">
                        Setiap momen berharga layak untuk diabadikan dengan sempurna. Tim fotografer dan videografer kami berpengalaman dalam menangkap emosi dan atmosfer acara, memastikan setiap detik penting terekam dengan kualitas sinematik yang tinggi.
                    </p>
                </div>
            </div>
            <CTA />
        </main>
    );
}
