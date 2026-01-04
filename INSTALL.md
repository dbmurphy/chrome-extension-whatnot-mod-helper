# How to Load the Chrome Extension Manually

## Step-by-Step Instructions

### 1. Prepare the Extension Files

Make sure you have all the required files in one folder:
- `manifest.json`
- `content.js`
- `popup.html`
- `popup.js`
- `README.md`

**Note about icons:** The extension references icon files (`icon16.png`, `icon48.png`, `icon128.png`). You have two options:

**Option A (Recommended for testing):** Create simple placeholder icons
- Create 16x16, 48x48, and 128x128 pixel PNG images
- Name them `icon16.png`, `icon48.png`, `icon128.png`
- Place them in the same folder

**Option B:** Modify manifest.json to remove icon references (see below)

### 2. Open Chrome Extensions Page

1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar and press Enter
   - OR go to: Menu (three dots) → More Tools → Extensions

### 3. Enable Developer Mode

1. Look for the "Developer mode" toggle in the top-right corner
2. Toggle it ON (it should turn blue/enabled)

### 4. Load the Extension

1. Click the "Load unpacked" button (appears after enabling Developer Mode)
2. Navigate to the folder containing your extension files
3. Select the folder and click "Select Folder" (or "Open" on Mac)

### 5. Verify Installation

- The extension should now appear in your extensions list
- You should see "Whatnot Buyers Extractor" in the list
- If icons are missing, you'll see a default puzzle piece icon (that's okay for testing)

### 6. Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon in Chrome's toolbar (extensions menu)
2. Find "Whatnot Buyers Extractor"
3. Click the pin icon to pin it to your toolbar for easy access

### 7. Test the Extension

1. Navigate to a Whatnot stream page (e.g., `https://www.whatnot.com/...`)
2. Make sure you're viewing the Activity tab
3. Click the extension icon in your toolbar
4. Click "Extract Buyers" button
5. The list should populate with buyers

## Troubleshooting

### Error: "Manifest file is missing or unreadable"
- Make sure `manifest.json` is in the root of the folder you selected
- Check that the file is named exactly `manifest.json` (case-sensitive)

### Error: "Service worker registration failed" or "Could not load manifest"
- Open the extension details (click "Details" under the extension)
- Check "Errors" section for specific issues
- Make sure all files are present and properly formatted

### Extension icon shows as a puzzle piece
- This is normal if icon files are missing
- The extension will still work, just without a custom icon
- You can create simple icons or remove icon references from manifest.json

### Extension doesn't appear after loading
- Refresh the extensions page
- Check that Developer Mode is enabled
- Make sure you selected the correct folder

### "Extract Buyers" finds no buyers
- Make sure you're on a Whatnot.com page
- Make sure you're viewing the Activity tab (not Chat)
- Scroll through the activity feed to load more items
- Click "Extract Buyers" again after scrolling

## Quick Fix: Remove Icon References (Optional)

If you don't want to create icons right now, you can temporarily remove icon references from `manifest.json`:

1. Open `manifest.json`
2. Remove or comment out these sections:
   - The `"default_icon"` object inside `"action"`
   - The entire `"icons"` object at the root level

3. The extension will still work, just without custom icons

Example of modified manifest.json (without icons):

```json
{
  "manifest_version": 3,
  "name": "Whatnot Buyers Extractor",
  "version": "1.0.0",
  "description": "Extract a list of buyers from Whatnot stream pages",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "https://www.whatnot.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["https://www.whatnot.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
```

## Reloading After Making Changes

When you make changes to the extension files:

1. Go to `chrome://extensions/`
2. Find your extension
3. Click the refresh/reload icon (circular arrow) on the extension card
4. Or toggle the extension off and on again

This reloads the extension with your latest changes.

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Whatnot Buyers Extractor"
3. Click "Remove"
4. Confirm removal
