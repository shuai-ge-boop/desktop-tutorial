const { test, expect } = require('@playwright/test');

test.describe('Vue Admin System', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题
    await expect(page).toHaveTitle(/Vue3 Admin System/);
    
    // 检查登录页面元素
    await expect(page.locator('h1')).toContainText('欢迎登录');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate to dashboard after login', async ({ page }) => {
    await page.goto('/');
    
    // 填写登录表单
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    
    // 点击登录按钮
    await page.click('button[type="submit"]');
    
    // 等待跳转到dashboard
    await page.waitForURL('**/dashboard');
    
    // 检查dashboard页面内容
    await expect(page.locator('h1')).toContainText('系统首页');
    await expect(page.locator('.stats-row')).toBeVisible();
  });

  test('should display ECharts in dashboard', async ({ page }) => {
    // 先登录
    await page.goto('/');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // 等待跳转到dashboard
    await page.waitForURL('**/dashboard');
    
    // 检查ECharts图表是否存在
    await expect(page.locator('.echarts-container')).toBeVisible();
    
    // 检查图表标题
    await expect(page.locator('h3')).toContainText('用户增长趋势');
    
    // 等待图表加载完成（检查canvas元素）
    await expect(page.locator('.echarts-container canvas')).toBeVisible();
  });

  test('should test stagewise toolbar in development', async ({ page }) => {
    await page.goto('/');
    
    // 在开发环境中，stagewise工具栏应该存在
    // 注意：这个测试只在开发环境中有效
    const toolbarExists = await page.locator('[data-testid="stagewise-toolbar"]').count();
    
    // 在开发环境中，工具栏应该存在
    if (process.env.NODE_ENV === 'development') {
      expect(toolbarExists).toBeGreaterThan(0);
    }
  });

  test('should navigate between pages', async ({ page }) => {
    // 先登录
    await page.goto('/');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard');
    
    // 测试导航到用户管理页面
    await page.click('text=用户管理');
    await page.waitForURL('**/user');
    await expect(page.locator('h1')).toContainText('用户管理');
    
    // 测试导航到系统管理页面
    await page.click('text=系统管理');
    await page.waitForURL('**/system');
    await expect(page.locator('h1')).toContainText('系统管理');
  });
}); 