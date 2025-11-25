'use client';

import { memo } from 'react';
import { InstagramGrid } from './InstagramGrid';
import type { BrowserFrameProps } from '@/types/project-showcase.types';

/**
 * BrowserFrame component that wraps content in a browser-like interface
 * Displays browser chrome elements (window controls, address bar) with InstagramGrid inside
 * 
 * @param mockupImages - Array of image URLs for the Instagram grid
 * @param imageAlts - Corresponding alt text for each image
 * @param isLoading - Loading state indicator
 * @param className - Optional additional CSS classes
 */
function BrowserFrameComponent({ 
  mockupImages, 
  imageAlts, 
  isLoading = false,
  priority = false,
  className = '' 
}: BrowserFrameProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      role="region"
      aria-label="Browser mockup frame"
    >
      {/* Browser Chrome - Window Controls and Address Bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
        {/* Window Controls - Decorative only, not interactive */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3" aria-hidden="true">
          <div 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"
          />
          <div 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"
          />
          <div 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"
          />
        </div>
        
        {/* Address Bar */}
        <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 sm:gap-2">
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <span className="truncate">instagram.com/project</span>
        </div>
      </div>

      {/* Browser Content - Instagram Grid */}
      <div className="bg-white p-2 sm:p-3 md:p-4">
        <InstagramGrid 
          images={mockupImages} 
          alts={imageAlts} 
          isLoading={isLoading}
          priority={priority}
        />
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const BrowserFrame = memo(BrowserFrameComponent);
