import { type Route } from '@angular/router';
import { isHeaderVisible, normalizeAppPath } from './app-shell-policy';

describe('app shell policy', () => {
  it('should normalize paths by stripping query strings and fragments', () => {
    expect(normalizeAppPath('/food?source=home#top')).toBe('/food');
    expect(normalizeAppPath('?source=home')).toBe('/');
  });

  it('should hide the header for routes that opt out', () => {
    const hiddenRoute: Route = { path: 'age-gate', data: { hideHeader: true } };
    const visibleRoute: Route = { path: 'food' };

    expect(isHeaderVisible('/age-gate', [hiddenRoute])).toBe(false);
    expect(isHeaderVisible('/food', [hiddenRoute, visibleRoute])).toBe(true);
  });
});
