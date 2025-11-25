# Design Document

## Overview

The Premium Landing Page System is a sophisticated multi-page website built on Next.js 14+ with the App Router, leveraging Framer Motion for complex animations and Tailwind CSS for styling. The architecture prioritizes performance, maintainability, and visual excellence through a component-based design with reusable animation primitives.

The system consists of five primary pages (Home, About, Services, Work, Contact) connected by smooth page transitions. Each page utilizes scroll-triggered animations, parallax effects, and micro-interactions to create an immersive user experience. The design emphasizes separation of concerns with dedicated layers for animation logic, UI components, and page composition.

Key design principles:
- **Performance-first**: All animations target 60fps with lazy loading for heavy components
- **Accessibility**: Full support for reduced motion preferences
- **Responsive**: Mobile-first approach with device-specific animation variants
- **Maintainable**: Reusable animation components and custom hooks
- **Type-safe**: Full TypeScript coverage across all components

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App Router                    │
│                     (SSG + Client Hydration)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Page Components Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  About   │  │ Services │  │   Work   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Section Components Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Hero   │  │ Features │  │Portfolio │  │ Contact  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Animation Components Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ScrollReveal  │  │  Parallax    │  │  Magnetic    │     │
│  │              │  │  Wrapper     │  │  Button      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  SplitText   │  │   CountUp    │  │  Progress    │     │
│  │              │  │              │  │  Indicator   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Custom Hooks Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │useScrollProg │  │  useInView   │  │useMouse      │     │
│  │              │  │              │  │Position      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │useWindowSize │  │useReduced    │                        │
│  │              │  │Motion        │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Libraries Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Framer Motion │  │    Lenis     │  │  Tailwind    │     │
│  │              │  │  (Smooth     │  │    CSS       │     │
│  │              │  │   Scroll)    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
/app
  /page.tsx                    # Home page
  /about/page.tsx              # About page
  /services/page.tsx           # Services page
  /work/page.tsx               # Work/Portfolio page
  /contact/page.tsx            # Contact page
  /layout.tsx                  # Root layout with providers
  /globals.css                 # Global styles and CSS variables

/components
  /animations
    /ScrollReveal.tsx          # Scroll-triggered reveal wrapper
    /ParallaxWrapper.tsx       # Parallax effect container
    /MagneticButton.tsx        # Magnetic hover effect button
    /SplitText.tsx             # Word-by-word text reveal
    /CountUp.tsx               # Animated number counter
    /ProgressIndicator.tsx     # Scroll progress bar/circle
    /FadeUp.tsx                # Fade-up animation wrapper
    /StaggerChildren.tsx       # Stagger animation container
  /sections
    /Hero.tsx                  # Hero section component
    /Features.tsx              # Features showcase section
    /Testimonials.tsx          # Testimonials section
    /Portfolio.tsx             # Portfolio grid section
    /ContactForm.tsx           # Contact form section
  /layouts
    /SmoothScroll.tsx          # Lenis smooth scroll wrapper
    /PageTransition.tsx        # Page transition wrapper
    /Navigation.tsx            # Animated navigation menu
  /ui
    /Button.tsx                # Base button component
    /Card.tsx                  # Base card component
    /Input.tsx                 # Form input component

/hooks
  /useScrollProgress.ts        # Track scroll position (0-1)
  /useInView.ts                # Intersection observer hook
  /useMousePosition.ts         # Global mouse tracking
  /useWindowSize.ts            # Responsive window dimensions
  /useReducedMotion.ts         # Detect motion preferences

/lib
  /animation-config.ts         # Animation constants and variants
  /utils.ts                    # Utility functions

/types
  /animation.types.ts          # TypeScript animation types
```

## Components and Interfaces

### Core Animation Components

#### 1. ScrollReveal Component

**Purpose**: Wraps content to reveal it when scrolling into view.

**Interface**:
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
}
```

**Behavior**:
- Uses Framer Motion's `motion.div` with `whileInView` prop
- Animates from offset position (100px) with opacity 0
- Configurable direction, delay, and duration
- Viewport threshold and margin customizable
- Supports one-time or repeated animations

#### 2. ParallaxWrapper Component

**Purpose**: Creates parallax scrolling effects with configurable speed.

**Interface**:
```typescript
interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // 0.5 = slower, 1.5 = faster
  direction?: 'vertical' | 'horizontal';
  className?: string;
}
```

**Behavior**:
- Uses `useScroll` and `useTransform` from Framer Motion
- Calculates transform based on scroll progress and speed multiplier
- Applies `will-change: transform` for performance
- Supports both vertical and horizontal parallax

#### 3. MagneticButton Component

**Purpose**: Creates magnetic hover effect where button follows cursor.

**Interface**:
```typescript
interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // Magnetic pull strength (0-1)
  className?: string;
  onClick?: () => void;
}
```

**Behavior**:
- Tracks mouse position relative to button center
- Applies spring physics for smooth movement
- Calculates distance and applies proportional offset
- Resets to center when mouse leaves
- Uses `useSpring` for natural motion

#### 4. SplitText Component

**Purpose**: Animates text word-by-word or character-by-character.

**Interface**:
```typescript
interface SplitTextProps {
  text: string;
  splitBy?: 'word' | 'character';
  staggerDelay?: number;
  className?: string;
}
```

**Behavior**:
- Splits text into individual elements
- Wraps each in motion.span with stagger animation
- Uses `variants` for parent-child animation coordination
- Preserves spacing and line breaks

#### 5. CountUp Component

**Purpose**: Animates numbers from 0 to target value when in view.

**Interface**:
```typescript
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}
```

**Behavior**:
- Uses `useInView` to trigger animation
- Animates using `useSpring` with `MotionValue`
- Formats number with specified decimals
- Supports prefix/suffix (e.g., "$", "%")

#### 6. ProgressIndicator Component

**Purpose**: Shows scroll progress as line or circle.

**Interface**:
```typescript
interface ProgressIndicatorProps {
  type?: 'line' | 'circle';
  position?: 'top' | 'bottom' | 'fixed';
  color?: string;
  thickness?: number;
}
```

**Behavior**:
- Uses `useScrollProgress` hook
- For line: animates `scaleX` from 0 to 1
- For circle: animates `stroke-dashoffset`
- Fixed positioning option for persistent indicator

### Custom Hooks

#### 1. useScrollProgress Hook

**Purpose**: Returns normalized scroll progress (0-1) for current page.

**Interface**:
```typescript
function useScrollProgress(): MotionValue<number>
```

**Implementation**:
- Uses Framer Motion's `useScroll` with `scrollYProgress`
- Returns MotionValue that updates on scroll
- Can be used with `useTransform` for derived values

#### 2. useInView Hook

**Purpose**: Detects when element enters viewport with options.

**Interface**:
```typescript
interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

function useInView(options?: UseInViewOptions): [React.RefObject<HTMLElement>, boolean]
```

**Implementation**:
- Wraps Framer Motion's `useInView`
- Returns ref and boolean inView state
- Configurable threshold and margin
- Optional one-time trigger

#### 3. useMousePosition Hook

**Purpose**: Tracks global mouse position.

**Interface**:
```typescript
interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition
```

**Implementation**:
- Adds global `mousemove` event listener
- Updates state with current coordinates
- Cleans up listener on unmount
- Throttled for performance

#### 4. useWindowSize Hook

**Purpose**: Provides current window dimensions with resize handling.

**Interface**:
```typescript
interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

function useWindowSize(): WindowSize
```

**Implementation**:
- Listens to window resize events
- Debounced updates (150ms)
- Calculates device type based on breakpoints
- Returns undefined during SSR

#### 5. useReducedMotion Hook

**Purpose**: Detects user's motion preference.

**Interface**:
```typescript
function useReducedMotion(): boolean
```

**Implementation**:
- Checks `prefers-reduced-motion` media query
- Returns true if user prefers reduced motion
- Updates on preference change
- Used to conditionally disable animations

### Page Components

#### Home Page Structure

```typescript
// app/page.tsx
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Portfolio />
      <ContactCTA />
    </>
  )
}
```

#### Layout with Providers

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Navigation />
          <PageTransition>
            {children}
          </PageTransition>
          <ScrollProgress />
        </SmoothScroll>
      </body>
    </html>
  )
}
```

## Data Models

### Animation Configuration

```typescript
// lib/animation-config.ts

export const EASING = {
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  spring: [0.37, 1.61, 0.58, 0.89],
} as const;

export const DURATION = {
  instant: 0.1,
  fast: 0.25,
  normal: 0.5,
  slow: 1.0,
  slower: 2.0,
} as const;

export const ANIMATION_VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  hero: {
    initial: { opacity: 0, scale: 0.8, rotateX: -15 },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: DURATION.slow,
        ease: EASING.easeOutExpo,
      },
    },
  },
} as const;

export const STAGGER_CONFIG = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;
```

### TypeScript Types

```typescript
// types/animation.types.ts

export type EasingFunction = number[];

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export type AnimationDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

export interface AnimationVariant {
  initial: Record<string, number | string>;
  animate: Record<string, number | string | { transition?: any }>;
  exit?: Record<string, number | string>;
}

export interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  amount?: 'some' | 'all' | number;
}

export interface ParallaxConfig {
  speed: number;
  direction: 'vertical' | 'horizontal';
}

export interface MagneticConfig {
  strength: number;
  springConfig: {
    stiffness: number;
    damping: number;
  };
}
```

### Hero Section Data Model

```typescript
// types/hero.types.ts

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary?: {
      text: string;
      href: string;
    };
  };
  backgroundVideo?: string;
  gradientOrbs?: {
    count: number;
    colors: string[];
  };
}
```

### Navigation Data Model

```typescript
// types/navigation.types.ts

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationState {
  isOpen: boolean;
  activeSection: string;
}
```


### Scroll-Controlled Expandable Cards Section

#### ScrollExpandableCards Component

**Purpose**: Creates an immersive scroll-controlled section where vertical scrolling is hijacked to expand/collapse cards sequentially, with synchronized image display.

**Interface**:
```typescript
interface CardData {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface ScrollExpandableCardsProps {
  cards: CardData[];
  className?: string;
}
```

**Behavior**:
- Detects when section enters viewport using Intersection Observer
- Captures scroll events and prevents default page scrolling
- Tracks scroll delta to determine expansion/collapse direction
- Maintains internal state for current active card index
- Releases scroll control when reaching boundaries (first/last card)
- Animates card height and opacity transitions (400ms)
- Updates right-side image content based on active card

**Implementation Strategy**:
```typescript
// Core state management
const [activeIndex, setActiveIndex] = useState(0);
const [isScrollLocked, setIsScrollLocked] = useState(false);
const sectionRef = useRef<HTMLDivElement>(null);
const scrollAccumulator = useRef(0);

// Scroll threshold for card transitions
const SCROLL_THRESHOLD = 100; // pixels of scroll to trigger transition

// Lock scroll when section is in view
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsScrollLocked(true);
        document.body.style.overflow = 'hidden';
      }
    },
    { threshold: 0.5 }
  );
  
  if (sectionRef.current) {
    observer.observe(sectionRef.current);
  }
  
  return () => observer.disconnect();
}, []);

// Handle scroll events
useEffect(() => {
  if (!isScrollLocked) return;
  
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    scrollAccumulator.current += e.deltaY;
    
    // Scroll down - expand next card
    if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
      if (activeIndex < cards.length - 1) {
        setActiveIndex(prev => prev + 1);
        scrollAccumulator.current = 0;
      } else {
        // Release scroll at last card
        releaseScroll();
      }
    }
    
    // Scroll up - collapse current card
    if (scrollAccumulator.current <= -SCROLL_THRESHOLD) {
      if (activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        scrollAccumulator.current = 0;
      } else {
        // Release scroll at first card
        releaseScroll();
      }
    }
  };
  
  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, [isScrollLocked, activeIndex, cards.length]);

// Release scroll control
const releaseScroll = () => {
  setIsScrollLocked(false);
  document.body.style.overflow = '';
  scrollAccumulator.current = 0;
};
```

**Layout Structure**:
```typescript
<section ref={sectionRef} className="min-h-screen flex items-center">
  <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Left: Expandable Cards */}
    <div className="space-y-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          animate={{
            height: index === activeIndex ? 'auto' : '80px',
            opacity: index === activeIndex ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="border rounded-lg overflow-hidden"
        >
          <h3 className="text-2xl font-bold p-4">{card.title}</h3>
          <AnimatePresence>
            {index === activeIndex && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 pt-0"
              >
                <p>{card.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
    
    {/* Right: Image Content */}
    <div className="sticky top-1/2 -translate-y-1/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={cards[activeIndex].image}
            alt={cards[activeIndex].imageAlt}
            className="w-full h-auto rounded-lg"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</section>
```

**Responsive Behavior**:
- On mobile (< 768px): Stack cards and images vertically
- Disable scroll hijacking on mobile for better UX
- Use simpler tap-to-expand interaction on touch devices
- Maintain smooth transitions across all breakpoints

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Animation frame rate consistency

*For any* animation executing in the Landing Page System, the frame rate should maintain 60 frames per second or higher across all device types and viewport sizes.

**Validates: Requirements 1.2, 6.4, 11.2**

### Property 2: Reduced motion compliance

*For any* animation in the Landing Page System, when the prefers-reduced-motion setting is detected, the system should either disable the animation or replace it with a simple fade transition while maintaining full functionality.

**Validates: Requirements 1.3, 10.1, 10.2, 10.3, 10.4**

### Property 3: Hero animation initialization

*For any* hero section element, when the section loads, the element should animate from initial state (scale 0.8, opacity 0, rotateX -15) to final state (scale 1, opacity 1, rotateX 0) over 1.2 seconds.

**Validates: Requirements 2.2**

### Property 4: Parallax speed multiplier accuracy

*For any* parallax layer with a designated speed multiplier, the layer's transform offset should equal the scroll distance multiplied by the speed multiplier at any scroll position.

**Validates: Requirements 2.3, 3.6**

### Property 5: Mouse-following gradient orbs

*For any* gradient orb in the hero section, when the mouse moves within the section, the orb position should update to move toward the cursor coordinates.

**Validates: Requirements 2.4**

### Property 6: Fade-up animation consistency

*For any* element with fade-up animation, when the element enters the viewport, it should animate from 100 pixels below with opacity 0 to its final position with opacity 1 over 0.8 seconds.

**Validates: Requirements 3.1**

### Property 7: Stagger animation timing

*For any* container with stagger animation, each child element should begin its animation 0.1 seconds after the previous child element.

**Validates: Requirements 3.2, 8.1, 8.2**

### Property 8: Scroll-linked scale animation

*For any* element with scale animation, the element's scale value should interpolate from 0.5 to 1.0 proportionally to the scroll progress through its viewport intersection.

**Validates: Requirements 3.4**

### Property 9: 3D rotation reveal timing

*For any* card with rotation reveal animation, when the card enters the viewport, it should complete a 3D flip transformation over 0.8 seconds.

**Validates: Requirements 3.5**

### Property 10: SVG path morph progression

*For any* SVG shape with morph animation, the path data should transform progressively based on scroll progress through the element's viewport intersection.

**Validates: Requirements 3.7**

### Property 11: Magnetic button attraction

*For any* magnetic button, when the cursor hovers within the button's bounds, the button should apply spring physics to translate toward the cursor position proportional to the distance from center.

**Validates: Requirements 4.1**

### Property 12: Interactive element hover response

*For any* interactive element, when hovered, the element should apply scale and rotation transformations that complete within 250 milliseconds.

**Validates: Requirements 4.2**

### Property 13: Form field focus animation

*For any* form field, when focused, the field border and label should animate with smooth transitions.

**Validates: Requirements 4.3**

### Property 14: Form submission feedback

*For any* form submission, the system should display a toast notification with spring physics animation.

**Validates: Requirements 4.4**

### Property 15: Cursor follower tracking

*For any* mouse movement, the custom cursor follower element should update its position to track the cursor coordinates with blur effect applied.

**Validates: Requirements 4.5**

### Property 16: Button liquid morphing

*For any* button interaction, the button shape should apply a liquid morphing effect.

**Validates: Requirements 4.6**

### Property 17: Page transition sequence

*For any* page navigation, the current page should animate exit (opacity 0, y -20px), wait for completion, then the new page should animate entrance (from opacity 0, y 20px to final state).

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 18: Skeleton screen display during loading

*For any* heavy animation component being dynamically imported, a skeleton screen should display until the component loads.

**Validates: Requirements 5.4**

### Property 19: Responsive animation adaptation

*For any* animation, when the viewport width changes, the system should recalculate and apply animation parameters appropriate for the new viewport size.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 20: Touch interaction feedback

*For any* touch interaction on mobile devices, the system should provide haptic-style feedback through animations.

**Validates: Requirements 6.5**

### Property 21: Counter animation from zero

*For any* number counter element, when it enters the viewport, the displayed number should animate from 0 to the target value over 1 second with appropriate formatting.

**Validates: Requirements 7.1, 7.4**

### Property 22: Progress indicator scroll synchronization

*For any* progress indicator, the fill percentage should update from 0 to 100 percent in direct proportion to scroll progress.

**Validates: Requirements 7.2, 8.4**

### Property 23: Circular progress stroke animation

*For any* circular progress indicator, the stroke-dashoffset property should update smoothly to reflect the progress percentage.

**Validates: Requirements 7.3**

### Property 24: Navigation menu opacity and position

*For any* navigation menu animation, menu items should transition with smooth opacity and position changes.

**Validates: Requirements 8.3**

### Property 25: Animation error boundary handling

*For any* animation that throws an error, the error boundary should catch the error and gracefully degrade the experience without breaking functionality.

**Validates: Requirements 9.5**

### Property 26: Smooth scroll interpolation

*For any* scroll event on any page, the Lenis library should apply smooth scroll interpolation to the scroll position.

**Validates: Requirements 11.1**

### Property 27: Anchor link smooth scrolling

*For any* anchor link click, the system should animate the scroll transition smoothly to the target section.

**Validates: Requirements 11.3**

### Property 28: Word-by-word text reveal

*For any* text element in the hero section with split text animation, each word should reveal sequentially over the 1.2 second duration.

**Validates: Requirements 2.1**

### Property 29: Scroll lock activation on section entry

*For any* scroll-controlled expandable card section, when the section enters the viewport with at least 50% visibility, the system should freeze vertical page scrolling and capture scroll events.

**Validates: Requirements 13.1**

### Property 30: Sequential card expansion on scroll down

*For any* scroll down action within the scroll-controlled section where the active card is not the last card, the system should increment the active card index and expand the next card revealing its description content.

**Validates: Requirements 13.2**

### Property 31: Sequential card collapse on scroll up

*For any* scroll up action within the scroll-controlled section where the active card is not the first card, the system should decrement the active card index and collapse the current card revealing the previous card.

**Validates: Requirements 13.3**

### Property 32: Image synchronization with active card

*For any* card that becomes active in the scroll-controlled section, the corresponding image content should display on the right side of the layout.

**Validates: Requirements 13.4**

### Property 33: Two-column layout structure

*For any* scroll-controlled expandable card section rendering on desktop viewport, the expandable cards should be positioned on the left and image content on the right with appropriate responsive behavior.

**Validates: Requirements 13.7**

### Property 34: Card transition animation timing

*For any* card transitioning between collapsed and expanded states, the height and opacity changes should animate smoothly over 400 milliseconds.

**Validates: Requirements 13.8**

## Error Handling

### Animation Errors

**Error Boundary Implementation**:
- Wrap all animation-heavy components in React Error Boundaries
- Catch animation-related errors (Framer Motion, Lenis, etc.)
- Fallback to static content when animations fail
- Log errors to monitoring service (e.g., Sentry)

**Graceful Degradation**:
```typescript
// Example error boundary for animations
class AnimationErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    // Log error
    console.error('Animation error:', error);
    // Fallback to static content
    this.setState({ hasError: true });
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.props.children;
    }
    return this.props.children;
  }
}
```

### Performance Degradation

**Frame Rate Monitoring**:
- Monitor frame rate during animations
- If FPS drops below 30, automatically reduce animation complexity
- Disable parallax and complex effects on low-performance devices
- Use `requestAnimationFrame` for performance-critical animations

**Resource Loading Errors**:
- Handle failed dynamic imports with retry logic
- Show skeleton screens during loading
- Timeout after 10 seconds and show static content
- Provide manual retry option for users

### Browser Compatibility

**Feature Detection**:
- Check for Intersection Observer support
- Fallback to scroll event listeners if unavailable
- Detect CSS transform support
- Provide static alternatives for unsupported features

**Polyfills**:
- Include Intersection Observer polyfill for older browsers
- Use CSS feature queries for transform support
- Provide fallback styles for unsupported CSS properties

### User Preference Handling

**Reduced Motion**:
- Detect `prefers-reduced-motion` media query
- Disable all scroll-triggered animations
- Replace complex animations with simple fades
- Maintain full functionality without motion

**Data Saver Mode**:
- Detect `prefers-reduced-data` if available
- Skip video backgrounds
- Reduce image quality
- Disable non-essential animations

## Testing Strategy

### Unit Testing

**Component Testing**:
- Test each animation component in isolation
- Verify props are correctly applied
- Test edge cases (empty content, missing props)
- Verify accessibility attributes

**Hook Testing**:
- Test custom hooks with React Testing Library
- Verify state updates correctly
- Test cleanup functions
- Verify event listener management

**Example Unit Tests**:
```typescript
// Test ScrollReveal component
describe('ScrollReveal', () => {
  it('should render children', () => {
    render(<ScrollReveal><div>Test</div></ScrollReveal>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('should apply correct initial animation state', () => {
    const { container } = render(
      <ScrollReveal direction="up">
        <div>Test</div>
      </ScrollReveal>
    );
    // Verify initial transform and opacity
  });
});

// Test useScrollProgress hook
describe('useScrollProgress', () => {
  it('should return MotionValue', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBeInstanceOf(MotionValue);
  });
});
```

### Property-Based Testing

**Testing Framework**: We will use **fast-check** for property-based testing in TypeScript/JavaScript.

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `**Feature: premium-landing-page, Property {number}: {property_text}**`

**Property Test Examples**:

```typescript
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 1: Animation frame rate consistency
 */
describe('Property 1: Animation frame rate consistency', () => {
  it('should maintain 60fps for any animation', () => {
    fc.assert(
      fc.property(
        fc.record({
          duration: fc.double({ min: 0.1, max: 5 }),
          complexity: fc.integer({ min: 1, max: 10 }),
        }),
        (animationConfig) => {
          const fps = measureAnimationFPS(animationConfig);
          return fps >= 60;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 4: Parallax speed multiplier accuracy
 */
describe('Property 4: Parallax speed multiplier accuracy', () => {
  it('should calculate correct offset for any speed and scroll position', () => {
    fc.assert(
      fc.property(
        fc.record({
          speed: fc.double({ min: 0.1, max: 2.0 }),
          scrollDistance: fc.integer({ min: 0, max: 10000 }),
        }),
        ({ speed, scrollDistance }) => {
          const offset = calculateParallaxOffset(speed, scrollDistance);
          const expected = scrollDistance * speed;
          return Math.abs(offset - expected) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 7: Stagger animation timing
 */
describe('Property 7: Stagger animation timing', () => {
  it('should delay each child by 0.1s for any number of children', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 2, maxLength: 20 }),
        (children) => {
          const delays = calculateStaggerDelays(children);
          for (let i = 1; i < delays.length; i++) {
            const diff = delays[i] - delays[i - 1];
            if (Math.abs(diff - 0.1) > 0.001) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 11: Magnetic button attraction
 */
describe('Property 11: Magnetic button attraction', () => {
  it('should move button toward cursor for any cursor position', () => {
    fc.assert(
      fc.property(
        fc.record({
          buttonCenter: fc.record({
            x: fc.integer({ min: 0, max: 1920 }),
            y: fc.integer({ min: 0, max: 1080 }),
          }),
          cursorPos: fc.record({
            x: fc.integer({ min: 0, max: 1920 }),
            y: fc.integer({ min: 0, max: 1080 }),
          }),
          strength: fc.double({ min: 0.1, max: 1.0 }),
        }),
        ({ buttonCenter, cursorPos, strength }) => {
          const offset = calculateMagneticOffset(buttonCenter, cursorPos, strength);
          const dx = cursorPos.x - buttonCenter.x;
          const dy = cursorPos.y - buttonCenter.y;
          
          // Offset should be in direction of cursor
          const dotProduct = offset.x * dx + offset.y * dy;
          return dotProduct >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 19: Responsive animation adaptation
 */
describe('Property 19: Responsive animation adaptation', () => {
  it('should apply appropriate animation params for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          const params = getAnimationParams(viewportWidth);
          
          if (viewportWidth < 768) {
            // Mobile should have reduced values
            return params.distance < 100 && params.scale < 1.2;
          } else {
            // Desktop should have full values
            return params.distance === 100 && params.scale === 1.2;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 21: Counter animation from zero
 */
describe('Property 21: Counter animation from zero', () => {
  it('should animate from 0 to target for any target value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000000 }),
        (targetValue) => {
          const frames = simulateCounterAnimation(targetValue, 1000);
          
          // First frame should be 0
          if (frames[0] !== 0) return false;
          
          // Last frame should be target
          if (frames[frames.length - 1] !== targetValue) return false;
          
          // Values should be monotonically increasing
          for (let i = 1; i < frames.length; i++) {
            if (frames[i] < frames[i - 1]) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Smart Generators**:
- Create custom generators for animation configurations
- Constrain input space to valid animation parameters
- Generate realistic viewport sizes and scroll positions
- Create representative DOM structures for testing

### Integration Testing

**Page-Level Testing**:
- Test complete page flows with animations
- Verify scroll-triggered animations activate correctly
- Test page transitions between routes
- Verify navigation menu interactions

**Cross-Component Testing**:
- Test interactions between animation components
- Verify smooth scroll works with scroll-triggered animations
- Test parallax layers work together correctly
- Verify error boundaries catch component errors

### Performance Testing

**Lighthouse CI**:
- Run Lighthouse in CI pipeline
- Fail build if Performance score < 95
- Monitor FCP, TTI, and CLS metrics
- Track performance over time

**Frame Rate Monitoring**:
- Use Chrome DevTools Performance API
- Measure FPS during animation sequences
- Test on various device profiles
- Identify performance bottlenecks

**Load Testing**:
- Test with slow network conditions
- Verify skeleton screens appear
- Test dynamic import fallbacks
- Measure time to interactive

### Accessibility Testing

**Automated Testing**:
- Run axe-core in test suite
- Verify ARIA attributes
- Test keyboard navigation
- Check color contrast ratios

**Manual Testing**:
- Test with screen readers
- Verify reduced motion preference
- Test keyboard-only navigation
- Verify focus management

### Visual Regression Testing

**Screenshot Comparison**:
- Use Playwright or Chromatic
- Capture screenshots at key animation states
- Compare against baseline images
- Flag visual changes for review

## Implementation Notes

### Performance Optimization

**Code Splitting**:
- Use Next.js dynamic imports for heavy components
- Lazy load animation components below the fold
- Split vendor bundles (Framer Motion, Lenis)
- Implement route-based code splitting

**Animation Optimization**:
- Use `will-change` CSS property sparingly
- Prefer `transform` and `opacity` for animations
- Use `useReducedMotion` to skip animations
- Implement virtual scrolling for long lists

**Image Optimization**:
- Use Next.js Image component
- Implement lazy loading for images
- Use WebP format with fallbacks
- Optimize hero images for LCP

### Browser Support

**Target Browsers**:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**Progressive Enhancement**:
- Core content accessible without JavaScript
- Animations enhance but aren't required
- Fallback styles for unsupported features
- Polyfills for older browsers

### Deployment Considerations

**Build Optimization**:
- Enable Next.js production optimizations
- Minify CSS and JavaScript
- Optimize fonts with next/font
- Generate static pages at build time

**CDN Configuration**:
- Cache static assets aggressively
- Use edge caching for pages
- Implement proper cache headers
- Use image CDN for media assets

**Monitoring**:
- Set up error tracking (Sentry)
- Monitor Core Web Vitals
- Track animation performance
- Set up uptime monitoring
