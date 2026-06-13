/**
 * Single source of truth for the LOIT landing page (`/loit`).
 * All on-page copy is Bahasa Indonesia and final per the build brief.
 * Swap PLAY_STORE_URL for the real Google Play listing link when available.
 */

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=id.activid.loit";

export const NAV_LINKS = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Harga", href: "#harga" },
] as const;

export const HERO = {
  eyebrow: "APLIKASI KEUANGAN BERSAMA",
  h1: "Uang bareng, semua jelas.",
  // The single word rendered in mint within the headline.
  highlight: "jelas",
  sub: "Atur kas kelompok dan keuangan keluarga di satu ruang yang transparan. Foto struk, langsung tercatat. Jalan walau tanpa internet.",
  primaryCta: "Download di Google Play",
  secondaryCta: "Lihat cara kerja",
  trust: "Gratis untuk mulai · Anggota gabung tanpa biaya",
} as const;

export const PROBLEM = {
  h2: "Pegang uang bareng itu... ribet.",
  cards: [
    {
      title: "“Uangnya ke mana?”",
      body: "Ditanya tiap rapat, dan kamu harus ingat-ingat sendiri.",
    },
    {
      title: "Struk numpuk",
      body: "Catatan tersebar di buku, chat, dan kepala.",
    },
    {
      title: "Cuma kamu yang tahu",
      body: "Anggota nggak bisa lihat, gampang salah paham.",
    },
  ],
} as const;

export const PILLARS = {
  h2: "Satu ruang, semuanya jelas.",
  highlight: "jelas",
  items: [
    {
      icon: "users" as const,
      title: "Ruang bersama yang transparan",
      body: "Semua anggota lihat kas yang sama, real-time.",
    },
    {
      icon: "scan" as const,
      title: "Scan struk pakai AI",
      body: "Foto struk, langsung jadi catatan rapi. Bukti siap buat laporan.",
    },
    {
      icon: "wifiOff" as const,
      title: "Jalan tanpa internet",
      body: "Catat di mana aja. Data sinkron sendiri pas online.",
    },
  ],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: "CARA KERJA",
  h2: "Dari struk ke catatan, dalam hitungan detik.",
  highlight: "detik",
  steps: [
    { n: 1, label: "Buat ruang" },
    { n: 2, label: "Foto struk" },
    { n: 3, label: "AI catat otomatis" },
    { n: 4, label: "Semua anggota lihat" },
  ],
} as const;

export const SEGMENTS = {
  h2: "Dibuat untuk yang pegang uang bareng.",
  highlight: "bareng",
  cards: [
    {
      icon: "church" as const,
      title: "Gereja & komisi",
      body: "Bendahara persekutuan, pemuda, panitia natal/paskah.",
    },
    {
      icon: "clipboard" as const,
      title: "Panitia & tim",
      body: "Acara nikahan, reuni, kegiatan kampus, anggaran tim.",
    },
    {
      icon: "home" as const,
      title: "Keluarga & pasangan",
      body: "Belanja bulanan, tabungan, pengeluaran rumah — jelas berdua.",
    },
    {
      icon: "sparkles" as const,
      title: "Komunitas & arisan",
      body: "Kas bersama teman dan komunitas.",
    },
  ],
} as const;

export const TRANSPARENCY = {
  eyebrow: "TRANSPARAN",
  h2: "Semua anggota lihat kas yang sama.",
  highlight: "kas yang sama",
  body: 'Nggak ada lagi “uangnya ke mana?”. Setiap pemasukan dan pengeluaran tercatat dan kelihatan buat semua orang di ruang. Laporan tinggal tunjuk layar.',
} as const;

export type PricingTier = {
  name: string;
  price: string;
  priceSuffix?: string;
  scans: string;
  rooms: string;
  featured?: boolean;
  note?: string;
};

export const PRICING = {
  h2: "Harga yang jujur.",
  highlight: "jujur",
  sub: "Mulai gratis. Anggota selalu gabung tanpa biaya.",
  tiers: [
    {
      name: "Free",
      price: "Rp 0",
      scans: "5 scan/bulan",
      rooms: "1 ruang",
    },
    {
      name: "Lite",
      price: "Rp 29.000",
      priceSuffix: "/bln",
      scans: "30 scan/bulan",
      rooms: "1 ruang",
    },
    {
      name: "Pro",
      price: "Rp 39.000",
      priceSuffix: "/bln",
      scans: "150 scan/bulan",
      rooms: "Tanpa batas",
      featured: true,
      note: "Buat kamu yang pegang lebih dari satu kelompok.",
    },
  ] satisfies PricingTier[],
  notes: [
    "Gabung ruang selalu tanpa batas & gratis.",
    "Top-up 15 scan Rp 9.000 (tier Free).",
    "Langganan tahunan = bayar 8 bulan.",
  ],
  cta: "Download di Google Play",
} as const;

export const FINAL_CTA = {
  h2: "Atur uang bareng, mulai hari ini.",
  highlight: "hari ini",
  sub: "Gratis untuk mulai. Download LOIT di Google Play.",
  cta: "Download di Google Play",
} as const;

export const FOOTER = {
  descriptor: "Uang bareng, semua jelas.",
  links: [
    { label: "Kebijakan Privasi", href: "/privacy-loit" },
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Kontak / Dukungan", href: "#kontak" },
  ],
  copyright: `© ${new Date().getFullYear()} LOIT.`,
} as const;
