/**
 * Screenshot Service
 * Handles screenshot capture and processing
 */

class ScreenshotService {
  constructor() {
    this.appManager = require('../core/app-manager');
  }

  /**
   * Capture screenshot from webContents
   */
  async captureScreenshot(wc, options = {}) {
    if (!wc) {
      throw new Error('WebContents not available');
    }

    try {
      const image = await wc.capturePage();

      // Apply default scaling (50%)
      const scaleFactor = options.scaleFactor || 0.5;
      const scaled = image.resize({
        width: Math.floor(image.getSize().width * scaleFactor),
        height: Math.floor(image.getSize().height * scaleFactor),
      });

      return scaled;
    } catch (error) {
      console.error('[ScreenshotService] Capture failed:', error);
      throw new Error(`Screenshot capture failed: ${error.message}`);
    }
  }

  /**
   * Get screenshot as buffer
   */
  async getScreenshotBuffer(wc, format = 'png', options = {}) {
    const image = await this.captureScreenshot(wc, options);

    switch (format.toLowerCase()) {
      case 'png':
        return image.toPNG();
      case 'jpeg':
      case 'jpg':
        return image.toJPEG(options.quality || 90);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Save screenshot to file
   */
  async saveScreenshot(wc, filePath, format = 'png', options = {}) {
    const buffer = await this.getScreenshotBuffer(wc, format, options);

    const fs = require('fs').promises;
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      filePath,
      size: buffer.length,
      format
    };
  }

  /**
   * Get screenshot dimensions
   */
  async getScreenshotInfo(wc) {
    if (!wc) {
      return null;
    }

    try {
      const image = await wc.capturePage();
      const size = image.getSize();

      return {
        width: size.width,
        height: size.height,
        aspectRatio: size.width / size.height
      };
    } catch (error) {
      console.error('[ScreenshotService] Info retrieval failed:', error);
      return null;
    }
  }
}

module.exports = new ScreenshotService();