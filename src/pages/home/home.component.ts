import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type HomeSectionDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type HomeSectionOrderConfig = Partial<Record<HomeSectionDay, string[]>>;

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageCaptionTitle?: string;
  imageCaptionSubtitle?: string;
}

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly pageTitle = signal('Last Stop Brewing');

  protected readonly sections = signal<HomeSection[]>([
    {
      id: 'taproom',
      title: 'Crafted for the long night.',
      subtitle: 'A neighborhood taproom with rotating pours and warm hospitality.',
      description:
        'Join us for pints poured by hand, seasonal releases, and a laid-back room designed for lingering.',
      ctaLabel: 'Visit the taproom',
      ctaHref: '/location',
    },
    {
      id: 'beer',
      title: 'Last new beer on tap.',
      subtitle: 'Fresh pours arrive every Monday for a new week of flavor.',
      description:
        'Stop by for the newest release, seasonal favorites, and the first pour of the week.',
      ctaLabel: 'See the latest pour',
      ctaHref: '/beer',
      imageSrc: 'assets/home/new_beer_20260831.jpg',
      imageAlt: 'A hazy pale ale poured into a stemmed glass on a barrel top inside the brewhouse.',
      imageWidth: 2216,
      imageHeight: 1663,
      imageCaptionTitle: 'Last Call Haze',
      imageCaptionSubtitle: 'New England IPA',
    },
    {
      id: 'food',
      title: 'Comfort food that keeps pace.',
      subtitle: 'Pair your pint with dishes made for a brewery night out.',
      description:
        'Enjoy elevated pub classics, shareable plates, and crowd-pleasing favorites made to pair.',
      ctaLabel: 'Browse the menu',
      ctaHref: '/food',
    },
    {
      id: 'live-music',
      title: 'Live sounds all week long.',
      subtitle: 'Thursday through Saturday nights come alive with local performers.',
      description:
        'Catch acoustic sets, DJ sets, and late-week bands that turn the taproom into the best seat in town.',
      ctaLabel: 'See the schedule',
      ctaHref: '/location',
    },
  ]);

  protected readonly sectionOrderByDay = signal<HomeSectionOrderConfig>({
    monday: ['beer', 'taproom', 'food', 'live-music'],
    thursday: ['live-music', 'taproom', 'food', 'beer'],
    friday: ['live-music', 'taproom', 'food', 'beer'],
    saturday: ['live-music', 'taproom', 'food', 'beer'],
  });

  protected getVisibleSections(date: Date = new Date()): HomeSection[] {
    const dayName = new Intl.DateTimeFormat('en', {
      weekday: 'long',
    })
      .format(date)
      .toLowerCase() as HomeSectionDay;

    const configuredOrder = this.sectionOrderByDay()[dayName] ?? [];

    return [...this.sections()].sort((left, right) => {
      const leftIndex = configuredOrder.indexOf(left.id);
      const rightIndex = configuredOrder.indexOf(right.id);

      if (leftIndex !== rightIndex) {
        return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
          (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
      }

      const leftOriginalIndex = this.sections().findIndex((section) => section.id === left.id);
      const rightOriginalIndex = this.sections().findIndex((section) => section.id === right.id);

      return leftOriginalIndex - rightOriginalIndex;
    });
  }
}
