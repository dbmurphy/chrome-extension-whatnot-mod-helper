# WhatNot Mod Helper Tools Extension

A Chrome extension with helpful tools for WhatNot stream moderators. Currently includes buyer extraction and message template features, with more tools planned for the future.

## Features

### Buyers Tab

- Automatically extracts buyers from the activity feed
- Displays unique buyers in a clean list
- Copy all buyers to clipboard with one click
- Message template system to generate multiple messages
- Split buyers across multiple messages (configurable buyers per message)
- Works on any WhatNot stream page

### More Features

- Additional moderator tools coming soon!

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the folder containing the extension files
6. The extension should now appear in your extensions list

## Usage

1. Navigate to a Whatnot stream page (e.g., `https://www.whatnot.com/...`)
2. Make sure you're viewing the Activity tab (which shows auction winners)
3. Click the extension icon in your browser toolbar
4. Click "Extract Buyers" to scan the page for buyers
5. The list of unique buyers will be displayed
6. Click "Copy List" to copy all buyers to your clipboard (format: `@username` per line)

## How It Works

The extension:

- Scans the activity feed for items containing "won the auction"
- Extracts usernames from the buyer mentions (format: `@username`)
- Removes duplicates and sorts the list alphabetically
- Stores the list for easy access and copying

## Files Structure

```text
whatnot-buyers-extractor/
├── manifest.json      # Extension manifest (Manifest V3)
├── content.js         # Content script that runs on Whatnot pages
├── popup.html         # Popup UI HTML
├── popup.js           # Popup UI logic
├── README.md          # This file
└── icon16.png         # Extension icons (you'll need to create these)
    icon48.png
    icon128.png
```

## Notes

- The extension requires you to be on a Whatnot.com page to work
- It extracts buyers from the currently loaded activity feed items
- If you scroll down to load more activity items, click "Extract Buyers" again to include them
- The extension uses Chrome's Manifest V3

## Creating Icons

You'll need to create icon files (`icon16.png`, `icon48.png`, `icon128.png`) for the extension. You can use any image editor to create simple icons, or use online tools to generate them. Place them in the same directory as the other extension files.

## License

See LISCENSE.md
