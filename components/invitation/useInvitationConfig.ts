import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InvitationConfig } from "@/types/invitation";

interface UseInvitationConfigReturn {
    config: InvitationConfig;
    loading: boolean;
    error: Error | null;
}

export function useInvitationConfig(
    invitationId: string,
    initialConfig: InvitationConfig
): UseInvitationConfigReturn {
    const [config, setConfig] = useState<InvitationConfig>(initialConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            try {
                // If no ID is provided, just use the initial config and stop loading
                if (!invitationId) {
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, "invitations", invitationId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Deep merge or replace strategy?
                    // For now, let's assume the DB has the full structure or we replace fully
                    // But to be safe against missing fields, we might want to spread over initialConfig
                    // However, deeply nested objects need careful merging.
                    // For simplicity in this iteration: spread top level sections if they exist
                    
                    const data = docSnap.data() as Partial<InvitationConfig>;
                    
                    setConfig((prev) => ({
                        ...prev,
                        ...data,
                        // If we need deep merging for configs, we'd do it here. 
                        // For example, if 'sections' is in data, we replace the whole sections object
                        // or merge individual sections. Let's start with a simple override 
                        // but keep 'metadata' and 'couple' merging if needed.
                        // Assuming the admin UI saves the full object structure.
                    }));
                } else {
                    console.log("No such document in Firebase, using default config.");
                }
            } catch (err) {
                console.error("Error fetching invitation config:", err);
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }

        fetchConfig();
    }, [invitationId]);

    return { config, loading, error };
}
