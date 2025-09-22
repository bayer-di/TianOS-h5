# TianOS-H5 响应式设计与移动端适配指南

> **重要说明：** 当前开发阶段，项目采用统一布局，暂不需要考虑响应式布局。本文档作为未来扩展参考，当项目需要支持多种设备尺寸时再实施。

本文档定义了 TianOS-H5 项目的响应式设计与移动端适配规范，旨在确保应用在各种设备（手机、平板、桌面）上都能提供一致且优质的用户体验。

## 一、适配核心策略

### 1. 限制最大宽度的 rem 适配方案

```typescript
// 核心逻辑
const DESIGN_WIDTH = 395  // 设计稿宽度
const MAX_WIDTH = 750     // 最大宽度限制

export function setRem() {
  const refreshRem = () => {
    let width = document.documentElement.clientWidth
    
    // 核心优化：限制最大宽度
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH
    }
    
    // 计算 rem 基准值
    const rem = width / 10
    document.documentElement.style.fontSize = rem + 'px'
  }
}
```

- **设计稿尺寸**：395px 宽度
- **换算关系**：1rem = 39.5px（设计稿）
- **最大宽度限制**：750px，超过此宽度 rem 值不再增加

### 2. 断点系统

| 断点名称 | 宽度范围 | 典型设备 |
|---------|---------|---------|
| xs | < 576px | 小型手机 |
| sm | 576px - 767px | 大型手机 |
| md | 768px - 991px | 平板设备 |
| lg | 992px - 1199px | 小型桌面 |
| xl | ≥ 1200px | 大型桌面 |

### 3. 容器最大宽度

| 断点 | 容器最大宽度 |
|------|------------|
| xs | 100% |
| sm | 540px |
| md | 720px |
| lg | 960px |
| xl | 1140px |

## 二、开发规范

### 1. 样式编写规则

#### (1) 移动优先原则

始终先编写移动端样式，再通过媒体查询添加大屏幕样式：

```scss
.component {
  // 移动端基础样式（默认样式）
  padding: 16px;
  
  // 平板及以上设备样式
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  // 桌面设备样式
  @media (min-width: 992px) {
    padding: 32px;
  }
}
```

#### (2) 媒体查询顺序

媒体查询应按照从小到大的顺序排列：

```scss
// ✓ 正确顺序
@media (min-width: 576px) { ... }
@media (min-width: 768px) { ... }
@media (min-width: 992px) { ... }

// ✗ 错误顺序
@media (min-width: 992px) { ... }
@media (min-width: 576px) { ... }
```

#### (3) 避免固定高度

尽量避免使用固定高度，除非特殊情况：

```scss
// ✓ 推荐
.card {
  min-height: 100px;
}

// ✗ 避免
.card {
  height: 200px;
}
```

#### (4) 使用相对单位

优先使用相对单位而非固定像素：

```scss
// ✓ 推荐
.container {
  padding: 16px;  // 会被转换为 rem
  width: 100%;
  max-width: 600px;
}

// ✗ 避免
.container {
  width: 375px;  // 固定宽度
}
```

### 2. 组件开发规范

#### (1) 响应式属性

组件应提供响应式相关的属性：

```tsx
interface CardProps {
  // ...其他属性
  
  // 响应式属性
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  fullWidthOnMobile?: boolean;
}
```

#### (2) 组件尺寸设计

遵循以下尺寸设计原则：

- 触摸目标最小尺寸：44px × 44px
- 文本输入框最小高度：44px（移动端）
- 按钮最小宽度：64px

```tsx
// 按钮组件示例
const Button: React.FC<ButtonProps> = ({ size = 'medium', ...props }) => {
  // 不同尺寸的样式映射
  const sizeStyles = {
    small: { 
      padding: '4px 12px',    // 移动端
      '@media (min-width: 768px)': {
        padding: '2px 8px'    // 桌面端
      }
    },
    medium: { 
      padding: '8px 16px',    // 移动端
      '@media (min-width: 768px)': {
        padding: '6px 12px'   // 桌面端
      }
    },
    large: { 
      padding: '12px 20px',   // 移动端
      '@media (min-width: 768px)': {
        padding: '8px 16px'   // 桌面端
      }
    }
  };
  
  return <button {...props} style={sizeStyles[size]} />;
};
```

#### (3) 容器组件使用

页面内容应使用容器组件包裹：

```tsx
// ✓ 推荐
const Page: React.FC = () => (
  <Container>
    <h1>页面标题</h1>
    <div>页面内容</div>
  </Container>
);

// 需要全宽展示时
const FullWidthSection: React.FC = () => (
  <Container fluid>
    <div>全宽内容</div>
  </Container>
);
```

### 3. 布局规范

#### (1) 页面基本结构

```tsx
const PageTemplate: React.FC = () => (
  <div className="page">
    {/* 页头 */}
    <header className="page-header safe-area-top">
      {/* 页头内容 */}
    </header>
    
    {/* 主要内容 */}
    <Container>
      <main className="page-content">
        {/* 页面内容 */}
      </main>
    </Container>
    
    {/* 页脚 */}
    <footer className="page-footer safe-area-bottom">
      {/* 页脚内容 */}
    </footer>
  </div>
);
```

#### (2) 响应式布局模式

根据屏幕尺寸使用不同的布局模式：

- **小屏幕**：单列垂直布局
- **中等屏幕**：双列或网格布局
- **大屏幕**：多列布局，内容居中

```scss
// 响应式网格示例
.grid {
  display: grid;
  grid-template-columns: 1fr;           // 移动端：单列
  gap: 16px;
  
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;     // 平板：双列
  }
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr; // 桌面：三列
    gap: 24px;
  }
}
```

#### (3) 横屏适配

为横屏模式提供特定样式：

```scss
// 横屏适配
@media (orientation: landscape) {
  .page-header {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .page-content {
    display: flex;
    flex-direction: row;
  }
  
  .sidebar {
    width: 250px;
  }
  
  .main-content {
    flex: 1;
  }
}
```

### 4. 安全区域适配

#### (1) Viewport 设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

#### (2) 安全区域应用

```scss
// 底部安全区域
.footer {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}

// 顶部安全区域
.header {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}
```

## 三、工具与资源

### 1. 响应式工具类

```scss
// 在特定屏幕尺寸隐藏元素
.hide-xs { @media (max-width: 575px) { display: none !important; } }
.hide-sm { @media (min-width: 576px) and (max-width: 767px) { display: none !important; } }
.hide-md { @media (min-width: 768px) and (max-width: 991px) { display: none !important; } }
.hide-lg { @media (min-width: 992px) and (max-width: 1199px) { display: none !important; } }
.hide-xl { @media (min-width: 1200px) { display: none !important; } }

// 在横/竖屏模式下隐藏元素
.hide-portrait { @media (orientation: portrait) { display: none !important; } }
.hide-landscape { @media (orientation: landscape) { display: none !important; } }
```

### 2. 响应式混合函数

```scss
// 媒体查询混合函数
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'xs' {
    @media (max-width: 575px) { @content; }
  } @else if $breakpoint == 'sm' {
    @media (min-width: 576px) and (max-width: 767px) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: 768px) and (max-width: 991px) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: 992px) and (max-width: 1199px) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: 1200px) { @content; }
  } @else if $breakpoint == 'sm-up' {
    @media (min-width: 576px) { @content; }
  } @else if $breakpoint == 'md-up' {
    @media (min-width: 768px) { @content; }
  } @else if $breakpoint == 'lg-up' {
    @media (min-width: 992px) { @content; }
  } @else if $breakpoint == 'xl-up' {
    @media (min-width: 1200px) { @content; }
  }
}

// 横竖屏混合函数
@mixin portrait {
  @media (orientation: portrait) { @content; }
}

@mixin landscape {
  @media (orientation: landscape) { @content; }
}
```

### 3. 响应式Hook

```tsx
// 使用媒体查询的Hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// 使用示例
const Component: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 992px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  return (
    <div>
      {isDesktop ? <DesktopView /> : <MobileView />}
      {isLandscape && <LandscapeMessage />}
    </div>
  );
};
```

## 四、测试与验证

### 1. 设备测试清单

- **手机（竖屏）**：
  - 小屏手机（320px - 375px 宽度）
  - 标准手机（375px - 414px 宽度）
  - 大屏手机（414px+ 宽度）

- **手机（横屏）**：
  - 横屏模式下的各种手机尺寸

- **平板设备**：
  - 小型平板（768px 左右宽度）
  - 大型平板（1024px 左右宽度）

- **桌面设备**：
  - 小屏幕（1280px 左右宽度）
  - 大屏幕（1440px+ 宽度）

### 2. 常见问题与解决方案

#### (1) 1px 边框问题

在高 DPR 设备上，1px 边框会显示为多像素宽度，解决方案：

```scss
// 1px 边框解决方案
.hairline-bottom {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #e5e5e5;
    transform: scaleY(0.5);
    transform-origin: 0 100%;
  }
}
```

#### (2) 字体大小问题

iOS 设备上字体大小小于 12px 时会自动放大，解决方案：

```scss
// 小字体解决方案
.small-text {
  font-size: 12px;
  transform: scale(0.9);
  transform-origin: left center;
}
```

#### (3) 键盘弹出问题

移动端键盘弹出时可能遮挡输入框，解决方案：

```tsx
// 键盘弹出处理
const handleFocus = () => {
  // 等待键盘弹出
  setTimeout(() => {
    // 滚动到输入框位置
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 300);
};

<input ref={inputRef} onFocus={handleFocus} />;
```

## 五、最佳实践

### 1. 设计协作

- 与设计师确认设计稿基准尺寸（395px）
- 明确不同设备上的展示预期
- 为关键页面准备多种设备尺寸的设计稿

### 2. 开发流程

- 采用移动优先的开发方式
- 使用版本控制工具记录响应式调整
- 在多种设备上进行实时测试

### 3. 性能考量

- 针对不同设备加载不同尺寸的图片
- 使用 `will-change` 属性优化动画性能
- 避免不必要的媒体查询计算

### 4. 辅助工具

- 使用浏览器开发者工具的设备模拟器
- 添加开发环境的设备信息显示组件
- 使用截图对比工具验证不同设备上的一致性

## 当前阶段实施指南

> **注意：** 当前开发阶段，我们采用统一布局，专注于移动端体验，暂不实施完整的响应式设计。

### 当前阶段实施重点

1. **rem适配方案**：
   - 使用rem适配确保在不同手机屏幕上的一致体验
   - 设置最大宽度限制，避免在大屏设备上元素过大

2. **安全区域适配**：
   - 设置viewport-fit=cover
   - 为顶部和底部元素添加安全区域padding

3. **触摸友好设计**：
   - 确保所有可点击元素至少44px×44px
   - 表单元素高度至少44px

4. **1px边框处理**：
   - 使用transform scale方案处理高DPR设备上的1px边框问题

### 暂不实施的功能

1. ~~多断点响应式布局~~
2. ~~横屏特殊适配~~
3. ~~桌面端特殊优化~~

### 未来扩展

当项目需要支持更多设备类型时，再逐步实施本文档中的完整响应式设计方案。