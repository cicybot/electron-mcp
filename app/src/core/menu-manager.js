/**
 * Application Menu Manager
 * Handles Electron menu with navigation functionality
 */

const { Menu, BrowserWindow } = require('electron');
const winManager = require('./window-manager');
const storageManager = require('./storage-manager');

// 递归处理菜单配置，绑定点击事件
const processMenuItems = (menuItems) => {
  return menuItems.map(item => {
    // 如果有子菜单，递归处理
    if (item.submenu) {
      return {
        ...item,
        submenu: processMenuItems(item.submenu)
      };
    }

    if (item.action && winManager[item.action]) {
      const {params} = item
      delete item.params
      return {
        ...item,
        click: () => {
          winManager[item.action](params.index||0,params.url, params.options||{}, params.other||{});
        }
      };
    }

    // 没有 action 的项直接返回
    return item;
  });
};


class MenuManager {
  constructor() {
    this.menu = null;
  }

  /**
   * Create the application menu
   */
  createMenu() {

    const menus = processMenuItems(storageManager.loadMenu())
    console.log(menus)
    const template = [
        ...menus,
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