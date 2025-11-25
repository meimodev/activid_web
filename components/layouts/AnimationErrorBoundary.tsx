'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface AnimationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * AnimationErrorBoundary catches animation-related errors and provides graceful degradation.
 * Features:
 * - Catches errors from animation components
 * - Fallback to static content when animations fail
 * - Logs errors for monitoring
 * - Maintains full functionality without animations
 */
export default class AnimationErrorBoundary extends Component<
  AnimationErrorBoundaryProps,
  AnimationErrorBoundaryState
> {
  constructor(props: AnimationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AnimationErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for monitoring
    console.error('Animation error caught by boundary:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to an error tracking service like Sentry
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI - either custom fallback or children without animations
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback: render children in a static container
      return <div className="animation-error-fallback">{this.props.children}</div>;
    }

    return this.props.children;
  }
}
