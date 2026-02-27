const svgToDataUri = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

const SKY = "#38BDF8";
const NAVY = "#0B1B2A";

export const AMALTHEA_OVERLAY_ASSETS = {
  bottomTitleGraphic: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='340' viewBox='0 0 1200 340'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='${SKY}' stop-opacity='0.00'/>
          <stop offset='1' stop-color='${SKY}' stop-opacity='0.18'/>
        </linearGradient>
      </defs>
      <path d='M0,220 C180,290 420,310 600,250 C780,190 1020,170 1200,240 L1200,340 L0,340 Z' fill='url(%23g)'/>
      <path d='M0,230 C200,300 400,300 600,250 C800,200 1000,180 1200,245' fill='none' stroke='${SKY}' stroke-opacity='0.25' stroke-width='4' stroke-linecap='round'/>
    </svg>
  `),
  heroFrame: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'>
      <circle cx='260' cy='260' r='220' fill='none' stroke='${SKY}' stroke-opacity='0.55' stroke-width='10' stroke-dasharray='10 18' stroke-linecap='round'/>
      <circle cx='260' cy='260' r='198' fill='none' stroke='%23FFFFFF' stroke-opacity='0.65' stroke-width='3'/>
      <circle cx='260' cy='260' r='238' fill='none' stroke='${NAVY}' stroke-opacity='0.10' stroke-width='2'/>
    </svg>
  `),
  leafSide: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
      <path d='M35 250 C80 145, 150 70, 260 40' fill='none' stroke='${SKY}' stroke-opacity='0.35' stroke-width='10' stroke-linecap='round'/>
      <path d='M55 260 C100 160, 170 95, 275 60' fill='none' stroke='%23FFFFFF' stroke-opacity='0.55' stroke-width='4' stroke-linecap='round'/>
      <circle cx='82' cy='214' r='6' fill='${SKY}' fill-opacity='0.35'/>
      <circle cx='132' cy='160' r='4' fill='${SKY}' fill-opacity='0.28'/>
      <circle cx='196' cy='110' r='5' fill='${SKY}' fill-opacity='0.22'/>
    </svg>
  `),
  leafSide2: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
      <path d='M40 265 C90 150, 170 85, 285 55' fill='none' stroke='${SKY}' stroke-opacity='0.25' stroke-width='12' stroke-linecap='round'/>
      <path d='M60 275 C110 170, 190 110, 295 80' fill='none' stroke='%23FFFFFF' stroke-opacity='0.38' stroke-width='4' stroke-linecap='round'/>
    </svg>
  `),
  dividerFlower: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='140' viewBox='0 0 1200 140'>
      <line x1='0' y1='70' x2='1200' y2='70' stroke='${SKY}' stroke-opacity='0.28' stroke-width='6' stroke-linecap='round' stroke-dasharray='10 26'/>
      <circle cx='600' cy='70' r='12' fill='${SKY}' fill-opacity='0.35'/>
      <circle cx='560' cy='70' r='6' fill='%23FFFFFF' fill-opacity='0.55'/>
      <circle cx='640' cy='70' r='6' fill='%23FFFFFF' fill-opacity='0.55'/>
    </svg>
  `),
  frameFlower: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'>
      <circle cx='260' cy='260' r='245' fill='none' stroke='${SKY}' stroke-opacity='0.35' stroke-width='10'/>
      <circle cx='260' cy='260' r='230' fill='none' stroke='%23FFFFFF' stroke-opacity='0.55' stroke-width='4' stroke-dasharray='6 14' stroke-linecap='round'/>
      <circle cx='260' cy='260' r='210' fill='none' stroke='${NAVY}' stroke-opacity='0.10' stroke-width='2'/>
    </svg>
  `),
  cornerFlower: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'>
      <path d='M40 220 L220 40' stroke='${SKY}' stroke-opacity='0.30' stroke-width='10' stroke-linecap='round'/>
      <path d='M65 225 L225 65' stroke='%23FFFFFF' stroke-opacity='0.45' stroke-width='4' stroke-linecap='round'/>
      <circle cx='60' cy='200' r='8' fill='${SKY}' fill-opacity='0.25'/>
    </svg>
  `),
  dividerFlower2: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='140' viewBox='0 0 1200 140'>
      <line x1='0' y1='70' x2='1200' y2='70' stroke='%23FFFFFF' stroke-opacity='0.55' stroke-width='3' stroke-linecap='round'/>
      <line x1='0' y1='70' x2='1200' y2='70' stroke='${SKY}' stroke-opacity='0.20' stroke-width='9' stroke-linecap='round' stroke-dasharray='4 30'/>
    </svg>
  `),
  cardEventDivider: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='60' viewBox='0 0 1200 60'>
      <line x1='40' y1='30' x2='1160' y2='30' stroke='${SKY}' stroke-opacity='0.28' stroke-width='6' stroke-linecap='round' stroke-dasharray='8 18'/>
      <circle cx='600' cy='30' r='8' fill='${SKY}' fill-opacity='0.32'/>
    </svg>
  `),
  cardFlower: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
      <rect x='36' y='36' width='248' height='248' rx='52' fill='none' stroke='${SKY}' stroke-opacity='0.26' stroke-width='12'/>
      <rect x='56' y='56' width='208' height='208' rx='44' fill='none' stroke='%23FFFFFF' stroke-opacity='0.55' stroke-width='4' stroke-dasharray='6 14' stroke-linecap='round'/>
    </svg>
  `),
  sprinkle: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'>
      <g fill='${SKY}' fill-opacity='0.18'>
        <circle cx='90' cy='120' r='10'/><circle cx='210' cy='190' r='6'/><circle cx='310' cy='110' r='8'/>
        <circle cx='430' cy='170' r='7'/><circle cx='520' cy='120' r='5'/><circle cx='610' cy='210' r='9'/>
        <circle cx='120' cy='320' r='7'/><circle cx='250' cy='360' r='10'/><circle cx='350' cy='290' r='6'/>
        <circle cx='480' cy='330' r='9'/><circle cx='580' cy='360' r='6'/><circle cx='630' cy='310' r='8'/>
        <circle cx='80' cy='520' r='9'/><circle cx='190' cy='580' r='6'/><circle cx='310' cy='520' r='10'/>
        <circle cx='420' cy='560' r='7'/><circle cx='520' cy='520' r='6'/><circle cx='610' cy='600' r='9'/>
      </g>
      <g stroke='%23FFFFFF' stroke-opacity='0.28' stroke-width='3' stroke-linecap='round'>
        <path d='M80 250 L140 220'/><path d='M540 260 L600 230'/><path d='M260 610 L320 580'/><path d='M420 110 L480 80'/>
      </g>
    </svg>
  `),
  storyTop: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='160' viewBox='0 0 1200 160'>
      <path d='M0,110 C240,60 460,30 600,70 C760,115 980,125 1200,85 L1200,160 L0,160 Z' fill='${SKY}' fill-opacity='0.12'/>
      <path d='M0,108 C240,60 460,30 600,70 C760,115 980,125 1200,85' fill='none' stroke='%23FFFFFF' stroke-opacity='0.55' stroke-width='3' stroke-linecap='round'/>
    </svg>
  `),
  bottomFloral: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='160' viewBox='0 0 1200 160'>
      <path d='M0,40 C220,90 430,130 600,100 C780,70 980,45 1200,85 L1200,160 L0,160 Z' fill='${SKY}' fill-opacity='0.12'/>
      <line x1='60' y1='115' x2='1140' y2='115' stroke='${SKY}' stroke-opacity='0.22' stroke-width='6' stroke-linecap='round' stroke-dasharray='10 24'/>
    </svg>
  `),
} as const;

export const AMALTHEA_OVERLAY_URLS = Object.values(AMALTHEA_OVERLAY_ASSETS);

export const PLUTO_OVERLAY_ASSETS = AMALTHEA_OVERLAY_ASSETS;
export const PLUTO_OVERLAY_URLS = AMALTHEA_OVERLAY_URLS;
