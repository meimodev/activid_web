"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  // Demo Data as requested
  const templates = [
    {
      id: "flow-demo",
      templateId: "flow",
      title: "Flow",
      image:
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Maroon"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "venus-demo",
      templateId: "venus",
      title: "Venus",
      image:
        "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Haruki"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "neptune-demo",
      templateId: "neptune",
      title: "Neptune",
      image:
        "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Neptune"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "mercury-demo",
      templateId: "mercury",
      title: "Mercury",
      image:
        "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Floral"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "pluto-demo",
      templateId: "pluto",
      title: "Pluto",
      image:
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Pluto"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "amalthea-demo",
      templateId: "amalthea",
      title: "Amalthea",
      image:
        "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Wedding", "Sky Blue"],
      priceOriginal: "450.000",
      priceDiscount: "159.000",
    },

    {
      id: "jupiter-demo",
      templateId: "jupiter",
      title: "Jupiter",
      image:
        "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
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
          initial={{ left: "-10%", top: "10%" }}
          animate={{ left: "120%", top: "30%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "linear",
          }}
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
              animate={{ x: ["-100%", "200%"] }}
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
              className="text-5xl font-black tracking-tight leading-tight"
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
            className="text-lg text-indigo-200/70 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Lintasi batas imajinasi. <br />
            Pilih misi, sesuaikan orbit, dan luncurkan kabar bahagia ke seluruh
            semesta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="max-w-2xl w-full"
          >
            <div className="mx-auto inline-flex flex-col items-center gap-3 px-5 py-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
              <p className="text-xs text-indigo-200/70 font-mono tracking-wide">
                Tersedia untuk:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Pernikahan", "Ulang Tahun", "Acara", "Syukuran"].map(
                  (label) => (
                    <span
                      key={label}
                      className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Template Gallery */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template, index) => {
              const isViewed = viewedTemplates.includes(template.id);

              return (
                <motion.div
                  key={template.id + index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0d0d1f] border transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] hover:-translate-y-1 ${
                    isViewed
                      ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                      : "border-white/5 hover:border-indigo-500/50"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleView(template.id);
                        window.open(
                          `/invitation/${template.id}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="aspect-4/5 overflow-hidden relative text-left"
                      aria-label={`Lihat template ${template.title}`}
                    >
                      <img
                        src={template.image}
                        alt={template.title}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isViewed ? "grayscale-[0.8] group-hover:grayscale-0" : "grayscale-[0.6] group-hover:grayscale-0"}`}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#020205]/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-all" />

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
                      {isViewed ? (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.55)]" />
                          Viewed
                        </div>
                      ) : null}
                    </button>

                    <div className="flex flex-col gap-3 p-4 sm:p-5 bg-black/20 backdrop-blur-md border-t border-white/5">
                      <h3
                        className={`text-sm sm:text-base font-bold tracking-tight truncate transition-colors ${isViewed ? "text-green-100/80" : "text-white group-hover:text-indigo-200"}`}
                      >
                        {template.title}
                      </h3>

                      <div className="flex items-baseline gap-2">
                        <div className="text-base sm:text-xl font-black tracking-tight text-white">
                          {template.priceDiscount}
                        </div>
                        <div className="text-xs text-white/35 line-through">
                          {template.priceOriginal}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleView(template.id);
                            window.open(
                              `/invitation/${template.id}`,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          aria-label="Lihat"
                          className="inline-flex items-center justify-center gap-0.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-linear-to-r from-indigo-500/15 via-purple-500/10 to-cyan-500/10 border border-indigo-400/40 text-indigo-100 text-xs font-black uppercase tracking-wider hover:bg-indigo-500/20 hover:border-indigo-300/70 transition-colors"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-indigo-200"
                          >
                            <path
                              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">Lihat</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              createWhatsAppUrl(
                                `INV-${template.templateId}-order`,
                              ),
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          aria-label="Pesan"
                          className="inline-flex items-center justify-center gap-0.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-linear-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/10 border border-green-500/40 text-green-100 text-xs font-black uppercase tracking-wider hover:bg-green-500/20 hover:border-green-400/70 transition-colors"
                        >
                          <span>🚀</span>

                          <span className="hidden sm:inline">Pesan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 0.98 }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center p-6 sm:p-12 text-center group hover:border-white/30 transition-all cursor-wait"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping opacity-20" />
                <span className="text-3xl sm:text-4xl relative z-10">🔭</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                Memindai Antariksa ...
              </h3>
              <p className="text-indigo-300/60 text-xs sm:text-sm">
                Mendeteksi misi baru yang akan datang.
              </p>
              <h3 className="text-indigo-300/60 text-xs sm:text-sm my-2">
                Estimasi kedatangan: SEGERA.
              </h3>
            </motion.div>
          </div>
        </section>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            window.open(
              createWhatsAppUrl("[INV] Halo mau informasi tentang, "),
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_40px_-12px_rgba(34,197,94,0.55)] hover:shadow-[0_0_55px_-12px_rgba(34,211,238,0.5)] transition-shadow"
          aria-label="Buka WhatsApp untuk konsultasi"
        >
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-green-400/20 via-emerald-400/10 to-cyan-400/15 border border-white/10">
            <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.25),transparent_60%)]" />
            <span className="relative text-sm font-black tracking-tight text-white">
              🚀
            </span>
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-xs font-black uppercase tracking-wider text-white">
              WhatsApp
            </span>
            <span className="text-[11px] text-indigo-200/70 font-mono">
              Konsultasi
            </span>
          </span>
          <span className="ml-1 text-white/70">→</span>
        </motion.button>

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

            <div className="relative p-10">
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
                  className="mt-6 text-3xl font-black tracking-tight"
                >
                  Siap meluncurkan undanganmu?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.12 }}
                  viewport={{ once: true }}
                  className="mt-4 text-indigo-200/70 text-base leading-relaxed"
                >
                  Untuk tanya-tanya bisa klik tombol di bawah yaaa
                </motion.p>

                <div className="mt-8 flex flex-col gap-4">
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
              <div className="flex flex-col gap-10">
                <div className="max-w-md">
                  <div className="text-lg font-black tracking-tight">
                    <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                      Activid<span className="text-indigo-500">.</span>
                      Invitation
                    </span>
                  </div>
                  <div className="text-sm font-medium tracking-tight">
                    <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                      Dikirim semesta, beritakan kabar gembiramu
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
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

              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center justify-between gap-3 text-xs font-mono text-indigo-500/35">
                <p>
                  TRANSMISSION END // ACTIVID.ID // {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-200 mix-blend-overlay pointer-events-none z-50" />

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmer {
          from {
            background-position: 0% 0%;
          }
          to {
            background-position: -200% -200%;
          }
        }
      `}</style>
    </div>
  );
}
