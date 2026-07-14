"use client";

import { useState, type ReactNode } from "react";

/** Top segmented tabs for the event detail screen: at-a-glance essentials
 *  ("Acara") vs the longer manage/work surface ("Kelola"). Server sections are
 *  passed in as rendered nodes. */
export default function EventTabs({ acara, kelola }: { acara: ReactNode; kelola: ReactNode }) {
  const [tab, setTab] = useState<"acara" | "kelola">("acara");
  return (
    <>
      <div className="kk-detail-tabs" role="tablist" aria-label="Bagian acara">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "acara"}
          className="kk-detail-tab"
          data-active={tab === "acara"}
          onClick={() => setTab("acara")}
        >
          Acara
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "kelola"}
          className="kk-detail-tab"
          data-active={tab === "kelola"}
          onClick={() => setTab("kelola")}
        >
          Kelola
        </button>
      </div>
      {/* key remounts on switch so the slide animation replays */}
      <div key={tab} className="kk-tab-view" data-dir={tab === "kelola" ? "right" : "left"}>
        {tab === "acara" ? acara : kelola}
      </div>
    </>
  );
}
