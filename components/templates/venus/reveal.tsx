"use client";

import type { ComponentProps } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

export function VenusReveal(props: ComponentProps<typeof RevealOnScroll>) {
  const { delay, duration, distance, margin, threshold, ...rest } = props;

  return (
    <RevealOnScroll
      delay={delay ?? 0.08}
      duration={duration ?? 1.0}
      distance={distance ?? 18}
      margin={margin ?? "-10%"}
      threshold={threshold ?? 0.12}
      {...rest}
    />
  );
}
