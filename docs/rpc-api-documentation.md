# RPC API Documentation

## Overview

The Electron MCP application provides a comprehensive RPC (Remote Procedure Call) API for browser automation and management. The API is accessible via HTTP POST requests to the `/rpc` endpoint.

**Base URL**: `http://127.0.0.1:3456/rpc`

## Request Format

All RPC requests follow this JSON-RPC format:

```json
{
  "method": "method_name",
  "params": {
    "parameter1": "value1",
    "parameter2": "value2"
  }
}
```

## Response Format

```json
{
  "ok": true,
  "result": "response_data"
}
```

For errors:

```json
{
  "ok": false,
  "result": "error_message"
}
```

## API Methods

### System Methods

#### ping

Health check endpoint.

**Request**:

```json
{
  "method": "ping",
  "params": {}
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}}'
```

**Response**:

```json
{
  "ok": true,
  "result": "pong"
}
```

#### info

Get system information.

**Request**:

```json
{
  "method": "info",
  "params": {}
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "info", "params": {}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "process": {
      "platform": "darwin",
      "arch": "x64",
      "nodeVersion": "v18.17.0",
      "electronVersion": "27.0.0"
    },
    "displayScreen": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

#### getDisplayScreenSize

Get display screen dimensions.

**Request**:

```json
{
  "method": "getDisplayScreenSize",
  "params": {}
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getDisplayScreenSize", "params": {}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "width": 1920,
    "height": 1080
  }
}
```

### Window Management

#### openWindow

Create a new browser window.

**Request**:

```json
{
  "method": "openWindow",
  "params": {
    "url": "https://example.com",
    "account_index": 0,
    "options": {
      "width": 1200,
      "height": 800,
      "x": 100,
      "y": 100
    }
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "openWindow",
    "params": {
      "url": "https://example.com",
      "account_index": 0,
      "options": {
        "width": 1200,
        "height": 800,
        "x": 100,
        "y": 100
      }
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "id": 1
  }
}
```

#### getWindows

Get list of all open windows.

**Request**:

```json
{
  "method": "getWindows",
  "params": {}
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindows", "params": {}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "0": [
      {
        "id": 1,
        "wcId": 1,
        "url": "https://example.com",
        "title": "Example Domain",
        "bounds": {
          "x": 100,
          "y": 100,
          "width": 1200,
          "height": 800
        }
      }
    ]
  }
}
```

#### closeWindow

Close a specific window.

**Request**:

```json
{
  "method": "closeWindow",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "closeWindow", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": true
}
```

#### showWindow

Show a window.

**Request**:

```json
{
  "method": "showWindow",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "showWindow", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### hideWindow

Hide a window.

**Request**:

```json
{
  "method": "hideWindow",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "hideWindow", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### getWindowState

Get detailed state of a window.

**Request**:

```json
{
  "method": "getWindowState",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindowState", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "id": 1,
    "url": "https://example.com",
    "title": "Example Domain",
    "isLoading": false,
    "isFocused": true,
    "bounds": {
      "x": 100,
      "y": 100,
      "width": 1200,
      "height": 800
    }
  }
}
```

### Window Properties

#### getBounds

Get window position and size.

**Request**:

```json
{
  "method": "getBounds",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getBounds", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "x": 100,
    "y": 100,
    "width": 1200,
    "height": 800
  }
}
```

#### setBounds

Set window position and size.

**Request**:

```json
{
  "method": "setBounds",
  "params": {
    "win_id": 1,
    "bounds": {
      "x": 200,
      "y": 200,
      "width": 1024,
      "height": 768
    }
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "setBounds",
    "params": {
      "win_id": 1,
      "bounds": {
        "x": 200,
        "y": 200,
        "width": 1024,
        "height": 768
      }
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### getWindowSize

Get window size.

**Request**:

```json
{
  "method": "getWindowSize",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindowSize", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": [1200, 800]
}
```

#### setWindowSize

Set window size.

**Request**:

```json
{
  "method": "setWindowSize",
  "params": {
    "win_id": 1,
    "width": 1024,
    "height": 768
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "setWindowSize",
    "params": {
      "win_id": 1,
      "width": 1024,
      "height": 768
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### setWindowWidth

Set window width (maintains current height).

**Request**:

```json
{
  "method": "setWindowWidth",
  "params": {
    "win_id": 1,
    "width": 1024
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "setWindowWidth", "params": {"win_id": 1, "width": 1024}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### setWindowPosition

Set window position.

**Request**:

```json
{
  "method": "setWindowPosition",
  "params": {
    "win_id": 1,
    "x": 300,
    "y": 300
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "setWindowPosition",
    "params": {
      "win_id": 1,
      "x": 300,
      "y": 300
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### Page Operations

#### loadURL

Navigate to a URL.

**Request**:

```json
{
  "method": "loadURL",
  "params": {
    "win_id": 1,
    "url": "https://google.com"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "loadURL",
    "params": {
      "win_id": 1,
      "url": "https://google.com"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### getURL

Get current URL.

**Request**:

```json
{
  "method": "getURL",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getURL", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": "https://google.com"
}
```

#### getTitle

Get page title.

**Request**:

```json
{
  "method": "getTitle",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getTitle", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": "Google"
}
```

#### reload

Reload the current page.

**Request**:

```json
{
  "method": "reload",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "reload", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### JavaScript Execution

#### runCode

Execute JavaScript code in the window context.

**Request**:

```json
{
  "method": "runCode",
  "params": {
    "win_id": 1,
    "code": "document.title"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "runCode",
    "params": {
      "win_id": 1,
      "code": "document.title"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": "Google"
}
```

#### executeJavaScript

Execute JavaScript with async support.

**Request**:

```json
{
  "method": "executeJavaScript",
  "params": {
    "win_id": 1,
    "code": "await fetch('/api/data').then(r => r.json())"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "executeJavaScript",
    "params": {
      "win_id": 1,
      "code": "await fetch(\"/api/data\").then(r => r.json())"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "data": "response_data"
  }
}
```

#### openDevTools

Open developer tools for the window.

**Request**:

```json
{
  "method": "openDevTools",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "openDevTools", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### Input Events

#### sendInputEvent

Send a generic input event.

**Request**:

```json
{
  "method": "sendInputEvent",
  "params": {
    "win_id": 1,
    "inputEvent": {
      "type": "mouseDown",
      "x": 100,
      "y": 100,
      "button": "left",
      "clickCount": 1
    }
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "sendInputEvent",
    "params": {
      "win_id": 1,
      "inputEvent": {
        "type": "mouseDown",
        "x": 100,
        "y": 100,
        "button": "left",
        "clickCount": 1
      }
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronClick

Send a mouse click event.

**Request**:

```json
{
  "method": "sendElectronClick",
  "params": {
    "win_id": 1,
    "x": 100,
    "y": 100,
    "button": "left",
    "clickCount": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "sendElectronClick",
    "params": {
      "win_id": 1,
      "x": 100,
      "y": 100,
      "button": "left",
      "clickCount": 1
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronPressEnter

Send Enter key press.

**Request**:

```json
{
  "method": "sendElectronPressEnter",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronPressEnter", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronPressEsc

Send Escape key press.

**Request**:

```json
{
  "method": "sendElectronPressEsc",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronPressEsc", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### Clipboard Operations

#### writeClipboard

Write text to system clipboard.

**Request**:

```json
{
  "method": "writeClipboard",
  "params": {
    "text": "Hello World"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "writeClipboard",
    "params": {
      "text": "Hello World"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronSelectAll

Select all text in window.

**Request**:

```json
{
  "method": "sendElectronSelectAll",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronSelectAll", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronCopy

Copy selected text to clipboard.

**Request**:

```json
{
  "method": "sendElectronCopy",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronCopy", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronPaste

Paste clipboard content.

**Request**:

```json
{
  "method": "sendElectronPaste",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronPaste", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### sendElectronCut

Cut selected text.

**Request**:

```json
{
  "method": "sendElectronCut",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "sendElectronCut", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### Cookie Management

#### importCookies

Import cookies to the window session.

**Request**:

```json
{
  "method": "importCookies",
  "params": {
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
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "importCookies",
    "params": {
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
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

#### exportCookies

Export cookies from the window session.

**Request**:

```json
{
  "method": "exportCookies",
  "params": {
    "win_id": 1,
    "options": {
      "domain": "example.com"
    }
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "exportCookies",
    "params": {
      "win_id": 1,
      "options": {
        "domain": "example.com"
      }
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": [
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

### User Agent

#### setUserAgent

Set custom user agent for the window.

**Request**:

```json
{
  "method": "setUserAgent",
  "params": {
    "win_id": 1,
    "userAgent": "Mozilla/5.0 (Custom User Agent)"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "setUserAgent",
    "params": {
      "win_id": 1,
      "userAgent": "Mozilla/5.0 (Custom User Agent)"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": null
}
```

### Media Operations

#### downloadMedia

Download media from URL.

**Request**:

```json
{
  "method": "downloadMedia",
  "params": {
    "win_id": 1,
    "mediaUrl": "https://example.com/video.mp4",
    "genSubtitles": false,
    "basePath": "/downloads",
    "id": "video_001"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "downloadMedia",
    "params": {
      "win_id": 1,
      "mediaUrl": "https://example.com/video.mp4",
      "genSubtitles": false,
      "basePath": "/downloads",
      "id": "video_001"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "filePath": "/downloads/video_001.mp4",
    "size": 1048576,
    "format": "mp4"
  }
}
```

#### getSubTitles

Generate subtitles for media file.

**Request**:

```json
{
  "method": "getSubTitles",
  "params": {
    "mediaPath": "/downloads/video_001.mp4"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "getSubTitles",
    "params": {
      "mediaPath": "/downloads/video_001.mp4"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": [
    {
      "start": "00:00:01.000",
      "end": "00:00:03.000",
      "text": "Hello world"
    }
  ]
}
```

### Network Monitoring

#### getRequests

Get network requests for a window.

**Request**:

```json
{
  "method": "getRequests",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getRequests", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": [
    {
      "url": "https://example.com/api/data",
      "method": "GET",
      "status": 200,
      "timestamp": 1640995200000
    }
  ]
}
```

#### clearRequests

Clear network request history.

**Request**:

```json
{
  "method": "clearRequests",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "clearRequests", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": []
}
```

### Screenshot Operations

#### captureScreenshot

Capture window screenshot as base64.

**Request**:

```json
{
  "method": "captureScreenshot",
  "params": {
    "win_id": 1,
    "format": "png"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "captureScreenshot",
    "params": {
      "win_id": 1,
      "format": "png"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "format": "png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA...",
    "size": 245760
  }
}
```

#### saveScreenshot

Save screenshot to file.

**Request**:

```json
{
  "method": "saveScreenshot",
  "params": {
    "win_id": 1,
    "filePath": "/screenshots/window_1.png",
    "format": "png"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "saveScreenshot",
    "params": {
      "win_id": 1,
      "filePath": "/screenshots/window_1.png",
      "format": "png"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "success": true,
    "filePath": "/screenshots/window_1.png",
    "size": 245760,
    "format": "png"
  }
}
```

#### getWindowScreenshotInfo

Get screenshot metadata for window.

**Request**:

```json
{
  "method": "getWindowScreenshotInfo",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindowScreenshotInfo", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "width": 1200,
    "height": 800,
    "aspectRatio": 1.5
  }
}
```

#### captureSystemScreenshot

Capture system-wide screenshot.

**Request**:

```json
{
  "method": "captureSystemScreenshot",
  "params": {
    "format": "png"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "captureSystemScreenshot",
    "params": {
      "format": "png"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "format": "png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA...",
    "size": 2073600
  }
}
```

#### saveSystemScreenshot

Save system-wide screenshot to file.

**Request**:

```json
{
  "method": "saveSystemScreenshot",
  "params": {
    "filePath": "/screenshots/system.png",
    "format": "png"
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "saveSystemScreenshot",
    "params": {
      "filePath": "/screenshots/system.png",
      "format": "png"
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "success": true,
    "filePath": "/screenshots/system.png",
    "size": 2073600,
    "format": "png"
  }
}
```

### Account Management

#### switchAccount

Switch to a different account context.

**Request**:

```json
{
  "method": "switchAccount",
  "params": {
    "account_index": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "switchAccount", "params": {"account_index": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "account_index": 1,
    "previous_index": 0
  }
}
```

#### getAccountInfo

Get account information for a window.

**Request**:

```json
{
  "method": "getAccountInfo",
  "params": {
    "win_id": 1
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getAccountInfo", "params": {"win_id": 1}}'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "account_index": 0,
    "user_id": "user_123",
    "session_id": "session_456"
  }
}
```

#### getAccountWindows

Get all windows for a specific account.

**Request**:

```json
{
  "method": "getAccountWindows",
  "params": {
    "account_index": 0
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getAccountWindows", "params": {"account_index": 0}}'
```

**Response**:

```json
{
  "ok": true,
  "result": [
    {
      "id": 1,
      "url": "https://example.com",
      "title": "Example Domain"
    }
  ]
}
```

### System Operations

#### openTerminal

Open system terminal with command.

**Request**:

```json
{
  "method": "openTerminal",
  "params": {
    "command": "ls -la",
    "showWin": true
  }
}
```

**cURL Demo**:

```bash
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "method": "openTerminal",
    "params": {
      "command": "ls -la",
      "showWin": true
    }
  }'
```

**Response**:

```json
{
  "ok": true,
  "result": {
    "terminal_id": "term_001",
    "command": "ls -la"
  }
}
```

## Error Handling

All methods return errors in the following format:

```json
{
  "ok": false,
  "result": "Error description"
}
```

Common errors:

- `"Unknown method"` - Method doesn't exist
- `"Window not found"` - Invalid window ID
- `"Invalid parameters"` - Missing or incorrect parameters
- `"Permission denied"` - Operation not allowed
- `"Internal error"` - Server-side error

## Performance Guidelines

- **Recommended maximum**: 20 concurrent windows
- **Screenshot frequency**: Avoid high-frequency captures (>1 per second)
- **JavaScript execution**: Use for lightweight operations only
- **Network monitoring**: Clear request history periodically

## Security Considerations

- All windows run with `contextIsolation: true` and `nodeIntegration: false`
- Input validation is performed on all parameters
- Account isolation prevents cross-account data access
- Clipboard operations require explicit user consent in some environments
