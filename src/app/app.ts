import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AahNav } from "./components/aah-nav/aah-nav";
import { AahNavIcon } from './components/aah-nav/aah-nav-icon/aah-nav-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AahNav, AahNavIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('aliahmadhassan-portfolio');
  public showNavIcon: boolean = true;
}
