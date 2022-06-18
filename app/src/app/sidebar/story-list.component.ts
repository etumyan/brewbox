import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { stories as storyFiles } from '../../stories';
import { trim } from '../utils/trim';

interface TreeNode {
  name: string;
  path: string[];
  children?: TreeNode[];
}

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class StoryListComponent {
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);

  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(private location: Location, private router: Router) {
    this.dataSource.data = this.generateTree();

    const selectedNodePath = trim(this.location.path(), '/');
    const selectedNodeParentPath = selectedNodePath.split('/').slice(0, -1);
    const selectedNodeParent = this.getNodeByPath(this.dataSource.data, selectedNodeParentPath);

    if (selectedNodeParent) {
      this.treeControl.expand(selectedNodeParent);
    }
  }

  isNodeHasChildren(_: number, node: TreeNode) {
    return node.children && node.children.length;
  }

  isNodeSelected(nodePath: string[]) {
    const selectedNodePath = trim(this.location.path(), '/');

    return nodePath.join('/') === selectedNodePath;
  }

  selectNode(path: string[]) {
    this.router.navigate(path);
  }

  private generateTree() {
    return Object.keys(storyFiles).map(storyFileKey => {
      const { metadata, stories } = this.normalizeStoryFile((storyFiles as any)[storyFileKey]);

      return {
        name: metadata.name,
        path: metadata.path,
        children: stories.map(name => ({
          name,
          path: [...metadata.path, name],
        })),
      };
    });
  }

  private getNodeByPath(tree: TreeNode[], path: string[]) {
    const queue = [...tree];

    while (queue.length) {
      const item = queue.shift()!;
      if (item.path.join('/') === path.join('/')) {
        return item;
      } else {
        item.children && queue.push(...item.children);
      }
    }

    return;
  }

  private normalizeStoryFile(storyFile: any) {
    const title = storyFile.default.title.split('/');

    return {
      metadata: {
        name: title[title.length - 1],
        path: title,
      },
      stories: Object.keys(storyFile).filter(key => key !== 'default'),
    }
  }
}
