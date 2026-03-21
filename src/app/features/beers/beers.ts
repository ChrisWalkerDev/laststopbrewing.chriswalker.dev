import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-beers',
  imports: [],
  templateUrl: './beers.html',
  styleUrl: './beers.scss',
})
export class Beers {
  businessName = 'Last Stop Brewing';
  iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://business.untappd.com/embeds/iframes/46552/172250'
    );
  }
}
