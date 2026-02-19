"use client";

import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface QuoteSectionProps {
    quote: {
        text: string;
        author: string;
    };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
    if (!quote || !quote.text) return null;

    return (
        <section className="relative py-8 sm:py-32 flex flex-col items-center justify-center text-center overflow-hidden bg-white text-stone-800">
            <div className="container mx-auto px-2 sm:px-8 md:px-12 max-w-5xl relative z-10">
                    <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white px-6 py-16 sm:px-12 sm:py-20 shadow-[0_22px_70px_rgba(44,11,19,0.12)]">
                        <div aria-hidden className="pointer-events-none absolute left-8 bottom-8 h-[140px] w-[140px] rotate-180 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sidedCorner})` }} />
                        <div aria-hidden className="pointer-events-none absolute right-8 top-8 h-[140px] w-[140px]  bg-contain bg-no-repeat" style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sidedCorner})` }} />

                        <div
                            aria-hidden
                            className="pointer-events-none absolute -left-8 -top-8 h-[220px] w-[220px] bg-contain bg-no-repeat"
                            style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerSecond})` }}
                        />

                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-8 -right-8 h-[240px] w-[240px] rotate-180 bg-contain bg-no-repeat"
                            style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerSecond})` }}
                        />

                        <div className="relative z-10 mx-auto max-w-[980px]">
                            <blockquote className="font-poppins text-[20px] sm:text-[30px] pt-12 leading-tight sm:leading-tight text-[#9a6a74] tracking-wide">
                                {quote.text}
                            </blockquote>
                            <p className="mt-4  font-poppins-bold text-[24px] sm:text-[30px] text-[#9a6a74]">{quote.author}</p>
                        </div>
                    </div>
            </div>
        </section>
    );
}
