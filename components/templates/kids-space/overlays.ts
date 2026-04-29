"use client";

import { useCallback, useEffect, useState } from "react";

type ThemeVariant = "cosmic-commander" | "mars-mission" | "star-princess" | "unicorn-dreams";

type OverlayAssets = {
  stars: string;
  heroGraphic: string;
  floatingPlanet1: string;
  floatingPlanet2: string;
  shootingElement: string;
  moonOrbiter: string;
  frame: string;
  divider: string;
  footerGraphic: string;
  constellation: string;
  spaceDust: string;
};

const EMPTY_OVERLAY_ASSETS: OverlayAssets = {
  stars: "",
  heroGraphic: "",
  floatingPlanet1: "",
  floatingPlanet2: "",
  shootingElement: "",
  moonOrbiter: "",
  frame: "",
  divider: "",
  footerGraphic: "",
  constellation: "",
  spaceDust: "",
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
    onAccent: get("--invitation-on-accent"),
  };
}

function detectThemeVariant(accent: string): ThemeVariant {
  const a = accent.toLowerCase().trim();
  if (a === "#ef4444" || a === "ef4444") return "mars-mission";
  if (a === "#ec4899" || a === "ec4899") return "star-princess";
  if (a === "#e879f9" || a === "e879f9") return "unicorn-dreams";
  return "cosmic-commander";
}

function buildStars(bg: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
      <g fill='${accent2}' fill-opacity='0.18'>
        <circle cx='80' cy='120' r='2'/><circle cx='200' cy='60' r='1.5'/><circle cx='340' cy='200' r='2.5'/>
        <circle cx='500' cy='90' r='1.8'/><circle cx='680' cy='150' r='2'/><circle cx='820' cy='50' r='1.5'/>
        <circle cx='960' cy='180' r='2.2'/><circle cx='1100' cy='100' r='1.8'/><circle cx='60' cy='400' r='2'/>
        <circle cx='180' cy='350' r='1.5'/><circle cx='320' cy='480' r='2'/><circle cx='450' cy='320' r='1.8'/>
        <circle cx='580' cy='450' r='2.5'/><circle cx='720' cy='380' r='1.5'/><circle cx='890' cy='420' r='2'/>
        <circle cx='1030' cy='350' r='1.8'/><circle cx='1150' cy='480' r='2'/><circle cx='120' cy='650' r='2'/>
        <circle cx='280' cy='720' r='1.5'/><circle cx='410' cy='600' r='2.2'/><circle cx='550' cy='700' r='1.8'/>
        <circle cx='700' cy='640' r='2'/><circle cx='850' cy='750' r='1.5'/><circle cx='990' cy='680' r='2'/>
        <circle cx='1120' cy='730' r='1.8'/>
      </g>
      <g fill='${bg}' fill-opacity='0.12'>
        <circle cx='140' cy='280' r='1'/><circle cx='380' cy='100' r='1.2'/><circle cx='620' cy='300' r='1'/>
        <circle cx='760' cy='220' r='1.3'/><circle cx='920' cy='300' r='1'/><circle cx='1070' cy='250' r='1.2'/>
        <circle cx='50' cy='520' r='1'/><circle cx='250' cy='580' r='1.2'/><circle cx='520' cy='560' r='1'/>
        <circle cx='650' cy='520' r='1.3'/><circle cx='800' cy='580' r='1'/><circle cx='950' cy='550' r='1.2'/>
      </g>
    </svg>
  `);
}

function buildConstellation(bg: string, accent: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='200' viewBox='0 0 600 200'>
      <g fill='none' stroke='${accent2}' stroke-opacity='0.35' stroke-width='1.5' stroke-linecap='round'>
        <path d='M40 100 L90 60 L150 110 L220 70 L290 130 L350 80'/>
        <path d='M150 110 L180 140 L140 170'/>
        <path d='M290 130 L320 100 L380 140'/>
        <path d='M400 90 L450 120 L520 80 L570 110'/>
      </g>
      <g fill='${accent}' fill-opacity='0.55'>
        <circle cx='40' cy='100' r='3.5'/><circle cx='90' cy='60' r='2.5'/>
        <circle cx='150' cy='110' r='3'/><circle cx='220' cy='70' r='2'/>
        <circle cx='290' cy='130' r='3.5'/><circle cx='350' cy='80' r='2.5'/>
        <circle cx='180' cy='140' r='2'/><circle cx='140' cy='170' r='2.5'/>
        <circle cx='320' cy='100' r='2'/><circle cx='380' cy='140' r='2.5'/>
        <circle cx='400' cy='90' r='3'/><circle cx='450' cy='120' r='2.5'/>
        <circle cx='520' cy='80' r='3'/><circle cx='570' cy='110' r='2'/>
      </g>
    </svg>
  `);
}

function buildSpaceDust(bg: string, accent: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='300' viewBox='0 0 800 300'>
      <g fill='${accent}' fill-opacity='0.22'>
        <circle cx='40' cy='150' r='2'/><circle cx='100' cy='80' r='3'/><circle cx='180' cy='200' r='1.8'/>
        <circle cx='250' cy='100' r='2.5'/><circle cx='340' cy='180' r='2'/><circle cx='410' cy='70' r='3'/>
        <circle cx='490' cy='220' r='2.2'/><circle cx='560' cy='120' r='1.8'/><circle cx='640' cy='180' r='2.5'/>
        <circle cx='720' cy='90' r='2'/><circle cx='780' cy='160' r='1.5'/>
      </g>
      <g fill='${accent2}' fill-opacity='0.16'>
        <circle cx='60' cy='60' r='1.5'/><circle cx='140' cy='160' r='2'/><circle cx='220' cy='50' r='1.8'/>
        <circle cx='310' cy='140' r='2.2'/><circle cx='380' cy='220' r='1.5'/><circle cx='460' cy='60' r='2'/>
        <circle cx='540' cy='160' r='1.8'/><circle cx='610' cy='240' r='2.2'/><circle cx='690' cy='60' r='1.5'/>
        <circle cx='760' cy='200' r='2'/>
      </g>
    </svg>
  `);
}

function buildCosmicCommanderAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <ellipse cx='120' cy='200' rx='60' ry='22' fill='${c.accent}' fill-opacity='0.18'/>
        <path d='M120 40 L140 140 L120 170 L100 140 Z' fill='${c.accent2}' fill-opacity='0.55' stroke='${c.accent}' stroke-opacity='0.3' stroke-width='3' stroke-linejoin='round'/>
        <path d='M90 140 Q80 90 120 40 Q160 90 150 140' fill='none' stroke='${c.accent}' stroke-opacity='0.2' stroke-width='2'/>
        <rect x='85' y='130' width='70' height='12' rx='6' fill='${c.accent}' fill-opacity='0.5'/>
        <ellipse cx='120' cy='230' rx='18' ry='8' fill='${c.accent2}' fill-opacity='0.35'/>
        <ellipse cx='120' cy='240' rx='28' ry='12' fill='${c.accent}' fill-opacity='0.2'/>
        <circle cx='165' cy='100' r='4' fill='${c.accent2}' fill-opacity='0.6'/>
        <circle cx='155' cy='80' r='2.5' fill='${c.accent}' fill-opacity='0.4'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <circle cx='100' cy='100' r='60' fill='${c.accent}' fill-opacity='0.35'/>
        <ellipse cx='100' cy='100' rx='85' ry='24' fill='none' stroke='${c.accent2}' stroke-opacity='0.5' stroke-width='4' transform='rotate(-20 100 100)'/>
        <ellipse cx='100' cy='100' rx='85' ry='24' fill='none' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='2' transform='rotate(-20 100 100) scale(0.85)'/>
        <circle cx='75' cy='80' r='8' fill='${c.bg}' fill-opacity='0.4'/>
        <circle cx='120' cy='110' r='6' fill='${c.bg}' fill-opacity='0.3'/>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <circle cx='55' cy='60' r='40' fill='${c.accent2}' fill-opacity='0.3'/>
        <circle cx='50' cy='50' r='12' fill='${c.bg}' fill-opacity='0.35'/>
        <circle cx='65' cy='70' r='8' fill='${c.bg}' fill-opacity='0.25'/>
        <circle cx='45' cy='68' r='5' fill='${c.bg}' fill-opacity='0.3'/>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <defs>
          <linearGradient id='cometGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stop-color='${c.accent2}' stop-opacity='0.9'/>
            <stop offset='40%' stop-color='${c.accent2}' stop-opacity='0.4'/>
            <stop offset='100%' stop-color='${c.accent2}' stop-opacity='0'/>
          </linearGradient>
        </defs>
        <circle cx='30' cy='45' r='6' fill='${c.accent2}' fill-opacity='0.8'/>
        <path d='M24 45 Q80 42 150 48 Q200 50 280 52' fill='none' stroke='url(#cometGrad)' stroke-width='3' stroke-linecap='round'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <circle cx='50' cy='50' r='30' fill='${c.accent2}' fill-opacity='0.25'/>
        <circle cx='40' cy='40' r='28' fill='${c.bg}' fill-opacity='0.85'/>
        <circle cx='48' cy='50' r='4' fill='${c.accent}' fill-opacity='0.3'/>
        <circle cx='38' cy='44' r='3' fill='${c.accent}' fill-opacity='0.2'/>
        <circle cx='44' cy='36' r='2' fill='${c.accent}' fill-opacity='0.25'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <path d='M40 40 L560 20 L580 560 L20 580 Z' fill='none' stroke='${c.accent}' stroke-opacity='0.6' stroke-width='12' stroke-linejoin='round'/>
        <path d='M55 55 L545 45 L555 545 L45 555 Z' fill='none' stroke='${c.accent2}' stroke-opacity='0.4' stroke-width='4' stroke-dasharray='10 14' stroke-linejoin='round' stroke-linecap='round'/>
        <rect x='30' y='30' width='16' height='16' rx='4' fill='${c.accent2}' fill-opacity='0.7' transform='rotate(45 38 38)'/>
        <rect x='554' y='20' width='16' height='16' rx='4' fill='${c.accent}' fill-opacity='0.7' transform='rotate(45 562 28)'/>
        <rect x='564' y='544' width='16' height='16' rx='4' fill='${c.accent2}' fill-opacity='0.7' transform='rotate(45 572 552)'/>
        <rect x='10' y='564' width='16' height='16' rx='4' fill='${c.accent}' fill-opacity='0.7' transform='rotate(45 18 572)'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <path d='M40 40 L100 20 L160 40 L220 20 L280 40 L340 20 L400 40 L460 20 L520 40 L580 20 L640 40 L700 20 L760 40 L820 20 L880 40 L940 20 L1000 40 L1060 20 L1120 40 L1160 20' fill='none' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
        <circle cx='40' cy='40' r='4' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='400' cy='40' r='5' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='760' cy='40' r='4' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='1120' cy='40' r='5' fill='${c.accent}' fill-opacity='0.5'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 120 C200 80 400 100 600 120 C800 140 1000 100 1200 120 L1200 200 L0 200 Z' fill='${c.accent}' fill-opacity='0.12'/>
        <path d='M0 140 C200 100 400 120 600 140 C800 160 1000 120 1200 140' fill='none' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='3'/>
        <circle cx='200' cy='110' r='3' fill='${c.accent2}' fill-opacity='0.4'/>
        <circle cx='600' cy='130' r='4' fill='${c.accent}' fill-opacity='0.4'/>
        <circle cx='1000' cy='115' r='3' fill='${c.accent2}' fill-opacity='0.4'/>
      </svg>
    `),
  };
}

function buildMarsMissionAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <circle cx='120' cy='120' r='70' fill='${c.accent}' fill-opacity='0.14'/>
        <circle cx='120' cy='120' r='50' fill='${c.accent}' fill-opacity='0.2'/>
        <g fill='none' stroke='${c.accent2}' stroke-opacity='0.4' stroke-width='3' stroke-linecap='round'>
          <path d='M80 80 L90 90 L90 80 L100 90'/>
          <path d='M140 80 L150 90 L150 80 L160 90'/>
          <path d='M80 160 L90 150 L90 160 L100 150'/>
          <path d='M140 160 L150 150 L150 160 L160 150'/>
        </g>
        <circle cx='120' cy='120' r='20' fill='${c.accent2}' fill-opacity='0.3'/>
        <circle cx='120' cy='120' r='10' fill='${c.accent}' fill-opacity='0.5'/>
        <path d='M120 130 L120 170 M110 160 L130 160' stroke='${c.accent2}' stroke-opacity='0.25' stroke-width='2'/>
        <rect x='115' y='170' width='10' height='25' rx='3' fill='${c.accent}' fill-opacity='0.3'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <circle cx='100' cy='100' r='65' fill='${c.accent}' fill-opacity='0.3'/>
        <circle cx='80' cy='85' r='15' fill='${c.bg}' fill-opacity='0.3'/>
        <circle cx='120' cy='110' r='10' fill='${c.bg}' fill-opacity='0.25'/>
        <g fill='none' stroke='${c.accent2}' stroke-opacity='0.45' stroke-width='2'>
          <ellipse cx='100' cy='100' rx='85' ry='28' transform='rotate(-12 100 100)'/>
        </g>
        <circle cx='85' cy='120' r='6' fill='${c.accent2}' fill-opacity='0.35'/>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <circle cx='60' cy='60' r='38' fill='${c.accent2}' fill-opacity='0.28'/>
        <path d='M30 55 Q45 35 60 45 Q75 55 90 40' fill='none' stroke='${c.accent}' stroke-opacity='0.35' stroke-width='3' stroke-linecap='round'/>
        <circle cx='50' cy='50' r='7' fill='${c.bg}' fill-opacity='0.3'/>
        <circle cx='70' cy='68' r='5' fill='${c.bg}' fill-opacity='0.25'/>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <defs>
          <linearGradient id='fireGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stop-color='${c.accent2}' stop-opacity='0.95'/>
            <stop offset='30%' stop-color='${c.accent}' stop-opacity='0.7'/>
            <stop offset='70%' stop-color='${c.accent}' stop-opacity='0.2'/>
            <stop offset='100%' stop-color='${c.accent}' stop-opacity='0'/>
          </linearGradient>
        </defs>
        <circle cx='22' cy='46' r='7' fill='${c.accent2}' fill-opacity='0.85'/>
        <path d='M15 46 Q80 40 160 48 Q220 52 290 46' fill='none' stroke='url(#fireGrad)' stroke-width='4' stroke-linecap='round'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <circle cx='50' cy='50' r='32' fill='${c.accent2}' fill-opacity='0.22'/>
        <circle cx='55' cy='48' r='30' fill='${c.bg}' fill-opacity='0.82'/>
        <circle cx='45' cy='55' r='5' fill='${c.accent}' fill-opacity='0.3'/>
        <circle cx='52' cy='42' r='3' fill='${c.accent}' fill-opacity='0.25'/>
        <circle cx='58' cy='52' r='4' fill='${c.accent}' fill-opacity='0.2'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <rect x='30' y='20' width='540' height='560' rx='16' fill='none' stroke='${c.accent}' stroke-opacity='0.5' stroke-width='10'/>
        <rect x='45' y='35' width='510' height='530' rx='12' fill='none' stroke='${c.accent2}' stroke-opacity='0.35' stroke-width='3' stroke-dasharray='8 10'/>
        <path d='M70 60 L130 60 M70 120 L110 120' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='4' stroke-linecap='round'/>
        <path d='M490 60 L550 60 M510 120 L550 120' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='4' stroke-linecap='round'/>
        <path d='M70 540 L130 540 M70 480 L110 480' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='4' stroke-linecap='round'/>
        <path d='M490 540 L550 540 M510 480 L550 480' stroke='${c.accent2}' stroke-opacity='0.3' stroke-width='4' stroke-linecap='round'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='60' viewBox='0 0 1200 60'>
        <path d='M0 30 L40 10 L80 30 L120 10 L160 30 L200 10 L240 30 L280 10 L320 30 L360 10 L400 30 L440 10 L480 30 L520 10 L560 30 L600 10 L640 30 L680 10 L720 30 L760 10 L800 30 L840 10 L880 30 L920 10 L960 30 L1000 10 L1040 30 L1080 10 L1120 30 L1160 10 L1200 30' fill='none' stroke='${c.accent2}' stroke-opacity='0.4' stroke-width='3' stroke-linecap='miter'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 80 C200 120 400 80 600 90 C800 100 1000 60 1200 90 L1200 200 L0 200 Z' fill='${c.accent}' fill-opacity='0.1'/>
        <path d='M0 100 C200 140 400 100 600 110 C800 120 1000 80 1200 110' fill='none' stroke='${c.accent2}' stroke-opacity='0.25' stroke-width='3'/>
        <circle cx='300' cy='90' r='5' fill='${c.accent2}' fill-opacity='0.4'/>
        <circle cx='600' cy='100' r='4' fill='${c.accent}' fill-opacity='0.35'/>
        <circle cx='900' cy='85' r='5' fill='${c.accent2}' fill-opacity='0.4'/>
      </svg>
    `),
  };
}

function buildStarPrincessAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <path d='M120 50 L128 78 L156 78 L132 96 L140 124 L120 106 L100 124 L108 96 L84 78 L112 78 Z' fill='${c.accent2}' fill-opacity='0.55'/>
        <path d='M120 110 L125 128 L143 128 L128 140 L133 158 L120 148 L107 158 L112 140 L97 128 L115 128 Z' fill='${c.accent}' fill-opacity='0.4'/>
        <path d='M120 170 L123 183 L136 183 L125 192 L129 205 L120 196 L111 205 L115 192 L104 183 L117 183 Z' fill='${c.accent2}' fill-opacity='0.35'/>
        <circle cx='80' cy='60' r='2' fill='${c.accent2}' fill-opacity='0.5'/>
        <circle cx='165' cy='90' r='2.5' fill='${c.accent}' fill-opacity='0.4'/>
        <circle cx='95' cy='130' r='1.5' fill='${c.accent2}' fill-opacity='0.45'/>
        <circle cx='150' cy='160' r='2' fill='${c.accent}' fill-opacity='0.35'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <path d='M100 40 Q115 20 140 40 Q160 60 140 100 Q115 140 100 100 Q85 60 100 40 Z' fill='${c.accent2}' fill-opacity='0.3'/>
        <path d='M100 40 Q115 20 140 40 Q160 60 140 100 Q115 140 100 100 Q85 60 100 40 Z' fill='none' stroke='${c.accent}' stroke-opacity='0.2' stroke-width='2'/>
        <circle cx='115' cy='70' r='6' fill='${c.bg}' fill-opacity='0.35'/>
        <circle cx='125' cy='60' r='4' fill='${c.bg}' fill-opacity='0.3'/>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <path d='M60 30 Q80 20 85 50 Q90 80 60 80 Q40 80 35 55 Q30 20 60 30 Z' fill='${c.accent}' fill-opacity='0.22'/>
        <circle cx='55' cy='55' r='5' fill='${c.bg}' fill-opacity='0.35'/>
        <circle cx='65' cy='45' r='3' fill='${c.bg}' fill-opacity='0.3'/>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <defs>
          <linearGradient id='sparkGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stop-color='${c.accent2}' stop-opacity='0.95'/>
            <stop offset='50%' stop-color='${c.accent}' stop-opacity='0.5'/>
            <stop offset='100%' stop-color='${c.accent2}' stop-opacity='0'/>
          </linearGradient>
        </defs>
        <path d='M20 40 L28 48 L20 56 L12 48 Z' fill='${c.accent2}' fill-opacity='0.85'/>
        <path d='M28 48 Q100 44 180 47 Q230 49 290 46' fill='none' stroke='url(#sparkGrad)' stroke-width='2.5' stroke-linecap='round'/>
        <circle cx='210' cy='47' r='2' fill='${c.accent2}' fill-opacity='0.4'/>
        <circle cx='250' cy='45' r='1.5' fill='${c.accent}' fill-opacity='0.35'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <circle cx='50' cy='50' r='30' fill='${c.accent2}' fill-opacity='0.2'/>
        <circle cx='55' cy='48' r='28' fill='${c.bg}' fill-opacity='0.8'/>
        <circle cx='42' cy='50' r='1.8' fill='${c.accent}' fill-opacity='0.4'/>
        <circle cx='48' cy='44' r='1.5' fill='${c.accent}' fill-opacity='0.35'/>
        <path d='M52 40 Q58 42 56 46' fill='none' stroke='${c.accent}' stroke-opacity='0.25' stroke-width='1.5' stroke-linecap='round'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <path d='M100 40 C160 20 120 80 180 30 C240 60 220 20 300 40 C380 60 360 30 420 50 C480 40 460 80 520 50 C540 120 560 80 560 140 C580 200 560 180 570 260 C590 320 580 300 570 360 C560 420 580 400 540 460 C500 500 540 480 480 520 C420 560 460 540 380 560 C320 580 360 560 280 570 C220 580 240 560 160 550 C100 540 120 560 80 500 C40 440 60 480 40 400 C20 340 40 380 30 300 C20 240 40 280 40 200 C40 140 60 180 80 100 C100 60 120 80 100 40 Z' fill='none' stroke='${c.accent2}' stroke-opacity='0.35' stroke-width='5'/>
        <path d='M120 60 C170 40 160 90 220 50 C260 70 250 40 300 60 C340 80 330 50 390 70 C430 60 410 90 470 70 C500 130 520 100 530 170 C550 220 540 200 540 270 C550 330 540 310 520 370 C500 430 530 410 490 470 C450 500 470 480 420 520 C380 550 420 530 360 550 C300 570 340 550 280 560 C220 570 250 550 190 540 C130 530 150 550 110 500 C70 450 90 480 70 420 C50 360 70 390 60 320 C50 260 60 290 70 230 C80 170 70 200 100 130 C130 90 110 120 120 60 Z' fill='none' stroke='${c.accent}' stroke-opacity='0.2' stroke-width='2' stroke-dasharray='6 8'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <path d='M0 40 Q 150 10 300 40 Q 450 70 600 40 Q 750 10 900 40 Q 1050 70 1200 40' fill='none' stroke='${c.accent2}' stroke-opacity='0.25' stroke-width='2'/>
        <circle cx='150' cy='25' r='3' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='300' cy='40' r='4' fill='${c.accent2}' fill-opacity='0.45'/>
        <circle cx='450' cy='55' r='3' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='600' cy='40' r='5' fill='${c.accent2}' fill-opacity='0.45'/>
        <circle cx='750' cy='25' r='3' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='900' cy='40' r='4' fill='${c.accent2}' fill-opacity='0.45'/>
        <circle cx='1050' cy='55' r='3' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='1200' cy='40' r='5' fill='${c.accent2}' fill-opacity='0.45'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 110 C 200 80 400 110 600 100 C 800 90 1000 70 1200 100 L1200 200 L0 200 Z' fill='${c.accent2}' fill-opacity='0.1'/>
        <path d='M0 130 C 200 100 400 130 600 120 C 800 110 1000 90 1200 120' fill='none' stroke='${c.accent}' stroke-opacity='0.2' stroke-width='2'/>
        <path d='M200 100 L204 108 L200 116 L196 108 Z' fill='${c.accent2}' fill-opacity='0.4'/>
        <path d='M600 90 L604 98 L600 106 L596 98 Z' fill='${c.accent}' fill-opacity='0.35'/>
        <path d='M1000 80 L1004 88 L1000 96 L996 88 Z' fill='${c.accent2}' fill-opacity='0.4'/>
      </svg>
    `),
  };
}

function buildUnicornDreamsAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <path d='M120 30 L128 70 L166 70 L132 94 L142 130 L120 110 L98 130 L108 94 L74 70 L112 70 Z' fill='${c.accent2}' fill-opacity='0.45'/>
        <ellipse cx='120' cy='180' rx='18' ry='14' fill='${c.accent}' fill-opacity='0.2'/>
        <path d='M120 160 Q 135 150 140 170 Q 145 190 135 194 Q 125 198 120 180' fill='${c.accent2}' fill-opacity='0.35'/>
        <path d='M110 166 C 85 150 60 160 50 170 C 60 155 85 148 110 166 Z' fill='${c.accent}' fill-opacity='0.15'/>
        <path d='M130 166 C 155 150 180 160 190 170 C 180 155 155 148 130 166 Z' fill='${c.accent2}' fill-opacity='0.15'/>
        <circle cx='90' cy='50' r='2.5' fill='${c.accent}' fill-opacity='0.5'/>
        <circle cx='155' cy='70' r='2' fill='${c.accent2}' fill-opacity='0.5'/>
        <circle cx='100' cy='140' r='2' fill='${c.accent}' fill-opacity='0.4'/>
        <circle cx='145' cy='150' r='1.8' fill='${c.accent2}' fill-opacity='0.4'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <path d='M60 100 L100 40 L140 100 Z' fill='${c.accent2}' fill-opacity='0.2'/>
        <circle cx='100' cy='100' r='35' fill='${c.accent}' fill-opacity='0.25'/>
        <circle cx='90' cy='90' r='8' fill='${c.bg}' fill-opacity='0.3'/>
        <circle cx='110' cy='105' r='5' fill='${c.bg}' fill-opacity='0.25'/>
        <path d='M100 135 L98 145 M100 135 L102 145 M96 142 L104 142' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='1.5' stroke-linecap='round'/>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <path d='M60 30 Q72 50 72 70 Q72 90 60 100 Q48 90 48 70 Q48 50 60 30 Z' fill='${c.accent2}' fill-opacity='0.22'/>
        <circle cx='56' cy='58' r='4' fill='${c.bg}' fill-opacity='0.3'/>
        <circle cx='64' cy='68' r='3' fill='${c.bg}' fill-opacity='0.25'/>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <defs>
          <linearGradient id='magicGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stop-color='${c.accent2}' stop-opacity='0.9'/>
            <stop offset='30%' stop-color='${c.accent}' stop-opacity='0.6'/>
            <stop offset='70%' stop-color='${c.accent2}' stop-opacity='0.25'/>
            <stop offset='100%' stop-color='${c.accent2}' stop-opacity='0'/>
          </linearGradient>
        </defs>
        <circle cx='25' cy='44' r='5' fill='${c.accent2}' fill-opacity='0.85'/>
        <path d='M20 44 Q90 40 170 46 Q230 48 290 44' fill='none' stroke='url(#magicGrad)' stroke-width='3' stroke-linecap='round'/>
        <circle cx='160' cy='45' r='2' fill='${c.accent}' fill-opacity='0.4'/>
        <circle cx='200' cy='43' r='1.5' fill='${c.accent2}' fill-opacity='0.35'/>
        <circle cx='240' cy='46' r='2.5' fill='${c.accent}' fill-opacity='0.3'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <circle cx='50' cy='50' r='28' fill='${c.accent2}' fill-opacity='0.18'/>
        <circle cx='40' cy='45' r='26' fill='${c.bg}' fill-opacity='0.8'/>
        <circle cx='44' cy='48' r='2' fill='${c.accent}' fill-opacity='0.3'/>
        <circle cx='38' cy='42' r='1.5' fill='${c.accent}' fill-opacity='0.25'/>
        <path d='M34 38 Q36 34 40 38' fill='none' stroke='${c.accent}' stroke-opacity='0.2' stroke-width='1.2' stroke-linecap='round'/>
        <circle cx='55' cy='52' r='1.5' fill='${c.accent2}' fill-opacity='0.25'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <path d='M80 40 C 140 20 160 60 220 35 C 280 50 300 25 380 38 C 460 50 440 70 520 45 C 550 100 570 90 565 150 C 580 210 560 200 570 270 C 580 340 570 330 555 400 C 540 460 560 450 500 510 C 440 550 460 520 400 550 C 340 570 360 540 300 565 C 240 580 260 550 200 570 C 140 560 160 540 100 510 C 60 460 80 490 50 410 C 30 350 40 380 25 300 C 20 240 30 270 20 200 C 20 140 40 170 50 100 C 60 60 80 90 80 40 Z' fill='none' stroke='${c.accent2}' stroke-opacity='0.35' stroke-width='4'/>
        <path d='M100 60 C 160 40 180 80 240 55 C 300 70 320 45 400 58 C 470 70 450 85 515 60 C 540 110 555 100 550 155 C 565 215 555 205 560 270 C 570 330 560 320 545 385 C 535 440 555 435 500 490 C 445 530 460 510 410 535 C 355 555 370 530 315 545 C 260 558 275 535 220 550 C 160 540 175 525 120 500 C 80 455 95 480 70 415 C 50 360 58 385 45 315 C 38 255 48 280 40 215 C 40 158 55 185 60 115 C 70 75 85 105 100 60 Z' fill='none' stroke='${c.accent}' stroke-opacity='0.18' stroke-width='2' stroke-dasharray='5 7'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <path d='M0 40 Q 100 15 200 40 Q 300 65 400 40 Q 500 15 600 40 Q 700 65 800 40 Q 900 15 1000 40 Q 1100 65 1200 40' fill='none' stroke='${c.accent2}' stroke-opacity='0.28' stroke-width='2'/>
        <circle cx='200' cy='40' r='3' fill='${c.accent}' fill-opacity='0.45'/>
        <circle cx='400' cy='40' r='4' fill='${c.accent2}' fill-opacity='0.4'/>
        <circle cx='600' cy='40' r='3' fill='${c.accent}' fill-opacity='0.45'/>
        <circle cx='800' cy='40' r='4' fill='${c.accent2}' fill-opacity='0.4'/>
        <circle cx='1000' cy='40' r='3' fill='${c.accent}' fill-opacity='0.45'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 100 C250 70 500 110 750 90 C1000 70 1100 50 1200 90 L1200 200 L0 200 Z' fill='${c.accent}' fill-opacity='0.08'/>
        <path d='M0 125 C250 95 500 135 750 115 C1000 95 1100 75 1200 115' fill='none' stroke='${c.accent2}' stroke-opacity='0.22' stroke-width='2.5'/>
        <circle cx='300' cy='95' r='3' fill='${c.accent}' fill-opacity='0.35'/>
        <circle cx='750' cy='100' r='3.5' fill='${c.accent2}' fill-opacity='0.35'/>
        <circle cx='950' cy='85' r='2.5' fill='${c.accent}' fill-opacity='0.3'/>
      </svg>
    `),
  };
}

function buildOverlayAssets({
  bg,
  accent,
  accent2,
  dark,
  onDark,
  onAccent,
}: {
  bg: string;
  accent: string;
  accent2: string;
  dark: string;
  onDark: string;
  onAccent: string;
}): OverlayAssets {
  const variant = detectThemeVariant(accent);
  const stars = buildStars(bg, accent2);
  const constellation = buildConstellation(bg, accent, accent2);
  const spaceDust = buildSpaceDust(bg, accent, accent2);

  const c = { bg, accent, accent2, dark, onDark, onAccent };

  let themed: Omit<OverlayAssets, "stars" | "constellation" | "spaceDust">;
  switch (variant) {
    case "mars-mission":
      themed = buildMarsMissionAssets(c);
      break;
    case "star-princess":
      themed = buildStarPrincessAssets(c);
      break;
    case "unicorn-dreams":
      themed = buildUnicornDreamsAssets(c);
      break;
    default:
      themed = buildCosmicCommanderAssets(c);
  }

  return { stars, constellation, spaceDust, ...themed };
}

export function useOverlayAssets(): OverlayAssets {
  const [assets, setAssets] = useState<OverlayAssets>(() => {
    try {
      const vars = readInvitationCssVars();
      if (!vars.bg || !vars.accent || !vars.accent2 || !vars.dark || !vars.onDark || !vars.onAccent) return EMPTY_OVERLAY_ASSETS;
      return buildOverlayAssets(vars);
    } catch {
      return EMPTY_OVERLAY_ASSETS;
    }
  });

  const recompute = useCallback(() => {
    const vars = readInvitationCssVars();
    if (!vars.bg || !vars.accent || !vars.accent2 || !vars.dark || !vars.onDark || !vars.onAccent) return;
    setAssets(buildOverlayAssets(vars));
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
