"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COPY, type Copy, type Lang } from "./copy";
import { DAY_ICONS, DL_SVG, FEATURE_ICONS, FLOOR_ICONS, LOGO_SVG, MAIL_SVG } from "./icons";

// ponytail: markup is a port of the design (SatSet Landing.dc.html), kept as one HTML
// string + an imperative effect rather than ~600 hand-converted JSX nodes. Faithful and
// lower-risk. Copy is parameterized (id/en) so the same markup serves both locales.
// Copy lives in ./copy, the inline SVGs in ./icons — moved out verbatim so an edit to
// wording or an icon doesn't mean scrolling past the other one.

const WA = "https://wa.me/6289525699078?text=%5BSatSet%5D";

// Same-origin route that streams the GitHub asset. See app/satset/download for
// why: every cross-origin variant of this link stalls at 100% on Chrome
// Android. Same-tab with a download attribute, which only carries weight
// same-origin — the click becomes a download rather than a navigation, so no
// tab is created for one to go missing.
const APK = "/satset/download";
// The "Coba Sendiri" section — data-index="4" — holds the demo accounts and
// the install steps, so it is where a download should land you.
const DEMO_SECTION_INDEX = 4;
// Known-good path on device, kept as the escape hatch: a normal HTML page,
// so it survives both the tap bug and in-app webviews dropping attachments.
const APK_PAGE = "https://github.com/meimodev/satset/releases/latest";

// Three separate demo venues so simultaneous visitors don't fight over one dataset.
const DEMO_ACCOUNTS = ["admin@satset.id", "admin2@satset.id", "admin3@satset.id"];
const DEMO_PASSWORD = "password";

// Staff sign in by PIN, admins by email — two paths on the app's one sign-in
// screen. These four are seeded by the demo data load, so they only exist from
// step 4 onward. Names are rows in the app's DB, identical in both locales, so
// they stay here rather than in copy.ts — and they must match `genericUsers` in
// the satset repo's seed_data.dart exactly, or the visitor types a dead PIN.
const DEMO_STAFF = [
  { name: "Pelayan 1", pin: "100001" },
  { name: "Dapur 1", pin: "100002" },
  { name: "Pelayan 2", pin: "100003" },
  { name: "Dapur 2", pin: "100004" },
];

function buildMarkup(t: Copy, lang: Lang): string {
  const other = lang === "id" ? "EN" : "ID";

  const featureDelays = [120, 180, 240, 200, 260, 320];
  const featureCards = t.features.cards
    .map(
      (c, i) => `
      <div data-reveal data-delay="${featureDelays[i]}" class="feat" data-tilt style="opacity:0;transform:translateY(34px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease;background:linear-gradient(165deg,#171B14,#10130E);border:1px solid rgba(163,230,53,.12);border-radius:20px;padding:26px;will-change:transform;transform-style:preserve-3d">
        <div style="width:46px;height:46px;border-radius:13px;background:rgba(163,230,53,.12);display:flex;align-items:center;justify-content:center;margin-bottom:18px">${FEATURE_ICONS[i]}</div>
        <h3 style="font-family:var(--font-satset-display),sans-serif;font-weight:600;font-size:19px;margin:0 0 8px;letter-spacing:-.01em">${c.t}</h3>
        <p style="font-size:14.5px;color:#929B89;line-height:1.5;margin:0">${c.d}</p>
      </div>`,
    )
    .join("");

  const dayRows = t.day.rows
    .map(
      (r, i) => `
      <div data-reveal data-delay="${120 + i * 40}" class="day-row" style="opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1),border-color .3s ease;background:linear-gradient(165deg,#171B14,#10130E);border:1px solid rgba(163,230,53,.12);border-radius:15px;padding:15px 16px;display:flex;gap:13px;align-items:flex-start">
        <div style="flex:none;width:34px;height:34px;border-radius:10px;background:rgba(163,230,53,.12);display:flex;align-items:center;justify-content:center">${DAY_ICONS[i]}</div>
        <div style="min-width:0">
          <h3 style="font-family:var(--font-satset-display),sans-serif;font-weight:600;font-size:15.5px;margin:0 0 3px;letter-spacing:-.01em">${r.t}</h3>
          <p style="font-size:13.5px;color:#929B89;line-height:1.45;margin:0">${r.d}</p>
        </div>
      </div>`,
    )
    .join("");

  const demoSteps = t.demo.steps
    .map(
      (s, i) => `
        <div data-reveal data-delay="${140 + i * 50}" style="opacity:0;transform:translateX(-22px);transition:all .8s cubic-bezier(.16,1,.3,1);display:flex;gap:13px;align-items:flex-start">
          <div style="flex:none;width:27px;height:27px;border-radius:999px;background:rgba(163,230,53,.14);color:#BEF264;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13.5px;font-family:var(--font-satset-display),sans-serif">${i + 1}</div>
          <div style="min-width:0;padding-top:2px">
            <strong style="font-weight:600;font-size:15px;display:block">${s.t}</strong>
            <span style="color:#929B89;font-size:13.5px;line-height:1.45;display:block;margin-top:1px">${s.d}</span>
          </div>
        </div>`,
    )
    .join("");

  const sideloadSteps = t.demo.sideloadSteps
    .map((s) => `<li style="padding-left:2px">${s}</li>`)
    .join("");

  const demoAccounts = DEMO_ACCOUNTS.map(
    (a) =>
      `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;color:#EEF2E6;padding:6px 0;border-bottom:1px solid rgba(238,242,230,.07)">${a}</div>`,
  ).join("");

  // Same row rhythm as the accounts above; the PIN takes the password's lime so
  // "the bit you type in" reads the same everywhere in this card. No rule under
  // the last row — nothing follows it, unlike the accounts list.
  const demoStaff = DEMO_STAFF.map(
    (s, i) =>
      `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:6px 0${i < DEMO_STAFF.length - 1 ? ";border-bottom:1px solid rgba(238,242,230,.07)" : ""}">
            <span style="font-size:13.5px;color:#EEF2E6">${s.name}</span>
            <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;color:#BEF264;font-weight:600">${s.pin}</span>
          </div>`,
  ).join("");

  const floorDelays = [200, 260, 320];
  const floorItems = t.floor.items
    .map(
      (it, i) => `
        <div data-reveal data-delay="${floorDelays[i]}" style="opacity:0;transform:translateX(-26px);transition:all .8s cubic-bezier(.16,1,.3,1);display:flex;gap:13px;align-items:flex-start"><div style="flex:none;width:30px;height:30px;border-radius:9px;background:rgba(163,230,53,.12);display:flex;align-items:center;justify-content:center;color:#BEF264;font-weight:700">${FLOOR_ICONS[i]}</div><div><strong style="font-weight:600;font-size:15.5px">${it.t}</strong><div style="color:#929B89;font-size:14px;margin-top:2px">${it.d}</div></div></div>`,
    )
    .join("");

  return `
<div class="scrl" style="height:100vh;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;background:#0B0D0A;color:#EEF2E6;font-family:var(--font-satset-body),sans-serif;position:relative;scrollbar-width:none;-webkit-overflow-scrolling:touch">

  <nav style="position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:20px 7vw;backdrop-filter:blur(14px);background:linear-gradient(180deg,rgba(11,13,10,.82),rgba(11,13,10,.18))">
    <div style="display:flex;align-items:center;gap:11px;font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:20px;letter-spacing:-.01em">
      ${LOGO_SVG}
      <span>SatSet</span>
    </div>
    <div class="nav-links" style="display:flex;align-items:center;gap:30px;font-size:15px;color:#AEB6A6;font-weight:500">
      <a data-go="1" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.features}</a>
      <a data-go="2" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.day}</a>
      <a data-go="3" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.floor}</a>
      <a data-go="4" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.demo}</a>
      <a data-go="5" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.reports}</a>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button data-lang aria-label="Switch language" style="cursor:pointer;background:rgba(238,242,230,.06);border:1px solid rgba(238,242,230,.18);color:#EEF2E6;font-weight:700;font-size:13px;letter-spacing:.04em;padding:9px 13px;border-radius:999px;font-family:inherit;line-height:1">${other}</button>
      <a class="nav-dl" data-dl href="${APK}" download="satset.apk" style="cursor:pointer;display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,#BEF264,#84CC16);color:#0B0D0A;font-weight:700;padding:11px 20px;border-radius:999px;font-size:14.5px;text-decoration:none;box-shadow:0 8px 22px -8px rgba(163,230,53,.6)">
        ${DL_SVG(15)}
        ${t.nav.download}
      </a>
      <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(238,242,230,.2);color:#EEF2E6;font-weight:600;padding:11px 20px;border-radius:999px;font-size:14.5px;text-decoration:none">
        ${MAIL_SVG(15, "#EEF2E6")}
        ${t.nav.contact}
      </a>
    </div>
  </nav>

  <div class="side-dots" style="position:fixed;right:26px;top:50%;transform:translateY(-50%);z-index:55;display:flex;flex-direction:column;gap:14px">
    <span data-dot="0" style="width:9px;height:9px;border-radius:999px;background:#BEF264;cursor:pointer;transition:all .4s ease;height:24px"></span>
    <span data-dot="1" style="width:9px;height:9px;border-radius:999px;background:#354030;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="2" style="width:9px;height:9px;border-radius:999px;background:#354030;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="3" style="width:9px;height:9px;border-radius:999px;background:#354030;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="4" style="width:9px;height:9px;border-radius:999px;background:#354030;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="5" style="width:9px;height:9px;border-radius:999px;background:#354030;cursor:pointer;transition:all .4s ease"></span>
  </div>

  <!-- ============ HERO ============ -->
  <section class="snap-sec hero" data-screen-label="Hero" data-index="0" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;align-items:center;padding:120px 7vw 60px;overflow:hidden">
    <div style="position:absolute;width:760px;height:760px;right:-120px;top:50%;margin-top:-380px;background:radial-gradient(circle,rgba(163,230,53,.26),rgba(163,230,53,.06) 42%,transparent 66%);animation:satset-glowPulse 7s ease-in-out infinite;pointer-events:none"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 80% 50%,transparent 40%,rgba(6,8,6,.5));pointer-events:none"></div>

    <div class="hero-copy" style="position:relative;z-index:2;max-width:600px;flex:1">
      <div data-reveal style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(163,230,53,.3);background:rgba(163,230,53,.07);color:#BEF264;padding:8px 15px;border-radius:999px;font-size:13.5px;font-weight:600;letter-spacing:.01em">
        <span style="width:7px;height:7px;border-radius:999px;background:#34D399;box-shadow:0 0 8px #34D399;animation:satset-blink 2.4s ease-in-out infinite"></span>
        ${t.hero.badge}
      </div>
      <h1 class="hero-h1" data-reveal data-delay="80" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(40px,5.4vw,74px);line-height:1.02;letter-spacing:-.025em;margin:24px 0 0">
        ${t.hero.h1a}<br>${t.hero.h1b}<br><span style="background:linear-gradient(120deg,#BEF264,#84CC16);-webkit-background-clip:text;background-clip:text;color:transparent">${t.hero.h1c}</span>
      </h1>
      <p data-reveal data-delay="160" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);font-size:19px;line-height:1.55;color:#AEB6A6;max-width:480px;margin:24px 0 0">
        ${t.hero.para}
      </p>
      <div data-reveal data-delay="240" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:flex;gap:14px;align-items:center;margin-top:34px;flex-wrap:wrap">
        <a data-dl href="${APK}" download="satset.apk" style="cursor:pointer;display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#BEF264,#84CC16);color:#0B0D0A;font-weight:700;padding:16px 28px;border-radius:999px;font-size:16.5px;text-decoration:none;box-shadow:0 14px 34px -10px rgba(163,230,53,.6)">
          ${DL_SVG(17)}
          ${t.demo.ctaApk}
        </a>
        <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(238,242,230,.2);color:#EEF2E6;font-weight:600;padding:16px 24px;border-radius:999px;font-size:16px;text-decoration:none">
          ${MAIL_SVG(16, "#EEF2E6")}
          ${t.hero.ctaPrimary}
        </a>
      </div>
      <div class="hero-meta" data-reveal data-delay="320" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:flex;gap:26px;margin-top:40px;font-size:13.5px;color:#808977">
        <span>${t.hero.meta1}</span>
        <span>${t.hero.meta2}</span>
        <span>${t.hero.meta3}</span>
      </div>
    </div>

    <div class="hero-art" data-depth="14" style="position:relative;z-index:2;flex:1;min-width:0;display:flex;justify-content:center;align-items:center">
      <div style="position:relative;width:100%;max-width:520px;margin:0 auto;transform:perspective(1300px) rotateY(-13deg) rotateX(6deg);transform-style:preserve-3d">
      <div style="position:absolute;left:50%;bottom:8%;width:64%;height:46px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(163,230,53,.28),transparent 70%);filter:blur(7px);pointer-events:none"></div>
      <svg width="520" height="520" viewBox="0 0 480 480" style="width:100%;height:auto;display:block;animation:satset-floatY 7s ease-in-out infinite;overflow:visible;position:relative">
        <defs>
          <linearGradient id="dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#283024"/><stop offset="1" stop-color="#171B14"/></linearGradient>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#222922"/><stop offset="1" stop-color="#10130E"/></linearGradient>
          <linearGradient id="boltg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFF56B"/><stop offset="1" stop-color="#84CC16"/></linearGradient>
          <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BEF264"/><stop offset="1" stop-color="#84CC16"/></linearGradient>
        </defs>
        <ellipse cx="240" cy="350" rx="186" ry="40" fill="url(#plate)"/>
        <ellipse cx="240" cy="342" rx="150" ry="26" fill="#283024"/>
        <ellipse cx="240" cy="338" rx="150" ry="24" fill="#141810"/>
        <!-- revealed phone -->
        <g style="animation:satset-phoneRise 1.5s cubic-bezier(.16,1,.3,1) .65s both">
          <rect x="190" y="120" width="100" height="200" rx="19" fill="#060806" stroke="#283024" stroke-width="2"/>
          <rect x="190" y="120" width="100" height="200" rx="19" fill="none" stroke="rgba(163,230,53,.45)" stroke-width="1.4"/>
          <rect x="198" y="130" width="84" height="34" rx="9" fill="url(#scr)"/>
          <text x="208" y="151" font-family="Hanken Grotesk" font-size="11" font-weight="700" fill="#0B0D0A">${t.hero.table}</text>
          <circle cx="272" cy="147" r="5.5" fill="#0B0D0A" opacity=".55"/>
          <rect x="198" y="172" width="84" height="20" rx="6" fill="#10130E"/><rect x="204" y="179" width="40" height="6" rx="3" fill="#626A58"/>
          <rect x="198" y="198" width="84" height="20" rx="6" fill="#10130E"/><rect x="204" y="205" width="52" height="6" rx="3" fill="#626A58"/>
          <rect x="198" y="224" width="84" height="20" rx="6" fill="#10130E"/><rect x="204" y="231" width="34" height="6" rx="3" fill="#626A58"/>
          <rect x="198" y="284" width="84" height="24" rx="8" fill="url(#scr)"/><rect x="222" y="293" width="36" height="6" rx="3" fill="#0B0D0A"/>
        </g>
        <!-- lid -->
        <g style="animation:satset-clocheLift 1.5s cubic-bezier(.16,1,.3,1) .55s both">
          <path d="M80 322 C80 196 152 128 240 128 C328 128 400 196 400 322 Z" fill="url(#dome)"/>
          <path d="M80 322 C80 196 152 128 240 128 C328 128 400 196 400 322" fill="none" stroke="rgba(207,245,107,.4)" stroke-width="2"/>
          <path d="M110 300 C112 210 168 156 240 150" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10" stroke-linecap="round"/>
          <rect x="68" y="316" width="344" height="16" rx="8" fill="#1C221A"/>
          <rect x="68" y="316" width="344" height="6" rx="3" fill="rgba(207,245,107,.22)"/>
          <rect x="236" y="104" width="8" height="26" rx="4" fill="#1C221A"/>
          <circle cx="240" cy="100" r="15" fill="#1C221A"/><circle cx="235" cy="95" r="4" fill="rgba(207,245,107,.3)"/>
          <path d="M252 178 L212 250 L242 250 L230 300 L296 222 L262 222 Z" fill="url(#boltg)"/>
        </g>
      </svg>
      </div>
    </div>

    <div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);font-size:12px;color:#808977;letter-spacing:.18em;display:flex;flex-direction:column;align-items:center;gap:8px">${t.hero.scroll}<span style="width:1px;height:26px;background:linear-gradient(#BEF264,transparent)"></span></div>
  </section>

  <!-- ============ FEATURES ============ -->
  <section class="snap-sec" data-screen-label="Features" data-index="1" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 80px;overflow:hidden">
    <div style="position:absolute;width:560px;height:560px;left:-160px;top:-120px;background:radial-gradient(circle,rgba(163,230,53,.1),transparent 65%);pointer-events:none"></div>
    <div style="max-width:680px;position:relative;z-index:2">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#BEF264;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.features.eyebrow}</span>
      <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 14px">${t.features.h2}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#AEB6A6;max-width:560px;margin:0">${t.features.para}</p>
    </div>

    <div class="feat-grid" style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px;perspective:1400px">${featureCards}
    </div>
  </section>

  <!-- ============ A FULL DAY ============ -->
  <section class="snap-sec day" data-screen-label="A full day" data-index="2" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 80px;overflow:hidden">
    <div style="position:absolute;width:600px;height:600px;right:-180px;top:-140px;background:radial-gradient(circle,rgba(163,230,53,.1),transparent 65%);pointer-events:none"></div>
    <div style="max-width:660px;position:relative;z-index:2">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#BEF264;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.day.eyebrow}</span>
      <h2 class="day-h2" data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 14px">${t.day.h2a}<br>${t.day.h2b}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#AEB6A6;max-width:560px;margin:0">${t.day.para}</p>
    </div>

    <div class="day-grid" style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:40px">${dayRows}
    </div>
  </section>

  <!-- ============ THE FLOOR ============ -->
  <section class="snap-sec floor" data-screen-label="The floor" data-index="3" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;align-items:center;padding:120px 7vw 80px;overflow:hidden">
    <div style="position:absolute;width:680px;height:680px;right:-180px;bottom:-180px;background:radial-gradient(circle,rgba(163,230,53,.12),transparent 62%);pointer-events:none"></div>

    <div class="floor-copy" style="position:relative;z-index:3;max-width:460px;flex:0 0 420px">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#BEF264;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.floor.eyebrow}</span>
      <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 16px">${t.floor.h2}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#AEB6A6;line-height:1.55;margin:0 0 26px">${t.floor.para}</p>
      <div style="display:flex;flex-direction:column;gap:13px">${floorItems}
      </div>
    </div>

    <div class="floor-art" data-depth="12" style="position:relative;z-index:2;flex:1;display:flex;justify-content:center;align-items:center;height:560px;perspective:1400px">
      <div class="diorama" style="opacity:1;transform:scale(1.08);position:relative;width:520px;height:440px;transform-style:preserve-3d">
        <div style="position:absolute;inset:0;transform:rotateX(56deg) rotateZ(-44deg);transform-style:preserve-3d;animation:satset-floatY2 8s ease-in-out infinite">
          <!-- floor base -->
          <div style="position:absolute;left:40px;top:40px;width:380px;height:360px;border-radius:26px;background:linear-gradient(135deg,#171B14,#0C0E0A);box-shadow:0 40px 80px rgba(0,0,0,.55),inset 0 0 0 1px rgba(163,230,53,.08)"></div>
          <!-- grid lines -->
          <div style="position:absolute;left:40px;top:160px;width:380px;height:1px;background:rgba(163,230,53,.06)"></div>
          <div style="position:absolute;left:40px;top:280px;width:380px;height:1px;background:rgba(163,230,53,.06)"></div>
          <div style="position:absolute;left:170px;top:40px;width:1px;height:360px;background:rgba(163,230,53,.06)"></div>
          <div style="position:absolute;left:290px;top:40px;width:1px;height:360px;background:rgba(163,230,53,.06)"></div>
          <!-- tables: seated(lime) -->
          <div style="position:absolute;left:78px;top:84px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#BEF264,#84CC16);box-shadow:0 16px 0 #4D7C0F,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:200px;top:88px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#283024,#161A11);box-shadow:0 16px 0 #090B08,0 26px 26px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:320px;top:84px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#34D399,#0F9D74);box-shadow:0 16px 0 #0B4F3A,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:80px;top:206px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#283024,#161A11);box-shadow:0 16px 0 #090B08,0 26px 26px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:202px;top:200px;width:72px;height:72px;border-radius:16px;background:linear-gradient(160deg,#BEF264,#84CC16);box-shadow:0 18px 0 #4D7C0F,0 28px 28px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:322px;top:206px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#283024,#161A11);box-shadow:0 16px 0 #090B08,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:84px;top:312px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#283024,#161A11);box-shadow:0 15px 0 #090B08,0 24px 24px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:206px;top:316px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#84CC16,#65A30D);box-shadow:0 15px 0 #3F6212,0 24px 24px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:322px;top:312px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#283024,#161A11);box-shadow:0 15px 0 #090B08,0 24px 24px rgba(0,0,0,.45)"></div>
        </div>
        <!-- floating order chip moving table to table -->
        <div style="position:absolute;left:150px;top:120px;animation:satset-chipMove 6s ease-in-out infinite">
          <div style="background:#060806;border:1px solid rgba(163,230,53,.5);border-radius:12px;padding:9px 13px;box-shadow:0 14px 30px rgba(0,0,0,.6);display:flex;align-items:center;gap:9px;white-space:nowrap"><span style="width:8px;height:8px;border-radius:999px;background:#BEF264;box-shadow:0 0 8px #BEF264"></span><span style="font-size:13px;font-weight:600;color:#EEF2E6">${t.hero.chip}</span></div>
        </div>
        <!-- floating status legend -->
        <div style="position:absolute;right:-6px;top:8px;background:rgba(9,11,8,.78);backdrop-filter:blur(8px);border:1px solid rgba(163,230,53,.14);border-radius:14px;padding:13px 15px;box-shadow:0 14px 36px rgba(0,0,0,.5)">
          <div style="font-size:11px;color:#808977;letter-spacing:.1em;text-transform:uppercase;margin-bottom:9px">${t.hero.liveStatus}</div>
          <div style="display:flex;flex-direction:column;gap:7px;font-size:12.5px;color:#C2C9BA">
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#BEF264;display:inline-block"></i>${t.hero.seated}</span>
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#34D399;display:inline-block"></i>${t.hero.ready}</span>
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#283024;display:inline-block"></i>${t.hero.open}</span>
          </div>
        </div>
        <!-- floating reservation card -->
        <div style="position:absolute;left:-18px;bottom:18px;background:rgba(9,11,8,.78);backdrop-filter:blur(8px);border:1px solid rgba(163,230,53,.14);border-radius:14px;padding:11px 14px;box-shadow:0 14px 36px rgba(0,0,0,.5);display:flex;align-items:center;gap:11px">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(163,230,53,.14);color:#BEF264;display:flex;align-items:center;justify-content:center;font-weight:700">7:30</div>
          <div><div style="font-size:13px;font-weight:600">${t.hero.resvName}</div><div style="font-size:11.5px;color:#808977">${t.hero.resvSub}</div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TRY IT / DEMO ============ -->
  <section class="snap-sec demo" data-screen-label="Try it" data-index="4" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 80px;overflow:hidden">
    <div style="position:absolute;width:620px;height:620px;left:-180px;bottom:-200px;background:radial-gradient(circle,rgba(163,230,53,.12),transparent 64%);pointer-events:none"></div>

    <div style="max-width:660px;position:relative;z-index:2">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#BEF264;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.demo.eyebrow}</span>
      <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(30px,3.6vw,46px);line-height:1.06;letter-spacing:-.02em;margin:14px 0 12px">${t.demo.h2a}<br>${t.demo.h2b}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:16.5px;color:#AEB6A6;line-height:1.5;max-width:560px;margin:0">${t.demo.para}</p>
    </div>

    <div class="demo-row" style="position:relative;z-index:2;display:flex;gap:48px;margin-top:32px;align-items:flex-start">

      <div class="demo-side" style="flex:0 0 350px;max-width:350px">
        <a data-reveal data-delay="120" href="${APK}" download="satset.apk" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);cursor:pointer;display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#BEF264,#84CC16);color:#0B0D0A;font-weight:700;padding:15px 26px;border-radius:999px;font-size:16px;text-decoration:none;box-shadow:0 14px 34px -10px rgba(163,230,53,.6)">
          ${DL_SVG(17)}
          ${t.demo.ctaApk}
        </a>
        <div data-reveal data-delay="150" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);margin:11px 0 0">
          <a href="${APK_PAGE}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#BEF264;text-decoration:underline;text-decoration-color:rgba(163,230,53,.4);text-underline-offset:4px;padding:13px 0">
            ${t.demo.apkAlt}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
          </a>
        </div>
        <p data-reveal data-delay="170" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:12.5px;color:#808977;line-height:1.45;margin:12px 0 0">${t.demo.req}</p>

        <details class="sideload" data-reveal data-delay="190" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);margin:12px 0 0;background:linear-gradient(165deg,#171B14,#10130E);border:1px solid rgba(163,230,53,.14);border-radius:15px;padding:0 15px">
          <summary style="cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;color:#BEF264;font-weight:600;padding:14px 0;line-height:1.35">
            <svg class="sideload-chev" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="m9 5 7 7-7 7"/></svg>
            ${t.demo.sideloadLabel}
          </summary>
          <ol style="list-style:decimal;margin:0 0 15px;padding:0 0 0 19px;display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:#AEB6A6;line-height:1.5">${sideloadSteps}
          </ol>
        </details>

        <div data-reveal data-delay="220" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);margin-top:18px;background:linear-gradient(165deg,#171B14,#10130E);border:1px solid rgba(163,230,53,.14);border-radius:15px;padding:15px 17px">
          <div style="font-size:11.5px;color:#808977;letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px">${t.demo.accountsLabel}</div>
          ${demoAccounts}
          <div style="display:flex;align-items:baseline;gap:8px;margin-top:9px"><span style="font-size:12.5px;color:#808977">${t.demo.passLabel}</span><span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;color:#BEF264;font-weight:600">${DEMO_PASSWORD}</span></div>
          <div style="margin-top:14px;padding-top:13px;border-top:1px solid rgba(238,242,230,.09)">
            <div style="font-size:11.5px;color:#808977;letter-spacing:.09em;text-transform:uppercase;margin-bottom:7px;line-height:1.4">${t.demo.staffLabel}</div>
            ${demoStaff}
          </div>
        </div>
      </div>

      <div class="demo-main" style="flex:1;min-width:0">
        <div data-reveal data-delay="100" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:11.5px;color:#808977;letter-spacing:.09em;text-transform:uppercase;margin-bottom:13px">${t.demo.stepsLabel}</div>
        <div style="display:flex;flex-direction:column;gap:12px">${demoSteps}
        </div>

        <div data-reveal data-delay="400" style="opacity:0;transform:translateY(24px);transition:all .8s cubic-bezier(.16,1,.3,1);margin-top:20px;padding-top:18px;border-top:1px solid rgba(238,242,230,.09)">
          <span style="display:inline-block;border:1px solid rgba(163,230,53,.3);color:#BEF264;font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:3px 9px;border-radius:999px;margin-bottom:8px">${t.demo.bonusLabel}</span>
          <strong style="display:block;font-weight:600;font-size:15px;margin-bottom:3px">${t.demo.bonusTitle}</strong>
          <span style="display:block;color:#929B89;font-size:13.5px;line-height:1.5">${t.demo.bonusDesc}</span>
        </div>
      </div>

    </div>
  </section>

  <!-- ============ REPORTS / CTA ============ -->
  <section class="snap-sec reports" data-screen-label="Reports" data-index="5" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 0;overflow:hidden">
    <div style="position:absolute;width:620px;height:620px;left:50%;top:30%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(163,230,53,.14),transparent 62%);pointer-events:none"></div>

    <div class="reports-row" style="position:relative;z-index:2;display:flex;align-items:center;gap:64px;flex-wrap:wrap">
      <div style="flex:1;min-width:360px;max-width:460px">
        <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#BEF264;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.reports.eyebrow}</span>
        <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 14px">${t.reports.h2}</h2>
        <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#AEB6A6;line-height:1.55;margin:0 0 24px">${t.reports.para}</p>
        <div data-reveal data-delay="200" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);display:flex;gap:11px;flex-wrap:wrap">
          <span style="border:1px solid rgba(238,242,230,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C2C9BA">${t.reports.tag1}</span>
          <span style="border:1px solid rgba(238,242,230,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C2C9BA">${t.reports.tag2}</span>
          <span style="border:1px solid rgba(238,242,230,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C2C9BA">${t.reports.tag3}</span>
        </div>
      </div>

      <div data-depth="10" style="flex:1;min-width:380px;display:flex;justify-content:center">
        <div class="dash-card" data-reveal data-delay="120" style="opacity:0;transform:translateY(40px) rotateX(8deg);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);width:420px;background:linear-gradient(165deg,#191E17,#0C0E0A);border:1px solid rgba(163,230,53,.14);border-radius:22px;padding:24px;box-shadow:0 40px 90px -30px rgba(0,0,0,.7);position:relative;overflow:hidden">
          <div style="position:absolute;top:0;left:0;width:40%;height:2px;background:linear-gradient(90deg,transparent,rgba(207,245,107,.6),transparent);animation:satset-sweep 4s linear infinite"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <div><div style="font-size:13px;color:#808977">${t.reports.dashLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:30px;letter-spacing:-.02em">Rp 8.42M</div></div>
            <div style="text-align:right"><div style="color:#34D399;font-size:14px;font-weight:600">▲ 12.4%</div><div style="font-size:12px;color:#808977">${t.reports.vs}</div></div>
          </div>
          <div style="display:flex;align-items:flex-end;gap:11px;height:140px;padding:0 2px 0;border-bottom:1px solid rgba(163,230,53,.1)">
            <div data-reveal style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:42%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="80" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:60%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="160" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:48%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="240" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:78%;background:linear-gradient(#BEF264,#84CC16);border-radius:6px 6px 0 0;box-shadow:0 0 24px rgba(163,230,53,.35)"></div>
            <div data-reveal data-delay="320" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:64%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="400" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:92%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="480" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:70%;background:linear-gradient(#283024,#1B211A);border-radius:6px 6px 0 0"></div>
          </div>
          <div class="dash-stats" style="display:flex;gap:12px;margin-top:18px">
            <div style="flex:1;min-width:0;background:rgba(163,230,53,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#808977">${t.reports.ordersLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">214</div></div>
            <div style="flex:1;min-width:0;background:rgba(163,230,53,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#808977">${t.reports.avgLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">Rp 39K</div></div>
            <div style="flex:1;min-width:0;background:rgba(163,230,53,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#808977">${t.reports.coversLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">186</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- closing CTA band -->
    <div class="cta-band" data-reveal data-delay="120" style="opacity:0;transform:translateY(34px);transition:all .9s cubic-bezier(.16,1,.3,1);position:relative;z-index:2;margin-top:56px;border-radius:24px;background:linear-gradient(120deg,#BEF264,#84CC16);padding:40px 48px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;box-shadow:0 30px 70px -24px rgba(163,230,53,.5)">
      <div>
        <h3 style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(24px,2.6vw,34px);color:#0B0D0A;letter-spacing:-.02em;margin:0;line-height:1.08">${t.cta.h3a}<br>${t.cta.h3b}</h3>
        <p style="color:rgba(11,13,10,.72);margin:10px 0 0;font-size:15.5px;font-weight:500">${t.cta.para}</p>
      </div>
      <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;flex:none;display:inline-flex;align-items:center;gap:10px;background:#0B0D0A;color:#BEF264;font-weight:700;padding:17px 30px;border-radius:999px;font-size:17px;text-decoration:none;box-shadow:0 12px 30px -8px rgba(0,0,0,.5)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
        ${t.cta.btn}
      </a>
    </div>

    <footer style="position:relative;z-index:2;padding:30px 0 26px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;border-top:1px solid rgba(238,242,230,.08);margin-top:40px">
      <div style="display:flex;align-items:center;gap:10px;font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:17px">
        <svg width="24" height="24" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="url(#lg)"/><path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#151912"/><circle cx="24" cy="11" r="3" fill="#151912"/><rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#151912"/><path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#BEF264"/></svg>
        SatSet
      </div>
      <div style="font-size:13.5px;color:#808977">${t.footer.tagline}</div>
    </footer>
  </section>

</div>
`;
}

export default function SatsetLanding() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Lang>("id");

  const html = useMemo(() => buildMarkup(COPY[lang], lang), [lang]);

  // Imperative port of the design's componentDidMount: scroll reveals, dot nav,
  // smooth-scroll links, card tilt, pointer parallax, and the language toggle.
  // Re-runs on `html` change (locale switch) because the markup DOM is replaced.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const root = wrap.querySelector<HTMLElement>(".scrl");
    if (!root) return;

    const dur = "0.55s"; // Lively
    const reveal = (el: HTMLElement) => {
      const dl = el.getAttribute("data-delay") || "0";
      el.style.transitionDuration = dur;
      el.style.transitionDelay = dl + "ms";
      el.style.opacity = "1";
      el.style.transform = "none";
      el.setAttribute("data-shown", "1");
    };

    const revealEls = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    const dots = [...root.querySelectorAll<HTMLElement>("[data-dot]")];
    const sections = [...root.querySelectorAll<HTMLElement>("section[data-index]")];

    const onScroll = () => {
      const h = root.clientHeight;
      for (const el of revealEls) {
        if (el.getAttribute("data-shown")) continue;
        const r = el.getBoundingClientRect();
        const rr = root.getBoundingClientRect();
        const top = r.top - rr.top;
        if (top < h * 0.86 && r.bottom - rr.top > 0) reveal(el);
      }
      let active = 0;
      const mid = root.scrollTop + h / 2;
      sections.forEach((s, i) => {
        if (s.offsetTop <= mid) active = i;
      });
      dots.forEach((d, di) => {
        const on = di === active;
        d.style.background = on ? "#BEF264" : "#354030";
        d.style.height = on ? "24px" : "9px";
      });
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    const safety = window.setTimeout(() => {
      revealEls.forEach((el) => {
        if (!el.getAttribute("data-shown")) reveal(el);
      });
    }, 1600);

    const go = (i: number) => {
      const s = sections[i];
      if (s) root.scrollTo({ top: s.offsetTop, behavior: "smooth" });
    };
    root.querySelectorAll<HTMLElement>("[data-go]").forEach((a) =>
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        go(Number(a.getAttribute("data-go")));
      }),
    );
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

    // Downloading from the nav or the hero leaves you looking at the hero,
    // with no hint that the demo venues need a login at all. Send the page to
    // the demo section, which already carries the accounts and the install
    // steps. No preventDefault — the download has to fire as normal.
    root.querySelectorAll<HTMLElement>("[data-dl]").forEach((a) =>
      a.addEventListener("click", () => go(DEMO_SECTION_INDEX)),
    );

    const langBtn = wrap.querySelector<HTMLElement>("[data-lang]");
    langBtn?.addEventListener("click", () =>
      setLang((l) => (l === "id" ? "en" : "id")),
    );

    root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 24px 50px -20px rgba(163,230,53,.3)";
        card.style.borderColor = "rgba(163,230,53,.32)";
      });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "none";
        card.style.boxShadow = "none";
        card.style.borderColor = "rgba(163,230,53,.12)";
      });
    });

    const depthEls = [...root.querySelectorAll<HTMLElement>("[data-depth]")];
    const p = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      p.x = (e.clientX / window.innerWidth - 0.5) * 2;
      p.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    root.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      p.tx += (p.x - p.tx) * 0.06;
      p.ty += (p.y - p.ty) * 0.06;
      depthEls.forEach((el) => {
        const d = Number(el.getAttribute("data-depth"));
        el.style.transform = `translate3d(${p.tx * d}px, ${p.ty * d}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onScroll);
    };
  }, [html]);

  return <div ref={wrapRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
