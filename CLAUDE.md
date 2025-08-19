# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个基于 Vue 3 + Tailwind CSS + Naive UI 的**LexiSort - 智能词汇分类系统**。该系统是一个简化的单页应用，专注于核心功能：添加带分类的单词、查看分类词汇、批量导入单词。LexiSort 结合了 Lexicon（词汇）和 Sort（分类）的概念，系统采用现代化的蓝紫渐变设计风格，提供优雅的用户体验。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建  
npm run build

# 预览生产构建
npm run preview

# 运行代码检查
npm run lint
```

## 快速开始

1. **安装依赖**: `npm install`
2. **启动开发**: `npm run dev` (运行在 http://localhost:3000)
3. **开始使用**: 添加带分类的单词，然后按分类查看

## 技术架构

### 技术栈
- **Vue 3**: 使用组合式 API 和响应式数据管理
- **Naive UI**: 现代化 Vue 3 UI 组件库，提供美观的设计语言
- **Tailwind CSS**: 实用优先的 CSS 框架，用于快速 UI 开发
- **Vite**: 快速构建工具和开发服务器

### 项目结构

```
src/
├── App.vue                   # 主应用组件，包含导航和布局
├── main.js                   # 应用入口点，配置 Naive UI
├── style.css                 # Tailwind CSS 导入
├── components/
│   ├── AddWordForm.vue       # 单词输入表单，带验证功能
│   ├── BatchImport.vue       # JSON批量导入组件
│   └── CategoryWordList.vue  # 分类筛选的单词显示组件
├── models/
│   └── Word.js              # 简化的单词数据模型
└── services/
    └── storageService.js    # localStorage 封装，用于数据持久化
```

### 核心组件

**AddWordForm.vue**:
- 表单验证，实时反馈
- 预定义分类 + 自定义分类输入
- 使用 Vue 3 组合式 API 的响应式表单状态
- 完全基于 Naive UI 组件构建

**BatchImport.vue**:
- JSON 文件上传和拖拽功能
- 数据验证和预览
- 批量处理和错误处理
- 支持格式说明和帮助

**CategoryWordList.vue**:
- 分类筛选，显示单词数量
- 响应式卡片/表格式单词显示
- 删除功能，带确认对话框
- 搜索功能

**Word 模型** (`models/Word.js`):
- 简化结构: id, word, meaning, category, createdAt
- 内置验证和 JSON 序列化
- 唯一 ID 生成

**存储服务** (`services/storageService.js`):
- localStorage 抽象层
- 单词的 CRUD 操作
- 分类管理和筛选

## 核心功能

### 主要功能
- **添加单词**: 表单包含单词、释义和分类选择
- **按分类查看**: 根据分类筛选单词，显示视觉计数
- **批量导入**: JSON 文件批量导入功能
- **数据持久化**: 使用 localStorage 进行客户端数据存储
- **删除单词**: 删除单个单词，带确认提示

### 界面/用户体验
- **响应式设计**: 移动优先的设计方法
- **现代化界面**: 基于 Naive UI 的设计语言，美观简洁
- **实时反馈**: 表单验证和成功消息
- **分类管理**: 动态分类创建和筛选
- **固定布局**: 左右两侧卡片都是一屏高度，右侧内容可滚动

## 开发模式

### Vue 3 组合式 API
- 所有组件使用 `<script setup>` 或显式 `setup()` 函数
- 使用 `ref()` 和 `reactive()` 进行响应式状态管理
- 计算属性用于派生状态
- 通过事件发射进行组件通信

### 状态管理
- 组件本地状态用于表单数据和 UI 状态
- 集中化存储服务用于数据持久化
- 通过 props 和 events 进行父子组件通信

### 样式方法
- 主要使用 Naive UI 组件和其设计语言
- Tailwind 实用类用于布局和间距
- 一致的间距和颜色方案
- 响应式断点，移动端优化

### 布局设计
- **左右分栏布局**: 左侧录入，右侧列表
- **固定高度卡片**: 左右两侧都是 `calc(100vh-6rem)` 一屏高度
- **左侧不滚动**: 手动录入和批量导入选项卡，内容适配固定高度
- **右侧内部滚动**: 分类筛选固定，单词列表区域可滚动
- **选项卡切换**: 左侧支持手动录入和批量导入两种模式

## 数据管理

### 存储格式
单词以 JSON 数组形式存储在 localStorage 中:
```javascript
{
  id: "unique-id",
  word: "example", 
  meaning: "例子，实例",
  category: "日常用语",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### 分类
预定义分类: 日常用语, 商务英语, 学术词汇, 科技术语, 生活用品, 情感表达, 旅行出行, 医疗健康, 美食烹饪
用户也可以通过在表单中输入来创建自定义分类。

## 配置

### 构建配置
- **Vite**: 快速开发和构建工具
- **PostCSS**: Tailwind CSS 处理
- **ESLint**: 代码检查，使用 Vue 插件
- **Naive UI**: 完整的组件库集成

### 自定义要点
- **分类**: 在 `AddWordForm.vue` 中修改预定义选项
- **样式**: 在 `tailwind.config.js` 中调整 Tailwind 配置
- **存储**: 扩展存储服务以进行额外的数据操作
- **UI组件**: 在 `main.js` 中添加更多 Naive UI 组件

### Naive UI 集成
项目完全集成了 Naive UI 框架，包括:
- 表单组件 (NForm, NFormItem, NInput, NButton)
- 数据展示 (NDataTable, NTag, NEmpty)
- 反馈组件 (NMessage, NDialog, NAlert)
- 布局组件 (NCard, NSpace, NTabs)
- 功能组件 (NUpload, NScrollbar, NCode)

所有用户交互都使用 Naive UI 的原生组件，确保一致的设计语言和用户体验。

# important-instruction-reminders
完成用户要求的任务，不多不少。
除非绝对必要，否则不要创建文件。
始终优先编辑现有文件而不是创建新文件。
除非用户明确要求，否则不要主动创建文档文件 (*.md) 或 README 文件。

      
      重要提示: 此上下文可能与你的任务相关或不相关。除非与你的任务高度相关，否则你不应该响应此上下文。