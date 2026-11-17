import { Metadata } from 'next';
import { DateTime } from 'luxon';
import { PageHero } from '@/components/sections/Hero';
import { Clause } from '@/components/sections/Clause';
import { Billboard } from '@/components/sections/Billboard';

export const metadata: Metadata = {
    title: 'Terms of Service | Activid',
    description: 'Terms of Service for Activid, Palakat, and Loit. Please read these terms carefully before using our services.',
};

export default function TermsOfServicePage() {
    return (
        <main>
            <PageHero title="Terms of Service" facts={[`Last updated ${DateTime.now().toLocaleString(DateTime.DATE_FULL)}`]}>
                <p>Please read these terms carefully before using Activid, Palakat, or Loit.</p>
            </PageHero>
            <Billboard lines={[['Terms of Service'], ['Activid', 'Palakat', 'Loit']]} />

            <div className="wrap space-y-10 pt-(--gap-section) lg:space-y-14">
                <Clause title="1. Agreement to Terms">
                    <p>
                        By accessing our website or downloading and using the Palakat or Loit mobile applications, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing our services.
                    </p>
                    <p>
                        These Terms apply to:
                    </p>
                    <ul>
                        <li><strong>Activid</strong> — our portfolio website and web-based services.</li>
                        <li><strong>Palakat</strong> — our mobile application available on iOS and Android.</li>
                        <li><strong>Loit</strong> — our mobile application available on iOS and Android.</li>
                    </ul>
                </Clause>

                <Clause title="2. Intellectual Property Rights">
                    <p>
                        Other than the content you own, under these Terms, Activid and/or its licensors own all the intellectual property rights and materials contained in this website and the Palakat and Loit mobile applications. You are granted a limited, non-exclusive, non-transferable license only for the purposes of using our services as intended. You may not copy, modify, distribute, or reverse-engineer any part of our services.
                    </p>
                </Clause>

                <Clause title="3. Restrictions">
                    <p>
                        You are specifically restricted from all of the following:
                    </p>
                    <ul>
                        <li>Publishing any website or app material in any other media without authorization;</li>
                        <li>Selling, sublicensing and/or otherwise commercializing any website or app material;</li>
                        <li>Publicly performing and/or showing any website or app material;</li>
                        <li>Using our services in any way that is or may be damaging to the website or the Palakat and Loit apps;</li>
                        <li>Using our services in any way that impacts other users&apos; access;</li>
                        <li>Using our services contrary to applicable laws and regulations, or in any way that may cause harm to the services, or to any person or business entity;</li>
                        <li>Attempting to gain unauthorized access to any part of the Palakat or Loit apps or their backend systems.</li>
                    </ul>
                </Clause>

                <Clause title="4. Mobile Applications (Palakat & Loit)">
                    <p>
                        By downloading and using the Palakat or Loit mobile applications, you additionally agree to the following:
                    </p>
                    <ul>
                        <li><strong>App Store Terms:</strong> Your use of our apps is also subject to the terms of the platform from which you downloaded the app (Apple App Store or Google Play Store).</li>
                        <li><strong>Updates:</strong> We may release updates to our apps from time to time. Continued use of the app after an update constitutes acceptance of any revised terms.</li>
                        <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</li>
                        <li><strong>User Content:</strong> Any content you submit through our apps remains your responsibility. You grant Activid a non-exclusive license to use, display, and process your content solely to provide the apps&apos; services.</li>
                    </ul>
                </Clause>

                <Clause title="5. Limitation of Liability">
                    <p>
                        In no event shall Activid, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of our website or the Palakat and Loit mobile applications, whether such liability is under contract. Activid, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of our services.
                    </p>
                </Clause>

                <Clause title="6. Indemnification">
                    <p>
                        You hereby indemnify to the fullest extent Activid from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms, whether in connection with the website or the Palakat and Loit apps.
                    </p>
                </Clause>

                <Clause title="7. Variation of Terms">
                    <p>
                        Activid is permitted to revise these Terms at any time as it sees fit. By continuing to use our website or the Palakat and Loit applications after changes are posted, you are expected to have reviewed and accepted the updated Terms.
                    </p>
                </Clause>

                <Clause title="8. Governing Law & Jurisdiction">
                    <p>
                        These Terms will be governed by and interpreted in accordance with applicable laws, and you submit to the non-exclusive jurisdiction of the relevant courts for the resolution of any disputes arising from your use of our website or the Palakat and Loit mobile applications.
                    </p>
                </Clause>
            </div>
        </main>
    );
}
