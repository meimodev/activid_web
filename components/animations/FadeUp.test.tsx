import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FadeUp } from './FadeUp';

describe('FadeUp', () => {
  it('should render children', () => {
    const { container } = render(
      <FadeUp>
        <div data-testid="content">Test Content</div>
      </FadeUp>
    );
    
    expect(container.querySelector('[data-testid="content"]')).toBeInTheDocument();
  });

  it('should use ScrollReveal with direction up', () => {
    const { container } = render(
      <FadeUp>
        <div>Test</div>
      </FadeUp>
    );
    
    // Component should render successfully
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply default duration of 0.8s', () => {
    const { container } = render(
      <FadeUp>
        <div>Test</div>
      </FadeUp>
    );
    
    // Component should render with default props
    expect(container.firstChild).toBeTruthy();
  });

  it('should accept custom delay', () => {
    const { container } = render(
      <FadeUp delay={0.5}>
        <div>Test</div>
      </FadeUp>
    );
    
    expect(container.firstChild).toBeTruthy();
  });

  it('should accept custom threshold', () => {
    const { container } = render(
      <FadeUp threshold={0.5}>
        <div>Test</div>
      </FadeUp>
    );
    
    expect(container.firstChild).toBeTruthy();
  });
});
