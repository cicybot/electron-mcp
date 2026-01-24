# MCP User Manual

## Overview

The Electron MCP application provides a comprehensive Model Context Protocol (MCP) interface for AI agents to control browser automation and management. This manual covers how to use MCP tools and integrate with AI systems.

## MCP Protocol Basics

MCP (Model Context Protocol) is a standardized protocol for AI agents to interact with external tools and services. The Electron MCP server exposes browser automation capabilities through MCP tools.

### Connection Details

- **Server URL**: `http://127.0.0.1:3456`
- **Protocol**: HTTP/HTTPS with JSON-RPC over MCP
- **Transport**: HTTP/HTTPS with JSON-RPC over MCP
- **Endpoint**: `/messages` for MCP protocol messages

### MCP Message Format

```json
{
  "jsonrpc": "2.0",
  "id": "unique_message_id",
  "method": "tools/call|tools/list|resources/list",
  "params": {
    // Method-specific parameters
  }
}
```

## Available MCP Tools

### Window Management Tools

#### open_window

Create a new browser window with specified URL and options.

**Parameters**:

```json
{
  "url": "https://example.com",
  "account_index": 0,
  "options": {
    "width": 1200,
    "height": 800,
    "x": 100,
    "y": 100
  }
}
```

**Returns**:

```json
{
  "id": 1,
  "url": "https://example.com",
  "bounds": {
    "x": 100,
    "y": 100,
    "width": 1200,
    "height": 800
  }
}
```

#### get_windows

Retrieve list of all open browser windows.

**Parameters**: `{}`

**Returns**:

```json
{
  "windows": [
    {
      "id": 1,
      "url": "https://example.com",
      "title": "Example Domain",
      "account_index": 0,
      "bounds": {
        "x": 100,
        "y": 100,
        "width": 1200,
        "height": 800
      }
    }
  ]
}
```

#### close_window

Close a specific browser window.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "success": true,
  "message": "Window closed successfully"
}
```

#### show_window / hide_window

Show or hide a browser window.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "success": true,
  "visible": true
}
```

#### get_window_bounds

Get window position and dimensions.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "x": 100,
  "y": 100,
  "width": 1200,
  "height": 800
}
```

#### set_window_bounds

Set window position and dimensions.

**Parameters**:

```json
{
  "win_id": 1,
  "bounds": {
    "x": 200,
    "y": 200,
    "width": 1024,
    "height": 768
  }
}
```

**Returns**:

```json
{
  "success": true,
  "bounds": {
    "x": 200,
    "y": 200,
    "width": 1024,
    "height": 768
  }
}
```

### Navigation Tools

#### load_url

Navigate to a specified URL in a window.

**Parameters**:

```json
{
  "win_id": 1,
  "url": "https://google.com"
}
```

**Returns**:

```json
{
  "success": true,
  "url": "https://google.com"
}
```

#### get_url

Get current URL of a window.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "url": "https://google.com"
}
```

#### get_title

Get page title of a window.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "title": "Google"
}
```

#### reload

Reload the current page.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "success": true,
  "message": "Page reloaded"
}
```

### JavaScript Execution Tools

#### execute_javascript

Execute JavaScript code in a window context.

**Parameters**:

```json
{
  "win_id": 1,
  "code": "document.title"
}
```

**Returns**:

```json
{
  "result": "Google",
  "type": "string"
}
```

#### run_code

Execute JavaScript code with simplified interface.

**Parameters**:

```json
{
  "win_id": 1,
  "code": "2 + 2"
}
```

**Returns**:

```json
{
  "result": 4,
  "type": "number"
}
```

### Input Simulation Tools

#### send_input_event

Send generic input events to a window.

**Parameters**:

```json
{
  "win_id": 1,
  "input_event": {
    "type": "mouseDown",
    "x": 100,
    "y": 100,
    "button": "left",
    "clickCount": 1
  }
}
```

**Returns**:

```json
{
  "success": true,
  "event": "mouseDown"
}
```

#### send_electron_click

Simulate mouse click at specified coordinates.

**Parameters**:

```json
{
  "win_id": 1,
  "x": 100,
  "y": 100,
  "button": "left",
  "clickCount": 1
}
```

**Returns**:

```json
{
  "success": true,
  "coordinates": {
    "x": 100,
    "y": 100
  }
}
```

#### send_electron_key_press

Send keyboard key press events.

**Parameters**:

```json
{
  "win_id": 1,
  "key": "Enter",
  "modifiers": []
}
```

**Returns**:

```json
{
  "success": true,
  "key": "Enter"
}
```

#### write_clipboard

Write text to system clipboard.

**Parameters**:

```json
{
  "text": "Hello World"
}
```

**Returns**:

```json
{
  "success": true,
  "text": "Hello World"
}
```

### Screenshot Tools

#### capture_screenshot

Capture screenshot of a window.

**Parameters**:

```json
{
  "win_id": 1,
  "format": "png"
}
```

**Returns**:

```json
{
  "format": "png",
  "data": "iVBORw0KGgoAAAANSUhEUgAA...",
  "size": 245760,
  "width": 1200,
  "height": 800
}
```

#### save_screenshot

Save screenshot to file.

**Parameters**:

```json
{
  "win_id": 1,
  "file_path": "/screenshots/window_1.png",
  "format": "png"
}
```

**Returns**:

```json
{
  "success": true,
  "file_path": "/screenshots/window_1.png",
  "size": 245760,
  "format": "png"
}
```

#### capture_system_screenshot

Capture system-wide screenshot.

**Parameters**:

```json
{
  "format": "png"
}
```

**Returns**:

```json
{
  "format": "png",
  "data": "iVBORw0KGgoAAAANSUhEUgAA...",
  "size": 2073600,
  "width": 1920,
  "height": 1080
}
```

### Account Management Tools

#### switch_account

Switch to different account context.

**Parameters**:

```json
{
  "account_index": 1
}
```

**Returns**:

```json
{
  "success": true,
  "account_index": 1,
  "previous_index": 0
}
```

#### get_account_info

Get account information for a window.

**Parameters**:

```json
{
  "win_id": 1
}
```

**Returns**:

```json
{
  "account_index": 0,
  "user_id": "user_123",
  "session_id": "session_456",
  "is_active": true
}
```

#### get_account_windows

Get all windows for a specific account.

**Parameters**:

```json
{
  "account_index": 0
}
```

**Returns**:

```json
{
  "windows": [
    {
      "id": 1,
      "url": "https://example.com",
      "title": "Example Domain"
    }
  ]
}
```

### Cookie Management Tools

#### import_cookies

Import cookies to window session.

**Parameters**:

```json
{
  "win_id": 1,
  "cookies": [
    {
      "name": "session_id",
      "value": "abc123",
      "domain": "example.com",
      "path": "/"
    }
  ]
}
```

**Returns**:

```json
{
  "success": true,
  "imported": 1
}
```

#### export_cookies

Export cookies from window session.

**Parameters**:

```json
{
  "win_id": 1,
  "options": {
    "domain": "example.com"
  }
}
```

**Returns**:

```json
{
  "cookies": [
    {
      "name": "session_id",
      "value": "abc123",
      "domain": "example.com",
      "path": "/",
      "httpOnly": false,
      "secure": true
    }
  ]
}
```

### System Tools

#### ping

Health check for the MCP server.

**Parameters**: `{}`

**Returns**:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

#### get_system_info

Get system and display information.

**Parameters**: `{}`

**Returns**:

```json
{
  "platform": "darwin",
  "arch": "x64",
  "node_version": "v18.17.0",
  "electron_version": "27.0.0",
  "display": {
    "width": 1920,
    "height": 1080
  }
}
```

#### get_methods

Get list of all available MCP tools.

**Parameters**: `{}`

**Returns**:

```json
{
  "tools": [
    "open_window",
    "get_windows",
    "close_window",
    "load_url",
    "execute_javascript",
    "capture_screenshot",
    "send_input_event",
    "switch_account",
    "import_cookies",
    "export_cookies",
    "ping",
    "get_system_info"
  ]
}
```

## MCP Integration Examples

### Python Client Example

```python
import requests
import json
import sseclient

class ElectronMCPClient:
    def __init__(self, base_url="http://127.0.0.1:3456"):
        self.base_url = base_url
        self.rpc_url = f"{base_url}/rpc"
        self.messages_url = f"{base_url}/messages"

    def send_mcp_message(self, method, params=None, message_id=None):
        """Send MCP message to server"""
        if params is None:
            params = {}
        if message_id is None:
            message_id = f"msg_{int(time.time() * 1000)}"

        payload = {
            "jsonrpc": "2.0",
            "id": message_id,
            "method": method,
            "params": params
        }

        response = requests.post(self.rpc_url, json=payload)
        return response.json()

    def list_tools(self):
        """Get list of available MCP tools"""
        return self.send_mcp_message("tools/list")

    def call_tool(self, tool_name, parameters):
        """Call an MCP tool"""
        return self.send_mcp_message("tools/call", {
            "name": tool_name,
            "arguments": parameters
        })

    def open_window(self, url, options=None):
        """Open a new browser window"""
        if options is None:
            options = {}

        return self.call_tool("open_window", {
            "url": url,
            **options
        })

    def execute_javascript(self, win_id, code):
        """Execute JavaScript in a window"""
        return self.call_tool("execute_javascript", {
            "win_id": win_id,
            "code": code
        })

    def capture_screenshot(self, win_id, format="png"):
        """Capture screenshot of a window"""
        return self.call_tool("capture_screenshot", {
            "win_id": win_id,
            "format": format
        })

    def send_click(self, win_id, x, y, button="left"):
        """Send mouse click to window"""
        return self.call_tool("send_electron_click", {
            "win_id": win_id,
            "x": x,
            "y": y,
            "button": button
        })

# Usage example
def example_automation():
    client = ElectronMCPClient()

    # Open a window
    window = client.open_window("https://example.com")
    win_id = window["result"]["id"]
    print(f"Opened window with ID: {win_id}")

    # Get page title
    title = client.execute_javascript(win_id, "document.title")
    print(f"Page title: {title['result']}")

    # Take screenshot
    screenshot = client.capture_screenshot(win_id)
    print(f"Screenshot captured: {screenshot['result']['size']} bytes")

    # Close window
    client.call_tool("close_window", {"win_id": win_id})
    print("Window closed")

if __name__ == "__main__":
    example_automation()
```

### JavaScript/Node.js Client Example

```javascript
const http = require("http");
const EventSource = require("eventsource");

class ElectronMCPClient {
  constructor(baseUrl = "http://127.0.0.1:3456") {
    this.baseUrl = baseUrl;
    this.rpcUrl = `${baseUrl}/rpc`;
    this.messagesUrl = `${baseUrl}/messages`;
    this.messageId = 0;
  }

  sendMcpMessage(method, params = {}) {
    return new Promise((resolve, reject) => {
      const payload = {
        jsonrpc: "2.0",
        id: `msg_${++this.messageId}`,
        method,
        params,
      };

      const data = JSON.stringify(payload);
      const options = {
        hostname: "127.0.0.1",
        port: 3456,
        path: "/rpc",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = http.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }

  async listTools() {
    return await this.sendMcpMessage("tools/list");
  }

  async callTool(toolName, parameters) {
    return await this.sendMcpMessage("tools/call", {
      name: toolName,
      arguments: parameters,
    });
  }

  async openWindow(url, options = {}) {
    return await this.callTool("open_window", { url, ...options });
  }

  async executeJavaScript(winId, code) {
    return await this.callTool("execute_javascript", { win_id: winId, code });
  }

  async captureScreenshot(winId, format = "png") {
    return await this.callTool("capture_screenshot", { win_id: winId, format });
  }

  async sendClick(winId, x, y, button = "left") {
    return await this.callTool("send_electron_click", {
      win_id: winId,
      x,
      y,
      button,
    });
  }
}

// Usage example
async function exampleAutomation() {
  const client = new ElectronMCPClient();

  try {
    // Open a window
    const window = await client.openWindow("https://example.com");
    const winId = window.result.id;
    console.log(`Opened window with ID: ${winId}`);

    // Get page title
    const title = await client.executeJavaScript(winId, "document.title");
    console.log(`Page title: ${title.result}`);

    // Take screenshot
    const screenshot = await client.captureScreenshot(winId);
    console.log(`Screenshot captured: ${screenshot.result.size} bytes`);

    // Close window
    await client.callTool("close_window", { win_id: winId });
    console.log("Window closed");
  } catch (error) {
    console.error("Automation failed:", error);
  }
}

if (require.main === module) {
  exampleAutomation();
}
```

### AI Agent Integration Pattern

```python
class BrowserAutomationAgent:
    def __init__(self):
        self.mcp_client = ElectronMCPClient()
        self.current_window = None

    def browse_to(self, url):
        """Navigate to a URL"""
        window = self.mcp_client.open_window(url)
        self.current_window = window["result"]["id"]
        return f"Opened {url} in window {self.current_window}"

    def get_page_content(self):
        """Extract page content"""
        if not self.current_window:
            return "No window open"

        # Get title
        title = self.mcp_client.execute_javascript(
            self.current_window,
            "document.title"
        )

        # Get main content (simplified)
        content = self.mcp_client.execute_javascript(
            self.current_window,
            "document.body.innerText"
        )

        return f"Title: {title['result']}\n\nContent: {content['result'][:1000]}..."

    def click_element(self, selector):
        """Click an element by CSS selector"""
        if not self.current_window:
            return "No window open"

        # Get element coordinates
        coords = self.mcp_client.execute_javascript(
            self.current_window,
            f"""
            const elem = document.querySelector('{selector}');
            if (elem) {{
                const rect = elem.getBoundingClientRect();
                return {{
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                }};
            }}
            return null;
            """
        )

        if coords["result"]:
            x, y = coords["result"]["x"], coords["result"]["y"]
            result = self.mcp_client.send_click(self.current_window, x, y)
            return f"Clicked element at ({x}, {y})"
        else:
            return f"Element '{selector}' not found"

    def take_screenshot(self):
        """Capture current page screenshot"""
        if not self.current_window:
            return "No window open"

        screenshot = self.mcp_client.capture_screenshot(self.current_window)
        return f"Screenshot captured: {screenshot['result']['size']} bytes"

    def close(self):
        """Close current window"""
        if self.current_window:
            self.mcp_client.call_tool("close_window", {"win_id": self.current_window})
            self.current_window = None
            return "Window closed"
        return "No window to close"

# Example usage with AI reasoning
def ai_agent_example():
    agent = BrowserAutomationAgent()

    # AI-driven browsing sequence
    print(agent.browse_to("https://example.com"))
    print(agent.get_page_content())
    print(agent.take_screenshot())
    print(agent.close())

if __name__ == "__main__":
    ai_agent_example()
```

## Real-time Communication

## Error Handling

### MCP Error Format

```json
{
  "jsonrpc": "2.0",
  "id": "message_id",
  "error": {
    "code": -32601,
    "message": "Method not found",
    "data": {
      "details": "Tool 'invalid_tool' not found"
    }
  }
}
```

### Common Error Codes

- `-32601`: Method not found
- `-32602`: Invalid parameters
- `-32603`: Internal error
- `-32000`: Server error
- `-32001`: Window not found
- `-32002`: Permission denied

### Error Handling Best Practices

```python
def safe_tool_call(tool_name, parameters, max_retries=3):
    """Safely call an MCP tool with retries"""
    for attempt in range(max_retries):
        try:
            result = client.call_tool(tool_name, parameters)
            if "error" in result:
                print(f"Tool error: {result['error']['message']}")
                if attempt < max_retries - 1:
                    time.sleep(1)  # Wait before retry
                    continue
                else:
                    return None
            return result
        except Exception as e:
            print(f"Exception: {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Wait longer before retry
                continue
            else:
                return None
    return None
```

## Performance Guidelines

### Resource Management

- **Window Limits**: Keep under 20 concurrent windows
- **Screenshot Frequency**: Limit to 1 per second maximum
- **JavaScript Execution**: Use for lightweight operations only
- **Memory Management**: Close unused windows promptly

### Optimization Tips

```python
# Batch operations when possible
def batch_automation(urls):
    windows = []

    # Open all windows first
    for url in urls:
        window = client.call_tool("open_window", {"url": url})
        windows.append(window["result"]["id"])

    # Process all windows
    results = []
    for win_id in windows:
        title = client.call_tool("get_title", {"win_id": win_id})
        results.append(title["result"])

    # Clean up
    for win_id in windows:
        client.call_tool("close_window", {"win_id": win_id})

    return results
```

## Security Considerations

### Isolation Features

- **Account Isolation**: Each account runs in isolated browser context
- **Context Isolation**: JavaScript execution is sandboxed
- **Permission Controls**: Operations require explicit permissions
- **Input Validation**: All parameters are validated server-side

### Best Practices

- Never expose sensitive data in JavaScript execution
- Use account isolation for multi-user scenarios
- Validate all user inputs before sending to MCP tools
- Monitor for unusual activity patterns

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check if server is running on port 3456
2. **Tool Not Found**: Verify tool name spelling and availability
3. **Window Not Found**: Ensure window ID is valid and window is open
4. **Permission Denied**: Check account permissions and context

### Debug Mode

Enable debug logging:

```python
# Enable debug mode
client.debug = True

# Or check server logs
# Server logs show detailed request/response information
```

### Health Check

```python
def health_check():
    """Check MCP server health"""
    try:
        ping = client.call_tool("ping", {})
        if ping.get("result", {}).get("status") == "healthy":
            print("MCP server is healthy")
            return True
        else:
            print("MCP server reports issues")
            return False
    except Exception as e:
        print(f"Cannot connect to MCP server: {e}")
        return False
```

## Advanced Features

### Custom Tool Chains

Create sequences of tool calls for complex operations:

```python
def automated_form_fill(url, form_data):
    """Automated form filling example"""

    # Open window
    window = client.call_tool("open_window", {"url": url})
    win_id = window["result"]["id"]

    # Wait for page load
    time.sleep(2)

    # Fill form fields
    for field_name, field_value in form_data.items():
        # Find field and set value
        js_code = f"""
        const field = document.querySelector('[name="{field_name}"]');
        if (field) {{
            field.value = '{field_value}';
            field.dispatchEvent(new Event('change'));
        }}
        """
        client.call_tool("execute_javascript", {
            "win_id": win_id,
            "code": js_code
        })

    # Submit form
    client.call_tool("execute_javascript", {
        "win_id": win_id,
        "code": "document.querySelector('form').submit();"
    })

    return win_id
```

### Multi-Account Workflows

```python
def multi_account_workflow():
    """Example of multi-account automation"""

    # Switch to account 0
    client.call_tool("switch_account", {"account_index": 0})
    window1 = client.call_tool("open_window", {"url": "https://site1.com"})

    # Switch to account 1
    client.call_tool("switch_account", {"account_index": 1})
    window2 = client.call_tool("open_window", {"url": "https://site2.com"})

    # Work with both windows
    # ... automation logic ...

    # Clean up
    client.call_tool("close_window", {"win_id": window1["result"]["id"]})
    client.call_tool("close_window", {"win_id": window2["result"]["id"]})
```

This MCP user manual provides comprehensive guidance for integrating AI agents with the Electron MCP browser automation system, including practical examples, error handling, and advanced features.
