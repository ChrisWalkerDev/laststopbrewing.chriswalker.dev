import { FoodMenuImageAsset } from './food.models';

export const FOOD_PAGE_TITLE = 'Food Menu';
export const FOOD_PAGE_DESCRIPTION = 'Browse the current menu in two readable image pages.';

export const FOOD_IMAGE_WIDTH = 1545;
export const FOOD_IMAGE_HEIGHT = 2000;
export const FOOD_IMAGE_SIZES = '(max-width: 768px) 92vw, 75vw';
const FOOD_IMAGE_WIDTH_VARIANTS = [480, 748, 1024] as const;

function buildFoodImageSrcset(basePath: string): string {
  const extensionIndex = basePath.lastIndexOf('.');
  const pathWithoutExtension = basePath.slice(0, extensionIndex);
  const extension = basePath.slice(extensionIndex);

  const variantEntries = FOOD_IMAGE_WIDTH_VARIANTS.map(
    (width) => `${pathWithoutExtension}-${width}w${extension} ${width}w`
  );

  return [...variantEntries, `${basePath} ${FOOD_IMAGE_WIDTH}w`].join(', ');
}

export const FOOD_IMAGE_FALLBACK_MESSAGE =
  'One or more menu images could not be displayed. Please refresh or ask staff for assistance.';

export const FOOD_MENU_IMAGE_DESCRIPTORS: Omit<FoodMenuImageAsset, 'status'>[] = [
  {
    id: 'menu-1',
    src: 'assets/food/menu-1-20260408.png',
    srcset: buildFoodImageSrcset('assets/food/menu-1-20260408.png'),
    alt: 'Food menu page one with starters and mains.',
    order: 1,
    width: FOOD_IMAGE_WIDTH,
    height: FOOD_IMAGE_HEIGHT,
  },
  {
    id: 'menu-2',
    src: 'assets/food/menu-2-20260408.png',
    srcset: buildFoodImageSrcset('assets/food/menu-2-20260408.png'),
    alt: 'Food menu page two with sandwiches, sides, and desserts.',
    order: 2,
    width: FOOD_IMAGE_WIDTH,
    height: FOOD_IMAGE_HEIGHT,
  },
];
