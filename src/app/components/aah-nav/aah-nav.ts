import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AahNavIcon } from './aah-nav-icon/aah-nav-icon';

@Component({
  selector: 'aah-nav',
  imports: [AahNavIcon],
  templateUrl: './aah-nav.html',
  styleUrl: './aah-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AahNav { }
