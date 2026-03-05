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

  const [purpose, setPurpose] = useState<DemoPurpose>(initialPurpose);
  const [themeId, setThemeId] = useState<string>(initialThemeId);
  const [musicUrlOverride, setMusicUrlOverride] = useState<string | null>(() =>
    pickRandomDemoMusicUrl(initialPurpose),
  );

  useEffect(() => {
    setMusicUrlOverride(pickRandomDemoMusicUrl(purpose));
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
