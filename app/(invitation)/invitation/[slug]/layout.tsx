import "../../invitation.css";
import { INVITATION_DEFAULTS } from "@/data/invitations";
import { Metadata } from "next";
import { InvitationScaleWrapper } from "@/components/invitation/InvitationScaleWrapper";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;
    const config = INVITATION_DEFAULTS[slug];

    if (!config) {
        return {
            title: "Invitation Not Found",
        }
    }

    return {
        title: config.metadata.title,
        description: config.metadata.description,
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
