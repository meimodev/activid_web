import "../../invitation.css";
import { INVITATION_DEFAULTS } from "@/data/invitations";
import { Metadata } from "next";
import { InvitationScaleWrapper } from "@/components/invitation/InvitationScaleWrapper";

const SITE_ORIGIN = "https://activid.web.id";

function getTemplateLabel(templateId: string) {
    switch (templateId) {
        case "flow-1":
            return "Flow-1";
        case "saturn-1":
            return "Saturn-1";
        case "venus-1":
            return "Venus-1";
        case "neptune-1":
            return "Neptune-1";
        case "jupiter":
            return "Jupiter";
        case "mercury-1":
            return "Mercury";
        case "pluto-1":
            return "Pluto";
        default:
            return templateId;
    }
}

function getDemoCoverImage(templateId: string) {
    if (templateId === "venus-1") {
        return "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "neptune-1") {
        return "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "jupiter") {
        return "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    if (templateId === "mercury-1") {
        return "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200";
    }

    return "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200";
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;
    const canonicalUrl = `${SITE_ORIGIN}/invitation/${slug}`;
    const config = INVITATION_DEFAULTS[slug];

    if (!config) {
        if (slug.endsWith("-demo")) {
            const baseConfig = INVITATION_DEFAULTS["christian-regina"] ?? INVITATION_DEFAULTS["ricci-andrini"];
            const templateId = slug.replace(/-demo$/, "");
            const isMileaDilanDemo = templateId === "venus-1" || templateId === "neptune-1" || templateId === "jupiter";

            const title = isMileaDilanDemo
                ? "The Wedding Of Milea & Dilan"
                : `Demo Invitation - ${getTemplateLabel(templateId)} | Activid`;

            const description = isMileaDilanDemo
                ? "You are invited to Milea & Dilan"
                : `This is a demo preview of the ${getTemplateLabel(templateId)} invitation template.`;

            const coverImage = getDemoCoverImage(templateId);

            return {
                title,
                description,
                alternates: {
                    canonical: canonicalUrl,
                },
                openGraph: {
                    ...(baseConfig?.metadata.openGraph ?? {
                        siteName: "Activid Web Invitation",
                        locale: "id_ID",
                        type: "website",
                    }),
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
                    ...(baseConfig?.metadata.twitter ?? { card: "summary_large_image" }),
                    title,
                    description,
                    images: [coverImage],
                },
            };
        }

        return {
            title: "Invitation Not Found",
            alternates: {
                canonical: canonicalUrl,
            },
        };
    }

    if (slug.endsWith("-demo")) {
        const templateId = config.templateId ?? slug.replace(/-demo$/, "");
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

    return {
        title: config.metadata.title,
        description: config.metadata.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: config.metadata.openGraph,
        twitter: config.metadata.twitter,
    }
}

export default function InvitationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="invitation-mobile-shell">
            <InvitationScaleWrapper>
                <div className="invitation-mobile-frame">
                    <div className="font-body antialiased bg-wedding-bg text-wedding-text min-h-screen selection:bg-wedding-gold selection:text-white">
                        {children}
                    </div>
                </div>
            </InvitationScaleWrapper>
        </div>
    );
}
