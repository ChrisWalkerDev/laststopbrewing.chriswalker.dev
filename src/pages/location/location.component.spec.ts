import { TestBed } from '@angular/core/testing';
import {
  LOCATION_ADDRESS_LINES,
  LOCATION_HOURS,
  LOCATION_MAP_EMBED_TITLE,
  LOCATION_MAP_PAGE_URL,
  LOCATION_PHONE_HREF,
  LOCATION_PHONE_NUMBER,
} from './location.constants';
import { LocationComponent } from './location.component';

describe('LocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationComponent],
    }).compileComponents();
  });

  it('should create the location page scaffold', () => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render each day with the provided store hours', () => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();

    const renderedItems = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.location-page__hours-item'
      ) as NodeListOf<HTMLElement>
    );

    const renderedPairs = renderedItems.map((item) => {
      const day = item.querySelector('dt')?.textContent?.trim();
      const hours = item.querySelector('dd')?.textContent?.trim();
      return { day, hours };
    });

    expect(renderedItems.length).toBe(7);
    expect(renderedPairs).toEqual(LOCATION_HOURS.map((entry) => ({ ...entry })));
  });

  it('should render the exact address lines in a clickable map link', () => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();

    const addressLink = fixture.nativeElement.querySelector(
      '.location-page__address-link'
    ) as HTMLAnchorElement | null;
    const addressLines = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.location-page__address-link span'
      ) as NodeListOf<HTMLElement>
    ).map((line) => line.textContent?.trim());

    expect(addressLink).toBeTruthy();
    expect(addressLink?.getAttribute('href')).toBe(LOCATION_MAP_PAGE_URL);
    expect(addressLink?.getAttribute('target')).toBe('_blank');
    expect(addressLink?.getAttribute('rel')).toContain('noopener');
    expect(addressLines).toEqual([...LOCATION_ADDRESS_LINES]);
  });

  it('should render an accessible map iframe', () => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector(
      '.location-page__map-frame'
    ) as HTMLIFrameElement | null;

    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('title')).toBe(LOCATION_MAP_EMBED_TITLE);
    expect(iframe?.getAttribute('src')).toContain('google.com/maps');
  });

  it('should render clickable phone number with tel href', () => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();

    const phoneLink = fixture.nativeElement.querySelector(
      '.location-page__phone-link'
    ) as HTMLAnchorElement | null;

    expect(phoneLink).toBeTruthy();
    expect(phoneLink?.textContent?.trim()).toBe(LOCATION_PHONE_NUMBER);
    expect(phoneLink?.getAttribute('href')).toBe(LOCATION_PHONE_HREF);
  });
});
