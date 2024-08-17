// URL of the remote block list
const blockListUrl = 'https://hacko1lyte.github.io/siteb/blocklist.json';

// Function to fetch and apply the blocklist
async function fetchAndApplyBlocklist() {
  try {
    // Fetch the block list from the remote source
    const response = await fetch(blockListUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the block list
    const blockList = await response.json();
    
    // Apply the block list to block requests
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        return { cancel: true }; // Block the request
      },
      { urls: blockList },
      ["blocking"]
    );

    console.log('Blocklist applied successfully.');
  } catch (error) {
    console.error('Error fetching or applying the blocklist:', error);
  }
}

// Fetch and apply the blocklist when the extension is installed or updated
chrome.runtime.onInstalled.addListener(fetchAndApplyBlocklist);
chrome.runtime.onStartup.addListener(fetchAndApplyBlocklist);

// Optionally, fetch and apply the blocklist every hour to catch updates
setInterval(fetchAndApplyBlocklist, 60 * 60 * 1000); // Every hour
