import { Poppins } from "next/font/google";
import "../../invitation.css";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
    title: "The Wedding of Christian & Regina",
    description: "Join us in celebrating our special day.",
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
