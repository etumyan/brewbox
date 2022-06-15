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

Install package:

```
npm install -g brewbox
```

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

Run in the root of an Angular workspace:

```
brewbox --project your-project-name
```
