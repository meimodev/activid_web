'use client';

import { useState } from 'react';
import { siteContent } from '@/lib/site-content';

/**
 * ContactCards - Interactive expandable office location cards
 * Click or hover to expand and see full details
 */
export default function ContactCards() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { offices } = siteContent.contactPage;

  const handleCardClick = (index: number, mapsUrl: string) => {
    // Toggle expansion
    setExpandedCard(expandedCard === index ? null : index);
    // Open Google Maps in new tab
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto max-w-7xl mt-16">
      <div className="flex gap-4 h-[500px]">
        {offices.map((office, index) => {
          const cardIndex = index + 1; // 1-based index for logic if needed, but 0-based is fine
          const isExpanded = expandedCard === index;
          const addressLines = Array.isArray(office.address) ? office.address : [office.address];

          return (
            <div
              key={office.city}
              className={`group relative rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${isExpanded ? 'flex-2' : 'flex-1 hover:flex-2'
                }`}
              onClick={() => handleCardClick(index, office.mapLink)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index, office.mapLink);
                }
              }}
            >
              {/* Using img tag to avoid next/image complexity with external URLs if domain not configured, 
                  but siteContent URLs are unsplash so it should be fine. 
                  Keeping img for simplicity as in original code or could upgrade to Next Image if domains allowed.
                  Original used img.
              */}
              <img
                src={office.image}
                alt={`${office.city} ${office.type} workspace`}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isExpanded ? 'scale-105' : 'group-hover:scale-105'
                  }`}
              />
              <div
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  background: 'linear-gradient(to top, rgba(26, 26, 62, 0.85) 0%, rgba(26, 26, 62, 0.5) 50%, transparent 100%)',
                }}
              />
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                style={{
                  background: 'linear-gradient(to top, rgba(26, 26, 62, 0.95) 0%, rgba(26, 26, 62, 0.7) 60%, rgba(26, 26, 62, 0.3) 100%)',
                }}
              />
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <h3 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-2 transition-all duration-700 ease-out leading-tight ${isExpanded ? 'translate-y-[-4px] text-2xl' : 'group-hover:translate-y-[-4px] group-hover:text-2xl'
                  }`}>
                  {office.city}<span className={`transition-opacity duration-700 ease-out ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}><br />{office.type}</span>
                </h3>
                <div className="overflow-hidden">
                  <p className={`text-sm transition-all duration-700 ease-out delay-100 transform ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}>
                    {addressLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < addressLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
