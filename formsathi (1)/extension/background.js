// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_AND_CHECK") {
    // 1. Capture visible tab
    chrome.tabs.captureVisibleTab(null, { format: "png", quality: 80 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ status: "error", message: chrome.runtime.lastError.message });
        return;
      }
      
      // 2. Send image to API
      chrome.storage.local.get(["userToken"], (res) => {
        const token = res.userToken;
        if (!token) {
          sendResponse({ status: "error", message: "User not authenticated." });
          return;
        }

        fetch("http://localhost:3000/api/check-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            image: dataUrl
          })
        })
        .then(r => r.json())
        .then(data => {
          sendResponse({ status: "success", data: data });
        })
        .catch(err => {
          sendResponse({ status: "error", message: err.toString() });
        });
      });
    });

    // Important: return true to indicate async response
    return true; 
  }
});
