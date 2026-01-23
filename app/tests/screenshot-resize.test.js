/**
 * Test screenshot resizing functionality on Mac
 */

const ScreenshotCacheService = require('../src/services/screenshot-cache-service');

describe('Screenshot Resizing', () => {
  describe('Mac Platform Detection', () => {
    it('should detect Mac platform correctly', () => {
      const isMac = process.platform === 'darwin';
      expect(isMac).toBe(true); // We're running on Mac
    });
  });

  describe('Screenshot Service', () => {
    it('should have sharp dependency available', () => {
      const sharp = require('sharp');
      expect(sharp).toBeDefined();
    });

    it('should have capture methods defined', () => {
      const service = ScreenshotCacheService;
      expect(typeof service.captureWindowLive).toBe('function');
      expect(typeof service.captureSystemDisplayLive).toBe('function');
    });
  });
});