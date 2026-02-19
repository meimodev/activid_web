"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
    // Demo Data as requested
    const templates = [
        {
            id: "flow-1-demo",
            templateId: "flow-1",
            title: "Flow-1",
            image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["Wedding", "Maroon"],
           priceOriginal: "450.000",
            priceDiscount: "159.000",
        },

        {
            id: "venus-1-demo",
            templateId: "venus-1",
            title: "Venus-1",
            image: "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["Wedding", "Haruki"],
            priceOriginal: "450.000",
            priceDiscount: "159.000",
        },

        {
            id: "neptune-1-demo",
            templateId: "neptune-1",
            title: "Neptune-1",
            image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["Wedding", "Neptune"],
            priceOriginal: "450.000",
            priceDiscount: "159.000",
        },

        {
            id: "mercury-demo",
            templateId: "mercury-1",
            title: "Mercury",
            image: "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["Wedding", "Floral"],
            priceOriginal: "450.000",
            priceDiscount: "159.000",
        },



        {
            id: "jupiter-demo",
            templateId: "jupiter",
            title: "Jupiter",
            image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["Wedding", "Jupiter"],
            priceOriginal: "450.000",
            priceDiscount: "159.000",
        },

    ];

    const [viewedTemplates, setViewedTemplates] = React.useState<string[]>([]);

    React.useEffect(() => {
        const stored = localStorage.getItem("activid_viewed_templates");
        if (stored) {
            setViewedTemplates(JSON.parse(stored));
        }
    }, []);

    const handleView = (id: string) => {
        if (!viewedTemplates.includes(id)) {
            const updated = [...viewedTemplates, id];
            setViewedTemplates(updated);
            localStorage.setItem("activid_viewed_templates", JSON.stringify(updated));
        }
    };

    const WHATSAPP_NUMBER = "62881080088816";
    const createWhatsAppUrl = (message: string) =>
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Deep Space Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020205_60%)]" />

                {/* Animated Nebulas */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"
                />

                {/* Passing Meteor */}
                <motion.div
                    initial={{ left: '-10%', top: '10%' }}
                    animate={{ left: '120%', top: '30%' }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 15, ease: "linear" }}
                    className="absolute w-64 h-[2px] bg-linear-to-r from-transparent via-cyan-200 to-transparent rotate-12 blur-[1px]"
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5 sticky top-0 z-50 supports-backdrop-filter:bg-black/10">
                    <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 rounded-full border border-indigo-500/50 border-t-white"
                        />
                        <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                            Activid<span className="text-indigo-500">.</span>Invitation
                        </span>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-8 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-300 mb-4 backdrop-blur-md relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                        PESAWAT SIAP
                    </motion.div>

                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black tracking-tight leading-tight"
                        >
                            Jelajahi <br />
                            <span
                                className="bg-linear-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]"
                                style={{
                                    textShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
                                    WebkitBackgroundClip: "text",
                                }}
                            >
                                Undangan Digital
                            </span>
                        </motion.h1>

                        {/* Satellites orbiting title */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/5"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" />
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-indigo-200/70 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Lintasi batas imajinasi. <br />Pilih misi, sesuaikan orbit, dan luncurkan kabar bahagia ke seluruh semesta.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.7 }}
                        className="max-w-2xl w-full"
                    >
                        <div className="mx-auto inline-flex flex-col items-center gap-3 px-5 py-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
                            <p className="text-xs md:text-sm text-indigo-200/70 font-mono tracking-wide">
                                Tersedia untuk:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["Pernikahan", "Ulang Tahun", "Acara", "Syukuran"].map((label) => (
                                    <span
                                        key={label}
                                        className="text-[10px] md:text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Template Gallery */}
                <section className="max-w-7xl mx-auto w-full px-6 pb-24 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, index) => {
                            const isViewed = viewedTemplates.includes(template.id);

                            return (
                                <motion.div
                                    key={template.id + index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    onClick={() => handleView(template.id)}
                                    className={`group relative rounded-3xl overflow-hidden bg-[#0d0d1f] border transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] hover:-translate-y-2 cursor-pointer ${isViewed
                                        ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                        : "border-white/5 hover:border-indigo-500/50"
                                        }`}
                                >
                                    <Link href={`/invitation/${template.id}`} target="_blank" className="block h-full w-full">
                                        <div className="aspect-4/5 overflow-hidden relative">
                                            <img
                                                src={template.image}
                                                alt={template.title}
                                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isViewed ? 'grayscale-[0.8] group-hover:grayscale-0' : 'grayscale-[0.6] group-hover:grayscale-0'}`}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-[#020205] via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-all" />

                                            {/* Holographic Overlay Effect */}
                                            <motion.div
                                                aria-hidden
                                                className="absolute inset-0 opacity-0 pointer-events-none mix-blend-screen blur-[0.2px] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.26)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]"
                                                animate={{ opacity: [0, 0.22, 0, 0] }}
                                                transition={{
                                                    duration: 5.5,
                                                    repeat: Infinity,
                                                    repeatDelay: 7,
                                                    delay: index * 1.2,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

                                            

                                            {/* Overlay Content */}
                                            <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    {template.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/10">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className={`text-2xl font-bold mb-1 transition-colors ${isViewed ? "text-green-100/80" : "text-white group-hover:text-indigo-200"}`}>{template.title}</h3>
                                               

                                                <div className="flex items-end justify-between gap-4 mb-5">
                                                    <div>
                                                        <div className="flex items-baseline gap-2">
                                                            <div className="text-2xl font-black tracking-tight text-white">
                                                                {template.priceDiscount}
                                                            </div>
                                                            <div className="text-xs text-white/35 line-through">
                                                                {template.priceOriginal}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            window.open(
                                                                createWhatsAppUrl(`INV-${template.templateId}-order`),
                                                                "_blank",
                                                                "noopener,noreferrer",
                                                            );
                                                        }}
                                                        className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/40 text-green-200 text-xs font-bold uppercase tracking-wider hover:bg-green-500/25 hover:border-green-400/70 transition-colors"
                                                    >
                                                        Pesan
                                                    </button>
                                                </div>
                                                <div
                                                    className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors group/link ${isViewed ? "text-green-400" : "text-white hover:text-cyan-400"}`}
                                                >
                                                    {isViewed ? "Lihat Lagi" : "Lihat Detail "}
                                                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 0.98 }}
                            className="relative rounded-3xl overflow-hidden bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center group hover:border-white/30 transition-all cursor-wait"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                                <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping opacity-20" />
                                <span className="text-4xl relative z-10">🔭</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Memindai Antariksa ...</h3>
                            <p className="text-indigo-300/60 text-sm">
                                Mendeteksi misi baru yang akan datang.
                            </p>
                            <h3 className="text-indigo-300/60 text-sm my-2">Estimasi kedatangan: SEGERA.</h3>

                        </motion.div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto w-full px-6 pb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md"
                    >
                        <motion.div
                            aria-hidden
                            className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-indigo-600/15 blur-[110px] mix-blend-screen"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
                            transition={{ duration: 7, repeat: Infinity }}
                        />
                        <motion.div
                            aria-hidden
                            className="absolute -bottom-40 -left-20 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1.2 }}
                        />
                        <motion.div
                            aria-hidden
                            className="absolute inset-0 opacity-25"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                            style={{
                                background:
                                    "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.16), transparent 50%), radial-gradient(circle at 50% 90%, rgba(168,85,247,0.14), transparent 55%)",
                            }}
                        />

                        <div className="relative p-10 md:p-14">
                            <div className="max-w-3xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-200/80"
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                                    Konsultasi antariksa
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.75, delay: 0.05 }}
                                    viewport={{ once: true }}
                                    className="mt-6 text-3xl md:text-5xl font-black tracking-tight"
                                >
                                    Siap meluncurkan undanganmu?
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.75, delay: 0.12 }}
                                    viewport={{ once: true }}
                                    className="mt-4 text-indigo-200/70 text-base md:text-lg leading-relaxed"
                                >
                                    Untuk tanya-tanya bisa klik tombol di bawah yaaa
                                </motion.p>

                                <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            window.open(
                                                createWhatsAppUrl("INV tolong informasi tentang: "),
                                                "_blank",
                                                "noopener,noreferrer",
                                            );
                                        }}
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-green-500/15 border border-green-500/40 text-green-100 font-bold tracking-wide hover:bg-green-500/25 hover:border-green-400/70 transition-colors"
                                    >
                                        Sambungkan Markas
                                    </motion.button>
                                   
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="mt-auto border-t border-white/5 relative z-10">
                    <div className="relative overflow-hidden">
                        <motion.div
                            aria-hidden
                            className="absolute inset-0 opacity-30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                            style={{
                                background:
                                    "radial-gradient(circle at 10% 20%, rgba(79,70,229,0.18), transparent 55%), radial-gradient(circle at 90% 30%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(circle at 50% 95%, rgba(168,85,247,0.12), transparent 55%)",
                            }}
                        />
                        <div className="relative max-w-7xl mx-auto px-6 py-12">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                                <div className="max-w-md">
                                    <div className="text-lg font-black tracking-tight">
                                        <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                                            Activid<span className="text-indigo-500">.</span>Invitation
                                        </span>
                                    </div>
                                     <div className="text-sm font-medium tracking-tight">
                                        <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                                           Dikirim semesta, beritakan kabar gembiramu
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div>
                                        <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                                            Navigasi
                                        </div>
                                        <div className="mt-3 flex flex-col gap-2 text-sm">
                                            <Link
                                                href="https://www.activid.id"
                                                target="_blank"
                                                className="text-white/70 hover:text-white transition-colors"
                                            >
                                                Kembali ke kapal induk
                                            </Link>
                                            <Link
                                                href="/invitation"
                                                className="text-white/70 hover:text-white transition-colors"
                                            >
                                                Template Misi
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                                            Kontak
                                        </div>
                                        <div className="mt-3 flex flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    window.open(
                                                        createWhatsAppUrl("INV tolong informasi tentang: "),
                                                        "_blank",
                                                        "noopener,noreferrer",
                                                    );
                                                }}
                                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/40 text-green-100 text-xs font-bold uppercase tracking-wider hover:bg-green-500/25 hover:border-green-400/70 transition-colors"
                                            >
                                                Hubungi stasiun
                                            </button>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-indigo-500/35">
                                <p>TRANSMISSION END // ACTIVID.ID // {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-200 mix-blend-overlay pointer-events-none z-50" />

            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes shimmer {
                    from { background-position: 0% 0%; }
                    to { background-position: -200% -200%; }
                }
            `}</style>
        </div>
    );
}
