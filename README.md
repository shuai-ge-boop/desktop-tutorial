# Vue3 后台管理系统

基于 Vue3 + ElementPlus + SCSS 开发的现代化后台管理系统。

## 🎯 项目特点

- ✨ 使用 Vue3 Composition API 开发
- 🎨 使用 ElementPlus 组件库，界面美观
- 📱 响应式设计，支持移动端
- 🔐 完整的登录认证系统
- 🗂️ 多页面路由管理
- 🎭 Pinia 状态管理
- 🎨 SCSS 样式预处理器
- 🚀 Vite 构建工具，开发体验极佳

## 📦 技术栈

- **前端框架**: Vue 3.3.4
- **UI 组件库**: Element Plus 2.3.8
- **路由管理**: Vue Router 4.2.4
- **状态管理**: Pinia 2.1.6
- **构建工具**: Vite 4.4.0
- **样式预处理**: SCSS
- **图标**: Element Plus Icons

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🔑 登录说明

登录页面支持任意用户名和密码登录（长度需符合验证规则）：

- 用户名：3-20个字符
- 密码：6-20个字符

## 📋 功能模块

### 1. 登录页面
- 用户名密码登录
- 表单验证
- 记住登录状态
- 响应式设计

### 2. 首页（Dashboard）
- 数据统计卡片
- 系统状态监控
- 图表展示区域
- 快捷操作按钮

### 3. 用户管理
- 用户列表展示
- 搜索功能
- 分页组件
- 批量操作
- 角色管理

### 4. 系统管理
- 基础设置
- 安全配置
- 系统信息
- 系统操作

## 🎨 界面展示

### 登录页面
- 渐变背景设计
- 居中表单布局
- 输入框图标提示
- 加载状态反馈

### 主页面布局
- 顶部导航栏
- 左侧菜单栏
- 面包屑导航
- 用户信息下拉菜单

## 📁 项目结构

```
vue3-admin-system/
├── src/
│   ├── components/          # 公共组件
│   ├── layout/             # 布局组件
│   │   └── index.vue       # 主布局
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由文件
│   ├── stores/             # Pinia状态管理
│   │   └── user.js         # 用户状态
│   ├── styles/             # 样式文件
│   │   ├── index.scss      # 主样式
│   │   └── variables.scss  # 变量定义
│   ├── views/              # 页面组件
│   │   ├── Dashboard.vue   # 首页
│   │   ├── Login.vue       # 登录页
│   │   ├── System.vue      # 系统管理
│   │   └── User.vue        # 用户管理
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
└── README.md              # 说明文档
```

## 🔧 配置说明

### Vite 配置
- 路径别名配置 (@指向src目录)
- SCSS 全局变量自动导入
- 开发服务器配置

### 路由配置
- 路由懒加载
- 路由守卫
- 路由元信息

### 状态管理
- Pinia 配置
- 用户状态管理
- 本地存储持久化

## 🎯 开发规范

### 代码风格
- 使用 Vue3 Composition API
- 组件采用 `<script setup>` 语法
- 样式使用 SCSS 预处理器
- 遵循 ESLint 规范

### 命名规范
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 变量名使用 camelCase

## 🔮 扩展功能

### 可扩展的功能模块
- 权限管理系统
- 多语言支持
- 主题切换
- 图表集成 (ECharts)
- 文件上传
- 富文本编辑器

### 性能优化
- 路由懒加载
- 组件异步加载
- 图片懒加载
- 代码分割

## 🐛 问题反馈

如果您在使用过程中遇到任何问题，请提交 Issue 或联系开发者。

## 📄 许可证

本项目使用 MIT 许可证。

---

**享受编码的乐趣！** 🎉
