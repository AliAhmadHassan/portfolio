import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'aah-nav-icon',
  imports: [],
  templateUrl: './aah-nav-icon.html',
  styleUrl: './aah-nav-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AahNavIcon implements OnInit, OnDestroy {
  @Input({ required: true }) svgURL!: string;

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
