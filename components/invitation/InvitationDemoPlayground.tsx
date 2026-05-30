"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { buildInvitationDemoConfig, pickRandomDemoMusicUrl } from "@/data/invitations";
import { getInvitationTemplateThemes } from "@/data/invitation-templates";
import { DemoThemeSidebar } from "@/components/invitation/DemoThemeSidebar";
import dynamic from "next/dynamic";

const Flow = dynamic(() => import("@/components/templates/flow").then(m => ({ default: m.Flow })));
const Saturn = dynamic(() => import("@/components/templates/saturn").then(m => ({ default: m.Saturn })));
const Mercury = dynamic(() => import("@/components/templates/mercury").then(m => ({ default: m.Mercury })));
const Pluto = dynamic(() => import("@/components/templates/pluto").then(m => ({ default: m.Pluto })));
const Eden = dynamic(() => import("@/components/templates/eden").then(m => ({ default: m.Eden })));
const Amalthea = dynamic(() => import("@/components/templates/amalthea").then(m => ({ default: m.Amalthea })));
const KidsBirthday = dynamic(() => import("@/components/templates/kids-birthday").then(m => ({ default: m.KidsBirthday })));
const ComicBook = dynamic(() => import("@/components/templates/comic-book").then(m => ({ default: m.ComicBook })));
const ArcadeRetro = dynamic(() => import("@/components/templates/arcade-retro").then(m => ({ default: m.ArcadeRetro })));
const Venus = dynamic(() => import("@/components/templates/venus").then(m => ({ default: m.Venus })));
const Jupiter = dynamic(() => import("@/components/templates/jupiter").then(m => ({ default: m.Jupiter })));
const Neptune = dynamic(() => import("@/components/templates/neptune").then(m => ({ default: m.Neptune })));
const Royal = dynamic(() => import("@/components/templates/royal").then(m => ({ default: m.Royal })));
const Candyland = dynamic(() => import("@/components/templates/candyland").then(m => ({ default: m.Candyland })));

type DemoPurpose = InvitationConfig["purpose"];

type InvitationDemoPlaygroundProps = {
  slug: string;
  templateId: string;
  initialPurpose: DemoPurpose;
  initialThemeId: string;
};

export function InvitationDemoPlayground({
  slug,
  templateId,
  initialPurpose,
  initialThemeId,
}: InvitationDemoPlaygroundProps) {
  const themes = useMemo(() => getInvitationTemplateThemes(templateId), [templateId]);
  const isBirthdayOnlyTemplate = templateId === "kids-birthday" || templateId === "comic-book" || templateId === "arcade-retro" || templateId === "candyland";

  const [purpose, setPurpose] = useState<DemoPurpose>(initialPurpose);
  const [themeId, setThemeId] = useState<string>(initialThemeId);
  const effectivePurpose: DemoPurpose = isBirthdayOnlyTemplate ? "birthday" : purpose;
  const [musicUrlOverride, setMusicUrlOverride] = useState<string | null>(() =>
    pickRandomDemoMusicUrl(isBirthdayOnlyTemplate ? "birthday" : initialPurpose),
  );

  useEffect(() => {
    setMusicUrlOverride(pickRandomDemoMusicUrl(effectivePurpose));
  }, [effectivePurpose]);

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
    const base = buildInvitationDemoConfig({ slug, templateId, purpose: effectivePurpose });

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
  }, [effectivePurpose, musicUrlOverride, selectedTheme, slug, templateId]);

  const template = useMemo(() => {
    const key = `${templateId}:${effectivePurpose}`;

    if (templateId === "flow") return <Flow key={key} config={config} />;
    if (templateId === "saturn") return <Saturn key={key} config={config} />;
    if (templateId === "mercury") return <Mercury key={key} config={config} />;
    if (templateId === "pluto") return <Pluto key={key} config={config} />;
    if (templateId === "eden") return <Eden key={key} config={config} />;
    if (templateId === "amalthea") return <Amalthea key={key} config={config} />;
    if (templateId === "kids-birthday") return <KidsBirthday key={key} config={config} />;
    if (templateId === "comic-book") return <ComicBook key={key} config={config} />;
    if (templateId === "arcade-retro") return <ArcadeRetro key={key} config={config} />;
    if (templateId === "venus") return <Venus key={key} config={config} />;
    if (templateId === "jupiter") return <Jupiter key={key} config={config} />;
    if (templateId === "neptune") return <Neptune key={key} config={config} />;
    if (templateId === "royal") return <Royal key={key} config={config} />;
    if (templateId === "candyland") return <Candyland key={key} config={config} />;

    return <Flow key={key} config={config} />;
  }, [config, effectivePurpose, templateId]);

  return (
    <>
      <DemoThemeSidebar
        templateId={templateId}
        themes={themes}
        initialTheme={config.theme}
        activeThemeId={themeId}
        onThemeIdChange={(nextThemeId) => {
          setThemeId(nextThemeId);
          syncUrl(effectivePurpose, nextThemeId);
        }}
        activePurpose={effectivePurpose}
        onPurposeChange={(nextPurpose) => {
          if (isBirthdayOnlyTemplate) return;
          setPurpose(nextPurpose);
          syncUrl(nextPurpose, themeId);
        }}
      />
      {template}
    </>
  );
}
