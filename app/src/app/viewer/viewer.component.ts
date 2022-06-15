import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

import { stories } from '../../stories';
import { parsePath } from '../utils/parse-path';
import { default as docs } from '../../../documentation.json';

interface ComponentInput {
  name: string;
  type: string;
  defaultValue: any;
}

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class ViewerComponent implements OnInit {
  @ViewChild('renderTarget', { read: ViewContainerRef, static: true })
  renderTarget!: ViewContainerRef;

  stories: any = stories;

  inputs: ComponentInput[] = [];

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const selectedComponent = this.getSelectedComponent();

        if (selectedComponent) {
          this.loadComponent(selectedComponent);

          const documentation = docs.components.find(
            component => component.name === this.stories[selectedComponent].default.component.name,
          );

          this.inputs = documentation!.inputsClass as any;
        }
      }
    });
  }

  private loadComponent(selectedComponent: string) {
    const viewContainerRef = this.renderTarget;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(this.stories[selectedComponent].default.component);
    const selectedStory = this.getSelectedStory();
    const storyGroup = this.stories[selectedComponent];
    const args = storyGroup[selectedStory].args;

    Object.keys(args).forEach(key => {
      componentRef.instance[key] = args[key];
    });
  }

  private getSelectedComponent() {
    const parsedPath = parsePath(this.location.path());

    return Object.keys(this.stories).find(key => {
      const splittedTitle = this.stories[key].default.title.split('/');
      return splittedTitle[splittedTitle.length - 1] === parsedPath.component;
    });
  }

  private getSelectedStory() {
    const parsedPath = parsePath(this.location.path());
    return parsedPath.story;
  }
}
