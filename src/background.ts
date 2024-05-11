// Function to handle polling
// function polling() {
//   console.log("Polling every 30 seconds");
//   setTimeout(polling, 1000 * 30);
// }

// Function to handle tab switches
function trackTabSwitching() {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      console.log(`Tab switched to: ${tab.url}`);
    });
  });
}

function tabUpdates() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
      // This event is triggered when a tab is updated, e.g., when a page finishes loading
      console.log(`Tab updated and loaded: ${tab.url}`);
      // Implement additional logic as needed
    }
  });
}

function trackClicks() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Click received:", message);
    // You can add further processing or logging here

    // Optionally send a response back to the content script
    sendResponse({ status: "Click logged" });
  });
}

// Initialize tracking
function initTracking() {
  trackTabSwitching();
  tabUpdates();
  trackClicks();
}

// Call the initialize function when the extension is loaded
initTracking();
