type EventType = "click" | "tab-updated";

type LogEvent = {
  type: string;
  data: any;
};

type TabEventInfo = {
  id?: number;
  url?: string;
  title?: string;
  favIconUrl?: string;
  content: string;
};

type ClickEventInfo = {
  url?: string;
  timestamp?: string;
  element?: string;
  text?: string;
};

const collectedEvents: LogEvent[] = [];
// Function to handle tab switches
function trackTabSwitching() {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, async function (tab) {
      console.log(`Tab switched to: ${tab.url}`);
    });
  });
}

const extractTabData = async (tab: chrome.tabs.Tab): Promise<TabEventInfo> => {
  const tabContentPlain = await fetch(tab.url!).then((response) =>
    response.text()
  );
  return {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    favIconUrl: tab.favIconUrl,
    content: tabContentPlain,
  };
};

function tabUpdates() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
      chrome.tabs.get(tabId, async function (tab) {
        const tabData = await extractTabData(tab);
        collectedEvents.push({
          type: "tab-updated",
          data: tabData,
        });
      });
      console.log(`Tab updated and loaded: ${tab.url}`);
      // Implement additional logic as needed
    }
  });
}

function trackClicks() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Click received:", message);
    collectedEvents.push({
      type: "click",
      data: message,
    });
    // You can add further processing or logging here

    // Optionally send a response back to the content script
    sendResponse({ status: "Click logged" });
  });
}

interface TabTimeInfo {
  startTime: number;
  lastActive: number;
  endTime?: number;
}

const tabTime: Record<number, TabTimeInfo> = {};

chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  const currentTime = Date.now();

  // Update the currently activated tab's time info or initialize it
  if (tabTime[activeInfo.tabId]) {
    tabTime[activeInfo.tabId].lastActive = currentTime;
  } else {
    tabTime[activeInfo.tabId] = {
      startTime: currentTime,
      lastActive: currentTime,
    };
  }

  // Update all other tabs as inactive
  Object.keys(tabTime).forEach((tabId) => {
    const numericTabId = parseInt(tabId);
    if (
      numericTabId !== activeInfo.tabId &&
      tabTime[numericTabId].endTime === undefined
    ) {
      tabTime[numericTabId].endTime = currentTime;
      const sessionLength = currentTime - tabTime[numericTabId].lastActive;
      console.log(`Tab ${tabId} was active for ${sessionLength} ms`);
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId: number) => {
  const currentTime = Date.now();
  if (tabTime[tabId]) {
    tabTime[tabId].endTime = currentTime;
    const sessionLength = currentTime - tabTime[tabId].lastActive;
    console.log(
      `Tab ${tabId} closed after being active for ${sessionLength} ms`
    );
    delete tabTime[tabId];
  }
});

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    if (changeInfo.status === "complete" && tab.active) {
      tabTime[tabId] = { startTime: Date.now(), lastActive: Date.now() };
      console.log(`Tab ${tabId} updated and reloaded.`);
    }
  }
);

// Initialize tracking
function initTracking() {
  trackTabSwitching();
  tabUpdates();
  trackClicks();
}

// Call the initialize function when the extension is loaded
initTracking();
