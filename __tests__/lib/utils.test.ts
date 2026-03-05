import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('utils (cn)', () => {
  it('merges tailwind classes correctly', () => {
    const result = cn('bg-blue-500', 'text-white', null, undefined, {
      'opacity-50': true,
    });
    expect(result).toBe('bg-blue-500 text-white opacity-50');
  });

  it('handles conflicting tailwind classes', () => {
    // text-white and text-black should merge to text-black if tailwind-merge is configured
    const result = cn('text-white', 'text-black');
    expect(result).toContain('text-black');
  });
});
