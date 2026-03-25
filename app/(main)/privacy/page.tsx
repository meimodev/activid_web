import React from 'react';
import { Metadata } from 'next';
import { siteContent } from '@/lib/site-content';
import { DateTime } from "luxon";

export const metadata: Metadata = {
    title: 'Privacy Policy | Activid',
    description: 'Privacy Policy for Activid and Palakat. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-sans mb-8">Privacy Policy</h1>
                <p className="text-white/60 mb-12">Last updated: {DateTime.now().toLocaleString()}</p>

                <div className="space-y-8 font-sans text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Activid and Palakat. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website or use the
                            Palakat mobile application (regardless of where you access them from) and tell you about your privacy rights and how the law protects you.
                        </p>
                        <p className="mt-4">
                            This policy applies to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Activid</strong> — our portfolio website and web-based services.</li>
                            <li><strong>Palakat</strong> — our mobile application available on iOS and Android.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <p className="mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address and telephone number.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access our services.</li>
                            <li><strong>Usage Data</strong> includes information about how you use our website, the Palakat app, products and services.</li>
                            <li><strong>Device Data</strong> (Palakat app only) includes device model, operating system version, unique device identifiers, and mobile network information collected when you use the Palakat mobile application.</li>
                            <li><strong>Location Data</strong> (Palakat app only) includes approximate or precise location if you grant location permission within the Palakat app.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                            <li>To provide, operate, and improve the Palakat mobile application and its features.</li>
                            <li>To send you notifications and updates related to your use of Palakat, where you have opted in.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Palakat Mobile App — Specific Practices</h2>
                        <p className="mb-4">
                            In addition to the general data practices above, the following applies specifically to the Palakat mobile application:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Permissions:</strong> Palakat may request access to your device camera, photo library, location, or notifications. These permissions are used solely to provide app features and can be revoked at any time via your device settings.</li>
                            <li><strong>Third-party SDKs:</strong> Palakat may include analytics or crash-reporting SDKs (e.g., Firebase) that collect anonymized usage and diagnostic data to help us improve app stability and performance.</li>
                            <li><strong>Data Deletion:</strong> You may request deletion of your Palakat account and associated data at any time by contacting us at the email below.</li>
                            <li><strong>Push Notifications:</strong> If you opt in, we may send push notifications. You can opt out at any time through your device notification settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. These measures apply to both our website and the Palakat mobile application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Legal Rights</h2>
                        <p>
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent. These rights apply to data collected through both our website and the Palakat app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices — including questions related to the Palakat mobile app — please contact us at:
                            <br />
                            Email: {siteContent.contactPage.methods.email.value}
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
