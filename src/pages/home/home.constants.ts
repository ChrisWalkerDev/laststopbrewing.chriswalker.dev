import { HomeApp } from './home.models';
import { HomeSocialLink } from './home.models';

export const HOME_PAGE_TITLE = 'Last Stop Brewing';

export const HOME_APPS: readonly HomeApp[] = [
  {
    id: 'beer',
    label: 'Beer',
    route: '/beer',
    icon: 'assets/icons/beer.png',
    alt: 'Beer Icon',
    iconType: 'image',
  },
  {
    id: 'food',
    label: 'Food',
    route: '/food',
    icon: 'assets/icons/food.png',
    alt: 'Food Icon',
    iconType: 'image',
  },
  {
    id: 'events',
    label: 'Events',
    route: '/events',
    icon: 'assets/icons/food.png',
    alt: 'Events Icon',
    iconType: 'image',
  },
  {
    id: 'location',
    label: 'Location',
    route: '/location',
    icon: 'assets/icons/location.png',
    alt: 'Location Icon',
    iconType: 'image',
  },
  {
    id: 'about',
    label: 'About',
    route: '/about',
    icon: 'assets/icons/food.png',
    alt: 'About Icon',
    iconType: 'image',
  },
  {
    id: 'contact',
    label: 'Contact',
    route: '/contact',
    icon: 'assets/icons/food.png',
    alt: 'Contact Icon',
    iconType: 'image',
  },
  {
    id: 'apply',
    label: 'Apply',
    route: '/apply',
    icon: 'assets/icons/food.png',
    alt: 'Apply Icon',
    iconType: 'image',
  }
];

export const HOME_SOCIAL_LINKS: readonly HomeSocialLink[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/LastStopBrewing',
    icon: 'assets/icons/Facebook_Logo_Primary.png',
    iconType: 'image',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/last_stop_brewing_co/',
    icon: 'assets/icons/Instagram_Glyph_Gradient.png',
    iconType: 'image',
  },
];
