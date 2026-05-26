document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const checkFormBtn = document.getElementById("check-form-btn");
  const userInfoDiv = document.getElementById("user-info");
  const statusMsg = document.getElementById("status-msg");
  const userEmailP = document.getElementById("user-email");
  const resultsDiv = document.getElementById("results");
  const errorsList = document.getElementById("errors-list");

  // Check auth state
  chrome.storage.local.get(["userToken", "userEmail", "userId"], (result) => {
    if (result.userToken) {
      // Logged in
      loginBtn.style.display = "none";
      userInfoDiv.style.display = "block";
      statusMsg.style.display = "none";
      userEmailP.textContent = `Logged in: ${result.userEmail}`;
    } else {
      // Not logged in
      loginBtn.style.display = "block";
      userInfoDiv.style.display = "none";
      statusMsg.textContent = "Please login to use FormSathi.";
    }
  });

  loginBtn.addEventListener("click", () => {
    // In a real prod extension, we'd use chrome.identity or redirect to web app for auth
    // Here we redirect to our deployed app's login.
    chrome.tabs.create({ url: "https://formsathi-placeholder.com/login?from_extension=true" });
  });

  checkFormBtn.addEventListener("click", () => {
    statusMsg.style.display = "block";
    statusMsg.textContent = "Taking a snapshot and analyzing...";
    checkFormBtn.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "CAPTURE_AND_CHECK" }, (response) => {
        checkFormBtn.disabled = false;
        
        if (chrome.runtime.lastError) {
          statusMsg.textContent = "Cannot check this page. Please refresh or try another page.";
          return;
        }

        if (response && response.status === "error") {
          statusMsg.textContent = "Error: " + response.message;
        } else if (response && response.status === "success") {
          statusMsg.textContent = "Check complete!";
          const data = response.data;
          
          resultsDiv.style.display = "block";
          errorsList.innerHTML = "";

          if (data.status === "perfect") {
            const li = document.createElement("li");
            li.textContent = "Form looks perfect! No mismatches.";
            li.style.color = "#47C965";
            errorsList.appendChild(li);
          } else if (data.errors && data.errors.length > 0) {
            data.errors.forEach((err) => {
              const li = document.createElement("li");
              li.innerHTML = `<strong>${err.fieldName}:</strong> ${err.suggestion}`;
              li.style.color = "#E02020";
              errorsList.appendChild(li);
            });
          }
        }
      });
    });
  });
});
