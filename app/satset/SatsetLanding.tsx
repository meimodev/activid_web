import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ExternalLink,
} from "lucide-react";
import { COPY, type Lang } from "./copy";
import DocumentLanguage from "./DocumentLanguage";
import { formatRupiah, SATSET_OFFER } from "./offer";

const APK = "/satset/download";
const APK_RELEASE = "https://github.com/meimodev/satset/releases/latest";
const WHATSAPP = "https://wa.me/6289525699078";

const ADMIN_ACCOUNTS = [
  "admin@satset.id",
  "admin2@satset.id",
  "admin3@satset.id",
];
const ADMIN_PASSWORD = "password";
const STAFF = [
  { name: "Pelayan 1", pin: "100001" },
  { name: "Dapur 1", pin: "100002" },
  { name: "Pelayan 2", pin: "100003" },
  { name: "Dapur 2", pin: "100004" },
];

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="satset-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#BEF264" />
          <stop offset="1" stopColor="#84CC16" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#satset-logo-gradient)" />
      <path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#151912" />
      <circle cx="24" cy="11" r="3" fill="#151912" />
      <rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#151912" />
      <path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#BEF264" />
    </svg>
  );
}

export default function SatsetLanding({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const whatsappHref = `${WHATSAPP}?text=${encodeURIComponent(t.whatsappMessage)}`;

  return (
    <div className="satset-page" lang={lang}>
      <DocumentLanguage lang={lang} />
      <header className="satset-header">
        <div className="satset-container satset-header-inner">
          <a className="satset-brand" href="#top" aria-label="SatSet">
            <Logo />
            <span>SatSet</span>
          </a>

          <nav className="satset-nav" aria-label={lang === "id" ? "Navigasi utama" : "Main navigation"}>
            <a href="#how">{t.nav.how}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#demo">{t.nav.demo}</a>
          </nav>

          <div className="satset-header-actions">
            <a
              className="satset-lang"
              aria-label={t.nav.switchLanguage}
              href={lang === "id" ? "/satset?lang=en" : "/satset"}
            >
              {lang === "id" ? "EN" : "ID"}
            </a>
            <a className="satset-button satset-button-small satset-button-outline" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              {t.nav.contact}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="satset-hero" aria-labelledby="satset-hero-title">
          <div className="satset-hero-visual">
            <Image
              src="/satset-hero.webp"
              alt={t.hero.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 100vw"
            />
          </div>
          <div className="satset-container satset-hero-inner">
            <div className="satset-hero-copy">
              <p className="satset-eyebrow">{t.hero.eyebrow}</p>
              <h1 id="satset-hero-title">{t.hero.title}</h1>
              <p className="satset-hero-description">{t.hero.description}</p>

              <a className="satset-offer-preview" href="#pricing">
                <span className="satset-offer-label">{t.hero.offerLabel}</span>
                <span className="satset-offer-price">
                  <strong>{t.hero.price}</strong>
                  <span>{t.hero.period}</span>
                </span>
                <span className="satset-offer-regular">{t.hero.regular}</span>
                <span className="satset-offer-link">{t.hero.termsLink} <ArrowRight size={16} aria-hidden="true" /></span>
              </a>

              <div className="satset-actions">
                <a className="satset-button satset-button-primary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {t.hero.contact}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="satset-button satset-button-quiet" href="#demo">
                  {t.hero.demo}
                  <ArrowDownToLine size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="satset-section satset-how" aria-labelledby="satset-how-title">
          <div className="satset-container">
            <div className="satset-section-heading">
              <p className="satset-eyebrow">{t.how.eyebrow}</p>
              <h2 id="satset-how-title">{t.how.title}</h2>
              <p>{t.how.description}</p>
            </div>
            <div className="satset-steps">
              {t.how.steps.map((step, index) => (
                <div className="satset-step" key={step.title}>
                  <span className="satset-step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
            <p className="satset-how-note">{t.how.note}</p>
          </div>
        </section>

        <section id="features" className="satset-section satset-features" aria-labelledby="satset-features-title">
          <div className="satset-container">
            <div className="satset-section-heading">
              <p className="satset-eyebrow">{t.features.eyebrow}</p>
              <h2 id="satset-features-title">{t.features.title}</h2>
            </div>
            <div className="satset-feature-grid">
            {t.features.items.map((item) => (
              <article className="satset-feature" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="satset-section satset-pricing" aria-labelledby="satset-pricing-title">
          <div className="satset-container satset-pricing-layout">
            <div className="satset-pricing-copy">
              <p className="satset-eyebrow">{t.pricing.eyebrow}</p>
              <h2 id="satset-pricing-title">{t.pricing.title}</h2>
              <p>{t.pricing.description}</p>
            </div>
            <div className="satset-price-card">
              <div className="satset-price-topline">
                <span>{t.pricing.promoLabel}</span>
                <span>{t.pricing.regularLabel} <s>{formatRupiah(SATSET_OFFER.regularMonthlyPrice, lang)} {t.pricing.period}</s></span>
              </div>
              <div className="satset-price-amount">
                <strong>{t.hero.price}</strong>
                <span>{t.pricing.period}</span>
              </div>
              <ul className="satset-price-benefits">
                {t.pricing.benefits.map((benefit) => (
                  <li key={benefit}><Check size={18} aria-hidden="true" /><span>{benefit}</span></li>
                ))}
              </ul>
              <p className="satset-price-hardware">{t.pricing.hardware}</p>
              <a className="satset-button satset-button-primary satset-price-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {t.pricing.contact}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section id="demo" className="satset-section satset-demo" aria-labelledby="satset-demo-title">
          <div className="satset-container satset-demo-layout">
            <div className="satset-demo-intro">
              <p className="satset-eyebrow">{t.demo.eyebrow}</p>
              <h2 id="satset-demo-title">{t.demo.title}</h2>
              <p>{t.demo.description}</p>
              <a className="satset-button satset-button-primary" href={APK} download="satset.apk">
                <ArrowDownToLine size={19} aria-hidden="true" />
                {t.demo.download}
              </a>
              <a className="satset-release-link" href={APK_RELEASE} target="_blank" rel="noopener noreferrer">
                {t.demo.release} <ExternalLink size={15} aria-hidden="true" />
              </a>
              <p className="satset-demo-requirement">{t.demo.requirement}</p>
            </div>

            <div className="satset-demo-guide">
              <h3>{t.demo.stepsTitle}</h3>
              <ol className="satset-demo-steps">
                {t.demo.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <details className="satset-details">
                <summary>{t.demo.accountsTitle}</summary>
                <div className="satset-details-content">
                  <p className="satset-detail-label">{t.demo.adminLabel}</p>
                  <ul className="satset-account-list">
                    {ADMIN_ACCOUNTS.map((account) => <li key={account}><code>{account}</code></li>)}
                  </ul>
                  <p>{t.demo.passwordLabel}: <code className="satset-secret">{ADMIN_PASSWORD}</code></p>
                  <p className="satset-detail-label">{t.demo.staffLabel}</p>
                  <ul className="satset-staff-list">
                    {STAFF.map((staff) => <li key={staff.pin}><span>{staff.name}</span><code>{staff.pin}</code></li>)}
                  </ul>
                </div>
              </details>
              <details className="satset-details">
                <summary>{t.demo.sideloadTitle}</summary>
                <ol className="satset-details-content satset-sideload-steps">
                  {t.demo.sideloadSteps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </details>
              <p className="satset-second-phone">{t.demo.secondPhone}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="satset-footer">
        <div className="satset-container satset-footer-inner">
          <a className="satset-brand" href="#top"><Logo /><span>SatSet</span></a>
          <p>{t.footer.tagline}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">{t.footer.contact} <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </footer>
    </div>
  );
}
