import { StoreHoursEntry } from './location.models';

export const LOCATION_PAGE_TITLE = 'Location';
export const LOCATION_MAP_EMBED_TITLE = 'Map of 525 Main Street, Shelbyville, Kentucky 40065';
export const LOCATION_MAP_EMBED_SRC =
  'https://www.google.com/maps?q=Last+Stop+Brewing,+525+Main+Street,+Shelbyville,+Kentucky+40065&output=embed';
export const LOCATION_MAP_PAGE_URL =
  'https://www.google.com/maps/search/?api=1&query=Last+Stop+Brewing,+525+Main+Street,+Shelbyville,+Kentucky+40065';
export const LOCATION_PHONE_NUMBER = '502-437-0024';
export const LOCATION_PHONE_HREF = 'tel:+15024370024';

export const LOCATION_ADDRESS_LINES = ['525 Main Street', 'Shelbyville, Kentucky 40065'] as const;

export const LOCATION_HOURS: readonly StoreHoursEntry[] = [
  { day: 'Sunday', hours: '11 AM to 11 PM' },
  { day: 'Monday', hours: '12 PM to 11 PM' },
  { day: 'Tuesday', hours: '12 PM to 11 PM' },
  { day: 'Wednesday', hours: '12 PM to 11 PM' },
  { day: 'Thursday', hours: '12 PM to 11 PM' },
  { day: 'Friday', hours: '12 PM to 11 PM' },
  { day: 'Saturday', hours: '11 AM to 11 PM' },
];
