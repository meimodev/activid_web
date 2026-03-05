"use client";

import { NeptuneStagger } from "./reveal";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";

export function QuoteSection({
  text,
  author,
}: {
  text: string;
  author?: string;
}) {
  const trimmedAuthor = author?.trim() ?? "";
  const hasInlineCitation =
    trimmedAuthor.length === 0 &&
    text.lastIndexOf("(") > 0 &&
    text.endsWith(")");
  const lastParen = hasInlineCitation ? text.lastIndexOf("(") : -1;
  const main = lastParen > 0 ? text.slice(0, lastParen).trim() : text.trim();
  const inlineCitation =
    lastParen > 0 ? text.slice(lastParen + 1, -1).trim() : "";
  const quoteAuthor = trimmedAuthor || inlineCitation;

  return (
    <section className="relative overflow-hidden bg-wedding-dark text-wedding-on-dark px-6 py-4">
      <div className="relative z-10 py-10 flex items-center justify-center">
        <NeptuneStagger
          className="max-w-3xl text-center"
          baseDelay={0.08}
          staggerStep={0.24}
        >
          <div className="flex justify-center">
            <NeptuneOverlayFloat
              src={NEPTUNE_OVERLAY_ASSETS.leafRight}
              alt=""
              className="w-[70px] max-w-[70vw] opacity-95"
              amplitude={4.4}
              duration={8.2}
              rotate={1}
              breeze
              loading="lazy"
              draggable={false}
            />
          </div>
          <p className="mt-10 text-xl leading-relaxed text-wedding-on-dark/95 whitespace-pre-line">
            {main}
          </p>
          {quoteAuthor ? (
            <p className="mt-10 text-2xl text-wedding-on-dark/90">- {quoteAuthor}</p>
          ) : null}
        </NeptuneStagger>
      </div>
    </section>
  );
}
