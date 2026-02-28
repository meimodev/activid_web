import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./invitation.css";

export const metadata: Metadata = {
  title: "Activid Invitation",
  description: "Premium Web Invitations",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function InvitationRootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            {/* Preload fonts or other assets if necessary */}
            {children}
        </>
    );
}
