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
    const maxScale = 2;
    const baseScale = 0.9;
    const sigma = 100;
    const spread = 0.2;
    const dockEl = ev.currentTarget as HTMLElement | null;
    let dockRect: DOMRect | null = null;
    if (dockEl) {
      dockRect = dockEl.getBoundingClientRect();
    }

    const scales: number[] = [];
    const rects: DOMRect[] = [];
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    let minTop = dockRect ? dockRect.top : Number.POSITIVE_INFINITY;
    let maxBottom = dockRect ? dockRect.bottom : Number.NEGATIVE_INFINITY;
    let minLeft = dockRect ? dockRect.left : Number.POSITIVE_INFINITY;
    let maxRight = dockRect ? dockRect.right : Number.NEGATIVE_INFINITY;

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
      /*       if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      } */

      target.style.setProperty('--dock-scale', scale.toFixed(3));
      el.style.zIndex = String(Math.round(scale * 100));

      minTop = Math.min(minTop, rect.top);
      maxBottom = Math.max(maxBottom, rect.bottom);
      minLeft = Math.min(minLeft, rect.left);
      maxRight = Math.max(maxRight, rect.right);
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

    if (dockEl && dockRect) {
      const extraTop = Math.max(dockRect.top - 20 - minTop, 0);
      const extraBottom = Math.max(maxBottom - dockRect.bottom, 0);
      const extraLeft = Math.max(dockRect.left - minLeft, 0);

      dockEl.style.setProperty('--dock-extra-top', `${extraTop.toFixed(1)}px`);
      dockEl.style.setProperty('--dock-extra-bottom', `${extraBottom.toFixed(1)}px`);
      dockEl.style.setProperty('--dock-extra-left', `${extraLeft.toFixed(1)}px`);
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

    const dockEl = this.itemEls[0]?.closest('ul.dock') as HTMLElement;
    if (dockEl) {
      dockEl.style.removeProperty('--dock-extra-top');
      dockEl.style.removeProperty('--dock-extra-bottom');
      dockEl.style.removeProperty('--dock-extra-left');
      dockEl.style.removeProperty('--dock-extra-right');
    }
  }

  private refreshIconEls(): void {
    this.itemEls = this.dockItems.toArray().map((ref) => ref.nativeElement);
  }
}
