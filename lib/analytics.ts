/**
 * Google Analytics Event Tracking Utility
 * 
 * This module provides a centralized way to track all important events
 * throughout the Activid website. Events are named in a human-readable format
 * for easy analysis in Google Analytics dashboards.
 * 
 * Event Naming Convention:
 * - Category: The section or feature of the website
 * - Action: What the user did
 * - Label: Additional context (optional)
 */

// Google Analytics Measurement ID - Replace with your actual GA4 ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track page views - automatically called by GoogleAnalytics component
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Generic event tracking function
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// ============================================
// NAVIGATION EVENTS
// ============================================

export const trackNavigation = {
  /**
   * Track when user clicks a navigation link
   */
  linkClick: (linkName: string, destination: string) => {
    trackEvent('navigation_click', {
      link_name: linkName,
      destination: destination,
      event_category: 'Navigation',
    });
  },

  /**
   * Track when mobile menu is opened/closed
   */
  mobileMenuToggle: (isOpen: boolean) => {
    trackEvent('mobile_menu_toggle', {
      menu_state: isOpen ? 'opened' : 'closed',
      event_category: 'Navigation',
    });
  },

  /**
   * Track logo click (usually navigates to home)
   */
  logoClick: () => {
    trackEvent('logo_click', {
      event_category: 'Navigation',
    });
  },
};

// ============================================
// CTA (CALL TO ACTION) EVENTS
// ============================================

export const trackCTA = {
  /**
   * Track hero section CTA clicks
   */
  heroGetStarted: () => {
    trackEvent('cta_click', {
      cta_name: 'Hero - Get Started',
      cta_location: 'hero_section',
      event_category: 'CTA',
    });
  },

  /**
   * Track hero section secondary CTA
   */
  heroViewWork: () => {
    trackEvent('cta_click', {
      cta_name: 'Hero - View Work',
      cta_location: 'hero_section',
      event_category: 'CTA',
    });
  },

  /**
   * Track "Get in Touch" button clicks
   */
  getInTouch: (location: string) => {
    trackEvent('cta_click', {
      cta_name: 'Get in Touch',
      cta_location: location,
      event_category: 'CTA',
    });
  },

  /**
   * Track CTA section button click
   */
  ctaSectionClick: () => {
    trackEvent('cta_click', {
      cta_name: 'CTA Section - Contact',
      cta_location: 'cta_section',
      event_category: 'CTA',
    });
  },
};

// ============================================
// SERVICE EVENTS
// ============================================

export const trackService = {
  /**
   * Track when user clicks to view a service
   */
  viewService: (serviceName: string, serviceId: string) => {
    trackEvent('service_view', {
      service_name: serviceName,
      service_id: serviceId,
      event_category: 'Services',
    });
  },

  /**
   * Track service card expansion
   */
  expandCard: (serviceName: string) => {
    trackEvent('service_card_expand', {
      service_name: serviceName,
      event_category: 'Services',
    });
  },

  /**
   * Track service page scroll depth
   */
  pageScrollDepth: (serviceName: string, depth: number) => {
    trackEvent('service_page_scroll', {
      service_name: serviceName,
      scroll_depth_percentage: depth,
      event_category: 'Services',
    });
  },
};

// ============================================
// CONTACT EVENTS
// ============================================

export const trackContact = {
  /**
   * Track WhatsApp link click
   */
  whatsappClick: () => {
    trackEvent('contact_method_click', {
      contact_method: 'WhatsApp',
      event_category: 'Contact',
    });
  },

  /**
   * Track email link click
   */
  emailClick: () => {
    trackEvent('contact_method_click', {
      contact_method: 'Email',
      event_category: 'Contact',
    });
  },

  /**
   * Track Instagram link click
   */
  instagramClick: () => {
    trackEvent('contact_method_click', {
      contact_method: 'Instagram',
      event_category: 'Contact',
    });
  },

  /**
   * Track office location click (maps)
   */
  officeLocationClick: (officeName: string) => {
    trackEvent('office_location_click', {
      office_name: officeName,
      event_category: 'Contact',
    });
  },
};

// ============================================
// FOOTER EVENTS
// ============================================

export const trackFooter = {
  /**
   * Track footer navigation link clicks
   */
  navLinkClick: (linkName: string) => {
    trackEvent('footer_nav_click', {
      link_name: linkName,
      event_category: 'Footer',
    });
  },

  /**
   * Track footer office location clicks
   */
  officeClick: (officeName: string) => {
    trackEvent('footer_office_click', {
      office_name: officeName,
      event_category: 'Footer',
    });
  },

  /**
   * Track privacy/terms link clicks
   */
  legalLinkClick: (linkType: 'privacy' | 'terms') => {
    trackEvent('footer_legal_click', {
      link_type: linkType,
      event_category: 'Footer',
    });
  },
};

// ============================================
// CLIENT/TESTIMONIAL EVENTS
// ============================================

export const trackTestimonial = {
  /**
   * Track when user views testimonials section
   */
  sectionView: () => {
    trackEvent('testimonials_section_view', {
      event_category: 'Testimonials',
    });
  },

  /**
   * Track testimonial navigation (if carousel)
   */
  navigate: (direction: 'next' | 'previous', currentIndex: number) => {
    trackEvent('testimonial_navigate', {
      direction: direction,
      current_index: currentIndex,
      event_category: 'Testimonials',
    });
  },
};

export const trackClients = {
  /**
   * Track when clients section comes into view
   */
  sectionView: () => {
    trackEvent('clients_section_view', {
      event_category: 'Clients',
    });
  },

  /**
   * Track client logo click (if clickable)
   */
  logoClick: (clientName: string) => {
    trackEvent('client_logo_click', {
      client_name: clientName,
      event_category: 'Clients',
    });
  },
};

// ============================================
// ENGAGEMENT EVENTS
// ============================================

export const trackEngagement = {
  /**
   * Track scroll depth on any page
   */
  scrollDepth: (pageName: string, depthPercentage: number) => {
    trackEvent('scroll_depth', {
      page_name: pageName,
      depth_percentage: depthPercentage,
      event_category: 'Engagement',
    });
  },

  /**
   * Track time spent on page
   */
  timeOnPage: (pageName: string, timeSeconds: number) => {
    trackEvent('time_on_page', {
      page_name: pageName,
      time_seconds: timeSeconds,
      event_category: 'Engagement',
    });
  },

  /**
   * Track external link clicks
   */
  externalLinkClick: (url: string, linkText: string) => {
    trackEvent('external_link_click', {
      url: url,
      link_text: linkText,
      event_category: 'Engagement',
    });
  },

  /**
   * Track video play events
   */
  videoPlay: (videoTitle: string, videoLocation: string) => {
    trackEvent('video_play', {
      video_title: videoTitle,
      video_location: videoLocation,
      event_category: 'Engagement',
    });
  },

  /**
   * Track image gallery interactions
   */
  galleryInteraction: (action: 'view' | 'next' | 'previous' | 'zoom', galleryName: string) => {
    trackEvent('gallery_interaction', {
      action: action,
      gallery_name: galleryName,
      event_category: 'Engagement',
    });
  },
};

// ============================================
// PROJECT/PORTFOLIO EVENTS
// ============================================

export const trackProject = {
  /**
   * Track project card click
   */
  cardClick: (projectName: string, category: string) => {
    trackEvent('project_click', {
      project_name: projectName,
      project_category: category,
      event_category: 'Projects',
    });
  },

  /**
   * Track project details view
   */
  detailsView: (projectName: string) => {
    trackEvent('project_details_view', {
      project_name: projectName,
      event_category: 'Projects',
    });
  },
};

// ============================================
// ABOUT US EVENTS
// ============================================

export const trackAbout = {
  /**
   * Track when about section comes into view
   */
  sectionView: () => {
    trackEvent('about_section_view', {
      event_category: 'About',
    });
  },
};
