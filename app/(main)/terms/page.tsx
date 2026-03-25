import React from 'react';
import { Metadata } from 'next';
import { DateTime } from "luxon";

export const metadata: Metadata = {
    title: 'Terms of Service | Activid',
    description: 'Terms of Service for Activid and Palakat. Please read these terms carefully before using our services.',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-sans mb-8">Terms of Service</h1>
                <p className="text-white/60 mb-12">Last updated: {DateTime.now().toLocaleString()}</p>

                <div className="space-y-8 font-sans text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing our website or downloading and using the Palakat mobile application, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing our services.
                        </p>
                        <p className="mt-4">
                            These Terms apply to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Activid</strong> — our portfolio website and web-based services.</li>
                            <li><strong>Palakat</strong> — our mobile application available on iOS and Android.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                        <p>
                            Other than the content you own, under these Terms, Activid and/or its licensors own all the intellectual property rights and materials contained in this website and the Palakat mobile application. You are granted a limited, non-exclusive, non-transferable license only for the purposes of using our services as intended. You may not copy, modify, distribute, or reverse-engineer any part of our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Restrictions</h2>
                        <p className="mb-4">
                            You are specifically restricted from all of the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Publishing any website or app material in any other media without authorization;</li>
                            <li>Selling, sublicensing and/or otherwise commercializing any website or app material;</li>
                            <li>Publicly performing and/or showing any website or app material;</li>
                            <li>Using our services in any way that is or may be damaging to the website or the Palakat app;</li>
                            <li>Using our services in any way that impacts other users&apos; access;</li>
                            <li>Using our services contrary to applicable laws and regulations, or in any way that may cause harm to the services, or to any person or business entity;</li>
                            <li>Attempting to gain unauthorized access to any part of the Palakat app or its backend systems.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Palakat Mobile Application</h2>
                        <p className="mb-4">
                            By downloading and using the Palakat mobile application, you additionally agree to the following:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>App Store Terms:</strong> Your use of Palakat is also subject to the terms of the platform from which you downloaded the app (Apple App Store or Google Play Store).</li>
                            <li><strong>Updates:</strong> We may release updates to Palakat from time to time. Continued use of the app after an update constitutes acceptance of any revised terms.</li>
                            <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</li>
                            <li><strong>User Content:</strong> Any content you submit through Palakat remains your responsibility. You grant Activid a non-exclusive license to use, display, and process your content solely to provide the app&apos;s services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall Activid, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of our website or the Palakat mobile application, whether such liability is under contract. Activid, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Indemnification</h2>
                        <p>
                            You hereby indemnify to the fullest extent Activid from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms, whether in connection with the website or the Palakat app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Variation of Terms</h2>
                        <p>
                            Activid is permitted to revise these Terms at any time as it sees fit. By continuing to use our website or the Palakat application after changes are posted, you are expected to have reviewed and accepted the updated Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Governing Law & Jurisdiction</h2>
                        <p>
                            These Terms will be governed by and interpreted in accordance with applicable laws, and you submit to the non-exclusive jurisdiction of the relevant courts for the resolution of any disputes arising from your use of our website or the Palakat mobile application.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
