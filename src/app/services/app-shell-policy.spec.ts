import { getOverlayFocusableElements, isHeaderVisible, normalizeAppPath } from './app-shell-policy';

describe('app shell policy', () => {
  it('should normalize paths by stripping query strings and fragments', () => {
    expect(normalizeAppPath('/food?source=home#top')).toBe('/food');
    expect(normalizeAppPath('?source=home')).toBe('/');
  });

  it('should hide the header for excluded routes', () => {
    expect(isHeaderVisible('/age-gate', ['/age-gate', '/access-denied'])).toBe(false);
    expect(isHeaderVisible('/food', ['/age-gate', '/access-denied'])).toBe(true);
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
