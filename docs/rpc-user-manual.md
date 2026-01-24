# RPC User Manual

## Overview

The Electron MCP application provides a comprehensive JSON-RPC API for browser automation, window management, and system integration. This manual covers all available RPC methods, their parameters, response formats, and usage examples with cURL.

## Base URL

All RPC requests are sent to:
```
http://127.0.0.1:3456/rpc
```

## Request Format

All requests must follow the JSON-RPC 2.0 specification:

```json
{
  "method": "method_name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  },
  "id": 1
}
```

## Response Format

Successful responses:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    // Method-specific result data
  }
}
```

Error responses:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

## Authentication

Some methods support token-based authentication. Include the token in headers:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -H "token: your-auth-token" \
  -d '{"method": "method_name", "params": {}, "id": 1}'
```

## Methods Reference

### System Methods

#### ping
Health check method to verify server is responding.

**Parameters:** `{}`

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "id": 1}'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "pong"
}
```

#### info
Get server information and status.

**Parameters:** `{}`

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "info", "params": {}, "id": 2}'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "version": "1.0.0",
    "uptime": 3600,
    "platform": "darwin"
  }
}
```

#### methods
Get list of all available RPC methods.

**Parameters:** `{}`

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "methods", "params": {}, "id": 3}'
```

#### openTerminal
Open a terminal and execute commands.

**Parameters:**
```json
{
  "command": "echo 'Hello World'",
  "showWin": true
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "openTerminal", "params": {"command": "ls -la", "showWin": false}, "id": 4}'
```

### Window Management Methods

#### openWindow
Create a new browser window.

**Parameters:**
```json
{
  "url": "https://example.com",
  "account_index": 0,
  "options": {
    "width": 1200,
    "height": 800,
    "show": true
  },
  "others": {
    "additional": "options"
  }
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "openWindow", "params": {"url": "https://example.com", "account_index": 0}, "id": 5}'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "id": 1,
    "wcId": 1
  }
}
```

#### getWindows
Get list of all windows across all accounts.

**Parameters:** `{}`

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindows", "params": {}, "id": 6}'
```

#### closeWindow
Close a specific window.

**Parameters:**
```json
{
  "win_id": 1
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "closeWindow", "params": {"win_id": 1}, "id": 7}'
```

#### showWindow
Show a hidden window.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### hideWindow
Hide a window.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### reload
Reload a window's content.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### getBounds
Get window position and size.

**Parameters:**
```json
{
  "win_id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "result": {
    "x": 100,
    "y": 200,
    "width": 1200,
    "height": 800
  }
}
```

#### setBounds
Set window position and size.

**Parameters:**
```json
{
  "win_id": 1,
  "bounds": {
    "x": 100,
    "y": 200,
    "width": 800,
    "height": 600
  }
}
```

#### getWindowSize
Get window dimensions.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### setWindowSize
Set window dimensions.

**Parameters:**
```json
{
  "win_id": 1,
  "width": 800,
  "height": 600
}
```

#### setWindowWidth
Set window width only.

**Parameters:**
```json
{
  "win_id": 1,
  "width": 800
}
```

#### setWindowPosition
Set window position.

**Parameters:**
```json
{
  "win_id": 1,
  "x": 100,
  "y": 200
}
```

### Input Event Methods

#### sendInputEvent
Send input events to a window.

**Parameters:**
```json
{
  "win_id": 1,
  "inputEvent": {
    "type": "click",
    "x": 100,
    "y": 200,
    "button": "left",
    "clickCount": 1,
    "keyCode": "Enter",
    "modifiers": ["Ctrl", "Shift"]
  },
  "account_index": 0
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendInputEvent", "params": {"win_id": 1, "inputEvent": {"type": "click", "x": 100, "y": 200}}, "id": 9}'
```

#### sendElectronClick
Simulate mouse click using Electron's native input.

**Parameters:**
```json
{
  "win_id": 1,
  "x": 100,
  "y": 200,
  "button": "left",
  "clickCount": 1
}
```

#### sendElectronPressEnter
Send Enter key press.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### writeClipboard
Write text to system clipboard.

**Parameters:**
```json
{
  "text": "Hello World"
}
```

### Screenshot Methods

#### captureScreenshot
Capture screenshot of a window.

**Parameters:**
```json
{
  "win_id": 1,
  "format": "png",
  "scaleFactor": 2.0,
  "quality": 90,
  "account_index": 0
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "format": "png",
    "size": 1024,
    "width": 1600,
    "height": 1200
  }
}
```

#### saveScreenshot
Save screenshot to file.

**Parameters:**
```json
{
  "win_id": 1,
  "filePath": "/path/to/screenshot.png",
  "format": "png",
  "scaleFactor": 2.0,
  "quality": 90
}
```

#### getScreenshotInfo
Get screenshot metadata.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### captureSystemScreenshot
Capture entire system screen.

**Parameters:**
```json
{
  "format": "png",
  "scaleFactor": 1.0,
  "quality": 80
}
```

#### saveSystemScreenshot
Save system screenshot to file.

**Parameters:**
```json
{
  "filePath": "/path/to/system.png",
  "format": "jpeg",
  "scaleFactor": 1.0,
  "quality": 80
}
```

#### getDisplayScreenSize
Get primary display dimensions.

**Parameters:** `{}`

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "result": {
    "width": 1920,
    "height": 1080
  }
}
```

### Page Operations Methods

#### loadURL
Load URL in a window.

**Parameters:**
```json
{
  "url": "https://example.com",
  "win_id": 1,
  "account_index": 0
}
```

#### getURL
Get current URL of a window.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### getTitle
Get page title.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### executeJavaScript
Execute JavaScript code in window context.

**Parameters:**
```json
{
  "code": "document.title",
  "win_id": 1,
  "account_index": 0
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "result": "Example Page Title"
}
```

#### openDevTools
Open developer tools for a window.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### setUserAgent
Set custom user agent.

**Parameters:**
```json
{
  "win_id": 1,
  "userAgent": "Custom Browser 1.0",
  "account_index": 0
}
```

#### getWindowState
Get complete window state.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

### Cookie Management Methods

#### importCookies
Import cookies to a window.

**Parameters:**
```json
{
  "win_id": 1,
  "cookies": [
    {
      "name": "session",
      "value": "abc123",
      "domain": "example.com",
      "path": "/",
      "secure": true,
      "httpOnly": false
    }
  ],
  "account_index": 0
}
```

#### exportCookies
Export cookies from a window.

**Parameters:**
```json
{
  "win_id": 1,
  "options": {
    "session": true,
    "persistent": true
  },
  "account_index": 0
}
```

### Account Management Methods

#### switchAccount
Switch to different account context.

**Parameters:**
```json
{
  "account_index": 1
}
```

#### getAccountInfo
Get account information for a window.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### getAccountWindows
Get all windows for an account.

**Parameters:**
```json
{
  "account_index": 0
}
```

### Network Methods

#### getRequests
Get network requests for a window.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### clearRequests
Clear network request history.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

### Media Methods

#### downloadMedia
Download media files with optional subtitle generation.

**Parameters:**
```json
{
  "mediaUrl": "https://example.com/video.mp4",
  "genSubtitles": true,
  "basePath": "/downloads",
  "id": "video1",
  "win_id": 1,
  "account_index": 0
}
```

#### getSubTitles
Get subtitles for media file.

**Parameters:**
```json
{
  "mediaPath": "/path/to/video.mp4"
}
```

## Error Codes

Common JSON-RPC error codes:

- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error
- `-32000`: Server error

## Account Isolation

When using `account_index` parameter, the system enforces strict isolation:
- Each account has separate cookie stores
- Windows cannot be accessed across accounts without proper switching
- Input events require matching account context

## Best Practices

1. **Always include unique IDs** in requests for request/response matching
2. **Validate parameters** before sending to avoid errors
3. **Handle account context** when working with multiple accounts
4. **Use authentication tokens** for secure operations
5. **Clean up resources** by closing unused windows
6. **Check window validity** before performing operations

## WebSocket Support

For real-time communication, the server also supports WebSocket connections on the same port.

## Rate Limiting

The server implements rate limiting. Excessive requests may result in HTTP 429 responses.

## Troubleshooting

### Common Issues

1. **Window Not Found**
   ```bash
   curl -X POST http://127.0.0.1:3456/rpc \
     -H "Content-Type: application/json" \
     -d '{"method": "getURL", "params": {"win_id": 999}, "id": 1}'
   ```

2. **Invalid Parameters**
   - Always check parameter names and types
   - Use the exact field names as shown in examples

3. **Account Isolation Errors**
   - Ensure `account_index` matches the window's account
   - Switch accounts before accessing windows from different contexts

4. **Network Issues**
   - Verify server is running on port 3456
   - Check firewall settings if connecting from remote host

### Debug Mode

Enable debug logging for verbose output:
```bash
NODE_ENV=development npm start
```

### Health Check

Always verify server status before making requests:
```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "id": 1}'
```

## Integration Examples

### Complete Workflow Example

```bash
# 1. Check server status
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "id": 1}'

# 2. Create window in account 0
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "openWindow", "params": {"url": "https://example.com", "account_index": 0}, "id": 2}'

# 3. Load page and get title
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "loadURL", "params": {"win_id": 1, "url": "https://example.com/login"}, "id": 3}'

curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getTitle", "params": {"win_id": 1}, "id": 4}'

# 4. Take screenshot
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "captureScreenshot", "params": {"win_id": 1, "format": "png"}, "id": 5}'

# 5. Switch to account 1
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "switchAccount", "params": {"account_index": 1}, "id": 6}'

# 6. Clean up
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "closeWindow", "params": {"win_id": 1}, "id": 7}'
```

This manual covers the complete RPC API surface and provides practical examples for all common use cases.