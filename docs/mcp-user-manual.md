# MCP User Manual

## Overview

The Electron MCP application implements the Model Context Protocol (MCP) to provide AI agents with browser automation capabilities through a standardized tool interface. MCP enables seamless integration between AI assistants and browser automation, allowing for sophisticated web interaction and testing workflows.

## Connection

### Server-Sent Events (SSE)

Connect to the MCP server using Server-Sent Events:

```bash
curl -N http://127.0.0.1:3456/messages
```

The server will establish an SSE connection and send tool lists, notifications, and responses over this persistent connection.

### MCP Protocol

The implementation follows the MCP specification for:
- **Tool Discovery**: `tools/list` method
- **Tool Execution**: `tools/call` method  
- **Resource Management**: Resource-based operations
- **Error Handling**: Structured error responses
- **Authentication**: Session-based authentication

## Tool Categories

### Window Management Tools

#### open_window
Create a new browser window with optional account isolation.

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

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Opened window with ID: 1"
    }
  ],
  "isError": false
}
```

#### get_windows
Retrieve all windows across all accounts.

**Parameters:** `{}`

#### close_window
Close a specific window.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### show_window / hide_window
Show or hide windows without closing them.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### reload_window
Reload window content.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### get_bounds / set_bounds
Get or set window position and dimensions.

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

#### get_window_size / set_window_size
Get or set window dimensions.

**Parameters:**
```json
{
  "win_id": 1,
  "width": 800,
  "height": 600
}
```

### Input Simulation Tools

#### send_input_event
Send sophisticated input events to windows.

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

#### send_electron_click
Native Electron click simulation.

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

#### send_electron_press_enter
Send Enter key press.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### write_clipboard
Write text to system clipboard.

**Parameters:**
```json
{
  "text": "Hello World"
}
```

#### show_float_div / hide_float_div
Show/hide floating overlay divs for annotation.

**Parameters:**
```json
{
  "win_id": 1,
  "options": {
    "content": "Annotation text",
    "position": "top-right"
  }
}
```

#### send_electron_ctl_v
Paste from clipboard.

**Parameters:**
```json
{
  "win_id": 1
}
```

### Screenshot Tools

#### capture_screenshot
Capture window screenshots with various formats.

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
  "content": [
    {
      "type": "text",
      "text": "Captured screenshot (png, 2048 bytes)"
    }
  ],
  "isError": false
}
```

#### save_screenshot
Save screenshots directly to files.

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

#### capture_system_screenshot / save_system_screenshot
Capture entire system screen.

**Parameters:**
```json
{
  "format": "png",
  "scaleFactor": 1.0,
  "quality": 80
}
```

#### get_screenshot_info
Get screenshot metadata without capturing.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### get_display_screen_size
Get primary display dimensions.

**Parameters:** `{}`

### Cookie Management Tools

#### import_cookies
Import cookies for session management.

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

#### export_cookies
Export cookies from browser context.

**Parameters:**
```json
{
  "win_id": 1,
  "options": {
    "session": true,
    "persistent": true
  }
}
```

### Page Operation Tools

#### load_url
Navigate to URLs.

**Parameters:**
```json
{
  "url": "https://example.com",
  "win_id": 1,
  "account_index": 0
}
```

#### get_url / get_title
Get current page information.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### execute_javascript
Execute JavaScript in browser context.

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
  "content": [
    {
      "type": "text",
      "text": "Example Page Title"
    }
  ],
  "isError": false
}
```

#### open_devtools
Open developer tools for debugging.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

#### set_user_agent
Set custom user agent strings.

**Parameters:**
```json
{
  "win_id": 1,
  "userAgent": "Custom Bot 1.0",
  "account_index": 0
}
```

#### get_window_state
Get comprehensive window state information.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

### Account Management Tools

#### switch_account
Switch between isolated browser contexts.

**Parameters:**
```json
{
  "account_index": 1
}
```

#### get_account_info
Get account information for windows.

**Parameters:**
```json
{
  "win_id": 1
}
```

#### get_account_windows
List all windows for a specific account.

**Parameters:**
```json
{
  "account_index": 0
}
```

### Network Monitoring Tools

#### get_requests
Monitor and retrieve network request history.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "[{\"url\":\"https://api.example.com/data\",\"method\":\"GET\",\"status\":200},{\"url\":\"https://example.com/style.css\",\"method\":\"GET\",\"status\":200}]"
    }
  ],
  "isError": false
}
```

#### clear_requests
Clear network request history.

**Parameters:**
```json
{
  "win_id": 1,
  "account_index": 0
}
```

### Media Tools

#### download_media
Download media with subtitle generation.

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

#### get_subtitles
Extract subtitles from media files.

**Parameters:**
```json
{
  "mediaPath": "/path/to/video.mp4"
}
```

### System Tools

#### ping
Health check for the MCP server.

**Parameters:** `{}`

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "pong"
    }
  ],
  "isError": false
}
```

#### info
Get server information.

**Parameters:** `{}`

#### get_methods
List all available MCP tools.

**Parameters:** `{}`

#### open_terminal
Open terminal with system command execution.

**Parameters:**
```json
{
  "command": "ls -la",
  "showWin": false
}
```

## Account Isolation Model

MCP provides robust account-based isolation:

### Architecture
```
Account 0: Window 1, Window 2, Window 3
Account 1: Window 4, Window 5
Account 2: Window 6, Window 7
```

### Security Benefits
- **Cookie Isolation**: Each account has separate cookie stores
- **Session Separation**: Browser contexts don't interfere
- **Resource Management**: Windows assigned to specific accounts
- **Access Control**: Operations restricted to account owners

### Validation
All window operations validate account context:
```json
{
  "win_id": 1,
  "account_index": 0  // Must match window's assigned account
}
```

Invalid access results:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Window 1 does not belong to account 1"
    }
  ],
  "isError": true
}
```

## Integration Examples

### Web Automation Workflow

```json
// 1. Discover available tools
{
  "method": "tools/list",
  "params": {},
  "id": 1
}

// 2. Create isolated browser session
{
  "method": "tools/call",
  "params": {
    "name": "open_window",
    "arguments": {
      "url": "https://example.com/login",
      "account_index": 0
    }
  },
  "id": 2
}

// 3. Navigate and interact
{
  "method": "tools/call",
  "params": {
    "name": "load_url",
    "arguments": {
      "url": "https://example.com/dashboard",
      "win_id": 1,
      "account_index": 0
    }
  },
  "id": 3
}

// 4. Execute authentication
{
  "method": "tools/call",
  "params": {
    "name": "send_electron_click",
    "arguments": {
      "win_id": 1,
      "x": 200,
      "y": 100,
      "button": "left",
      "account_index": 0
    }
  },
  "id": 4
}

// 5. Take verification screenshot
{
  "method": "tools/call",
  "params": {
    "name": "capture_screenshot",
    "arguments": {
      "win_id": 1,
      "format": "png",
      "account_index": 0
    }
  },
  "id": 5
}
```

### Multi-Account Testing

```json
// Switch to account 1
{
  "method": "tools/call",
  "params": {
    "name": "switch_account",
    "arguments": {
      "account_index": 1
    }
  },
  "id": 6
}

// Create parallel session
{
  "method": "tools/call",
  "params": {
    "name": "open_window",
    "arguments": {
      "url": "https://example.com/admin",
      "account_index": 1
    }
  },
  "id": 7
}

// Isolated operations
{
  "method": "tools/call",
  "params": {
    "name": "import_cookies",
    "arguments": {
      "win_id": 2,
      "cookies": [{"name": "admin", "value": "token123"}],
      "account_index": 1
    }
  },
  "id": 8
}
```

## Error Handling

### Standard MCP Error Format
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Window not found"
    }
  ],
  "isError": true
}
```

### Common Error Types
- **Invalid Parameters**: Tool arguments don't match schema
- **Window Not Found**: Specified window ID doesn't exist
- **Account Isolation**: Account context mismatch
- **Permission Denied**: Operation not allowed for account
- **Network Errors**: Connection or communication failures
- **Resource Limits**: Too many windows or resource exhaustion

### Error Recovery

1. **Retry Logic**: Implement exponential backoff for transient errors
2. **Graceful Degradation**: Fall back to alternative operations
3. **State Validation**: Check window and account states before operations
4. **Cleanup**: Properly close and clean up resources on errors

## Performance Considerations

### Resource Management
- **Window Limits**: Recommended maximum of 20 concurrent windows
- **Screenshot Frequency**: Avoid high-frequency screenshots
- **Memory Usage**: Monitor and manage large session data
- **Cleanup**: Close unused windows to free resources

### Optimization Strategies
- **Parallel Operations**: Use multiple windows for concurrent tasks
- **Session Reuse**: Maintain persistent browser sessions
- **Smart Loading**: Optimize page loading with caching
- **Batch Operations**: Group related operations together

## Advanced Usage

### Custom Tool Workflows
Create custom tool sequences for complex tasks:

```json
// E-commerce checkout workflow
[
  {"name": "open_window", "arguments": {"url": "https://shop.com/cart"}},
  {"name": "capture_screenshot", "arguments": {"win_id": "previous"}},
  {"name": "load_url", "arguments": {"url": "https://shop.com/checkout"}},
  {"name": "send_electron_click", "arguments": {"x": 300, "y": 100, "win_id": "current"}},
  {"name": "capture_screenshot", "arguments": {"win_id": "current"}},
  {"name": "save_screenshot", "arguments": {"filePath": "/checkout/step1.png"}}
]
```

### Testing Automation
```json
// Multi-browser testing setup
[
  {"name": "switch_account", "arguments": {"account_index": 0}},
  {"name": "open_window", "arguments": {"url": "https://app.dev/login"}},
  {"name": "switch_account", "arguments": {"account_index": 1}},
  {"name": "open_window", "arguments": {"url": "https://app.staging/login"}},
  {"name": "switch_account", "arguments": {"account_index": 2}},
  {"name": "open_window", "arguments": {"url": "https://app.prod/login"}}
]
```

## Best Practices

### Connection Management
1. **Persistent SSE Connections**: Keep connection alive for real-time updates
2. **Session Affinity**: Use consistent sessions for related operations
3. **Reconnection Logic**: Handle connection drops gracefully
4. **Connection Pooling**: Use multiple connections for parallel workflows

### Tool Usage
1. **Parameter Validation**: Validate arguments before tool calls
2. **Error Handling**: Check tool responses for errors
3. **Resource Cleanup**: Close windows when workflows complete
4. **State Management**: Track window and account states

### Security
1. **Account Isolation**: Always respect account boundaries
2. **Input Sanitization**: Validate user inputs before execution
3. **Cookie Security**: Handle sensitive data appropriately
4. **Content Security**: Be cautious with file system operations

## WebSocket Integration

For real-time bidirectional communication, connect via WebSocket:

```javascript
const ws = new WebSocket('ws://127.0.0.1:3456');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle MCP messages
};
```

## Troubleshooting

### Connection Issues
```bash
# Test SSE connection
curl -N http://127.0.0.1:3456/messages

# Check tool availability
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list", "params": {}, "id": 1}'
```

### Common Problems
1. **Window Creation Failures**: Check URL validity and account context
2. **Input Event Issues**: Verify coordinates and element availability
3. **Screenshot Failures**: Check window visibility and permissions
4. **Account Switching**: Ensure all operations completed for current account

### Debug Information
Enable verbose logging:
```bash
NODE_ENV=debug npm start
```

Monitor MCP logs for detailed operation information and error traces.

This manual provides comprehensive guidance for integrating with the MCP implementation and building sophisticated browser automation workflows.