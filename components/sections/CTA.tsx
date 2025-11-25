'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTA() {
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                delay,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // Custom easeOutQuint-like curve for elegance
            },
        }),
    };

    return (
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#1a1a3e] relative overflow-hidden">
            {/* Background Gradient Orbs - Slow Floating Animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                        x: [0, 20, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8B5CF6] rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15],
                        x: [0, -30, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#EC4899] rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.h2
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariant}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#F8EFDE] font-sans tracking-tight mb-8"
                    >
                        Ready to Start Your Project?
                    </motion.h2>

                    <motion.p
                        custom={0.2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariant}
                        className="text-lg sm:text-xl text-[#F8EFDE]/80 leading-relaxed max-w-2xl mb-12"
                    >
                        Mari berkolaborasi untuk mewujudkan visi Anda. Apakah Anda membutuhkan website baru, branding, atau manajemen media sosial, kami siap membantu.
                    </motion.p>

                    <motion.div
                        custom={0.4}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariant}
                    >
                        <Link href="/contact" passHref>
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className="px-12 py-6 bg-[#F8EFDE] text-[#1a1a3e] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(248,239,222,0.1)] hover:shadow-[0_0_40px_rgba(248,239,222,0.4)] focus:outline-none focus:ring-2 focus:ring-[#F8EFDE] focus:ring-offset-2 focus:ring-offset-[#1a1a3e] font-sans"
                            >
                                Get in Touch
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
