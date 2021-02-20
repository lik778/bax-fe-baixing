# 搜索通

搜索通前端界面，集成了易慧推、凤鸣、标王、精品官网、站内广告等产品。

## 开发环境

```bash
# 安装依赖
npm install
# 启动开发环境 localhost:8888
npm start
```

## 项目说明

目录说明：

* `/api`: API请求函数相关
* `/asset`: 静态资源如图片、文档等
* `/config`: 项目级别的配置
* `/constant`: 项目常量
* `tool`: 各种配置文件
* `util`: 通用帮助函数
* `component`: 页面组件或通用组件

代码规范：

* [代码风格](https://gitlab.baixing.cn/yangyunshu/frontend-automation#%E4%BB%A3%E7%A0%81%E6%A0%A1%E9%AA%8C)
* [提交规范](https://gitlab.baixing.cn/yangyunshu/frontend-automation#%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF)
* [分支约定](https://gitlab.baixing.cn/yangyunshu/frontend-automation#%E5%88%86%E6%94%AF%E7%BA%A6%E5%AE%9A)

## TODO

* 关闭了 Webpack 不必要的输出提升热更新速度，但是现在热更新结束后没有提示
