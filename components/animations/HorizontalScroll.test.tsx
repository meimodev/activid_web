import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HorizontalScroll } from './HorizontalScroll';

describe('HorizontalScroll', () => {
  it('should render children', () => {
    const { container } = render(
      <HorizontalScroll>
        <div data-testid="content">Test Content</div>
      </HorizontalScroll>
    );
    
    expect(container.querySelector('[data-testid="content"]')).toBeInTheDocument();
  });

  it('should render multiple children in horizontal layout', () => {
    const { container } = render(
      <HorizontalScroll>
        <div data-testid="item1">Item 1</div>
        <div data-testid="item2">Item 2</div>
        <div data-testid="item3">Item 3</div>
      </HorizontalScroll>
    );
    
    expect(container.querySelector('[data-testid="item1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="item2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="item3"]')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <HorizontalScroll className="custom-class">
        <div>Test</div>
      </HorizontalScroll>
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('should handle empty children', () => {
    const { container } = render(
      <HorizontalScroll>
        {null}
      </HorizontalScroll>
    );
    
    expect(container.firstChild).toBeTruthy();
  });
});
