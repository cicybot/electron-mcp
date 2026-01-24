# Electron MCP - Model Context Protocol Browser Automation

A powerful Electron-based application that provides browser automation and management capabilities through both RPC and MCP (Model Context Protocol) interfaces.

## Features

- **Browser Window Management**: Create, control, and manage multiple browser windows with account isolation
- **Input Simulation**: Mouse clicks, keyboard events, and complex input automation
- **Screenshot Capabilities**: Capture screenshots of windows and system with various formats
- **Cookie Management**: Import/export cookies for session management
- **Account Isolation**: Multi-account support with isolated browser contexts
- **Network Monitoring**: Track and filter network requests
- **JavaScript Execution**: Execute custom JavaScript in browser contexts
- **MCP Protocol Support**: Full Model Context Protocol implementation for AI agent integration

## Installation

```bash
# Install dependencies
npm install

# Run the application
npm start
```

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Format code
npm run format

# Build application
npm run build
```

## Quick Start

### Starting the Application

```bash
npm start
```

The application will start on `http://127.0.0.1:3456` by default.

### Using cURL with RPC

```bash
# Ping the server
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "id": 1}'

# Get all windows
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "getWindows", "params": {}, "id": 2}'

# Open a new window
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "openWindow", "params": {"url": "https://example.com", "account_index": 0}, "id": 3}'
```

### Using MCP Protocol

1. **SSE Connection**: Connect to `/messages` endpoint for Server-Sent Events
2. **Tool Call**: Use `tools/call` method to invoke MCP tools
3. **Tool List**: Use `tools/list` to discover available tools

```bash
# List available tools
curl -X POST http://127.0.0.1:3456/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list", "params": {}, "id": 1}'
```

## Architecture

```
apps/electron/
├── main.js                    # Application entry point
├── core/                      # Core application logic
│   ├── app-manager.js         # Application lifecycle management
│   ├── window-manager.js      # Browser window operations
│   ├── account-manager.js     # User account management
│   ├── storage-manager.js     # Local storage operations
│   └── menu-manager.js       # Application menus
├── server/                    # Express server and RPC handlers
│   ├── express-server.js      # HTTP server setup
│   ├── rpc-handler.js         # RPC method dispatcher
│   └── mcp-integration.js    # MCP protocol integration
├── db/                        # Database models and operations
│   ├── db.js                 # Database connection setup
│   └── user.js               # User model operations
├── services/                  # Business logic services
│   ├── window-open-handler.js # Window opening logic
│   ├── screenshot-cache-service.js # Screenshot caching
│   └── network-monitor.js    # Network request monitoring
├── browser/                   # Browser-related functionality
│   ├── content-inject.js      # Content script injection
│   ├── utils-browser.js       # Browser utilities
│   └── extension/            # Browser extension files
├── common/                    # Shared utilities
│   ├── utils.js              # Shared utilities
│   └── utils-node.js         # Node.js specific utilities
├── tests/                     # Test files
│   ├── test-utils.js          # Common test utilities
│   ├── test-electron-run.test.js # Basic functionality tests
│   └── test-mcp-api.test.js  # MCP API comprehensive tests
└── helpers.js                 # Helper functions
```

## Documentation

- [RPC API Documentation](docs/rpc-api-documentation.md) - Complete RPC API reference with examples
- [MCP User Manual](docs/mcp-user-manual.md) - MCP protocol integration guide for AI agents
- [AGENTS.md](AGENTS.md) - Development guidelines and code style for contributors

## Testing

The project includes comprehensive test coverage with automatic backend management:

- **Unit Tests**: Core functionality testing
- **Integration Tests**: RPC and MCP server testing
- **Electron Tests**: Full application testing
- **Test Utilities**: Common functions in `tests/test-utils.js`

### Test Environment Setup

Tests automatically:

1. Check if Electron MCP backend is running on port 3456
2. Start backend if not running using `npm start`
3. Wait for backend to be ready
4. Run test suite
5. Clean up resources

```bash
# Run all tests
npm test

# Run specific test files
npx jest tests/test-electron-run.test.js
npx jest tests/test-mcp-api.test.js

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests matching a pattern
npx jest --testNamePattern="RPC /rpc responds"
```

## Configuration

### Environment Variables

- `NODE_ENV`: Set to "development" for debug mode
- `PORT`: Server port (default: 3456)
- `LOG_LEVEL`: Logging level (default: "info")

### Window Configuration

Default window options:

- Width: 1200px
- Height: 800px
- Web Security: Enabled
- Context Isolation: Enabled
- Node Integration: Disabled

## API Reference

### RPC Methods

#### Window Management

- `openWindow` - Create new browser window
- `getWindows` - List all windows
- `closeWindow` - Close specified window
- `showWindow` - Show hidden window
- `hideWindow` - Hide window
- `reload` - Reload window content
- `getBounds` - Get window position/size
- `setBounds` - Set window position/size

#### Input Events

- `sendInputEvent` - Send input event to window
- `sendElectronClick` - Simulate mouse click
- `sendElectronPressEnter` - Send Enter key
- `writeClipboard` - Write text to clipboard

#### Screenshots

- `captureScreenshot` - Capture window screenshot
- `saveScreenshot` - Save screenshot to file
- `captureSystemScreenshot` - Capture system screenshot
- `getScreenshotInfo` - Get screenshot metadata

#### Page Operations

- `loadURL` - Load URL in window
- `getURL` - Get current URL
- `getTitle` - Get page title
- `executeJavaScript` - Execute JavaScript code
- `openDevTools` - Open developer tools

#### Account Management

- `switchAccount` - Switch to different account
- `getAccountInfo` - Get account information
- `getAccountWindows` - Get windows for account

### MCP Tools

The MCP interface provides tools equivalent to RPC methods with additional validation and error handling:

- **Window Management**: `open_window`, `get_windows`, `close_window`, etc.
- **Input Events**: `send_input_event`, `send_electron_click`, etc.
- **Screenshots**: `capture_screenshot`, `save_screenshot`, etc.
- **Page Operations**: `load_url`, `get_url`, `execute_javascript`, etc.
- **Account Operations**: `switch_account`, `get_account_info`, etc.
- **System**: `ping`, `info`, `get_methods`, etc.

## Security Considerations

- **Context Isolation**: Browser contexts are isolated between accounts
- **Input Validation**: All inputs are validated before processing
- **Permission Control**: Account-based access control for windows
- **Secure Defaults**: Secure default configurations for browser windows

## Contributing

Please read [AGENTS.md](AGENTS.md) for development guidelines and contribution instructions.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Run tests: `npm test`
6. Format code: `npm run format`
7. Submit a pull request

## License

ISC License

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change port using environment variable

   ```bash
   PORT=3457 npm start
   ```

2. **Window Not Found**: Ensure window exists before operations

   ```bash
   # Check windows first
   curl -X POST http://127.0.0.1:3456/rpc \
     -H "Content-Type: application/json" \
     -d '{"method": "getWindows", "params": {}, "id": 1}'
   ```

3. **Account Validation Failed**: Use correct account_index for windows

### Debug Mode

```bash
NODE_ENV=development npm start
```

This enables detailed logging and debug information.

## Support

For issues and questions:

1. Check the [documentation](docs/)
2. Review [existing issues](../../issues)
3. Create a new issue with detailed information

## Performance Considerations

- **Window Limits**: Recommended maximum of 20 concurrent windows
- **Screenshot Frequency**: Avoid high-frequency screenshots
- **Account Switching**: Switch accounts efficiently to reduce overhead

## Roadmap

- [ ] Enhanced recording capabilities
- [ ] Advanced network filtering
- [ ] Mobile browser support
- [ ] Plugin system for extensibility
