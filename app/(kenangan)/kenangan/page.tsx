import type { Metadata } from "next";
import Link from "next/link";
import { KENANGAN_TIERS } from "@/types/kenangan";

export const metadata: Metadata = {
  title: "Galeri Foto Langsung untuk Acaramu",
  description:
    "Tamu memotret dari ponsel tanpa aplikasi, foto muncul seketika di feed acara. Setelah acara, ambil galeri final yang dipoles AI. Mulai gratis.",
};

const FEATURES = [
  {
    title: "Tanpa aplikasi, tanpa akun",
    body: "Tamu cukup buka link atau pindai QR. Langsung memotret — tidak ada unduhan, tidak ada pendaftaran.",
  },
  {
    title: "Feed langsung",
    body: "Setiap jepretan muncul seketika di layar acara dan di ponsel semua orang. Kenangan tumbuh secara langsung.",
  },
  {
    title: "Galeri final dipoles AI",
    body: "Selesai acara, tebus galeri final yang di-color grade otomatis. Warna hangat, konsisten, siap dibagikan.",
  },
  {
    title: "Satu host, banyak acara",
    body: "Masuk dengan Google sekali. Kelola semua acaramu — ulang tahun, pernikahan, gathering — dari satu tempat.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Buat acara",
    body: "Masuk dengan Google, beri nama acara, pilih paket sesuai jumlah tamu.",
  },
  {
    n: "02",
    title: "Bagikan link atau QR",
    body: "Sebar ke tamu lewat WhatsApp atau pajang QR di meja. Mereka langsung bisa memotret.",
  },
  {
    n: "03",
    title: "Ambil galeri final",
    body: "Setelah acara, tebus galeri yang dipoles AI dan bagikan ke semua tamu.",
  },
];

const FAQ = [
  {
    q: "Apakah tamu perlu mengunduh aplikasi?",
    a: "Tidak. Tamu cukup membuka link atau memindai QR dari browser ponsel mereka, lalu langsung memotret. Tanpa aplikasi, tanpa akun.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Pilih paket sesuai jumlah tamu, lalu konfirmasi pembayaran lewat WhatsApp. Setelah kami verifikasi, galeri final yang dipoles AI langsung terbuka.",
  },
  {
    q: "Berapa lama foto tersimpan?",
    a: "Foto asli disimpan hingga 60 hari setelah acara. Ambil dan bagikan galeri finalmu dalam rentang itu.",
  },
  {
    q: "Siapa yang bisa melihat foto acaraku?",
    a: "Hanya orang yang punya link acaramu. Setiap acara berdiri sendiri — tamu satu acara tidak melihat foto acara lain.",
  },
];

export default function KenanganLandingPage() {
  return (
    <div className="kkm">
      <header className="kkm-nav">
        <span className="kkm-logo kk-display">KenanganKita</span>
        <Link href="/kenangan/host" className="kk-btn kk-btn-ghost kkm-nav-cta">
          Masuk Host
        </Link>
      </header>

      <section className="kkm-hero">
        <div className="kkm-hero-copy">
          <p className="kk-brand kkm-eyebrow">Galeri Foto Acara</p>
          <h1 className="kkm-title kk-display">
            Setiap tamu jadi fotografermu.
          </h1>
          <p className="kkm-lead">
            Tamu memotret dari ponsel tanpa aplikasi, dan fotonya muncul
            seketika di feed acara. Setelah acara usai, ambil galeri final yang
            dipoles AI — hangat, konsisten, siap dibagikan.
          </p>
          <div className="kkm-hero-actions">
            <Link href="/kenangan/host" className="kk-btn kk-btn-primary">
              Mulai — Masuk dengan Google
            </Link>
            <a href="#cara-kerja" className="kk-btn kk-btn-ghost">
              Lihat cara kerja
            </a>
          </div>
          <p className="kkm-hero-note">Gratis untuk mulai. Bayar hanya saat menebus galeri final.</p>
        </div>
        <div className="kkm-hero-art">
          <img
            src="/kenangan/hero.webp"
            alt="Meja perayaan hangat dengan ponsel menampilkan galeri foto acara"
            className="kkm-hero-img"
          />
        </div>
      </section>

      <section className="kkm-section">
        <h2 className="kkm-h2 kk-display">Kenapa KenanganKita</h2>
        <div className="kkm-features">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`kk-card kkm-feature${i === 0 ? " kkm-feature-lead" : ""}`}
            >
              <h3 className="kkm-feature-title">{f.title}</h3>
              <p className="kkm-feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="kkm-section">
        <h2 className="kkm-h2 kk-display">Cara kerja</h2>
        <div className="kkm-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="kkm-step">
              <span className="kkm-step-n kk-display">{s.n}</span>
              <h3 className="kkm-feature-title">{s.title}</h3>
              <p className="kkm-feature-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="harga" className="kkm-section">
        <h2 className="kkm-h2 kk-display">Harga per acara</h2>
        <p className="kkm-sub">Pilih sesuai jumlah tamu. Bayar sekali per acara, tanpa langganan.</p>
        <div className="kkm-grid kkm-pricing">
          {KENANGAN_TIERS.map((t, i) => (
            <div
              key={t.id}
              className={`kk-card kkm-price${i === 1 ? " kkm-price-featured" : ""}`}
            >
              {i === 1 ? <span className="kkm-badge">Paling populer</span> : null}
              <h3 className="kkm-price-name kk-display">{t.name}</h3>
              <p className="kkm-price-amount">
                Rp {t.priceIdr.toLocaleString("id-ID")}
              </p>
              <p className="kkm-feature-body">Hingga {t.guestCap} tamu</p>
              <Link href="/kenangan/host" className="kk-btn kk-btn-ghost kkm-price-cta">
                Pilih {t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="kkm-section">
        <h2 className="kkm-h2 kk-display">Pertanyaan umum</h2>
        <div className="kkm-faq">
          {FAQ.map((item) => (
            <details key={item.q} className="kk-card kkm-faq-item">
              <summary className="kkm-faq-q">{item.q}</summary>
              <p className="kkm-feature-body">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="kkm-cta">
        <h2 className="kkm-h2 kk-display">Siap mengabadikan acaramu?</h2>
        <p className="kkm-sub">Buat acara pertamamu dalam satu menit.</p>
        <Link href="/kenangan/host" className="kk-btn kk-btn-primary">
          Masuk dengan Google
        </Link>
      </section>

      <footer className="kkm-footer">
        <span className="kk-display">KenanganKita</span>
        <span className="kkm-footer-muted">Galeri foto langsung untuk acaramu.</span>
      </footer>
    </div>
  );
}
