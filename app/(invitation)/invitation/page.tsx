"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
    // Demo Data as requested
    const templates = [
        {
            id: "flow-1-demo",
            title: "Flow-1",
            image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
            desc: "Perjalanan Klasik & Elegan",
            tags: ["Wedding", "Maroon"]
        },

        {
            id: "venus-1-demo",
            title: "Venus-1",
            image: "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
            desc: "Haruki (Ringvitation) Clone",
            tags: ["Wedding", "Haruki"]
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

    return (
        <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* ... (Background layers remain the same, referenced by context but not changed in this chunk if possible, wait, I need to output the full file structure or just the modified parts. I will output the relevant return block parts) ... */}
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
                        Siap meluncur
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
                        Lintasi batas kreativitas. <br />Pilih misi, sesuaikan orbit, dan luncurkan kabar bahagia ke seluruh semesta.
                    </motion.p>
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
                                    <Link href={`/invitation/${template.id}`} className="block h-full w-full">
                                        <div className="aspect-4/5 overflow-hidden relative">
                                            <img
                                                src={template.image}
                                                alt={template.title}
                                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isViewed ? 'grayscale-[0.8] group-hover:grayscale-0' : 'grayscale-[0.6] group-hover:grayscale-0'}`}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-[#020205] via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-all" />

                                            {/* Holographic Overlay Effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

                                            {/* Viewed Badge */}
                                            {isViewed && (
                                                <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-20 flex items-center gap-1 shadow-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                    Misi Selesai
                                                </div>
                                            )}

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
                                                <p className="text-sm text-indigo-300/80 mb-6 line-clamp-2">
                                                    {template.desc}
                                                </p>
                                                <div
                                                    className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors group/link ${isViewed ? "text-green-400" : "text-white hover:text-cyan-400"}`}
                                                >
                                                    {isViewed ? "Lihat Lagi" : "Lihat Detail Misi"}
                                                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        {/* Coming Soon Card with Holographic Effect */}
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
                            <h3 className="text-xl font-bold text-white mb-2">Memindai Angkasa...</h3>
                            <p className="text-indigo-300/60 text-sm">
                                Mendeteksi tema baru yang sedang mendekat.<br />Estimasi kedatangan: Segera.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-auto py-8 border-t border-white/5 text-center text-indigo-500/30 text-xs font-mono relative z-10">
                    <p>TRANSMISSION END // ACTIVID.SPACE // {new Date().getFullYear()}</p>
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
