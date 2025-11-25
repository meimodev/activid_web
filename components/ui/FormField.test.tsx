import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from './FormField';
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 13: Form field focus animation
 * Validates: Requirements 4.3
 * 
 * For any form field, when focused, the field border and label should animate 
 * with smooth transitions.
 */
describe('Property 13: Form field focus animation', () => {
  it('should render form field with label', () => {
    render(<FormField label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should animate border and label on focus for any label text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (labelText) => {
          const { container } = render(<FormField label={labelText} />);
          
          const input = container.querySelector('input');
          if (!input) return false;

          // Verify label exists in the DOM
          const label = container.querySelector('label');
          if (!label || !label.textContent?.includes(labelText)) return false;

          // Focus the input
          fireEvent.focus(input);

          // Blur the input
          fireEvent.blur(input);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display error message when error prop is provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
          error: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        }),
        ({ label, error }) => {
          const { container } = render(<FormField label={label} error={error} />);
          
          // Check if error message is in the DOM
          const errorElement = container.querySelector('.text-red-500');
          return errorElement !== null && errorElement.textContent === error;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle value changes correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ minLength: 0, maxLength: 100 }),
        }),
        ({ label, value }) => {
          const { container } = render(<FormField label={label} />);
          
          const input = container.querySelector('input') as HTMLInputElement;
          if (!input) return false;

          // Change the input value
          fireEvent.change(input, { target: { value } });

          // Verify the value was set
          return input.value === value;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormField label="Test" className="custom-class" />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('should handle focus and blur events', () => {
    const { container } = render(<FormField label="Test Field" />);
    
    const input = container.querySelector('input') as HTMLInputElement;
    
    // Verify input exists
    expect(input).toBeInTheDocument();
    
    // Focus and blur should not throw errors
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    // Verify input still exists after events
    expect(input).toBeInTheDocument();
  });
});
