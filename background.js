// URL of the remote block list
const blockListUrl = 'https://hacko1lyte.github.io/siteb/blocklist.json';

// Cache for the block list
let blockListCache = [];

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

    // Ensure blockList is an array of URLs or patterns
    if (!Array.isArray(blockList)) {
      throw new Error('Block list is not an array.');
    }

    // Update the cache
    blockListCache = blockList;

    console.log('Blocklist applied successfully.');
  } catch (error) {
    console.error('Error fetching or applying the blocklist:', error);
  }
}

// Request handler function
function blockRequestHandler(details) {
  const url = new URL(details.url);
  const isBlocked = blockListCache.some(domain => url.hostname.includes(domain));

  return { cancel: isBlocked }; // Block the request if it's in the block list
}

// Event listener for the extension installation
chrome.runtime.onInstalled.addListener(() => {
  fetchAndApplyBlocklist(); // Fetch and apply the block list when installed
});

// Event listener for browser startup
chrome.runtime.onStartup.addListener(() => {
  fetchAndApplyBlocklist(); // Fetch and apply the block list when the browser starts
});

// Event listener for web requests
chrome.webRequest.onBeforeRequest.addListener(
  blockRequestHandler,
  { urls: ["<all_urls>"] }, // Apply to all URLs
  ["blocking"]
);

// If you need to fetch updates manually, you can trigger fetchAndApplyBlocklist() 
// via a message or some other event if needed
