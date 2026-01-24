/**
 * Main exports for the Electron Headless Browser
 * Provides clean API for all modules
 */

// Core modules
exports.AppManager = require("./core/app-manager");
exports.WindowManager = require("./core/window-manager");
exports.AccountManager = require("./core/account-manager");

// Server modules
exports.ExpressServer = require("./server/express-server");
exports.RPCHandler = require("./server/rpc-handler");
exports.McpIntegration = require("./server/mcp-integration");

// Services
exports.ScreenshotCacheService = require("./services/screenshot-cache-service");
exports.NetworkMonitor = require("./services/network-monitor");

// Utilities
exports.Utils = require("./common/utils");
exports.UtilsNode = require("./common/utils-node");
exports.Helpers = require("./helpers");

// Browser-side utilities (for reference)
exports.UtilsBrowser = require("./browser/utils-browser");
