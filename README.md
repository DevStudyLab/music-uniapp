# 音渊

基于 uni-app 开发的现代化音乐播放器应用。

## 功能特点

- 🎵 音乐播放
  - 播放控制：支持播放/暂停
  - 专辑动画：动态旋转的专辑封面

- 📝 歌单管理
  - 创建个人歌单
  - 编辑歌单信息
  - 添加/删除歌曲

- 👥 用户系统
  - 账号注册与登录
  - 个人信息管理
  - 头像上传
  - 用户数据同步

- 💬 社交互动
  - 评论系统
  - 回复功能

- 🔍 智能搜索
  - 实时搜索提示
  - 模糊匹配
  - 热门搜索推荐

## 技术实现

### 前端技术栈

- **uni-app框架**：实现跨平台开发，支持H5、小程序等多端
- **Vue.js**：采用Vue2语法，实现响应式数据管理和组件化开发
- **SCSS**：使用预处理器实现样式管理，提供主题定制能力
- **uni-ui组件库**：使用官方组件库，确保跨平台兼容性

### 核心功能实现

1. **音频播放引擎**
   - 基于uni.createInnerAudioContext实现音频控制

2. **UI/UX设计**
   - 自适应布局设计
   - 流畅的过渡动画

3. **数据存储**
   - 本地存储：uni.storage API
   - 云端同步：RESTful API

## 项目结构

```
├── components/          # 可复用组件
│   ├── bottomPlayer/    # 底部播放器组件
│   ├── music-background/# 音乐背景组件
│   ├── my-audio/       # 音频控制组件
│   ├── my-video/       # 视频播放组件
│   └── recursiveComment/# 递归评论组件
├── pages/              # 页面文件
│   ├── index/         # 首页
│   ├── login/         # 登录页
│   ├── menu/          # 菜单页
│   └── mine/          # 个人中心
├── static/            # 静态资源
│   ├── images/        # 图片资源
│   └── particles-config.json # 粒子效果配置
├── utils/             # 工具函数
│   ├── request.js     # 网络请求封装
│   └── uploadFile.js  # 文件上传工具
└── App.vue            # 应用入口文件
```

## 开发环境要求

- HBuilderX 3.0+
- Node.js 12.0+
- 微信开发者工具（小程序开发用）

## 快速开始

1. 克隆项目
```bash
git clone https://gitcode.com/weng235/music-uniapp.git
```

2. 安装依赖
```bash
npm install
```

3. 运行项目
- H5版本：HBuilderX中选择"运行到浏览器"
- 小程序：HBuilderX中选择对应小程序运行