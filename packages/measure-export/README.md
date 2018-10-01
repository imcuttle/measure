# `measure-export`

> Make measure UI exported for teamwork

## Usage

```
const measureExport = require('measure-export');

const me = measureExport({
  // options
})

// Get dynamic webpack config
me.getWebpackConfig({ prod: false }).then(config => {})
// Get webpack middlewares, like hot middleware and dev middleware
me.getMiddlewares().then(({ hot, dev }) => {})
// Run webpack build processing
me.build().then(states => {})
```

## API

### Options

#### `debug`

Print debugging information

- Type: `boolean`
- Default: `false`

#### `sourceMap`:

See webpack's [`devtool`](https://webpack.js.org/configuration/devtool/) option

`false` means turn off source-map
`true` means turn on source-map, (that is to say, webpack `devtool` option assigned to be `source-map`)

- Type: `boolean`
- Default: `false`

#### `htmlTemplatePath`

template path about html-webpack-plugin

- Type: `string`
- Default: `nps.join(__dirname, 'index.html')`

#### `compilationSuccessInfo`

It's belong to the options of [`friendly-errors-webpack-plugin`](https://github.com/geowarin/friendly-errors-webpack-plugin)

#### `distDir`

the directory of dist when running `build`

- Type: `string`
- Default: `nps.join(process.cwd(), 'dist')`

#### `glob`

The matched patterns in `context` which would be shown in navigator (left view)

- Type: `string[] | string`
- Default: `['**/*.{psd,html,htm}']`

#### `language`

[Language](../meas-ui) in UI by default

- Type: `string`
- Default: `en-us`

#### `hot`

Enable webpack hot module replacement and file watching or not

```javascript
measureExport({
  hot: false
})
  .getMiddlewares()
  .then(({ hot }) => {
    hot // undefined
  })
```

- Type: `boolean`
- Default: `true`

#### `hash`

The identifier of the current process

- Type: `string`
- Optional

#### `webpackConfigUpdater`

webpack configuration updater

- Type: `config => updatedConfig`

## TODO

- [ ] IPC (multi-worker)
