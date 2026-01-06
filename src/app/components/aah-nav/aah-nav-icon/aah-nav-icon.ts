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

  protected onBlockMouseMove(ev: MouseEvent, blockEl: HTMLElement): void {
    const rect = blockEl.getBoundingClientRect();

    // pageX/pageY -> client coords correction for scroll
    const clientX = ev.pageX - window.scrollX;
    const clientY = ev.pageY - window.scrollY;

    const mouseX = clientX - rect.left - rect.width / 2;
    const mouseY = clientY - rect.top - rect.height / 2;

    const el = blockEl.querySelector<HTMLElement>('.circleLight');
    if (el) {
      el.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, #fff, transparent)`;
    }

  }

  public onBlockMouseLeave(blockEl: HTMLElement): void {
    const el = blockEl.querySelector<HTMLElement>('.circleLight');
    if (el) {
      el.style.removeProperty('background');
    }
  }
}
