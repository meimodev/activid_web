import { Poppins } from "next/font/google";
import "../../invitation.css";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import { HERO_PHOTO } from "./config";

export const metadata = {
    title: "The Wedding of Christian & Regina",
    description: "Premium custom theme web invitation in Indonesian Language for the Wedding of Christian & Regina.",
    openGraph: {
        title: "The Wedding of Christian & Regina",
        description: "Premium custom theme web invitation in Indonesian Language.",
        url: "https://activid.web.id/invitation/christian-regina",
        siteName: "Activid Web Invitation",
        images: [
            {
                url: HERO_PHOTO,
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
        description: "Premium custom theme web invitation in Indonesian Language.",
        images: [HERO_PHOTO],
    },
};

export default function InvitationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${poppins.variable} font-body antialiased bg-wedding-bg text-wedding-text min-h-screen selection:bg-wedding-gold selection:text-white`}>
            {children}
        </div>
    );
}
