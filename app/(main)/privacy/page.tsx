import { Metadata } from 'next';
import { DateTime } from 'luxon';
import { PageHero } from '@/components/sections/Hero';
import { Clause } from '@/components/sections/Clause';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
    title: 'Privacy Policy | Activid',
    description: 'Privacy Policy for Activid, Palakat, and Loit. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
    return (
        <main>
            <PageHero title="Privacy Policy" facts={[`Last updated ${DateTime.now().toLocaleString(DateTime.DATE_FULL)}`]}>
                <p>How we collect, use, and protect your data across Activid, Palakat, and Loit.</p>
            </PageHero>

            <div className="wrap space-y-10 pt-(--gap-section) lg:space-y-14">
                <Clause title="1. Introduction">
                    <p>
                        Welcome to Activid, Palakat, and Loit. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website or use the
                        Palakat or Loit mobile applications (regardless of where you access them from) and tell you about your privacy rights and how the law protects you.
                    </p>
                    <p>
                        This policy applies to:
                    </p>
                    <ul>
                        <li><strong>Activid</strong> — our portfolio website and web-based services.</li>
                        <li><strong>Palakat</strong> — our mobile application available on iOS and Android.</li>
                        <li><strong>Loit</strong> — our mobile application available on iOS and Android.</li>
                    </ul>
                </Clause>

                <Clause title="2. Data We Collect">
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul>
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address and telephone number.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access our services.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, the Palakat and Loit apps, products and services.</li>
                        <li><strong>Device Data</strong> (Palakat & Loit apps only) includes device model, operating system version, unique device identifiers, and mobile network information collected when you use the mobile applications.</li>
                        <li><strong>Location Data</strong> (Palakat & Loit apps only) includes approximate or precise location if you grant location permission within the apps.</li>
                    </ul>
                </Clause>

                <Clause title="3. How We Use Your Data">
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                        <li>To provide, operate, and improve the Palakat and Loit mobile applications and their features.</li>
                        <li>To send you notifications and updates related to your use of our apps, where you have opted in.</li>
                    </ul>
                </Clause>

                <Clause title="4. Mobile Apps (Palakat & Loit) — Specific Practices">
                    <p>
                        In addition to the general data practices above, the following applies specifically to the Palakat and Loit mobile applications:
                    </p>
                    <ul>
                        <li><strong>Permissions:</strong> Our apps may request access to your device camera, photo library, location, or notifications. These permissions are used solely to provide app features and can be revoked at any time via your device settings.</li>
                        <li><strong>Third-party SDKs:</strong> Our apps may include analytics or crash-reporting SDKs (e.g., Firebase) that collect anonymized usage and diagnostic data to help us improve app stability and performance.</li>
                        <li><strong>Data Deletion:</strong> You may request deletion of your Palakat or Loit account and associated data at any time by contacting us at the email below.</li>
                        <li><strong>Push Notifications:</strong> If you opt in, we may send push notifications. You can opt out at any time through your device notification settings.</li>
                    </ul>
                </Clause>

                <Clause title="5. Data Security">
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. These measures apply to both our website and the Palakat and Loit mobile applications.
                    </p>
                </Clause>

                <Clause title="6. Your Legal Rights">
                    <p>
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent. These rights apply to data collected through both our website and our mobile apps.
                    </p>
                </Clause>

                <Clause title="7. Contact Us">
                    <p>
                        If you have any questions about this privacy policy or our privacy practices — including questions related to the Palakat and Loit mobile apps — please contact us at:
                        <br />
                        Email:{' '}
                        <a href={siteContent.contactPage.methods.email.href} className="link">
                            {siteContent.contactPage.methods.email.value}
                        </a>
                    </p>
                </Clause>
            </div>
        </main>
    );
}
