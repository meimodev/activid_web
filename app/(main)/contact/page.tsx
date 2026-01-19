import { ScrollReveal } from '@/components/animations/ScrollReveal';
import Navigation from '@/components/layouts/Navigation';
import type { Metadata } from 'next';
import ContactCards from '@/components/sections/ContactCards';
import { ContactMethods } from '@/components/sections/ContactMethods';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: `${siteContent.contactPage.header.title} | Activid Portfolio`,
  description: 'Get in touch with us. We would love to hear about your project and how we can help bring your vision to life.',
  keywords: ['contact', 'get in touch', 'inquiry', 'project consultation'],
};

/**
 * Contact page - Contact information with expandable image cards
 * Implements SSG (Static Site Generation) for optimal performance
 * Requirements: 1.1
 */
export default function Contact() {
  const { header, officesTitle } = siteContent.contactPage;

  return (
    <main className="min-h-screen bg-[#F8EFDE]">
      <Navigation />

      {/* Hero Section */}
      <section className="py-8 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[8rem] font-bold text-[#1a1a3e] font-sans text-left">
              {header.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-[#1a1a3e]/70">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium font-sans">
                {header.subtitle}
              </p>
              <span className="text-xl sm:text-2xl md:text-3xl">•</span>
              <p className="text-xl sm:text-2xl md:text-3xl font-medium font-sans">
                {new Date().getFullYear()}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Contact Information Cards - Client Component with analytics */}
        <div className="container mx-auto max-w-7xl mt-12">
          <ScrollReveal direction="up" delay={0.2}>
            <ContactMethods />
          </ScrollReveal>
        </div>

        {/* Office Locations Section */}
        <div className="container mx-auto max-w-7xl mt-16">
          <ScrollReveal direction="up" delay={0.3}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a3e] font-sans mb-8">
              {officesTitle}
            </h2>
          </ScrollReveal>
        </div>

        {/* Expandable Image Cards */}
        <ContactCards />
      </section>
    </main>
  );
}
