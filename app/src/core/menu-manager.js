/**
 * Application Menu Manager
 * Handles Electron menu with navigation functionality
 */

const { Menu, BrowserWindow } = require('electron');
const winManager = require('./window-manager');

class MenuManager {
  constructor() {
    this.menu = null;
  }

  /**
   * Create the application menu
   */
  createMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'InitWindow',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              winManager.createWindow(0, 'https://electron-render.cicy.de5.net/initWindow', {});
            }
          },
          { type: 'separator' },
          {
            label: 'GCS_0',
            click: () => {
              winManager.createWindow(0, 'https://shell.cloud.google.com/?hl=zh_CN&theme=system&fromcloudshell=true&show=terminal', {});
            }
          },
          {
            label: 'GCS_1',
            click: () => {
              winManager.createWindow(1, 'https://shell.cloud.google.com/?hl=zh_CN&theme=system&fromcloudshell=true&show=terminal', {});
            }
          },
          { type: 'separator' },
          {
            label: 'AISTUDIO',
            click: () => {
              winManager.createWindow(0, 'https://aistudio.google.com/', {});
            }
          },
          {
            label: 'GhtGpt',
            click: () => {
              winManager.createWindow(0, 'https://www.chtgpt.com', {});
            }
          },
          {
            label: 'Google_0',
            click: () => {
              winManager.createWindow(0, 'https://www.google.com', {});
            }
          },

          {
            label: 'Google_1',
            click: () => {
              winManager.createWindow(1, 'https://www.google.com', {});
            }
          },
          { type: 'separator' },
          {
            label: 'Colab_0',
            click: () => {
              winManager.createWindow(0, 'https://colab.research.google.com/', {});
            }
          },
          {
            label: 'Colab_1',
            click: () => {
              winManager.createWindow(1, 'https://colab.research.google.com/', {});
            }
          },
          { type: 'separator' },
          {
            label: 'Github_0',
            click: () => {
              winManager.createWindow(0, 'https://www.github.com/', {});
            }
          },
          {
            label: 'Github_1',
            click: () => {
              winManager.createWindow(1, 'https://www.github.com/', {});
            }
          },
          { type: 'separator' },

          {
            label: 'Cloudflare',
            click: () => {
              winManager.createWindow(1, 'https://dash.cloudflare.com/73595dcb392b333ce6be9c923cc30930', {});
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              const { app } = require('electron');
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Navigation',
        submenu: [
          {
            label: 'Go Back',
            accelerator: 'CmdOrCtrl+[',
            click: () => {
              this.goBack();
            }
          },
          {
            label: 'Go Forward',
            accelerator: 'CmdOrCtrl+]',
            click: () => {
              this.goForward();
            }
          },
          { type: 'separator' },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              this.reload();
            }
          },
          {
            label: 'Force Reload',
            accelerator: 'CmdOrCtrl+Shift+R',
            click: () => {
              this.forceReload();
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    // Add macOS-specific menu items
    if (process.platform === 'darwin') {
      const { app } = require('electron');
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });

      // Window menu
      template[4].submenu.push(
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      );
    }

    this.menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.menu);
  }

  /**
   * Go back in the focused window
   */
  goBack() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && !focusedWindow.isDestroyed()) {
      if (focusedWindow.webContents.canGoBack()) {
        focusedWindow.webContents.goBack();
      }
    }
  }

  /**
   * Go forward in the focused window
   */
  goForward() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && !focusedWindow.isDestroyed()) {
      if (focusedWindow.webContents.canGoForward()) {
        focusedWindow.webContents.goForward();
      }
    }
  }

  /**
   * Reload the focused window
   */
  reload() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && !focusedWindow.isDestroyed()) {
      focusedWindow.webContents.reload();
    }
  }

  /**
   * Force reload the focused window (ignoring cache)
   */
  forceReload() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow && !focusedWindow.isDestroyed()) {
      focusedWindow.webContents.reloadIgnoringCache();
    }
  }
}

module.exports = new MenuManager();