"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ponytail: markup is a port of the design (SatSet Landing.dc.html), kept as one HTML
// string + an imperative effect rather than ~600 hand-converted JSX nodes. Faithful and
// lower-risk. Copy is parameterized (id/en) so the same markup serves both locales.

const WA = "https://wa.me/6289525699078?text=%5BSatSet%5D";

type Lang = "id" | "en";

type Copy = {
  nav: { features: string; floor: string; reports: string; contact: string };
  hero: {
    badge: string;
    h1a: string;
    h1b: string;
    h1c: string;
    para: string;
    ctaPrimary: string;
    ctaSecondary: string;
    meta1: string;
    meta2: string;
    meta3: string;
    scroll: string;
    table: string;
    chip: string;
    liveStatus: string;
    seated: string;
    ready: string;
    open: string;
    resvName: string;
    resvSub: string;
  };
  features: {
    eyebrow: string;
    h2: string;
    para: string;
    cards: { t: string; d: string }[];
  };
  floor: {
    eyebrow: string;
    h2: string;
    para: string;
    items: { t: string; d: string }[];
  };
  reports: {
    eyebrow: string;
    h2: string;
    para: string;
    tag1: string;
    tag2: string;
    tag3: string;
    dashLabel: string;
    vs: string;
    ordersLabel: string;
    avgLabel: string;
    coversLabel: string;
  };
  cta: { h3a: string; h3b: string; para: string; btn: string };
  footer: { tagline: string };
};

const COPY: Record<Lang, Copy> = {
  id: {
    nav: { features: "Fitur", floor: "Area Resto", reports: "Laporan", contact: "Hubungi Kami" },
    hero: {
      badge: "Pakai Wi-Fi sendiri · Tetap jalan offline",
      h1a: "Sistem restoran",
      h1b: "yang jalan di",
      h1c: "Wi-Fi kamu sendiri.",
      para: "Ubah HP dan tablet Android biasa jadi sistem pemesanan yang lengkap. Pairing lewat QR dalam hitungan detik. Tanpa internet, tanpa tagihan cloud bulanan, tanpa langganan untuk mencatat pesanan.",
      ctaPrimary: "Hubungi Kami",
      ctaSecondary: "Lihat cara kerjanya",
      meta1: "⎯ Siap pakai dalam hitungan menit",
      meta2: "⎯ Terenkripsi antar perangkat",
      meta3: "⎯ Datamu tetap di jaringanmu",
      scroll: "GULIR",
      table: "Meja 7",
      chip: "Pesanan · Meja 4 → 6",
      liveStatus: "Status langsung",
      seated: "Terisi",
      ready: "Siap",
      open: "Kosong",
      resvName: "Sari · 4 orang",
      resvSub: "Reservasi · segera datang",
    },
    features: {
      eyebrow: "Semua jadi gampang",
      h2: "Dibuat supaya momen tersibuk terasa ringan.",
      para: "Satu aplikasi, dua mode. Tiap perangkat terhubung dalam detik dan langsung sinkron lewat jaringan lokalmu.",
      cards: [
        { t: "Scan untuk terhubung", d: "Perangkat menemukan server otomatis — cukup scan kode untuk terhubung. Tanpa IP, tanpa ketik, tanpa setup." },
        { t: "Jalan tanpa internet", d: "Pesanan melesat dari tangan ke dapur lewat Wi-Fi-mu. Internet mati? Layanan tetap jalan." },
        { t: "Tanpa langganan", d: "Tanpa tagihan cloud bulanan untuk mencatat pesanan. Jalan di perangkat Android yang mungkin sudah kamu punya." },
        { t: "Layar dapur real-time", d: "Pesanan muncul seketika saat dikirim, lengkap dengan waktu penyajian dan item telat yang ditandai otomatis." },
        { t: "Tamu scan untuk pesan", d: "Tamu lihat menu dari HP mereka sendiri — tanpa install aplikasi. Pesanan masuk sebagai pending untuk dicek staf." },
        { t: "Aman sejak awal", d: "Lalu lintas antar perangkat terenkripsi dan login PIN pribadi. Setiap aksi tercatat ke pelakunya." },
      ],
    },
    floor: {
      eyebrow: "Dibuat untuk situasi resto nyata",
      h2: "Kami sudah pikirkan bagian ribetnya.",
      para: "Denah ruangan langsung menampilkan kondisi sekilas — kosong, terisi, menunggu, siap. Saat layanan mulai kacau, SatSet tetap mengimbangi.",
      items: [
        { t: "Pindahkan tamu, pesanan ikut.", d: "Satu ketuk memindahkan seluruh sesi ke meja lain." },
        { t: "Reservasi & penguncian pintar.", d: "Atur reservasi langsung dari area; dua pelayan tak akan bentrok di satu meja." },
        { t: "Pisah tagihan & pembatalan tercatat.", d: "Bayar bertahap atau pisah per tamu; tiap pembatalan tercatat ke pelakunya." },
      ],
    },
    reports: {
      eyebrow: "Pahami angkamu",
      h2: "Lihat persis bagaimana hari ini berjalan.",
      para: "Tarik data penjualan riil yang sudah lunas untuk rentang tanggal apa pun. Tagihan, bukti pembayaran, dan riwayat pesanan dalam satu tempat — bisa diekspor kapan saja. Snapshot cloud opsional memungkinkan pemilik memantau dari jauh, tanpa membuat operasional harian bergantung pada cloud.",
      tag1: "Ekspor akuntansi",
      tag2: "Bukti pembayaran",
      tag3: "Brand-mu di struk",
      dashLabel: "Penjualan lunas · hari ini",
      vs: "vs. kemarin",
      ordersLabel: "Pesanan",
      avgLabel: "Rata-rata transaksi",
      coversLabel: "Tamu",
    },
    cta: {
      h3a: "Jalan di Wi-Fi-mu. Tetap jalan offline.",
      h3b: "Tanpa langganan untuk beroperasi.",
      para: "SatSet hanya lewat undangan. Hubungi kami dan kami bantu siapkan — datamu tetap di jaringanmu.",
      btn: "Hubungi Kami",
    },
    footer: { tagline: "Terenkripsi antar perangkat · Login dengan PIN · Datamu tetap di jaringanmu" },
  },
  en: {
    nav: { features: "Features", floor: "The floor", reports: "Reports", contact: "Contact us" },
    hero: {
      badge: "Runs on your Wi-Fi · Works offline",
      h1a: "The restaurant",
      h1b: "system that runs on",
      h1c: "your own Wi-Fi.",
      para: "Turn ordinary Android phones and tablets into a complete point-of-order system. Pair by QR in seconds. No internet, no monthly cloud bill, no subscription to take an order.",
      ctaPrimary: "Contact us",
      ctaSecondary: "See how it works",
      meta1: "⎯ Set up in minutes",
      meta2: "⎯ Encrypted device-to-device",
      meta3: "⎯ Your data stays local",
      scroll: "SCROLL",
      table: "Table 7",
      chip: "Order · Table 4 → 6",
      liveStatus: "Live status",
      seated: "Seated",
      ready: "Ready",
      open: "Open",
      resvName: "Sari · party of 4",
      resvSub: "Reserved · arriving soon",
    },
    features: {
      eyebrow: "Everything's easy",
      h2: "Built to make the busy parts effortless.",
      para: "One app, two modes. Every device pairs in seconds and syncs instantly over your local network.",
      cards: [
        { t: "Scan to pair", d: "Devices find the server automatically — connect by scanning a code. No IPs, no typing, no setup." },
        { t: "Works offline", d: "Orders fly from hand to kitchen over your Wi-Fi. Internet outage? Service simply continues." },
        { t: "No subscription", d: "No monthly cloud bill to take an order. Runs on the Android devices you may already own." },
        { t: "Live kitchen display", d: "Orders appear the instant they're sent, with course timing and overdue items flagged automatically." },
        { t: "Guests scan to order", d: "Diners browse your menu on their own phone — no app install. Orders land as pending for staff review." },
        { t: "Secure by default", d: "Encrypted device-to-device traffic and personal PIN sign-in. Every action tied to the person who did it." },
      ],
    },
    floor: {
      eyebrow: "Built for the real floor",
      h2: "We thought about the messy parts.",
      para: "A live floor plan shows the room at a glance — open, seated, waiting, ready. When service gets chaotic, SatSet keeps up.",
      items: [
        { t: "Move a party, keep the order.", d: "One tap transfers the whole session to another table." },
        { t: "Reservations & smart locking.", d: "Seat bookings from the floor; two waiters never collide on one table." },
        { t: "Split bills & accountable voids.", d: "Settle in stages or split per guest; every cancel is logged to who did it." },
      ],
    },
    reports: {
      eyebrow: "Know your numbers",
      h2: "See exactly how the day went.",
      para: "Pull real, settled sales for any date range. Bills, payment proof and order history in one place — exportable on demand. Optional cloud snapshots let owners check in remotely, without making the day-to-day depend on the cloud.",
      tag1: "Accounting export",
      tag2: "Payment proof",
      tag3: "Your branding on receipts",
      dashLabel: "Settled sales · today",
      vs: "vs. yesterday",
      ordersLabel: "Orders",
      avgLabel: "Avg ticket",
      coversLabel: "Covers",
    },
    cta: {
      h3a: "Runs on your Wi-Fi. Works offline.",
      h3b: "No subscription to operate.",
      para: "SatSet is invite-only. Get in touch and we'll get you set up — your data stays on your network.",
      btn: "Contact us",
    },
    footer: { tagline: "Encrypted device-to-device · PIN-secured sign-in · Your data stays local" },
  },
};

const LOGO_SVG = `<svg width="30" height="30" viewBox="0 0 48 48" style="display:block"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7B23C"/><stop offset="1" stop-color="#E8821E"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#lg)"/><path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#231C15"/><circle cx="24" cy="11" r="3" fill="#231C15"/><rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#231C15"/><path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#F7B23C"/></svg>`;

const MAIL_SVG = (size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#231510" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>`;

const FEATURE_ICONS = [
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3m4 0v4m-7 0h3" stroke-linecap="round"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9" stroke-linecap="round"><path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1.2" fill="#F7B23C" stroke="none"/><path d="M2 4l20 16" stroke-width="1.6" opacity=".5"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/><circle cx="12" cy="12" r="4"/><path d="M9.5 12h5" stroke-width="1.6"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 8v3l2 1"/><path d="M8 21h8"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="9" y="6" width="6" height="6" rx="1"/><path d="M9 16h6" stroke-linecap="round"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.3" fill="#F7B23C" stroke="none"/></svg>`,
];

const FLOOR_ICONS = ["→", "⏱", "$"];

function buildMarkup(t: Copy, lang: Lang): string {
  const other = lang === "id" ? "EN" : "ID";

  const featureDelays = [120, 180, 240, 200, 260, 320];
  const featureCards = t.features.cards
    .map(
      (c, i) => `
      <div data-reveal data-delay="${featureDelays[i]}" class="feat" data-tilt style="opacity:0;transform:translateY(34px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s ease;background:linear-gradient(165deg,#241D15,#1C160F);border:1px solid rgba(245,166,35,.12);border-radius:20px;padding:26px;will-change:transform;transform-style:preserve-3d">
        <div style="width:46px;height:46px;border-radius:13px;background:rgba(245,166,35,.12);display:flex;align-items:center;justify-content:center;margin-bottom:18px">${FEATURE_ICONS[i]}</div>
        <h3 style="font-family:var(--font-satset-display),sans-serif;font-weight:600;font-size:19px;margin:0 0 8px;letter-spacing:-.01em">${c.t}</h3>
        <p style="font-size:14.5px;color:#9C8E7C;line-height:1.5;margin:0">${c.d}</p>
      </div>`,
    )
    .join("");

  const floorDelays = [200, 260, 320];
  const floorItems = t.floor.items
    .map(
      (it, i) => `
        <div data-reveal data-delay="${floorDelays[i]}" style="opacity:0;transform:translateX(-26px);transition:all .8s cubic-bezier(.16,1,.3,1);display:flex;gap:13px;align-items:flex-start"><div style="flex:none;width:30px;height:30px;border-radius:9px;background:rgba(245,166,35,.12);display:flex;align-items:center;justify-content:center;color:#F7B23C;font-weight:700">${FLOOR_ICONS[i]}</div><div><strong style="font-weight:600;font-size:15.5px">${it.t}</strong><div style="color:#9C8E7C;font-size:14px;margin-top:2px">${it.d}</div></div></div>`,
    )
    .join("");

  return `
<div class="scrl" style="height:100vh;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;background:#17130F;color:#F4ECE0;font-family:var(--font-satset-body),sans-serif;position:relative;scrollbar-width:none;-webkit-overflow-scrolling:touch">

  <nav style="position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:20px 7vw;backdrop-filter:blur(14px);background:linear-gradient(180deg,rgba(23,19,15,.82),rgba(23,19,15,.18))">
    <div style="display:flex;align-items:center;gap:11px;font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:20px;letter-spacing:-.01em">
      ${LOGO_SVG}
      <span>SatSet</span>
    </div>
    <div class="nav-links" style="display:flex;align-items:center;gap:30px;font-size:15px;color:#B8AA98;font-weight:500">
      <a data-go="1" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.features}</a>
      <a data-go="2" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.floor}</a>
      <a data-go="3" style="cursor:pointer;color:inherit;text-decoration:none">${t.nav.reports}</a>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <button data-lang aria-label="Switch language" style="cursor:pointer;background:rgba(244,236,224,.06);border:1px solid rgba(244,236,224,.18);color:#F4ECE0;font-weight:700;font-size:13px;letter-spacing:.04em;padding:9px 13px;border-radius:999px;font-family:inherit;line-height:1">${other}</button>
      <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,#F7B23C,#E8821E);color:#231510;font-weight:700;padding:11px 20px;border-radius:999px;font-size:14.5px;text-decoration:none;box-shadow:0 8px 22px -8px rgba(245,166,35,.6)">
        ${MAIL_SVG(15)}
        ${t.nav.contact}
      </a>
    </div>
  </nav>

  <div class="side-dots" style="position:fixed;right:26px;top:50%;transform:translateY(-50%);z-index:55;display:flex;flex-direction:column;gap:14px">
    <span data-dot="0" style="width:9px;height:9px;border-radius:999px;background:#F7B23C;cursor:pointer;transition:all .4s ease;height:24px"></span>
    <span data-dot="1" style="width:9px;height:9px;border-radius:999px;background:#4A3F33;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="2" style="width:9px;height:9px;border-radius:999px;background:#4A3F33;cursor:pointer;transition:all .4s ease"></span>
    <span data-dot="3" style="width:9px;height:9px;border-radius:999px;background:#4A3F33;cursor:pointer;transition:all .4s ease"></span>
  </div>

  <!-- ============ HERO ============ -->
  <section class="snap-sec hero" data-screen-label="Hero" data-index="0" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;align-items:center;padding:120px 7vw 60px;overflow:hidden">
    <div style="position:absolute;width:760px;height:760px;right:-120px;top:50%;margin-top:-380px;background:radial-gradient(circle,rgba(245,166,35,.26),rgba(245,166,35,.06) 42%,transparent 66%);animation:satset-glowPulse 7s ease-in-out infinite;pointer-events:none"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 80% 50%,transparent 40%,rgba(11,8,6,.5));pointer-events:none"></div>

    <div class="hero-copy" style="position:relative;z-index:2;max-width:600px;flex:1">
      <div data-reveal style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(245,166,35,.3);background:rgba(245,166,35,.07);color:#F7B23C;padding:8px 15px;border-radius:999px;font-size:13.5px;font-weight:600;letter-spacing:.01em">
        <span style="width:7px;height:7px;border-radius:999px;background:#5FB87A;box-shadow:0 0 8px #5FB87A;animation:satset-blink 2.4s ease-in-out infinite"></span>
        ${t.hero.badge}
      </div>
      <h1 class="hero-h1" data-reveal data-delay="80" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(40px,5.4vw,74px);line-height:1.02;letter-spacing:-.025em;margin:24px 0 0">
        ${t.hero.h1a}<br>${t.hero.h1b}<br><span style="background:linear-gradient(120deg,#F7B23C,#E8821E);-webkit-background-clip:text;background-clip:text;color:transparent">${t.hero.h1c}</span>
      </h1>
      <p data-reveal data-delay="160" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);font-size:19px;line-height:1.55;color:#B8AA98;max-width:480px;margin:24px 0 0">
        ${t.hero.para}
      </p>
      <div data-reveal data-delay="240" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:flex;gap:14px;align-items:center;margin-top:34px;flex-wrap:wrap">
        <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#F7B23C,#E8821E);color:#231510;font-weight:700;padding:16px 28px;border-radius:999px;font-size:16.5px;text-decoration:none;box-shadow:0 14px 34px -10px rgba(245,166,35,.6)">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#231510" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
          ${t.hero.ctaPrimary}
        </a>
        <a data-go="1" style="cursor:pointer;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(244,236,224,.18);color:#F4ECE0;font-weight:600;padding:16px 24px;border-radius:999px;font-size:16px;text-decoration:none">
          ${t.hero.ctaSecondary}
        </a>
      </div>
      <div class="hero-meta" data-reveal data-delay="320" style="opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);display:flex;gap:26px;margin-top:40px;font-size:13.5px;color:#8A7C6B">
        <span>${t.hero.meta1}</span>
        <span>${t.hero.meta2}</span>
        <span>${t.hero.meta3}</span>
      </div>
    </div>

    <div class="hero-art" data-depth="14" style="position:relative;z-index:2;flex:1;min-width:0;display:flex;justify-content:center;align-items:center">
      <div style="position:relative;width:100%;max-width:520px;margin:0 auto;transform:perspective(1300px) rotateY(-13deg) rotateX(6deg);transform-style:preserve-3d">
      <div style="position:absolute;left:50%;bottom:8%;width:64%;height:46px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(245,166,35,.28),transparent 70%);filter:blur(7px);pointer-events:none"></div>
      <svg width="520" height="520" viewBox="0 0 480 480" style="width:100%;height:auto;display:block;animation:satset-floatY 7s ease-in-out infinite;overflow:visible;position:relative">
        <defs>
          <linearGradient id="dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2F23"/><stop offset="1" stop-color="#241D15"/></linearGradient>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#33291E"/><stop offset="1" stop-color="#1C160F"/></linearGradient>
          <linearGradient id="boltg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBC156"/><stop offset="1" stop-color="#E8821E"/></linearGradient>
          <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B23C"/><stop offset="1" stop-color="#E8821E"/></linearGradient>
        </defs>
        <ellipse cx="240" cy="350" rx="186" ry="40" fill="url(#plate)"/>
        <ellipse cx="240" cy="342" rx="150" ry="26" fill="#3A2F23"/>
        <ellipse cx="240" cy="338" rx="150" ry="24" fill="#221B13"/>
        <!-- revealed phone -->
        <g style="animation:satset-phoneRise 1.5s cubic-bezier(.16,1,.3,1) .65s both">
          <rect x="190" y="120" width="100" height="200" rx="19" fill="#0E0B08" stroke="#3A2F23" stroke-width="2"/>
          <rect x="190" y="120" width="100" height="200" rx="19" fill="none" stroke="rgba(245,166,35,.45)" stroke-width="1.4"/>
          <rect x="198" y="130" width="84" height="34" rx="9" fill="url(#scr)"/>
          <text x="208" y="151" font-family="Hanken Grotesk" font-size="11" font-weight="700" fill="#231510">${t.hero.table}</text>
          <circle cx="272" cy="147" r="5.5" fill="#231510" opacity=".55"/>
          <rect x="198" y="172" width="84" height="20" rx="6" fill="#1C160F"/><rect x="204" y="179" width="40" height="6" rx="3" fill="#6B5E4D"/>
          <rect x="198" y="198" width="84" height="20" rx="6" fill="#1C160F"/><rect x="204" y="205" width="52" height="6" rx="3" fill="#6B5E4D"/>
          <rect x="198" y="224" width="84" height="20" rx="6" fill="#1C160F"/><rect x="204" y="231" width="34" height="6" rx="3" fill="#6B5E4D"/>
          <rect x="198" y="284" width="84" height="24" rx="8" fill="url(#scr)"/><rect x="222" y="293" width="36" height="6" rx="3" fill="#231510"/>
        </g>
        <!-- lid -->
        <g style="animation:satset-clocheLift 1.5s cubic-bezier(.16,1,.3,1) .55s both">
          <path d="M80 322 C80 196 152 128 240 128 C328 128 400 196 400 322 Z" fill="url(#dome)"/>
          <path d="M80 322 C80 196 152 128 240 128 C328 128 400 196 400 322" fill="none" stroke="rgba(251,193,86,.4)" stroke-width="2"/>
          <path d="M110 300 C112 210 168 156 240 150" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10" stroke-linecap="round"/>
          <rect x="68" y="316" width="344" height="16" rx="8" fill="#2B2218"/>
          <rect x="68" y="316" width="344" height="6" rx="3" fill="rgba(251,193,86,.22)"/>
          <rect x="236" y="104" width="8" height="26" rx="4" fill="#2B2218"/>
          <circle cx="240" cy="100" r="15" fill="#2B2218"/><circle cx="235" cy="95" r="4" fill="rgba(251,193,86,.3)"/>
          <path d="M252 178 L212 250 L242 250 L230 300 L296 222 L262 222 Z" fill="url(#boltg)"/>
        </g>
      </svg>
      </div>
    </div>

    <div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);font-size:12px;color:#6F6353;letter-spacing:.18em;display:flex;flex-direction:column;align-items:center;gap:8px">${t.hero.scroll}<span style="width:1px;height:26px;background:linear-gradient(#F7B23C,transparent)"></span></div>
  </section>

  <!-- ============ FEATURES ============ -->
  <section class="snap-sec" data-screen-label="Features" data-index="1" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 80px">
    <div style="position:absolute;width:560px;height:560px;left:-160px;top:-120px;background:radial-gradient(circle,rgba(245,166,35,.1),transparent 65%);pointer-events:none"></div>
    <div style="max-width:680px;position:relative;z-index:2">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#F7B23C;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.features.eyebrow}</span>
      <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 14px">${t.features.h2}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#B8AA98;max-width:560px;margin:0">${t.features.para}</p>
    </div>

    <div class="feat-grid" style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px;perspective:1400px">${featureCards}
    </div>
  </section>

  <!-- ============ THE FLOOR ============ -->
  <section class="snap-sec floor" data-screen-label="The floor" data-index="2" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;align-items:center;padding:120px 7vw 80px;overflow:hidden">
    <div style="position:absolute;width:680px;height:680px;right:-180px;bottom:-180px;background:radial-gradient(circle,rgba(245,166,35,.12),transparent 62%);pointer-events:none"></div>

    <div class="floor-copy" style="position:relative;z-index:3;max-width:460px;flex:0 0 420px">
      <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#F7B23C;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.floor.eyebrow}</span>
      <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 16px">${t.floor.h2}</h2>
      <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#B8AA98;line-height:1.55;margin:0 0 26px">${t.floor.para}</p>
      <div style="display:flex;flex-direction:column;gap:13px">${floorItems}
      </div>
    </div>

    <div class="floor-art" data-depth="12" style="position:relative;z-index:2;flex:1;display:flex;justify-content:center;align-items:center;height:560px;perspective:1400px">
      <div class="diorama" style="opacity:1;transform:scale(1.08);position:relative;width:520px;height:440px;transform-style:preserve-3d">
        <div style="position:absolute;inset:0;transform:rotateX(56deg) rotateZ(-44deg);transform-style:preserve-3d;animation:satset-floatY2 8s ease-in-out infinite">
          <!-- floor base -->
          <div style="position:absolute;left:40px;top:40px;width:380px;height:360px;border-radius:26px;background:linear-gradient(135deg,#241D15,#191309);box-shadow:0 40px 80px rgba(0,0,0,.55),inset 0 0 0 1px rgba(245,166,35,.08)"></div>
          <!-- grid lines -->
          <div style="position:absolute;left:40px;top:160px;width:380px;height:1px;background:rgba(245,166,35,.06)"></div>
          <div style="position:absolute;left:40px;top:280px;width:380px;height:1px;background:rgba(245,166,35,.06)"></div>
          <div style="position:absolute;left:170px;top:40px;width:1px;height:360px;background:rgba(245,166,35,.06)"></div>
          <div style="position:absolute;left:290px;top:40px;width:1px;height:360px;background:rgba(245,166,35,.06)"></div>
          <!-- tables: seated(orange) -->
          <div style="position:absolute;left:78px;top:84px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#F7B23C,#E8821E);box-shadow:0 16px 0 #8a4f17,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:200px;top:88px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#3A2F23,#241B12);box-shadow:0 16px 0 #14100a,0 26px 26px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:320px;top:84px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#5FB87A,#3E8B57);box-shadow:0 16px 0 #245036,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:80px;top:206px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#3A2F23,#241B12);box-shadow:0 16px 0 #14100a,0 26px 26px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:202px;top:200px;width:72px;height:72px;border-radius:16px;background:linear-gradient(160deg,#F7B23C,#E8821E);box-shadow:0 18px 0 #8a4f17,0 28px 28px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:322px;top:206px;width:64px;height:64px;border-radius:15px;background:linear-gradient(160deg,#3A2F23,#241B12);box-shadow:0 16px 0 #14100a,0 26px 26px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:84px;top:312px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#3A2F23,#241B12);box-shadow:0 15px 0 #14100a,0 24px 24px rgba(0,0,0,.45)"></div>
          <div style="position:absolute;left:206px;top:316px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#E8821E,#c46a16);box-shadow:0 15px 0 #6e3c10,0 24px 24px rgba(0,0,0,.45)"></div>
          <div data-busy style="position:absolute;left:322px;top:312px;width:60px;height:60px;border-radius:14px;background:linear-gradient(160deg,#3A2F23,#241B12);box-shadow:0 15px 0 #14100a,0 24px 24px rgba(0,0,0,.45)"></div>
        </div>
        <!-- floating order chip moving table to table -->
        <div style="position:absolute;left:150px;top:120px;animation:satset-chipMove 6s ease-in-out infinite">
          <div style="background:#0E0B08;border:1px solid rgba(245,166,35,.5);border-radius:12px;padding:9px 13px;box-shadow:0 14px 30px rgba(0,0,0,.6);display:flex;align-items:center;gap:9px;white-space:nowrap"><span style="width:8px;height:8px;border-radius:999px;background:#F7B23C;box-shadow:0 0 8px #F7B23C"></span><span style="font-size:13px;font-weight:600;color:#F4ECE0">${t.hero.chip}</span></div>
        </div>
        <!-- floating status legend -->
        <div style="position:absolute;right:-6px;top:8px;background:rgba(20,15,10,.78);backdrop-filter:blur(8px);border:1px solid rgba(245,166,35,.14);border-radius:14px;padding:13px 15px;box-shadow:0 14px 36px rgba(0,0,0,.5)">
          <div style="font-size:11px;color:#8A7C6B;letter-spacing:.1em;text-transform:uppercase;margin-bottom:9px">${t.hero.liveStatus}</div>
          <div style="display:flex;flex-direction:column;gap:7px;font-size:12.5px;color:#C9BCA9">
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#F7B23C;display:inline-block"></i>${t.hero.seated}</span>
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#5FB87A;display:inline-block"></i>${t.hero.ready}</span>
            <span style="display:flex;align-items:center;gap:8px"><i style="width:9px;height:9px;border-radius:3px;background:#3A2F23;display:inline-block"></i>${t.hero.open}</span>
          </div>
        </div>
        <!-- floating reservation card -->
        <div style="position:absolute;left:-18px;bottom:18px;background:rgba(20,15,10,.78);backdrop-filter:blur(8px);border:1px solid rgba(245,166,35,.14);border-radius:14px;padding:11px 14px;box-shadow:0 14px 36px rgba(0,0,0,.5);display:flex;align-items:center;gap:11px">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(245,166,35,.14);color:#F7B23C;display:flex;align-items:center;justify-content:center;font-weight:700">7:30</div>
          <div><div style="font-size:13px;font-weight:600">${t.hero.resvName}</div><div style="font-size:11.5px;color:#8A7C6B">${t.hero.resvSub}</div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ REPORTS / CTA ============ -->
  <section class="snap-sec reports" data-screen-label="Reports" data-index="3" style="min-height:100vh;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;padding:120px 7vw 0;overflow:hidden">
    <div style="position:absolute;width:620px;height:620px;left:50%;top:30%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(245,166,35,.14),transparent 62%);pointer-events:none"></div>

    <div class="reports-row" style="position:relative;z-index:2;display:flex;align-items:center;gap:64px;flex-wrap:wrap">
      <div style="flex:1;min-width:360px;max-width:460px">
        <span data-reveal style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);color:#F7B23C;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${t.reports.eyebrow}</span>
        <h2 data-reveal data-delay="80" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.02em;margin:16px 0 14px">${t.reports.h2}</h2>
        <p data-reveal data-delay="140" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);font-size:18px;color:#B8AA98;line-height:1.55;margin:0 0 24px">${t.reports.para}</p>
        <div data-reveal data-delay="200" style="opacity:0;transform:translateY(28px);transition:all .8s cubic-bezier(.16,1,.3,1);display:flex;gap:11px;flex-wrap:wrap">
          <span style="border:1px solid rgba(244,236,224,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C9BCA9">${t.reports.tag1}</span>
          <span style="border:1px solid rgba(244,236,224,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C9BCA9">${t.reports.tag2}</span>
          <span style="border:1px solid rgba(244,236,224,.16);border-radius:999px;padding:8px 15px;font-size:13.5px;color:#C9BCA9">${t.reports.tag3}</span>
        </div>
      </div>

      <div data-depth="10" style="flex:1;min-width:380px;display:flex;justify-content:center">
        <div class="dash-card" data-reveal data-delay="120" style="opacity:0;transform:translateY(40px) rotateX(8deg);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);width:420px;background:linear-gradient(165deg,#26201A,#191309);border:1px solid rgba(245,166,35,.14);border-radius:22px;padding:24px;box-shadow:0 40px 90px -30px rgba(0,0,0,.7);position:relative;overflow:hidden">
          <div style="position:absolute;top:0;left:0;width:40%;height:2px;background:linear-gradient(90deg,transparent,rgba(251,193,86,.6),transparent);animation:satset-sweep 4s linear infinite"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <div><div style="font-size:13px;color:#8A7C6B">${t.reports.dashLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:30px;letter-spacing:-.02em">Rp 8.42M</div></div>
            <div style="text-align:right"><div style="color:#5FB87A;font-size:14px;font-weight:600">▲ 12.4%</div><div style="font-size:12px;color:#8A7C6B">${t.reports.vs}</div></div>
          </div>
          <div style="display:flex;align-items:flex-end;gap:11px;height:140px;padding:0 2px 0;border-bottom:1px solid rgba(245,166,35,.1)">
            <div data-reveal style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:42%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="80" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:60%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="160" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:48%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="240" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:78%;background:linear-gradient(#F7B23C,#E8821E);border-radius:6px 6px 0 0;box-shadow:0 0 24px rgba(245,166,35,.35)"></div>
            <div data-reveal data-delay="320" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:64%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="400" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:92%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
            <div data-reveal data-delay="480" style="opacity:1;transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.16,1,.3,1);flex:1;height:70%;background:linear-gradient(#3A2F23,#2a2118);border-radius:6px 6px 0 0"></div>
          </div>
          <div style="display:flex;gap:12px;margin-top:18px">
            <div style="flex:1;background:rgba(245,166,35,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#8A7C6B">${t.reports.ordersLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">214</div></div>
            <div style="flex:1;background:rgba(245,166,35,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#8A7C6B">${t.reports.avgLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">Rp 39K</div></div>
            <div style="flex:1;background:rgba(245,166,35,.06);border-radius:12px;padding:12px"><div style="font-size:12px;color:#8A7C6B">${t.reports.coversLabel}</div><div style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:21px">186</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- closing CTA band -->
    <div class="cta-band" data-reveal data-delay="120" style="opacity:0;transform:translateY(34px);transition:all .9s cubic-bezier(.16,1,.3,1);position:relative;z-index:2;margin-top:56px;border-radius:24px;background:linear-gradient(120deg,#F7B23C,#E8821E);padding:40px 48px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;box-shadow:0 30px 70px -24px rgba(245,166,35,.5)">
      <div>
        <h3 style="font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:clamp(24px,2.6vw,34px);color:#231510;letter-spacing:-.02em;margin:0;line-height:1.08">${t.cta.h3a}<br>${t.cta.h3b}</h3>
        <p style="color:rgba(35,21,16,.72);margin:10px 0 0;font-size:15.5px;font-weight:500">${t.cta.para}</p>
      </div>
      <a href="${WA}" target="_blank" rel="noopener noreferrer" style="cursor:pointer;flex:none;display:inline-flex;align-items:center;gap:10px;background:#231510;color:#F7B23C;font-weight:700;padding:17px 30px;border-radius:999px;font-size:17px;text-decoration:none;box-shadow:0 12px 30px -8px rgba(0,0,0,.5)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7B23C" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
        ${t.cta.btn}
      </a>
    </div>

    <footer style="position:relative;z-index:2;padding:30px 0 26px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;border-top:1px solid rgba(244,236,224,.08);margin-top:40px">
      <div style="display:flex;align-items:center;gap:10px;font-family:var(--font-satset-display),sans-serif;font-weight:700;font-size:17px">
        <svg width="24" height="24" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="url(#lg)"/><path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#231C15"/><circle cx="24" cy="11" r="3" fill="#231C15"/><rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#231C15"/><path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#F7B23C"/></svg>
        SatSet
      </div>
      <div style="font-size:13.5px;color:#6F6353">${t.footer.tagline}</div>
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
        d.style.background = on ? "#F7B23C" : "#4A3F33";
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

    const langBtn = wrap.querySelector<HTMLElement>("[data-lang]");
    langBtn?.addEventListener("click", () =>
      setLang((l) => (l === "id" ? "en" : "id")),
    );

    root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 24px 50px -20px rgba(245,166,35,.3)";
        card.style.borderColor = "rgba(245,166,35,.32)";
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
        card.style.borderColor = "rgba(245,166,35,.12)";
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
