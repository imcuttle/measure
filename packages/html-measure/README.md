# html-measure

[![NPM version](https://img.shields.io/npm/v/html-measure.svg?style=flat-square)](https://www.npmjs.com/package/html-measure)
[![NPM Downloads](https://img.shields.io/npm/dm/html-measure.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/html-measure)

> Make html to be measurable written by React

![](https://i.loli.net/2018/09/24/5ba8b09633089.png)

## Installation

```bash
npm install html-measure
# or use yarn
yarn add html-measure
```

## Usage

```javascript
import HtmlMeasure from 'html-measure'
import 'html-measure/style.css'
// or
import 'html-measure/style.less'

ReactDOM.render(<HtmlMeasure html="<div>foo</div>" />, window.root)
```

## Props

#### `className`

- Type: `string`

#### `style`

- Type: `object`

#### `html`

- Type: `string`

#### `unit`

- Type: one of `'px' | 'rem'`
- Default: `'px'`

#### `remStandardPx`

- Type: `number`
- Default: `16`

#### `scaleGapPx`

![](https://i.loli.net/2018/09/24/5ba8b1b604097.png)

The size of the red rect in the above picture.

- Type: `number`
- Default: `10`

#### `isShowUnit`

- Type: `boolean`
- Default: `true`

#### `isCalcContainerWidth`

- Type: `boolean`
- Default: `true`

#### `numberFixed`

- Type: `number`
- Default: `0`

## Authors

This library is written and maintained by imcuttle, [moyuyc95@gmail.com](mailto:moyuyc95@gmail.com).

## License

MIT
