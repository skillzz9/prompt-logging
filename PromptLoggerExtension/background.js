// This runs in the background of Chrome
console.log("Service Worker Started!");

// Listen for messages from your Next.js app (External)
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log("Message received from website:", sender.url);

    if (request.action === "getHistory") {
      // Pull prompts from local storage
      chrome.storage.local.get({ promptHistory: [] }, (data) => {
        console.log("Sending data back to Next.js:", data.promptHistory);
        sendResponse({ history: data.promptHistory });
      });

      // Return true to keep the message channel open for the async storage call
      return true;
    } else if (request.action === "clearHistory") {
      chrome.storage.local.set({ promptHistory: [] }, () => {
        console.log("History cleared via Website");
        sendResponse({ success: true });
      });
      return true;
    }
  },
);

// Optional: Listen for internal messages (from your popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "alive" });
  }
});
