
import { InvitationConfig } from "@/types/invitation";

const dt = (year: number, month: number, day: number, hour = 0, minute = 0) => ({
    date: { year, month, day },
    time: { hour, minute },
});

export const RICCI_ANDRINI_CONFIG: InvitationConfig = {
    id: "ricci-andrini",
    templateId: "flow",
    theme: {
        mainColor: "#F9F7F2",
        accentColor: "#800020",
    },
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
    backgroundPhotos: [],
    weddingDate: {
        display: "24 Januari 2026",
        displayShort: "24 Jan 2026",
        countdownTarget: "2026-01-24T00:00:00",
        rsvpDeadline: "24 Januari 2026",
    },
    hosts: [
        {
            firstName: "Ricci",
            fullName: "Ricci Gerungan",
            shortName: "Ricci",
            role: "The Groom",
            parents: "Putra dari Roberd Gerungan & Sermy Sangari",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/hs1.jpg",
        },
        {
            firstName: "Andrini",
            fullName: "Andrini Regina Mokodaser",
            shortName: "Andrini",
            role: "The Bride",
            parents: "Putri dari Yunus Mokodaser & Suryati Kalensang",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/ricci-andrini/hs2.jpg",
        },
    ],
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
            photos: [],
        },
        quote: {
            enabled: true,
            text: "Tuhan membuat segala sesuatu indah pada waktu-Nya. Indah ketika Ia mempertemukan kami. Indah ketika Ia menumbuhkan kasih di antara kami. Dan indah ketika Ia mempersatukan kami dalam sebuah ikatan Pernikahan Kudus.",
            author: "",
        },
        hosts: {
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
            events: [
                {
                    title: "Pemberkatan",
                    date: dt(2026, 1, 24, 13, 0),
                    venue: "GMIM Alfa Omega Rinegetan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/XDbv3QeGtVkZtw9o8",
                },
                {
                    title: "Resepsi",
                    date: dt(2026, 1, 24, 17, 0),
                    venue: "Rumah Keluarga Ricci Gerungan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/hfuQCuGk17bgCmw16",
                },
            ],
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
    templateId: "flow",
    theme: {
        mainColor: "#F9F7F2",
        accentColor: "#800020",
    },
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
    backgroundPhotos: [],
    weddingDate: {
        display: "31 JANUARI 2026",
        displayShort: "31 . 01 . 2026",
        countdownTarget: "2026-01-31T00:00:00",
        rsvpDeadline: "30 Januari 2026",
    },
    hosts: [
        {
            firstName: "Christian",
            fullName: "Christian Jehezkiel Roring, S.Th",
            shortName: "Christian",
            role: "The Groom",
            parents: "Putra pertama dari Delvy Ronald Roring & Novke Juana Rumapar",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/main_groom.png",
        },
        {
            firstName: "Regina",
            fullName: "Regina Claudia Tairas, S.Th",
            shortName: "Regina",
            role: "The Bride",
            parents: "Putri kedua dari Jaffray Frengky Tairas & Nolvita Silfia Pandoh",
            photo: "https://ik.imagekit.io/geb6bfhmhx/activid%20web/invitation/main-bride.png",
        },
    ],
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
            photos: [],
        },
        quote: {
            enabled: true,
            text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
            author: "Kolose 3:14",
        },
        hosts: {
            enabled: true,
            disableGrayscale: false, // Default for Christian Regina
        },
        story: {
            enabled: true,
            heading: "The Love Story",
            stories: [
                {
                    date: dt(2016, 7, 7),
                    description: "Mulai menjalani hubungan pacaran"
                },
                {
                    date: dt(2024, 1, 1),
                    description: "Memutuskan untuk melanjutkan hubungan ke jenjang yang lebih serius"
                },
                {
                    date: dt(2025, 10, 5),
                    description: "Mengadakan pembicaraan bersama dengan kedua orang tua kami masing-masing dan memutuskan untuk melangsungkan pernikahan di tanggal 31 Januari 2026"
                },
            ],
        },
        event: {
            enabled: true,
            heading: "The Event",
            events: [
                {
                    title: "Pemberkatan",
                    date: dt(2026, 1, 31, 13, 0),
                    venue: "Gereja Baptis Kalvari Seretan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/1ajxvkej8CkS1Zsy9",
                },
                {
                    title: "Resepsi",
                    date: dt(2026, 1, 31, 16, 0),
                    venue: "Kompleks Gereja Baptis Kalvari Seretan",
                    address: "",
                    mapUrl: "https://maps.app.goo.gl/r59Cv36ta2vqMaai6",
                },
            ],
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

export const VENUS_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "venus",
    templateId: "venus",
    theme: {
        mainColor: "#F8F4EC",
        accentColor: "#C5A059",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "The Wedding Of Milea & Dilan",
        description: "You are invited to Milea & Dilan",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "The Wedding Of Milea & Dilan",
            description: "You are invited to Milea & Dilan",
            url: "https://activid.web.id/invitation/venus",
            images: [
                {
                    url: "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "The Wedding Of Milea & Dilan",
                },
            ],
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "The Wedding Of Milea & Dilan",
            description: "You are invited to Milea & Dilan",
            images: [
                "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200",
            ],
        },
    },
    hosts: [
        {
            firstName: "Dilan",
            fullName: "Dilan Saputra",
            shortName: "Dilan",
            role: "Bandung",
            parents: "Putra dari Bapak Fikri Fahreza dan Ibu Elsa Melisa",
            photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            firstName: "Milea",
            fullName: "Milea Dewi",
            shortName: "Milea",
            role: "Jakarta",
            parents: "Putri dari Bapak Ikhsan Fauzi dan Ibu Putri Saumi",
            photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    ],
    weddingDate: {
        display: "Senin, 30 Desember 2024",
        displayShort: "30 Des 2024",
        countdownTarget: "2024-12-30T00:00:00",
        rsvpDeadline: "30 Desember 2024",
    },
    backgroundPhotos: [],
    sections: {
        ...CHRISTIAN_REGINA_CONFIG.sections,
        hero: {
            ...CHRISTIAN_REGINA_CONFIG.sections.hero,
            subtitle: "The Wedding Of",
            coverImage: "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
        title: {
            ...CHRISTIAN_REGINA_CONFIG.sections.title,
            heading: "The Wedding Of",
        },
        quote: {
            ...CHRISTIAN_REGINA_CONFIG.sections.quote,
            text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
            author: "",
        },
        story: {
            ...CHRISTIAN_REGINA_CONFIG.sections.story,
            heading: "Story",
            stories: [
                {
                    date: dt(2013, 12, 1),
                    description:
                        "Dari yang pacarannya nanya “Lagi apa?” lewat SMS bergeser jadi dikit-dikit Vidcall WA. Dari yang pacarannya sama-sama kurus hingga akhirnya melebar bersama. Dari yang biasanya kalo mau main bingung harus cari tempat wisata, sekarang cukup dengan chill di cafe / kulineran. Dan dengan bumbu drama LDR 5 tahun lamanya.",
                },
                {
                    date: dt(2021, 12, 1),
                    description:
                        "#SewinduBerkasih (8 tahun yang utuh dan menggenapkan). Sebuah perayaan sederhana atas rasa syukur yang telah mengantarkan kami ke 8 tahun berproses, juga telah merangkum 8 tahun gelap terang perjalanan kami.",
                },
            ],
        },
        event: {
            ...CHRISTIAN_REGINA_CONFIG.sections.event,
            heading: "Event",
            events: [
                {
                    ...(Array.isArray(CHRISTIAN_REGINA_CONFIG.sections.event.events)
                        ? CHRISTIAN_REGINA_CONFIG.sections.event.events[0]
                        : CHRISTIAN_REGINA_CONFIG.sections.event.events.holyMatrimony),
                    title: "Akad",
                    date: dt(2024, 12, 30, 8, 0),
                    venue: "Kediaman Mempelai Wanita",
                    address: "Jalan Keramat Jati Nomer 45",
                    mapUrl: "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676",
                },
                {
                    ...(Array.isArray(CHRISTIAN_REGINA_CONFIG.sections.event.events)
                        ? CHRISTIAN_REGINA_CONFIG.sections.event.events[1]
                        : CHRISTIAN_REGINA_CONFIG.sections.event.events.reception),
                    title: "Resepsi",
                    date: dt(2024, 12, 30, 19, 0),
                    venue: "Kediaman Mempelai Wanita",
                    address: "Jalan Keramat Jati Nomer 45",
                    mapUrl: "https://www.google.com/maps/place/-5.370534,104.693768/data=!4m6!3m5!1s0!7e2!8m2!3d-5.3705339!4d104.6937676",
                },
                {
                    title: "Live Streaming (Instagram)",
                    date: dt(2024, 12, 30, 0, 0),
                    venue: "",
                    address: "",
                    mapUrl: "https://ringvitation.com",
                },
            ],
        },
        gallery: {
            ...CHRISTIAN_REGINA_CONFIG.sections.gallery,
            photos: [
                "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
        rsvp: {
            ...CHRISTIAN_REGINA_CONFIG.sections.rsvp,
            enabled: true,
            heading: "Konfirmasi Kehadiran",
        },
        gift: {
            ...CHRISTIAN_REGINA_CONFIG.sections.gift,
            enabled: true,
            heading: "Wedding Gift",
            bankAccounts: [
                { bankName: "BCA", accountHolder: "Dilan Putra", accountNumber: "1234567894" },
                { bankName: "Shopeepay", accountHolder: "Milea Putri", accountNumber: "123456789" },
            ],
        },
        wishes: {
            ...CHRISTIAN_REGINA_CONFIG.sections.wishes,
            enabled: true,
            heading: "Friends Wishes",
        },
    },
};

export const VENUS_DEMO_CONFIG: InvitationConfig = {
    ...VENUS_CONFIG,
    id: "venus-demo",
    metadata: {
        ...VENUS_CONFIG.metadata,
        title: "Demo Invitation - Activid",
        description: "This is a demo preview of the Venus invitation template.",
        openGraph: {
            ...VENUS_CONFIG.metadata.openGraph,
            title: "Demo Invitation",
            description: "This is a demo preview of the Venus invitation template.",
            url: "https://activid.web.id/invitation/venus-demo",
        },
        twitter: {
            ...VENUS_CONFIG.metadata.twitter,
            title: "Demo Invitation",
            description: "This is a demo preview of the Venus invitation template.",
        },
    },
};

export const FLOW_DEMO_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "flow-demo",
    templateId: "flow",
    theme: {
        mainColor: "#F9F7F2",
        accentColor: "#800020",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "Demo Invitation - Flow | Activid",
        description: "This is a demo preview of the Flow invitation template.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "Demo Invitation - Flow",
            description: "This is a demo preview of the Flow invitation template.",
            url: "https://activid.web.id/invitation/flow-demo",
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "Demo Invitation - Flow",
            description: "This is a demo preview of the Flow invitation template.",
        },
    },
};

export const SATURN_DEMO_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "saturn-demo",
    templateId: "saturn",
    theme: {
        mainColor: "#0B0D17",
        accentColor: "#D4AF37",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "Demo Invitation - Saturn | Activid",
        description: "This is a demo preview of the Saturn invitation template.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "Demo Invitation - Saturn",
            description: "This is a demo preview of the Saturn invitation template.",
            url: "https://activid.web.id/invitation/saturn-demo",
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "Demo Invitation - Saturn",
            description: "This is a demo preview of the Saturn invitation template.",
        },
    },
};

export const NEPTUNE_DEMO_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "neptune-demo",
    templateId: "neptune",
    theme: {
        mainColor: "#020615",
        accentColor: "#7DD3FC",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "Demo Invitation - Neptune | Activid",
        description: "This is a demo preview of the Neptune invitation template.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "Demo Invitation - Neptune",
            description: "This is a demo preview of the Neptune invitation template.",
            url: "https://activid.web.id/invitation/neptune-demo",
            images: [
                {
                    url: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "Demo Invitation - Neptune",
                },
            ],
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "Demo Invitation - Neptune",
            description: "This is a demo preview of the Neptune invitation template.",
            images: [
                "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200",
            ],
        },
    },
    sections: {
        ...CHRISTIAN_REGINA_CONFIG.sections,
        hero: {
            ...CHRISTIAN_REGINA_CONFIG.sections.hero,
            coverImage: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
    },
};

export const JUPITER_DEMO_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "jupiter-demo",
    templateId: "jupiter",
    theme: {
        mainColor: "#F7F3EA",
        accentColor: "#C5A059",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "Demo Invitation - Jupiter | Activid",
        description: "This is a demo preview of the Jupiter invitation template.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "Demo Invitation - Jupiter",
            description: "This is a demo preview of the Jupiter invitation template.",
            url: "https://activid.web.id/invitation/jupiter-demo",
            images: [
                {
                    url: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "Demo Invitation - Jupiter",
                },
            ],
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "Demo Invitation - Jupiter",
            description: "This is a demo preview of the Jupiter invitation template.",
            images: [
                "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200",
            ],
        },
    },
    sections: {
        ...CHRISTIAN_REGINA_CONFIG.sections,
        hero: {
            ...CHRISTIAN_REGINA_CONFIG.sections.hero,
            coverImage: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
    },
};

export const MERCURY_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "mercury",
    templateId: "mercury",
    theme: {
        mainColor: "#F7F3EA",
        accentColor: "#612A35",
    },
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
    hosts: [
        {
            firstName: "Daniel",
            fullName: "Daniel Mahendra",
            shortName: "Daniel",
            role: "The Groom",
            parents: "Putra dari Bapak Mahendra & Ibu Kristina",
            photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            firstName: "Aurelia",
            fullName: "Aurelia Pramudita",
            shortName: "Aurelia",
            role: "The Bride",
            parents: "Putri dari Bapak Pramono & Ibu Siska",
            photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    ],
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

export const PLUTO_CONFIG: InvitationConfig = {
    ...CHRISTIAN_REGINA_CONFIG,
    id: "pluto",
    templateId: "pluto",
    theme: {
        mainColor: "#EFE7D6",
        accentColor: "#7A5A2A",
    },
    metadata: {
        ...CHRISTIAN_REGINA_CONFIG.metadata,
        title: "The Wedding of Daniel & Aurelia",
        description: "Pluto template invitation demo by Activid.",
        openGraph: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.openGraph,
            title: "The Wedding of Daniel & Aurelia",
            description: "Pluto template invitation demo by Activid.",
            url: "https://activid.web.id/invitation/pluto",
            images: [
                {
                    url: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "The Wedding of Daniel & Aurelia",
                },
            ],
        },
        twitter: {
            ...CHRISTIAN_REGINA_CONFIG.metadata.twitter,
            title: "The Wedding of Daniel & Aurelia",
            description: "Pluto template invitation demo by Activid.",
            images: ["https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200"],
        },
    },
    weddingDate: {
        display: "21 Januari 2026",
        displayShort: "21.01.2026",
        countdownTarget: "2026-01-21T00:00:00",
        rsvpDeadline: "20 Januari 2026",
    },
    hosts: [
        {
            firstName: "Daniel",
            fullName: "Daniel Pratama",
            shortName: "Daniel",
            role: "Bandung",
            parents: "Putra dari Bapak Hendra Pratama dan Ibu Rina Kusuma",
            photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            firstName: "Aurelia",
            fullName: "Aurelia Putri",
            shortName: "Aurelia",
            role: "Surabaya",
            parents: "Putri dari Bapak Samuel Wijaya dan Ibu Maria Lestari",
            photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    ],
    sections: {
        ...CHRISTIAN_REGINA_CONFIG.sections,
        hero: {
            ...CHRISTIAN_REGINA_CONFIG.sections.hero,
            subtitle: "The Wedding of",
            coverImage: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        event: {
            ...CHRISTIAN_REGINA_CONFIG.sections.event,
            heading: "Wedding Event",
            events: [
                {
                    ...(Array.isArray(CHRISTIAN_REGINA_CONFIG.sections.event.events)
                        ? CHRISTIAN_REGINA_CONFIG.sections.event.events[0]
                        : CHRISTIAN_REGINA_CONFIG.sections.event.events.holyMatrimony),
                    title: "PEMBERKATAN",
                    date: dt(2026, 1, 21, 12, 0),
                    venue: "Gereja Baitani Malalayang",
                    mapUrl: "https://www.google.com/maps",
                },
                {
                    ...(Array.isArray(CHRISTIAN_REGINA_CONFIG.sections.event.events)
                        ? CHRISTIAN_REGINA_CONFIG.sections.event.events[1]
                        : CHRISTIAN_REGINA_CONFIG.sections.event.events.reception),
                    title: "RESEPSI",
                    date: dt(2026, 1, 21, 18, 0),
                    venue: "Gedung Serbaguna Bukit Inspirasi",
                    mapUrl: "https://www.google.com/maps",
                },
            ],
        },
        story: {
            ...CHRISTIAN_REGINA_CONFIG.sections.story,
            heading: "Wedding Story",
            stories: [
                {
                    date: dt(2019, 1, 1),
                    description:
                        "Berawal dari pertemanan sederhana di tahun 2019, kami mulai saling mengenal dan belajar memahami satu sama lain. Dari kebersamaan kecil hingga memberi berarti, hubungan ini tumbuh perlahan dengan penuh cerita.",
                },
                {
                    date: dt(2026, 1, 1),
                    description:
                        "Setelah melalui perjalanan panjang yang dipenuhi suka dan duka, di tahun 2026 dengan penuh rasa syukur kami memutuskan untuk melangkah ke jenjang pernikahan dan memulai perjalanan hidup sebagai satu keluarga.",
                },
            ],
        },
    },
};

export const PLUTO_DEMO_CONFIG: InvitationConfig = {
    ...PLUTO_CONFIG,
    id: "pluto-demo",
    metadata: {
        ...PLUTO_CONFIG.metadata,
        title: "Demo Invitation - Activid",
        description: "This is a demo preview of the Pluto invitation template.",
        openGraph: {
            ...PLUTO_CONFIG.metadata.openGraph,
            title: "Demo Invitation",
            description: "This is a demo preview of the Pluto invitation template.",
            url: "https://activid.web.id/invitation/pluto-demo",
        },
        twitter: {
            ...PLUTO_CONFIG.metadata.twitter,
            title: "Demo Invitation",
            description: "This is a demo preview of the Pluto invitation template.",
        },
    },
};

export const AMALTHEA_CONFIG: InvitationConfig = {
    ...PLUTO_CONFIG,
    id: "amalthea",
    templateId: "amalthea",
    theme: {
        mainColor: "#F6FBFF",
        accentColor: "#0B1B2A",
    },
    metadata: {
        ...PLUTO_CONFIG.metadata,
        title: "The Wedding of Arga & Naya",
        description: "Amalthea template invitation demo by Activid.",
        openGraph: {
            ...PLUTO_CONFIG.metadata.openGraph,
            title: "The Wedding of Arga & Naya",
            description: "Amalthea template invitation demo by Activid.",
            url: "https://activid.web.id/invitation/amalthea",
            images: [
                {
                    url: "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    width: 1200,
                    height: 630,
                    alt: "The Wedding of Arga & Naya",
                },
            ],
        },
        twitter: {
            ...PLUTO_CONFIG.metadata.twitter,
            title: "The Wedding of Arga & Naya",
            description: "Amalthea template invitation demo by Activid.",
            images: [
                "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
            ],
        },
    },
    weddingDate: {
        display: "10 Oktober 2026",
        displayShort: "10.10.2026",
        countdownTarget: "2026-10-10T00:00:00",
        rsvpDeadline: "01 Oktober 2026",
    },
    hosts: [
        {
            firstName: "Arga",
            fullName: "Arga Pratama",
            shortName: "Arga",
            role: "Bandung",
            parents: "Putra dari Bapak Hendra Pratama dan Ibu Rina Kusuma",
            photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
            firstName: "Naya",
            fullName: "Naya Putri",
            shortName: "Naya",
            role: "Surabaya",
            parents: "Putri dari Bapak Samuel Wijaya dan Ibu Maria Lestari",
            photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
    ],
    backgroundPhotos: [],
    sections: {
        ...PLUTO_CONFIG.sections,
        hero: {
            ...PLUTO_CONFIG.sections.hero,
            subtitle: "The Wedding of",
            coverImage:
                "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
        title: {
            ...PLUTO_CONFIG.sections.title,
            heading: "The Wedding of",
        },
        gallery: {
            ...PLUTO_CONFIG.sections.gallery,
            heading: "Gallery",
            photos: [
                "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/5138883/pexels-photo-5138883.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/8102189/pexels-photo-8102189.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/17593652/pexels-photo-17593652.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/29981994/pexels-photo-29981994.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
        story: {
            ...PLUTO_CONFIG.sections.story,
            heading: "Our Story",
        },
        wishes: {
            ...PLUTO_CONFIG.sections.wishes,
            heading: "Wishes",
        },
        event: {
            ...PLUTO_CONFIG.sections.event,
            heading: "Wedding Event",
            events: [
                {
                    ...(Array.isArray(PLUTO_CONFIG.sections.event.events)
                        ? PLUTO_CONFIG.sections.event.events[0]
                        : PLUTO_CONFIG.sections.event.events.holyMatrimony),
                    title: "AKAD",
                    date: dt(2026, 10, 10, 9, 0),
                    venue: "Sky Garden Hall",
                    mapUrl: "https://www.google.com/maps",
                },
                {
                    ...(Array.isArray(PLUTO_CONFIG.sections.event.events)
                        ? PLUTO_CONFIG.sections.event.events[1]
                        : PLUTO_CONFIG.sections.event.events.reception),
                    title: "RESEPSI",
                    date: dt(2026, 10, 10, 18, 30),
                    venue: "Blue Horizon Ballroom",
                    mapUrl: "https://www.google.com/maps",
                },
            ],
        },
    },
};

export const AMALTHEA_DEMO_CONFIG: InvitationConfig = {
    ...AMALTHEA_CONFIG,
    id: "amalthea-demo",
    metadata: {
        ...AMALTHEA_CONFIG.metadata,
        title: "Demo Invitation - Activid",
        description: "This is a demo preview of the Amalthea invitation template.",
        openGraph: {
            ...AMALTHEA_CONFIG.metadata.openGraph,
            title: "Demo Invitation",
            description: "This is a demo preview of the Amalthea invitation template.",
            url: "https://activid.web.id/invitation/amalthea-demo",
        },
        twitter: {
            ...AMALTHEA_CONFIG.metadata.twitter,
            title: "Demo Invitation",
            description: "This is a demo preview of the Amalthea invitation template.",
        },
    },
};

export const INVITATION_DEFAULTS: Record<string, InvitationConfig> = {
    "ricci-andrini": RICCI_ANDRINI_CONFIG,
    "christian-regina": CHRISTIAN_REGINA_CONFIG,
    "flow-demo": FLOW_DEMO_CONFIG,
    "saturn-demo": SATURN_DEMO_CONFIG,
    "venus": VENUS_CONFIG,
    "venus-demo": VENUS_DEMO_CONFIG,
    "neptune-demo": NEPTUNE_DEMO_CONFIG,
    "mercury": MERCURY_CONFIG,
    "mercury-demo": MERCURY_DEMO_CONFIG,
    "pluto": PLUTO_CONFIG,
    "pluto-demo": PLUTO_DEMO_CONFIG,
    "amalthea": AMALTHEA_CONFIG,
    "amalthea-demo": AMALTHEA_DEMO_CONFIG,
    "jupiter-demo": JUPITER_DEMO_CONFIG,
};
