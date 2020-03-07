# wechat-moments

仿微信朋友圈功能，前端React，后端Node，数据库MongoDB

预览地址：[https://www.84games.com/](https://www.84games.com/)

## 安装

```
git clone https://github.com/lqqyt2423/wechat-moments.git
cd wechat-moments
npm install
cd client
npm install
```

## 本地测试

打开两个终端，分别运行服务端`node server.js` 与客户端`cd client && npm install` 。

之后在`http://localhost:3000/` 进行测试。

## 功能介绍

实现H5 版微信朋友圈的功能：

1. 使用React 实现前端页面
2. 使用Node.js 实现后端逻辑（express），数据保存在MongoDB
3. 可发布图文或文字消息，可点赞互动

还没来得及实现的功能：

1. 评论功能
2. UC 浏览器position: fixed 存在bug
3. 前端交互较弱