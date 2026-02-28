import { INVITATION_DEFAULTS } from "@/data/invitations";
import { Flow } from "@/components/templates/flow";
import { Saturn } from "@/components/templates/saturn";
import { Mercury } from "@/components/templates/mercury";
import { Pluto } from "@/components/templates/pluto";
import { Amalthea } from "@/components/templates/amalthea";
import { Venus } from "@/components/templates/venus";
import { Jupiter } from "@/components/templates/jupiter";
import { Neptune } from "@/components/templates/neptune";
import { InvitationScaleWrapper } from "@/components/invitation/InvitationScaleWrapper";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { InvitationConfig, InvitationDateTime } from "@/types/invitation";
import { notFound } from "next/navigation";
import {
    getInvitationConfig,
    InvitationConfigQuotaExceededError,
} from "@/lib/invitation-config";

function makeDateTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
): InvitationDateTime {
    return {
        date: { year, month, day },
        time: { hour, minute },
    };
}

function withTime(value: InvitationDateTime, hour: number, minute: number): InvitationDateTime {
    return {
        ...value,
        time: { hour, minute },
    };
}

const SITE_ORIGIN = "https://activid.web.id";

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

function withInvitationChrome(templateId: string, children: ReactNode) {
    const isScaleToFitDisabled = templateId === "venus" || templateId === "amalthea";

    return (
        <div className="invitation-mobile-shell">
            {isScaleToFitDisabled ? (
                <div className="invitation-mobile-frame fluid-layout">
                    <div className="font-body antialiased bg-wedding-bg text-wedding-text min-h-screen selection:bg-wedding-gold selection:text-white">
                        {children}
                    </div>
                </div>
            ) : (
                <InvitationScaleWrapper>
                    <div className="invitation-mobile-frame">
                        <div className="font-body antialiased bg-wedding-bg text-wedding-text min-h-screen selection:bg-wedding-gold selection:text-white">
                            {children}
                        </div>
                    </div>
                </InvitationScaleWrapper>
            )}
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
    { params }: PageProps,
): Promise<Metadata> {
    const { slug } = await params;
    const canonicalUrl = `${SITE_ORIGIN}/invitation/${slug}`;

    if (slug.endsWith("-demo")) {
        const config = INVITATION_DEFAULTS[slug];

        if (!config) {
            const baseConfig = INVITATION_DEFAULTS["christian-regina"] ?? INVITATION_DEFAULTS["ricci-andrini"];
            const templateId = slug.replace(/-demo$/, "");
            const isMileaDilanDemo =
                templateId === "venus" || templateId === "neptune" || templateId === "jupiter";

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

    let config: InvitationConfig | null;
    try {
        config = await getInvitationConfig(slug);
    } catch (err) {
        if (err instanceof InvitationConfigQuotaExceededError) {
            return {
                title: "Invitation",
                description: "Please try again later.",
                alternates: {
                    canonical: canonicalUrl,
                },
            };
        }

        throw err;
    }

    if (!config) notFound();

    return {
        title: config.metadata.title,
        description: config.metadata.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: config.metadata.openGraph,
        twitter: config.metadata.twitter,
    };
}

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;

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
        const baseConfig = (INVITATION_DEFAULTS["christian-regina"] ?? INVITATION_DEFAULTS["ricci-andrini"])!;

        let config = INVITATION_DEFAULTS[slug];

        if (!config) {
            const templateId = slug.replace("-demo", "");
            const isMileaDilanDemo =
                templateId === "venus" || templateId === "neptune" || templateId === "jupiter";

            const base = INVITATION_DEFAULTS["christian-regina"];

            if (base) {
                config = {
                    ...base,
                    id: slug,
                    templateId: templateId,
                    metadata: {
                        ...base.metadata,
                        title: isMileaDilanDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation - Activid",
                        description: isMileaDilanDemo
                            ? "You are invited to Milea & Dilan"
                            : "This is a demo preview of the wedding invitation template.",
                        openGraph: {
                            ...base.metadata.openGraph,
                            title: isMileaDilanDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation",
                            url: `https://activid.web.id/invitation/${slug}`,
                        }
                    },
                    hosts: [
                        {
                            firstName: isMileaDilanDemo ? "Dilan" : "Romeo",
                            fullName: isMileaDilanDemo ? "Dilan Saputra" : "Romeo Montague",
                            shortName: isMileaDilanDemo ? "Dilan" : "Romeo",
                            role: isMileaDilanDemo ? "Bandung" : "The Groom",
                            parents: isMileaDilanDemo
                                ? "Putra dari Bapak Fikri Fahreza dan Ibu Elsa Melisa"
                                : "Putra dari Mr. Montague & Mrs. Montague",
                            photo: isMileaDilanDemo
                                ? "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800"
                                : "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
                        },
                        {
                            firstName: isMileaDilanDemo ? "Milea" : "Juliet",
                            fullName: isMileaDilanDemo ? "Milea Dewi" : "Juliet Capulet",
                            shortName: isMileaDilanDemo ? "Milea" : "Juliet",
                            role: isMileaDilanDemo ? "Jakarta" : "The Bride",
                            parents: isMileaDilanDemo
                                ? "Putri dari Bapak Ikhsan Fauzi dan Ibu Putri Saumi"
                                : "Putri dari Mr. Capulet & Mrs. Capulet",
                            photo: isMileaDilanDemo
                                ? "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800"
                                : "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
                        },
                    ],
                    weddingDate: {
                        display: isMileaDilanDemo ? "Senin, 30 Desember 2024" : "01 Januari 2026",
                        displayShort: isMileaDilanDemo ? "30 Des 2024" : "01 . 01 . 2026",
                        countdownTarget: isMileaDilanDemo ? "2024-12-30T00:00:00" : "2026-01-01T00:00:00",
                        rsvpDeadline: isMileaDilanDemo ? "30 Desember 2024" : "2025-12-31",
                    },
                    backgroundPhotos: [],
                    sections: {
                        ...base.sections,
                        hero: {
                            ...base.sections.hero,
                            subtitle: isMileaDilanDemo ? "The Wedding Of" : "The Wedding Demo",
                            coverImage:
                                templateId === "venus"
                                    ? "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    : templateId === "neptune"
                                        ? "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        : templateId === "jupiter"
                                            ? "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                            : "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
                        },
                        countdown: {
                            ...base.sections.countdown,
                            heading: isMileaDilanDemo ? "Save The Date" : "Coming Soon",
                            photos: [],
                        },
                        quote: {
                            ...base.sections.quote,
                            text: isMileaDilanDemo
                                ? "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)"
                                : "Love is not just looking at each other, it's looking in the same direction.",
                            author: isMileaDilanDemo ? "" : "Antoine de Saint-Exupéry",
                        },
                        story: {
                            ...base.sections.story,
                            heading: isMileaDilanDemo ? "Story" : base.sections.story.heading,
                            stories: isMileaDilanDemo
                                ? [
                                    {
                                        date: makeDateTime(2013, 12, 1, 0, 0),
                                        description:
                                            "Dari yang pacarannya nanya “Lagi apa?” lewat SMS bergeser jadi dikit-dikit Vidcall WA. Dari yang pacarannya sama-sama kurus hingga akhirnya melebar bersama. Dari yang biasanya kalo mau main bingung harus cari tempat wisata, sekarang cukup dengan chill di cafe / kulineran. Dan dengan bumbu drama LDR 5 tahun lamanya.",
                                    },
                                    {
                                        date: makeDateTime(2021, 12, 1, 0, 0),
                                        description:
                                            "#SewinduBerkasih (8 tahun yang utuh dan menggenapkan). Sebuah perayaan sederhana atas rasa syukur yang telah mengantarkan kami ke 8 tahun berproses, juga telah merangkum 8 tahun gelap terang perjalanan kami.",
                                    },
                                ]
                                : [
                                    {
                                        date: makeDateTime(2024, 1, 1, 0, 0),
                                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                    },
                                    {
                                        date: makeDateTime(2024, 6, 1, 0, 0),
                                        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                    },
                                ]
                        },
                        event: {
                            ...base.sections.event,
                            heading: isMileaDilanDemo ? "Event" : base.sections.event.heading,
                            events: (() => {
                                const defaultDate = isMileaDilanDemo
                                    ? makeDateTime(2024, 12, 30, 8, 0)
                                    : makeDateTime(2026, 1, 1, 8, 0);

                                const baseEvents = Array.isArray(base.sections.event.events)
                                    ? base.sections.event.events
                                    : [
                                        base.sections.event.events.holyMatrimony,
                                        base.sections.event.events.reception,
                                        ...Object.entries(base.sections.event.events)
                                            .filter(([key]) => key !== "holyMatrimony" && key !== "reception")
                                            .map(([, v]) => v),
                                    ].filter(Boolean);

                                const first = baseEvents[0] ?? {
                                    title: "",
                                    date: defaultDate,
                                    venue: "",
                                    address: "",
                                    mapUrl: "",
                                };

                                const second = baseEvents[1] ?? {
                                    title: "",
                                    date: defaultDate,
                                    venue: "",
                                    address: "",
                                    mapUrl: "",
                                };

                                return [
                                    {
                                        ...first,
                                        title: isMileaDilanDemo ? "Akad" : "Wedding Ceremony",
                                        date: isMileaDilanDemo ? withTime(defaultDate, 8, 0) : first.date,
                                        venue: isMileaDilanDemo ? "Kediaman Mempelai Wanita" : "Grand Cathedral",
                                        address: isMileaDilanDemo ? "Jalan Keramat Jati Nomer 45" : "123 Wedding Street, Love City",
                                        mapUrl: isMileaDilanDemo
                                            ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                            : "",
                                    },
                                    {
                                        ...second,
                                        title: isMileaDilanDemo ? "Resepsi" : "Wedding Reception",
                                        date: isMileaDilanDemo ? withTime(defaultDate, 19, 0) : second.date,
                                        venue: isMileaDilanDemo ? "Kediaman Mempelai Wanita" : "Royal Ballroom",
                                        address: isMileaDilanDemo ? "Jalan Keramat Jati Nomer 45" : "456 Party Lane, Celebration City",
                                        mapUrl: isMileaDilanDemo
                                            ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                            : "",
                                    },
                                    ...(isMileaDilanDemo
                                        ? [
                                            {
                                                title: "Live Streaming",
                                                date: withTime(defaultDate, 12, 0),
                                                venue: "Instagram",
                                                address: "",
                                                mapUrl: "https://ringvitation.com",
                                            },
                                        ]
                                        : []),
                                ];
                            })(),
                        },
                        gallery: {
                            ...base.sections.gallery,
                            photos: [
                                "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
                                "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800",
                                "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
                                "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
                                "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800"
                            ]
                        },
                        rsvp: { ...base.sections.rsvp, enabled: isMileaDilanDemo ? true : false, heading: "Konfirmasi Kehadiran" },
                        gift: {
                            ...base.sections.gift,
                            enabled: isMileaDilanDemo ? true : false,
                            heading: "Wedding Gift",
                            bankAccounts: isMileaDilanDemo
                                ? [
                                    { bankName: "BCA", accountHolder: "Dilan Putra", accountNumber: "1234567894" },
                                    { bankName: "Shopeepay", accountHolder: "Milea Putri", accountNumber: "123456789" },
                                ]
                                : base.sections.gift.bankAccounts,
                        },
                        wishes: { ...base.sections.wishes, enabled: isMileaDilanDemo ? true : false, heading: "Friends Wishes" },
                    }
                };
            } else {
                config = baseConfig;
            }
        }

        const templateId = config.templateId ?? "flow";
        return withInvitationChrome(templateId, renderTemplate(templateId, config));
    }

    let config: InvitationConfig | null;
    try {
        config = await getInvitationConfig(slug);
    } catch (err) {
        if (err instanceof InvitationConfigQuotaExceededError) {
            return withInvitationChrome(
                "flow",
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

    return withInvitationChrome(templateId, renderTemplate(templateId, config));
}
