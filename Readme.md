### bax fe

搜索通的用户界面，集成了凤鸣、标王、精品官网、站内广告等产品

### 开发说明

* 基本流程
  - `npm install`
  - `dev mode`: `npm start` -> `localhost:3000`
  - `发布`:
    * 首先: 更改 `package.json` 的 version, 然后 `commit`
    * 然后: 执行 `./release`, 注意: 不是 `npm run release`
    * 最终: `docker upgrade by rancher`

* 主要文佳目录
  - `/api`: 所有的 `api` 全部在这里
  - `/asset`: 静态资源, `img`, `ico` ...
  - `/base`: `event store`, 临时的, 后面应该会整合到 `rx`
  - `/config`: `config`
  - `/constant`: `constant`
  - `/cssbase`: `css var`, `css mixin`, 注意: `node_modules` 里也有 `cssbase`
  - `template`: `dev html template`
  - `view`: `online html template`
  - `tool`: 各种配置文件
  - `util`: 通用的 `utils`
  - `component`: `各个 components`

* 说明
  - CSS 文件（.css 或 css in Vue）语法请使用 PostCSS 解析，如果你使用 VSCode 开发的话可以搜索“PostCSS Language Support”并将它应用为项目 CSS 文件语法解析器。

* 用到的 主要 库
  - `vue`, `vue-router`
  - `rxjs` -> TODO: `vue-rx`
  - `postcss`: `css` 部分 只使用了 `postcss-cssnext`, `postcss-import`, `postcss-mixins`

### 修改默认样式

修改样式步骤如下：

1. 修改根目录的 custom-theme.scss
2. 执行 npm run theme

npm run theme 其实是调用 element-ui 提供的主题工具去生成新的组件样式文件。

如果对需要改动的变量不熟悉，可以参考 element-variables.scss 看看有哪些变量可以改动。请勿直接改动 element-variables.scss。
