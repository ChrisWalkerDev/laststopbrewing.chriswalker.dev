import { TestBed } from '@angular/core/testing';
import { FoodComponent } from './food.component';

describe('FoodComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodComponent],
    }).compileComponents();
  });

  it('should create the component scaffold', () => {
    const fixture = TestBed.createComponent(FoodComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render two menu images in deterministic order with non-empty alt text', () => {
    const fixture = TestBed.createComponent(FoodComponent);
    fixture.detectChanges();

    const images = Array.from(
      fixture.nativeElement.querySelectorAll('.food-page__menu-image')
    ) as HTMLImageElement[];

    expect(images.length).toBe(2);
    expect(images[0].getAttribute('src')).toContain('assets/food/menu-1-20260408.png');
    expect(images[1].getAttribute('src')).toContain('assets/food/menu-2-20260408.png');
    expect(images[0].alt.trim().length).toBeGreaterThan(0);
    expect(images[1].alt.trim().length).toBeGreaterThan(0);
  });

  it('should render fallback message when an image fails to load', () => {
    const fixture = TestBed.createComponent(FoodComponent);
    fixture.detectChanges();

    const firstImage = fixture.nativeElement.querySelector(
      '.food-page__menu-image'
    ) as HTMLImageElement | null;
    expect(firstImage).toBeTruthy();

    firstImage?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector(
      '.food-page__fallback'
    ) as HTMLElement | null;
    expect(fallback).toBeTruthy();
    expect(fallback?.textContent).toContain('could not be displayed');
  });

  it('should provide responsive image sizing attributes for required viewport matrix', () => {
    const fixture = TestBed.createComponent(FoodComponent);
    fixture.detectChanges();

    const images = Array.from(
      fixture.nativeElement.querySelectorAll('.food-page__menu-image')
    ) as HTMLImageElement[];

    expect(images[0].getAttribute('sizes')).toContain('(max-width: 768px) 92vw, 75vw');
    expect(images[1].getAttribute('sizes')).toContain('(max-width: 768px) 92vw, 75vw');
    expect(images[0].getAttribute('srcset')).toContain('assets/food/menu-1-20260408-748w.png 748w');
    expect(images[1].getAttribute('srcset')).toContain('assets/food/menu-2-20260408-748w.png 748w');
    expect(images[0].getAttribute('loading')).toBe('eager');
    expect(images[1].getAttribute('loading')).toBe('lazy');
  });
});
