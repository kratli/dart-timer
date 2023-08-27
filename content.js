console.log("Content script loaded");

function displayTimer(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  let timerDiv = document.getElementById("overlayTimer");
  if (!timerDiv) {
    timerDiv = document.createElement("div");
    timerDiv.id = "overlayTimer";
    timerDiv.style.position = "fixed";
    timerDiv.style.zIndex = "9999";
    timerDiv.style.padding = "5px 10px";
    timerDiv.style.marginTop = "6px";
    // timerDiv.style.backgroundColor = "#333";
    timerDiv.style.color = "#FFF";
    timerDiv.style.borderRadius = "5px";
    timerDiv.style.fontSize = "20px";
    timerDiv.style.right = "350px";
    timerDiv.style.top = "10px";

    document.body.appendChild(timerDiv);
  }

  timerDiv.textContent = `Tid kvar: ${minutes} min`;

  if (time <= 0) {
    timerDiv.remove();
  }
}

function showModal() {
  const modal = document.createElement("div");
  modal.id = "timeoutModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 1)";
  modal.style.zIndex = "10000";
  modal.style.color = "#FFF";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.fontSize = "48px";
  modal.textContent = "Nu är det roliga slut! Lämna tillbaka pilarna i baren.";
  document.body.appendChild(modal);
  shouldPoll = false;
}

function removeModal() {
  const modal = document.getElementById("timeoutModal");
  if (modal) {
    modal.remove();
  }
}

function removeTimer() {
    console.log("removeTimer called");
  const timerDiv = document.getElementById("overlayTimer");
  if (timerDiv) {
    timerDiv.remove();
  }
}

let shouldPoll = true;

function checkAndUpdateTimer() {
  if (shouldPoll) {
    console.log("checking and updating timer");
    chrome.runtime.sendMessage({ action: "getTimer" }, (response) => {
      console.log("response is");
      console.log(response);
      if (response && response.timer) {
        displayTimer(response.timer.remainingTime);
      }
    });
  }
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "showModal" && shouldPoll) {
    showModal();
  } else if (message.action === "removeModal") {
    removeModal();
  } else if (message.action === "removeModalAndTimer") {
    removeModal();
    removeTimer();
  }
});

function showTimerUI() {
  // Main Timer button
  const timerButton = document.createElement("button");
  timerButton.id = "mainTimerButton";
  timerButton.style.position = "fixed";
  timerButton.style.zIndex = "10001";
  timerButton.style.right = "10px";
  timerButton.style.bottom = "10px";
  timerButton.style.padding = "0"; // Remove padding to make the icon fit better
  timerButton.style.border = "none";
  timerButton.style.background = "transparent";
  timerButton.style.cursor = "pointer";

  const timerIcon = document.createElement("img");
  timerIcon.src = chrome.runtime.getURL("icons/icon48.png"); // changed from chrome.extension.getURL
  timerIcon.alt = "Timer";
  timerIcon.style.width = "48px"; // Adjust if you want a different size
  timerIcon.style.height = "48px";

  timerButton.appendChild(timerIcon);

  // Timer Menu UI
  const timerMenu = document.createElement("div");
  timerMenu.id = "timerMenu";
  timerMenu.style.position = "fixed";
  timerMenu.style.zIndex = "10001";
  timerMenu.style.right = "10px";
  timerMenu.style.bottom = "50px";
  timerMenu.style.backgroundColor = "#FFF";
  timerMenu.style.border = "1px solid #ccc";
  timerMenu.style.borderRadius = "5px";
  timerMenu.style.padding = "10px";
  timerMenu.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  timerMenu.style.display = "none"; // Ensure this is set to 'none'

  timerMenu.innerHTML = `
  <input id="startCustomTimer" type="button" value="Start Timer" style="
  background-color: #04AA6D;
  border: none;
  color: white;
  padding: 12px 32px;
  text-decoration: none;
  cursor: pointer;
">
    <input data-time="55" type="button" value="55 minutes" style="
    background-color: #04AA6D;
    border: none;
    color: white;
    padding: 12px 32px;
    text-decoration: none;
    cursor: pointer;
">
<input data-time="115" type="button" value="115 minutes" style="
background-color: #04AA6D;
border: none;
color: white;
padding: 12px 32px;
text-decoration: none;
cursor: pointer;
">
        <input type="number" id="customTimeInput" min="1" max="999" placeholder="Enter minutes" style="
        font-size: .83333em;
        width: 200px!important;
        height: 42px;
        line-height: 1.65 !important;
        float: left;
        display: block;
        padding: 0;
        margin: 0;
        padding-left: 20px;
        border: 1px solid #eee;
        line-height: 1.2;
    ">
   
<input id="removeTimer" type="button" value="Remove Timer" style="
    background-color: #04AA6D;
    border: none;
    color: white;
    padding: 12px 32px;
    text-decoration: none;
    cursor: pointer;
">
    `;

  // Append to document body
  document.body.appendChild(timerButton);
  document.body.appendChild(timerMenu);

  // Toggle timer menu function
  function toggleTimerMenu() {
      console.log("toggleTimerMenu called");
    if (timerMenu.style.display === "none") {
      timerMenu.style.display = "block";
    } else {
      timerMenu.style.display = "none";
    }
  }

  // Helper function to remove the timeoutModal if it's present
  function removeTimeoutModal() {
    console.log("removeTimeoutModal called");
    const modal = document.getElementById("timeoutModal");
    if (modal) {
      modal.remove();
    }
  }

  // Event listeners
  timerButton.addEventListener("click", toggleTimerMenu);

  document
    .querySelector('[data-time="55"]')
    .addEventListener("click", function () {
      removeTimeoutModal();
      startTimer(55);
    });

  document
    .querySelector('[data-time="115"]')
    .addEventListener("click", function () {
      removeTimeoutModal();
      startTimer(115);
    });

  document
    .getElementById("startCustomTimer")
    .addEventListener("click", function () {
      removeTimeoutModal();
      let minutesStr = document.getElementById("customTimeInput").value;

      // Replace comma with period for decimal notation
      minutesStr = minutesStr.replace(",", ".");

      const minutes = parseFloat(minutesStr);

      if (!isNaN(minutes) && minutes > 0) {
        removeTimeoutModal();
        console.log("time chosen:" + minutes);
        startTimer(minutes);
      }
    });

  document.getElementById("removeTimer").addEventListener("click", function () {
      console.log("removeTimer called")
    toggleTimerMenu(); // Hide the menu
    removeTimeoutModal();
    removeTimer(); // Remove the timer
    shouldPoll = false;
  });
}

function toggleTimerMenu() {
  const timerMenu = document.getElementById("timerMenu");
  if (timerMenu.style.display === "none") {
    timerMenu.style.display = "block";
  } else {
    timerMenu.style.display = "none";
  }
}

function startTimer(minutes) {
  shouldPoll = true;
  toggleTimerMenu();
  displayTimer(minutes * 60);

  // Get the active tab to extract its ID
  chrome.runtime.sendMessage({ action: "getTabId" }, function (response) {
    if (response && response.tabId) {
      // Send the message with the tabId
      chrome.runtime.sendMessage({
        action: "startTimer",
        time: minutes,
        tabId: response.tabId,
      });
    }
  });
}

showTimerUI();

// Check and update timer every second
setInterval(checkAndUpdateTimer, 1000);
