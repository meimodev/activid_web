import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Premium Landing Page',
  description: 'Get in touch with us to discuss your project. We\'d love to hear from you and help bring your digital vision to life.',
  keywords: ['contact', 'get in touch', 'contact form', 'project inquiry', 'web design inquiry'],
  authors: [{ name: 'Premium Landing Page Team' }],
  openGraph: {
    title: 'Contact Us | Premium Landing Page',
    description: 'Get in touch with us to discuss your project. We\'d love to hear from you and help bring your digital vision to life.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Premium Landing Page',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Premium Landing Page',
    description: 'Get in touch with us to discuss your project. We\'d love to hear from you and help bring your digital vision to life.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
