"use client";

import { useCallback, useEffect, useState } from "react";

type ThemeVariant = "cyber-arcade" | "gameboy-classic" | "neon-sunset";

export type OverlayAssets = {
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
    bg: get("--invitation-bg") || "#0c061a",
    accent: get("--invitation-accent") || "#ff007f",
    accent2: get("--invitation-accent-2") || "#00f0ff",
    dark: get("--invitation-dark") || "#05020a",
    onDark: get("--invitation-on-dark") || "#ffffff",
    onAccent: get("--invitation-on-accent") || "#ffffff",
  };
}

function detectThemeVariant(accent: string): ThemeVariant {
  const a = accent.toLowerCase().trim();
  if (a === "#306230" || a === "306230" || a === "#8bac0f" || a === "8bac0f") return "gameboy-classic";
  if (a === "#ff5e00" || a === "ff5e00") return "neon-sunset";
  return "cyber-arcade";
}

// Bouncing pixel stars and floating 8-bit coins
function buildStars(bg: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
      <!-- 8-Bit Pixel Cross Stars -->
      <g fill='${accent2}' fill-opacity='0.16'>
        <path d='M80 110 h4 v4 h-4 z M76 114 h12 v4 h-12 z M80 118 h4 v4 h-4 z'/>
        <path d='M340 190 h4 v4 h-4 z M336 194 h12 v4 h-12 z M340 198 h4 v4 h-4 z'/>
        <path d='M680 140 h4 v4 h-4 z M676 144 h12 v4 h-12 z M680 148 h4 v4 h-4 z'/>
        <path d='M960 170 h4 v4 h-4 z M956 174 h12 v4 h-12 z M960 178 h4 v4 h-4 z'/>
        <path d='M180 340 h4 v4 h-4 z M176 344 h12 v4 h-12 z M180 348 h4 v4 h-4 z'/>
        <path d='M580 440 h4 v4 h-4 z M576 444 h12 v4 h-12 z M580 448 h4 v4 h-4 z'/>
        <path d='M890 410 h4 v4 h-4 z M886 414 h12 v4 h-12 z M890 418 h4 v4 h-4 z'/>
        <path d='M1150 470 h4 v4 h-4 z M1146 474 h12 v4 h-12 z M1150 478 h4 v4 h-4 z'/>
      </g>
      <!-- Small Pixel Dots -->
      <g fill='${accent2}' fill-opacity='0.25'>
        <rect x='200' y='60' width='4' height='4'/>
        <rect x='500' y='90' width='4' height='4'/>
        <rect x='820' y='50' width='4' height='4'/>
        <rect x='60' y='400' width='4' height='4'/>
        <rect x='450' y='320' width='4' height='4'/>
        <rect x='720' y='380' width='4' height='4'/>
        <rect x='1030' y='350' width='4' height='4'/>
        <rect x='280' y='720' width='4' height='4'/>
        <rect x='700' y='640' width='4' height='4'/>
        <rect x='1120' y='730' width='4' height='4'/>
      </g>
      <!-- 8-Bit Pixel Coins -->
      <g fill='${accent2}' fill-opacity='0.12'>
        <rect x='140' y='280' width='16' height='16' rx='2'/>
        <rect x='380' y='100' width='16' height='16' rx='2'/>
        <rect x='620' y='300' width='16' height='16' rx='2'/>
        <rect x='920' y='300' width='16' height='16' rx='2'/>
        <rect x='250' y='580' width='16' height='16' rx='2'/>
        <rect x='800' y='580' width='16' height='16' rx='2'/>
      </g>
    </svg>
  `);
}

// 8-Bit Motherboard / Circuit Board grid with square nodes
function buildConstellation(bg: string, accent: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='200' viewBox='0 0 600 200'>
      <g fill='none' stroke='${accent2}' stroke-opacity='0.3' stroke-width='2' stroke-linecap='square'>
        <!-- Orthogonal and 45-degree circuit path lines -->
        <path d='M40 100 h50 l40 -40 h60 l40 40 h120 l30 -30 h40'/>
        <path d='M150 100 v40 h-40'/>
        <path d='M290 100 v30 l30 30 h40'/>
        <path d='M400 90 l30 30 h80 l30 -30'/>
      </g>
      <!-- Pixel Square Nodes -->
      <g fill='${accent}' fill-opacity='0.6'>
        <rect x='36' y='96' width='8' height='8'/>
        <rect x='86' y='96' width='8' height='8'/>
        <rect x='176' y='56' width='8' height='8'/>
        <rect x='286' y='96' width='8' height='8'/>
        <rect x='396' y='86' width='8' height='8'/>
        <rect x='446' y='116' width='8' height='8'/>
        <rect x='516' y='116' width='8' height='8'/>
        <rect x='106' y='136' width='8' height='8'/>
        <rect x='356' y='156' width='8' height='8'/>
      </g>
    </svg>
  `);
}

// Synthwave 3D Perspective Glowing Neon Grid Lines
function buildSpaceDust(bg: string, accent: string, accent2: string): string {
  return svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='300' viewBox='0 0 800 300'>
      <defs>
        <linearGradient id='gridFade' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='0'/>
          <stop offset='100%' stop-color='${accent}' stop-opacity='0.25'/>
        </linearGradient>
      </defs>
      <!-- Perspective horizontal lines -->
      <g stroke='url(#gridFade)' stroke-width='2'>
        <line x1='0' y1='100' x2='800' y2='100'/>
        <line x1='0' y1='130' x2='800' y2='130'/>
        <line x1='0' y1='170' x2='800' y2='170'/>
        <line x1='0' y1='220' x2='800' y2='220'/>
        <line x1='0' y1='280' x2='800' y2='280'/>
      </g>
      <!-- Perspective vertical vanishing lines -->
      <g stroke='${accent}' stroke-opacity='0.18' stroke-width='1.5'>
        <line x1='400' y1='80' x2='-400' y2='300'/>
        <line x1='400' y1='80' x2='-200' y2='300'/>
        <line x1='400' y1='80' x2='0' y2='300'/>
        <line x1='400' y1='80' x2='200' y2='300'/>
        <line x1='400' y1='80' x2='400' y2='300'/>
        <line x1='400' y1='80' x2='600' y2='300'/>
        <line x1='400' y1='80' x2='800' y2='300'/>
        <line x1='400' y1='80' x2='1000' y2='300'/>
        <line x1='400' y1='80' x2='1200' y2='300'/>
      </g>
    </svg>
  `);
}

// --- Cyber Arcade (Cyberpunk Neon Game theme) ---
function buildCyberArcadeAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <!-- Arcade Cabinet Body (Pixel style) -->
        <rect x='40' y='30' width='160' height='230' fill='${c.dark}' stroke='${c.accent}' stroke-width='6' rx='4'/>
        <!-- Marquee / Title Board -->
        <rect x='50' y='40' width='140' height='35' fill='${c.accent}'/>
        <rect x='55' y='45' width='130' height='25' fill='${c.dark}'/>
        <!-- Mini pixel text overlay representing arcade neon -->
        <rect x='80' y='55' width='80' height='6' fill='${c.accent2}'/>
        <!-- CRT Screen Screen -->
        <rect x='50' y='85' width='140' height='100' fill='#0f0422' stroke='${c.accent2}' stroke-width='4'/>
        <!-- Scanlines effect on CRT screen -->
        <line x1='50' y1='105' x2='190' y2='105' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='2'/>
        <line x1='50' y1='125' x2='190' y2='125' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='2'/>
        <line x1='50' y1='145' x2='190' y2='145' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='2'/>
        <line x1='50' y1='165' x2='190' y2='165' stroke='${c.accent2}' stroke-opacity='0.2' stroke-width='2'/>
        <!-- Little pixel game character on screen -->
        <rect x='110' y='130' width='20' height='20' fill='${c.accent}' rx='2'/>
        <rect x='115' y='135' width='4' height='4' fill='white'/>
        <rect x='125' y='135' width='4' height='4' fill='white'/>
        <!-- Control Panel shelf -->
        <polygon points='30,195 210,195 200,225 40,225' fill='${c.accent}'/>
        <!-- Joystick -->
        <rect x='85' y='180' width='6' height='20' fill='${c.accent2}'/>
        <circle cx='88' cy='175' r='8' fill='red'/>
        <!-- Action Buttons -->
        <circle cx='130' cy='205' r='5' fill='${c.accent2}'/>
        <circle cx='145' cy='205' r='5' fill='yellow'/>
        <circle cx='160' cy='205' r='5' fill='lime'/>
        <!-- Coin Door -->
        <rect x='95' y='235' width='50' height='25' fill='#222' stroke='gray' stroke-width='2'/>
        <rect x='105' y='240' width='10' height='15' fill='orange' fill-opacity='0.8'/>
        <rect x='125' y='240' width='10' height='15' fill='orange' fill-opacity='0.8'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <!-- 8-Bit Pixel Gamepad Controller -->
        <g stroke='${c.accent}' stroke-width='4' fill='${c.dark}' stroke-linejoin='miter'>
          <rect x='40' y='70' width='120' height='60' rx='10' fill='${c.dark}'/>
          <!-- Left D-pad (Pixel Cross) -->
          <path d='M65 90 h10 v10 h-10 z M75 80 h10 v30 h-10 z M85 90 h10 v10 h-10 z' fill='${c.accent2}' stroke='none'/>
          <!-- Right Buttons -->
          <circle cx='125' cy='105' r='8' fill='red' stroke='none'/>
          <circle cx='143' cy='95' r='8' fill='yellow' stroke='none'/>
          <!-- Select/Start Pills -->
          <rect x='92' y='110' width='16' height='6' rx='3' fill='gray' stroke='none'/>
        </g>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <!-- 8-Bit Retro Gaming Cartridge -->
        <g stroke='${c.accent2}' stroke-width='4' fill='${c.accent}' stroke-linejoin='miter'>
          <polygon points='30,30 90,30 90,90 30,90' />
          <!-- Inner Label slot -->
          <rect x='40' y='40' width='40' height='35' fill='${c.dark}' stroke='none'/>
          <!-- Pixel detail stripes on cartridge body -->
          <line x1='40' y1='80' x2='80' y2='80' stroke='${c.accent2}' stroke-width='2'/>
          <line x1='40' y1='84' x2='80' y2='84' stroke='${c.accent2}' stroke-width='2'/>
        </g>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <!-- 8-Bit Glowing Pixel Laser / Beam -->
        <defs>
          <linearGradient id='laserGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stop-color='${c.accent}' stop-opacity='0.95'/>
            <stop offset='50%' stop-color='${c.accent2}' stop-opacity='0.7'/>
            <stop offset='100%' stop-color='${c.accent2}' stop-opacity='0'/>
          </linearGradient>
        </defs>
        <!-- Pixel blocks trailing laser -->
        <rect x='10' y='45' width='12' height='10' fill='${c.accent}'/>
        <rect x='28' y='46' width='16' height='8' fill='${c.accent2}'/>
        <rect x='50' y='48' width='240' height='4' fill='url(#laserGrad)'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <!-- 8-Bit Pixel Invader / Alien Enemy -->
        <g fill='${c.accent2}' stroke='none'>
          <!-- Core row 1 -->
          <rect x='42' y='30' width='16' height='8'/>
          <!-- Antennas -->
          <rect x='34' y='22' width='8' height='8'/>
          <rect x='58' y='22' width='8' height='8'/>
          <!-- Core body row 2 -->
          <rect x='30' y='38' width='40' height='8'/>
          <!-- Eyes slot -->
          <rect x='26' y='46' width='48' height='8'/>
          <!-- Core body row 3 -->
          <rect x='34' y='54' width='32' height='8'/>
          <!-- Tentacles / legs -->
          <rect x='30' y='62' width='8' height='12'/>
          <rect x='46' y='62' width='8' height='12'/>
          <rect x='62' y='62' width='8' height='12'/>
        </g>
        <!-- Pupil cutout pixels (overlaying dark) -->
        <rect x='38' y='46' width='8' height='8' fill='${c.dark}'/>
        <rect x='54' y='46' width='8' height='8' fill='${c.dark}'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <!-- Chunky Pixel CRT monitor Frame -->
        <rect x='20' y='20' width='560' height='560' rx='20' fill='none' stroke='${c.accent}' stroke-width='16' stroke-linejoin='miter'/>
        <!-- Sub-grid overlay representing chassis pixels -->
        <rect x='40' y='40' width='520' height='520' rx='10' fill='none' stroke='${c.accent2}' stroke-opacity='0.4' stroke-width='4' stroke-dasharray='12 16'/>
        <!-- Corner Screw blocks -->
        <rect x='45' y='45' width='14' height='14' fill='gray'/>
        <rect x='541' y='45' width='14' height='14' fill='gray'/>
        <rect x='541' y='541' width='14' height='14' fill='gray'/>
        <rect x='45' y='541' width='14' height='14' fill='gray'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <!-- 8-bit Mario-style Pixel Ground / Bricks -->
        <rect x='0' y='40' width='1200' height='40' fill='#8B5A2B' stroke='${c.dark}' stroke-width='4'/>
        <!-- Brick Top Grass strip -->
        <rect x='0' y='20' width='1200' height='20' fill='#228B22' stroke='${c.dark}' stroke-width='4'/>
        <!-- Brick separators -->
        <g stroke='${c.dark}' stroke-width='3'>
          <line x1='0' y1='40' x2='1200' y2='40'/>
          <line x1='0' y1='60' x2='1200' y2='60'/>
          <line x1='80' y1='40' x2='80' y2='60'/>
          <line x1='240' y1='40' x2='240' y2='60'/>
          <line x1='400' y1='40' x2='400' y2='60'/>
          <line x1='560' y1='40' x2='560' y2='60'/>
          <line x1='720' y1='40' x2='720' y2='60'/>
          <line x1='880' y1='40' x2='880' y2='60'/>
          <line x1='1040' y1='40' x2='1040' y2='60'/>
          
          <line x1='160' y1='60' x2='160' y2='80'/>
          <line x1='320' y1='60' x2='320' y2='80'/>
          <line x1='480' y1='60' x2='480' y2='80'/>
          <line x1='640' y1='60' x2='640' y2='80'/>
          <line x1='800' y1='60' x2='800' y2='80'/>
          <line x1='960' y1='60' x2='960' y2='80'/>
          <line x1='1120' y1='60' x2='1120' y2='80'/>
        </g>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <!-- Synthwave Landscape with neon mountains -->
        <path d='M0 160 L150 70 L300 160 L450 90 L600 160 L750 60 L900 160 L1050 80 L1200 160 L1200 200 L0 200 Z' fill='${c.dark}' stroke='${c.accent}' stroke-width='4'/>
        <line x1='0' y1='160' x2='1200' y2='160' stroke='${c.accent2}' stroke-width='6'/>
        <!-- Pixel sun in background -->
        <circle cx='600' cy='120' r='50' fill='orange' fill-opacity='0.25'/>
        <rect x='540' y='110' width='120' height='4' fill='${c.bg}'/>
        <rect x='540' y='125' width='120' height='6' fill='${c.bg}'/>
        <rect x='540' y='140' width='120' height='8' fill='${c.bg}'/>
      </svg>
    `),
  };
}

// --- Gameboy Classic (Retro Handheld Game theme) ---
function buildGameboyClassicAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <!-- Gameboy Classic Shell -->
        <rect x='30' y='20' width='180' height='240' fill='#b5b5ad' stroke='${c.accent}' stroke-width='6' rx='8'/>
        <!-- Screen Bezel -->
        <rect x='45' y='35' width='150' height='100' fill='#7c7c72' stroke='${c.dark}' stroke-width='4' rx='4'/>
        <!-- Olive LCD Screen -->
        <rect x='60' y='45' width='120' height='75' fill='${c.bg}' stroke='black' stroke-width='2'/>
        <!-- Blinking Screen characters -->
        <circle cx='90' cy='80' r='10' fill='${c.accent}'/>
        <circle cx='130' cy='80' r='10' fill='${c.accent}'/>
        <!-- D-Pad (Pixelated cross) -->
        <path d='M65 175 h14 v14 h-14 z M79 161 h14 v42 h-14 z M93 175 h14 v14 h-14 z' fill='${c.dark}'/>
        <!-- A and B buttons (Round, slanted red/dark red) -->
        <circle cx='155' cy='195' r='12' fill='${c.accent}' stroke='${c.dark}' stroke-width='3'/>
        <circle cx='185' cy='185' r='12' fill='${c.accent}' stroke='${c.dark}' stroke-width='3'/>
        <!-- Select/Start rubber buttons -->
        <rect x='100' y='225' width='20' height='6' rx='3' fill='${c.dark}' transform='rotate(-25 110 228)'/>
        <rect x='130' y='225' width='20' height='6' rx='3' fill='${c.dark}' transform='rotate(-25 140 228)'/>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <!-- Gameboy classic layout D-Pad floating -->
        <g fill='${c.dark}' stroke='none'>
          <path d='M70 70 h20 v20 h-20 z M90 50 h20 v60 h-20 z M110 70 h20 v20 h-20 z'/>
        </g>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <!-- Large pixel 8-bit Heart -->
        <path d='M30 40 h20 v10 h-20 z M50 30 h20 v10 h-20 z M70 40 h20 v10 h-20 z M20 50 h80 v10 h-80 z M30 60 h60 v10 h-60 z M40 70 h40 v10 h-40 z M50 80 h20 v10 h-20 z' fill='${c.accent}'/>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <g fill='${c.dark}'>
          <rect x='20' y='45' width='80' height='10'/>
          <rect x='110' y='47' width='60' height='6'/>
          <rect x='180' y='49' width='40' height='2'/>
        </g>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <!-- Little pixel 8-bit ghost enemy -->
        <path d='M35 30 h30 v10 h-30 z M25 40 h50 v40 h-50 z M25 80 h10 v10 h-10 z M45 80 h10 v10 h-10 z M65 80 h10 v10 h-10 z' fill='${c.accent}'/>
        <rect x='35' y='50' width='8' height='10' fill='white'/>
        <rect x='55' y='50' width='8' height='10' fill='white'/>
        <rect x='35' y='55' width='4' height='5' fill='blue'/>
        <rect x='55' y='55' width='4' height='5' fill='blue'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <rect x='25' y='25' width='550' height='550' rx='12' fill='none' stroke='${c.dark}' stroke-width='14'/>
        <rect x='45' y='45' width='510' height='510' rx='6' fill='none' stroke='${c.accent}' stroke-opacity='0.4' stroke-width='4' stroke-dasharray='10 12'/>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='60' viewBox='0 0 1200 60'>
        <rect x='0' y='20' width='1200' height='40' fill='${c.dark}'/>
        <line x1='0' y1='10' x2='1200' y2='10' stroke='${c.accent}' stroke-width='4' stroke-dasharray='16 16'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <rect x='0' y='80' width='1200' height='120' fill='${c.dark}'/>
        <line x1='0' y1='80' x2='1200' y2='80' stroke='${c.accent}' stroke-width='6'/>
      </svg>
    `),
  };
}

// --- Neon Sunset (Retro Synthwave Sunset theme) ---
function buildNeonSunsetAssets(c: { bg: string; accent: string; accent2: string; dark: string; onDark: string; onAccent: string }) {
  return {
    heroGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='240' height='280' viewBox='0 0 240 280'>
        <!-- Radiant Sun background (synthwave sunset style) -->
        <circle cx='120' cy='120' r='75' fill='url(#sunGrad)'/>
        <!-- Sun horizontal lines cutouts -->
        <rect x='40' y='110' width='160' height='5' fill='${c.bg}'/>
        <rect x='40' y='130' width='160' height='7' fill='${c.bg}'/>
        <rect x='40' y='150' width='160' height='9' fill='${c.bg}'/>
        <rect x='40' y='170' width='160' height='11' fill='${c.bg}'/>
        <!-- Synthwave grid road in front -->
        <polygon points='10,210 230,210 240,270 0,270' fill='${c.dark}' stroke='${c.accent}' stroke-width='4'/>
        <!-- Vertical grid lines -->
        <line x1='120' y1='210' x2='120' y2='270' stroke='${c.accent2}' stroke-width='2'/>
        <line x1='120' y1='210' x2='60' y2='270' stroke='${c.accent2}' stroke-width='2'/>
        <line x1='120' y1='210' x2='180' y2='270' stroke='${c.accent2}' stroke-width='2'/>
        <defs>
          <linearGradient id='sunGrad' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stop-color='yellow'/>
            <stop offset='100%' stop-color='${c.accent}'/>
          </linearGradient>
        </defs>
      </svg>
    `),
    floatingPlanet1: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
        <!-- Bouncing 8-Bit Pixel Cloud -->
        <path d='M50 80 h100 v10 h-100 z M40 90 h120 v10 h-120 z M30 100 h140 v10 h-140 z M50 110 h100 v10 h-100 z' fill='${c.accent2}' fill-opacity='0.6'/>
      </svg>
    `),
    floatingPlanet2: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
        <!-- Bouncing Pixel palm tree -->
        <g fill='${c.accent}' stroke='none'>
          <!-- Trunk -->
          <rect x='56' y='60' width='8' height='40'/>
          <rect x='58' y='50' width='8' height='10'/>
          <!-- Fronds / Leaves -->
          <path d='M40 40 h40 v10 h-40 z M30 50 h60 v10 h-60 z M20 60 h20 v10 h-20 z M80 60 h20 v10 h-20 z'/>
        </g>
      </svg>
    `),
    shootingElement: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'>
        <rect x='20' y='45' width='150' height='6' fill='yellow' fill-opacity='0.8' rx='3'/>
        <rect x='100' y='47' width='120' height='2' fill='${c.accent}'/>
      </svg>
    `),
    moonOrbiter: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <!-- Pixel crescent Moon -->
        <path d='M40 30 C55 30 65 40 65 55 C65 70 55 80 40 80 C50 80 58 72 58 55 C58 38 50 30 40 30 Z' fill='yellow' fill-opacity='0.85'/>
      </svg>
    `),
    frame: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
        <rect x='30' y='30' width='540' height='540' rx='10' fill='none' stroke='url(#neonSunsetBorder)' stroke-width='10'/>
        <defs>
          <linearGradient id='neonSunsetBorder' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='yellow'/>
            <stop offset='50%' stop-color='${c.accent}'/>
            <stop offset='100%' stop-color='${c.accent2}'/>
          </linearGradient>
        </defs>
      </svg>
    `),
    divider: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'>
        <path d='M0 40 C 300 20 600 60 900 30 C 1050 20 1150 45 1200 40 L1200 80 L0 80 Z' fill='${c.dark}' stroke='${c.accent}' stroke-width='3'/>
        <line x1='0' y1='40' x2='1200' y2='40' stroke='yellow' stroke-width='3'/>
      </svg>
    `),
    footerGraphic: svgToDataUri(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='200' viewBox='0 0 1200 200'>
        <path d='M0 100 C 300 120 600 80 900 110 L1200 100 L1200 200 L0 200 Z' fill='${c.dark}'/>
        <line x1='0' y1='100' x2='1200' y2='100' stroke='${c.accent}' stroke-width='4'/>
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
    case "gameboy-classic":
      themed = buildGameboyClassicAssets(c);
      break;
    case "neon-sunset":
      themed = buildNeonSunsetAssets(c);
      break;
    default:
      themed = buildCyberArcadeAssets(c);
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
