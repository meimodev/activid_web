'use client';

import { motion } from 'framer-motion';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * Skeleton component for loading states.
 * Displays a placeholder with shimmer animation during content loading.
 * Used with dynamic imports for heavy animation components.
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <motion.div
      className={`bg-gray-200 ${variantStyles[variant]} ${className}`}
      style={style}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * Hero section skeleton for loading state
 */
export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <Skeleton width="80%" height={60} className="max-w-4xl" />
      <Skeleton width="60%" height={40} className="max-w-2xl" />
      <Skeleton width="40%" height={24} className="max-w-xl" />
      <div className="flex gap-4 mt-8">
        <Skeleton width={120} height={48} />
        <Skeleton width={120} height={48} />
      </div>
    </div>
  );
}

/**
 * Features section skeleton for loading state
 */
export function FeaturesSkeleton() {
  return (
    <div className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton width="40%" height={40} className="mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton width="80%" height={24} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="60%" height={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Card skeleton for loading state
 */
export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton width="100%" height={200} />
      <Skeleton width="80%" height={24} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="40%" height={16} />
    </div>
  );
}

/**
 * Grid skeleton for portfolio/work sections
 */
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Form skeleton for contact page
 */
export function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <Skeleton width="60%" height={32} className="mb-8" />
      <div className="space-y-4">
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={120} />
        <Skeleton width={150} height={48} className="mt-6" />
      </div>
    </div>
  );
}
