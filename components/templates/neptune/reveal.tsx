"use client";

import { Children, type ComponentProps, type ReactNode } from "react";
import { motion } from "framer-motion";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { useWindowSize } from "@/hooks";

export function NeptuneReveal(props: ComponentProps<typeof RevealOnScroll>) {
  const { delay, duration, distance, once, threshold, ...rest } = props;
  const { isMobile } = useWindowSize();

  const effectiveDistance = distance ?? (isMobile ? 34 : 52);
  const effectiveDuration = duration ?? (isMobile ? 1.05 : 1.65);

  return (
    <RevealOnScroll
      delay={delay ?? 0.18}
      duration={effectiveDuration}
      distance={effectiveDistance}
      margin="20% 0px 20% 0px"
      threshold={threshold ?? 0.12}
      once={once ?? false}
      {...rest}
    />
  );
}

export function NeptuneStagger({
  children,
  className,
  baseDelay,
  staggerStep,
  once,
}: {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  staggerStep?: number;
  once?: boolean;
}) {
  const items = Children.toArray(children).filter(Boolean);
  const { isMobile } = useWindowSize();
  const d = baseDelay ?? 0;
  const step = staggerStep ?? 0.24;

  const containerY = isMobile ? 18 : 24;
  const itemY = isMobile ? 24 : 32;
  const containerDuration = isMobile ? 1.4 : 1.75;
  const itemDuration = isMobile ? 1.45 : 1.8;
  const allowBlur = !isMobile;

  const containerVariants = {
    hidden: { opacity: 0, y: containerY },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: containerDuration,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
        when: "beforeChildren" as const,
        staggerChildren: step,
        delayChildren: d,
      },
    },
  };

  const itemVariants = allowBlur
    ? {
        hidden: { opacity: 0, y: itemY, scale: 0.97, filter: "blur(14px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: itemDuration,
            ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
          },
        },
      }
    : {
        hidden: { opacity: 0, y: itemY, scale: 0.97 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: itemDuration,
            ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
          },
        },
      };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: once ?? false,
        amount: 0.08,
        margin: "20% 0px 20% 0px",
      }}
    >
      {items.map((child, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
