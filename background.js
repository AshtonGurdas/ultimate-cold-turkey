// MASSIVE UPGRADED FILTER

const BLOCK_KEYWORDS = [
  "porn", "adult", "xxx", "sex", "nsfw", "hentai", "anime porn", "rule34",
  "bdsm", "cam", "escort", "webcam", "jerk", "nude", "hot girl",
  "onlyfans", "leak", "nsfw", "shemale", "trans", "gay porn", "loli", "futanari",
  "jav", "av", "uncensored", "censored", "idol", "gravure", "yua mikami",
  "missav", "fc2", "pornhub", "xvideos", "redtube", "brazzers", "spankbang",
  "xnxx", "xhamster", "nhentai", "asmr nsfw"
];

// KNOWN ADULT DOMAINS (this list can be expanded easily)
const BLOCK_DOMAINS = [
  "pornhub.com", "missav.com", "xvideos.com", "xhamster.com", "xnxx.com",
  "spankbang.com", "brazzers.com", "redtube.com", "nhentai.net",
  "onlyfans.com", "rule34.xxx", "jav.guru", "javhd.com", "javfull.net",
  "pornflip.com", "pornone.com", "porn.com", "bejav.net", "fc2.com",
  "prothots.com"
];

function shouldBlock(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const full = url.toLowerCase();

    // Domain match
    if (BLOCK_DOMAINS.some(d => host.includes(d))) return true;

    // Keyword match anywhere in URL
    if (BLOCK_KEYWORDS.some(kw => full.includes(kw))) return true;

    // Regex match for disguised phrases like "adult film"
    const disguiseRegex = /(adult\s*(film|movie|clips|video|content))/i;
    if (disguiseRegex.test(full)) return true;

    return false;
  } catch (e) {
    return false;
  }
}

// Custom blocking function for user-added sites
function shouldBlockCustom(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    return new Promise((resolve) => {
      chrome.storage.local.get(["customSites"], (res) => {
        const list = res.customSites || [];
        resolve(list.some((d) => host.includes(d)));
      });
    });
  } catch (e) {
    return Promise.resolve(false);
  }
}

// Main navigation listener with custom blocking support
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId !== 0) return;

    // Check both default blocks and custom blocks
    shouldBlockCustom(details.url).then((customBlocked) => {
      if (customBlocked || shouldBlock(details.url)) {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocked.html")
        });
      }
    });
  },
  {
    url: [{ schemes: ["http", "https"] }]
  }
);

// Detect attempts to disable or remove the extension
chrome.management.onEnabled.addListener(() => {
  // Nothing needed here, but required for listener
});

chrome.management.onDisabled.addListener(() => {
  triggerPunishment("disable attempt detected");
});

chrome.management.onUninstalled.addListener(() => {
  triggerPunishment("uninstall attempt detected");
});

function triggerPunishment(reason) {
  // Opens the blocked page to immediately begin the 3-hour cooldown
  chrome.tabs.create({
    url: chrome.runtime.getURL("blocked.html")
  });

  // Optional: close all other tabs to prevent escape
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
}