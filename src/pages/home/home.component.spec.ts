import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { HOME_APPS, HOME_SOCIAL_LINKS } from './home.constants';

describe('HomeComponent', () => {
  it('should render an app icon and label for each home app', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const appLinks = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Apps"] .home-screen__app')
    ) as HTMLAnchorElement[];

    expect(appLinks.length).toBe(HOME_APPS.length);

    HOME_APPS.forEach((app, index) => {
      const link = appLinks[index];
      expect(link.getAttribute('href')).toBe(app.route);
      const icon = link.querySelector('.home-screen__icon');
      if (app.iconType === 'image') {
        expect(icon?.getAttribute('src')).toBe(app.icon);
      } else {
        expect(icon?.textContent?.trim()).toBe(app.icon);
      }
      expect(link.querySelector('.home-screen__label')?.textContent?.trim()).toBe(app.label);
    });
  });

  it('should render a social link icon and label for each social link', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const socialLinks = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Social media"] .home-screen__app')
    ) as HTMLAnchorElement[];

    expect(socialLinks.length).toBe(HOME_SOCIAL_LINKS.length);

    HOME_SOCIAL_LINKS.forEach((social, index) => {
      const link = socialLinks[index];
      expect(link.getAttribute('href')).toBe(social.url);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      const icon = link.querySelector('.home-screen__icon');
      if (social.iconType === 'image') {
        expect(icon?.getAttribute('src')).toBe(social.icon);
      } else {
        expect(icon?.textContent?.trim()).toBe(social.icon);
      }
      expect(link.querySelector('.home-screen__label')?.textContent?.trim()).toBe(social.label);
    });
  });
});
