import type { Metadata } from 'next'
import "./invitation.css";

export const metadata: Metadata = {
    title: 'Activid Invitation',
    description: 'Premium Web Invitations',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function InvitationRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <head>
                {/* Preload fonts or other assets if necessary */}
            </head>
            <body>{children}</body>
        </html>
    )
}
