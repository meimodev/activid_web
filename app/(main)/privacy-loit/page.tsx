import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { siteContent } from '@/lib/site-content';
import { AnimatedGradientBackground } from '@/components/ui';

export const metadata: Metadata = {
    title: 'LOIT Privacy Policy | Activid',
    description: 'Privacy Policy for LOIT — Shareable Finance Tracker. Learn what data LOIT collects, how it is used, who it is shared with, and how to delete your account.',
};

const LAST_UPDATED = 'June 4, 2026';

export default function LOITPrivacyPolicyPage() {
    const email = siteContent.contactPage.methods.email.value;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#020205] pt-32 pb-20 text-white selection:bg-indigo-500/30">
            <AnimatedGradientBackground className="fixed inset-0 -z-20 opacity-80" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(30,27,75,0.4)_0%,rgba(2,2,5,0.8)_60%,#020205_100%)]" />

            {/* Twinkling stars effect overlay */}
            <div
                className="fixed inset-0 -z-10 bg-[url('https://ik.imagekit.io/geb6bfhmhx/activid%20web/stars-bg.png')] opacity-20 mix-blend-screen pointer-events-none"
                style={{ backgroundSize: '400px' }}
            />

            <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300/80">LOIT — Shareable Finance Tracker</p>
                <h1 className="mb-6 font-sans text-4xl font-bold md:text-5xl">Privacy Policy</h1>
                <p className="mb-12 text-white/60">Last updated: {LAST_UPDATED}</p>

                <div className="space-y-8 font-sans leading-relaxed text-white/80">
                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">1. Introduction</h2>
                        <p>
                            This Privacy Policy explains how <strong>LOIT — Shareable Finance Tracker</strong> (&ldquo;LOIT&rdquo;), a mobile
                            application published by Activid and available on iOS and Android, collects, uses, stores, shares, and protects your
                            personal data. It applies solely to the LOIT app. By using LOIT, you agree to the practices described below.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">2. Data We Collect</h2>
                        <p className="mb-4">
                            LOIT collects the following categories of personal data so the app can function and improve:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><strong>Identity Data</strong> — your name and/or username used to create and manage your LOIT account.</li>
                            <li><strong>Contact Data</strong> — email address and, where provided, phone number.</li>
                            <li><strong>Photos &amp; Camera Content</strong> — photos and images you capture or select are <strong>uploaded to and stored on our servers</strong> to provide app features.</li>
                            <li><strong>Location Data</strong> — approximate or precise location, collected only if you grant location permission.</li>
                            <li><strong>Device &amp; Usage Data</strong> — device model, operating system version, unique device identifiers, app interactions, and diagnostic/crash information.</li>
                            <li><strong>Push Token</strong> — a notification token is collected to deliver push notifications if you opt in.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">3. How We Use Your Data</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>To create, authenticate, and manage your LOIT account.</li>
                            <li>To provide and operate core app features, including storing and displaying the photos you upload.</li>
                            <li>To provide location-based features where you have granted permission.</li>
                            <li>To send push notifications you have opted in to receive.</li>
                            <li>To monitor stability, diagnose crashes, and improve performance and features.</li>
                            <li>To comply with legal obligations and protect against fraud or abuse.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">4. App Permissions</h2>
                        <p className="mb-4">
                            LOIT requests the following device permissions. Each is used only for the purpose listed and can be revoked at any
                            time through your device settings.
                        </p>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-white/5 text-white">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Permission</th>
                                        <th className="px-4 py-3 font-semibold">Why LOIT needs it</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/75">
                                    <tr className="border-t border-white/10">
                                        <td className="px-4 py-3 font-medium text-white">Camera</td>
                                        <td className="px-4 py-3">Capture photos within the app to upload and use in LOIT features.</td>
                                    </tr>
                                    <tr className="border-t border-white/10">
                                        <td className="px-4 py-3 font-medium text-white">Photos / Media</td>
                                        <td className="px-4 py-3">Select existing images from your device to upload and use in LOIT features.</td>
                                    </tr>
                                    <tr className="border-t border-white/10">
                                        <td className="px-4 py-3 font-medium text-white">Location</td>
                                        <td className="px-4 py-3">Provide location-based features when you choose to share your location.</td>
                                    </tr>
                                    <tr className="border-t border-white/10">
                                        <td className="px-4 py-3 font-medium text-white">Notifications</td>
                                        <td className="px-4 py-3">Deliver push notifications you have opted in to receive.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">5. Third Parties &amp; Data Sharing</h2>
                        <p className="mb-4">
                            We do not sell your personal data. We share data only with the service providers required to run LOIT:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><strong>Supabase</strong> — provides authentication, database, and photo/file storage. Your account data and uploaded photos are stored on Supabase infrastructure.</li>
                            <li><strong>Firebase (Google)</strong> — provides analytics and crash reporting, collecting anonymized usage and diagnostic data to improve stability and performance.</li>
                            <li><strong>Firebase Cloud Messaging (Google)</strong> — delivers push notifications; your device push token is processed for this purpose.</li>
                            <li><strong>Google Play Services / Maps</strong> — supports location features when you grant location permission.</li>
                        </ul>
                        <p className="mt-4">
                            These providers process data on our behalf under their own privacy and security commitments and only as needed to
                            deliver their services.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">6. Data Retention</h2>
                        <p>
                            We retain your personal data for as long as your LOIT account is active or as needed to provide the app&apos;s
                            features. When you request deletion of your account, we delete your personal data and uploaded photos from our
                            systems, except where we are required to retain certain information to comply with legal obligations, resolve
                            disputes, or enforce our agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">7. Data Security</h2>
                        <p>
                            We put in place appropriate technical and organizational measures to protect your personal data from accidental
                            loss, unauthorized access, alteration, or disclosure. Access to your data is limited to those who need it to
                            operate and support the LOIT app. No method of transmission or storage is completely secure, but we work to protect
                            your data using industry-standard safeguards.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">8. Account &amp; Data Deletion</h2>
                        <p>
                            You can request deletion of your LOIT account and all associated data, including uploaded photos, at any time.
                            Follow the steps on our{' '}
                            <Link href="/account-deletion" className="text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-200">
                                Account Deletion
                            </Link>{' '}
                            page, or email us at{' '}
                            <a href={`mailto:${email}`} className="text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-200">
                                {email}
                            </a>. We will process your request and remove your data as described in the Data Retention section above.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">9. Children&apos;s Privacy</h2>
                        <p>
                            LOIT is not directed to children under the age of 13, and we do not knowingly collect personal data from children
                            under 13. If you believe a child has provided us with personal data, please contact us so we can delete it.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">10. Your Rights</h2>
                        <p>
                            Depending on your location, you may have rights to access, correct, delete, restrict, or object to the processing of
                            your personal data, and to data portability. Where processing is based on consent, you may withdraw that consent at
                            any time. To exercise any of these rights, contact us using the details below.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-white">11. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or how LOIT handles your data, contact us at:
                            <br />
                            Email:{' '}
                            <a href={`mailto:${email}`} className="text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-200">
                                {email}
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
