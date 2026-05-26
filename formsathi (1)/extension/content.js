// content.js
// Injects a floating button on pages with forms

function injectFloatingButton() {
  // Check if button already exists
  if (document.getElementById("formsathi-floating-btn")) return;

  // We lazily only inject if we find <form> elements or inputs
  const hasFormElements = document.querySelector("form") !== null || document.querySelectorAll("input").length > 3;
  if (!hasFormElements) return;

  const btn = document.createElement("button");
  btn.id = "formsathi-floating-btn";
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> Check Form`;
  
  // Basic styles
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#3B66F5",
    color: "#ffffff",
    border: "none",
    borderRadius: "24px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59, 102, 245, 0.3)",
    zIndex: "999999",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s"
  });

  btn.addEventListener("mouseover", () => {
    btn.style.backgroundColor = "#2F52C7";
  });
  
  btn.addEventListener("mouseout", () => {
    btn.style.backgroundColor = "#3B66F5";
  });

  btn.addEventListener("click", () => {
    btn.innerHTML = "Scanning...";
    btn.disabled = true;

    // Send message to background script to trigger check
    chrome.runtime.sendMessage({ action: "EXTRACT_AND_CHECK" }, (response) => {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> Check Again`;
      btn.disabled = false;

      if (response && response.status === "error") {
        alert("FormSathi Error: " + response.message + "\\n(Please make sure you are logged into the extension)");
      } else if (response && response.status === "success") {
        const data = response.data;
        if (data.status === "perfect") {
          alert("🎉 FormSathi: Your form looks perfect!");
        } else if (data.errors && data.errors.length > 0) {
          let errorMsg = "⚠️ FormSathi found mismatches:\\n\\n";
          data.errors.forEach(e => {
            errorMsg += `- ${e.fieldName}: ${e.suggestion}\\n`;
          });
          alert(errorMsg);
        } else if (data.clarificationNeeded) {
          alert("FormSathi Question:\\n" + data.clarificationQuestion);
        }
      }
    });
  });

  document.body.appendChild(btn);
}

// Add our receiver for clicks from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CAPTURE_AND_CHECK") {
    // Forward the message wrapper to background script
    chrome.runtime.sendMessage({ action: "EXTRACT_AND_CHECK" }, (response) => {
      sendResponse(response);
    });
    return true; // async
  }
});

// Run once DOM is somewhat loaded
setTimeout(injectFloatingButton, 1000);
