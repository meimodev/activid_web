import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Activid',
    description: 'Terms of Service for Activid Portfolio. Please read these terms carefully before using our services.',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-sans mb-8">Terms of Service</h1>
                <p className="text-white/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 font-sans text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                        <p>
                            Other than the content you own, under these Terms, Activid and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Restrictions</h2>
                        <p className="mb-4">
                            You are specifically restricted from all of the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Publishing any Website material in any other media;</li>
                            <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                            <li>Publicly performing and/or showing any Website material;</li>
                            <li>Using this Website in any way that is or may be damaging to this Website;</li>
                            <li>Using this Website in any way that impacts user access to this Website;</li>
                            <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                        <p>
                            In no event shall Activid, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Activid, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Indemnification</h2>
                        <p>
                            You hereby indemnify to the fullest extent Activid from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Variation of Terms</h2>
                        <p>
                            Activid is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law & Jurisdiction</h2>
                        <p>
                            These Terms will be governed by and interpreted in accordance with the laws of the State, and you submit to the non-exclusive jurisdiction of the state and federal courts located in us for the resolution of any disputes.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
