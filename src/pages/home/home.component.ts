import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type HomeSectionDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

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
      title: 'The latest beer to be tapped.',
      subtitle: 'Fresh pours every day.',
      description: 'Stop by for the newest release today!',
      ctaLabel: 'See our current tap list',
      ctaHref: '/beer',
      imageSrc: 'assets/home/juice_hunter_20260831.jpg',
      imageAlt:
        'A beer glass filled with a hazy orange beer on a bar counter with a blurred background of the taproom.',
      imageWidth: 1212,
      imageHeight: 2048,
      imageCaptionTitle: 'Juice Hunter',
      imageCaptionSubtitle: 'Juicy Double IPA',
    },
    {
      id: 'food',
      title: 'Comfort food that keeps pace.',
      subtitle: 'Pair your pint with dishes made for a brewery night out.',
      description:
        'Enjoy elevated pub classics, shareable plates, and crowd-pleasing favorites made to pair.',
      ctaLabel: 'Browse the menu',
      ctaHref: '/food',
      imageSrc: 'assets/home/burger_20260831.jpg',
      imageAlt: 'A burger served with seasoned french fries in a basket on a wooden taproom table.',
      imageWidth: 1512,
      imageHeight: 1546,
      imageCaptionTitle: 'Pub Classics',
      imageCaptionSubtitle: 'Hand-crafted burgers and sides',
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
    sunday: ['beer', 'food', 'live-music', 'taproom'],
    monday: ['beer', 'food', 'live-music', 'taproom'],
    tuesday: ['beer', 'food', 'live-music', 'taproom'],
    wednesday: ['beer', 'food', 'live-music', 'taproom'],
    thursday: ['live-music', 'beer', 'food', 'taproom'],
    friday: ['live-music', 'beer', 'food', 'taproom'],
    saturday: ['live-music', 'beer', 'food', 'taproom'],
  });

  protected getVisibleSections(date: Date = new Date()): HomeSection[] {
    const dayName = new Intl.DateTimeFormat('en', {
      weekday: 'long',
    })
      .format(date)
      .toLowerCase() as HomeSectionDay;

    const configuredOrder = this.sectionOrderByDay()[dayName] ?? [];

    return this.sections()
      .filter((section) => configuredOrder.includes(section.id))
      .sort((left, right) => configuredOrder.indexOf(left.id) - configuredOrder.indexOf(right.id));
  }
}
