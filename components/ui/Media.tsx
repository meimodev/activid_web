'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface MediaProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * One picture slot: a photograph, or a muted loop when `src` is an .mp4
 * (optionally `…mp4#t=9` to open on second 9). Always fills its (relative,
 * sized) parent.
 */
export function Media({ src, alt, sizes = '100vw', priority, className = '' }: MediaProps) {
  if (src.includes('.mp4')) {
    return <LoopVideo src={src} label={alt} className={className} />;
  }
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  );
}

/**
 * The clips are 5–13 MB each, so nothing is fetched until the clip is on
 * screen, and it pauses again when it leaves. Until then (and under reduced
 * motion, where it never plays) the poster stands in — ImageKit serves a frame
 * of any video at `<video>/ik-thumbnail.jpg`.
 */
function LoopVideo({ src, label, className }: { src: string; label: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [file, at = '2'] = src.split('#t=');
  // ponytail: this one film was exported with letterbox bars baked in, so it is
  // scaled past them. Re-export it without bars and delete this line.
  const crop = file.includes('pertamina') ? '[transform:scale(1.25)]' : '';

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return video.pause();
      if (!video.src) video.src = src;
      video.play().catch(() => {}); // autoplay refused (e.g. data saver): the poster stays
    });
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`${file}/ik-thumbnail.jpg?tr=so-${at},w-1280`}
      aria-label={label}
      className={`absolute inset-0 h-full w-full object-cover ${crop} ${className}`}
    />
  );
}
