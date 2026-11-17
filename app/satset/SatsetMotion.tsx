"use client";

import { useEffect } from "react";

// Counts the price down from the regular to the offer figure; the server-rendered text is already the final price.
function countDown(element: HTMLElement) {
  const from = Number(element.dataset.countFrom);
  const to = Number(element.dataset.countTo);
  const format = new Intl.NumberFormat(element.dataset.locale);
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / 1400, 1);
    const eased = 1 - (1 - progress) ** 3;
    const value = progress < 1 ? Math.round((from + (to - from) * eased) / 1000) * 1000 : to;
    element.textContent = `Rp${format.format(value)}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// One observer for the whole page. Without script nothing is hidden: the
// hidden states in satset.css only apply once `data-motion` is set here.
export default function SatsetMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".satset-page");
    if (!page) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    page.dataset.motion = "";

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        element.dataset.inview = "";
        if (element.dataset.countFrom && !reduced) countDown(element);
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    page.querySelectorAll("[data-reveal], [data-count-from]").forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      delete page.dataset.motion;
    };
  }, []);

  return null;
}
