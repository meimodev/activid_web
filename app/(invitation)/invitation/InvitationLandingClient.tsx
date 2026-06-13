"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  getInvitationTemplateThemes,
  INVITATION_TEMPLATE_LISTINGS,
  type InvitationTemplateListing,
} from "@/data/invitation-templates";
import { DateTime } from "luxon";
import { getExampleInvitations } from "./actions";

const DEFAULT_WHATSAPP_NUMBER = "62881080088816";

// Max number of cards allowed to hold a live preview iframe at once. See ADR 0002.
const MAX_LIVE_PREVIEWS = 4;

const invitationTestimonials = [
  {
    quote: "Sumpah bagus banget hasilnya! Banyak temen yang nanya bikin di mana karena desainnya unik dan elegan. Adminnya juga fast respon banget pas minta revisi.",
    author: "Rizka & Dika",
    role: "Pernikahan, Nov 2025"
  },
  {
    quote: "Gampang banget dipakenya, tamu juga pada bilang RSVP-nya praktis. Pilihan lagunya banyak dan bisa nyesuaiin sama tema acara kita. Recommended pokoknya!",
    author: "Sarah & Kevin",
    role: "Pernikahan, Jan 2026"
  },
  {
    quote: "Puas banget sama fitur custom-nya. Semua request detail dari warna sampai animasi bener-bener diwujudin. Harga juga sangat bersahabat buat kualitas premium.",
    author: "Nadya & Tommy",
    role: "Pernikahan, Mar 2026"
  },
  {
    quote: "Keren pol! Gak nyesel pilih Activid. Testimonial beneran karena emang se-smooth itu transisinya pas di-scroll.",
    author: "Budi & Tari",
    role: "Pernikahan, Mei 2026"
  },
  {
    quote: "Bikin undangan ulang tahun anak super praktis. Desainnya lucu-lucu banget dan responsif di berbagai ukuran layar HP.",
    author: "Mama Kenzie",
    role: "Ulang Tahun, Feb 2026"
  }
];

type TestimonialData = (typeof invitationTestimonials)[number];

function TestimonialCard({
  item,
  compact = false,
}: {
  item: TestimonialData;
  compact?: boolean;
}) {
  return (
    <div
      className={`shrink-0 rounded-2xl bg-white/5 border flex flex-col justify-between gap-4 ${compact
        ? "w-[240px] p-4 border-white/5"
        : "w-[280px] sm:w-[320px] p-5 border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition-colors"
        }`}
    >
      <p
        className={`leading-relaxed italic ${compact
          ? "text-xs text-white/70 line-clamp-3"
          : "text-sm text-indigo-100/80"
          }`}
      >
        &ldquo;{item.quote}&rdquo;
      </p>
      <div
        className={`flex items-center gap-2 ${compact ? "mt-3 pt-3 border-t border-white/5" : "mt-2"
          }`}
      >
        <div
          className={`rounded-full bg-linear-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-indigo-200 font-bold shrink-0 border border-white/10 ${compact ? "w-6 h-6 text-[10px]" : "w-10 h-10 text-sm"
            }`}
        >
          {item.author.charAt(0)}
        </div>
        <div className={compact ? "min-w-0" : ""}>
          <p
            className={`font-bold text-white ${compact ? "text-[11px] truncate" : "text-sm"
              }`}
          >
            {item.author}
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isVisible,
  isViewed,
  isLive,
  scrollIdle,
  visibleIndex,
  onPreview,
  onOrder,
  onRequestLive,
  onReleaseLive,
  previewMap = {},
}: {
  template: InvitationTemplateListing;
  isVisible: boolean;
  isViewed: boolean;
  isLive: boolean;
  scrollIdle: boolean;
  visibleIndex: number;
  onPreview: (template: InvitationTemplateListing) => void;
  onOrder: (template: InvitationTemplateListing) => void;
  onRequestLive: (id: string) => void;
  onReleaseLive: (id: string) => void;
  previewMap?: Record<string, string[]>;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 375, height: 468, scale: 0.5 });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [actualGeneratedSlug, setActualGeneratedSlug] = React.useState<string | undefined>(undefined);

  // Only the cards closest to the viewport hold a live iframe (capped by the
  // parent). Everything else falls back to the placeholder. The initial mount
  // is deferred until the page stops scrolling (`scrollIdle`) so booting a full
  // invitation app in the iframe never blocks the main thread mid-scroll; once
  // an iframe is loaded it stays mounted through subsequent scrolling (the
  // `|| isLoaded` guard) to avoid teardown/reload churn. See ADR 0002.
  const shouldMount = isIntersecting && isLive && (scrollIdle || isLoaded);

  // Pick a random generated slug on mount (inside useEffect to prevent React Hydration mismatch)
  const slugsList = previewMap[template.templateId] || [];
  React.useEffect(() => {
    if (slugsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * slugsList.length);
      setActualGeneratedSlug(slugsList[randomIndex]);
    }
  }, [slugsList]);

  // IntersectionObserver to lazy-load the iframe only when card is close to viewport
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: "200px" } // trigger slightly before it enters the viewport
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ResizeObserver to calculate dynamic scale coefficient to perfectly fit aspect ratio
  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width || containerRef.current.clientWidth;
        const containerHeight = rect.height || containerRef.current.clientHeight;
        const iframeWidth = 375; // Standard mobile preview width
        const iframeHeight = iframeWidth * (containerHeight / (containerWidth || 1) || 1.25);
        const scale = containerWidth / iframeWidth;
        setDimensions({ width: iframeWidth, height: iframeHeight, scale });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Request a live-iframe slot while on-screen; release it (unmounting the
  // iframe) once scrolled away so live previews never accumulate. See ADR 0002.
  React.useEffect(() => {
    if (isIntersecting) {
      onRequestLive(template.id);
    } else {
      onReleaseLive(template.id);
    }
  }, [isIntersecting, template.id, onRequestLive, onReleaseLive]);

  // When the iframe is torn down (slot lost or scrolled away), reset the loaded
  // state so the shimmer placeholder shows again on the next mount.
  React.useEffect(() => {
    if (!shouldMount) {
      setIsLoaded(false);
    }
  }, [shouldMount]);

  // Determine actual generated invitation preview or fall back to template demo layout
  const firstTheme = getInvitationTemplateThemes(template.templateId)[0]?.id ?? "";
  const defaultPurpose =
    template.templateId === "kids-birthday" ||
    template.templateId === "comic-book" ||
    template.templateId === "arcade-retro"
      ? "birthday"
      : "marriage";

  const iframeUrl = actualGeneratedSlug
    ? `/invitation/${actualGeneratedSlug}`
    : `/invitation/${template.id}?theme=${firstTheme}&purpose=${defaultPurpose}&preview=1`;

  return (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: Math.max(0, visibleIndex % 10) * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      // content-visibility:auto lets the browser skip layout/paint/compositing
      // for cards (and their preview iframes) that are off-screen, so only the
      // 1-2 cards actually in view composite while scrolling. The intrinsic size
      // keeps the scrollbar/grid stable for the skipped cards. See ADR 0002.
      style={{
        display: isVisible ? undefined : 'none',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 420px',
      } as React.CSSProperties}
      className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#0d0d1f] border transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.25)] hover:-translate-y-1 ${
        isViewed
          ? "border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
          : "border-white/5 hover:border-indigo-500/40"
      }`}
    >
      <div className="flex flex-col h-full w-full">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreview(template);
          }}
          className="aspect-square sm:aspect-[4/5] overflow-hidden relative text-left w-full"
          aria-label={`Lihat template ${template.title}`}
        >
          <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#05050d] z-0">
            {/* Elegant shimmer & loading wheel while lazy-loading iframe */}
            {(!shouldMount || !isLoaded) && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d1f] z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full"
                />
              </div>
            )}

            {shouldMount && (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                onLoad={() => setIsLoaded(true)}
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `scale(${dimensions.scale})`,
                  transformOrigin: "top left",
                  opacity: isLoaded ? 1 : 0,
                }}
                className="border-0 pointer-events-none absolute top-0 left-0 transition-opacity duration-700"
                loading="lazy"
                scrolling="no"
              />
            )}
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-[#020205] via-transparent to-transparent opacity-60 transition-all z-10 pointer-events-none" />

          {/* Overlay Content */}
          {isViewed && (
            <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-100 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md z-20 pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-green-400" />
              Viewed
            </div>
          )}
        </button>

        <div className="flex flex-col p-2.5 sm:p-3 bg-black/40 max-sm:bg-black/70 backdrop-blur-md max-sm:backdrop-blur-none border-t border-white/5 gap-2 relative z-20">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-xs sm:text-sm font-bold tracking-tight truncate transition-colors ${isViewed ? "text-green-100/90" : "text-white group-hover:text-indigo-200"}`}>
              {template.title}
            </h3>
            <div className="text-[11px] sm:text-xs font-black text-white shrink-0">
              {template.priceDiscount}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(template);
              }}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-colors"
            >
              Lihat
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOrder(template);
              }}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-100 text-[10px] font-bold uppercase tracking-wider hover:bg-green-500/20 transition-colors"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function InvitationLandingClient({
  affiliateWhatsappNumber,
  previewMap = {},
}: {
  affiliateWhatsappNumber?: string;
  previewMap?: Record<string, string[]>;
}) {
  // Demo Data as requested
  const templates = INVITATION_TEMPLATE_LISTINGS;
  type TemplateListing = (typeof templates)[number];

  const [viewedTemplates, setViewedTemplates] = React.useState<string[]>([]);
  const [selectedThemeByTemplateId, setSelectedThemeByTemplateId] = React.useState<
    Record<string, string>
  >({});

  const [previewTemplate, setPreviewTemplate] = React.useState<TemplateListing | null>(null);
  const [templateExamples, setTemplateExamples] = React.useState<Array<{ slug: string; title: string }>>([]);
  const [examplesLoading, setExamplesLoading] = React.useState(false);

  React.useEffect(() => {
    if (!previewTemplate) {
      setTemplateExamples([]);
      return;
    }

    setExamplesLoading(true);
    getExampleInvitations(previewTemplate.templateId)
      .then((res) => {
        setTemplateExamples(res || []);
      })
      .catch((e) => {
        console.error("Failed to fetch template examples:", e);
      })
      .finally(() => {
        setExamplesLoading(false);
      });
  }, [previewTemplate]);

  const [previewPurpose, setPreviewPurpose] = React.useState<"marriage" | "birthday" | "event">(
    "marriage",
  );
  const [previewThemeId, setPreviewThemeId] = React.useState<string>("");
  const [customConfirmOpen, setCustomConfirmOpen] = React.useState(false);
  const [showHeroDialog, setShowHeroDialog] = React.useState(true);
  const [filterPurpose, setFilterPurpose] = React.useState<"all" | "marriage" | "birthday" | "event">("all");

  const filteredTemplates = React.useMemo(() => {
    if (filterPurpose === "all") return templates;
    if (filterPurpose === "birthday") return templates.filter(t => t.templateId === "kids-birthday" || t.templateId === "comic-book" || t.templateId === "arcade-retro");
    return templates.filter(t => t.templateId !== "kids-birthday" && t.templateId !== "comic-book" && t.templateId !== "arcade-retro");
  }, [filterPurpose, templates]);

  React.useEffect(() => {
    const stored = localStorage.getItem("activid_viewed_templates");
    if (stored) {
      setViewedTemplates(JSON.parse(stored));
    }
  }, []);

  React.useEffect(() => {
    const anyDialogOpen = Boolean(previewTemplate) || customConfirmOpen || showHeroDialog;
    if (!anyDialogOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showHeroDialog) { setShowHeroDialog(false); return; }
        setPreviewTemplate(null);
        setCustomConfirmOpen(false);
      }
    };

    const onScroll = () => {
      if (showHeroDialog) {
        setShowHeroDialog(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    if (showHeroDialog) {
      window.addEventListener("wheel", onScroll, { passive: true });
      window.addEventListener("touchmove", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      document.body.style.overflow = previousOverflow;
    };
  }, [customConfirmOpen, previewTemplate, showHeroDialog]);

  // Cap how many cards hold a live iframe at once. Cards request a slot when
  // they enter the viewport and release it when they leave; once the cap is
  // exceeded the oldest live preview (furthest behind the scroll) is evicted.
  // See ADR 0002.
  const [livePreviewIds, setLivePreviewIds] = React.useState<string[]>([]);

  const requestLivePreview = React.useCallback((id: string) => {
    setLivePreviewIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      return next.length > MAX_LIVE_PREVIEWS
        ? next.slice(next.length - MAX_LIVE_PREVIEWS)
        : next;
    });
  }, []);

  const releaseLivePreview = React.useCallback((id: string) => {
    setLivePreviewIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev));
  }, []);

  // Track whether the page is actively scrolling. New iframes only mount once
  // this settles, so a full invitation app never boots mid-scroll. State flips
  // just twice per scroll burst (start + 150ms-after-stop) — guarded by a ref —
  // to keep the listener cheap. See ADR 0002.
  const [scrollIdle, setScrollIdle] = React.useState(true);
  const scrollingRef = React.useRef(false);
  React.useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setScrollIdle(false);
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        scrollingRef.current = false;
        setScrollIdle(true);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  const handleView = (id: string) => {
    if (!viewedTemplates.includes(id)) {
      const updated = [...viewedTemplates, id];
      setViewedTemplates(updated);
      localStorage.setItem("activid_viewed_templates", JSON.stringify(updated));
    }
  };

  const openPreviewDialog = (template: TemplateListing) => {
    const themes = getInvitationTemplateThemes(template.templateId);
    const nextThemeId = selectedThemeByTemplateId[template.templateId] ?? themes[0]?.id ?? "";
    const nextPurpose = template.templateId === "kids-birthday" || template.templateId === "comic-book" || template.templateId === "arcade-retro" ? "birthday" : "marriage";
    setPreviewThemeId(nextThemeId);
    setPreviewPurpose(nextPurpose);
    setPreviewTemplate(template);
  };

  const whatsappNumberForLeads = affiliateWhatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  const createWhatsAppUrl = (message: string) =>
    `https://wa.me/${whatsappNumberForLeads}?text=${encodeURIComponent(message)}`;

  const createWhatsAppUrlForMarkas = (message: string) =>
    `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const customWhatsappMessage =
    "[INV] Halo activid 👋\n\nMau bikin undangan digital *custom* ✨\n\nProses custom itu lumayan detail (dan agak \"ribet\" juga 😅)\nKarena akan   mengikuti kebutuhan \ndari konsep besar sampai elemen yang kecil-kecil 🤍\n\nUntuk bisa mulai prosesnya pembuatan undangan *custom*, \nAkan dikenakan biaya buat booking slot & mulai diskusi konsep/moodboard senilai Rp. 200.000 sebagai Down Payment / Uang Muka dari Total harga undangan custom dimulai dari Rp500.000\n(tapi tergantung tingkat kompleksitasnya sesuai yang akan dibicarakan nanti).\n\nUang Muka yang sudah dibayar *TIDAK BISA DIKEMBALIKAN* 🙏🏻 apabila pelanggan membatalkan pemesanan undangan *custom* karena telah dihitung sebagai jasa konsultasi langsung ke tim developer 🙏🏻 \n\nSilahkan menunggu sebentar untuk konfirmasi lebih lanjut 😊";

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Deep Space Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020205_60%)]" />

        {/* Static Nebulas — large blurred surfaces are painted once, never
            animated, to avoid per-frame re-rasterisation on mobile. See ADR 0002. */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen opacity-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen opacity-30" />

        {/* Passing Meteor (decorative; disabled under prefers-reduced-motion) */}
        <motion.div
          initial={{ left: "-10%", top: "10%" }}
          animate={{ left: "120%", top: "30%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "linear",
          }}
          className="absolute w-64 h-[2px] bg-linear-to-r from-transparent via-cyan-200 to-transparent rotate-12 blur-[1px]"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md max-sm:backdrop-blur-none bg-black/20 max-sm:bg-[#05050d]/90 border-b border-white/5 sticky top-0 z-50 supports-backdrop-filter:bg-black/10">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 rounded-full border border-indigo-500/50 border-t-white"
            />
            <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent flex items-center gap-2.5">
              Template Undangan
              <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 font-medium tracking-normal whitespace-nowrap">
                {filteredTemplates.length}
              </span>
            </span>
          </div>

          {!showHeroDialog && (
            <motion.button
              type="button"
              onClick={() => setShowHeroDialog(true)}
              className="relative group h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-colors"
              aria-label="Tampilkan info"
              title="Info"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Aggressive Ripple Effects for high attention */}
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/60 pointer-events-none"
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-indigo-500/60 pointer-events-none"
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
              />

              {/* Strong pulsing solid background restricted only for the star icon */}
              <motion.div
                className="absolute w-4 h-4 rounded-full pointer-events-none"
                animate={{
                  boxShadow: ["0 0 0px rgba(56,189,248,0)", "0 0 15px rgba(56,189,248,0.8)"],
                  backgroundColor: ["rgba(79,70,229,0.2)", "rgba(79,70,229,0.8)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              />

              {/* Rotating and glowing star */}
              <motion.div
                animate={{
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.2, 1, 1.2, 1],
                  filter: [
                    "drop-shadow(0 0 2px rgba(167,139,250,0.4))",
                    "drop-shadow(0 0 8px rgba(56,189,248,0.8))",
                    "drop-shadow(0 0 2px rgba(167,139,250,0.4))",
                    "drop-shadow(0 0 8px rgba(56,189,248,0.8))",
                    "drop-shadow(0 0 2px rgba(167,139,250,0.4))"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative z-10 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </motion.div>
            </motion.button>
          )}
        </nav>

        {/* Purpose Filter */}
        <div className="sticky top-[72px] z-40 py-4 px-4 flex justify-center w-full pointer-events-none">
          <div className="flex flex-wrap justify-center items-center gap-1.5 p-1.5 rounded-3xl bg-white/[0.03] max-sm:bg-[#0a0a17]/95 backdrop-blur-xl max-sm:backdrop-blur-none border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] pointer-events-auto max-w-3xl">
            {([
              { key: "all", label: "Semua" },
              { key: "marriage", label: "Pernikahan" },
              { key: "birthday", label: "Ulang Tahun" },
              { key: "event", label: "Acara / Syukuran" },
            ] as const).map(({ key, label }) => {
              const isActive = filterPurpose === key;
              return (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterPurpose(key)}
                  className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors z-10 ${isActive ? "text-white" : "text-white/50 hover:text-white/90"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="absolute inset-0 bg-indigo-500/20 border border-indigo-400/40 rounded-full shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isActive && (
                      <motion.span
                        layoutId="activeFilterDot"
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Template Catalog */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-24 relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {templates.map((template) => {
              const isVisible = filteredTemplates.some(t => t.id === template.id);
              const isViewed = viewedTemplates.includes(template.id);
              const visibleIndex = filteredTemplates.findIndex(t => t.id === template.id);

              return (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isVisible={isVisible}
                  isViewed={isViewed}
                  isLive={livePreviewIds.includes(template.id)}
                  scrollIdle={scrollIdle}
                  visibleIndex={visibleIndex}
                  onPreview={openPreviewDialog}
                  onOrder={(t) => window.open(createWhatsAppUrl(`INV-${t.templateId}-order`), "_blank", "noopener,noreferrer")}
                  onRequestLive={requestLivePreview}
                  onReleaseLive={releaseLivePreview}
                  previewMap={previewMap}
                />
              );
            })}
          </div>
        </section>

        {/* Custom Invitation */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.button
              type="button"
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCustomConfirmOpen(true);
              }}
              aria-label="Buat undangan custom via WhatsApp"
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-300/30 bg-[#0B0B14] text-left transition-all duration-500 hover:-translate-y-1 hover:border-amber-200/60 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)] w-full"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(251,191,36,0.1),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(251,191,36,0.05),transparent_50%)]" />

              <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-100 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.55)]" />
                    Custom Design
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
                    Punya Desain Impian Sendiri?
                  </h3>

                  <p className="text-sm text-amber-100/70 leading-relaxed max-w-md">
                    Bebas request tema, warna, animasi, dan fitur. Kami wujudkan undangan digital yang 100% personal untuk momen bahagiamu.
                  </p>

                  <div className="mt-4 flex flex-wrap items-baseline gap-2">
                    <span className="text-lg font-bold text-white">Mulai Rp 500.000</span>
                    <span className="text-xs text-white/40">(DP Rp 200.000)</span>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <div className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-100 text-sm font-bold tracking-wide group-hover:bg-amber-500/25 group-hover:border-amber-400/70 transition-colors">
                    ✨ Chat Sekarang
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-2xl font-black tracking-tight">Testimony</h2>
          </div>
          <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex gap-4 w-max pr-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ willChange: "transform" }}
            >
              {[...invitationTestimonials, ...invitationTestimonials].map((item, i) => (
                <TestimonialCard key={`${item.author}-${i}`} item={item} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              Transmisi Informasi
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
              Sinyal Bantuan
            </h2>

          </motion.div>

          <div className="space-y-3">
            {([
              {
                q: "Apa itu Activid Invitation?",
                a: "Undangan MODEREN CANGGIH berbasis website yang bisa disebar via link. Tamu bisa langsung buka tanpa perlu aplikasi, lengkap dengan musik, foto, ucapan dan banyak fitur lainnya.",
              },
              {
                q: "Berapa lama proses pengerjaannya?",
                a: "Hanya beberapa menit saja dari konfirmasi terakhir pelanggan.",
              },
              {
                q: "Berapa lama masa aktif undangan?",
                a: "Undanganmu akan terus mengorbit dan bisa diakses SELAMANYA! .",
              },
              {
                q: "Apakah ada fasilitas revisi?",
                a: "Tentu! Kamu mendapat gratis 1x revisi untuk penyesuaian data (teks, ganti lagu, penyesuaian foto), untuk penyesuaian selain data bisa sepuasnya dengan Rp. 25.000 per revisi.",
              },
              {
                q: "Bisa mengikuti tema / desain impian sendiri ?",
                a: "Sangat bisa. Kami menyediakan layanan Custom Invitation untuk wujudkan desain antarmuka eksklusif yang benar-benar special khusus buat pelanggan.",
              },
            ]).map((faq, idx) => {
              const [open, setOpen] = React.useState(false);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="group w-full text-left rounded-2xl border border-white/5 bg-white/[0.02] max-sm:bg-white/[0.04] backdrop-blur-xl max-sm:backdrop-blur-none p-5 sm:p-6 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_20px_-10px_rgba(79,70,229,0.3)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black tracking-widest text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                            {(idx + 1).toString().padStart(2, "0")}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white/90 group-hover:text-white transition-colors">
                            {faq.q}
                          </h3>
                        </div>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="mt-3 text-sm text-indigo-100/60 leading-relaxed pl-7">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${open
                          ? "rotate-45 border-indigo-400/50 bg-indigo-500/10 text-indigo-300"
                          : "border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white/60"
                          }`}
                      >
                        <span className="text-sm font-light leading-none mb-0.5">+</span>
                      </span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            window.open(
              createWhatsAppUrl("[INV] Halo mau informasi tentang, "),
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 max-sm:bg-black/80 backdrop-blur-md max-sm:backdrop-blur-none border border-white/10 shadow-[0_0_40px_-12px_rgba(34,197,94,0.55)] hover:shadow-[0_0_55px_-12px_rgba(34,211,238,0.5)] transition-shadow"
          aria-label="Buka WhatsApp untuk konsultasi"
        >
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-green-400/20 via-emerald-400/10 to-cyan-400/15 border border-white/10">
            <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.25),transparent_60%)]" />
            <span className="relative text-sm font-black tracking-tight text-white">
              🚀
            </span>
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-xs font-black uppercase tracking-wider text-white">
              WhatsApp
            </span>
            <span className="text-[11px] text-indigo-200/70 font-mono">
              Konsultasi
            </span>
          </span>
          <span className="ml-1 text-white/70">→</span>
        </motion.button>

        <section className="max-w-7xl mx-auto w-full px-6 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 max-sm:bg-black/60 backdrop-blur-md max-sm:backdrop-blur-none"
          >
            {/* Static blurred accents — painted once, not animated. See ADR 0002. */}
            <div
              aria-hidden
              className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-indigo-600/15 blur-[110px] mix-blend-screen opacity-60"
            />
            <div
              aria-hidden
              className="absolute -bottom-40 -left-20 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen opacity-50"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-25"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.16), transparent 50%), radial-gradient(circle at 50% 90%, rgba(168,85,247,0.14), transparent 55%)",
              }}
            />

            <div className="relative p-10">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-200/80"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                  Konsultasi antariksa
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.05 }}
                  viewport={{ once: true }}
                  className="mt-6 text-3xl font-black tracking-tight"
                >
                  Siap meluncurkan undanganmu?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.12 }}
                  viewport={{ once: true }}
                  className="mt-4 text-indigo-200/70 text-base leading-relaxed"
                >
                  Untuk tanya-tanya bisa klik tombol di bawah yaaa
                </motion.p>

                <div className="mt-8 flex flex-col gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      window.open(
                        createWhatsAppUrl("INV tolong informasi tentang: "),
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-green-500/15 border border-green-500/40 text-green-100 font-bold tracking-wide hover:bg-green-500/25 hover:border-green-400/70 transition-colors"
                  >
                    Sambungkan Stasiun
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/5 relative z-10">
          <div className="relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 10% 20%, rgba(79,70,229,0.18), transparent 55%), radial-gradient(circle at 90% 30%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(circle at 50% 95%, rgba(168,85,247,0.12), transparent 55%)",
              }}
            />
            <div className="relative max-w-7xl mx-auto px-6 py-12">
              <div className="flex flex-col gap-10">
                <div className="max-w-md">
                  <div className="text-lg font-black tracking-tight">
                    <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                      Activid<span className="text-indigo-500">.</span>
                      Invitation
                    </span>
                  </div>
                  <div className="text-sm font-medium tracking-tight">
                    <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                      Dikirim semesta, beritakan kabar gembiramu
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div>
                    <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                      Navigasi
                    </div>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <Link
                        href="https://www.activid.id"
                        target="_blank"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Kembali ke kapal induk
                      </Link>
                      <Link
                        href="/invitation"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Template Misi
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                      Kontak
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          window.open(
                            createWhatsAppUrlForMarkas("INV tolong informasi tentang: "),
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/40 text-green-100 text-xs font-bold uppercase tracking-wider hover:bg-green-500/25 hover:border-green-400/70 transition-colors"
                      >
                        Hubungi Markas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center justify-between gap-3 text-xs font-mono text-indigo-500/35">
                <p>
                  TRANSMISSION END // ACTIVID.ID // {DateTime.now().year}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {previewTemplate ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Preview invitation demo"
          onClick={() => setPreviewTemplate(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[720px] rounded-3xl border border-white/10 bg-[#05050d]/95 p-5 sm:p-6 shadow-[0_35px_120px_-30px_rgba(0,0,0,0.75)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-indigo-200/60">
                  Demo preview
                </div>
                <div className="mt-2 truncate text-lg font-black tracking-tight text-white">
                  {previewTemplate.title}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-6">
              {previewTemplate.templateId === "kids-birthday" || previewTemplate.templateId === "comic-book" || previewTemplate.templateId === "arcade-retro" ? (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
                    Purpose
                  </div>
                  <div className="mt-3 inline-flex items-center rounded-2xl border border-pink-300/30 bg-pink-400/10 px-4 py-3 text-xs font-black uppercase tracking-wide text-pink-100">
                    Ulang Tahun Anak
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
                    Purpose
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(
                      [
                        { key: "marriage", label: "Pernikahan" },
                        { key: "birthday", label: "Ulang Tahun" },
                        { key: "event", label: "Acara" },
                      ] as const
                    ).map((opt) => {
                      const isActive = previewPurpose === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setPreviewPurpose(opt.key)}
                          className={
                            "min-w-0 w-full rounded-2xl border px-2.5 py-2 text-xs font-black uppercase tracking-wide transition-colors whitespace-normal break-words text-center leading-tight " +
                            (isActive
                              ? "border-indigo-300/70 bg-white/5 text-white ring-4 ring-indigo-600/30"
                              : "border-white/10 bg-white/0 text-white/80 hover:bg-white/5 hover:border-white/25")
                          }
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
                  Color combinations
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {getInvitationTemplateThemes(previewTemplate.templateId).map((theme) => {
                    const isActive = previewThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setPreviewThemeId(theme.id);
                          setSelectedThemeByTemplateId((prev) => ({
                            ...prev,
                            [previewTemplate.templateId]: theme.id,
                          }));
                        }}
                        className={
                          "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors " +
                          (isActive
                            ? "border-indigo-300/70 bg-white/5 ring-4 ring-indigo-600/30"
                            : "border-white/10 bg-white/0 hover:bg-white/5 hover:border-white/25")
                        }
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-white">
                            {theme.title}
                          </span>
                          <span className="mt-1 block truncate text-[11px] font-mono text-white/45">
                            {theme.mainColor} / {theme.accentColor}
                          </span>
                        </span>

                        <span className="flex shrink-0 items-center gap-2">
                          <span className="flex items-center overflow-hidden rounded-full border border-white/10">
                            <span
                              aria-hidden
                              className="h-5 w-5"
                              style={{ backgroundColor: theme.mainColor }}
                            />
                            <span
                              aria-hidden
                              className="h-5 w-5"
                              style={{ backgroundColor: theme.accentColor }}
                            />
                          </span>
                          {isActive ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-black text-indigo-200">
                              ✓
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-world Example Invitations List */}
              {(examplesLoading || templateExamples.length > 0) && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
                    Contoh Undangan Nyata
                  </div>
                  {examplesLoading ? (
                    <div className="mt-3 grid gap-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-[62px] rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between px-4 animate-pulse"
                        >
                          <div className="space-y-2 w-1/2">
                            <div className="h-3.5 bg-white/10 rounded-sm w-3/4" />
                            <div className="h-2.5 bg-white/5 rounded-sm w-1/2" />
                          </div>
                          <div className="w-24 h-6 bg-white/10 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                      {templateExamples.map((inv) => (
                        <a
                          key={inv.slug}
                          href={`/invitation/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-400/40 px-4 py-3 text-left transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-black text-white">
                              {inv.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] font-mono text-green-400/70">
                              /{inv.slug}
                            </span>
                          </span>
                          <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-100 text-[9px] font-bold uppercase tracking-wider">
                            Buka Undangan 🚀
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/0 px-4 py-3 text-xs font-black uppercase tracking-wider text-white/80 hover:bg-white/5 hover:border-white/25 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!previewThemeId) return;
                  handleView(previewTemplate.id);
                  const url = `/invitation/${previewTemplate.id}?theme=${encodeURIComponent(
                    previewThemeId,
                  )}&purpose=${encodeURIComponent(
                    previewTemplate.templateId === "kids-birthday" || previewTemplate.templateId === "comic-book" || previewTemplate.templateId === "arcade-retro" ? "birthday" : previewPurpose,
                  )}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                  setPreviewTemplate(null);
                }}
                disabled={!previewThemeId}
                className="inline-flex items-center justify-center rounded-2xl border border-indigo-400/50 bg-linear-to-r from-indigo-500/15 via-purple-500/10 to-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-wider text-indigo-100 hover:bg-indigo-500/20 hover:border-indigo-300/70 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Preview demo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {customConfirmOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Konfirmasi biaya custom"
          onClick={() => setCustomConfirmOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[640px] rounded-3xl border border-white/10 bg-[#05050d]/95 p-5 sm:p-6 shadow-[0_35px_120px_-30px_rgba(0,0,0,0.75)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-200/60">
                  Konfirmasi
                </div>
                <div className="mt-2 truncate text-lg font-black tracking-tight text-white">
                  Sebelum lanjut ke WhatsApp
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCustomConfirmOpen(false)}
                className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 text-sm leading-relaxed text-white/80">
              <p className="rounded-2xl border border-amber-300/20 bg-amber-400/5 p-4">
                Akan dikenakan biaya buat booking slot diskusi konsep senilai Rp. 200.000 yang juga akan dihitung sebagai{" "}
                <em>Down Payment</em> atau uang muka dari total harga undangan nanti.
              </p>
              <p className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                Uang Muka yang sudah dibayar <strong>TIDAK BISA DIKEMBALIKAN</strong> 🙏🏻 apabila pelanggan membatalkan pemesanan undangan{" "}
                <em>custom</em> karena telah dihitung sebagai jasa konsultasi langsung ke tim developer 🙏🏻
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomConfirmOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/0 px-4 py-3 text-xs font-black uppercase tracking-wider text-white/80 hover:bg-white/5 hover:border-white/25 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    createWhatsAppUrl(customWhatsappMessage),
                    "_blank",
                    "noopener,noreferrer",
                  );
                  setCustomConfirmOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-amber-300/40 bg-linear-to-r from-amber-500/15 via-amber-400/10 to-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-wider text-amber-100 hover:bg-amber-500/20 hover:border-amber-200/70 transition-colors"
              >
                Lanjut ke WhatsApp
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {showHeroDialog ? (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Tentang Activid Invitation"
            onClick={() => setShowHeroDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    when: "beforeChildren",
                    staggerChildren: 0.1,
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.95,
                  transition: {
                    duration: 0.3,
                    when: "afterChildren",
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
              className="relative w-full max-w-[480px] rounded-3xl border border-white/10 bg-[#05050d]/95 pt-8 pb-0 shadow-[0_35px_120px_-30px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowHeroDialog(false)}
                className="absolute top-4 right-4 h-10 w-10 z-10 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
                aria-label="Tutup"
              >
                ×
              </button>

              <div className="text-center space-y-6 px-6 sm:px-8 shrink-0">
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  Premium Digital Invitation
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }}>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                    Sebar Undangan{" "}
                    <span className="block mt-1 bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-1">
                      Nggak Pake Ribet.
                    </span>
                  </h1>
                </motion.div>

                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }} className="text-sm text-white/60 leading-relaxed px-2 sm:px-4">
                  Pilih desain impianmu, isi detail acara, dan undangan digital elegan siap disebar ke seluruh tamu dalam hitungan menit.
                </motion.p>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }} className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHeroDialog(false)}
                    className="w-full relative group overflow-hidden rounded-2xl bg-white text-black px-6 py-4 text-sm font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Lihat Koleksi Desain
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-200 via-purple-200 to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
              </div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }} className="mt-8 border-t border-white/10 pt-6 pb-6 bg-white/[0.02]">

                <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <motion.div
                    className="flex gap-3 w-max pr-3"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ willChange: "transform" }}
                  >
                    {invitationTestimonials.map((item, i) => (
                      <TestimonialCard key={`hero-testi-${item.author}-${i}`} item={item} compact />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmer {
          from {
            background-position: 0% 0%;
          }
          to {
            background-position: -200% -200%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[shimmer_2s_infinite\\],
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
    </MotionConfig>
  );
}
