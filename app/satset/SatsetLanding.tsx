import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { COPY, type Lang } from "./copy";
import DocumentLanguage from "./DocumentLanguage";
import MobileNavigation from "./MobileNavigation";
import { SATSET_SCREENS } from "./screenshots";
import { SATSET_PRODUCT_NAME } from "./brand";
import { formatRupiah, SATSET_OFFER } from "./offer";

const APK = "/satset/download";
const APK_RELEASE = "https://github.com/meimodev/satset/releases/latest";
const WHATSAPP = "https://wa.me/62881080088816";

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
          <stop offset="0" stopColor="#FFD21A" />
          <stop offset="1" stopColor="#E5A900" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#satset-logo-gradient)" />
      <path d="M24 12a13 13 0 0 0-13 13h26a13 13 0 0 0-13-13Z" fill="#17150D" />
      <circle cx="24" cy="11" r="3" fill="#17150D" />
      <rect x="9" y="26" width="30" height="4.6" rx="2.3" fill="#17150D" />
      <path d="M25.5 15 19 25h4.2l-1.4 6 6.7-10h-4.2Z" fill="#FFD21A" />
    </svg>
  );
}

function BrandName() {
  return (
    <span className="satset-brand-copy">
      <span>SatSet</span>
      <span className="satset-brand-description">
        <span className="satset-brand-description-full">/ Restaurant Display System</span>
        <span className="satset-brand-description-short">/ RDS</span>
      </span>
    </span>
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
          <a className="satset-brand" href="#top" aria-label={SATSET_PRODUCT_NAME}>
            <Logo />
            <BrandName />
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
            <MobileNavigation lang={lang} labels={t.nav} />
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
            src="/satset-hero-rds.webp"
              alt={t.hero.imageAlt}
              fill
              preload
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <div className="satset-container satset-hero-inner">
            <div className="satset-hero-copy">
              <p className="satset-eyebrow">{t.hero.eyebrow}</p>
              <h1 id="satset-hero-title">{t.hero.title}</h1>
              <p className="satset-hero-description">{t.hero.description}</p>

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

        <aside className="satset-offer-strip" aria-label={t.pricing.promoLabel}>
          <a className="satset-container satset-offer-strip-inner" href="#pricing">
            <span className="satset-offer-price"><strong>{t.hero.price}</strong><span>{t.hero.period}</span></span>
            <span className="satset-offer-label">{t.hero.offerLabel}</span>
            <span className="satset-offer-link">{t.hero.termsLink}<ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        </aside>

        <section id="how" className="satset-section satset-how" aria-labelledby="satset-how-title">
          <div className="satset-container">
            <div className="satset-section-heading">
              <h2 id="satset-how-title">{t.how.title}</h2>
              <p>{t.how.description}</p>
            </div>
            <ol className="satset-steps">
              {t.how.steps.map((step) => (
                <li className="satset-step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <p className="satset-how-note">{t.how.note}</p>
          </div>
        </section>

        <section id="features" className="satset-section satset-features" aria-labelledby="satset-features-title">
          <div className="satset-container">
            <div className="satset-section-heading">
              <h2 id="satset-features-title">{t.features.title}</h2>
              <p>{t.features.description}</p>
            </div>
            <div className="satset-walkthrough">
              {SATSET_SCREENS.map((screen, index) => {
                const copy = t.features.screens[screen.id];
                return (
                  <details className="satset-screen" name="satset-walkthrough" key={screen.id} open={index === 0}>
                    <summary>
                      <span><strong>{copy.title}</strong><span className="satset-screen-description">{copy.description}</span></span>
                      <ChevronDown size={20} aria-hidden="true" />
                    </summary>
                    <figure>
                      <a href={screen.src} target="_blank" rel="noopener noreferrer" aria-label={`${copy.title}: ${t.features.enlarge}`}>
                        <picture>
                          <source
                            srcSet={`${screen.src.replace(".webp", "-480.webp")} 480w, ${screen.src.replace(".webp", "-800.webp")} 800w, ${screen.src} 1136w`}
                            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1256px) calc(100vw - 56px), 1136px"
                          />
                          <Image src={screen.src} alt={copy.alt} width={1136} height={672} loading="lazy" unoptimized />
                        </picture>
                      </a>
                      <figcaption><span>{t.features.screenshotLabel}</span><a href={screen.src} target="_blank" rel="noopener noreferrer">{t.features.enlarge}<ExternalLink size={14} aria-hidden="true" /></a></figcaption>
                    </figure>
                  </details>
                );
              })}
            </div>
            <p className="satset-reports-note">{t.features.reports}</p>
          </div>
        </section>

        <section id="pricing" className="satset-section satset-pricing" aria-labelledby="satset-pricing-title">
          <div className="satset-container satset-pricing-layout">
            <div className="satset-pricing-copy">
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
              <a className="satset-button satset-button-primary" href={APK} download="satset.apk" aria-describedby="satset-download-size">
                <ArrowDownToLine size={19} aria-hidden="true" />
                {t.demo.download}
              </a>
              <p id="satset-download-size" className="satset-download-size">{t.demo.downloadSize}</p>
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
        <section id="faq" className="satset-section satset-faq" aria-labelledby="satset-faq-title">
          <div className="satset-container satset-faq-inner">
            <h2 id="satset-faq-title">{t.faq.title}</h2>
            <div className="satset-faq-list">
              {t.faq.items.map((item) => (
                <details className="satset-details" key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <p className="satset-support">{t.faq.support} <a href="/contact">{t.faq.supportLink}<ArrowRight size={16} aria-hidden="true" /></a></p>
          </div>
        </section>
      </main>

      <footer className="satset-footer">
        <div className="satset-container satset-footer-inner">
          <a className="satset-brand" href="#top" aria-label={SATSET_PRODUCT_NAME}><Logo /><BrandName /></a>
          <p>{t.footer.tagline}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">{t.footer.contact} <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </footer>
    </div>
  );
}
