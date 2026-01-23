/**
 * Window Open Handler
 * Intercepts and handles window.open events in Electron
 */

const { shell, app } = require("electron");
const windowManager = require("./core/window-manager");

class WindowOpenHandler {
  constructor() {
    console.log("[WindowOpenHandler] Initializing window open handler...");
    this.setupGlobalListeners();
    console.log("[WindowOpenHandler] Global listeners setup completed");
  }

  /**
   * Set up global listeners for all webContents
   */
  setupGlobalListeners() {
    console.log("[WindowOpenHandler] Setting up app-level web-contents-created listener...");

    app.on("web-contents-created", (event, webContents) => {
      console.log("[WindowOpenHandler] New webContents created:", webContents.id);
      this.setupWebContentsListeners(webContents);
    });
  }

  /**
   * Set up listeners for a specific webContents
   */
  setupWebContentsListeners(webContents) {
    console.log("[WindowOpenHandler] Setting up listeners for webContents:", webContents.id);

    // Listen for window.open attempts
    webContents.on("new-window", (event, navigationUrl, frameName, disposition, options) => {
      console.log("[WindowOpenHandler] ===== WINDOW.OPEN EVENT =====");
      console.log("[WindowOpenHandler] Navigation URL:", navigationUrl);
      console.log("[WindowOpenHandler] Frame Name:", frameName);
      console.log("[WindowOpenHandler] Disposition:", disposition);
      console.log("[WindowOpenHandler] Options:", options);
      console.log("[WindowOpenHandler] From webContents:", webContents.id);
      console.log("[WindowOpenHandler] Current URL:", webContents.getURL());

      event.preventDefault();
      this.handleWindowOpen(navigationUrl, frameName, disposition, options, event, webContents);
    });

    // Listen for will-navigate events (sometimes window.open triggers navigation)
    webContents.on("will-navigate", (event, navigationUrl) => {
      console.log("[WindowOpenHandler] ===== WILL-NAVIGATE EVENT =====");
      console.log("[WindowOpenHandler] Navigation URL:", navigationUrl);
      console.log("[WindowOpenHandler] Current URL:", webContents.getURL());
      console.log("[WindowOpenHandler] From webContents:", webContents.id);

      if (this.isWindowOpenRedirect(navigationUrl, webContents.getURL())) {
        console.log("[WindowOpenHandler] Detected window.open redirect, intercepting...");
        event.preventDefault();
        this.handleWindowOpen(
          navigationUrl,
          "window-open-redirect",
          "new-window",
          {},
          event,
          webContents
        );
      }
    });

    // Listen for did-start-navigation for more comprehensive tracking
    webContents.on("did-start-navigation", (event, navigationUrl, isInPlace, isMainFrame) => {
      if (isMainFrame) {
        console.log("[WindowOpenHandler] ===== DID-START-NAVIGATION EVENT =====");
        console.log("[WindowOpenHandler] Navigation URL:", navigationUrl);
        console.log("[WindowOpenHandler] Is In Place:", isInPlace);
        console.log("[WindowOpenHandler] Is Main Frame:", isMainFrame);
        console.log("[WindowOpenHandler] From webContents:", webContents.id);
      }
    });

    console.log("[WindowOpenHandler] All listeners setup for webContents:", webContents.id);
  }

  /**
   * Handle window.open request
   */
  async handleWindowOpen(url, frameName, disposition, options, event = null, webContents = null) {
    console.log("[WindowOpenHandler] ===== HANDLE WINDOW.OPEN =====");
    console.log("[WindowOpenHandler] URL:", url);
    console.log("[WindowOpenHandler] Frame Name:", frameName);
    console.log("[WindowOpenHandler] Disposition:", disposition);
    console.log("[WindowOpenHandler] Options:", options);
    if (webContents) {
      console.log("[WindowOpenHandler] Source webContents:", webContents.id);
      console.log("[WindowOpenHandler] Source URL:", webContents.getURL());
    }

    // Validate URL
    if (!url) {
      console.log("[WindowOpenHandler] Empty URL, ignoring...");
      return;
    }

    // Determine handling strategy
    const strategy = this.determineStrategy(url, disposition);
    console.log("[WindowOpenHandler] Determined strategy:", strategy);

    switch (strategy) {
      case "electron-window":
        console.log("[WindowOpenHandler] Executing ELECTRON-WINDOW strategy...");
        await this.openInElectronWindow(url, options, webContents);
        break;

      case "system-browser":
        console.log("[WindowOpenHandler] Executing SYSTEM-BROWSER strategy...");
        await this.openInSystemBrowser(url);
        break;

      case "same-window":
        console.log("[WindowOpenHandler] Executing SAME-WINDOW strategy...");
        await this.openInSameWindow(url, event, webContents);
        break;

      case "block":
        console.log("[WindowOpenHandler] Executing BLOCK strategy...");
        console.log("[WindowOpenHandler] BLOCKED URL:", url);
        break;

      default:
        console.log("[WindowOpenHandler] Unknown strategy, using default...");
        await this.openInSystemBrowser(url);
    }

    console.log("[WindowOpenHandler] ===== WINDOW.OPEN HANDLING COMPLETED =====");
  }

  /**
   * Determine the best strategy for handling the URL
   */
  determineStrategy(url, disposition) {
    console.log("[WindowOpenHandler] ===== DETERMINING STRATEGY =====");
    console.log("[WindowOpenHandler] URL:", url);
    console.log("[WindowOpenHandler] Disposition:", disposition);

    // Block malicious URLs
    if (this.isMaliciousUrl(url)) {
      console.log("[WindowOpenHandler] URL detected as malicious, blocking...");
      return "block";
    }

    // Handle different dispositions
    switch (disposition) {
      case "foreground-tab":
        console.log("[WindowOpenHandler] Disposition: FOREGROUND-TAB");
        if (this.isExternalDomain(url)) {
          console.log("[WindowOpenHandler] External domain, will open in system browser");
          return "system-browser";
        }
        console.log("[WindowOpenHandler] Internal domain, will open in electron window");
        return "electron-window";

      case "new-window":
        console.log("[WindowOpenHandler] Disposition: NEW-WINDOW");
        if (this.isExternalDomain(url)) {
          console.log("[WindowOpenHandler] External domain, will open in system browser");
          return "system-browser";
        }
        console.log("[WindowOpenHandler] Internal domain, will open in electron window");
        return "electron-window";

      case "background-tab":
        console.log("[WindowOpenHandler] Disposition: BACKGROUND-TAB");
        console.log("[WindowOpenHandler] Will open in system browser");
        return "system-browser";

      case "current-tab":
        console.log("[WindowOpenHandler] Disposition: CURRENT-TAB");
        console.log("[WindowOpenHandler] Will open in same window");
        return "same-window";

      default:
        console.log("[WindowOpenHandler] Unknown disposition:", disposition);
        console.log("[WindowOpenHandler] Defaulting to electron window");
        return "electron-window";
    }
  }

  /**
   * Open URL in new Electron window
   */
  async openInElectronWindow(url, options = {}, sourceWebContents = null) {
    console.log("[WindowOpenHandler] ===== OPENING ELECTRON WINDOW =====");
    console.log("[WindowOpenHandler] URL:", url);
    console.log("[WindowOpenHandler] Options:", options);
    if (sourceWebContents) {
      console.log("[WindowOpenHandler] Source webContents:", sourceWebContents.id);
    }

    try {
      const windowOptions = {
        ...options,
        // Add metadata about how this window was opened
        openedVia: "window.open",
        sourceWebContents: sourceWebContents ? sourceWebContents.id : null,
        timestamp: Date.now(),
      };

      console.log("[WindowOpenHandler] Window options for new window:", windowOptions);

      const newWindow = await windowManager.createWindow(
        0, // account_index - you might want to inherit from source
        url,
        windowOptions,
        windowOptions
      );

      console.log("[WindowOpenHandler] Successfully created new Electron window");
      console.log("[WindowOpenHandler] New window ID:", newWindow.id);
      console.log("[WindowOpenHandler] New window URL:", url);
      return newWindow;
    } catch (error) {
      console.error("[WindowOpenHandler] FAILED to create Electron window");
      console.error("[WindowOpenHandler] Error:", error.message);
      console.error("[WindowOpenHandler] Stack:", error.stack);
      throw error;
    }
  }

  /**
   * Open URL in system browser
   */
  async openInSystemBrowser(url) {
    console.log("[WindowOpenHandler] ===== OPENING SYSTEM BROWSER =====");
    console.log("[WindowOpenHandler] URL:", url);

    try {
      await shell.openExternal(url);
      console.log("[WindowOpenHandler] Successfully opened in system browser");
      console.log("[WindowOpenHandler] URL opened:", url);
    } catch (error) {
      console.error("[WindowOpenHandler] FAILED to open in system browser");
      console.error("[WindowOpenHandler] Error:", error.message);
      console.error("[WindowOpenHandler] Stack:", error.stack);
      throw error;
    }
  }

  /**
   * Open URL in the same window
   */
  async openInSameWindow(url, event, webContents) {
    console.log("[WindowOpenHandler] ===== OPENING IN SAME WINDOW =====");
    console.log("[WindowOpenHandler] URL:", url);
    if (webContents) {
      console.log("[WindowOpenHandler] Target webContents:", webContents.id);
      console.log("[WindowOpenHandler] Current URL:", webContents.getURL());
    }

    if (event && event.sender) {
      try {
        console.log("[WindowOpenHandler] Loading URL in same window...");
        await event.sender.loadURL(url);
        console.log("[WindowOpenHandler] Successfully loaded URL in same window");
        console.log("[WindowOpenHandler] New URL:", url);
      } catch (error) {
        console.error("[WindowOpenHandler] FAILED to load URL in same window");
        console.error("[WindowOpenHandler] Error:", error.message);
        console.error("[WindowOpenHandler] Stack:", error.stack);
        throw error;
      }
    } else {
      console.log("[WindowOpenHandler] No event.sender available, cannot load URL");
    }
  }

  /**
   * Check if URL is malicious
   */
  isMaliciousUrl(url) {
    console.log("[WindowOpenHandler] ===== CHECKING MALICIOUS URL =====");
    console.log("[WindowOpenHandler] URL to check:", url);

    try {
      const urlObj = new URL(url);
      console.log("[WindowOpenHandler] Parsed URL:", {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        origin: urlObj.origin,
      });

      // Block javascript: protocol
      if (urlObj.protocol === "javascript:") {
        console.log("[WindowOpenHandler] MALICIOUS: javascript: protocol");
        return true;
      }

      // Block data: protocol (can be used for XSS)
      if (urlObj.protocol === "data:") {
        console.log("[WindowOpenHandler] MALICIOUS: data: protocol");
        return true;
      }

      // Block empty hostname
      if (!urlObj.hostname) {
        console.log("[WindowOpenHandler] SUSPICIOUS: empty hostname");
        return true;
      }

      console.log("[WindowOpenHandler] URL appears safe");
      return false;
    } catch (error) {
      console.log("[WindowOpenHandler] MALICIOUS: Invalid URL format");
      console.log("[WindowOpenHandler] URL parse error:", error.message);
      return true; // Assume malicious on error
    }
  }

  /**
   * Check if URL is external domain
   */
  isExternalDomain(url) {
    console.log("[WindowOpenHandler] ===== CHECKING EXTERNAL DOMAIN =====");
    console.log("[WindowOpenHandler] URL to check:", url);

    try {
      const urlObj = new URL(url);
      const currentOrigin = this.getCurrentOrigin();

      console.log("[WindowOpenHandler] URL origin:", urlObj.origin);
      console.log("[WindowOpenHandler] Current origin:", currentOrigin);

      if (!currentOrigin) {
        console.log("[WindowOpenHandler] No current origin, assuming external");
        return true; // Assume external if no current origin
      }

      const isExternal = urlObj.origin !== currentOrigin;
      console.log("[WindowOpenHandler] Is external:", isExternal);
      return isExternal;
    } catch (error) {
      console.log("[WindowOpenHandler] URL parse error:", error.message);
      console.log("[WindowOpenHandler] Assuming external due to error");
      return true; // Assume external on error
    }
  }

  /**
   * Get current origin (simplified implementation)
   */
  getCurrentOrigin() {
    // This would need to be implemented based on your app's state
    // For now, return null to handle as external
    console.log(
      "[WindowOpenHandler] Getting current origin - returning null (will be treated as external)"
    );
    return null;
  }

  /**
   * Check if navigation is from window.open redirect
   */
  isWindowOpenRedirect(navigationUrl, currentUrl) {
    console.log("[WindowOpenHandler] ===== CHECKING WINDOW.OPEN REDIRECT =====");
    console.log("[WindowOpenHandler] Navigation URL:", navigationUrl);
    console.log("[WindowOpenHandler] Current URL:", currentUrl);

    // This is a heuristic - you may need to adjust based on your use case
    const isRedirect =
      navigationUrl !== currentUrl &&
      !navigationUrl.includes("#") &&
      navigationUrl.startsWith("http");

    console.log("[WindowOpenHandler] Is window.open redirect:", isRedirect);
    return isRedirect;
  }
}

module.exports = new WindowOpenHandler();
