# Ultimate Cold Turkey 🧊

A strict Chrome extension for blocking adult content with an unbypassable 3-hour cooldown period.

## Features

✅ **Keyword & Domain Blocking** - Blocks known adult sites and keywords  
✅ **Custom Site Blocking** - Add your own distracting sites via popup UI  
✅ **3-Hour Cooldown** - Forces you to wait through urges (timer resets if you leave the page)  
✅ **Streak Tracking** - See how many days you've stayed clean  
✅ **Tab Reset Prevention** - Switching tabs resets the timer  
✅ **Incognito Mode Support** - Works in private browsing  

## Installation

1. Download or clone this repository:
```bash
   git clone https://github.com/AshtonGurdas/ultimate-cold-turkey.git
```
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the extension folder

## Usage

1. **Automatic Blocking**: The extension automatically blocks adult content based on keywords and domains
2. **Add Custom Sites**: Click the extension icon in your toolbar to add sites you want to block (e.g., social media, gaming sites)
3. **Cooldown System**: If you try to access blocked content, you'll face a 3-hour cooldown timer
4. **Track Progress**: The blocked page shows your current streak

## Files Structure
```
ultimate-cold-turkey/
├── background.js      # Main blocking logic & URL filtering
├── blocked.html       # Cooldown timer page (UI)
├── blocked.js         # Timer logic & streak tracking
├── popup.html         # Settings popup (UI)
├── popup.js           # Custom site management logic
├── manifest.json      # Extension configuration
└── README.md          # Documentation
```

## How It Works

1. **URL Monitoring**: Uses Chrome's `webNavigation` API to check every URL you visit
2. **Keyword Matching**: Scans URLs for adult content keywords
3. **Custom Blocking**: Checks user-added sites from Chrome's local storage
4. **Forced Cooldown**: Redirects to a 3-hour timer page that resets if you leave

## Tech Stack

- **Vanilla JavaScript** - No frameworks, pure JS
- **Chrome Extension APIs**:
  - `webNavigation` - URL monitoring
  - `storage.local` - Persistent data storage
  - `management` - Extension state detection
  - `tabs` - Tab manipulation
- **Chrome Manifest V3** - Latest extension standard

## Privacy

- ✅ All data stored **locally** using `chrome.storage.local`
- ✅ **No analytics** or tracking
- ✅ **No external servers** - completely offline
- ✅ **No permissions** beyond what's needed for blocking

## Limitations

This extension is designed for **personal accountability**, not as unbreakable security. Users with technical knowledge can:
- Disable the extension through Chrome settings
- Edit the hosts file or use system-level tools
- Use other browsers

For stronger blocking, consider combining with:
- DNS-level filtering (OpenDNS FamilyShield, CleanBrowsing)
- System hosts file modifications
- Router-level parental controls

## Contributing

This is a personal project, but suggestions are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Fork and submit pull requests
- Adapt the code for your own use

## License

MIT License - Free to use and modify for personal use.

## Acknowledgments

Built as a tool for personal growth and self-improvement. If this helps even one person build better habits, it was worth creating.

---

**Disclaimer**: This tool is meant to support personal accountability and should be used alongside healthy coping strategies and professional support when needed.
