import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LOCATION_ADDRESS_LINES,
  LOCATION_HOURS,
  LOCATION_MAP_EMBED_SRC,
  LOCATION_MAP_EMBED_TITLE,
  LOCATION_MAP_PAGE_URL,
  LOCATION_PAGE_TITLE,
  LOCATION_PHONE_HREF,
  LOCATION_PHONE_NUMBER,
} from './location.constants';
import { LocationPageViewModel, StoreHoursEntry } from './location.models';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent {
  protected readonly mapEmbedSrc: SafeResourceUrl;
  protected readonly mapEmbedTitle = LOCATION_MAP_EMBED_TITLE;
  protected readonly mapPageUrl = LOCATION_MAP_PAGE_URL;
  protected readonly phoneNumber = LOCATION_PHONE_NUMBER;
  protected readonly phoneHref = LOCATION_PHONE_HREF;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly pageTitle = signal(LOCATION_PAGE_TITLE);
  private readonly addressLines = signal<readonly string[]>([...LOCATION_ADDRESS_LINES]);
  private readonly hours = signal<StoreHoursEntry[]>(LOCATION_HOURS.map((entry) => ({ ...entry })));

  protected readonly viewModel = computed<LocationPageViewModel>(() => ({
    title: this.pageTitle(),
    addressLines: [...this.addressLines()],
    hours: [...this.hours()],
  }));

  constructor() {
    this.mapEmbedSrc = this.sanitizer.bypassSecurityTrustResourceUrl(LOCATION_MAP_EMBED_SRC);
  }
}
