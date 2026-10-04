import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber } from '../lib/utils';

describe('Utility Functions', () => {
  it('formatNumber formats numbers correctly', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(2500000)).toBe('2.5M');
    expect(formatNumber(undefined)).toBe('0');
  });

  it('formatDate returns relative time strings', () => {
    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    expect(formatDate(tenMinsAgo)).toBe('10m ago');

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatDate(twoHoursAgo)).toBe('2h ago');
  });
});
