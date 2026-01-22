/**
 * Test for showPromptArea functionality
 * Tests that the prompt area shows, handles enter key correctly, and alerts value
 * 
 * @jest-environment jsdom
 */

describe('showPromptArea', () => {
    beforeEach(() => {
        // Set up DOM environment
        document.body.innerHTML = '';
        
        // Mock the global window._G object if needed
        window._G = {
            showPromptArea: require('../src/utils-browser.js').showPromptArea,
            hidePromptArea: require('../src/utils-browser.js').hidePromptArea
        };
    });

    afterEach(() => {
        // Clean up after each test
        const promptDiv = document.getElementById('__promptDiv');
        if (promptDiv) {
            promptDiv.remove();
        }
    });

    it('should create a prompt area with textarea', () => {
        window._G.showPromptArea();
        
        const promptDiv = document.getElementById('__promptDiv');
        expect(promptDiv).toBeTruthy();
        
        const textarea = promptDiv.querySelector('textarea');
        expect(textarea).toBeTruthy();
        
        // Check that it has the expected styles
        expect(promptDiv.style.position).toBe('fixed');
        expect(promptDiv.style.zIndex).toBe('2147483647');
    });

    it('should handle enter key to alert value and clear', () => {
        const mockAlert = jest.fn();
        global.alert = mockAlert;
        
        window._G.showPromptArea();
        
        const promptDiv = document.getElementById('__promptDiv');
        const textarea = promptDiv.querySelector('textarea');
        
        // Set some text
        textarea.value = 'test message';
        
        // Simulate Enter key press (without shift)
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            shiftKey: false
        });
        
        textarea.dispatchEvent(enterEvent);
        
        // Check that alert was called with the value
        expect(mockAlert).toHaveBeenCalledWith('test message');
        
        // Check that textarea was cleared
        expect(textarea.value).toBe('');
    });

    it('should not alert on Enter+Shift', () => {
        const mockAlert = jest.fn();
        global.alert = mockAlert;
        
        window._G.showPromptArea();
        
        const promptDiv = document.getElementById('__promptDiv');
        const textarea = promptDiv.querySelector('textarea');
        
        // Set some text
        textarea.value = 'test message';
        
        // Simulate Enter+Shift key press
        const enterShiftEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            shiftKey: true
        });
        
        textarea.dispatchEvent(enterShiftEvent);
        
        // Should not alert on Enter+Shift
        expect(mockAlert).not.toHaveBeenCalled();
        
        // Text should remain unchanged
        expect(textarea.value).toBe('test message');
    });

    it('should not alert on empty value', () => {
        const mockAlert = jest.fn();
        global.alert = mockAlert;
        
        window._G.showPromptArea();
        
        const promptDiv = document.getElementById('__promptDiv');
        const textarea = promptDiv.querySelector('textarea');
        
        // Leave textarea empty
        textarea.value = '';
        
        // Simulate Enter key press
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            shiftKey: false
        });
        
        textarea.dispatchEvent(enterEvent);
        
        // Should not alert on empty value
        expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should remove existing prompt area when creating new one', () => {
        // Create first prompt area
        window._G.showPromptArea();
        const firstPromptDiv = document.getElementById('__promptDiv');
        expect(firstPromptDiv).toBeTruthy();
        
        // Create second prompt area
        window._G.showPromptArea();
        const secondPromptDiv = document.getElementById('__promptDiv');
        expect(secondPromptDiv).toBeTruthy();
        
        // Should only have one prompt div
        const allPromptDivs = document.querySelectorAll('#__promptDiv');
        expect(allPromptDivs.length).toBe(1);
    });
});