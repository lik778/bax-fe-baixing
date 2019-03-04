### bax fe

搜索通的用户界面，集成了凤鸣、标王、精品官网、站内广告等产品

### 开发说明

* 基本流程
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

* 关于 component 的说明

  - TODO

* 用到的 主要 库
  - `vue`, `vue-router`
  - `rxjs` -> TODO: `vue-rx`
  - `postcss`: `css` 部分 只使用了 `postcss-cssnext`, `postcss-import`, `postcss-mixins`

### 关于 element ui 的样式文件

* copy `//unpkg.com/element-ui/lib/theme-default/index.css` (这是被墙的 >_<)
* css中 `fonts/element-icons.woff`
* css中 `fonts/element-icons.ttf` 传一下, 改一下

* 修改element配置样式：修改根目录的element-theme.scss 并执行 `et -c ./element-theme.scss`