import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ABOUT_PAGE_TITLE, ABOUT_SECTION_SKELETON } from './about.constants';
import { AboutPageViewModel, AboutSection } from './about.models';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly pageTitle = signal(ABOUT_PAGE_TITLE);
  private readonly sections = signal<AboutSection[]>(
    ABOUT_SECTION_SKELETON.map((section) => ({ ...section }))
  );

  protected readonly viewModel = computed<AboutPageViewModel>(() => ({
    title: this.pageTitle(),
    sections: [...this.sections()].sort((left, right) => left.order - right.order),
  }));
}
