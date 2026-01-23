const pyautoguiService = require('../src/services/pyautogui-service');

describe('PyAutoGUI Service Integration', () => {
  describe('Basic functionality', () => {
    it('should be imported correctly', () => {
      expect(pyautoguiService).toBeDefined();
      expect(typeof pyautoguiService.click).toBe('function');
      expect(typeof pyautoguiService.type).toBe('function');
      expect(typeof pyautoguiService.screenshot).toBe('function');
    });

    it('should have all required methods', () => {
      const methods = [
        'click', 'type', 'hotkey', 'press', 'paste', 'move',
        'pressEnter', 'pressBackspace', 'pressSpace', 'pressEsc',
        'screenshot', 'write', 'text'
      ];
      
      methods.forEach(method => {
        expect(typeof pyautoguiService[method]).toBe('function');
      });
    });
  });

  describe('String escaping', () => {
    it('should escape Python strings properly', () => {
      expect(pyautoguiService.escapePythonString('hello')).toBe('hello');
      expect(pyautoguiService.escapePythonString('hello "world"')).toBe('hello \\"world\\"');
      expect(pyautoguiService.escapePythonString("hello 'world'")).toBe("hello \\'world\\'");
      expect(pyautoguiService.escapePythonString('hello\nworld')).toBe('hello\\nworld');
      expect(pyautoguiService.escapePythonString('hello\\world')).toBe('hello\\\\world');
    });
  });

  describe('Method validation', () => {
    it('should validate parameters for press method', () => {
      expect(() => pyautoguiService._validatePressParams({})).toThrow('Key parameter is required');
      expect(() => pyautoguiService._validatePressParams({ key: 'a' })).not.toThrow();
    });

    it('should validate parameters for hotkey method', () => {
      expect(() => pyautoguiService._validateHotkeyParams({})).toThrow('Keys array is required');
      expect(() => pyautoguiService._validateHotkeyParams({ keys: ['command', 'c'] })).not.toThrow();
    });

    it('should validate parameters for move method', () => {
      expect(() => pyautoguiService._validateMoveParams({})).toThrow('X and Y coordinates are required');
      expect(() => pyautoguiService._validateMoveParams({ x: 100 })).toThrow('X and Y coordinates are required');
      expect(() => pyautoguiService._validateMoveParams({ y: 100 })).toThrow('X and Y coordinates are required');
      expect(() => pyautoguiService._validateMoveParams({ x: 100, y: 100 })).not.toThrow();
    });
  });

  describe('Python code generation (without execution)', () => {
    // Mock executePyAutoGUICode to prevent actual Python execution
    beforeEach(() => {
      pyautoguiService.executePyAutoGUICode = jest.fn().mockResolvedValue('success');
    });

    it('should generate correct Python code for click without coordinates', async () => {
      await pyautoguiService.click({});
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith('pyautogui.click()', {});
    });

    it('should generate correct Python code for click with coordinates', async () => {
      await pyautoguiService.click({ x: 100, y: 200 });
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith('pyautogui.click(100, 200)', { x: 100, y: 200 });
    });

    it('should generate correct Python code for type', async () => {
      await pyautoguiService.type({ text: 'hello world' });
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith("pyautogui.typewrite('hello world')", { text: 'hello world' });
    });

    it('should generate correct Python code for hotkey', async () => {
      await pyautoguiService.hotkey({ keys: ['command', 'c'] });
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith("pyautogui.hotkey('command', 'c')", { keys: ['command', 'c'] });
    });

    it('should generate correct Python code for single key press', async () => {
      await pyautoguiService.press({ key: 'enter' });
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith("pyautogui.press('enter')", { key: 'enter' });
    });

    it('should generate correct Python code for mouse movement', async () => {
      await pyautoguiService.move({ x: 300, y: 400 });
      expect(pyautoguiService.executePyAutoGUICode).toHaveBeenCalledWith('pyautogui.moveTo(300, 400)', { x: 300, y: 400 });
    });

    it('should handle screenshot JSON parsing', async () => {
      const mockScreenshotResult = JSON.stringify({ base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', format: 'png' });
      pyautoguiService.executePyAutoGUICode.mockResolvedValue(mockScreenshotResult);
      
      const result = await pyautoguiService.screenshot();
      
      expect(result).toEqual({
        base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        format: 'png'
      });
    });
  });
});