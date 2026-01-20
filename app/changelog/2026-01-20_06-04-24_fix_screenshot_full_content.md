# Changelog: Fix window screenshot to capture full page content

## Changes Made

### Screenshot Capture Fixes
- Modified `captureWindowLive()` in `screenshot-cache-service.js` to capture full page content
- Updated `captureScreenshot()` in `screenshot-service.js` for consistent behavior
- Enhanced logging to show content size vs captured size

## Technical Details

### Problem Identified
- `capturePage()` without parameters only captured viewport (visible area)
- Pages with scrollbars had incomplete screenshots
- User reported screenshots were not "真实大小" (real size)

### Solution Implemented
**Before:**
```javascript
const image = await wc.capturePage(); // Only captures viewport
```

**After:**
```javascript
// Get full page content size including scrollable area
const contentSize = await wc.executeJavaScript(`...`);

// Capture full content
const image = await wc.capturePage({
  x: 0,
  y: 0,
  width: contentSize.width,
  height: contentSize.height
});
```

### Content Size Calculation
Uses JavaScript to get the maximum of:
- `document.body.scrollWidth/Height`
- `document.body.offsetWidth/Height`
- `document.documentElement.clientWidth/Height`
- `document.documentElement.scrollWidth/Height`
- `document.documentElement.offsetWidth/Height`

### Scaling Process
1. Capture full page content at actual size
2. Scale down to 50% (configurable)
3. Return PNG with compression

## Why This Change
- Ensures screenshots capture the complete page content
- Fixes issues with scrollable pages being cut off
- Provides "真实大小" (real size) as requested by user
- Maintains performance with 50% scaling after full capture

## Verification
- Added console logging to verify content vs captured sizes
- Maintains backward compatibility
- Works with both cached and live screenshot methods