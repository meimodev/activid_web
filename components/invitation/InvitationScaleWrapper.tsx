"use client";

import { ReactNode, useLayoutEffect, useRef, useState } from "react";

type InvitationScaleWrapperProps = {
  children: ReactNode;
};

function readInvitationTargetWidth(): number {
  if (typeof window === "undefined") return 430;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--invitation-mobile-max-width")
    .trim();

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 430;
}

export function InvitationScaleWrapper({ children }: InvitationScaleWrapperProps) {
  const [scale, setScale] = useState(1);
  const [targetWidth, setTargetWidth] = useState(430);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const width = readInvitationTargetWidth();
    setTargetWidth(width);

    const updateScale = () => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const nextScale = Math.min(1, viewportWidth / width);
      setScale(nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      setContentHeight(el.offsetHeight);
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => updateHeight());
    ro.observe(el);
    return () => ro.disconnect();
  }, [targetWidth]);

  return (
    <div
      className="invitation-scale-stage"
      style={{
        width: `${targetWidth * scale}px`,
        height: contentHeight ? `${contentHeight * scale}px` : undefined,
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${targetWidth}px`,
          position: "absolute",
          top: 0,
          left: "50%",
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
