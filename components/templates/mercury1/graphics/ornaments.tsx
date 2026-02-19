"use client";

export function FloralDivider() {
    return (
        <div className="flex items-center justify-center py-12 opacity-80">
            <div className="flex items-center gap-4">
                <div className="h-px w-16 md:w-32 bg-stone-300" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-stone-400">
                    <path d="M12 21C12 21 17 16 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 16 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.5 15.5L18.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 15.5L5.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.5 8.5L18.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 8.5L5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="h-px w-16 md:w-32 bg-stone-300" />
            </div>
        </div>
    );
}

export function VerticalLine() {
    return (
        <div className="h-32 w-px mx-auto my-8 bg-linear-to-b from-transparent via-stone-300 to-transparent" />
    );
}

export function SectionOrnament() {
    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
            <div className="w-24 h-px bg-stone-200" />
            <div className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
        </div>
    );
}
