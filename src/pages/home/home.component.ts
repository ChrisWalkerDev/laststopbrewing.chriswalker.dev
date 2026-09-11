import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME_APPS, HOME_PAGE_TITLE, HOME_SOCIAL_LINKS } from './home.constants';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly pageTitle = HOME_PAGE_TITLE;
  protected readonly apps = HOME_APPS;
  protected readonly socialLinks = HOME_SOCIAL_LINKS;
}
