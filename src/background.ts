let db: IDBDatabase;

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

function openDatabase() {
  const request = indexedDB.open("EventDatabase", 2); // Increment the version if necessary to trigger onupgradeneeded

  request.onupgradeneeded = function (event) {
    const db = request.result;
    let store;

    if (!db.objectStoreNames.contains("events")) {
      // Create the object store with autoIncrement if it doesn't exist
      store = db.createObjectStore("events", { autoIncrement: true });
    } else {
      // Access the existing store if it already exists
      store = request?.transaction?.objectStore("events");
    }

    // Create an index on the 'timestamp' field if it doesn't exist
    if (!store?.indexNames.contains("timestamp")) {
      store?.createIndex("timestamp", "timestamp", { unique: false });
    }
  };

  request.onerror = function (event) {
    console.error("Database error: ", request.error);
  };

  request.onsuccess = function (event) {
    db = request.result;
    console.log("Database initialized successfully");
  };
}

const collectedEvents: LogEvent[] = [];
// Function to handle tab switches
function trackTabSwitching() {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, async function (tab) {
      console.log(`Tab switched to: ${tab.url}`);
      const tabData = extractTabData(tab);
      const category = await postEvent({
        content: tabData.url,
      });
      const data = { ...tabData, category };

      collectedEvents.push({
        type: "tab-updated",
        data: data,
      });
    });
  });
}

const extractTabData = (tab: chrome.tabs.Tab): TabEventInfo => {
  return {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    favIconUrl: tab.favIconUrl,
    content: "",
  };
};

// function tabUpdates() {
//   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.active) {
//       chrome.tabs.get(tabId, async function (tab) {
//         const tabData = extractTabData(tab);
//         console.log(
//           `tabData: ${JSON.stringify({
//             ...tabData,
//             content: tabData.content.slice(0, 10),
//           })}`
//         );
//         collectedEvents.push({
//           type: "tab-updated",
//           data: tabData,
//         });
//       });
//       console.log(`Tab updated and loaded: ${tab.url}`);
//       // Implement additional logic as needed
//     }
//   });
// }

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

// async function processAndStoreEvents() {
//   try {
//     console.log("Processing events...");
//     const documents = collectedEvents.map(
//       (event) =>
//         new Document({
//           text: JSON.stringify(event.data),
//           id_: `${event.type}-${Date.now()}`,
//         })
//     );

//     if (documents.length > 0) {
//       console.log("Storing events...");
//       const storageContext = await storageContextFromDefaults({
//         vectorStore: chromaVS,
//       });
//       const index = await VectorStoreIndex.fromDocuments(documents, {
//         storageContext: storageContext,
//       });
//       console.log("Index created.");
//       const queryEngine = index.asQueryEngine();

//       const query = "What is the meaning of life?";
//       const results = await queryEngine.query({ query });
//       console.log("Query Results:", results);

//       collectedEvents.length = 0; // Clear the events after processing
//     }
//   } catch (error) {
//     console.error("Error processing events:", error);
//   }
// }

function saveEventsToIndexedDB() {
  if (collectedEvents.length > 0 && db) {
    const transaction = db.transaction(["events"], "readwrite");
    const store = transaction.objectStore("events");

    const timestamp = Date.now(); // Get current time in milliseconds
    collectedEvents.forEach((event) => {
      store.add({ ...event, timestamp }); // Add timestamp to each event before storing
    });

    transaction.oncomplete = () => {
      console.log(`Stored ${collectedEvents.length} events to IndexedDB.`);
      collectedEvents.length = 0; // Clear the events after storing
    };

    transaction.onerror = (event) => {
      console.error("Transaction error:", transaction.error);
    };
  } else {
    console.log("Database is not initialized or no events to save.");
  }
}

async function getDataFromLastTwoMinutes(): Promise<LogEvent[]> {
  return new Promise((resolve, reject) => {
    const twoMinutesAgo = Date.now() - 120000; // 120000 milliseconds (2 minutes)
    const transaction = db.transaction(["events"], "readonly");
    const store = transaction.objectStore("events");
    const range = IDBKeyRange.lowerBound(twoMinutesAgo);
    const index = store.index("timestamp"); // Ensure you have an index on 'timestamp' in your object store
    const request = index.openCursor(range);
    const events: LogEvent[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        events.push(cursor.value); // Collect all events from the last two minutes
        cursor.continue();
      } else {
        resolve(events); // When no more data, resolve the collected events
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function getAllStoredData(): Promise<LogEvent[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["events"], "readonly");
    const store = transaction.objectStore("events");
    const request = store.openCursor();
    const events: LogEvent[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        events.push(cursor.value); // Collect all events
        console.log(1);
        console.log(cursor.value);
        console.log(1);
        cursor.continue();
      } else {
        resolve(events); // When no more data, resolve the collected events
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function postEvent(content: any): Promise<string> {
  const url = "http://127.0.0.1:5000/classify";
  const body = JSON.stringify(content);

  console.log("Posting event:", body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (response.status === 200) {
      console.log("Request successful!");
      const data = await response.json();
      // Assuming the response JSON structure is correct
      if (data.category) {
        console.log("Category received:", data.category);
        return data; // This will return the response object including the category
      } else {
        console.error("Malformed response, category missing");
        throw new Error("Malformed response, category missing");
      }
    } else {
      return "Other";
    }
  } catch (error) {
    return "Other";
  }
}
async function getTopFrequentEventsFromLastTenSeconds(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const tenSecondsAgo = Date.now() - 10000; // 10000 milliseconds (10 seconds)
    const transaction = db.transaction(["events"], "readonly");
    const store = transaction.objectStore("events");
    const index = store.index("timestamp"); // Ensure this index exists
    const range = IDBKeyRange.lowerBound(tenSecondsAgo);
    const request = index.openCursor(range);
    const eventFrequency: { [key: string]: number } = {};

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const data: LogEvent = cursor.value;
        const eventType = data.type; // Assume 'type' is what you're aggregating by
        if (eventFrequency[eventType]) {
          eventFrequency[eventType]++;
        } else {
          eventFrequency[eventType] = 1;
        }
        cursor.continue();
      } else {
        // No more entries, sort and resolve the top 20
        const sortedEvents = Object.keys(eventFrequency)
          .map((key) => ({ type: key, count: eventFrequency[key] }))
          .sort((a, b) => b.count - a.count) // Sort by frequency, descending
          .slice(0, 20); // Top 20 events
        console.log(`Top 20 events from the last 10 seconds:`, sortedEvents);
        resolve(sortedEvents);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Initialize tracking
function initTracking() {
  openDatabase();
  trackTabSwitching();
  // tabUpdates();
  trackClicks();
  setInterval(saveEventsToIndexedDB, 10000);
  setInterval(getTopFrequentEventsFromLastTenSeconds, 10000);
}

// Call the initialize function when the extension is loaded
initTracking();
