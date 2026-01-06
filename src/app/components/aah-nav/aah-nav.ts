import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AahNavIcon } from './aah-nav-icon/aah-nav-icon';

@Component({
  selector: 'aah-nav',
  imports: [AahNavIcon],
  templateUrl: './aah-nav.html',
  styleUrl: './aah-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AahNav implements AfterViewInit {
  @ViewChildren('dockItem', { read: ElementRef })
  private dockItems!: QueryList<ElementRef<HTMLElement>>;

  private itemEls: HTMLElement[] = [];

  public ngAfterViewInit(): void {
    this.refreshIconEls();
    this.dockItems.changes.subscribe(() => {
      this.refreshIconEls();
    });
  }

  protected onDockMouseMove(ev: MouseEvent): void {
    if (!this.itemEls.length) {
      this.refreshIconEls();
    }

    const pointerX = ev.clientX;
    const pointerY = ev.clientY;
    const maxScale = 2.5;
    const baseScale = 0.9;
    const sigma = 100;
    const spread = 0.2;

    const scales: number[] = [];
    const rects: DOMRect[] = [];
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < this.itemEls.length; i++) {
      const el = this.itemEls[i];
      const target = el.querySelector<HTMLElement>('.block');
      if (!target) {
        scales[i] = baseScale;
        rects[i] = new DOMRect();
        continue;
      }

      const rect = target.getBoundingClientRect();
      rects[i] = rect;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot((pointerX - centerX) * 0.6, pointerY - centerY);
      const t = Math.exp(-(distance * distance) / (2 * sigma * sigma));

      const scale = baseScale + (maxScale - baseScale) * t;
      scales[i] = scale;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }

      target.style.setProperty('--dock-scale', scale.toFixed(3));
      el.style.zIndex = String(Math.round(scale * 100));
    }

    const extras = scales.map((scale, i) => {
      const rect = rects[i];
      const extra = Math.max(scale - 1, 0);
      return extra * rect.height * spread;
    });

    const shifts = new Array(this.itemEls.length).fill(0);
    if (this.itemEls.length > 1) {
      let accum = extras[closestIndex] ?? 0;
      for (let i = closestIndex - 1; i >= 0; i--) {
        shifts[i] = -accum;
        accum += extras[i] ?? 0;
      }

      accum = extras[closestIndex] ?? 0;
      for (let i = closestIndex + 1; i < this.itemEls.length; i++) {
        shifts[i] = accum;
        accum += extras[i] ?? 0;
      }
    }

    for (let i = 0; i < this.itemEls.length; i++) {
      this.itemEls[i].style.setProperty('--dock-shift', `${shifts[i].toFixed(1)}px`);
    }
  }

  protected onDockMouseLeave(): void {
    for (const el of this.itemEls) {
      const target = el.querySelector<HTMLElement>('.block');
      if (target) {
        target.style.removeProperty('--dock-scale');
      }

      el.style.removeProperty('--dock-shift');
      el.style.removeProperty('z-index');
    }
  }

  private refreshIconEls(): void {
    this.itemEls = this.dockItems.toArray().map((ref) => ref.nativeElement);
  }
}
