'use client';

import { useState } from 'react';

/**
 * ContactCards - Interactive expandable office location cards
 * Click or hover to expand and see full details
 */
export default function ContactCards() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleCardClick = (cardNumber: number, mapsUrl: string) => {
    // Toggle expansion
    setExpandedCard(expandedCard === cardNumber ? null : cardNumber);
    // Open Google Maps in new tab
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto max-w-7xl mt-16">
      <div className="flex gap-4 h-[500px]">
        {/* Card 1 - Tondano Office */}
        <div 
          className={`group relative rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
            expandedCard === 1 ? 'flex-[2]' : 'flex-1 hover:flex-[2]'
          }`}
          onClick={() => handleCardClick(1, "https://maps.app.goo.gl/1Hc3a9AwZ3Rgq11z7")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick(1, "https://maps.app.goo.gl/1Hc3a9AwZ3Rgq11z7");
            }
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop"
            alt="Tondano Office workspace"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              expandedCard === 1 ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />
          <div 
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              background: 'linear-gradient(to top, rgba(26, 26, 62, 0.85) 0%, rgba(26, 26, 62, 0.5) 50%, transparent 100%)',
            }}
          />
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              expandedCard === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              background: 'linear-gradient(to top, rgba(26, 26, 62, 0.95) 0%, rgba(26, 26, 62, 0.7) 60%, rgba(26, 26, 62, 0.3) 100%)',
            }}
          />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10">
            <h3 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-2 transition-all duration-700 ease-out leading-tight ${
              expandedCard === 1 ? 'translate-y-[-4px] text-2xl' : 'group-hover:translate-y-[-4px] group-hover:text-2xl'
            }`}>
              Tondano<span className={`transition-opacity duration-700 ease-out ${
                expandedCard === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}><br />Office</span>
            </h3>
            <div className="overflow-hidden">
              <p className={`text-sm transition-all duration-700 ease-out delay-100 transform ${
                expandedCard === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
              }`}>
                Kompleks Pasar Bawah<br />
                Kel.Wawalintouan, Kec. Tondano Barat<br />
                Kabupaten Minahasa<br />
                Sulawesi Utara, Indonesia<br />
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 - Manado Office */}
        <div 
          className={`group relative rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
            expandedCard === 2 ? 'flex-[2]' : 'flex-1 hover:flex-[2]'
          }`}
          onClick={() => handleCardClick(2, "https://maps.app.goo.gl/6mu8xWkfThW6quTa9")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick(2, "https://maps.app.goo.gl/6mu8xWkfThW6quTa9");
            }
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop"
            alt="Manado Office team"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              expandedCard === 2 ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />
          <div 
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              background: 'linear-gradient(to top, rgba(26, 26, 62, 0.85) 0%, rgba(26, 26, 62, 0.5) 50%, transparent 100%)',
            }}
          />
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              expandedCard === 2 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              background: 'linear-gradient(to top, rgba(26, 26, 62, 0.95) 0%, rgba(26, 26, 62, 0.7) 60%, rgba(26, 26, 62, 0.3) 100%)',
            }}
          />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10">
            <h3 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-2 transition-all duration-700 ease-out leading-tight ${
              expandedCard === 2 ? 'translate-y-[-4px] text-2xl' : 'group-hover:translate-y-[-4px] group-hover:text-2xl'
            }`}>
              Manado<span className={`transition-opacity duration-700 ease-out ${
                expandedCard === 2 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}><br />Office</span>
            </h3>
            <div className="overflow-hidden">
              <p className={`text-sm transition-all duration-700 ease-out delay-100 transform ${
                expandedCard === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
              }`}>
                Jl. Toar No.19<br />
                Kel. Mahakeret, Kec. Wenang<br />
                Kota Manado<br />
                Sulawesi Utara, Indonesia<br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
