"use client";

import { useEffect, useRef, useState } from "react";
import type { COPY, Lang } from "./copy";

// The page's one live thing: switch the internet off and the outlet's devices stay connected.
export default function OfflineDemo({ t }: { t: (typeof COPY)[Lang]["offline"]["demo"] }) {
  const figure = useRef<HTMLElement>(null);
  const touched = useRef(false);
  const [online, setOnline] = useState(true);

  // Cut the internet once, shortly after the diagram scrolls in, unless the visitor got there first.
  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => { if (!touched.current) setOnline(false); }, 1100);
    }, { threshold: 0.6 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <figure className="satset-net" ref={figure} data-online={online} data-ui>
      <div className="satset-net-internet">
        <span id="satset-net-label">{t.internet}</span>
        <span className="satset-net-state">{online ? t.on : t.off}</span>
        <button
          type="button"
          role="switch"
          className="satset-switch"
          aria-checked={online}
          aria-labelledby="satset-net-label"
          onClick={() => {
            touched.current = true;
            setOnline(!online);
          }}
        >
          <span />
        </button>
      </div>
      <div className="satset-net-uplink" aria-hidden="true"><i /></div>
      <div className="satset-net-router">
        <strong>{t.router}</strong>
        <span className="satset-live">LIVE · LAN</span>
      </div>
      <ul className="satset-net-devices">
        {t.devices.map((device) => <li key={device}><i aria-hidden="true" /><span>{device}</span></li>)}
      </ul>
      <figcaption aria-live="polite">{online ? t.captionOn : t.captionOff}</figcaption>
    </figure>
  );
}
