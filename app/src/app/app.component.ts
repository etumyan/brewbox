import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { trim } from './utils/trim';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private titleService: Title, private location: Location) {}

  ngOnInit() {
    this.location.onUrlChange(url => {
      this.titleService.setTitle(
        this.generateTitleFromPath(url),
      );
    });
  }

  private generateTitleFromPath(path: string) {
    return trim(path, '/').split('/').join(' / ') || 'Brewbox';
  }
}
