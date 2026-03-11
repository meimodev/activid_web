"use client";

import { useCallback, useEffect, useState } from "react";

type OverlayAssets = {
  confetti: string;
  balloons: string;
  clouds: string;
  rainbow: string;
  sparkles: string;
  ticketDivider: string;
  frame: string;
  footerWave: string;
};

const EMPTY_OVERLAY_ASSETS: OverlayAssets = {
  confetti: "",
  balloons: "",
  clouds: "",
  rainbow: "",
  sparkles: "",
  ticketDivider: "",
  frame: "",
  footerWave: "",
};

const svgToDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

function readInvitationCssVars() {
  const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
  const el = shell ?? document.documentElement;
  const style = window.getComputedStyle(el);
  const get = (name: string) => style.getPropertyValue(name).trim();

  return {
    bg: get("--invitation-bg"),
    accent: get("--invitation-accent"),
    accent2: get("--invitation-accent-2"),
    dark: get("--invitation-dark"),
    onDark: get("--invitation-on-dark"),
  };
}

function buildOverlayAssets({
  bg,
  accent,
  accent2,
  dark,
  onDark,
}: {
  bg: string;
  accent: string;
  accent2: string;
  dark: string;
  onDark: string;
}): OverlayAssets {
  return {
    confetti: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'>
        <g fill='${accent}' fill-opacity='0.18'>
          <circle cx='90' cy='110' r='12'/><circle cx='220' cy='180' r='9'/><circle cx='360' cy='120' r='10'/><circle cx='520' cy='170' r='11'/><circle cx='710' cy='130' r='9'/>
          <circle cx='160' cy='360' r='10'/><circle cx='310' cy='310' r='12'/><circle cx='470' cy='380' r='8'/><circle cx='660' cy='330' r='12'/><circle cx='780' cy='390' r='9'/>
          <circle cx='110' cy='640' r='9'/><circle cx='260' cy='600' r='11'/><circle cx='430' cy='690' r='12'/><circle cx='610' cy='620' r='9'/><circle cx='760' cy='700' r='11'/>
        </g>
        <g fill='${accent2}' fill-opacity='0.18'>
          <rect x='130' y='220' width='18' height='38' rx='9' transform='rotate(-18 139 239)'/>
          <rect x='410' y='230' width='18' height='42' rx='9' transform='rotate(24 419 251)'/>
          <rect x='700' y='250' width='18' height='38' rx='9' transform='rotate(-28 709 269)'/>
          <rect x='120' y='470' width='18' height='42' rx='9' transform='rotate(22 129 491)'/>
          <rect x='390' y='510' width='18' height='38' rx='9' transform='rotate(-18 399 529)'/>
          <rect x='700' y='520' width='18' height='44' rx='9' transform='rotate(30 709 542)'/>
        </g>
        <g stroke='${dark}' stroke-opacity='0.14' stroke-width='5' stroke-linecap='round'>
          <path d='M210 92 L240 132'/><path d='M600 92 L630 126'/><path d='M90 520 L130 548'/><path d='M630 740 L664 776'/>
        </g>
      </svg>
    `),
    balloons: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='520' height='720' viewBox='0 0 520 720'>
        <g>
          <ellipse cx='130' cy='170' rx='70' ry='88' fill='${accent}' fill-opacity='0.78'/>
          <ellipse cx='130' cy='150' rx='36' ry='24' fill='${onDark}' fill-opacity='0.18'/>
          <path d='M122 250 L138 250 L130 270 Z' fill='${accent}' fill-opacity='0.82'/>
          <path d='M130 270 C124 322 116 370 106 418' stroke='${dark}' stroke-opacity='0.25' stroke-width='4' fill='none' stroke-linecap='round'/>
        </g>
        <g>
          <ellipse cx='290' cy='120' rx='60' ry='74' fill='${accent2}' fill-opacity='0.76'/>
          <ellipse cx='290' cy='102' rx='28' ry='20' fill='${onDark}' fill-opacity='0.20'/>
          <path d='M283 190 L297 190 L290 208 Z' fill='${accent2}' fill-opacity='0.82'/>
          <path d='M290 208 C296 270 302 310 318 364' stroke='${dark}' stroke-opacity='0.22' stroke-width='4' fill='none' stroke-linecap='round'/>
        </g>
        <g>
          <ellipse cx='400' cy='220' rx='74' ry='92' fill='${bg}' fill-opacity='0.96' stroke='${accent}' stroke-opacity='0.32' stroke-width='6'/>
          <ellipse cx='400' cy='198' rx='30' ry='22' fill='${accent2}' fill-opacity='0.18'/>
          <path d='M392 310 L408 310 L400 330 Z' fill='${accent}' fill-opacity='0.74'/>
          <path d='M400 330 C392 388 382 452 394 520' stroke='${dark}' stroke-opacity='0.18' stroke-width='4' fill='none' stroke-linecap='round'/>
        </g>
      </svg>
    `),
    clouds: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='220' viewBox='0 0 1200 220'>
        <path d='M0 140 C80 80 160 82 220 126 C238 86 276 62 326 66 C368 68 406 94 424 126 C450 110 482 104 514 108 C564 116 602 154 606 194 L0 194 Z' fill='${bg}' fill-opacity='0.94'/>
        <path d='M430 150 C496 98 560 96 614 138 C632 100 674 76 724 78 C776 80 824 112 844 148 C868 134 900 128 932 132 C994 140 1040 176 1044 214 L430 214 Z' fill='${bg}' fill-opacity='0.88'/>
        <path d='M160 194 L1048 194' stroke='${accent2}' stroke-opacity='0.22' stroke-width='8' stroke-linecap='round' stroke-dasharray='10 18'/>
      </svg>
    `),
    rainbow: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='320' viewBox='0 0 1200 320'>
        <path d='M140 280 C260 100 440 24 600 24 C760 24 940 100 1060 280' fill='none' stroke='${accent}' stroke-opacity='0.34' stroke-width='28' stroke-linecap='round'/>
        <path d='M180 282 C286 124 452 62 600 62 C748 62 914 124 1020 282' fill='none' stroke='${accent2}' stroke-opacity='0.32' stroke-width='24' stroke-linecap='round'/>
        <path d='M220 284 C312 148 468 96 600 96 C732 96 888 148 980 284' fill='none' stroke='${bg}' stroke-opacity='0.96' stroke-width='18' stroke-linecap='round'/>
      </svg>
    `),
    sparkles: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'>
        <g stroke='${accent2}' stroke-opacity='0.46' stroke-width='8' stroke-linecap='round'>
          <path d='M84 124 L84 176'/><path d='M58 150 L110 150'/>
          <path d='M380 82 L380 136'/><path d='M352 109 L408 109'/>
          <path d='M420 286 L420 340'/><path d='M392 313 L448 313'/>
          <path d='M158 372 L158 430'/><path d='M128 401 L188 401'/>
        </g>
        <g fill='${accent}' fill-opacity='0.24'>
          <circle cx='256' cy='118' r='12'/><circle cx='120' cy='258' r='9'/><circle cx='354' cy='214' r='10'/><circle cx='278' cy='396' r='11'/>
        </g>
      </svg>
    `),
    ticketDivider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <path d='M40 40 L1160 40' stroke='${accent}' stroke-opacity='0.22' stroke-width='6' stroke-linecap='round' stroke-dasharray='8 18'/>
        <circle cx='600' cy='40' r='12' fill='${accent2}' fill-opacity='0.38'/>
        <circle cx='560' cy='40' r='6' fill='${accent}' fill-opacity='0.32'/>
        <circle cx='640' cy='40' r='6' fill='${accent}' fill-opacity='0.32'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'>
        <rect x='34' y='34' width='452' height='452' rx='140' fill='none' stroke='${accent}' stroke-opacity='0.34' stroke-width='14'/>
        <rect x='58' y='58' width='404' height='404' rx='116' fill='none' stroke='${accent2}' stroke-opacity='0.38' stroke-width='8' stroke-dasharray='10 18' stroke-linecap='round'/>
        <circle cx='112' cy='106' r='18' fill='${accent2}' fill-opacity='0.24'/>
        <circle cx='418' cy='398' r='16' fill='${accent}' fill-opacity='0.24'/>
      </svg>
    `),
    footerWave: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='180' viewBox='0 0 1200 180'>
        <path d='M0 92 C134 132 268 138 400 108 C518 82 682 46 816 72 C958 100 1088 126 1200 102 L1200 180 L0 180 Z' fill='${accent2}' fill-opacity='0.12'/>
        <path d='M0 104 C130 144 266 146 400 116 C538 84 678 54 820 82 C952 108 1086 134 1200 114' fill='none' stroke='${accent}' stroke-opacity='0.26' stroke-width='6' stroke-linecap='round'/>
      </svg>
    `),
  };
}

export function useOverlayAssets(): OverlayAssets {
  const [assets, setAssets] = useState<OverlayAssets>(() => {
    try {
      const { bg, accent, accent2, dark, onDark } = readInvitationCssVars();
      if (!bg || !accent || !accent2 || !dark || !onDark) return EMPTY_OVERLAY_ASSETS;
      return buildOverlayAssets({ bg, accent, accent2, dark, onDark });
    } catch {
      return EMPTY_OVERLAY_ASSETS;
    }
  });

  const recompute = useCallback(() => {
    const { bg, accent, accent2, dark, onDark } = readInvitationCssVars();
    if (!bg || !accent || !accent2 || !dark || !onDark) return;
    setAssets(buildOverlayAssets({ bg, accent, accent2, dark, onDark }));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      recompute();
    }, 0);

    const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
    const target = shell ?? document.documentElement;

    const observer = new MutationObserver(() => {
      recompute();
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [recompute]);

  return assets;
}
