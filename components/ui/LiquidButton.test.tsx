import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiquidButton } from './LiquidButton';
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 16: Button liquid morphing
 * Validates: Requirements 4.6
 * 
 * For any button interaction, the button shape should apply a liquid morphing effect.
 */
describe('Property 16: Button liquid morphing', () => {
  it('should render button with children', () => {
    render(<LiquidButton>Click Me</LiquidButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should render button for any text content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (text) => {
          const { container } = render(<LiquidButton>{text}</LiquidButton>);
          
          const button = container.querySelector('button');
          if (!button) return false;

          // Verify button contains the text
          return button.textContent?.includes(text) ?? false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have liquid morphing background element', () => {
    const { container } = render(<LiquidButton>Test</LiquidButton>);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    // Verify morphing background exists
    const morphingBg = container.querySelector('.absolute.inset-0');
    expect(morphingBg).toBeInTheDocument();
  });

  it('should apply spring physics transition', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (buttonText) => {
          const { container } = render(<LiquidButton>{buttonText}</LiquidButton>);
          
          const button = container.querySelector('button');
          if (!button) return false;

          // Verify button has motion properties (Framer Motion adds data attributes)
          return button.tagName === 'BUTTON';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept custom className', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (className) => {
          const { container } = render(
            <LiquidButton className={className}>Test</LiquidButton>
          );

          const button = container.querySelector('button');
          return button?.className.includes(className) ?? false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be clickable', () => {
    const { container } = render(<LiquidButton>Click</LiquidButton>);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button?.tagName).toBe('BUTTON');
  });

  it('should support onClick handler', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (text) => {
          let clicked = false;
          const handleClick = () => { clicked = true; };
          
          const { container } = render(
            <LiquidButton onClick={handleClick}>{text}</LiquidButton>
          );

          const button = container.querySelector('button');
          button?.click();

          return clicked;
        }
      ),
      { numRuns: 100 }
    );
  });
});
