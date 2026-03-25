export default function BboldLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`text-center ${compact ? "" : "py-10"}`}>
      <div className="text-[3rem] leading-none tracking-[0.18em] text-stone-100" style={{ fontFamily: "var(--font-bbold-display)" }}>
        BBOLD
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.4em] text-stone-300" style={{ fontFamily: "var(--font-bbold-body)" }}>
        MMXX Tondano
      </div>
    </div>
  );
}
