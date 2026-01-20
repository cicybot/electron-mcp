# Changelog: Remove scaling from window screenshots - keep original size

## Changes Made

### Window Screenshot Scaling Removed
- Removed 50% scaling from `captureWindowLive()` in `screenshot-cache-service.js`
- Removed scaling from `captureScreenshot()` in `screenshot-service.js`
- Window screenshots now return full resolution images

## Technical Details

### Previous Behavior
- Captured full page content
- Scaled images to 50% size (configurable)
- Returned compressed PNG at half resolution

### New Behavior
- Captures full page content
- Returns images at original resolution (no scaling)
- Maintains PNG compression

### Code Changes

**Before (with scaling):**
```javascript
// Scale to half size for window screenshots
const scaleFactor = 0.5;
const scaled = image.resize({
  width: Math.floor(capturedSize.width * scaleFactor),
  height: Math.floor(capturedSize.height * scaleFactor),
});
return scaled.toPNG();
```

**After (no scaling):**
```javascript
// Return full resolution image (no scaling)
return image.toPNG();
```

## Why This Change
- User requested "保持原样 不要缩小" (keep original, don't shrink)
- Window screenshots should show full resolution for detail preservation
- Allows clients to handle scaling as needed
- Maintains data integrity for important content

## Impact
- **File Size**: Larger (no compression from scaling)
- **Resolution**: Full original resolution maintained
- **Quality**: No loss from scaling down then up
- **Compatibility**: May require client-side adjustments for display

## Verification
- Console logging updated to reflect full resolution output
- Maintains full page content capture logic
- PNG compression still applied for file size optimization