"use client";

import { use } from "react";
import { INVITATION_DEFAULTS } from "@/data/invitations";
import { useInvitationConfig } from "@/components/invitation/useInvitationConfig";
import { Flow1 } from "@/components/templates/flow1";
import { Saturn1 } from "@/components/templates/saturn1";
import { Mercury1 } from "@/components/templates/mercury1";
import { Venus1 } from "@/components/templates/venus1";
import { FallbackPage } from "@/components/invitation/FallbackPage";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function InvitationPage({ params }: PageProps) {
    const { slug } = use(params);

    // Get default config based on slug
    let defaultConfig = INVITATION_DEFAULTS[slug];

    // Handle Demo Mode
    if (!defaultConfig && slug.endsWith("-demo")) {
        const templateId = slug.replace("-demo", "");
        const isVenusDemo = templateId === "venus-1";

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
                    title: isVenusDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation - Activid",
                    description: isVenusDemo ? "You are invited to Milea & Dilan" : "This is a demo preview of the wedding invitation template.",
                    openGraph: {
                        ...baseConfig.metadata.openGraph,
                        title: isVenusDemo ? "The Wedding Of Milea & Dilan" : "Demo Invitation",
                        url: `https://activid.web.id/invitation/${slug}`,
                    }
                },
                couple: {
                    groom: {
                        firstName: isVenusDemo ? "Dilan" : "Romeo",
                        fullName: isVenusDemo ? "Dilan Saputra" : "Romeo Montague",
                        shortName: isVenusDemo ? "Dilan" : "Romeo",
                        role: isVenusDemo ? "" : "The Groom",
                        parents: isVenusDemo ? "Putra dari Bapak Fikri Fahreza dan Ibu Elsa Melisa" : "Putra dari Mr. Montague & Mrs. Montague",
                        photo: isVenusDemo
                            ? "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800"
                            : "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
                    },
                    bride: {
                        firstName: isVenusDemo ? "Milea" : "Juliet",
                        fullName: isVenusDemo ? "Milea Dewi" : "Juliet Capulet",
                        shortName: isVenusDemo ? "Milea" : "Juliet",
                        role: isVenusDemo ? "" : "The Bride",
                        parents: isVenusDemo ? "Putri dari Bapak Ikhsan Fauzi dan Ibu Putri Saumi" : "Putri dari Mr. Capulet & Mrs. Capulet",
                        photo: isVenusDemo
                            ? "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800"
                            : "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
                    },
                },
                weddingDate: {
                    display: isVenusDemo ? "Rabu, 30 Desember 2026" : "01 Januari 2026",
                    displayShort: isVenusDemo ? "30 Des 2026" : "01 . 01 . 2026",
                    countdownTarget: isVenusDemo ? "2026-12-30T00:00:00" : "2026-01-01T00:00:00",
                    rsvpDeadline: isVenusDemo ? "30 Desember 2026" : "2025-12-31",
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
                        subtitle: isVenusDemo ? "The Wedding Of" : "The Wedding Demo",
                        coverImage: isVenusDemo
                            ? "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            : "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    },
                    countdown: {
                        ...baseConfig.sections.countdown,
                        heading: isVenusDemo ? "Save The Date" : "Coming Soon",
                        photos: [
                            "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
                            "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800"
                        ]
                    },
                    quote: {
                        ...baseConfig.sections.quote,
                        text: isVenusDemo
                            ? "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)"
                            : "Love is not just looking at each other, it's looking in the same direction.",
                        author: isVenusDemo ? "" : "Antoine de Saint-Exupéry",
                    },
                    story: {
                        ...baseConfig.sections.story,
                        stories: isVenusDemo
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
                        events: {
                            holyMatrimony: {
                                ...baseConfig.sections.event.events.holyMatrimony,
                                title: isVenusDemo ? "Akad" : "Wedding Ceremony",
                                date: isVenusDemo ? "Rabu, 30 Desember 2026" : baseConfig.sections.event.events.holyMatrimony.date,
                                time: isVenusDemo ? "08:00" : baseConfig.sections.event.events.holyMatrimony.time,
                                venue: isVenusDemo ? "Kediaman Mempelai Wanita" : "Grand Cathedral",
                                address: isVenusDemo ? "Jalan Keramat Jati Nomer 45" : "123 Wedding Street, Love City",
                                mapUrl: isVenusDemo
                                    ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                    : "",
                            },
                            reception: {
                                ...baseConfig.sections.event.events.reception,
                                title: isVenusDemo ? "Resepsi" : "Wedding Reception",
                                date: isVenusDemo ? "Rabu, 30 Desember 2026" : baseConfig.sections.event.events.reception.date,
                                time: isVenusDemo ? "19:00" : baseConfig.sections.event.events.reception.time,
                                venue: isVenusDemo ? "Kediaman Mempelai Wanita" : "Royal Ballroom",
                                address: isVenusDemo ? "Jalan Keramat Jati Nomer 45" : "456 Party Lane, Celebration City",
                                mapUrl: isVenusDemo
                                    ? "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676"
                                    : "",
                            },
                            ...(isVenusDemo
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
                    rsvp: { ...baseConfig.sections.rsvp, enabled: isVenusDemo ? true : false, heading: "Konfirmasi Kehadiran" },
                    gift: {
                        ...baseConfig.sections.gift,
                        enabled: isVenusDemo ? true : false,
                        heading: "Wedding Gift",
                        bankAccounts: isVenusDemo
                            ? [
                                { bankName: "BCA", accountHolder: "Dilan Putra", accountNumber: "1234567894" },
                                { bankName: "Shopeepay", accountHolder: "Milea Putri", accountNumber: "123456789" },
                            ]
                            : baseConfig.sections.gift.bankAccounts,
                    },
                    wishes: { ...baseConfig.sections.wishes, enabled: isVenusDemo ? true : false, heading: "Friends Wishes" },
                }
            };
        }
    }

    // If no default exists (and not a valid demo), show Fallback Page immediately
    if (!defaultConfig) {
        return <FallbackPage />;
    }

    // Fetch dynamic config
    const { config } = useInvitationConfig(slug, defaultConfig);

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

    if (templateId === "venus-1") {
        return <Venus1 config={config} />;
    }

    // Fallback if template unknown but config exists
    return <FallbackPage />;
}
