import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedGradientBackground } from '@/components/ui';
import Navigation from '@/components/layouts/Navigation';
import type { HeroContent } from '@/types/hero.types';
import type { Testimonial } from '@/components/sections/Testimonials';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ACTIVID | Creative Agency',
  description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
  keywords: ['web design', 'web development', 'animations', 'framer motion', 'next.js', 'performance', 'accessibility'],
  authors: [{ name: 'ACTIVID Team' }],
  openGraph: {
    title: 'ACTIVID | Creative Agency',
    description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ACTIVID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACTIVID | Creative Agency',
    description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
  },
};

// Dynamic imports with loading fallbacks for heavy animation components
// Requirements: 5.4 - Display skeleton screens during dynamic import
// Note: SSR is enabled for SSG (Static Site Generation) compatibility
const Hero = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.Hero })), {
  loading: () => <Skeleton className="min-h-screen" />,
});

const AboutUs = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.AboutUs })), {
  loading: () => <Skeleton className="h-96" />,
});

const Testimonials = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.Testimonials })), {
  loading: () => <Skeleton className="h-96" />,
});

const ScrollExpandableCards = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.ScrollExpandableCards })), {
  loading: () => <Skeleton className="min-h-screen" />,
});

const OurClients = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.OurClients })), {
  loading: () => <Skeleton className="h-48" />,
});

const CTA = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.CTA })), {
  loading: () => <Skeleton className="h-96" />,
});

/**
 * Home page - Premium landing page with immersive animations
 * Implements SSG (Static Site Generation) for optimal performance
 * Requirements: 1.1, 5.4
 */
export default function Home() {
  const heroContent: HeroContent = {
    title: 'ACTIVID\nPORTFOLIO',
    subtitle: 'Activid ',
    description: 'Create stunning, high-performance websites with sophisticated animations that captivate your audience and elevate your brand.',
    cta: {
      primary: {
        text: 'Get Started',
        href: '/contact',
      },
      secondary: {
        text: 'View Work',
        href: '/#services',
      },
    },
    gradientOrbs: {
      count: 3,
      colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
    },
  };



  const testimonials: Testimonial[] = [
    {
      quote: 'Mantap. Social media jadi lebih ramai, enggagement jadi lebih banyak ',
      author: 'Bbold',
      role: 'Bbold',
      company: 'Bbold',
    },
    {
      quote: 'Paket lengkap, dari social media management, dokumentasi event, produksi video, hingga pengembangan website & applikasi. Tidak perlu bingung mencari agensi lagi.',
      author: 'Yama Resort',
      role: 'Yama Resort',
      company: 'Yama Resort',
    },
    {
      quote: 'Sangat jarang menemukan agensi yang bisa menyeimbangkan kreativitas visual dengan data. Setiap konten memiliki tujuan yang jelas untuk mendatangkan pelanggan baru.',
      author: 'BRI Peduli',
      role: 'BRI Peduli',
      company: 'BRI Peduli',
    },
    {
      quote: 'Kami sudah pernah bekerja dengan banyak developer sebelumnya, tapi tim ini berbeda. Mereka berani memberikan masukan dan prespektif baru agar sistem kami menjadi lebih baik.',
      author: 'Pertamina Geothermal Energy',
      role: 'Pertamina Geothermal Energy',
      company: 'Pertamina Geothermal Energy',
    },
  ];

  const expandableCards = [
    {
      id: 'branding',
      title: 'Branding & Design',
      description: 'Membentuk identitas visual yang kuat dari logo, palet warna, tipografi, hingga panduan brand lengkap yang menggambarkan nilai dan karakter bisnis Anda.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      imageAlt: 'Branding and Design',
      color: '#7a7a9d',
      buttonText: 'View Project',
      buttonLink: '/services/branding',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      description: 'Mengelola dan mengembangkan citra brand Anda di media sosial. Mulai dari strategi konten, desain, copywriting, hingga analisis performa agar audiens Anda tumbuh secara organik dan relevan.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
      imageAlt: 'Social Media Management',
      color: '#5a5a8d',
      buttonText: 'View Project',
      buttonLink: '/services/social-media',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      id: 'event-documentation',
      title: 'Event & Documentation',
      description: 'Menangkap momen terbaik dari setiap acara Anda dari event perusahaan, pernikahan, hingga konser musik dengan kualitas visual yang hidup dan emosional.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      imageAlt: 'Event and Documentation',
      color: '#5a5a8d',
      buttonText: 'View Project',
      buttonLink: '/services/event-documentation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
    },
    {
      id: 'video-podcast',
      title: 'Video & Podcast Production',
      description: 'Cerita yang baik layak disampaikan dengan kualitas visual dan audio yang maksimal. Dari konsep, shooting, editing, hingga final rendering, kami siap bantu Anda bercerita lewat video promosi, company profile, hingga podcast profesional.',
      image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
      imageAlt: 'Video and Podcast Production',
      color: '#4a4a7d',
      buttonText: 'View Project',
      buttonLink: '/services/video-podcast',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
    {
      id: 'website-app',
      title: 'Website & App Development',
      description: 'Membangun platform digital yang elegan, cepat, dan user friendly. Mulai dari website company profile, landing page, hingga aplikasi mobile dengan desain antarmuka yang intuitif dan estetis.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      imageAlt: 'Website and App Development',
      color: '#5a5a8d',
      buttonText: 'View Project',
      buttonLink: '/services/website-app',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      id: 'product-photography',
      title: 'Product Photography',
      description: 'Menampilkan produk Anda dengan visual yang tajam, estetik, dan profesional setiap detail difoto untuk menarik perhatian dan memperkuat identitas brand.',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
      imageAlt: 'Product Photography',
      color: '#5a5a8d',
      buttonText: 'View Project',
      buttonLink: '/services/product-photography',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen">
      <AnimatedGradientBackground className="fixed -z-50" />
      <Hero content={heroContent} />
      <Navigation position="sticky" />
      <OurClients />
      <AboutUs />
      <ScrollExpandableCards cards={expandableCards} />
      <Testimonials
        title="Client Feedback"
        testimonials={testimonials}
      />
      <CTA />
    </main>
  );
}
