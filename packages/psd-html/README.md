# `psd-measure`

[![NPM version](https://img.shields.io/npm/v/@moyuyc/psd-html.svg?style=flat-square)](https://www.npmjs.com/package/@moyuyc/psd-html)
[![NPM Downloads](https://img.shields.io/npm/dm/@moyuyc/psd-html.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@moyuyc/psd-html)

> Make it a fun to create spec by psd for developers and teammates

It works on node and browser.

Returned html is looks like the follow

```html
<div id="psd-root" data-hm-exclude style="width: 1100px; height: 1200px; background-image: base64...">
  <div class="psd-layer"
    data-title="title"
    data-font-...="..."
    data-radius-...="..."
    data-box-shadow-...="..."
    data-stroke-...="..."
    data-text-...="..."
    data-psd-index="0"
    style="top, left, width, height"
  ></div>
  <div class="psd-layer" data-psd-index="1" style="top, left, width, height"></div>
</div>
```

## Installation

```bash
npm install @moyuyc/psd-html
# or use yarn
yarn add @moyuyc/psd-html
```

## Usage

```javascript
const { psdToHtmlFromBuffer } = require('psd-measure')

psdToHtmlFromBuffer('./path/to/psdfile').then(html => {
  // ...
})
```

Or using [unpkg](https://unpkg.com/@moyuyc/psd-html) named `PsdToHtml`

## API

### Common API

The following APIs works on Node.js and Browser.

#### psdToHtml: `psd => Promise<string>`

`psd` argument is from [psd.js](https://github.com/meltingice/psd.js)

- Example

```javascript
const PSD = require('psd')
const psd = PSD.fromFile('path/to/file.psd')
psdToHtml(psd).then(console.log)
```

#### psdToHAST: `(psd, options) => Promise<object>`

Returns [hast (HTML Abstract Syntax Tree)](https://github.com/syntax-tree/hast) asynchronously

#### psdToHtmlFromBuffer: `(psdBuffer, options) => Promise<html>`

`psdBuffer` should be instance of `Buffer` in Node.js, and `Uint8Array` in Browser

#### psdToHASTFromBuffer: `(psdBuffer, options) => Promise<hast>`

### Browser API

#### psdToHtmlFromURL: `(url, options) => Promise<html>`

- Example

```javascript
psdToHtmlFromURL('http://www.example.com/foo.psd').then(html => {
  /* ... */
})
```

#### psdToHASTFromURL: `(url, options) => Promise<hast>`

### Node.js API

#### psdToHtmlFromPath: `(path, options) => Promise<html>`

- Example

```javascript
psdToHtmlFromPath('path/to/psdfile').then(html => {
  /* ... */
})
```

#### psdToHASTFromPath: `(path, options) => Promise<hast>`

### Options

#### `unit`

The html size's (height/width/top/left) style unit.

- Type: one of `'px' | 'rem'`
- Default: `'px'`

#### `remStandard`

The rem unit's pixel standard. (e.g. `16` means: 1rem equals 16px)

- Type: number
- Default: `16`

#### `imageSplit`

Use image for each layer, instead of the only root one.

- Type: boolean
- Default: `false`

#### `injectImage`

Whether injecting image in html

- Type: boolean
- Default: `true`

## TODO

- [x] default font(size, family...) (deal with it temporarily)
- [ ] the exported `position / size` is more larger (`keyShapeInvalidated: false`)
- [ ] inset shadow
- [x] border

## Authors

This library is written and maintained by imcuttle, [moyuyc95@gmail.com](mailto:moyuyc95@gmail.com).

## License

MIT
