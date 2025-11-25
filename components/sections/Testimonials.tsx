'use client';

import { useEffect, useRef } from 'react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface TestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

/**
 * Testimonials section component with auto-scrolling carousel.
 * Features:
 * - Auto-scrolling from left to right
 * - Glassmorphism card design
 * - Infinite loop animation
 * - Pause on hover
 */
export function Testimonials({ title, testimonials, className = '' }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;

      // Reset scroll position when we've scrolled past half the content
      // (since we duplicate the content for seamless loop)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-[#F8EFDE] overflow-hidden ${className}`}>
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-left mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[8rem] font-black text-[#1a1a3e] font-[family-name:var(--font-bricolage)]">
            {title}
          </h2>
        </ScrollReveal>

        {/* Auto-scrolling Testimonials */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group shrink-0 w-[400px] p-8 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-lg hover:bg-[#1a1a3e]/90 hover:border-[#1a1a3e] transition-all duration-500"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Quote */}
              <p className=" text-[#1a1a3e]/90 group-hover:text-[#F8EFDE]/90 mb-6 italic leading-relaxed transition-colors duration-500">
                {testimonial.quote}
              </p>

              {/* Author Info */}
              <div className="font-semibold text-[#1a1a3e] group-hover:text-[#F8EFDE] transition-colors duration-500">
                {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
