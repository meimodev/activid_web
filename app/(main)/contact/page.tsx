import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/Hero';
import ContactCards from '@/components/sections/ContactCards';
import { ContactMethods } from '@/components/sections/ContactMethods';
import { OurClients } from '@/components/sections/OurClients';
import { CTA } from '@/components/sections/CTA';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: `${siteContent.contactPage.header.title} | ACTIVID`,
  description: 'Get in touch with us. We would love to hear about your project and how we can help bring your vision to life.',
  keywords: ['contact', 'get in touch', 'inquiry', 'project consultation'],
};

export default function Contact() {
  const { header, methods } = siteContent.contactPage;

  return (
    <main>
      <PageHero
        title={header.title}
        cta={{ text: 'Chat on WhatsApp', href: methods.whatsapp.href }}
        media={{ src: siteContent.servicePages.videoPodcast.mainProject.image, alt: 'A conversation being recorded on an Activid podcast set' }}
      >
        <p>Ceritakan proyek Anda lewat WhatsApp atau Instagram, atau mampir ke kantor kami di Tondano dan Manado.</p>
      </PageHero>
      <ContactMethods />
      <ContactCards />
      <OurClients />
      <CTA />
    </main>
  );
}
