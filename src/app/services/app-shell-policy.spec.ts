import { type Route } from '@angular/router';
import { getOverlayFocusableElements, isHeaderVisible, normalizeAppPath } from './app-shell-policy';

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

  it('should return focusable elements from the overlay container', () => {
    const document = window.document;
    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu';
    overlay.innerHTML =
      '<a href="#home">Home</a><button type="button">Open</button><button disabled>Disabled</button><div style="display:none" tabindex="0"></div><div aria-hidden="true" tabindex="0"></div><div tabindex="-1"></div>';
    document.body.appendChild(overlay);

    const focusable = getOverlayFocusableElements(document, 'mobile-menu');

    expect(focusable.map((element) => element.tagName.toLowerCase())).toEqual(['a', 'button']);

    overlay.remove();
  });
});
