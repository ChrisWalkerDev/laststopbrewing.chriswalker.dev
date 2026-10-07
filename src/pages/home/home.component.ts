import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeSceneService } from '../../app/core/three/home-scene.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sceneContainer', { static: true })
  private readonly sceneContainer!: ElementRef<HTMLElement>;

  readonly homeScene = inject(HomeSceneService);

  ngAfterViewInit(): void {
    void this.homeScene.attach(this.sceneContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.homeScene.detach();
  }
}
