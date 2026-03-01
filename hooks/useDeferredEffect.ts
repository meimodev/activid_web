"use client";

import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export function useDeferredEffect(effect: EffectCallback, deps: DependencyList) {
  const effectRef = useRef<EffectCallback>(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let cleanup: void | (() => void);

    const timer = window.setTimeout(() => {
      cleanup = effectRef.current();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, deps);
}
