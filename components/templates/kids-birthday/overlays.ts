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
  bunting: string;
  stars: string;
  zigzag: string;
  partyHat: string;
  giftBox: string;
  cake: string;
  soccerBall?: string;
  afaSunburst?: string;
  soccerSprinkles?: string;
  pitchLines?: string;
  soccerSideStrips?: string;
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
  bunting: "",
  stars: "",
  zigzag: "",
  partyHat: "",
  giftBox: "",
  cake: "",
  soccerBall: "",
  afaSunburst: "",
  soccerSprinkles: "",
  pitchLines: "",
  soccerSideStrips: "",
};

const generateSunburst = () => {
  const rays = Array.from({ length: 16 })
    .map((_, i) => {
      const rot = i * 22.5;
      return i % 2 === 0
        ? `<polygon points="47,30 50,2 53,30" transform="rotate(${rot} 50 50)" />`
        : `<path d="M47,30 Q40,15 50,2 Q60,15 53,30 Z" transform="rotate(${rot} 50 50)" />`;
    })
    .join("");

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <g fill='#F6B40E' stroke='#D35400' stroke-width='0.75' stroke-linejoin='round'>
      ${rays}
      <circle cx='50' cy='50' r='20' />
      <g fill='none' stroke='#D35400' stroke-width='1.5' stroke-linecap='round'>
        <path d='M42 45 Q45 42 48 45' />
        <path d='M52 45 Q55 42 58 45' />
        <path d='M44 53 Q50 58 56 53' />
      </g>
      <circle cx='45' cy='48' r='1.5' fill='#D35400' stroke='none' />
      <circle cx='55' cy='48' r='1.5' fill='#D35400' stroke='none' />
    </g>
  </svg>`;
};

const generateSoccerBall = () => {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <circle cx='50' cy='50' r='48' fill='#ffffff' stroke='#1a1a1a' stroke-width='3'/>
    <g fill='#1a1a1a' stroke='#1a1a1a' stroke-width='2' stroke-linejoin='round'>
      <polygon points='50,18 70,32 62,56 38,56 30,32'/>
      <line x1='50' y1='18' x2='50' y2='2'/>
      <line x1='70' y1='32' x2='93' y2='25'/>
      <line x1='62' y1='56' x2='82' y2='80'/>
      <line x1='38' y1='56' x2='18' y2='80'/>
      <line x1='30' y1='32' x2='7' y2='25'/>
      <polygon points='7,25 0,40 0,10'/>
      <polygon points='93,25 100,40 100,10'/>
      <polygon points='18,80 25,98 5,90'/>
      <polygon points='82,80 95,90 75,98'/>
      <polygon points='50,2 40,0 60,0'/>
    </g>
  </svg>`;
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
      <svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 1000 1000'>
        <g fill='${accent}' fill-opacity='0.4'>
          <circle cx='90' cy='110' r='12'/><circle cx='220' cy='180' r='9'/><circle cx='360' cy='120' r='10'/><circle cx='520' cy='170' r='11'/><circle cx='710' cy='130' r='9'/>
          <circle cx='160' cy='360' r='10'/><circle cx='310' cy='310' r='12'/><circle cx='470' cy='380' r='8'/><circle cx='660' cy='330' r='12'/><circle cx='780' cy='390' r='9'/>
          <circle cx='110' cy='640' r='9'/><circle cx='260' cy='600' r='11'/><circle cx='430' cy='690' r='12'/><circle cx='610' cy='620' r='9'/><circle cx='760' cy='700' r='11'/>
          <circle cx='850' cy='200' r='12'/><circle cx='920' cy='450' r='10'/><circle cx='880' cy='800' r='11'/>
        </g>
        <g fill='${accent2}' fill-opacity='0.4'>
          <rect x='130' y='220' width='18' height='38' rx='9' transform='rotate(-18 139 239)'/>
          <rect x='410' y='230' width='18' height='42' rx='9' transform='rotate(24 419 251)'/>
          <rect x='700' y='250' width='18' height='38' rx='9' transform='rotate(-28 709 269)'/>
          <rect x='120' y='470' width='18' height='42' rx='9' transform='rotate(22 129 491)'/>
          <rect x='390' y='510' width='18' height='38' rx='9' transform='rotate(-18 399 529)'/>
          <rect x='700' y='520' width='18' height='44' rx='9' transform='rotate(30 709 542)'/>
          <rect x='850' y='600' width='18' height='40' rx='9' transform='rotate(15 859 620)'/>
        </g>
        <g stroke='${dark}' stroke-opacity='0.3' stroke-width='6' stroke-linecap='round'>
          <path d='M210 92 L240 132'/><path d='M600 92 L630 126'/><path d='M90 520 L130 548'/><path d='M630 740 L664 776'/><path d='M800 100 L840 130'/>
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
          <path d='M110 120 Q130 100 150 120' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' opacity='0.5'/>
        </g>
        <g>
          <ellipse cx='290' cy='120' rx='60' ry='74' fill='${accent2}' fill-opacity='0.76'/>
          <ellipse cx='290' cy='102' rx='28' ry='20' fill='${onDark}' fill-opacity='0.20'/>
          <path d='M283 190 L297 190 L290 208 Z' fill='${accent2}' fill-opacity='0.82'/>
          <path d='M290 208 C296 270 302 310 318 364' stroke='${dark}' stroke-opacity='0.22' stroke-width='4' fill='none' stroke-linecap='round'/>
          <path d='M270 70 Q290 50 310 70' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' opacity='0.5'/>
        </g>
        <g>
          <ellipse cx='400' cy='220' rx='74' ry='92' fill='${bg}' fill-opacity='0.96' stroke='${accent}' stroke-opacity='0.32' stroke-width='6'/>
          <ellipse cx='400' cy='198' rx='30' ry='22' fill='${accent2}' fill-opacity='0.18'/>
          <path d='M392 310 L408 310 L400 330 Z' fill='${accent}' fill-opacity='0.74'/>
          <path d='M400 330 C392 388 382 452 394 520' stroke='${dark}' stroke-opacity='0.18' stroke-width='4' fill='none' stroke-linecap='round'/>
          <path d='M380 160 Q400 140 420 160' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' opacity='0.5'/>
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
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='100' viewBox='0 0 1200 100'>
        <path d='M20 50 Q 80 10 140 50 T 260 50 T 380 50 T 500 50 T 620 50 T 740 50 T 860 50 T 980 50 T 1100 50 T 1180 50' fill='none' stroke='${accent2}' stroke-opacity='0.5' stroke-width='8' stroke-dasharray='12 12' stroke-linecap='round'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <path d='M40 40 L560 20 L580 560 L20 580 Z' fill='none' stroke='${accent}' stroke-opacity='0.8' stroke-width='16' stroke-linejoin='round'/>
        <path d='M60 60 L540 50 L550 540 L50 550 Z' fill='none' stroke='${accent2}' stroke-opacity='0.8' stroke-width='8' stroke-dasharray='12 24' stroke-linejoin='round' stroke-linecap='round'/>
        <circle cx='50' cy='50' r='16' fill='${accent2}'/>
        <circle cx='550' cy='40' r='12' fill='${accent}'/>
        <circle cx='560' cy='550' r='18' fill='${accent2}'/>
        <circle cx='30' cy='560' r='14' fill='${accent}'/>
      </svg>
    `),
    footerWave: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='180' viewBox='0 0 1200 180'>
        <path d='M0 92 C134 132 268 138 400 108 C518 82 682 46 816 72 C958 100 1088 126 1200 102 L1200 180 L0 180 Z' fill='${accent2}' fill-opacity='0.12'/>
        <path d='M0 104 C130 144 266 146 400 116 C538 84 678 54 820 82 C952 108 1086 134 1200 114' fill='none' stroke='${accent}' stroke-opacity='0.26' stroke-width='6' stroke-linecap='round'/>
      </svg>
    `),
    bunting: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 40 Q 300 120 600 60 Q 900 0 1200 40' fill='none' stroke='${dark}' stroke-opacity='0.2' stroke-width='3'/>
        <path d='M60 55 L 120 140 L 160 55 Z' fill='${accent}' fill-opacity='0.9'/>
        <path d='M220 70 L 280 150 L 320 70 Z' fill='${accent2}' fill-opacity='0.9'/>
        <path d='M380 75 L 440 160 L 480 75 Z' fill='${bg}' stroke='${accent}' stroke-width='4'/>
        <path d='M540 70 L 600 150 L 640 70 Z' fill='${accent}' fill-opacity='0.9'/>
        <path d='M700 55 L 760 140 L 800 55 Z' fill='${accent2}' fill-opacity='0.9'/>
        <path d='M860 40 L 920 120 L 960 40 Z' fill='${bg}' stroke='${accent}' stroke-width='4'/>
        <path d='M1020 30 L 1080 110 L 1120 30 Z' fill='${accent}' fill-opacity='0.9'/>
      </svg>
    `),
    stars: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>
        <g fill='${accent2}' fill-opacity='0.6'>
          <path d='M100 100 L110 130 L140 130 L115 150 L125 180 L100 160 L75 180 L85 150 L60 130 L90 130 Z' transform='rotate(15 100 100)'/>
          <path d='M600 200 L615 240 L650 240 L625 265 L635 300 L600 280 L565 300 L575 265 L550 240 L585 240 Z' transform='rotate(-20 600 200) scale(1.5)'/>
          <path d='M200 600 L210 630 L240 630 L215 650 L225 680 L200 660 L175 680 L185 650 L160 630 L190 630 Z' transform='rotate(45 200 600) scale(0.8)'/>
          <path d='M700 650 L715 690 L750 690 L725 715 L735 750 L700 730 L665 750 L675 715 L650 690 L685 690 Z' transform='rotate(10 700 650) scale(1.2)'/>
        </g>
        <g fill='${accent}' fill-opacity='0.5'>
          <path d='M400 150 L410 180 L440 180 L415 200 L425 230 L400 210 L375 230 L385 200 L360 180 L390 180 Z' transform='rotate(-15 400 150) scale(1.2)'/>
          <path d='M150 400 L160 430 L190 430 L165 450 L175 480 L150 460 L125 480 L135 450 L110 430 L140 430 Z' transform='rotate(30 150 400)'/>
          <path d='M750 450 L760 480 L790 480 L765 500 L775 530 L750 510 L725 530 L735 500 L710 480 L740 480 Z' transform='rotate(-40 750 450) scale(0.9)'/>
          <path d='M450 750 L460 780 L490 780 L465 800 L475 830 L450 810 L425 830 L435 800 L410 780 L440 780 Z' transform='rotate(25 450 750) scale(1.3)'/>
        </g>
      </svg>
    `),
    zigzag: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='100' viewBox='0 0 1200 100'>
        <path d='M0 50 L50 10 L100 50 L150 10 L200 50 L250 10 L300 50 L350 10 L400 50 L450 10 L500 50 L550 10 L600 50 L650 10 L700 50 L750 10 L800 50 L850 10 L900 50 L950 10 L1000 50 L1050 10 L1100 50 L1150 10 L1200 50' fill='none' stroke='${accent}' stroke-opacity='0.4' stroke-width='8' stroke-linejoin='miter' stroke-miterlimit='4'/>
      </svg>
    `),
    partyHat: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='160' viewBox='0 0 120 160'>
        <path d='M20 140 L60 20 L100 140 Q60 150 20 140 Z' fill='${accent}' fill-opacity='0.85' stroke='${dark}' stroke-opacity='0.15' stroke-width='4' stroke-linejoin='round'/>
        <circle cx='60' cy='20' r='12' fill='${accent2}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.1' stroke-width='3'/>
        <path d='M30 110 Q60 120 90 110 M40 80 Q60 90 80 80 M50 50 Q60 55 70 50' fill='none' stroke='${bg}' stroke-width='6' stroke-linecap='round' opacity='0.7'/>
      </svg>
    `),
    giftBox: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='140' height='160' viewBox='0 0 140 160'>
        <rect x='20' y='60' width='100' height='90' rx='8' fill='${accent2}' fill-opacity='0.85' stroke='${dark}' stroke-opacity='0.15' stroke-width='4'/>
        <rect x='10' y='40' width='120' height='20' rx='6' fill='${accent}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.15' stroke-width='4'/>
        <rect x='60' y='40' width='20' height='110' fill='${bg}' fill-opacity='0.9'/>
        <path d='M70 40 Q50 10 30 30 Q50 50 70 40 Z' fill='${bg}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.1' stroke-width='3'/>
        <path d='M70 40 Q90 10 110 30 Q90 50 70 40 Z' fill='${bg}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.1' stroke-width='3'/>
      </svg>
    `),
    cake: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='160' height='180' viewBox='0 0 160 180'>
        <rect x='30' y='100' width='100' height='60' rx='12' fill='${accent}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.15' stroke-width='4'/>
        <rect x='45' y='60' width='70' height='40' rx='8' fill='${accent2}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.15' stroke-width='4'/>
        <path d='M30 115 Q55 130 80 115 T130 115' fill='none' stroke='${bg}' stroke-opacity='0.8' stroke-width='8' stroke-linecap='round'/>
        <rect x='75' y='25' width='10' height='35' rx='4' fill='${bg}' fill-opacity='0.9' stroke='${dark}' stroke-opacity='0.1' stroke-width='2'/>
        <path d='M80 10 Q75 15 80 25 Q85 15 80 10 Z' fill='${accent}' fill-opacity='0.9'/>
      </svg>
    `),
    soccerBall: svgToDataUri(generateSoccerBall()),
    afaSunburst: svgToDataUri(generateSunburst()),
    soccerSprinkles: svgToDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <g fill='${accent}' opacity='0.3'>
    <circle cx='50' cy='50' r='5'/>
    <circle cx='150' cy='30' r='4'/>
    <circle cx='250' cy='80' r='6'/>
    <circle cx='80' cy='180' r='4'/>
    <circle cx='220' cy='220' r='7'/>
    <circle cx='120' cy='280' r='5'/>
    <rect x='100' y='100' width='10' height='10' transform='rotate(45 105 105)' />
    <rect x='200' y='150' width='8' height='8' transform='rotate(20 204 154)' />
    <rect x='30' y='250' width='12' height='12' transform='rotate(60 36 256)' />
  </g>
</svg>`),
    pitchLines: svgToDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'>
  <path d='M 0 100 L 400 100 M 200 0 L 200 200' stroke='white' stroke-opacity='0.4' stroke-width='4' fill='none' />
  <circle cx='200' cy='100' r='40' stroke='white' stroke-opacity='0.4' stroke-width='4' fill='none' />
</svg>`),
    soccerSideStrips: svgToDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='900' viewBox='0 0 220 900'>
  <defs>
    <linearGradient id='strip' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0%' stop-color='${accent}' stop-opacity='0.98' />
      <stop offset='60%' stop-color='${bg}' stop-opacity='0.96' />
      <stop offset='100%' stop-color='${accent2}' stop-opacity='0.88' />
    </linearGradient>
  </defs>
  <path d='M0 0 H188 C158 92 154 168 184 250 C214 332 214 420 182 500 C152 578 152 666 184 746 C206 804 206 854 186 900 H0 Z' fill='url(#strip)'/>
  <path d='M28 0 V900' stroke='white' stroke-opacity='0.95' stroke-width='18'/>
  <path d='M68 0 V900' stroke='white' stroke-opacity='0.78' stroke-width='10'/>
  <path d='M96 0 V900' stroke='${accent}' stroke-opacity='0.24' stroke-width='6'/>
  <path d='M124 40 V860' stroke='${accent2}' stroke-opacity='0.45' stroke-width='8' stroke-dasharray='18 22'/>
  <circle cx='142' cy='120' r='18' fill='${accent2}' fill-opacity='0.92'/>
  <circle cx='142' cy='250' r='10' fill='white' fill-opacity='0.86'/>
  <circle cx='142' cy='390' r='18' fill='${accent2}' fill-opacity='0.92'/>
  <circle cx='142' cy='530' r='10' fill='white' fill-opacity='0.86'/>
  <circle cx='142' cy='670' r='18' fill='${accent2}' fill-opacity='0.92'/>
  <circle cx='142' cy='810' r='10' fill='white' fill-opacity='0.86'/>
</svg>`),
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
