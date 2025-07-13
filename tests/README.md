# Playwright 端到端测试

本项目使用 Playwright 进行端到端测试。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
# 无头模式运行所有测试
npm run test

# 有头模式运行测试（可以看到浏览器界面）
npm run test:headed

# 交互式UI模式运行测试
npm run test:ui

# 查看测试报告
npm run test:report
```

## 🧪 测试内容

### 当前测试用例

1. **基础页面加载测试**
   - 检查首页是否正确加载
   - 验证登录表单元素是否存在

2. **用户登录流程测试**
   - 测试用户登录功能
   - 验证登录后跳转到仪表板

3. **ECharts图表测试**
   - 验证图表组件是否正确渲染
   - 检查图表Canvas元素是否存在

4. **页面导航测试**
   - 测试各个页面之间的导航
   - 验证路由功能正常

5. **Stagewise工具栏测试**
   - 在开发环境中测试stagewise工具栏

## 📁 测试文件结构

```
tests/
├── example.spec.js     # 主要测试用例
└── README.md          # 这个文件
```

## 🔧 配置说明

### 浏览器支持
- **Chromium** (Chrome)
- **Firefox** 
- **WebKit** (Safari)

### 测试环境
- **开发服务器**: http://localhost:3000
- **基础URL**: 自动配置为开发服务器地址
- **并行测试**: 启用，提高测试速度

### 配置文件
- `playwright.config.js` - 主要配置文件
- 包含浏览器配置、测试设置、开发服务器配置等

## 📝 编写测试

### 基本测试结构
```javascript
const { test, expect } = require('@playwright/test');

test.describe('功能模块', () => {
  test('测试用例描述', async ({ page }) => {
    // 导航到页面
    await page.goto('/');
    
    // 执行操作
    await page.click('button');
    
    // 断言检查
    await expect(page.locator('h1')).toContainText('预期文本');
  });
});
```

### 常用操作
```javascript
// 页面导航
await page.goto('/dashboard');

// 元素交互
await page.click('button');
await page.fill('input', 'value');
await page.selectOption('select', 'option');

// 等待
await page.waitForURL('**/dashboard');
await page.waitForSelector('.element');

// 断言
await expect(page.locator('h1')).toBeVisible();
await expect(page).toHaveTitle(/Title/);
```

## 🐛 调试测试

### 调试模式
```bash
# 以调试模式运行特定测试
npx playwright test --debug tests/example.spec.js
```

### 查看测试痕迹
```bash
# 运行测试后查看痕迹
npx playwright show-trace test-results/trace.zip
```

### 截图和视频
测试失败时会自动生成截图和视频，位于 `test-results/` 目录。

## 📊 测试报告

测试完成后会生成HTML报告，包含：
- 测试结果概览
- 失败用例详情
- 测试截图和视频
- 性能指标

运行 `npm run test:report` 查看详细报告。

## 🔄 持续集成

配置文件已经准备好用于CI环境：
- 自动重试失败的测试
- 在CI中使用单个工作进程
- 自动启动开发服务器

## 💡 最佳实践

1. **使用有意义的测试描述**
2. **保持测试独立性**
3. **使用页面对象模型**
4. **合理使用等待**
5. **定期更新测试用例**

## 📚 相关资源

- [Playwright官方文档](https://playwright.dev/)
- [测试最佳实践](https://playwright.dev/docs/best-practices)
- [API参考](https://playwright.dev/docs/api/class-test) 