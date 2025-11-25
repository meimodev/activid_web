
## **Project Overview**
Create a premium multi-page landing page website using Next.js 14+ and Framer Motion, inspired by framer.com's sophisticated animation design. The website should prioritize beautiful, sleek, and complex scroll-triggered animations as its primary visual feature.

## **Core Technical Requirements**

### Tech Stack:
- **Framework:** Next.js 14+ (App Router)
- **Animation:** Framer Motion (latest version)
- **Styling:** Tailwind CSS + CSS Modules for custom animations
- **TypeScript:** Fully typed components
- **Performance:** Static Site Generation (SSG) for landing pages
- **Hosting:** Optimized for Vercel deployment

### Dependencies to install:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0",
    "@react-three/fiber": "^8.15.0" (optional for 3D),
    "lenis": "^1.0.0" (smooth scrolling),
    "clsx": "^2.0.0"
  }
}
```

## **Page Structure**

### Required Pages:
1. **Home** (`/`) - Hero with immersive animations
2. **About** (`/about`) - Team/company showcase with stagger reveals
3. **Services** (`/services`) - Interactive service cards
4. **Work/Portfolio** (`/work`) - Case studies with parallax
5. **Contact** (`/contact`) - Animated form with micro-interactions

## **Animation Specifications**

### **1. Hero Section Animations**
```jsx
// Example implementation structure
const HeroAnimation = {
  initial: { opacity: 0, scale: 0.8, rotateX: -15 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: {
      duration: 1.2,
      ease: [0.6, 0.01, 0.05, 0.95]
    }
  }
}
```

**Requirements:**
- Layered text animations with word-by-word reveal
- Floating 3D elements or glassmorphism cards
- Mouse-follow gradient orbs
- Smooth parallax on scroll (30% offset)
- Video/WebGL background option

### **2. Scroll-Triggered Animations**

**Text Reveals:**
```jsx
// Implement split-text animations
<motion.h2
  initial={{ y: 100, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{
    duration: 0.8,
    ease: [0.65, 0, 0.35, 1]
  }}
>
```

**Required scroll animations:**
- **Fade-up reveals:** Start 100px below, fade in over 0.8s
- **Horizontal scroll sections:** Pin section, translate X on scroll
- **Scale transforms:** Scale from 0.5 to 1 based on scroll progress
- **Rotation reveals:** 3D flip cards on scroll
- **Stagger children:** 0.1s delay between elements
- **Parallax layers:** Multiple speed layers (0.5x, 1x, 1.5x)
- **Morphing shapes:** SVG path animations on scroll
- **Number counters:** Animate from 0 when in view
- **Progress indicators:** Line/circle fill based on scroll

### **3. Complex Animation Patterns**

**A. Magnetic Buttons:**
```jsx
// Track mouse position and apply magnetic effect
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
// Apply spring physics to button position
```

**B. Smooth Page Transitions:**
```jsx
// Implement exit animations before route change
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
```

**C. Intersection Observer Sequences:**
- Chain animations based on scroll position
- Scrub animations tied to scroll progress
- Pin sections during animation sequences

### **4. Micro-interactions**

**Required interactions:**
- Hover effects with scale and rotation
- Cursor follower with blur effect
- Button liquid morphing
- Menu reveal with stagger
- Form field focus animations
- Loading states with skeleton screens
- Toast notifications with spring physics

## **Performance Requirements**

### Optimization Targets:
- **Lighthouse Score:** 95+ Performance
- **First Contentful Paint:** < 1.2s
- **Time to Interactive:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Implementation Guidelines:
```jsx
// Use dynamic imports for heavy animations
const Heavy3DScene = dynamic(() => import('./Heavy3DScene'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Implement will-change for animated elements
style={{ willChange: 'transform' }}

// Use useReducedMotion hook
const prefersReducedMotion = useReducedMotion();
```

## **Component Architecture**

### Required Custom Hooks:
```jsx
// 1. Scroll Progress Hook
useScrollProgress() // Returns 0-1 based on page scroll

// 2. In View Hook with options
useInView({ threshold: 0.5, rootMargin: "-100px" })

// 3. Mouse Position Hook
useMousePosition() // Global mouse tracking

// 4. Window Size Hook
useWindowSize() // Responsive animations
```

### Animation Components Structure:
```
/components
  /animations
    - ScrollReveal.tsx
    - ParallaxWrapper.tsx
    - MagneticButton.tsx
    - SplitText.tsx
    - CountUp.tsx
    - ProgressIndicator.tsx
  /sections
    - Hero.tsx
    - Features.tsx
    - Testimonials.tsx
```

## **Responsive Behavior**

### Breakpoint-specific animations:
```jsx
const variants = {
  desktop: { scale: 1.2, x: 100 },
  mobile: { scale: 1.1, x: 50 }
}

// Detect and apply device-appropriate animations
const isMobile = useMediaQuery('(max-width: 768px)');
```

## **Advanced Features (Choose 2-3)**

1. **WebGL Integration**
   - Three.js background scenes
   - Shader animations
   - Particle effects

2. **Sound Design**
   - Subtle click sounds
   - Scroll-triggered audio
   - Background ambiance

3. **AI-Powered Personalization**
   - Dynamic content based on user behavior
   - Adaptive animation speed

4. **Real-time Features**
   - Live cursor tracking from other users
   - Collaborative interactions

## **Design System Requirements**

### Animation Timing Functions:
```css
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
--spring: cubic-bezier(0.37, 1.61, 0.58, 0.89);
```

### Animation Durations:
```css
--duration-instant: 100ms;
--duration-fast: 250ms;
--duration-normal: 500ms;
--duration-slow: 1000ms;
--duration-slower: 2000ms;
```

## **Deliverables Checklist**

- [ ] Fully responsive across all devices
- [ ] Smooth 60fps animations
- [ ] Accessibility features (prefers-reduced-motion)
- [ ] SEO optimized with meta tags
- [ ] Loading animations and skeletons
- [ ] Error boundaries for animation failures
- [ ] Documentation for animation system
- [ ] Storybook for component showcase (optional)

## **Example Code Structure to Start:**

```jsx
// app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { ScrollProgress } from '@/components/animations/ScrollProgress'
import { SmoothScroll } from '@/components/layouts/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Hero />
      {/* Other sections */}
    </SmoothScroll>
  )
}
```

## **Inspiration References**
- framer.com - Smooth scroll and reveals
- linear.app - Gradient animations
- vercel.com - Technical animations
- stripe.com - Micro-interactions
- github.com/copilot - Code window animations

---

**Note:** Focus on creating a memorable visual experience while maintaining performance. Every animation should serve a purpose - either to guide attention, provide feedback, or enhance storytelling. Avoid animation for animation's sake.