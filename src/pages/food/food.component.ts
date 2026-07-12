import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  FOOD_IMAGE_FALLBACK_MESSAGE,
  FOOD_IMAGE_SIZES,
  FOOD_MENU_IMAGE_DESCRIPTORS,
  FOOD_PAGE_DESCRIPTION,
  FOOD_PAGE_TITLE,
} from './food.constants';
import { FoodImageStatus, FoodMenuImageAsset, FoodPageViewModel } from './food.models';

@Component({
  selector: 'app-food',
  imports: [NgOptimizedImage],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodComponent {
  protected readonly imageSizes = FOOD_IMAGE_SIZES;
  protected readonly pageDescription = FOOD_PAGE_DESCRIPTION;
  protected readonly fallbackMessage = FOOD_IMAGE_FALLBACK_MESSAGE;

  private readonly title = signal(FOOD_PAGE_TITLE);
  private readonly menuImages = signal<FoodMenuImageAsset[]>(
    FOOD_MENU_IMAGE_DESCRIPTORS.map((image) => ({ ...image, status: 'pending' }))
  );

  protected readonly viewModel = computed<FoodPageViewModel>(() => {
    const images = [...this.menuImages()].sort((left, right) => left.order - right.order);
    const failedImageCount = images.filter((image) => image.status === 'error').length;
    const hasAnyVisibleMenu = images.some((image) => image.status === 'loaded');

    return {
      title: this.title(),
      images,
      failedImageCount,
      hasAnyVisibleMenu,
    };
  });

  protected onImageLoad(imageId: FoodMenuImageAsset['id']): void {
    this.updateImageStatus(imageId, 'loaded');
  }

  protected onImageError(imageId: FoodMenuImageAsset['id']): void {
    this.updateImageStatus(imageId, 'error');
  }

  private updateImageStatus(imageId: FoodMenuImageAsset['id'], status: FoodImageStatus): void {
    this.menuImages.update((images) =>
      images.map((image) => (image.id === imageId ? { ...image, status } : image))
    );
  }
}
