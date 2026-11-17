import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowDownToLine, ArrowRight, Check, ExternalLink } from "lucide-react";
import { COPY, type Lang } from "./copy";
import DocumentLanguage from "./DocumentLanguage";
import FeatureVideo from "./FeatureVideo";
import MobileNavigation from "./MobileNavigation";
import OfflineDemo from "./OfflineDemo";
import SatsetMotion from "./SatsetMotion";
import { SATSET_PRODUCT_NAME } from "./brand";
import { formatRupiah, SATSET_OFFER } from "./offer";

const APK = "/satset/download";
const APK_RELEASE = "https://github.com/meimodev/satset/releases/latest";
const WHATSAPP = "https://wa.me/62881080088816";

// Recordings of the real app, in the order an order travels: table, menu, kitchen, cashier, report.
const FEATURES = ["tables", "ordering", "kitchen", "cashier", "reports"] as const;

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
      <rect width="48" height="48" rx="12" fill="#FFD21A" />
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
  const whatsapp = { href: whatsappHref, target: "_blank", rel: "noopener noreferrer" };
  const price = formatRupiah(SATSET_OFFER.monthlyPrice, lang);

  return (
    <div className="satset-page" lang={lang}>
      <DocumentLanguage lang={lang} />
      <SatsetMotion />
      <header className="satset-header">
        <div className="satset-container satset-header-inner">
          <a className="satset-brand" href="#top" aria-label={SATSET_PRODUCT_NAME}>
            <Logo />
            <BrandName />
          </a>

          <nav className="satset-nav" aria-label={lang === "id" ? "Navigasi utama" : "Main navigation"}>
            <a href="#features">{t.nav.features}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
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
            <a className="satset-button satset-button-small satset-button-primary" {...whatsapp}>
              {t.nav.contact}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="satset-hero" aria-labelledby="satset-hero-title">
          <div className="satset-container satset-hero-grid">
            <h1 id="satset-hero-title">
              <span className="satset-mask"><span>{t.hero.title[0]}</span></span>{" "}
              <span className="satset-mask"><span>{t.hero.title[1]}</span></span>
            </h1>
            <div className="satset-hero-copy">
              <p className="satset-lead">{t.hero.description}</p>
              <div className="satset-actions">
                <a className="satset-button satset-button-primary" {...whatsapp}>
                  {t.hero.contact}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="satset-button satset-button-quiet" href="#features">
                  {t.hero.demo}
                  <ArrowDown size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="satset-note">{t.hero.note}</p>
            </div>
            <div className="satset-hero-visual">
              <Image
                src="/satset/hero-devices.webp"
                alt={t.hero.imageAlt}
                width={1202}
                height={812}
                preload
                fetchPriority="high"
                sizes="(max-width: 899px) 100vw, 58vw"
              />
            </div>
          </div>
        </section>

        <section id="problem" className="satset-section" aria-labelledby="satset-problem-title">
          <div className="satset-container satset-split">
            <div className="satset-heading" data-reveal>
              <h2 id="satset-problem-title">{t.problem.title}</h2>
              <p>{t.problem.description}</p>
            </div>
            <ul className="satset-pains" data-reveal>
              {t.problem.items.map((item) => (
                <li key={item.role}><strong>{item.role}</strong> {item.text}</li>
              ))}
            </ul>
            <p className="satset-turn" data-reveal><span>{t.problem.turn}</span></p>
          </div>
        </section>

        <section id="solution" className="satset-section satset-accent-field" aria-labelledby="satset-solution-title">
          <div className="satset-container satset-split">
            <h2 id="satset-solution-title" data-reveal><span>{t.solution.title}</span></h2>
            <div className="satset-solution-copy" data-reveal>
              <p className="satset-statement">{t.solution.lead}</p>
              {t.solution.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a className="satset-button satset-button-ink" href="#features">
                {t.solution.cta}
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
            <ol className="satset-flow" data-reveal>
              {t.solution.flow.map((role, index) => (
                <li key={role}>
                  <span>{role}</span>
                  {index < t.solution.flow.length - 1 && <i aria-hidden="true"><b /></i>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="satset-section" aria-labelledby="satset-features-title">
          <div className="satset-container">
            <div className="satset-heading" data-reveal>
              <h2 id="satset-features-title">{t.features.title}</h2>
              <p>{t.features.description}</p>
            </div>
            <div className="satset-feature-list">
              {FEATURES.map((id) => {
                const copy = t.features.items[id];
                return (
                  <article className="satset-feature" key={id} data-reveal>
                    <FeatureVideo
                      src={`/satset/features/${id}.mp4`}
                      poster={`/satset/features/${id}.webp`}
                      label={copy.alt}
                      pauseLabel={`${t.features.pause}: ${copy.title}`}
                      playLabel={`${t.features.play}: ${copy.title}`}
                    />
                    <div className="satset-feature-copy">
                      <h3>{copy.title}</h3>
                      <p>{copy.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="satset-actions satset-actions-center" data-reveal>
              <a className="satset-button satset-button-primary" {...whatsapp}>
                {t.features.contact}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="satset-button satset-button-quiet" href="#demo">
                {t.features.demo}
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section id="offline" className="satset-section satset-tone satset-offline" aria-labelledby="satset-offline-title">
          <div className="satset-container satset-split satset-split-even">
            <div className="satset-heading" data-reveal>
              <h2 id="satset-offline-title">{t.offline.title}</h2>
              {t.offline.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div data-reveal><OfflineDemo t={t.offline.demo} /></div>
            <div className="satset-offline-list" data-reveal>
              <h3>{t.offline.listTitle}</h3>
              <ul className="satset-checks">
                {t.offline.items.map((item) => <li key={item}><Check size={20} aria-hidden="true" /><span>{item}</span></li>)}
              </ul>
              <p className="satset-note">{t.offline.note}</p>
            </div>
          </div>
        </section>

        <section id="how" className="satset-section" aria-labelledby="satset-how-title">
          <div className="satset-container">
            <div className="satset-heading" data-reveal>
              <h2 id="satset-how-title">{t.how.title}</h2>
            </div>
            <ol className="satset-steps" data-reveal>
              {t.how.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <p className="satset-turn" data-reveal><span>{t.how.closing}</span></p>
          </div>
        </section>

        <section id="pricing" className="satset-section satset-tone" aria-labelledby="satset-pricing-title">
          <div className="satset-container">
            <div className="satset-heading" data-reveal>
              <h2 id="satset-pricing-title">{t.pricing.title}</h2>
              <p>{t.pricing.description}</p>
            </div>
            <div className="satset-price" data-reveal>
              <div className="satset-price-figures">
                <p className="satset-price-regular">
                  {t.pricing.regularLabel} <s>{formatRupiah(SATSET_OFFER.regularMonthlyPrice, lang)}</s>
                </p>
                <p className="satset-price-promo">
                  <span>{t.pricing.promoLabel}</span>
                  <strong
                    data-count-from={SATSET_OFFER.regularMonthlyPrice}
                    data-count-to={SATSET_OFFER.monthlyPrice}
                    data-locale={lang === "id" ? "id-ID" : "en-US"}
                  >
                    {price}
                  </strong>
                  <span>{t.pricing.period}</span>
                </p>
              </div>
              <div className="satset-price-includes">
                <h3>{t.pricing.includesTitle}</h3>
                <ul className="satset-checks">
                  {t.pricing.includes.map((item) => <li key={item}><Check size={20} aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
                <p className="satset-note">{t.pricing.hardware}</p>
                <a className="satset-button satset-button-primary satset-button-wide" {...whatsapp}>
                  {t.pricing.contact}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="trial" className="satset-section satset-light-field" aria-labelledby="satset-trial-title">
          <div className="satset-container">
            <h2 id="satset-trial-title" data-reveal><span>{t.trial.title}</span></h2>
            <div className="satset-split satset-split-even">
              <div className="satset-trial-offer" data-reveal>
                <p className="satset-trial-days">{t.trial.offer}</p>
                <ol className="satset-week" aria-hidden="true" data-reveal>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => <li key={day}>{day}</li>)}
                </ol>
              </div>
              <div className="satset-trial-copy" data-reveal>
                <p>{t.trial.description}</p>
                <ul className="satset-checks">
                  {t.trial.points.map((point) => <li key={point}><Check size={20} aria-hidden="true" /><span>{point}</span></li>)}
                </ul>
                <div className="satset-actions">
                  <a className="satset-button satset-button-ink" {...whatsapp}>
                    {t.trial.contact}
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                  <a className="satset-button satset-button-quiet" href="#demo">
                    {t.trial.demo}
                    <ArrowDown size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div id="demo" className="satset-demo" data-reveal>
              <div className="satset-demo-intro">
                <h3>{t.demo.title}</h3>
                <p>{t.demo.description}</p>
                <a className="satset-button satset-button-primary" href={APK} download="satset.apk" aria-describedby="satset-download-size">
                  <ArrowDownToLine size={19} aria-hidden="true" />
                  {t.demo.download}
                </a>
                <p id="satset-download-size" className="satset-note">{t.demo.downloadSize} {t.demo.requirement}</p>
                <a className="satset-release-link" href={APK_RELEASE} target="_blank" rel="noopener noreferrer">
                  {t.demo.release} <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="satset-demo-guide">
                <h4>{t.demo.stepsTitle}</h4>
                <ol className="satset-demo-steps">
                  {t.demo.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <details className="satset-details">
                  <summary>{t.demo.accountsTitle}</summary>
                  <div className="satset-details-content">
                    <p>{t.demo.adminLabel}</p>
                    <ul className="satset-account-list">
                      {ADMIN_ACCOUNTS.map((account) => <li key={account}><code>{account}</code></li>)}
                    </ul>
                    <p>{t.demo.passwordLabel}: <code>{ADMIN_PASSWORD}</code></p>
                    <p>{t.demo.staffLabel}</p>
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
                <p className="satset-note">{t.demo.secondPhone}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="satset-section" aria-labelledby="satset-faq-title">
          <div className="satset-container satset-faq">
            <h2 id="satset-faq-title" data-reveal><span>{t.faq.title}</span></h2>
            <div className="satset-faq-list" data-reveal>
              {t.faq.items.map((item) => (
                <details className="satset-faq-item" name="satset-faq" key={item.question}>
                  <summary>{item.question}<i aria-hidden="true" /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="satset-section satset-accent-field satset-final" aria-labelledby="satset-final-title">
          <div className="satset-container">
            <h2 id="satset-final-title" data-reveal><span>{t.final.title}</span></h2>
            <div className="satset-split satset-split-even">
              <div className="satset-solution-copy" data-reveal>
                {t.final.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="satset-solution-copy" data-reveal>
                <a className="satset-button satset-button-ink" {...whatsapp}>
                  {t.final.contact}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <p className="satset-note">{t.final.note}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="satset-footer">
        <div className="satset-container satset-footer-inner">
          <a className="satset-brand" href="#top" aria-label={SATSET_PRODUCT_NAME}><Logo /><BrandName /></a>
          <p>{t.footer.tagline}</p>
          <Link href="/">{t.footer.maker} <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </footer>
    </div>
  );
}
