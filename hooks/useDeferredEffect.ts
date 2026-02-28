"use client";

import { DependencyList, EffectCallback, useEffect } from "react";

export function useDeferredEffect(effect: EffectCallback, deps: DependencyList) {
  useEffect(() => {
    let cleanup: void | (() => void);

    const timer = window.setTimeout(() => {
      cleanup = effect();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [effect, ...deps]);
}
