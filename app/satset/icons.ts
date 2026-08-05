// Inline SVG strings for the SatSet landing markup. Split out of
// SatsetLanding.tsx; they are interpolated into the HTML string there.

export const LOGO_SVG = `<svg width="30" height="30" viewBox="0 0 48 48" style="display:block"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BEF264"/><stop offset="1" stop-color="#84CC16"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#lg)"/><path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#151912"/><circle cx="24" cy="11" r="3" fill="#151912"/><rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#151912"/><path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#BEF264"/></svg>`;

// Stroke is a parameter because these icons now sit on both the lime fill
// (dark stroke) and the outline variant on black (light stroke).
export const MAIL_SVG = (size: number, stroke = "#0B0D0A") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>`;

export const DL_SVG = (size: number, stroke = "#0B0D0A") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/></svg>`;

export const FEATURE_ICONS = [
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3m4 0v4m-7 0h3" stroke-linecap="round"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9" stroke-linecap="round"><path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1.2" fill="#BEF264" stroke="none"/><path d="M2 4l20 16" stroke-width="1.6" opacity=".5"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/><circle cx="12" cy="12" r="4"/><path d="M9.5 12h5" stroke-width="1.6"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 8v3l2 1"/><path d="M8 21h8"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="9" y="6" width="6" height="6" rx="1"/><path d="M9 16h6" stroke-linecap="round"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.3" fill="#BEF264" stroke="none"/></svg>`,
];

const DAY_ICON_ATTRS = `width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;

export const DAY_ICONS = [
  // reservations & seating — calendar with a check
  `<svg ${DAY_ICON_ATTRS}><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4m-7 9 2 2 4-4"/></svg>`,
  // takeaway — bag
  `<svg ${DAY_ICON_ATTRS}><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  // menu & stock — list with a price tick
  `<svg ${DAY_ICON_ATTRS}><path d="M4 6h10M4 12h10M4 18h6"/><circle cx="18.5" cy="17.5" r="3.2"/><path d="M17.2 17.5l.9.9 1.7-1.8"/></svg>`,
  // cashier & split bills — receipt split down the middle
  `<svg ${DAY_ICON_ATTRS}><path d="M6 3h12v18l-2.4-1.6L13.2 21 12 19.6 10.8 21l-2.4-1.6L6 21Z"/><path d="M12 3v18" stroke-dasharray="2.4 2.4"/><path d="M8.6 8.5h2.2M13.2 8.5h2.2"/></svg>`,
  // printing — printer with paper
  `<svg ${DAY_ICON_ATTRS}><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="7" rx="2"/><path d="M7 14h10v7H7Z"/><circle cx="17.6" cy="12" r=".9" fill="#BEF264" stroke="none"/></svg>`,
  // staff, roles & audit — person inside a shield
  `<svg ${DAY_ICON_ATTRS}><path d="M12 2.6 20 5.4v6.1c0 4.6-3.3 8.4-8 9.9-4.7-1.5-8-5.3-8-9.9V5.4Z"/><circle cx="12" cy="10" r="2.3"/><path d="M8.4 16.4a4 4 0 0 1 7.2 0"/></svg>`,
  // reports & export — bars with an out arrow
  `<svg ${DAY_ICON_ATTRS}><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 17v-5M12 17V9M16 17v-3"/><path d="M17 6.5h4v4M21 6.5l-4.5 4.5"/></svg>`,
  // check in remotely — eye over a signal arc
  `<svg ${DAY_ICON_ATTRS}><path d="M2.5 11.5C5 7.8 8.4 6 12 6s7 1.8 9.5 5.5C19 15.2 15.6 17 12 17s-7-1.8-9.5-5.5Z"/><circle cx="12" cy="11.5" r="2.5"/><path d="M7 20.5a8.6 8.6 0 0 0 10 0" opacity=".55"/></svg>`,
  // healthy server & devices — rack with a pulse
  `<svg ${DAY_ICON_ATTRS}><rect x="3" y="3.5" width="18" height="7" rx="2"/><rect x="3" y="13.5" width="18" height="7" rx="2"/><circle cx="6.8" cy="7" r=".9" fill="#BEF264" stroke="none"/><path d="M10 17h2l1.2-2.2L15 19l1.1-2H18"/></svg>`,
];

export const FLOOR_ICONS = ["→", "⏱", "$"];
