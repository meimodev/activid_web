"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { INVITATION_DEFAULTS } from "@/data/invitations";
import { useInvitationConfig } from "@/components/invitation/useInvitationConfig";
import { Flow1 } from "@/components/templates/Flow1";
import { InvitationConfig } from "@/types/invitation";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function InvitationPage({ params }: PageProps) {
    const { slug } = use(params);

    // Get default config based on slug
    const defaultConfig = INVITATION_DEFAULTS[slug];

    // If no default exists, check if user provided valid ID in firebase
    // But since we need a default structure to render initially, we might 404 here
    // or provide a very generic skeleton.
    // For now, let's enforce pre-defined slugs in code OR handle dynamic loading better.
    // Assuming for now we must have a default.
    if (!defaultConfig) {
        return notFound();
    }

    // Fetch dynamic config
    const { config } = useInvitationConfig(slug, defaultConfig);

    // Determines which template to render
    const templateId = config.templateId || "flow-1";

    if (templateId === "flow-1") {
        return <Flow1 config={config} />;
    }

    // Fallback or 404 if template unknown
    return (
        <div className="flex items-center justify-center min-h-screen text-black">
            <p>Unknown Template: {templateId}</p>
        </div>
    );
}
