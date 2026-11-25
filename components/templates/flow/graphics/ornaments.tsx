"use client";

export function SectionDivider() {
    return (
        <div className="w-full flex justify-center py-8 opacity-80 text-wedding-accent-light">
            <svg width="280" height="30" viewBox="0 0 280 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 25C165 25 180 15 200 15C220 15 240 20 260 20C270 20 275 10 280 5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M140 25C115 25 100 15 80 15C60 15 40 20 20 20C10 20 5 10 0 5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="140" cy="22" r="4" fill="currentColor" />
                <circle cx="140" cy="22" r="2" fill="var(--invitation-bg)" />
                {/* Extra decorative dots */}
                <circle cx="100" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
                <circle cx="180" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
                <circle cx="60" cy="15" r="1" fill="currentColor" opacity="0.4" />
                <circle cx="220" cy="15" r="1" fill="currentColor" opacity="0.4" />
            </svg>
        </div>
    );
}



export function VerticalLine() {
    return (
        <div className="h-32 w-[2px] bg-linear-to-b from-transparent via-wedding-accent to-transparent mx-auto my-4 opacity-60 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-wedding-accent rotate-45 opacity-80" />
        </div>
    );
}

export function SectionOrnament() {
    return (
        <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-wedding-accent/50" />
            <div className="w-4 h-4 border border-wedding-accent/60 rotate-45" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-wedding-accent/50" />
        </div>
    );
}

export function HeartDivider() {
    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <div className="h-px w-20 bg-linear-to-r from-transparent to-wedding-accent/40" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-wedding-accent/60">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="h-px w-20 bg-linear-to-l from-transparent to-wedding-accent/40" />
        </div>
    );
}

export function RingsDivider() {
    return (
        <div className="flex items-center justify-center py-8">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="text-wedding-accent">
                <circle cx="22" cy="15" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
                <circle cx="38" cy="15" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
                <circle cx="22" cy="15" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
                <circle cx="38" cy="15" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
            </svg>
        </div>
    );
}



export function DecorativeLine({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
    if (direction === "vertical") {
        return (
            <div className="w-px h-full bg-linear-to-b from-transparent via-wedding-accent/40 to-transparent" />
        );
    }
    return (
        <div className="h-px w-full bg-linear-to-r from-transparent via-wedding-accent/40 to-transparent" />
    );
}

export function DiamondAccent() {
    return (
        <div className="flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-wedding-accent/40 rotate-45" />
            <div className="w-2 h-2 bg-wedding-accent/60 rotate-45" />
            <div className="w-1 h-1 bg-wedding-accent/40 rotate-45" />
        </div>
    );
}

export function GoldLeafBorder({ position }: { position: "top" | "bottom" }) {
    const primaryPath =
        position === "top"
            ? "M0 6 Q150 6 300 16 T600 26 Q750 26 900 16 T1200 6 Q1350 6 1500 16 T1800 26 Q1950 26 2100 16 T2400 6"
            : "M0 26 Q150 26 300 16 T600 6 Q750 6 900 16 T1200 26 Q1350 26 1500 16 T1800 6 Q1950 6 2100 16 T2400 26";

    const secondaryPath =
        position === "top"
            ? "M0 16 Q150 24 300 24 Q450 24 600 16 T900 8 Q1050 8 1200 16 Q1350 24 1500 24 Q1650 24 1800 16 T2100 8 Q2250 8 2400 16"
            : "M0 16 Q150 8 300 8 Q450 8 600 16 T900 24 Q1050 24 1200 16 Q1350 8 1500 8 Q1650 8 1800 16 T2100 24 Q2250 24 2400 16";

    return (
        <div className={`absolute left-0 right-0 ${position === "top" ? "top-0" : "bottom-0"} h-8 overflow-hidden pointer-events-none`}>
            <svg
                className="flow-wave-track-a absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-light"
                viewBox="0 0 2400 32"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d={primaryPath} stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.45" />
            </svg>
            <svg
                className="flow-wave-track-b absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-light"
                viewBox="0 0 2400 32"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d={secondaryPath} stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.24" />
            </svg>
        </div>
    );
}

export function HeroWaveDecorations() {
    const topPrimary =
        "M0 8 Q150 8 300 18 T600 28 Q750 28 900 18 T1200 8 Q1350 8 1500 18 T1800 28 Q1950 28 2100 18 T2400 8";
    const topSecondary =
        "M0 18 Q150 26 300 26 Q450 26 600 18 T900 10 Q1050 10 1200 18 Q1350 26 1500 26 Q1650 26 1800 18 T2100 10 Q2250 10 2400 18";

    const midPrimary =
        "M0 24 Q150 10 300 24 T600 38 Q750 38 900 24 T1200 24 Q1350 10 1500 24 T1800 38 Q1950 38 2100 24 T2400 24";
    const midSecondary =
        "M0 28 Q150 40 300 28 T600 16 Q750 16 900 28 T1200 28 Q1350 40 1500 28 T1800 16 Q1950 16 2100 28 T2400 28";

    const bottomFill =
        "M0 32 Q150 16 300 24 T600 32 Q750 40 900 32 T1200 32 Q1350 16 1500 24 T1800 32 Q1950 40 2100 32 T2400 32 L2400 64 L0 64 Z";
    const bottomLineA =
        "M0 28 Q150 12 300 22 T600 32 Q750 42 900 32 T1200 28 Q1350 12 1500 22 T1800 32 Q1950 42 2100 32 T2400 28";
    const bottomLineB =
        "M0 36 Q150 46 300 34 T600 22 Q750 12 900 24 T1200 36 Q1350 46 1500 34 T1800 22 Q1950 12 2100 24 T2400 36";

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden="true">
            {/* Top Silk Wave Lines */}
            <div className="absolute top-0 inset-x-0 h-10 overflow-hidden">
                <svg
                    className="flow-wave-track-a absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-2-light"
                    viewBox="0 0 2400 36"
                    preserveAspectRatio="none"
                >
                    <path d={topPrimary} stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
                </svg>
                <svg
                    className="flow-wave-track-b absolute inset-y-0 left-0 w-[200%] h-full text-wedding-on-dark"
                    viewBox="0 0 2400 36"
                    preserveAspectRatio="none"
                >
                    <path d={topSecondary} stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.25" />
                </svg>
            </div>

            {/* Subtle Mid-Canvas Flowing Ribbon Waves */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 overflow-hidden opacity-30">
                <svg
                    className="flow-wave-track-a absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-2-light"
                    viewBox="0 0 2400 48"
                    preserveAspectRatio="none"
                >
                    <path d={midPrimary} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.65" />
                </svg>
                <svg
                    className="flow-wave-track-b absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-light"
                    viewBox="0 0 2400 48"
                    preserveAspectRatio="none"
                >
                    <path d={midSecondary} stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.55" />
                </svg>
            </div>

            {/* Bottom Layered Wave Crest & Horizon */}
            <div className="absolute bottom-0 inset-x-0 h-16 overflow-hidden">
                <svg
                    className="flow-wave-track-b absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent"
                    viewBox="0 0 2400 64"
                    preserveAspectRatio="none"
                >
                    <path d={bottomFill} fill="currentColor" opacity="0.22" />
                </svg>
                <svg
                    className="flow-wave-track-a absolute inset-y-0 left-0 w-[200%] h-full text-wedding-accent-2-light"
                    viewBox="0 0 2400 64"
                    preserveAspectRatio="none"
                >
                    <path d={bottomLineA} stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.55" />
                </svg>
                <svg
                    className="flow-wave-track-b absolute inset-y-0 left-0 w-[200%] h-full text-wedding-on-dark"
                    viewBox="0 0 2400 64"
                    preserveAspectRatio="none"
                >
                    <path d={bottomLineB} stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.28" />
                </svg>
            </div>
        </div>
    );
}
