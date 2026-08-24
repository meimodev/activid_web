'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    // autoRaf, not a hand-rolled requestAnimationFrame recursion: the manual
    // loop could not be cancelled on cleanup, so it kept scheduling itself and
    // calling .raf() on a destroyed instance forever (twice over, under
    // StrictMode's double-mount). Lenis owns the frame loop and tears it down
    // in destroy().
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <div className={className}>{children}</div>;
}
