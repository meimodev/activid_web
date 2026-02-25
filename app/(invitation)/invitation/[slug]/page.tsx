"use client";

import { use } from "react";
import { INVITATION_DEFAULTS } from "@/data/invitations";
import { useInvitationConfig } from "@/components/invitation/useInvitationConfig";
import { Flow1 } from "@/components/templates/flow1";
import { Saturn1 } from "@/components/templates/saturn1";
import { Mercury1 } from "@/components/templates/mercury1";
import { Pluto1 } from "@/components/templates/pluto1";
import { Venus1 } from "@/components/templates/venus1";
import { Jupiter } from "@/components/templates/jupiter";
import { Neptune1 } from "@/components/templates/neptune1";
import { FallbackPage } from "@/components/invitation/FallbackPage";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function InvitationPage({ params }: PageProps) {
    const { slug } = use(params);

    const baseConfig = (INVITATION_DEFAULTS["christian-regina"] ?? INVITATION_DEFAULTS["ricci-andrini"])!;

    // Get default config based on slug
    let defaultConfig = INVITATION_DEFAULTS[slug];

    // Handle Demo Mode
    if (!defaultConfig && slug.endsWith("-demo")) {
        const templateId = slug.replace("-demo", "");
        const isMileaDilanDemo = templateId === "venus-1" || templateId === "neptune-1" || templateId === "jupiter";

        // Create a deep copy of a base config to ensure valid structure
        // We use CHRISTIAN_REGINA_CONFIG as a robust base
        const baseConfig = INVITATION_DEFAULTS["christian-regina"];

        if (baseConfig) {
            defaultConfig = {
                ...baseConfig,
                id: slug,
                templateId: templateId,
                metadata: {
                    ...baseConfig.metadata,
                    title: isMileaDilanDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation - Activid",
                    description: isMileaDilanDemo ? "You are invited to Milea & Dilan" : "This is a demo preview of the wedding invitation template.",
                    openGraph: {
                        ...baseConfig.metadata.openGraph,
                        title: isMileaDilanDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation",
                        url: `https://activid.web.id/invitation/${slug}`,
                    }
                },
                couple: {
                    groom: {
                        firstName: isMileaDilanDemo ? "Dilan" : "Romeo",
                        fullName: isMileaDilanDemo ? "Dilan Saputra" : "Romeo Montague",
                        shortName: isMileaDilanDemo ? "Dilan" : "Romeo",
                        role: isMileaDilanDemo ? "Bandung" : "The Groom",
                        parents: isMileaDilanDemo ? "Putra dari Bapak Fikri Fahreza dan Ibu Elsa Melisa" : "Putra dari Mr. Montague & Mrs. Montague",
                        photo: isMileaDilanDemo
                            ? "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800"
                            : "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
                    },
                    bride: {
                        firstName: isMileaDilanDemo ? "Milea" : "Juliet",
                        fullName: isMileaDilanDemo ? "Milea Dewi" : "Juliet Capulet",
                        shortName: isMileaDilanDemo ? "Milea" : "Juliet",
                        role: isMileaDilanDemo ? "Jakarta" : "The Bride",
                        parents: isMileaDilanDemo ? "Putri dari Bapak Ikhsan Fauzi dan Ibu Putri Saumi" : "Putri dari Mr. Capulet & Mrs. Capulet",
                        photo: isMileaDilanDemo
                            ? "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800"
                            : "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
                    },
                },
                weddingDate: {
                    display: isMileaDilanDemo ? "Senin, 30 Desember 2024" : "01 Januari 2026",
                    displayShort: isMileaDilanDemo ? "30 Des 2024" : "01 . 01 . 2026",
                    countdownTarget: isMileaDilanDemo ? "2024-12-30T00:00:00" : "2026-01-01T00:00:00",
                    rsvpDeadline: isMileaDilanDemo ? "30 Desember 2024" : "2025-12-31",
                },
                backgroundPhotos: [
                    "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200"
                ],
                sections: {
                    ...baseConfig.sections,
                    hero: {
                        ...baseConfig.sections.hero,
                        subtitle: isMileaDilanDemo ? "The Wedding Of" : "The Wedding Demo",
                        coverImage:
                            templateId === "venus-1"
                                ? "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                : templateId === "neptune-1"
                                    ? "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    : templateId === "jupiter"
                                        ? "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        : "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    },
                    countdown: {
                        ...baseConfig.sections.countdown,
                        heading: isMileaDilanDemo ? "Save The Date" : "Coming Soon",
                        photos: [
                            "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800"
                        ]
                    },
                    quote: {
                        ...baseConfig.sections.quote,
                        text: isMileaDilanDemo
                            ? "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)"
                            : "Love is not just looking at each other, it's looking in the same direction.",
                        author: isMileaDilanDemo ? "" : "Antoine de Saint-Exupéry",
                    },
                    story: {
                        ...baseConfig.sections.story,
                        heading: isMileaDilanDemo ? "Story" : baseConfig.sections.story.heading,
                        stories: isMileaDilanDemo
                            ? [
                                {
                                    date: "DESEMBER 2013",
                                    description:
                                        "Dari yang pacarannya nanya “Lagi apa?” lewat SMS bergeser jadi dikit-dikit Vidcall WA. Dari yang pacarannya sama-sama kurus hingga akhirnya melebar bersama. Dari yang biasanya kalo mau main bingung harus cari tempat wisata, sekarang cukup dengan chill di cafe / kulineran. Dan dengan bumbu drama LDR 5 tahun lamanya.",
                                },
                                {
                                    date: "DESEMBER 2021",
                                    description:
                                        "#SewinduBerkasih (8 tahun yang utuh dan menggenapkan). Sebuah perayaan sederhana atas rasa syukur yang telah mengantarkan kami ke 8 tahun berproses, juga telah merangkum 8 tahun gelap terang perjalanan kami.",
                                },
                            ]
                            : [
                                { date: "First Met", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
                                { date: "The Proposal", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }
                            ]
                    },
                    event: {
                        ...baseConfig.sections.event,
                        heading: isMileaDilanDemo ? "Event" : baseConfig.sections.event.heading,
                        events: {
                            holyMatrimony: {
                                ...baseConfig.sections.event.events.holyMatrimony,
                                title: isMileaDilanDemo ? "Akad" : "Wedding Ceremony",
                                date: isMileaDilanDemo ? "Senin, 30 Desember 2024" : baseConfig.sections.event.events.holyMatrimony.date,
                                time: isMileaDilanDemo ? "08:00" : baseConfig.sections.event.events.holyMatrimony.time,
                                venue: isMileaDilanDemo ? "Kediaman Mempelai Wanita" : "Grand Cathedral",
                                address: isMileaDilanDemo ? "Jalan Keramat Jati Nomer 45" : "123 Wedding Street, Love City",
                                mapUrl: isMileaDilanDemo
                                    ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                    : "",
                            },
                            reception: {
                                ...baseConfig.sections.event.events.reception,
                                title: isMileaDilanDemo ? "Resepsi" : "Wedding Reception",
                                date: isMileaDilanDemo ? "Senin, 30 Desember 2024" : baseConfig.sections.event.events.reception.date,
                                time: isMileaDilanDemo ? "19:00" : baseConfig.sections.event.events.reception.time,
                                venue: isMileaDilanDemo ? "Kediaman Mempelai Wanita" : "Royal Ballroom",
                                address: isMileaDilanDemo ? "Jalan Keramat Jati Nomer 45" : "456 Party Lane, Celebration City",
                                mapUrl: isMileaDilanDemo
                                    ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                    : "",
                            },
                            ...(isMileaDilanDemo
                                ? {
                                    liveStreaming: {
                                        title: "Live Streaming",
                                        date: "",
                                        time: "",
                                        venue: "Instagram",
                                        address: "",
                                        mapUrl: "https://ringvitation.com",
                                    },
                                }
                                : {}),
                        }
                    },
                    gallery: {
                        ...baseConfig.sections.gallery,
                        photos: [
                            "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800"
                        ]
                    },
                    // Disable interactive/sensitive sections for demo (except venus-1 which is UI/UX focused)
                    rsvp: { ...baseConfig.sections.rsvp, enabled: isMileaDilanDemo ? true : false, heading: "Konfirmasi Kehadiran" },
                    gift: {
                        ...baseConfig.sections.gift,
                        enabled: isMileaDilanDemo ? true : false,
                        heading: "Wedding Gift",
                        bankAccounts: isMileaDilanDemo
                            ? [
                                { bankName: "BCA", accountHolder: "Dilan Putra", accountNumber: "1234567894" },
                                { bankName: "Shopeepay", accountHolder: "Milea Putri", accountNumber: "123456789" },
                            ]
                            : baseConfig.sections.gift.bankAccounts,
                    },
                    wishes: { ...baseConfig.sections.wishes, enabled: isMileaDilanDemo ? true : false, heading: "Friends Wishes" },
                }
            };
        }
    }

    const isValidSlug = !!defaultConfig;

    // Fetch dynamic config (must be called unconditionally)
    const { config } = useInvitationConfig(isValidSlug ? slug : "", defaultConfig ?? baseConfig);

    // If no default exists (and not a valid demo), show Fallback Page
    if (!defaultConfig) {
        return <FallbackPage />;
    }

    // Determines which template to render
    const templateId = config.templateId || "flow-1";

    if (templateId === "flow-1") {
        return <Flow1 config={config} />;
    }

    if (templateId === "saturn-1") {
        return <Saturn1 config={config} />;
    }

    if (templateId === "mercury-1") {
        return <Mercury1 config={config} />;
    }

    if (templateId === "pluto-1") {
        return <Pluto1 config={config} />;
    }

    if (templateId === "venus-1") {
        return <Venus1 config={config} />;
    }

    if (templateId === "jupiter") {
        return <Jupiter config={config} />;
    }

    if (templateId === "neptune-1") {
        return <Neptune1 config={config} />;
    }

    // Fallback if template unknown but config exists
    return <FallbackPage />;
}
