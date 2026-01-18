# OpenCode MCP 集成指南

本文档介绍如何将 Electron Headless Browser 的 MCP (Model Context Protocol) 功能集成到 OpenCode 编辑器中。

## 概述

我们的 MCP 实现提供了完整的浏览器自动化工具集，支持：
- 🔍 多账户隔离的浏览器窗口管理
- 🖱️ Playwright 风格的输入自动化
- 📸 截图和页面监控
- 🔧 JavaScript 代码执行
- 🌐 网络请求监控

## 集成步骤

### 1. 确保依赖已安装

```bash
# 安装 MCP SDK
cd app
npm install @modelcontextprotocol/sdk zod

# 全局安装 Electron
npm install -g electron
```

### 2. 配置 OpenCode

将 `mcp-config.json` 文件放置在你的项目根目录或 OpenCode 配置目录中：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "electron-headless-ptools": {
      "type": "local",
      "command": ["node", "opencode-mcp-server.js"],
      "description": "Playwright-style browser automation tools for Electron headless browser with account isolation",
      "capabilities": {
        "tools": {
          "listChanged": true
        }
      },
      "env": {
        "NODE_PATH": "."
      }
    }
  }
}
```

### 3. 启动 Electron 应用

在后台启动 Electron Headless Browser：

```bash
# 启动应用
cd app
npm start &

# 或者使用 PM2 等进程管理器
pm2 start "cd app && npm start" --name electron-headless
```

### 4. 在 OpenCode 中使用

#### 基本用法

1. 打开 OpenCode 编辑器
2. 确保 `mcp-config.json` 在项目根目录
3. 使用 MCP 工具：

```javascript
// 创建新浏览器窗口
await mcp.tools.call('new_page', {
  url: 'https://example.com',
  account_index: 1
});

// 点击页面元素
await mcp.tools.call('click', {
  win_id: 1,
  x: 100,
  y: 200
});

// 填写表单
await mcp.tools.call('fill', {
  win_id: 1,
  selector: '#username',
  value: 'testuser'
});

// 执行 JavaScript
const result = await mcp.tools.call('evaluate_script', {
  win_id: 1,
  script: 'document.title'
});
```

#### 高级用法

```javascript
// 多账户自动化
// 账户1：用户A的操作
await mcp.tools.call('new_page', {
  url: 'https://site1.com',
  account_index: 1
});

// 账户2：用户B的操作
await mcp.tools.call('new_page', {
  url: 'https://site2.com',
  account_index: 2
});

// 列出所有窗口
const windows = await mcp.tools.call('list_pages');

// 截图监控
await mcp.tools.call('take_screenshot', {
  win_id: 1
});

// 网络监控
const requests = await mcp.tools.call('list_network_requests', {
  win_id: 1
});
```

## 可用工具

### 导航工具

| 工具 | 描述 | 参数 |
|------|------|------|
| `new_page` | 创建新浏览器窗口 | `url`, `account_index` |
| `close_page` | 关闭浏览器窗口 | `win_id`, `account_index` |
| `navigate_page` | 导航到指定URL | `win_id`, `url`, `account_index` |
| `list_pages` | 列出所有活跃窗口 | 无 |

### 输入自动化工具

| 工具 | 描述 | 参数 |
|------|------|------|
| `click` | 点击指定坐标 | `win_id`, `x`, `y`, `account_index` |
| `fill` | 填写表单字段 | `win_id`, `selector`, `value`, `account_index` |
| `press_key` | 按下键盘按键 | `win_id`, `key`, `account_index` |

### 调试工具

| 工具 | 描述 | 参数 |
|------|------|------|
| `evaluate_script` | 执行JavaScript代码 | `win_id`, `script`, `account_index` |
| `take_screenshot` | 截取窗口截图 | `win_id`, `account_index` |

### 网络监控工具

| 工具 | 描述 | 参数 |
|------|------|------|
| `get_network_request` | 获取网络请求详情 | `win_id`, `index`, `account_index` |
| `list_network_requests` | 列出所有网络请求 | `win_id`, `account_index` |

### 账户管理工具

| 工具 | 描述 | 参数 |
|------|------|------|
| `switch_account` | 切换账户上下文 | `account_index` |
| `get_account_info` | 获取账户信息 | `win_id` |

## 账户隔离说明

### 账户概念
- **账户索引**: 0, 1, 2, ... 用于区分不同的浏览器会话
- **沙盒隔离**: 不同账户的窗口完全隔离，不共享数据
- **资源共享**: 同账户窗口在相同域名下共享 cookies 和缓存

### 使用建议
1. 为不同用户或测试场景使用不同的账户
2. 在自动化任务开始时创建专用账户
3. 使用账户隔离避免会话间的干扰
4. 定期清理不需要的账户和窗口

## 故障排除

### 常见问题

#### 1. MCP 服务器连接失败
```
错误: MCP server not responding
```

**解决方案:**
```bash
# 检查 Electron 应用是否运行
curl http://127.0.0.1:3456/rpc -d '{"method": "ping"}'

# 重启 MCP 服务器
# 在 OpenCode 中重新加载 MCP 配置
```

#### 2. 工具调用失败
```
错误: Tool execution failed
```

**解决方案:**
- 验证 `win_id` 是否有效（使用 `list_pages` 检查）
- 确认账户权限设置
- 检查 JavaScript 代码语法

#### 3. 截图功能不可用
```
错误: Screenshot failed
```

**解决方案:**
- 确保窗口可见且已加载完成
- 检查磁盘权限和存储空间
- 验证窗口 ID 正确

### 调试技巧

#### 查看 MCP 日志
```bash
# 在终端中手动启动 MCP 服务器查看日志
node opencode-mcp-server.js

# 检查输出中的错误信息
```

#### 测试工具功能
```javascript
// 在 OpenCode 中测试基本功能
const result = await mcp.tools.call('list_pages');
console.log('Available windows:', result);
```

#### 重置 MCP 连接
```javascript
// 在 OpenCode 中
// 1. 关闭所有相关终端
// 2. 重启 Electron 应用
// 3. 重新加载 OpenCode MCP 配置
```

## 性能优化

### 资源管理
- 及时关闭不需要的浏览器窗口
- 使用账户隔离避免资源冲突
- 合理设置页面加载超时时间

### 并发控制
- 限制同时运行的窗口数量
- 实现请求队列机制
- 使用连接池管理资源

### 监控建议
```javascript
// 定期检查系统状态
const systemInfo = await mcp.tools.call('evaluate_script', {
  win_id: 1,
  script: `
    ({
      url: window.location.href,
      title: document.title,
      readyState: document.readyState,
      userAgent: navigator.userAgent
    })
  `
});
```

## 扩展开发

### 添加新工具
```javascript
// 在 opencode-mcp-server.js 中添加
this.server.tool('custom_tool', 'Custom tool description', {
  param1: z.string().describe('Parameter description')
}, async ({ param1 }) => {
  // 实现逻辑
  return {
    content: [{ type: 'text', text: `Result: ${param1}` }]
  };
});
```

### 自定义配置
```json
{
  "mcp": {
    "electron-headless-ptools": {
      "type": "local",
      "command": ["node", "opencode-mcp-server.js"],
      "env": {
        "CUSTOM_CONFIG": "value",
        "DEBUG": "true"
      },
      "timeout": 30000
    }
  }
}
```

## 技术支持

如果遇到问题：

1. 查看[故障排除](#故障排除)章节
2. 检查 Electron 应用和 MCP 服务器的日志
3. 验证网络连接和端口配置
4. 提交问题时请包含：
   - OpenCode 版本
   - Electron 版本
   - 完整的错误信息
   - 重现步骤

---

🎉 现在你已经成功将 Electron Headless Browser 集成到 OpenCode 中！享受强大的浏览器自动化功能吧。