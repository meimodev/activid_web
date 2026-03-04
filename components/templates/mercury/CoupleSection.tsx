"use client";

import { motion } from "framer-motion";
import { Host } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface CoupleSectionProps {
  hosts: Host[];
}

export function CoupleSection({ hosts }: CoupleSectionProps) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
    <section className="relative overflow-hidden bg-[#612A35] py-24 text-[#fff4f6] ">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute insets-x-0 -top-30 h-[500px] w-full bg-cover bg-no-repeat "
            style={{
              backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})`,
            }}
          />
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-40 rotate-180 h-[600px] w-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-10 h-[600px] w-[540px] bg-cover bg-no-repeat "
            style={{
              backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
            }}
          />
        </div>

        <div className="absolute inset-0 z-10">
          <div className="absolute -left-20 top-24 h-[560px] w-[220px] bg-contain bg-left bg-no-repeat">
            <motion.div
              className="h-full w-full bg-contain bg-left bg-no-repeat"
              style={{
                backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerSide})`,
                transformOrigin: "12% 8%",
                willChange: "transform",
              }}
              animate={{
                rotate: [0, -1.8, 1.1, -1.1, 0],
                x: [0, 1.5, -1, 1, 0],
                y: [0, -1.5, 0.8, -0.8, 0],
              }}
              transition={{
                duration: 7.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div
            className="absolute -right-20 bottom-24 h-[560px] w-[220px] bg-contain bg-right bg-no-repeat"
            style={{ transform: "scaleX(-1)" }}
          >
            <motion.div
              className="h-full w-full bg-contain bg-right bg-no-repeat"
              style={{
                backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerSide})`,
                transformOrigin: "12% 8%",
                willChange: "transform",
              }}
              animate={{
                rotate: [0, -1.6, 0.9, -1, 0],
                x: [0, 1.2, -0.9, 0.8, 0],
                y: [0, -1.2, 0.7, -0.7, 0],
              }}
              transition={{
                duration: 7.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.45,
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[640px] flex-col items-center px-4 text-center">
        <div className="flex flex-col items-center">
          <RevealOnScroll direction="none" scale={1} delay={0.12} width="100%">
            <div
              aria-hidden
              className="mx-auto h-[30px] w-[240px] bg-contain bg-center bg-no-repeat opacity-90 "
              style={{
                backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.topDivider})`,
              }}
            />
          </RevealOnScroll>

          <RevealOnScroll direction="none" scale={1} delay={0.2} width="100%">
            <p className="mt-8 font-poppins text-[14px] leading-relaxed text-white/85 ">
              Tanpa Mengurangi rasa hormat dengan ini kami mengundang
              Bapak/Ibu/Saudara-i untuk hadir pada pernikahan kami
            </p>
          </RevealOnScroll>
        </div>

        <div className="mt-14 w-full">
          <RevealOnScroll direction="none" scale={1} delay={0.28} width="100%">
            <div className="relative mx-auto w-[250px] ">
              <div className="relative aspect-[3/4]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.photoFrame})`,
                  }}
                />
                <div className="absolute inset-[18px] overflow-hidden ">
                  <img
                    src={primary?.photo ?? ""}
                    alt="Host"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-10">
            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.36}
              width="100%"
            >
              <p className="font-tan-mon-cheri text-[62px] leading-none text-white ">
                {primary?.firstName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.42}
              width="100%"
            >
              <p className="mt-2 font-poppins-bold text-[18px] text-white/90 ">
                {primary?.fullName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.48}
              width="100%"
            >
              <p className="mt-3 font-poppins italic text-[14px] text-white/80">
                {primary?.role ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.54}
              width="100%"
            >
              <p className="mt-5 font-poppins text-[13px] leading-relaxed text-white/80 ">
                {primary?.parents ?? ""}
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {secondary ? (
          <>
            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.62}
              width="100%"
            >
              <div className="mt-14 flex w-full items-center justify-center">
                <div
                  aria-hidden
                  className="h-[34px] w-[260px] bg-contain bg-center bg-no-repeat opacity-90 "
                  style={{
                    backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.brideAndGroomDivider})`,
                  }}
                />
              </div>
            </RevealOnScroll>

            <div className="mt-14 w-full">
              <RevealOnScroll
                direction="none"
                scale={1}
                delay={0.7}
                width="100%"
              >
                <div className="relative mx-auto w-[250px] ">
                  <div className="relative aspect-[3/4]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.photoFrame})`,
                      }}
                    />
                    <div className="absolute inset-[18px] overflow-hidden ">
                      <img
                        src={secondary.photo}
                        alt="Host"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              <div className="mt-10">
                <RevealOnScroll
                  direction="none"
                  scale={1}
                  delay={0.78}
                  width="100%"
                >
                  <p className="font-tan-mon-cheri text-[62px] leading-none text-white ">
                    {secondary.firstName}
                  </p>
                </RevealOnScroll>

                <RevealOnScroll
                  direction="none"
                  scale={1}
                  delay={0.84}
                  width="100%"
                >
                  <p className="mt-2 font-poppins-bold text-[18px] text-white/90 ">
                    {secondary.fullName}
                  </p>
                </RevealOnScroll>

                <RevealOnScroll
                  direction="none"
                  scale={1}
                  delay={0.9}
                  width="100%"
                >
                  <p className="mt-3 font-poppins italic text-[14px] text-white/80">
                    {secondary.role}
                  </p>
                </RevealOnScroll>

                <RevealOnScroll
                  direction="none"
                  scale={1}
                  delay={0.96}
                  width="100%"
                >
                  <p className="mt-5 font-poppins text-[13px] leading-relaxed text-white/80 ">
                    {secondary.parents}
                  </p>
                </RevealOnScroll>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
