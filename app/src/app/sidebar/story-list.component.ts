import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { stories } from '../../stories';
import { parsePath } from '../utils/parse-path';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  path: ['components', 'button', 'primary'];
}

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class StoryListComponent {
  storiesTree: any[];

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);

  dataSource = new MatTreeNestedDataSource<TreeNode>();

  selectedStory = ['components', 'button', 'primary'];

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  constructor(private router: Router, private location: Location) {
    this.storiesTree = this.generateTree();
    this.dataSource.data = this.storiesTree;

    const parsedPath = parsePath(location.path());
    const selectedNode = this.dataSource.data.find(item => item.name === parsedPath.component);

    if (selectedNode) {
      this.treeControl.expand(selectedNode);
    }
  }

  select(path: any) {
    this.router.navigate(path);
  }

  isSelected(path: string[]) {
    if (path.join('/') === this.location.path().replace(/^\//, '')) {
      return true;
    }

    return false;
  }

  private generateTree() {
    return Object.keys(stories).map(key => {
      const component = (stories as any)[key];
      const _stories = Object.keys(component).filter(key => key !== 'default');
      const titleElements = component.default.title.split('/');

      return {
        test: 1,
        name: titleElements[titleElements.length - 1],
        children: _stories.map(key => ({ name: key, path: [...titleElements, key] })),
        path: titleElements,
      };
    });
  }
}
