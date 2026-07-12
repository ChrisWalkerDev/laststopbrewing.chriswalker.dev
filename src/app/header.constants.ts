import { HeaderNavLink } from './header-nav-link.model';

export const MOBILE_BREAKPOINT_PX = 768;
export const DESKTOP_MIN_WIDTH = MOBILE_BREAKPOINT_PX + 1;

export const HEADER_TOGGLE_ID = 'app-mobile-menu-toggle';
export const HEADER_OVERLAY_ID = 'app-mobile-menu-overlay';

export const EXCLUDED_HEADER_ROUTES = ['/age-gate', '/access-denied'] as const;

export const PRIMARY_HEADER_LINKS: HeaderNavLink[] = [
  {
    label: 'Home',
    route: '/',
    exact: true,
  },
  {
    label: 'Food',
    route: '/food',
    exact: true,
  },
  {
    label: 'Beer',
    route: '/beer',
    exact: true,
  },
  {
    label: 'Location',
    route: '/location',
    exact: true,
  },
  {
    label: 'About',
    route: '/about',
    exact: true,
  },
];
