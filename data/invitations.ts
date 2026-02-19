
import { InvitationConfig } from "@/types/invitation";

export const RICCI_ANDRINI_CONFIG: InvitationConfig = {
    id: "ricci-andrini",
    templateId: "flow-1",
    metadata: {
        title: "The Wedding of Ricci & Andrini",
        description: "Premium custom theme web invitation for the Wedding of Ricci & Andrini.",
        openGraph: {
            title: "The Wedding of Ricci & Andrini",
            description: "Premium custom theme web invitation.",
            url: "https://activid.web.id/invitation/ricci-andrini",
            siteName: "Activid Web Invitation",
            images: [
                {
                    url: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/cover_cropped",
                    width: 600,
                    height: 600,
                    alt: "The Wedding of Ricci & Andrini",
                },
            ],
            locale: "id_ID",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "The Wedding of Ricci & Andrini",
            description: "Premium custom theme web invitation.",
            images: ["https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/cover_cropped"],
        },
    },
    music: {
        title: "Rossa feat. Afgan - Kamu Yang Kutunggu",
        url: "https://www.dropbox.com/scl/fi/mj324o4j9x3xloodtzcd5/Rossa-feat.-Afgan-Kamu-Yang-Kutunggu.mp3?rlkey=0h8q4x13p8k0k5kyz9lowqs45&st=730ttlvm&dl=1",
        autoPlay: true,
        loop: true,
    },
    backgroundPhotos: [
         "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/9.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/8.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/7.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/6.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/5.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/4.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/3.jpg",
    ],
    weddingDate: {
        display: "24 Januari 2026",
        displayShort: "24 Jan 2026",
        countdownTarget: "2026-01-24T00:00:00",
        rsvpDeadline: "24 Januari 2026",
    },
    couple: {
        groom: {
            firstName: "Ricci",
            fullName: "Ricci Gerungan",
            shortName: "Ricci",
            role: "The Groom",
            parents: "Putra dari Roberd Gerungan & Sermy Sangari",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/hs1.jpg",
        },
        bride: {
            firstName: "Andrini",
            fullName: "Andrini Regina Mokodaser",
            shortName: "Andrini",
            role: "The Bride",
            parents: "Putri dari Yunus Mokodaser & Suryati Kalensang",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/hs2.jpg",
        },
    },
    sections: {
        hero: {
            enabled: true,
            subtitle: "The Wedding",
            coverImage: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/cover_cropped",
        },
        title: {
            enabled: true,
            heading: "The Wedding",
        },
        countdown: {
            enabled: true,
            heading: "The Count Down",
            photos: [
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/9.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/8.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/7.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/6.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/5.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/4.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/3.jpg",
            ],
        },
        quote: {
            enabled: true,
            text: "Tuhan membuat segala sesuatu indah pada waktu-Nya. Indah ketika Ia mempertemukan kami. Indah ketika Ia menumbuhkan kasih di antara kami. Dan indah ketika Ia mempersatukan kami dalam sebuah ikatan Pernikahan Kudus.",
            author: "",
        },
        couple: {
            enabled: true,
            disableGrayscale: true,
        },
        story: {
            enabled: true,
            heading: "The Love Story",
            stories: [],
        },
        event: {
            enabled: true,
            heading: "The Event",
            events: {
                holyMatrimony: {
                    title: "Pemberkatan",
                    date: "24 Januari 2026",
                    time: "13:00 WITA",
                    venue: "GMIM Alfa Omega Rinegetan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/XDbv3QeGtVkZtw9o8",
                },
                reception: {
                    title: "Resepsi",
                    date: "24 Januari 2026",
                    time: "17:00 WITA",
                    venue: "Rumah Keluarga Ricci Gerungan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/hfuQCuGk17bgCmw16",
                },
            },
        },
        gallery: {
            enabled: true,
            heading: "The Moments",
            photos: [
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/9.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/8.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/7.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/6.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/5.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/4.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/3.jpg",
            ],
        },
        rsvp: {
            enabled: false, // Explicitly disabled for Ricci
            heading: "RSVP",
            description: "Kehadiran anda sangat kami nantikan",
            successMessage: "Terima kasih atas konfirmasi anda",
            alreadySubmittedMessage: "Konfirmasi anda sudah kami terima",
            seeYouMessage: "Sampai jumpa di acara kami",
        },
        gift: {
            enabled: true,
            heading: "Wedding Gift",
            description: "Kehadiran dan doa anda sangat berharga bagi kami.\nNamun, jika menjadi kerelaan anda untuk memberi lebih lagi,\nkami mempermudah niat berharga anda lewat nomor rekening berikut:",
            bankAccounts: [
                {
                    bankName: "MANDIRI",
                    accountNumber: "1500033822725",
                    accountHolder: "ANDRINI REGINA MOKODASER",
                },
                {
                    bankName: "BNI",
                    accountNumber: "0952131951",
                    accountHolder: "RICCI GERUNGAN",
                },
            ],
        },
        wishes: {
            enabled: true,
            heading: "Wedding Wishes",
            placeholder: "Tuliskan pesanmu untuk pengantin yang berbahagia",
            thankYouMessage: "Pesanmu sudah diterima dengan baik",
        },
        footer: {
            enabled: true,
            message: "Terima kasih telah merayakan bersama Activid",
        },
    },
};

export const CHRISTIAN_REGINA_CONFIG: InvitationConfig = {
    id: "christian-regina",
    templateId: "flow-1",
    metadata: {
        title: "The Wedding of Christian & Regina",
        description: "Premium custom theme web invitation for the Wedding of Christian & Regina.",
        openGraph: {
            title: "The Wedding of Christian & Regina",
            description: "Premium custom theme web invitation.",
            url: "https://activid.web.id/invitation/christian-regina",
            siteName: "Activid Web Invitation",
            images: [
                {
                    url: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/cover.jpg",
                    width: 1200,
                    height: 630,
                    alt: "The Wedding of Christian & Regina",
                },
            ],
            locale: "id_ID",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "The Wedding of Christian & Regina",
            description: "Premium custom theme web invitation.",
            images: ["https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/cover.jpg"],
        },
    },
    music: {
        title: "Theme",
        url: "https://www.dropbox.com/scl/fi/836uloz6uqs28nlvk38sl/theme.mp3?rlkey=e53vsdwfkz59a13y2vngsbmuv&e=1&st=4c2q7ea2&dl=1",
        autoPlay: true,
        loop: true,
    },
    backgroundPhotos: [
         "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/10.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/11.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/12.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/14.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/15.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/16.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/17.jpg",
        "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/18.jpg",
    ],
    weddingDate: {
        display: "31 JANUARI 2026",
        displayShort: "31 . 01 . 2026",
        countdownTarget: "2026-01-31T00:00:00",
        rsvpDeadline: "30 Januari 2026",
    },
    couple: {
        groom: {
            firstName: "Christian",
            fullName: "Christian Jehezkiel Roring, S.Th",
            shortName: "Christian",
            role: "The Groom",
            parents: "Putra pertama dari Delvy Ronald Roring & Novke Juana Rumapar",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/main_groom.png",
        },
        bride: {
            firstName: "Regina",
            fullName: "Regina Claudia Tairas, S.Th",
            shortName: "Regina",
            role: "The Bride",
            parents: "Putri kedua dari Jaffray Frengky Tairas & Nolvita Silfia Pandoh",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/main-bride.png",
        },
    },
    sections: {
        hero: {
            enabled: true,
            subtitle: "The Wedding",
            coverImage: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/cover.jpg",
        },
        title: {
            enabled: true,
            heading: "The Wedding",
        },
        countdown: {
            enabled: true,
            heading: "The Count Down",
            photos: [
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/1.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/2.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/3.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/4.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/5.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/6.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/7.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/8.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/9.jpg",
            ],
        },
        quote: {
            enabled: true,
            text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
            author: "Kolose 3:14",
        },
        couple: {
            enabled: true,
            disableGrayscale: false, // Default for Christian Regina
        },
        story: {
            enabled: true,
            heading: "The Love Story",
            stories: [
                {
                    date: "7 July 2016",
                    description: "Mulai menjalani hubungan pacaran"
                },
                {
                    date: "Awalan 2024",
                    description: "Memutuskan untuk melanjutkan hubungan ke jenjang yang lebih serius"
                },
                {
                    date: "05 Oktober 2025",
                    description: "Mengadakan pembicaraan bersama dengan kedua orang tua kami masing-masing dan memutuskan untuk melangsungkan pernikahan di tanggal 31 Januari 2026"
                },
            ],
        },
        event: {
            enabled: true,
            heading: "The Event",
            events: {
                holyMatrimony: {
                    title: "Pemberkatan",
                    date: "Sabtu, 31 Januari, 2026",
                    time: "13:00 WITA",
                    venue: "Gereja Baptis Kalvari Seretan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/1ajxvkej8CkS1Zsy9",
                },
                reception: {
                    title: "Resepsi",
                    date: "Sabtu, 31 Januari, 2026",
                    time: "16:00 WITA",
                    venue: "Kompleks Gereja Baptis Kalvari Seretan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/r59Cv36ta2vqMaai6",
                },
            },
        },
        gallery: {
            enabled: true,
            heading: "The Moments",
            photos: [
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/1.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/2.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/3.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/4.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/5.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/6.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/7.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/8.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/9.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/10.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/11.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/12.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/14.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/15.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/16.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/17.jpg",
                "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/18.jpg",
            ],
        },
        rsvp: {
            enabled: true,
            heading: "RSVP",
            description: "Kehadiran anda sangat kami nantikan",
            successMessage: "Terima kasih atas konfirmasi anda",
            alreadySubmittedMessage: "Konfirmasi anda sudah kami terima",
            seeYouMessage: "Sampai jumpa di acara kami",
        },
        gift: {
            enabled: true,
            heading: "Wedding Gift",
            description: "Kehadiran dan doa anda sangat berharga bagi kami.\nNamun, jika menjadi kerelaan anda untuk memberi lebih lagi,\nkami mempermudah niat berharga anda lewat nomor rekening berikut:",
            bankAccounts: [
                {
                    bankName: "MANDIRI",
                    accountNumber: "1500035142601",
                    accountHolder: "CHRISTIAN JEHEZKIEL",
                },
                {
                    bankName: "SEABANK",
                    accountNumber: "901317250168",
                    accountHolder: "REGINA CLAUDIA TAIRAS",
                },
            ],
        },
        wishes: {
            enabled: true,
            heading: "Wedding Wishes",
            placeholder: "Tuliskan pesanmu untuk pengantin yang berbahagia",
            thankYouMessage: "Pesanmu sudah diterima dengan baik",
        },
        footer: {
            enabled: true,
            message: "Terima kasih telah merayakan bersama Activid",
        },
    },
};

export const MERCURY_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "mercury",
    templateId: "mercury-1",
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "The Wedding of Daniel & Aurelia",
        description: "Mercury template invitation demo by Activid.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "The Wedding of Daniel & Aurelia",
            description: "Mercury template invitation demo by Activid.",
            url: "https://activid.web.id/invitation/mercury",
            images: [
                {
                    url: "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "The Wedding of Daniel & Aurelia",
                },
            ],
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "The Wedding of Daniel & Aurelia",
            description: "Mercury template invitation demo by Activid.",
            images: ["https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200"],
        },
    },
    weddingDate: {
        display: "21 Januari 2026",
        displayShort: "21.01.2026",
        countdownTarget: "2026-01-21T00:00:00",
        rsvpDeadline: "20 Januari 2026",
    },
    couple: {
        groom: {
            firstName: "Daniel",
            fullName: "Daniel Mahendra",
            shortName: "Daniel",
            role: "The Groom",
            parents: "Putra dari Bapak Mahendra & Ibu Kristina",
            photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        bride: {
            firstName: "Aurelia",
            fullName: "Aurelia Pramudita",
            shortName: "Aurelia",
            role: "The Bride",
            parents: "Putri dari Bapak Pramono & Ibu Siska",
            photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    },
    sections: {
        ...CHRISTIAN_REGINA_CONFIG.sections,
        hero: {
            ...CHRISTIAN_REGINA_CONFIG.sections.hero,
            subtitle: "The Wedding of",
            coverImage: "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
        title: {
            ...CHRISTIAN_REGINA_CONFIG.sections.title,
            heading: "The Wedding of",
        },
        quote: {
            ...CHRISTIAN_REGINA_CONFIG.sections.quote,
            text: "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
            author: "Matthew 19:6",
        },
    },
};

export const MERCURY_DEMO_CONFIG: InvitationConfig = {
    ...MERCURY_CONFIG,
    id: "mercury-demo",
    metadata: {
        ...MERCURY_CONFIG.metadata,
        title: "Demo Invitation - Activid",
        description: "This is a demo preview of the Mercury invitation template.",
        openGraph: {
            ...MERCURY_CONFIG.metadata.openGraph,
            title: "Demo Invitation",
            description: "This is a demo preview of the Mercury invitation template.",
            url: "https://activid.web.id/invitation/mercury-demo",
        },
        twitter: {
            ...MERCURY_CONFIG.metadata.twitter,
            title: "Demo Invitation",
            description: "This is a demo preview of the Mercury invitation template.",
        },
    },
};

export const INVITATION_DEFAULTS: Record<string, InvitationConfig> = {
    "ricci-andrini": RICCI_ANDRINI_CONFIG,
    "christian-regina": CHRISTIAN_REGINA_CONFIG,
    "mercury": MERCURY_CONFIG,
    "mercury-demo": MERCURY_DEMO_CONFIG,
};
