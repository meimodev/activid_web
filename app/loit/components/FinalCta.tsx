import { FINAL_CTA } from "../data";
import { Reveal } from "./Reveal";
import { DownloadCta, Heading, Wordmark } from "./ui";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--loit-petrol-900)] px-5 py-[100px] sm:px-8 lg:py-[150px]">
      {/* Mint glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[360px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,232,155,0.16),transparent)] blur-2xl"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Wordmark className="text-3xl" />
        <Heading
          text={FINAL_CTA.h2}
          highlight={FINAL_CTA.highlight}
          className="mt-6 text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold leading-tight text-[var(--loit-paper)]"
        />
        <p className="mx-auto mt-5 max-w-md text-[17px] text-[var(--loit-mist)]">
          {FINAL_CTA.sub}
        </p>
        <div className="mt-9 flex justify-center">
          <DownloadCta label={FINAL_CTA.cta} />
        </div>
      </Reveal>
    </section>
  );
}
