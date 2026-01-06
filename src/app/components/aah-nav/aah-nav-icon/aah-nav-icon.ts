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

  private mouse = { X: 0, Y: 0, CX: 0, CY: 0 };

  ngOnDestroy(): void {  }

  ngOnInit(): void {  }

  protected onBlockMouseMove(ev: MouseEvent, blockEl: HTMLElement): void {
    const rect = blockEl.getBoundingClientRect();

    // pageX/pageY -> client coords correction for scroll
    const clientX = ev.pageX - window.scrollX;
    const clientY = ev.pageY - window.scrollY;

    this.mouse.X = clientX - rect.left - rect.width / 2;
    this.mouse.Y = clientY - rect.top - rect.height / 2;

    const el = blockEl.querySelector<HTMLElement>('.circleLight');
    el!.style.background = `radial-gradient(circle at ${this.mouse.X}px ${this.mouse.Y}px, #fff, transparent)`;
  }

  public onBlockMouseLeave(): void {
    this.mouse.X = this.mouse.CX;
    this.mouse.Y = this.mouse.CY;
    console.log(this.mouse);
  }
}
