'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { CountUp } from '@/components/animations/CountUp';

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  stats?: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
  }>;
  className?: string;
}

/**
 * Features section component with scroll-triggered animations.
 * Features:
 * - Stagger animation for feature cards
 * - Animated counters for statistics
 * - Responsive grid layout
 */
export function Features({ title, subtitle, features, stats, className = '' }: FeaturesProps) {
  return (
    <section 
      className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          {subtitle && (
            <span className="text-sm sm:text-base font-medium text-purple-600 uppercase tracking-wider mb-2 block">
              {subtitle}
            </span>
          )}
          <h2 
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
        </ScrollReveal>

        {/* Features Grid */}
        <StaggerChildren 
          staggerDelay={0.1} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          role="list"
          aria-label="Features list"
        >
          {features.map((feature, index) => (
            <article
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              role="listitem"
            >
              <div className="text-4xl mb-4" role="img" aria-label={`${feature.title} icon`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </article>
          ))}
        </StaggerChildren>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <ScrollReveal direction="up">
            <div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-200 dark:border-gray-700"
              role="list"
              aria-label="Statistics"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center" role="listitem">
                  <div 
                    className="text-4xl md:text-5xl font-bold text-purple-600 mb-2"
                    aria-label={`${stat.prefix || ''}${stat.value}${stat.suffix || ''} ${stat.label}`}
                  >
                    <CountUp
                      end={stat.value}
                      duration={1}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
