import { buildInvitationDemoConfig, DEMO_COVER_IMAGE_URL } from "@/data/invitations";
import { Flow } from "@/components/templates/flow";
import { Saturn } from "@/components/templates/saturn";
import { Mercury } from "@/components/templates/mercury";
import { Pluto } from "@/components/templates/pluto";
import { Amalthea } from "@/components/templates/amalthea";
import { Venus } from "@/components/templates/venus";
import { Jupiter } from "@/components/templates/jupiter";
import { Neptune } from "@/components/templates/neptune";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { notFound } from "next/navigation";
import { getInvitationThemeStyle } from "@/lib/invitation-theme";
import { getInvitationTemplateThemes } from "@/data/invitation-templates";
import { InvitationDemoPlayground } from "@/components/invitation/InvitationDemoPlayground";
import {
    getInvitationConfig,
    InvitationConfigQuotaExceededError,
} from "@/lib/invitation-config";

const SITE_ORIGIN = "https://activid.web.id";

const RESERVED_TEMPLATE_SLUGS = new Set([
    "flow",
    "saturn",
    "mercury",
    "pluto",
    "amalthea",
    "venus",
    "jupiter",
    "neptune",
]);

type DemoPurpose = "marriage" | "birthday" | "event";

function getSingleSearchParam(
    searchParams: { [key: string]: string | string[] | undefined },
    key: string,
): string | undefined {
    const value = searchParams[key];
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0];
    return undefined;
}

function requireDemoPurpose(raw: string | undefined): DemoPurpose {
    if (raw === "birthday" || raw === "event" || raw === "marriage") return raw;
    notFound();
}

function requireDemoTheme(templateId: string, raw: string | undefined) {
    if (!raw) notFound();
    const themes = getInvitationTemplateThemes(templateId);
    const selected = themes.find((theme) => theme.id === raw);
    if (!selected) notFound();
    return selected;
}

function requireInvitationConfig(config: InvitationConfig): InvitationConfig {
    const cfg = config as unknown as {
        templateId?: unknown;
        purpose?: unknown;
        theme?: unknown;
        sections?: unknown;
    };

    if (typeof cfg.templateId !== "string" || !cfg.templateId.trim()) notFound();
    if (cfg.purpose !== "birthday" && cfg.purpose !== "event" && cfg.purpose !== "marriage") notFound();

    const theme = cfg.theme as Record<string, unknown> | null;
    if (!theme || typeof theme !== "object") notFound();
    if (typeof theme.mainColor !== "string" || !theme.mainColor.trim()) notFound();
    if (typeof theme.accentColor !== "string" || !theme.accentColor.trim()) notFound();

    const sections = cfg.sections as Record<string, unknown> | null;
    const hostsSection = sections?.hosts as Record<string, unknown> | null;
    const hosts = hostsSection?.hosts as unknown;
    if (!Array.isArray(hosts) || hosts.length < 1) notFound();

    const eventSection = sections?.event as Record<string, unknown> | null;
    const events = eventSection?.events as unknown;
    if (!Array.isArray(events) || events.length < 1) notFound();

    const gratitudeSection = sections?.gratitude as Record<string, unknown> | null;
    if (!gratitudeSection || typeof gratitudeSection !== "object") notFound();
    if (typeof gratitudeSection.enabled !== "boolean") notFound();
    if (typeof gratitudeSection.message !== "string") notFound();

    return config;
}

function getTemplateLabel(templateId: string) {
    switch (templateId) {
        case "flow":
            return "Flow";
        case "saturn":
            return "Saturn";
        case "venus":
            return "Venus";
        case "neptune":
            return "Neptune";
        case "jupiter":
            return "Jupiter";
        case "mercury":
            return "Mercury";
        case "pluto":
            return "Pluto";
        case "amalthea":
            return "Amalthea";
        default:
            return templateId;
    }
}

function getDemoCoverImage(templateId: string) {
    void templateId;
    return DEMO_COVER_IMAGE_URL;
}

function withInvitationChrome(
    templateId: string,
    theme: InvitationConfig["theme"] | undefined,
    children: ReactNode,
) {
    const themeStyle = getInvitationThemeStyle(templateId, theme);

    return (
        <div className="invitation-mobile-shell" style={themeStyle as CSSProperties}>
            <div className="invitation-mobile-frame">
                <div className="font-body antialiased bg-wedding-bg text-wedding-text min-h-screen selection:bg-wedding-accent selection:text-white">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
    { params, searchParams }: PageProps,
): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const canonicalUrl = `${SITE_ORIGIN}/invitation/${slug}`;

    if (slug.endsWith("-demo")) {
        const templateId = slug.replace(/-demo$/, "");
        const purpose = requireDemoPurpose(getSingleSearchParam(resolvedSearchParams, "purpose"));
        requireDemoTheme(templateId, getSingleSearchParam(resolvedSearchParams, "theme"));
        const config = buildInvitationDemoConfig({ slug, templateId, purpose });
        const templateLabel = getTemplateLabel(templateId);
        const coverImage = config.sections?.hero?.coverImage ?? getDemoCoverImage(templateId);

        const title = `Demo Invitation - ${templateLabel} | Activid`;
        const description = `This is a demo preview of the ${templateLabel} invitation template.`;

        return {
            title,
            description,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                ...config.metadata.openGraph,
                title,
                description,
                url: canonicalUrl,
                images: [
                    {
                        url: coverImage,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },
            twitter: {
                ...config.metadata.twitter,
                title,
                description,
                images: [coverImage],
            },
        };
    }

    const coverImage = getDemoCoverImage("flow");
    const title = "Invitation | Activid";
    const description = "You are invited.";

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            siteName: "Activid Web Invitation",
            locale: "id_ID",
            type: "website",
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: coverImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [coverImage],
        },
    };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const renderTemplate = (templateId: string, config: InvitationConfig) => {
        if (templateId === "flow") return <Flow config={config} />;
        if (templateId === "saturn") return <Saturn config={config} />;
        if (templateId === "mercury") return <Mercury config={config} />;
        if (templateId === "pluto") return <Pluto config={config} />;
        if (templateId === "amalthea") return <Amalthea config={config} />;
        if (templateId === "venus") return <Venus config={config} />;
        if (templateId === "jupiter") return <Jupiter config={config} />;
        if (templateId === "neptune") return <Neptune config={config} />;
        notFound();
    };

    if (slug.endsWith("-demo")) {
        const demoTemplateId = slug.replace(/-demo$/, "");
        const demoPurpose = requireDemoPurpose(getSingleSearchParam(resolvedSearchParams, "purpose"));
        const selectedTheme = requireDemoTheme(
            demoTemplateId,
            getSingleSearchParam(resolvedSearchParams, "theme"),
        );

        return withInvitationChrome(
            demoTemplateId,
            {
                mainColor: selectedTheme.mainColor,
                accentColor: selectedTheme.accentColor,
                accent2Color: selectedTheme.accent2Color,
                darkColor: selectedTheme.darkColor,
            },
            <InvitationDemoPlayground
                slug={slug}
                templateId={demoTemplateId}
                initialPurpose={demoPurpose}
                initialThemeId={selectedTheme.id}
            />,
        );
    }

    if (RESERVED_TEMPLATE_SLUGS.has(slug)) {
        notFound();
    }

    let config: InvitationConfig | null;
    try {
        config = await getInvitationConfig(slug);
    } catch (err) {
        if (err instanceof InvitationConfigQuotaExceededError) {
            return withInvitationChrome(
                "flow",
                undefined,
                <div className="min-h-screen flex items-center justify-center px-6 py-16">
                    <div className="max-w-sm text-center">
                        <div className="text-lg font-semibold">Undangan sedang sibuk</div>
                        <div className="mt-2 text-sm opacity-80">
                            Silakan coba lagi dalam beberapa menit.
                        </div>
                    </div>
                </div>,
            );
        }

        throw err;
    }

    if (!config) {
        notFound();
    }

    const validated = requireInvitationConfig(config);
    const templateId = validated.templateId;

    return withInvitationChrome(
        templateId,
        validated.theme,
        renderTemplate(templateId, validated),
    );
}
