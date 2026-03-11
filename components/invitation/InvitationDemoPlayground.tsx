"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { buildInvitationDemoConfig, pickRandomDemoMusicUrl } from "@/data/invitations";
import { getInvitationTemplateThemes } from "@/data/invitation-templates";
import { DemoThemeSidebar } from "@/components/invitation/DemoThemeSidebar";
import { Flow } from "@/components/templates/flow";
import { Saturn } from "@/components/templates/saturn";
import { Mercury } from "@/components/templates/mercury";
import { Pluto } from "@/components/templates/pluto";
import { Amalthea } from "@/components/templates/amalthea";
import { KidsBirthday } from "@/components/templates/kids-birthday";
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

export function InvitationDemoPlayground({
  slug,
  templateId,
  initialPurpose,
  initialThemeId,
}: InvitationDemoPlaygroundProps) {
  const themes = useMemo(() => getInvitationTemplateThemes(templateId), [templateId]);
  const isBirthdayOnlyTemplate = templateId === "kids-birthday";

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
    if (templateId === "amalthea") return <Amalthea key={key} config={config} />;
    if (templateId === "kids-birthday") return <KidsBirthday key={key} config={config} />;
    if (templateId === "venus") return <Venus key={key} config={config} />;
    if (templateId === "jupiter") return <Jupiter key={key} config={config} />;
    if (templateId === "neptune") return <Neptune key={key} config={config} />;

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
