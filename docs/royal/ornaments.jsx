/* Art-deco ornament library — sharp lines, stepped arches, diamond rosettes,
   sunbursts, chevrons. All gold strokes, drawn-on reveal. */

const G = "var(--gold)";

/* Deco divider: stepped lines + central faceted diamond */
const Divider = ({ width = 220, className = "" }) => (
  <svg className={`reveal-draw ${className}`} viewBox="0 0 220 22" width={width} fill="none"
       stroke={G} strokeWidth="1" strokeLinecap="square">
    <line x1="2" y1="11" x2="86" y2="11" style={{ "--len": 84 }} />
    <line x1="2" y1="14" x2="80" y2="14" style={{ "--len": 78 }} opacity="0.4" />
    <line x1="2" y1="8"  x2="80" y2="8"  style={{ "--len": 78 }} opacity="0.4" />
    {/* center: nested diamonds */}
    <path d="M96 11 L110 1 L124 11 L110 21 Z" style={{ "--len": 60 }} />
    <path d="M102 11 L110 5 L118 11 L110 17 Z" style={{ "--len": 36 }} opacity="0.7" />
    <circle cx="110" cy="11" r="1.6" fill={G} stroke="none" />
    <line x1="134" y1="11" x2="218" y2="11" style={{ "--len": 84 }} />
    <line x1="140" y1="14" x2="218" y2="14" style={{ "--len": 78 }} opacity="0.4" />
    <line x1="140" y1="8"  x2="218" y2="8"  style={{ "--len": 78 }} opacity="0.4" />
  </svg>
);

/* Deco rosette — used in place of botanical rose */
const RoseSm = ({ size = 28, className = "" }) => (
  <svg className={`reveal-draw ${className}`} viewBox="0 0 40 40" width={size} height={size}
       fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
    <path d="M20 4 L36 20 L20 36 L4 20 Z" style={{ "--len": 90 }} />
    <path d="M20 10 L30 20 L20 30 L10 20 Z" style={{ "--len": 56 }} opacity="0.8" />
    <line x1="4" y1="20" x2="36" y2="20" style={{ "--len": 32 }} opacity="0.5" />
    <line x1="20" y1="4" x2="20" y2="36" style={{ "--len": 32 }} opacity="0.5" />
    <circle cx="20" cy="20" r="2" fill={G} stroke="none" />
  </svg>
);

/* Deco sunburst — replaces botanical sprig */
const Sprig = ({ width = 90, flip = false, className = "" }) => (
  <svg className={`reveal-draw ${className}`} viewBox="0 0 90 40" width={width}
       fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
    <line x1="2" y1="20" x2="88" y2="20" style={{ "--len": 86 }} />
    {/* central sunburst */}
    <g transform="translate(45 20)">
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (-90 + (i - 4) * 18) * Math.PI / 180;
        const x = Math.cos(a) * 14, y = Math.sin(a) * 14;
        return <line key={i} x1="0" y1="0" x2={x} y2={y} style={{ "--len": 14 }} opacity={i % 2 ? 0.5 : 1} />;
      })}
      <path d="M-10 0 L0 -10 L10 0 L0 10 Z" style={{ "--len": 56 }} />
      <circle cx="0" cy="0" r="1.5" fill={G} stroke="none" />
    </g>
    <line x1="14" y1="14" x2="14" y2="26" style={{ "--len": 12 }} opacity="0.6" />
    <line x1="76" y1="14" x2="76" y2="26" style={{ "--len": 12 }} opacity="0.6" />
  </svg>
);

/* Deco corner — stepped quarter arch */
const Corner = ({ size = 110, className = "" }) => (
  <svg className={`reveal-draw ${className}`} viewBox="0 0 110 110" width={size} height={size}
       fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
    {/* stepped arch outline */}
    <path d="M2 108 L2 80 L10 80 L10 60 L20 60 L20 40 L40 40 L40 20 L60 20 L60 10 L80 10 L80 2 L108 2"
          style={{ "--len": 360 }} />
    <path d="M2 108 L2 90 L20 90 L20 70 L40 70 L40 50 L60 50 L60 30 L80 30 L80 12 L108 12"
          style={{ "--len": 300 }} opacity="0.5" />
    {/* radiating rays */}
    {Array.from({ length: 5 }).map((_, i) => (
      <line key={i} x1="2" y1="108" x2={20 + i * 18} y2={108 - (20 + i * 18)} style={{ "--len": 36 }} opacity="0.4" />
    ))}
    <circle cx="2" cy="108" r="2" fill={G} stroke="none" />
  </svg>
);

/* Deco crest — stepped shield with sunburst + monogram */
const Crest = ({ size = 140, initials = "J&J", className = "" }) => (
  <svg className={`reveal-draw ${className}`} viewBox="0 0 140 160" width={size} height={size * 160/140}
       fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
    {/* stepped shield */}
    <path d="M70 8 L110 18 L120 40 L120 90 L70 152 L20 90 L20 40 L30 18 Z" style={{ "--len": 380 }} />
    <path d="M70 16 L102 24 L112 42 L112 86 L70 138 L28 86 L28 42 L38 24 Z" style={{ "--len": 340 }} opacity="0.55" />
    {/* sunburst rays from top */}
    <g transform="translate(70 30)">
      {Array.from({ length: 11 }).map((_, i) => {
        const a = (-90 + (i - 5) * 12) * Math.PI / 180;
        return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 18} y2={Math.sin(a) * 18}
                     style={{ "--len": 18 }} opacity={i % 2 ? 0.5 : 0.9} />;
      })}
    </g>
    {/* top diamond */}
    <path d="M70 0 L78 8 L70 16 L62 8 Z" style={{ "--len": 32 }} />
    {/* side bars */}
    <line x1="20" y1="60" x2="20" y2="80" strokeWidth="2" style={{ "--len": 20 }} />
    <line x1="120" y1="60" x2="120" y2="80" strokeWidth="2" style={{ "--len": 20 }} />
    {/* center initials */}
    <text x="70" y="92" textAnchor="middle"
          style={{ font: '300 34px var(--f-serif)', fill: G, stroke: 'none', letterSpacing: '0.08em' }}>
      {initials}
    </text>
    {/* bottom ribbon mark */}
    <line x1="50" y1="102" x2="90" y2="102" strokeWidth="0.8" />
    <line x1="56" y1="106" x2="84" y2="106" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

/* Arch frame — kept deco (stepped) */
const Arch = ({ children, w = 240, h = 320, className = "" }) => (
  <div className={className} style={{ position: 'relative', width: w, height: h, margin: '0 auto' }}>
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}
         style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
         fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
      {/* stepped deco arch */}
      <path d={`M2 ${h-2} V${h*0.42} L${w*0.18} ${h*0.28} L${w*0.18} ${h*0.18} L${w*0.4} ${h*0.06} L${w*0.6} ${h*0.06} L${w-w*0.18} ${h*0.18} L${w-w*0.18} ${h*0.28} L${w-2} ${h*0.42} V${h-2} Z`} />
      <path d={`M10 ${h-10} V${h*0.44} L${w*0.2} ${h*0.32} L${w*0.2} ${h*0.22} L${w*0.42} ${h*0.12} L${w*0.58} ${h*0.12} L${w-w*0.2} ${h*0.22} L${w-w*0.2} ${h*0.32} L${w-10} ${h*0.44} V${h-10} Z`} opacity="0.45" />
      {/* corner accents */}
      <line x1="0" y1="0" x2="14" y2="0" />
      <line x1="0" y1="0" x2="0" y2="14" />
      <line x1={w} y1="0" x2={w-14} y2="0" />
      <line x1={w} y1="0" x2={w} y2="14" />
    </svg>
    <div style={{
      position: 'absolute', inset: 6,
      clipPath: `path("M2 ${h-8} V${h*0.42} L${w*0.18} ${h*0.28} L${w*0.18} ${h*0.18} L${w*0.4} ${h*0.06} L${w*0.6} ${h*0.06} L${w-w*0.18-6} ${h*0.18} L${w-w*0.18-6} ${h*0.28} L${w-14} ${h*0.42} V${h-8} Z")`,
      overflow: 'hidden'
    }}>
      {children}
    </div>
  </div>
);

/* Placeholder photo "tile" */
const PhotoPlaceholder = ({ label = "PHOTO", style = {} }) => (
  <div style={{
    width: '100%', height: '100%',
    background: `
      repeating-linear-gradient(45deg,
        rgba(201,169,97,0.12) 0,
        rgba(201,169,97,0.12) 6px,
        rgba(201,169,97,0.04) 6px,
        rgba(201,169,97,0.04) 12px),
      linear-gradient(180deg, #3a2240, #2b1a2e)
    `,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(201,169,97,0.55)',
    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
    fontSize: 10, letterSpacing: '0.3em',
    ...style
  }}>
    {label}
  </div>
);

/* ============================================================
   LAVISH DECO ORNAMENTS
   ============================================================ */

/* Deco flourish — symmetrical fan + chevron wings */
function Flourish({ width = 280, className = "", idle = "float" }) {
  const idleCls = idle === "float" ? "idle-float" : idle === "pulse" ? "idle-pulse" : "";
  return (
    <svg className={`reveal-draw ${idleCls} ${className}`} viewBox="0 0 280 60" width={width}
         fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
      {/* center stepped diamond */}
      <path d="M140 12 L156 30 L140 48 L124 30 Z" style={{ "--len": 80 }} />
      <path d="M140 20 L148 30 L140 40 L132 30 Z" style={{ "--len": 44 }} opacity="0.7" />
      <circle cx="140" cy="30" r="2" fill={G} stroke="none" />
      {/* center vertical accent */}
      <line x1="140" y1="2" x2="140" y2="12" style={{ "--len": 10 }} opacity="0.6" />
      <line x1="140" y1="48" x2="140" y2="58" style={{ "--len": 10 }} opacity="0.6" />
      {/* chevron wings — three lines stepping outward */}
      <path d="M124 30 L110 30 L100 22 L80 22 L70 14" style={{ "--len": 90 }} />
      <path d="M124 30 L110 30 L100 38 L80 38 L70 46" style={{ "--len": 90 }} />
      <path d="M156 30 L170 30 L180 22 L200 22 L210 14" style={{ "--len": 90 }} />
      <path d="M156 30 L170 30 L180 38 L200 38 L210 46" style={{ "--len": 90 }} />
      {/* outer parallel rails */}
      <line x1="2" y1="26" x2="68" y2="26" style={{ "--len": 66 }} opacity="0.6" />
      <line x1="2" y1="34" x2="68" y2="34" style={{ "--len": 66 }} opacity="0.6" />
      <line x1="212" y1="26" x2="278" y2="26" style={{ "--len": 66 }} opacity="0.6" />
      <line x1="212" y1="34" x2="278" y2="34" style={{ "--len": 66 }} opacity="0.6" />
      {/* terminal arrowheads */}
      <path d="M2 30 L14 22 L14 38 Z" style={{ "--len": 40 }} />
      <path d="M278 30 L266 22 L266 38 Z" style={{ "--len": 40 }} />
      {/* tiny accents */}
      <circle cx="70" cy="14" r="1.6" fill={G} stroke="none" />
      <circle cx="70" cy="46" r="1.6" fill={G} stroke="none" />
      <circle cx="210" cy="14" r="1.6" fill={G} stroke="none" />
      <circle cx="210" cy="46" r="1.6" fill={G} stroke="none" />
    </svg>
  );
}

/* Deco wreath — concentric rings + 12 ray spokes, slowly counter-rotating */
function WreathSpinner({ size = 220, className = "" }) {
  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <svg viewBox="0 0 220 220" width={size} height={size}
           className="idle-spin"
           fill="none" stroke={G} strokeWidth="0.8" strokeLinecap="square">
        {/* outer dotted ring */}
        <circle cx="110" cy="110" r="100" strokeDasharray="1 6" opacity="0.4" />
        {/* 12 long spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30) * Math.PI / 180;
          const x1 = 110 + Math.cos(a) * 78;
          const y1 = 110 + Math.sin(a) * 78;
          const x2 = 110 + Math.cos(a) * 96;
          const y2 = 110 + Math.sin(a) * 96;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 3 === 0 ? 1 : 0.55} />;
        })}
        {/* outer diamonds at 4 cardinal points */}
        {[0, 90, 180, 270].map((deg, i) => {
          const a = deg * Math.PI / 180;
          const cx = 110 + Math.cos(a) * 96;
          const cy = 110 + Math.sin(a) * 96;
          return <path key={i} d={`M${cx-4} ${cy} L${cx} ${cy-4} L${cx+4} ${cy} L${cx} ${cy+4} Z`} fill={G} stroke="none" opacity="0.8" />;
        })}
      </svg>
      <svg viewBox="0 0 220 220" width={size} height={size}
           style={{ position: 'absolute', inset: 0, animation: 'spin-slow 90s linear infinite reverse' }}
           fill="none" stroke={G} strokeWidth="0.8">
        {/* inner ring */}
        <circle cx="110" cy="110" r="76" opacity="0.5" />
        <circle cx="110" cy="110" r="70" strokeDasharray="2 4" opacity="0.4" />
        {/* 8 chevron triangles around inner ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45) * Math.PI / 180;
          const cx = 110 + Math.cos(a) * 70;
          const cy = 110 + Math.sin(a) * 70;
          const angle = (i * 45) - 90;
          return <g key={i} transform={`translate(${cx} ${cy}) rotate(${angle})`}>
            <path d="M-4 0 L0 -6 L4 0 Z" fill={G} stroke="none" opacity="0.7" />
          </g>;
        })}
      </svg>
    </div>
  );
}

/* Deco floral frame — stepped corners with chevron rays */
function FloralFrame({ width = 320, height = 220, className = "", children }) {
  const v = 14;
  return (
    <div className={className} style={{ position: 'relative', width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
           className="reveal-draw"
           style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
           fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
        <rect x={v} y={v} width={width-2*v} height={height-2*v}
              strokeDasharray="1 4" opacity="0.35" />
        {/* four stepped corners */}
        {[
          [v, v, 1, 1],
          [width-v, v, -1, 1],
          [v, height-v, 1, -1],
          [width-v, height-v, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
            <path d="M0 0 L26 0 L26 6 L40 6 L40 14 L48 14" style={{ "--len": 100 }} />
            <path d="M0 0 L0 26 L6 26 L6 40 L14 40 L14 48" style={{ "--len": 100 }} />
            <path d="M10 10 L20 10 L20 20 L10 20 Z" style={{ "--len": 40 }} opacity="0.7" />
            <circle cx="15" cy="15" r="1.4" fill={G} stroke="none" />
          </g>
        ))}
      </svg>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
    </div>
  );
}

/* Bloom star — kept (already deco-friendly) */
function BloomStar({ size = 36, className = "" }) {
  return (
    <svg className={`reveal-draw ${className}`} viewBox="0 0 60 60" width={size} height={size}
         fill="none" stroke={G} strokeWidth="0.8" strokeLinecap="square"
         style={{ animation: 'bloom-breath 3.2s ease-in-out infinite' }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30) * Math.PI / 180;
        const x1 = 30 + Math.cos(a) * 6;
        const y1 = 30 + Math.sin(a) * 6;
        const x2 = 30 + Math.cos(a) * (i % 3 === 0 ? 26 : 20);
        const y2 = 30 + Math.sin(a) * (i % 3 === 0 ? 26 : 20);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ "--len": 20 }} opacity={i % 3 === 0 ? 1 : 0.5}/>;
      })}
      <path d="M30 8 L36 30 L30 52 L24 30 Z" style={{ "--len": 80 }} />
      <path d="M8 30 L30 24 L52 30 L30 36 Z" style={{ "--len": 80 }} opacity="0.7" />
      <circle cx="30" cy="30" r="2.5" fill={G} stroke="none" />
    </svg>
  );
}

/* Deco vine border — vertical chevron column */
function VineBorder({ height = 400, side = 'left', className = "" }) {
  const flip = side === 'right' ? -1 : 1;
  const steps = Math.floor(height / 40);
  return (
    <svg className={`reveal-draw ${className}`} viewBox={`0 0 60 ${height}`} width="60" height={height}
         preserveAspectRatio="none"
         fill="none" stroke={G} strokeWidth="0.8" strokeLinecap="square"
         style={{ transform: `scaleX(${flip})`, opacity: 0.7 }}>
      {/* central spine */}
      <line x1="30" y1="0" x2="30" y2={height} style={{ "--len": height }} opacity="0.5" />
      {/* parallel rails */}
      <line x1="22" y1="0" x2="22" y2={height} style={{ "--len": height }} opacity="0.25" />
      <line x1="38" y1="0" x2="38" y2={height} style={{ "--len": height }} opacity="0.25" />
      {/* chevrons every 40px */}
      {Array.from({ length: steps }).map((_, i) => {
        const y = (i + 0.5) * 40;
        const dir = i % 2 ? 1 : -1;
        return (
          <g key={i}>
            <path d={`M22 ${y-6} L30 ${y} L22 ${y+6}`} style={{ "--len": 26 }} />
            <path d={`M38 ${y-6} L30 ${y} L38 ${y+6}`} style={{ "--len": 26 }} opacity="0.4" />
            {i % 3 === 0 && <circle cx="30" cy={y} r="1.6" fill={G} stroke="none" />}
          </g>
        );
      })}
    </svg>
  );
}

/* Grand deco divider — bracketed bars + central fan */
function GrandDivider({ width = 280, className = "" }) {
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center' }}>
      <svg className="reveal-draw" viewBox="0 0 280 36" width={width}
           fill="none" stroke={G} strokeWidth="1" strokeLinecap="square">
        {/* parallel rails */}
        <line x1="2" y1="14" x2="118" y2="14" style={{ "--len": 116 }} />
        <line x1="2" y1="22" x2="118" y2="22" style={{ "--len": 116 }} opacity="0.5" />
        <line x1="162" y1="14" x2="278" y2="14" style={{ "--len": 116 }} />
        <line x1="162" y1="22" x2="278" y2="22" style={{ "--len": 116 }} opacity="0.5" />
        {/* end brackets */}
        <path d="M2 8 L2 28" style={{ "--len": 20 }} />
        <path d="M278 8 L278 28" style={{ "--len": 20 }} />
        <path d="M8 8 L2 8 M8 28 L2 28" style={{ "--len": 12 }} opacity="0.6" />
        <path d="M272 8 L278 8 M272 28 L278 28" style={{ "--len": 12 }} opacity="0.6" />
        {/* center fan */}
        <g style={{ transformOrigin: '140px 18px', animation: 'bloom-breath 4s ease-in-out infinite' }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (-90 + (i - 3) * 18) * Math.PI / 180;
            return <line key={i} x1="140" y1="18" x2={140 + Math.cos(a) * 14} y2={18 + Math.sin(a) * 14}
                         style={{ "--len": 14 }} opacity={i === 3 ? 1 : 0.6} />;
          })}
          <path d="M126 18 L140 8 L154 18 L140 28 Z" style={{ "--len": 56 }} />
          <circle cx="140" cy="18" r="2" fill={G} stroke="none" />
        </g>
      </svg>
    </div>
  );
}

window.Ornaments = { Divider, RoseSm, Sprig, Corner, Crest, Arch, PhotoPlaceholder, Flourish, WreathSpinner, FloralFrame, BloomStar, VineBorder, GrandDivider };
