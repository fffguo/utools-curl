# utools-curl

## 插件介绍

在日常开发中，经常需要复制测试环境的curl在本地进行调试：

传统方式需要五步：

1. copy浏览器中的curl命令
2. 打开文本编辑器
3. 手动进行替换域名
4. 复制新curl命令
5. 命令行执行

使用该插件现在只需两步

1. copy浏览器中的curl命令
2. 呼出utools，回车即可

## 插件使用说明

1. <kbd>F12打开浏览器调试工具</kbd> <kbd>></kbd> <kbd>Network</kbd> <kbd>></kbd> <kbd>选中某条请求右键</kbd> <kbd>></kbd> <kbd>
   copy</kbd> <kbd>></kbd> <kbd>copy as curl (bash)</kbd> > <kbd>这样就得到了一条curl命令</kbd>
2. <kbd>alt+space</kbd> <kbd>></kbd> <kbd>呼出utools</kbd>
3. <kbd>回车进入插件即可</kbd>

## 插件效果图预览

> 插件入口

![入口图](https://raw.githubusercontent.com/fffguo/picture-warehouse/main/github/entrance.png)

> 插件进入效果

![预览图1](https://raw.githubusercontent.com/fffguo/picture-warehouse/main/github/preImg1.png)
![预览图2](https://raw.githubusercontent.com/fffguo/picture-warehouse/main/github/preImg1.png)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
