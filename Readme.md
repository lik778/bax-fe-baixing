# 搜索通

搜索通前端界面，集成了易慧推、凤鸣、标王、精品官网、站内广告等产品。

## 配置

### 代码格式化

* [ESLint](https://eslint.org/docs/user-guide/getting-started) + [Prettier](https://prettier.io/) + [EditorConfig](https://editorconfig.org/)

格式化工具说明：

* 无论你是 VSCode 或是 Gitlab 在线编辑器，无需安装插件，仅通过项目 EditorConfig 文本文件即可实现字符集、换行等基本的代码格式行为约束。
* Prettier 用于格式化代码，支持 JS、CSS 等常见代码类型。
* ESLint 通过解析 JS、分析 AST，以发现编辑器无法发现的潜在的代码问题与异味。

可以发现，从代码规范上来看，EditorConfig、Prettier、ESLint 三者一步一步更向严格靠拢。不过无需担心，严格的检测带来了代码的整洁，帮助阅读代码的人快速理解与定位。“保证所有代码看起来都像一个人编写的”是一个神圣的目标。

三者可能有一些重叠的部分，不过通过[插件](https://github.com/prettier/eslint-plugin-prettier)，解决了格式化功能重叠的问题。火箭随时可以发射，长官！

格式化流程：

// TOOD

## 开发

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

### 关于 element ui 的样式文件

* copy `//unpkg.com/element-ui/lib/theme-default/index.css` (这是被墙的 >_<)
* css中 `fonts/element-icons.woff`
* css中 `fonts/element-icons.ttf` 传一下, 改一下

* 修改element配置样式：修改根目录的element-theme.scss 并执行 `et -c ./element-theme.scss`
