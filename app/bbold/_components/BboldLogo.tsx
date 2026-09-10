export default function BboldLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`text-center ${compact ? "py-4" : "py-10"}`}>
      <div
        className="text-[3.25rem] font-bold leading-none tracking-[0.03em] text-[#241a15] lowercase"
        style={{ fontFamily: "var(--font-bbold-brand)" }}
      >
        bbold
      </div>
      <div
        className="mt-2 text-xs font-body uppercase tracking-[0.35em] text-[#5e4b3e]"
        style={{ fontFamily: "var(--font-bbold-body)" }}
      >
        ♦ Canvas gift ♦ Wall decoration ♦ Pin ♦ Lanyard ♦ 
      </div>
    </div>
  );
}
