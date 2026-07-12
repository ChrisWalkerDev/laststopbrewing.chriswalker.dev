import { TestBed } from '@angular/core/testing';
import { BeerComponent } from './beer.component';
import { BEER_EMBED_SRC, BEER_FALLBACK_LINK_LABEL } from './beer.constants';

describe('BeerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerComponent],
    }).compileComponents();
  });

  it('should create and render iframe shell', () => {
    const fixture = TestBed.createComponent(BeerComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
    expect(iframe).toBeTruthy();
  });

  it('should expose beer page layout containers', () => {
    const fixture = TestBed.createComponent(BeerComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.beer-page') as HTMLElement | null;
    const frameWrap = fixture.nativeElement.querySelector(
      '.beer-page__frame-wrap'
    ) as HTMLElement | null;

    expect(root).toBeTruthy();
    expect(frameWrap).toBeTruthy();
  });

  it('should render iframe with exact embed source URL', () => {
    const fixture = TestBed.createComponent(BeerComponent);
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.getAttribute('src')).toContain(BEER_EMBED_SRC);
  });

  it('should show fallback block after iframe error and include open link', () => {
    const fixture = TestBed.createComponent(BeerComponent);
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement;
    iframe.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector(
      '.beer-page__fallback'
    ) as HTMLElement | null;
    expect(fallback).toBeTruthy();

    const fallbackLink = fallback?.querySelector('a') as HTMLAnchorElement | null;
    expect(fallbackLink?.textContent?.trim()).toBe(BEER_FALLBACK_LINK_LABEL);
    expect(fallbackLink?.getAttribute('target')).toBe('_blank');
  });
});
