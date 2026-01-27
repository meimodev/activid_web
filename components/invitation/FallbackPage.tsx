"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FallbackPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-cyan-500/30">
            {/* Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/20 via-[#050511] to-[#050511] z-0" />

            {/* Stars / Dust Particles */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '2.5s' }} />
                <div className="absolute top-10 right-10 w-2 h-2 bg-indigo-400 rounded-full blur-[2px] animate-pulse" />
                <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full" />

                {/* Randomly placed tiny stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full w-px h-px"
                        initial={{ opacity: 0.1, scale: 0.5 }}
                        animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.5, 1.2, 0.5] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}

                {/* Nebula Glows */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-120 h-120 bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Shooting Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ left: '-10%', top: '20%', opacity: 0 }}
                    animate={{ left: '120%', top: '40%', opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
                    className="absolute w-32 h-px bg-linear-to-r from-transparent via-white to-transparent rotate-12"
                />
                <motion.div
                    initial={{ right: '-10%', top: '10%', opacity: 0 }}
                    animate={{ right: '120%', top: '60%', opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 7, ease: "linear" }}
                    className="absolute w-48 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent -rotate-12"
                />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
                {/* Floating Planet Illustration */}
                <motion.div
                    initial={{ y: 0, rotate: 0 }}
                    animate={{ y: [-15, 15, -15], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-40 h-40 mx-auto mb-8"
                >
                    {/* Planet Glow */}
                    <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 blur-xl opacity-40 animate-pulse" />

                    {/* Planet Body */}
                    <div className="relative w-full h-full rounded-full bg-linear-to-br from-indigo-400 via-purple-500 to-pink-500 shadow-inner overflow-hidden border border-white/20 grid place-items-center group">
                        <span className="text-7xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">🪐</span>

                        {/* Orbiting Ring/Satellite */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-white/30 border-dashed w-[140%] h-[140%] left-[-20%] top-[-20%]"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute w-full h-full"
                        >
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* 404 / Oops Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-linear-to-b from-white via-indigo-100 to-indigo-900 bg-clip-text text-transparent drop-shadow-2xl">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-indigo-200">
                        Hilang di Luar Angkasa
                    </h2>
                </motion.div>

                {/* Message Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] hover:border-indigo-500/30 hover:shadow-[0_0_80px_-20px_rgba(79,70,229,0.5)] transition-all"
                >
                    <p className="text-lg text-indigo-100 leading-relaxed mb-6 font-medium">
                        Waduh! Link undangan yang kamu tuju sepertinya tersesat di galaksi lain atau belum dibuat sama sekali. 🛸
                    </p>

                    <p className="text-sm text-indigo-300/80 font-mono border-t border-white/10 pt-4 mt-4">
                        "Houston, we have a problem... Typo detected?"
                    </p>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Link
                        href="/invitation"
                        className="group relative px-10 py-4 bg-white text-[#050511] rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-200 via-purple-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            🚀 Kembali ke Pangkalan
                        </span>
                    </Link>
                </motion.div>
            </div>

            {/* Grid Line Decoration */}
            <div className="absolute bottom-0 w-full h-[30vh] bg-[linear-gradient(to_bottom,transparent_0%,#4f46e5_100%)] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
        </div>
    );
}
