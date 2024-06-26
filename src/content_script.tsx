console.log("Content script loaded and running.");

document.addEventListener("click", (event) => {
  // Prepare message data, possibly including click coordinates or element details
  const clickData = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    //@ts-ignore
    element: event.target.tagName, // simple identifier, you might want more detail
    //@ts-ignore
    text: event.target.innerText,
  };

  // Send this data to the background script
  chrome.runtime.sendMessage(clickData);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getMostPopularWebsites") {
    getMostPopularWebsites()
      .then((data) => {
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true; // Return true to indicate you wish to send a response asynchronously
  }
});
