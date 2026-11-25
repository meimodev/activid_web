"use client";

export function FloatingFlowers() {
  return (
    <div className="sticky top-0 h-0 pointer-events-none z-10 overflow-visible">
      <style>{`
        @keyframes flowPetalFall {
          0% { transform: translate3d(0, -24px, 0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { transform: translate3d(24px, 100vh, 0) rotate(240deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-petal { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      {[
        { left: "14%", duration: "18s", delay: "0s", size: "0.75rem" },
        { left: "52%", duration: "22s", delay: "6s", size: "0.65rem" },
        { left: "84%", duration: "20s", delay: "11s", size: "0.8rem" },
      ].map((petal, idx) => (
        <div
          key={idx}
          className="flow-petal absolute top-0 text-wedding-accent/35"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            opacity: 0,
            animation: `flowPetalFall ${petal.duration} linear ${petal.delay} infinite`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2C13.5 2 14.5 3.5 14.5 5C16 3.5 17.5 3.5 18.5 5C19.5 6.5 19 8.5 17.5 9.5C18.5 11 18.5 13 17 14C15.5 15 13.5 14.5 12.5 13C11.5 14.5 9.5 15 8 14C6.5 13 6.5 11 7.5 9.5C6 8.5 5.5 6.5 6.5 5C7.5 3.5 9 3.5 10.5 5C10.5 3.5 11.5 2 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function FloatingSparkles() {
  return null;
}

export function FloatingHearts() {
  return null;
}

export function GoldenRings() {
  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden opacity-20">
      {/* Top Left Ring */}
      <div className="absolute -top-32 -left-32 w-64 h-64 border-2 border-wedding-accent/30 rounded-full" />
      <div className="absolute -top-24 -left-24 w-48 h-48 border border-wedding-accent/20 rounded-full" />

      {/* Bottom Right Ring */}
      <div className="absolute -bottom-32 -right-32 w-64 h-64 border-2 border-wedding-accent/30 rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 border border-wedding-accent/20 rounded-full" />

      {/* Center decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-wedding-accent/10 rounded-full" />
    </div>
  );
}




