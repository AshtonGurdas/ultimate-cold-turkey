const siteInput = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const siteList = document.getElementById("siteList");
const statusDiv = document.getElementById("status");

// Load and display sites on popup open
loadSites();

// Add site on button click
addBtn.addEventListener("click", addSite);

// Add site on Enter key
siteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addSite();
  }
});

function addSite() {
  let domain = siteInput.value.trim().toLowerCase();
  
  if (!domain) {
    showStatus("Please enter a domain", "error");
    return;
  }

  // Clean up the input (remove http://, https://, www., trailing slashes)
  domain = domain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/\/.*$/, "");

  // Basic validation
  if (!domain.includes(".")) {
    showStatus("Please enter a valid domain (e.g., example.com)", "error");
    return;
  }

  // Get current list and add new site
  chrome.storage.local.get(["customSites"], (res) => {
    const sites = res.customSites || [];
    
    // Check if already exists
    if (sites.includes(domain)) {
      showStatus("This site is already blocked", "error");
      return;
    }

    // Add to list
    sites.push(domain);
    
    // Save back to storage
    chrome.storage.local.set({ customSites: sites }, () => {
      showStatus(`✓ Blocked ${domain}`, "success");
      siteInput.value = "";
      loadSites();
    });
  });
}

function removeSite(domain) {
  chrome.storage.local.get(["customSites"], (res) => {
    const sites = res.customSites || [];
    const filtered = sites.filter((s) => s !== domain);
    
    chrome.storage.local.set({ customSites: filtered }, () => {
      showStatus(`✓ Unblocked ${domain}`, "success");
      loadSites();
    });
  });
}

function loadSites() {
  chrome.storage.local.get(["customSites"], (res) => {
    const sites = res.customSites || [];
    
    if (sites.length === 0) {
      siteList.innerHTML = '<div class="empty-state">No custom sites blocked yet</div>';
      return;
    }

    // Sort alphabetically
    sites.sort();

    // Build HTML
    siteList.innerHTML = sites
      .map(
        (site) => `
        <div class="site-item">
          <span class="site-name">${escapeHtml(site)}</span>
          <button class="btn-remove" data-site="${escapeHtml(site)}">Remove</button>
        </div>
      `
      )
      .join("");

    // Add event listeners to remove buttons
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const site = e.target.getAttribute("data-site");
        removeSite(site);
      });
    });
  });
}

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusDiv.className = "status hidden";
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}