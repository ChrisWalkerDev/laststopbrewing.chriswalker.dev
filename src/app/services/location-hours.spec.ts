import { getHoursSummary } from './location-hours';

describe('getHoursSummary', () => {
  afterEach(() => vi.useRealTimers());

  // 2026-10-12 is a Monday (12:00–23:00); UTC-4 in October.
  const at = (iso: string) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(iso));
  };

  it('shows opening and closing lines while open', () => {
    at('2026-10-12T18:00:00Z'); // 2:00 PM
    expect(getHoursSummary()).toEqual(['Open since 12 PM', 'Closes 11 PM']);
  });

  it('keeps both lines when closing soon', () => {
    at('2026-10-13T02:30:00Z'); // 10:30 PM
    expect(getHoursSummary()).toEqual(['Open since 12 PM', 'Closes 11 PM']);
  });

  it('reports today\'s opening time before opening', () => {
    at('2026-10-12T13:00:00Z'); // 9:00 AM
    expect(getHoursSummary()).toEqual(['Opens 12 PM', 'Closes 11 PM']);
  });

  it('reports tomorrow\'s opening time after closing', () => {
    at('2026-10-13T03:30:00Z'); // 11:30 PM Monday
    expect(getHoursSummary()).toEqual(['Opens tomorrow 12 PM', 'Closes 11 PM']);
  });
});
