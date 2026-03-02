"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { buildInvitationDemoConfig } from "@/data/invitations";
import { getInvitationTemplateThemes } from "@/data/invitation-templates";
import { DemoThemeSidebar } from "@/components/invitation/DemoThemeSidebar";
import { Flow } from "@/components/templates/flow";
import { Saturn } from "@/components/templates/saturn";
import { Mercury } from "@/components/templates/mercury";
import { Pluto } from "@/components/templates/pluto";
import { Amalthea } from "@/components/templates/amalthea";
import { Venus } from "@/components/templates/venus";
import { Jupiter } from "@/components/templates/jupiter";
import { Neptune } from "@/components/templates/neptune";

type DemoPurpose = InvitationConfig["purpose"];

type InvitationDemoPlaygroundProps = {
  slug: string;
  templateId: string;
  initialPurpose: DemoPurpose;
  initialThemeId: string;
};

const DEMO_GENERAL_MUSIC_URLS = [
  "https://www.dropbox.com/scl/fi/z8fnzyzbdv7jiplpfmgx2/Boyce-Avenue-Beautiful-Soul.mp3?rlkey=ky1pvj6p0s4fkr32crrnhju5d&st=gci5fwpa&dl=1",
  "https://www.dropbox.com/scl/fi/sfpu18ukc1n7i4qzw93ef/Boyce-Avenue-Say-You-Won-t-Let-Go.mp3?rlkey=5y5wt29xdq1jh10maijs57oa0&st=fq43su75&dl=1",
  "https://www.dropbox.com/scl/fi/mj324o4j9x3xloodtzcd5/Rossa-feat.-Afgan-Kamu-Yang-Kutunggu.mp3?rlkey=0h8q4x13p8k0k5kyz9lowqs45&st=g54zcd44&dl=1",
  "https://www.dropbox.com/scl/fi/0w731ekqg1wlpwp5qmhvv/Shane-Filan-Beautiful-In-White.mp3?rlkey=qo4agwhv931nrpozo7o4e95o1&st=ah0k0i97&dl=1",
];

const DEMO_BIRTHDAY_MUSIC_URLS = [
  "https://www.dropbox.com/scl/fi/h7ifzjltghy5hz9311750/Pamungkas-Happy-Birthday-To-You.mp3?rlkey=esy51sf2rrsbo9gaojc81vltp&st=8ifa5zhh&dl=1",
  "https://www.dropbox.com/scl/fi/6mfrg76gr31p4iakc7byl/Nosstress-Semoga-Ya.mp3?rlkey=l2lazj9usofashaq0kilbyo89&st=7h4y9e5i&dl=1",
  "https://www.dropbox.com/scl/fi/r1ymtmmbogk8lla0fytdm/Jhon-Legend-Happy-Birthday.mp3?rlkey=tt2a2dhjvzgmnfm7pc0eizoiy&st=huntdeyt&dl=1",
  "https://www.dropbox.com/scl/fi/ck3bes25c6coyu5s7bbzj/Anne-Marie-Birthday.mp3?rlkey=r43wnhibjxkoa8f83rq85tqcp&st=kc5on7vb&dl=1",
];

function pickRandomIndex(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function pickDemoMusicUrl(purpose: DemoPurpose): string {
  const pool = purpose === "birthday" ? DEMO_BIRTHDAY_MUSIC_URLS : DEMO_GENERAL_MUSIC_URLS;
  return pool[pickRandomIndex(pool.length)] ?? pool[0] ?? "";
}

export function InvitationDemoPlayground({
  slug,
  templateId,
  initialPurpose,
  initialThemeId,
}: InvitationDemoPlaygroundProps) {
  const themes = useMemo(() => getInvitationTemplateThemes(templateId), [templateId]);

  const [purpose, setPurpose] = useState<DemoPurpose>(initialPurpose);
  const [themeId, setThemeId] = useState<string>(initialThemeId);
  const [musicUrlOverride, setMusicUrlOverride] = useState<string | null>(null);

  useEffect(() => {
    setMusicUrlOverride(pickDemoMusicUrl(purpose));
  }, [purpose]);

  const syncUrl = useCallback(
    (nextPurpose: DemoPurpose, nextThemeId: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("purpose", nextPurpose);
      url.searchParams.set("theme", nextThemeId);
      window.history.replaceState(null, "", url.toString());
    },
    [],
  );

  const selectedTheme = useMemo(() => {
    return themes.find((t) => t.id === themeId) ?? themes[0] ?? null;
  }, [themeId, themes]);

  const config = useMemo<InvitationConfig>(() => {
    const base = buildInvitationDemoConfig({ slug, templateId, purpose });

    const withMusic: InvitationConfig = musicUrlOverride
      ? {
          ...base,
          music: {
            ...base.music,
            url: musicUrlOverride,
          },
        }
      : base;

    if (!selectedTheme) {
      return withMusic;
    }

    return {
      ...withMusic,
      theme: {
        mainColor: selectedTheme.mainColor,
        accentColor: selectedTheme.accentColor,
        accent2Color: selectedTheme.accent2Color,
        darkColor: selectedTheme.darkColor,
      },
    };
  }, [musicUrlOverride, purpose, selectedTheme, slug, templateId]);

  const template = useMemo(() => {
    const key = `${templateId}:${purpose}`;

    if (templateId === "flow") return <Flow key={key} config={config} />;
    if (templateId === "saturn") return <Saturn key={key} config={config} />;
    if (templateId === "mercury") return <Mercury key={key} config={config} />;
    if (templateId === "pluto") return <Pluto key={key} config={config} />;
    if (templateId === "amalthea") return <Amalthea key={key} config={config} />;
    if (templateId === "venus") return <Venus key={key} config={config} />;
    if (templateId === "jupiter") return <Jupiter key={key} config={config} />;
    if (templateId === "neptune") return <Neptune key={key} config={config} />;

    return <Flow key={key} config={config} />;
  }, [config, purpose, templateId]);

  return (
    <>
      <DemoThemeSidebar
        templateId={templateId}
        themes={themes}
        initialTheme={config.theme}
        activeThemeId={themeId}
        onThemeIdChange={(nextThemeId) => {
          setThemeId(nextThemeId);
          syncUrl(purpose, nextThemeId);
        }}
        activePurpose={purpose}
        onPurposeChange={(nextPurpose) => {
          setPurpose(nextPurpose);
          syncUrl(nextPurpose, themeId);
        }}
      />
      {template}
    </>
  );
}
