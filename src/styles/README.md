# TianOS-h5 样式系统

本文档介绍 TianOS-h5 项目的样式系统架构、使用方法和最佳实践。

## 目录结构

```
styles/
├── core/                  # 核心样式
│   ├── _variables.scss    # 变量定义
│   ├── _mixins.scss       # 混合器
│   ├── _reset.scss        # 重置样式
│   ├── _responsive.scss   # 响应式工具
│   ├── _typography.scss   # 排版样式
│   ├── _utilities.scss    # 工具类
│   ├── _themes.scss       # 主题系统
│   └── _index.scss        # 核心样式入口
├── components/            # 组件样式
│   ├── _button.scss       # 按钮组件
│   ├── _container.scss    # 容器组件
│   ├── _navbar.scss       # 导航栏组件
│   └── _index.scss        # 组件样式入口
├── layouts/               # 布局样式
│   ├── _main-layout.scss  # 主布局
│   └── _index.scss        # 布局样式入口
├── pages/                 # 页面样式
│   ├── _home.scss         # 首页
│   ├── _login.scss        # 登录页
│   ├── _ui-demo.scss      # UI演示页
│   ├── _work-record-entry.scss # 工作记录录入页
│   └── _index.scss        # 页面样式入口
├── index.scss             # 主入口文件
└── README.md              # 本文档
```

## 样式系统特点

### 1. 模块化结构

样式系统采用模块化结构，便于维护和扩展：

- **核心模块**：包含基础变量、混合器和工具类
- **组件模块**：各个UI组件的样式
- **布局模块**：页面布局相关样式
- **页面模块**：特定页面的样式

### 2. 命名规范

采用 BEM 命名规范，使样式结构更清晰：

- **Block**：组件的主要容器，如 `.c-button`
- **Element**：组件内的元素，如 `.c-button__icon`
- **Modifier**：组件的变体，如 `.c-button--primary`

前缀规范：
- `c-`：组件样式（Component）
- `l-`：布局样式（Layout）
- `page-`：页面样式（Page）
- `u-`：工具类样式（Utility）

### 3. 主题系统

基于 CSS 变量的主题系统，支持浅色/深色主题切换：

```scss
// 使用主题变量
.my-component {
  color: var(--text-color, $text-color);
  background-color: var(--bg-color, $bg-color);
}
```

切换主题：

```html
<!-- 深色主题 -->
<body class="theme-dark">
  <!-- 内容 -->
</body>
```

### 4. 响应式设计

完善的响应式支持：

```scss
// 使用响应式混合器
@include respond-to('md') {
  // 平板及以上样式
}

@include respond-below('sm') {
  // 小屏幕样式
}
```

断点定义：
- `xs`：375px（小型手机）
- `sm`：576px（大型手机）
- `md`：768px（平板）
- `lg`：992px（小型桌面）
- `xl`：1200px（大型桌面）
- `xxl`：1600px（超大桌面）

## 使用指南

### 引入样式

在组件中引入样式：

```scss
// 引入核心样式
@use '../core' as *;

// 组件样式
.my-component {
  // 使用变量
  color: $primary-color;
  
  // 使用混合器
  @include flex-center;
  
  // 使用主题变量
  background-color: var(--bg-color, $bg-color);
}
```

### 常用混合器

```scss
// 弹性布局
@include flex($direction, $justify, $align, $wrap);
@include flex-center;
@include flex-between;

// 文本溢出
@include ellipsis($line);

// 响应式
@include respond-to($breakpoint);
@include respond-below($breakpoint);
@include respond-between($min, $max);

// 安全区域
@include safe-area-inset-top;
@include safe-area-inset-bottom;

// 字体样式
@include font-title-l;
@include font-body-m;
```

### 工具类

项目提供了丰富的工具类，可以快速应用常用样式：

```html
<!-- 间距 -->
<div class="m-md p-lg">内容</div>

<!-- 布局 -->
<div class="d-flex justify-content-between align-items-center">内容</div>

<!-- 文本 -->
<p class="text-center text-primary">居中主色文本</p>

<!-- 响应式 -->
<div class="hide-below-md">在中等及以上屏幕显示</div>
```

### 创建新组件

创建新组件样式的步骤：

1. 在 `components/` 目录下创建新的组件样式文件，如 `_card.scss`
2. 在文件顶部引入核心样式：`@use '../core' as *;`
3. 使用 BEM 命名规范编写组件样式
4. 在 `components/_index.scss` 中引入新组件：`@forward 'card';`

### 创建新页面样式

创建新页面样式的步骤：

1. 在 `pages/` 目录下创建新的页面样式文件，如 `_about.scss`
2. 在文件顶部引入核心样式：`@use '../core' as *;`
3. 使用 `page-` 前缀作为页面根类名
4. 在 `pages/_index.scss` 中引入新页面：`@forward 'about';`

## 最佳实践

1. **使用变量**：始终使用预定义的变量，而不是硬编码值
2. **组件封装**：保持组件样式的封装性，避免样式泄漏
3. **响应式优先**：采用移动优先的响应式设计
4. **主题兼容**：使用 CSS 变量确保主题切换的兼容性
5. **避免嵌套过深**：SCSS 嵌套不要超过 3 层
6. **遵循 BEM**：严格遵循 BEM 命名规范
7. **使用工具类**：对于简单样式，优先使用工具类
8. **组件复用**：尽可能复用已有组件，保持一致性

## 性能优化

1. **避免全局引入**：只引入需要的模块，减少 CSS 体积
2. **减少选择器复杂度**：避免过于复杂的选择器
3. **使用 CSS 变量**：便于主题切换和动态样式
4. **移除未使用的样式**：定期清理未使用的样式代码
5. **优化媒体查询**：合并相同断点的媒体查询

## 常见问题

### 样式冲突

如果遇到样式冲突，请检查：

1. 选择器特异性是否过高
2. 是否遵循了 BEM 命名规范
3. 组件样式是否正确封装

### 主题切换问题

主题切换不生效，请检查：

1. 是否正确使用了 CSS 变量
2. 是否正确添加了主题类（`.theme-dark`）
3. 变量是否在 `_themes.scss` 中正确定义

### 响应式问题

响应式不生效，请检查：

1. 断点值是否正确
2. 媒体查询是否正确编写
3. 是否遵循移动优先的设计原则

## 贡献指南

添加或修改样式时，请遵循以下原则：

1. 遵循项目的命名规范和架构
2. 添加适当的注释说明
3. 确保样式的响应式和主题兼容性
4. 进行充分的测试，确保跨浏览器兼容性