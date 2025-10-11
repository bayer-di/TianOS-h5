# Pages 国际化处理完成

## 📋 处理概述

已对 `src/pages` 目录下的所有页面进行了完整的国际化处理，支持中文（zh-CN）和英文（en-US）两种语言。

## 🎯 已处理的页面

### 1. 员工信息录入页面 (`employee-info-entry/index.tsx`)
- **页面标题**：入职信息上传
- **上传提示**：身份证和银行卡上传说明
- **成功提示**：信息上传成功后的反馈

### 2. 作业记录录入页面 (`work-record-entry/index.tsx`)
- **页面标题**：作业记录录入
- **表单字段**：人员、工种、所属区块、种植区域、品种、计件工作量、计时工作量、工作时间、备注
- **占位符文本**：所有输入框和选择器的提示文本
- **验证消息**：表单验证错误提示
- **提交状态**：提交中和提交按钮文本

### 3. 结果反馈页面 (`result-page.tsx`)
- **页面标题**：结果反馈
- **成功状态**：操作成功标题和描述
- **错误状态**：操作失败标题和描述

### 4. 图片裁剪页面 (`image-cropper.tsx`)
- **OCR 成功提示**：身份证和银行卡验证成功消息
- **OCR 失败提示**：验证失败的错误提示
- **对话框**：重试和返回按钮文本

### 5. Toast 测试页面 (`toast-test.tsx`)
- **页面标题**：Toast测试页面
- **按钮文本**：各种Toast类型的按钮
- **消息内容**：Toast显示的具体消息

### 6. ImageCropper 组件 (`components/ImageCropper/index.tsx`)
- **按钮文本**：取消、确认按钮
- **处理状态**：处理中状态文本
- **缩放控制**：缩放相关文本（注释部分）
- **错误处理**：通过回调函数处理错误，支持国际化错误消息

## 🔧 技术实现

### 使用的 Hook
```tsx
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('pages.myPage.title')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

### 翻译键命名规范
```
pages.{pageName}.{section}.{key}
```

例如：
- `pages.workRecordEntry.fields.personnel` - 人员字段标签
- `pages.workRecordEntry.messages.selectPersonnel` - 选择人员验证消息
- `pages.workRecordEntry.placeholders.selectPersonnel` - 选择人员占位符

## 📝 语言包结构

### 中文语言包 (`zh-CN.json`)
```json
{
  "pages": {
    "employeeInfoEntry": {
      "title": "入职信息上传",
      "idCardUpload": "上传身份证「人像面」",
      "bankCardUpload": "上传银行卡「卡号面」"
    },
    "workRecordEntry": {
      "title": "作业记录录入",
      "fields": {
        "personnel": "人员",
        "workType": "工种"
      },
      "messages": {
        "selectPersonnel": "请选择人员"
      }
    }
  }
}
```

### 英文语言包 (`en-US.json`)
```json
{
  "pages": {
    "employeeInfoEntry": {
      "title": "Employee Information Upload",
      "idCardUpload": "Upload ID Card (Photo Side)",
      "bankCardUpload": "Upload Bank Card (Number Side)"
    },
    "workRecordEntry": {
      "title": "Work Record Entry",
      "fields": {
        "personnel": "Personnel",
        "workType": "Work Type"
      },
      "messages": {
        "selectPersonnel": "Please select personnel"
      }
    }
  }
}
```

## ✅ 完成状态

- [x] 所有页面文本已国际化
- [x] 表单验证消息已国际化
- [x] 占位符文本已国际化
- [x] 错误提示已国际化
- [x] 成功提示已国际化
- [x] 按钮文本已国际化
- [x] 页面标题已国际化
- [x] TypeScript 类型安全
- [x] 无 Lint 错误

## 🚀 使用方式

1. **语言切换**：通过 `useI18n` Hook 的 `setLanguage` 方法
2. **翻译文本**：使用 `t('translation.key')` 函数
3. **动态内容**：支持参数插值和条件渲染

## 📚 相关文档

- [国际化使用指南](../i18n/README.md)
- [语言包配置](../locales/index.ts)
- [国际化 Hook](../hooks/useI18n.ts)
