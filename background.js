async function loadBlocklist() {
  // Replace this URL with your actual external blocklist URL
  const blocklistUrl = 'https://hacko1lyte.github.io/siteb/blocklist.json';
  
  try {
    const response = await fetch(blocklistUrl);

    // Check if the response is ok (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure that the blocked_sites property exists and is an array
    if (!data.blocked_sites || !Array.isArray(data.blocked_sites)) {
      throw new Error('Invalid blocklist format: blocked_sites is missing or not an array');
    }

    return data.blocked_sites.map(site => `*://${site}/*`);
  } catch (error) {
    console.error('Error loading blocklist:', error);
    return []; // Return an empty array if there's an error
  }
}

async function setupBlockingRules() {
  const blockedSites = await loadBlocklist();

  if (blockedSites.length === 0) {
    console.warn('No sites to block. Please check the blocklist.');
    return; // Exit if there are no sites to block
  }

  const rules = blockedSites.map(site => ({
    id: site,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: site,
      resourceTypes: ["main_frame"]
    }
  }));

  // Update dynamic rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: blockedSites
  });
}

// Set up the blocking rules when the service worker is installed
chrome.runtime.onInstalled.addListener(setupBlockingRules);