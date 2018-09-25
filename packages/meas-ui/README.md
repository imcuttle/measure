# meas-ui

[![NPM version](https://img.shields.io/npm/v/meas-ui.svg?style=flat-square)](https://www.npmjs.com/package/meas-ui)
[![NPM Downloads](https://img.shields.io/npm/dm/meas-ui.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/meas-ui)

> Measure UI for making PSD/SVG/HTML to be measurable

[Demo](https://imcuttle.github.io/measure)

![](https://i.loli.net/2018/09/24/5ba8ae0a7e1e7.png)

## Installation

```bash
npm install meas-ui react react-dom mobx@3 mobx-react@4 react-mobx-vm@^0.2.0
# or use yarn
yarn add meas-ui react react-dom mobx@3 mobx-react@4 react-mobx-vm@^0.2.0
```

## Usage

```javascript
// Commonjs
import MeasureUI from 'meas-ui'
// Umd (react / react / mobx / mobx-react / react-mobx-vm are packed)
import MeasureUI from 'meas-ui/dist/meas-ui.umd'
import 'meas-ui/dist/style.css'

MeasureUI.render(
  {
    pages: [
      {
        key: 'psd', // url
        title: 'My PSD',
        html: '<div>My PSD</div>' // or an async or a sync function that resolved html string
      }
    ],
    language: 'zh' // 'zh' or 'en'
  },
  window.root,
  () => {
    console.log('rendered')
  }
)
```

### Enable psd importing

- Import button supports psd file
- Drag file supports psd

![](https://i.loli.net/2018/09/24/5ba8aff4ab284.png)

- commonjs (webpack)
  bash

  ```
  npm install @moyuyc/psd-html
  ```

- umd
  ```html
  <html>
    <head>
      <script src="//unpkg.com/@moyuyc/psd-html"></script>
      <script src="//unpkg.com/meas-ui"></script>
    </head>
    <body>
      <script>
        MeasureUI.render(/* ... */)
      </script>
    </body>
  </html>
  ```

## Todo

- [ ] - zoom style has bug on firefox.

## Related

- [html-measure](../html-measure) - Pure measurable interaction written by React

## Authors

This library is written and maintained by imcuttle, [moyuyc95@gmail.com](mailto:moyuyc95@gmail.com).

## License

MIT
