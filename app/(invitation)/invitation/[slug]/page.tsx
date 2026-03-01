import { buildInvitationDemoConfig } from "@/data/invitations";
import { Flow } from "@/components/templates/flow";
import { Saturn } from "@/components/templates/saturn";
import { Mercury } from "@/components/templates/mercury";
import { Pluto } from "@/components/templates/pluto";
import { Amalthea } from "@/components/templates/amalthea";
import { Venus } from "@/components/templates/venus";
import { Jupiter } from "@/components/templates/jupiter";
import { Neptune } from "@/components/templates/neptune";
import { DemoThemeSidebar } from "@/components/invitation/DemoThemeSidebar";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { notFound } from "next/navigation";
import { getInvitationThemeStyle } from "@/lib/invitation-theme";
import { getInvitationTemplateThemes } from "@/data/invitation-templates";
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
    if (templateId === "venus") {
        return "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "neptune") {
        return "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "jupiter") {
        return "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "mercury") {
        return "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "amalthea") {
        return "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    return "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200";
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
        const purposeValue = (() => {
            const value = resolvedSearchParams.purpose;
            if (typeof value === "string") return value;
            if (Array.isArray(value)) return value[0];
            return undefined;
        })();

        const purpose =
            purposeValue === "birthday" || purposeValue === "event" || purposeValue === "marriage"
                ? purposeValue
                : "marriage";

        const templateId = slug.replace(/-demo$/, "");
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
    const selectedThemeId = (() => {
        const value = resolvedSearchParams.theme;

        if (typeof value === "string") return value;
        if (Array.isArray(value)) return value[0];
        return undefined;
    })();

    const selectedPurpose = (() => {
        const value = resolvedSearchParams.purpose;

        if (typeof value === "string") return value;
        if (Array.isArray(value)) return value[0];
        return undefined;
    })();

    const demoPurpose: "marriage" | "birthday" | "event" =
        selectedPurpose === "birthday" || selectedPurpose === "event" || selectedPurpose === "marriage"
            ? selectedPurpose
            : "marriage";

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
        const demoTemplateId = slug.replace("-demo", "");
        let config = buildInvitationDemoConfig({
            slug,
            templateId: demoTemplateId,
            purpose: demoPurpose,
        });

        const demoThemes = getInvitationTemplateThemes(demoTemplateId);
        const selectedTheme = selectedThemeId
            ? demoThemes.find((theme) => theme.id === selectedThemeId)
            : undefined;

        if (selectedTheme) {
            config = {
                ...config,
                theme: {
                    mainColor: selectedTheme.mainColor,
                    accentColor: selectedTheme.accentColor,
                    accent2Color: selectedTheme.accent2Color,
                    darkColor: selectedTheme.darkColor,
                },
            };
        }

        return withInvitationChrome(
            demoTemplateId,
            config.theme,
            <>
                <DemoThemeSidebar
                    templateId={demoTemplateId}
                    themes={demoThemes}
                    initialTheme={config.theme}
                />
                {renderTemplate(demoTemplateId, config)}
            </>,
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

    const templateId = config.templateId ?? "flow";

    return withInvitationChrome(templateId, config.theme, renderTemplate(templateId, config));
}
