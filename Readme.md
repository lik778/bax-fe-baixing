### bax fe

搜索通的用户界面，集成了凤鸣、标王、精品官网、站内广告等产品

### 开发说明

- 基本流程

  - `npm install`
  - `dev mode`: `npm start` -> `localhost:3000`
  - `发布`:
    - 首先: 更改 `package.json` 的 version, 然后 `commit`
    - 然后: 执行 `./release`, 注意: 不是 `npm run release`
    - 最终: `docker upgrade by rancher`

- 主要文件目录

  - `/api`: 所有的 `api` 全部在这里
  - `/asset`: 静态资源, `img`, `ico` ...
  - `/base`: `event store`, 临时的, 后面应该会整合到 `rx`
  - `/config`: `config`
  - `/constant`: `constant`
  - `/cssbase`: 样式相关文件
  - `template`: `dev html template`
  - `view`: `online html template`
  - `tool`: 各种配置文件
  - `util`: 通用的 `utils`
  - `component`: `各个 components`

- 用到的 主要 库
  - `vue`, `vue-router`
  - `rxjs` -> TODO: `vue-rx`
