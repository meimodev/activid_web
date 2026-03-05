"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { Host } from "@/types/invitation";

import { neptuneScript, neptuneSerif } from "./fonts";
import { NeptuneStagger } from "./reveal";

export function ThankYouSection({
  hosts,
  backgroundPhotos,
  message,
}: {
  hosts: Host[];
  backgroundPhotos: string[];
  message: string;
}) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;
  const photos = useMemo(() => {
    return backgroundPhotos?.filter(Boolean) ?? [];
  }, [backgroundPhotos]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 7200);
    return () => window.clearInterval(t);
  }, [photos.length]);

  const safeActiveIndex = photos.length > 0 ? activeIndex % photos.length : 0;
  const activePhoto = photos[safeActiveIndex];

  return (
    <section
      id="thankyou"
      className="relative overflow-hidden bg-wedding-dark text-wedding-on-dark"
    >
      <div className="relative h-[450px] min-h-[360px] max-h-[560px] overflow-hidden">
        <AnimatePresence initial={false}>
          {activePhoto ? (
            <motion.div
              key={`${safeActiveIndex}-${activePhoto}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
              }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.14 }}
                transition={{ duration: 8.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={activePhoto}
                  alt="Thank you background"
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  unoptimized
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-wedding-on-dark/18" />
        <div className="absolute inset-0 bg-linear-to-b from-wedding-on-dark/5 via-wedding-on-dark/28 to-wedding-dark/85" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-wedding-dark to-transparent" />
      </div>

      <div className="relative -mt-24 px-6 pb-16 ">
        <NeptuneStagger
          className="mx-auto max-w-3xl text-center"
          baseDelay={0.08}
          staggerStep={0.22}
        >
          <p className="mx-auto max-w-2xl text-md leading-tight text-wedding-on-dark whitespace-pre-line">
            {message?.trim()
              ? message
              : "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila\nBapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas\nperhatian dan doa yang diberikan, kami ucapkan terima kasih."}
          </p>

          <p
            className={`${neptuneScript.className} pt-10 text-xl text-wedding-on-dark/70`}
          >
            The Wedding of
          </p>

          <h3
            className={`${neptuneSerif.className} pt-2 text-4xl text-wedding-on-dark`}
          >
            {names}
          </h3>
        </NeptuneStagger>
      </div>
    </section>
  );
}
