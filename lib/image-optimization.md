# Image Optimization Guide

This document outlines best practices for image optimization in the Premium Landing Page System.

## Requirements

- **Requirement 1.5**: Optimize hero images for LCP (Largest Contentful Paint)
- **Requirement 5.4**: Implement lazy loading for below-the-fold images

## Using OptimizedImage Component

### Hero Images (Above the Fold)

For images that appear in the hero section or above the fold, use `isHero={true}` to enable priority loading:

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  isHero={true}
  priority={true}
/>
```

This ensures:
- Image is preloaded for optimal LCP
- No lazy loading delay
- Priority in the loading queue

### Below-the-Fold Images

For images that appear below the fold, use default lazy loading:

```tsx
<OptimizedImage
  src="/feature-image.jpg"
  alt="Feature image"
  width={800}
  height={600}
  lazy={true}
/>
```

This ensures:
- Images load only when needed
- Reduced initial page weight
- Better performance metrics

## Image Formats

Next.js automatically optimizes images to modern formats (WebP, AVIF) when supported by the browser.

### Recommended Formats

1. **WebP**: Modern format with excellent compression
2. **AVIF**: Even better compression, but less browser support
3. **JPEG**: Fallback for older browsers
4. **PNG**: For images requiring transparency

## Image Sizing

### Responsive Images

Always provide appropriate sizes for different viewports:

```tsx
<OptimizedImage
  src="/responsive-image.jpg"
  alt="Responsive image"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Fixed Size Images

For images with fixed dimensions:

```tsx
<OptimizedImage
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
/>
```

## Performance Tips

1. **Use appropriate dimensions**: Don't load 4K images for thumbnail displays
2. **Enable blur placeholders**: Improves perceived performance
3. **Set quality appropriately**: 85 is a good balance between quality and file size
4. **Use priority sparingly**: Only for LCP images (typically 1-2 per page)
5. **Lazy load by default**: Only disable for above-the-fold content

## Lighthouse Optimization

To achieve 95+ Lighthouse Performance score:

1. Optimize hero images with `priority={true}`
2. Lazy load all other images
3. Use appropriate image dimensions
4. Enable modern image formats (WebP/AVIF)
5. Implement blur placeholders for better UX

## Example: Hero Section

```tsx
import { OptimizedImage } from '@/components/ui';

export function Hero() {
  return (
    <section className="hero">
      <OptimizedImage
        src="/hero-background.jpg"
        alt="Hero background"
        fill
        isHero={true}
        priority={true}
        quality={90}
        className="object-cover"
      />
      <div className="hero-content">
        {/* Hero content */}
      </div>
    </section>
  );
}
```

## Example: Portfolio Grid

```tsx
import { OptimizedImage } from '@/components/ui';

export function PortfolioGrid({ projects }) {
  return (
    <div className="grid">
      {projects.map((project) => (
        <OptimizedImage
          key={project.id}
          src={project.image}
          alt={project.title}
          width={600}
          height={400}
          lazy={true}
          quality={85}
        />
      ))}
    </div>
  );
}
```
