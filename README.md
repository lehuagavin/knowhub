# 知识库网站

基于 Astro 4.x 构建的现代化、交互性强的课程展示网站，采用苹果风格设计。

## 项目概述

8周AI编码课程知识库网站，展示课程内容、AI工具生态、实战项目等。

## 技术栈

- **框架**: Astro 4.x
- **样式**: Tailwind CSS 4.x
- **动画**: GSAP (待集成)
- **图表**: Mermaid.js (待集成)
- **图标**: Lucide Icons (待集成)
- **UI库**: React (已集成)

## 已完成功能

### 第一阶段：基础框架搭建 ✅

- [x] 项目初始化
- [x] Tailwind CSS 配置
- [x] React 集成
- [x] 项目目录结构
- [x] 全局样式和设计系统
- [x] BaseLayout 组件
- [x] Navigation 组件（含响应式菜单）
- [x] Footer 组件
- [x] HeroSection 组件
- [x] StatsSection 组件
- [x] 首页基础版本

### 第二阶段：首页与核心组件 ✅

- [x] FeatureGrid 组件
- [x] TimelineView 组件
- [x] ToolShowcase 组件
- [x] ProjectCard 组件
- [x] CTASection 组件
- [x] 完善首页内容（包含学习路径、工具展示、项目预览、学习收益）

### 第三阶段：课程页面开发 ✅

- [x] 课程数据结构设计 (courses.ts)
- [x] CourseWeekCard 组件
- [x] AccordionList 组件
- [x] ExpandableSection 组件
- [x] 课程概览页 (/curriculum)
- [x] 每周课程页模板 (/weeks/[week])
- [x] 8周完整课程数据

### 第四阶段：工具页面开发 ✅

- [x] 工具数据结构设计 (tools.ts)
- [x] TabsView 组件
- [x] 工具总览页 (/tools)
- [x] 6大工具完整数据

### 第五阶段：项目页面开发 ✅

- [x] 项目总览页 (/projects)
- [x] 5个项目完整数据
- [x] 项目学习路径展示

### 第六阶段：其他页面与交互 ✅

- [x] 关于课程页 (/about)
- [x] 报名页 (/enroll)
- [x] 深色模式支持（通过CSS变量）
- [x] 基础动画效果

## 网站页面清单

### 已完成页面

1. **首页** (/) - 完整的课程展示，包含Hero区、统计、核心价值、学习路径、工具生态、项目预览、学习收益
2. **课程概览** (/curriculum) - 8周课程大纲、学习路径时间轴、整体学习目标、课程收益
3. **周课程页** (/weeks/1-8) - 每周详细内容、学习目标、课程小节、核心知识点、实战项目
4. **工具总览** (/tools) - 6大核心工具展示、工具生态关系、Cursor vs Claude Code对比
5. **项目总览** (/projects) - 5个实战项目、项目学习路径、技能获得
6. **关于课程** (/about) - 课程核心价值、学习收益、入学要求、常见问题FAQ
7. **立即报名** (/enroll) - 报名表单、课程信息、联系方式

## 核心组件清单

### 布局组件
- **BaseLayout** - 页面基础框架，包含SEO、Navigation、Footer
- **Navigation** - 固定顶部导航，响应式菜单，滚动效果
- **Footer** - 多列链接布局，响应式设计

### 展示组件
- **HeroSection** - 英雄区，支持渐变背景、双CTA
- **StatsSection** - 数据统计展示
- **TimelineView** - 垂直时间轴，支持自定义颜色
- **CTASection** - 行动号召区域

### 卡片组件
- **CourseWeekCard** - 周课程卡片
- **ToolShowcase** - 工具展示卡片
- **ProjectCard** - 项目卡片

### 内容组件
- **FeatureGrid** - 特性网格，支持2/3/4列
- **AccordionList** - 手风琴列表
- **ExpandableSection** - 可展开区域

### 交互组件
- **TabsView** - 标签页切换

## 设计特点

### 苹果风格设计系统

- 简约主义：大量留白，聚焦核心内容
- 高雅精致：细腻的动画过渡，流畅的交互体验
- 视觉优先：用图像、图表、动画代替大段文字
- 响应式设计：完美适配各种设备

### 色彩系统

- **主色调**: Apple Blue (#0071e3)
- **工具品牌色**:
  - Cursor Purple: #8b5cf6
  - Claude Orange: #d97706
  - NotebookLM Blue: #3b82f6
  - MCP Green: #10b981

## 项目结构

```
├── public/              # 静态资源
│   ├── images/         # 图片资源
│   └── videos/         # 视频资源
├── src/
│   ├── components/     # 组件
│   │   ├── layout/    # 布局组件 (Navigation, Footer)
│   │   ├── sections/  # 区域组件 (HeroSection, StatsSection)
│   │   ├── cards/     # 卡片组件
│   │   ├── content/   # 内容组件
│   │   ├── interactive/ # 交互组件
│   │   └── ui/        # UI组件
│   ├── layouts/       # 页面布局 (BaseLayout)
│   ├── pages/         # 页面 (index.astro)
│   ├── data/          # 数据文件
│   ├── scripts/       # 脚本文件
│   ├── styles/        # 样式文件 (global.css)
│   └── utils/         # 工具函数
├── astro.config.mjs   # Astro 配置
├── tailwind.config.mjs # Tailwind 配置
└── package.json       # 依赖配置
```

## 开发指南

### 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:4321 启动（如果端口被占用会自动切换）

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 数据结构

### courses.ts
- 8周完整课程数据
- 每周4个小节
- 学习目标、核心知识点、实战项目

### tools.ts
- 6大AI工具完整数据
- Cursor, Claude Code, NotebookLM, MCP, AI Agent, LLM
- 包含特性、使用场景、最佳实践

## 待完善功能

### 高优先级
- [ ] Mermaid图表集成（工具架构图、流程图）
- [ ] 工具详情页面（/tools/cursor, /tools/claude-code等）
- [ ] 项目详情页面（/projects/1-5）
- [ ] 课程小节页面（/weeks/[week]/lessons/[lesson]）

### 中优先级
- [ ] GSAP动画增强（滚动触发、视差效果）
- [ ] 图片资源补充（工具logo、项目截图）
- [ ] 报名表单后端集成
- [ ] ImageCarousel组件（项目截图轮播）

### 低优先级
- [ ] 粒子背景动画
- [ ] 更多微交互效果
- [ ] 用户评价模块
- [ ] 博客/文章模块

## 设计参考

- Apple官网: https://www.apple.com
- Vercel设计: https://vercel.com
- Linear设计: https://linear.app

## 文档

详细设计文档请参考: `/specs/0003-ai-training-camp.md`

## 许可证

MIT
