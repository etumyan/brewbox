<br>
<br>
<p align="center">
  <img src="https://github.com/etumyan/brewbox/blob/master/app/src/assets/logo.svg" width="360" alt="Brewbox Logo">
</p>
<p align="center">
  <img src="https://img.shields.io/github/package-json/v/etumyan/brewbox" alt="Brewbox Version">
  <img src="https://img.shields.io/github/license/etumyan/brewbox" alt="Brewbox License">
</p>
<br>
<br>

## Installation

```
npm install brewbox
```

## Usage

### Stories definition

Create your stories describing them in files named _*.stories.ts_ like so:

```typescript
// button.stories.ts

import { ButtonComponent } from './button.component';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
};

export const Primary = args => ({
  props: args,
});

Primary.args = {
  text: 'Button',
};
```

### CLI

#### Help

```
Usage: brewbox [command]

Commands:
  serve [options]         Builds and serves in watch mode
  build [options]         Builds into an output directory
  version                 Outputs current version
  help                    Lists available commands
```

#### Serve

```
Usage: brewbox serve [options]

Options:
  --project               Specifies particular project in Angular workspace directory
  --verbose               Outputs additional information during execution
```

#### Build

```
Usage: brewbox build [options]

Options:
  --project               Specifies particular project in Angular workspace directory
  --verbose               Outputs additional information during execution

```
