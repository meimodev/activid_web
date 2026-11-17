"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = { src: string; poster: string; label: string; pauseLabel: string; playLabel: string };

// Plays only while on screen, so a phone never downloads or decodes a clip nobody is looking at.
export default function FeatureVideo({ src, poster, label, pauseLabel, playLabel }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // null = automatic; the button records what the visitor asked for.
  const [wantsPaused, setWantsPaused] = useState<boolean | null>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (wantsPaused) {
      element.pause();
      return;
    }
    if (wantsPaused === null && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => {});
      else element.pause();
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [wantsPaused]);

  return (
    <div className="satset-stage">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" aria-label={playing ? pauseLabel : playLabel} onClick={() => setWantsPaused(playing)}>
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
