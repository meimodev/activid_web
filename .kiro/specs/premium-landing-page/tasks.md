# Implementation Plan

- [x] 1. Set up project foundation and dependencies
  - Install required dependencies: framer-motion, lenis, clsx
  - Configure Tailwind CSS with animation utilities
  - Set up TypeScript types directory structure
  - Create animation configuration constants (easing, durations, variants)
  - _Requirements: 1.1_

- [x] 2. Implement core custom hooks
  - _Requirements: 9.1_

- [x] 2.1 Create useScrollProgress hook
  - Implement hook using Framer Motion's useScroll
  - Return MotionValue for scroll progress (0-1)
  - _Requirements: 9.1_

- [x] 2.2 Write property test for useScrollProgress
  - **Property 22: Progress indicator scroll synchronization**
  - **Validates: Requirements 7.2, 8.4**

- [x] 2.3 Create useInView hook
  - Wrap Framer Motion's useInView with custom options
  - Support threshold, rootMargin, and once options
  - Return ref and boolean inView state
  - _Requirements: 9.1_

- [x] 2.4 Create useMousePosition hook
  - Add global mousemove event listener
  - Track and return current mouse coordinates
  - Implement throttling for performance
  - Clean up listener on unmount
  - _Requirements: 9.1_

- [x] 2.5 Create useWindowSize hook
  - Listen to window resize events
  - Return width, height, and device type flags
  - Implement debouncing (150ms)
  - Handle SSR gracefully
  - _Requirements: 9.1_

- [x] 2.6 Create useReducedMotion hook
  - Check prefers-reduced-motion media query
  - Return boolean indicating preference
  - Update on preference change
  - _Requirements: 9.1, 10.1_

- [x] 2.7 Write property test for useReducedMotion
  - **Property 2: Reduced motion compliance**
  - **Validates: Requirements 1.3, 10.1, 10.2, 10.3, 10.4**

- [-] 3. Build reusable animation components
  - _Requirements: 9.2_

- [x] 3.1 Create ScrollReveal component
  - Implement with motion.div and whileInView
  - Support direction prop (up, down, left, right)
  - Add configurable delay, duration, threshold
  - Support once and repeated animations
  - _Requirements: 9.2_

- [x] 3.2 Write property test for ScrollReveal
  - **Property 6: Fade-up animation consistency**
  - **Validates: Requirements 3.1**

- [x] 3.3 Create ParallaxWrapper component
  - Use useScroll and useTransform hooks
  - Calculate offset based on speed multiplier
  - Support vertical and horizontal parallax
  - Apply will-change: transform
  - _Requirements: 9.2_

- [x] 3.4 Write property test for ParallaxWrapper
  - **Property 4: Parallax speed multiplier accuracy**
  - **Validates: Requirements 2.3, 3.6**

- [x] 3.5 Create MagneticButton component
  - Track mouse position relative to button
  - Calculate distance from center
  - Apply spring physics with useSpring
  - Reset position on mouse leave
  - Support configurable strength
  - _Requirements: 9.2_

- [x] 3.6 Write property test for MagneticButton
  - **Property 11: Magnetic button attraction**
  - **Validates: Requirements 4.1**

- [x] 3.7 Create SplitText component
  - Split text by word or character
  - Wrap each in motion.span
  - Implement stagger animation with variants
  - Preserve spacing and line breaks
  - _Requirements: 9.2_

- [x] 3.8 Write property test for SplitText
  - **Property 7: Stagger animation timing**
  - **Validates: Requirements 3.2, 8.1, 8.2**

- [x] 3.9 Create CountUp component
  - Use useInView to trigger animation
  - Animate with useSpring and MotionValue
  - Format number with decimals
  - Support prefix and suffix
  - _Requirements: 9.2_

- [x] 3.10 Write property test for CountUp
  - **Property 21: Counter animation from zero**
  - **Validates: Requirements 7.1, 7.4**

- [x] 3.11 Create ProgressIndicator component
  - Support line and circle types
  - Use useScrollProgress hook
  - For line: animate scaleX
  - For circle: animate stroke-dashoffset
  - Support positioning options
  - _Requirements: 9.2_

- [x] 3.12 Write property test for ProgressIndicator
  - **Property 23: Circular progress stroke animation**
  - **Validates: Requirements 7.3**

- [x] 3.13 Create StaggerChildren component
  - Implement container with stagger variants
  - Support configurable delay between children
  - Apply to child elements automatically
  - _Requirements: 9.2_

- [x] 4. Implement layout components
  - _Requirements: 11.1_

- [x] 4.1 Create SmoothScroll wrapper
  - Initialize Lenis smooth scroll library
  - Integrate with Framer Motion
  - Update on each frame with requestAnimationFrame
  - Clean up on unmount
  - _Requirements: 11.1_

- [x] 4.2 Write property test for SmoothScroll
  - **Property 26: Smooth scroll interpolation**
  - **Validates: Requirements 11.1**

- [x] 4.3 Create PageTransition wrapper
  - Use AnimatePresence with mode="wait"
  - Implement exit animation (opacity 0, y -20)
  - Implement entrance animation (opacity 0, y 20 to final)
  - Ensure exit completes before entrance
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 4.4 Write property test for PageTransition
  - **Property 17: Page transition sequence**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 4.5 Create Navigation component
  - Implement animated menu with stagger
  - Support open/close animations
  - Apply reverse stagger on close
  - Include scroll progress indicator
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 4.6 Write property test for Navigation stagger
  - **Property 24: Navigation menu opacity and position**
  - **Validates: Requirements 8.3**

- [x] 4.7 Create AnimationErrorBoundary component
  - Catch animation-related errors
  - Fallback to static content
  - Log errors for monitoring
  - Maintain functionality
  - _Requirements: 9.5_

- [x] 4.8 Write property test for error boundary
  - **Property 25: Animation error boundary handling**
  - **Validates: Requirements 9.5**

- [x] 5. Build Hero section with immersive animations
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5.1 Create Hero component structure
  - Set up component with TypeScript interface
  - Add hero content data model
  - Implement responsive layout
  - _Requirements: 2.1, 2.2_

- [x] 5.2 Implement hero text animations
  - Use SplitText for word-by-word reveal
  - Apply hero animation variant (scale, opacity, rotateX)
  - Set duration to 1.2 seconds
  - _Requirements: 2.1, 2.2_

- [x] 5.3 Write property test for hero animations
  - **Property 3: Hero animation initialization**
  - **Validates: Requirements 2.2**

- [x] 5.4 Write property test for text reveal
  - **Property 28: Word-by-word text reveal**
  - **Validates: Requirements 2.1**

- [x] 5.5 Add parallax background layers
  - Create multiple layers with different speeds
  - Use ParallaxWrapper with 30% offset
  - Apply to background elements
  - _Requirements: 2.3_

- [x] 5.6 Implement gradient orbs with mouse tracking
  - Create floating orb elements
  - Use useMousePosition hook
  - Update orb positions based on cursor
  - Apply blur and gradient effects
  - _Requirements: 2.4_

- [x] 5.7 Write property test for gradient orbs
  - **Property 5: Mouse-following gradient orbs**
  - **Validates: Requirements 2.4**

- [x] 6. Implement scroll-triggered animations
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.7_

- [x] 6.1 Create FadeUp animation wrapper
  - Use ScrollReveal with direction="up"
  - Set 100px offset and 0.8s duration
  - Configure viewport threshold
  - _Requirements: 3.1_

- [x] 6.2 Implement horizontal scroll section
  - Pin section during scroll
  - Translate content horizontally based on progress
  - Use useScroll with container ref
  - _Requirements: 3.3_

- [x] 6.3 Create scale animation component
  - Animate from scale 0.5 to 1.0
  - Tie to scroll progress
  - Use useTransform for interpolation
  - _Requirements: 3.4_

- [x] 6.4 Write property test for scale animation
  - **Property 8: Scroll-linked scale animation**
  - **Validates: Requirements 3.4**

- [x] 6.5 Implement 3D flip card component
  - Apply rotateY transformation
  - Trigger on viewport entry
  - Set 0.8s duration
  - _Requirements: 3.5_

- [x] 6.6 Write property test for 3D rotation
  - **Property 9: 3D rotation reveal timing**
  - **Validates: Requirements 3.5**

- [x] 6.7 Create SVG morph animation
  - Animate SVG path data
  - Tie to scroll progress
  - Use useTransform with path interpolation
  - _Requirements: 3.7_

- [x] 6.8 Write property test for SVG morph
  - **Property 10: SVG path morph progression**
  - **Validates: Requirements 3.7**

- [x] 7. Build micro-interactions
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 7.1 Create interactive hover effects
  - Apply scale and rotation on hover
  - Set 250ms duration
  - Use whileHover prop
  - _Requirements: 4.2_

- [x] 7.2 Write property test for hover effects
  - **Property 12: Interactive element hover response**
  - **Validates: Requirements 4.2**

- [x] 7.3 Implement form field animations
  - Animate border on focus
  - Animate label position
  - Add smooth transitions
  - _Requirements: 4.3_

- [x] 7.4 Write property test for form fields
  - **Property 13: Form field focus animation**
  - **Validates: Requirements 4.3**

- [x] 7.5 Create toast notification component
  - Use spring physics for entrance
  - Position fixed with z-index
  - Auto-dismiss after timeout
  - _Requirements: 4.4_

- [x] 7.6 Write property test for toast
  - **Property 14: Form submission feedback**
  - **Validates: Requirements 4.4**

- [x] 7.7 Implement custom cursor follower
  - Create cursor element with blur
  - Use useMousePosition hook
  - Apply smooth following animation
  - Hide default cursor
  - _Requirements: 4.5_

- [x] 7.8 Write property test for cursor follower
  - **Property 15: Cursor follower tracking**
  - **Validates: Requirements 4.5**

- [x] 7.9 Create liquid morphing button
  - Apply morphing effect on interaction
  - Use SVG or border-radius animation
  - Implement with Framer Motion
  - _Requirements: 4.6_

- [x] 7.10 Write property test for button morphing
  - **Property 16: Button liquid morphing**
  - **Validates: Requirements 4.6**

- [x] 8. Implement responsive behavior
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 8.1 Create responsive animation variants
  - Define mobile and desktop variants
  - Use useWindowSize to detect device
  - Apply appropriate variant based on viewport
  - _Requirements: 6.1, 6.2_

- [x] 8.2 Write property test for responsive animations
  - **Property 19: Responsive animation adaptation**
  - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 8.3 Implement touch interaction feedback
  - Detect touch events
  - Apply haptic-style animations
  - Scale and opacity feedback
  - _Requirements: 6.5_

- [x] 8.4 Write property test for touch feedback
  - **Property 20: Touch interaction feedback**
  - **Validates: Requirements 6.5**

- [x] 9. Create page components
  - _Requirements: 1.1_

- [x] 9.1 Build Home page
  - Compose Hero, Features, Testimonials sections
  - Apply page-level animations
  - Implement with SSG
  - _Requirements: 1.1_

- [x] 9.2 Build About page
  - Create team showcase section
  - Use stagger reveals for team members
  - Implement with SSG
  - _Requirements: 1.1_

- [x] 9.3 Build Services page
  - Create interactive service cards
  - Apply hover effects and animations
  - Implement with SSG
  - _Requirements: 1.1_

- [x] 9.4 Build Work/Portfolio page
  - Create portfolio grid with parallax
  - Implement case study cards
  - Add scroll-triggered reveals
  - Implement with SSG
  - _Requirements: 1.1_

- [x] 9.5 Build Contact page
  - Create animated contact form
  - Implement form field animations
  - Add form submission with toast
  - Implement with SSG
  - _Requirements: 1.1_

- [x] 10. Implement root layout and providers
  - _Requirements: 1.1_

- [x] 10.1 Create root layout
  - Wrap with SmoothScroll provider
  - Add Navigation component
  - Add PageTransition wrapper
  - Add ScrollProgress indicator
  - _Requirements: 1.1_

- [x] 10.2 Configure global styles
  - Set up CSS variables for animations
  - Define easing functions in CSS
  - Add Tailwind animation utilities
  - _Requirements: 9.3, 9.4_

- [x] 10.3 Add skeleton loading components
  - Create skeleton screens for heavy components
  - Use with dynamic imports
  - Apply during loading states
  - _Requirements: 5.4_

- [x] 10.4 Write property test for skeleton screens
  - **Property 18: Skeleton screen display during loading**
  - **Validates: Requirements 5.4**

- [x] 11. Optimize performance
  - _Requirements: 1.2, 1.4, 1.5, 5.5_

- [x] 11.1 Implement dynamic imports
  - Lazy load heavy animation components
  - Use Next.js dynamic with ssr: false
  - Add loading fallbacks
  - _Requirements: 5.4_

- [x] 11.2 Add will-change optimization
  - Apply will-change to animated elements
  - Remove after animation completes
  - Use sparingly for performance
  - _Requirements: 1.2_

- [x] 11.3 Optimize images
  - Use Next.js Image component
  - Implement lazy loading
  - Optimize hero images for LCP
  - _Requirements: 1.5_

- [x] 11.4 Write property test for frame rate
  - **Property 1: Animation frame rate consistency**
  - **Validates: Requirements 1.2, 6.4, 11.2**

- [x] 12. Implement SEO and accessibility
  - _Requirements: 12.1, 12.2, 12.3_

- [x] 12.1 Add meta tags
  - Create meta tags for all pages
  - Include title, description, Open Graph
  - Use Next.js Metadata API
  - _Requirements: 12.1_

- [x] 12.2 Ensure semantic HTML
  - Use proper heading hierarchy
  - Add ARIA labels where needed
  - Ensure keyboard navigation
  - _Requirements: 12.3_

- [x] 12.3 Verify SSG configuration
  - Confirm all pages use generateStaticParams
  - Verify build output is static
  - Test static page serving
  - _Requirements: 12.2_

- [x] 13. Implement scroll-controlled expandable card section
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

- [x] 13.1 Create ScrollExpandableCards component structure
  - Define TypeScript interfaces for CardData and component props
  - Set up component with state management for active card index
  - Create refs for section and scroll accumulator
  - Implement two-column responsive layout structure
  - _Requirements: 13.7_

- [x] 13.2 Implement scroll lock mechanism
  - Set up Intersection Observer to detect section entry
  - Lock page scrolling when section is 50% visible
  - Capture wheel events with preventDefault
  - Store scroll lock state
  - _Requirements: 13.1_

- [x] 13.3 Write property test for scroll lock
  - **Property 29: Scroll lock activation on section entry**
  - **Validates: Requirements 13.1**

- [x] 13.4 Implement scroll-based card navigation
  - Create scroll accumulator to track scroll delta
  - Implement threshold-based card transitions (100px)
  - Handle scroll down to expand next card
  - Handle scroll up to collapse current card
  - Update active card index based on scroll direction
  - _Requirements: 13.2, 13.3_

- [x] 13.5 Write property test for card expansion
  - **Property 30: Sequential card expansion on scroll down**
  - **Validates: Requirements 13.2**

- [x] 13.6 Write property test for card collapse
  - **Property 31: Sequential card collapse on scroll up**
  - **Validates: Requirements 13.3**

- [x] 13.7 Implement boundary scroll release
  - Detect when at first card and scrolling up
  - Detect when at last card and scrolling down
  - Release scroll control and restore page scrolling
  - Reset scroll accumulator on release
  - _Requirements: 13.5, 13.6_

- [x] 13.8 Implement card expansion animations
  - Animate card height from 80px to auto
  - Animate card opacity from 0.5 to 1.0
  - Set transition duration to 400ms
  - Use easeInOut easing
  - Animate description reveal with AnimatePresence
  - _Requirements: 13.8_

- [x] 13.9 Write property test for card animations
  - **Property 34: Card transition animation timing**
  - **Validates: Requirements 13.8**

- [x] 13.10 Implement synchronized image display
  - Create image container with sticky positioning
  - Use AnimatePresence for image transitions
  - Sync image changes with active card index
  - Animate image opacity and scale transitions
  - _Requirements: 13.4_

- [x] 13.11 Write property test for image sync
  - **Property 32: Image synchronization with active card**
  - **Validates: Requirements 13.4**

- [x] 13.12 Write property test for layout structure
  - **Property 33: Two-column layout structure**
  - **Validates: Requirements 13.7**

- [x] 13.13 Add ScrollExpandableCards to Home page
  - Create sample card data with titles, descriptions, and images
  - Import and render ScrollExpandableCards component
  - Position between existing sections
  - Test scroll behavior integration
  - _Requirements: 13.1, 13.7_

- [x] 13.14 Write unit tests for edge cases
  - Test scroll release at boundaries
  - Test with single card
  - Test with empty cards array
  - Test responsive behavior on mobile
  - _Requirements: 13.5, 13.6_

- [x] 14. Checkpoint - Ensure scroll section tests pass
  - Ensure all tests pass, ask the user if questions arise

- [ ] 15. Implement missing property test for anchor link scrolling
  - _Requirements: 11.3_

- [ ] 15.1 Write property test for anchor link smooth scrolling
  - **Property 27: Anchor link smooth scrolling**
  - **Validates: Requirements 11.3**
  - Test that clicking anchor links triggers smooth scroll animation
  - Verify scroll position reaches target section
  - Ensure smooth interpolation during scroll

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Run all property-based tests
  - Verify all animations work correctly
  - Test on multiple devices and browsers
  - Ensure all tests pass, ask the user if questions arise
