"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/**
 * Wraps a template render for the Invitation Catalog's `?preview=1` iframes.
 *
 * Up to a handful of these previews are live at once on the catalog grid; on
 * mobile their perpetual ambient motion is what re-rasterises the (scaled)
 * iframes every frame and tanks scrolling. This freezes that motion without
 * editing any of the 14 template files:
 *
 * - `MotionConfig reducedMotion="always"` disables framer-motion transform /
 *   layout animations across every template (the dominant motion source).
 * - The scoped stylesheet fast-forwards any infinite CSS keyframe loops a few
 *   templates run (gradient / spin / shimmer / float / glow) to their end frame
 *   in ~0ms and stops them — settling to a static final state rather than
 *   freezing at frame 0, so reveal animations don't get stuck invisible.
 *
 * See ADR 0002.
 */
export function PreviewFreeze({ children }: { children: ReactNode }) {
    // Tell the catalog card (parent window) once this preview has actually
    // painted, so the card reveals the iframe then instead of on the iframe's
    // `onLoad` (which fires before the template has hydrated) — killing the
    // blank-frame flash. Two rAFs wait for a committed paint. See ADR 0002.
    useEffect(() => {
        if (window.parent === window) return;
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                window.parent.postMessage({ type: "invitation-preview-ready" }, "*");
            });
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, []);

    return (
        <MotionConfig reducedMotion="always">
            <style>{`
                [data-invitation-preview] *,
                [data-invitation-preview] *::before,
                [data-invitation-preview] *::after {
                    animation-delay: 0s !important;
                    animation-duration: 0.001ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.001ms !important;
                }
            `}</style>
            <div data-invitation-preview>{children}</div>
        </MotionConfig>
    );
}
