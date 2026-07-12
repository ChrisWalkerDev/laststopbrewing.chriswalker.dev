export type FoodRouteDecision = 'approved' | 'denied' | 'unknown';
export type FoodRouteRedirectTarget = '/age-gate' | '/access-denied' | null;
export type FoodImageStatus = 'pending' | 'loaded' | 'error';

export interface FoodRouteState {
  path: '/food';
  guardPolicy: 'age-gated';
  decision: FoodRouteDecision;
  redirectTarget: FoodRouteRedirectTarget;
}

export interface FoodMenuImageAsset {
  id: 'menu-1' | 'menu-2';
  src: string;
  srcset: string;
  alt: string;
  order: 1 | 2;
  width: number;
  height: number;
  status: FoodImageStatus;
}

export interface FoodPageViewModel {
  title: string;
  images: FoodMenuImageAsset[];
  failedImageCount: number;
  hasAnyVisibleMenu: boolean;
}
