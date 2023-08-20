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
        timerDiv.style.marginBottom = "60px";
        timerDiv.style.backgroundColor = "#333";
        timerDiv.style.color = "#FFF";
        timerDiv.style.borderRadius = "5px";
        timerDiv.style.fontSize = "100px";
        timerDiv.style.right = "10px";
        timerDiv.style.bottom = "10px";

        document.body.appendChild(timerDiv);
    }

    timerDiv.textContent = `Tid kvar: ${minutes}`;

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
    modal.textContent = "Nu är det roliga slut, lämna gärna tillbaka pilarna i baren";
    document.body.appendChild(modal);
}

function removeModal() {
    const modal = document.getElementById("timeoutModal");
    if (modal) {
        modal.remove();
    }
}

function removeTimer() {
    const timerDiv = document.getElementById("overlayTimer");
    if (timerDiv) {
        timerDiv.remove();
    }
}

function checkAndUpdateTimer() {
    chrome.runtime.sendMessage({ action: "getTimer" }, response => {
        if (response && response.timer) {
            displayTimer(response.timer.remainingTime);
        }
    });
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "showModal") {
        showModal();
    } else if (message.action === "removeModal") {
        removeModal();
    } else if (message.action === "removeModalAndTimer") {
        removeModal();
        removeTimer();
    }
});

function toggleTimerMenu() {
    const timerMenu = document.getElementById("timerMenu");
    if (timerMenu.style.display === "none") {
        timerMenu.style.display = "block";
    } else {
        timerMenu.style.display = "none";
    }
}

function showTimerUI() {
    // Main Timer button
    const timerButton = document.createElement("button");
    timerButton.id = "mainTimerButton";
    timerButton.style.position = "fixed";
    timerButton.style.zIndex = "9999";
    timerButton.style.right = "10px";
    timerButton.style.bottom = "10px";
    timerButton.style.padding = "0"; // Remove padding to make the icon fit better
    timerButton.style.border = "none";
    timerButton.style.background = "transparent";
    timerButton.style.cursor = "pointer";

    const timerIcon = document.createElement("img");
    timerIcon.src = chrome.runtime.getURL("icons/icon16.png");  // changed from chrome.extension.getURL
    timerIcon.alt = "Timer";
    timerIcon.style.width = "16px"; // Adjust if you want a different size
    timerIcon.style.height = "16px";

    timerButton.appendChild(timerIcon);

    // Timer Menu UI
    const timerMenu = document.createElement("div");
    timerMenu.id = "timerMenu";
    timerMenu.style.position = "fixed";
    timerMenu.style.zIndex = "9998";
    timerMenu.style.right = "10px";
    timerMenu.style.bottom = "50px";
    timerMenu.style.backgroundColor = "#FFF";
    timerMenu.style.border = "1px solid #ccc";
    timerMenu.style.borderRadius = "5px";
    timerMenu.style.padding = "10px";
    timerMenu.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
    timerMenu.style.display = "none"; // Ensure this is set to 'none'

    timerMenu.innerHTML = `
        <button data-time="55">55 minutes</button>
        <button data-time="115">115 minutes</button>
        <input type="number" id="customTimeInput" min="1" max="999" placeholder="Enter minutes">
        <button id="startCustomTimer">Start Timer</button>
        <button id="removeTimer">Remove Timer</button>
    `;

    // Append to document body
    document.body.appendChild(timerButton);
    document.body.appendChild(timerMenu);

    // Toggle timer menu function
    function toggleTimerMenu() {
        if (timerMenu.style.display === "none") {
            timerMenu.style.display = "block";
        } else {
            timerMenu.style.display = "none";
        }
    }

    // Event listeners
    timerButton.addEventListener('click', toggleTimerMenu);

    document.querySelector('[data-time="55"]').addEventListener('click', function () {
        startTimer(55);
    });

    document.querySelector('[data-time="115"]').addEventListener('click', function () {
        startTimer(115);
    });

    document.getElementById('startCustomTimer').addEventListener('click', function () {
        const minutes = document.getElementById('customTimeInput').value;
        if (minutes) startTimer(parseInt(minutes));
    });

    document.getElementById('removeTimer').addEventListener('click', function () {
        toggleTimerMenu(); // Hide the menu
        removeTimer();     // Remove the timer
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
    // Logic here to start the timer
    toggleTimerMenu(); // Hide the menu once a timer is selected
    displayTimer(minutes * 60);
}


showTimerUI();

// Check and update timer every second
setInterval(checkAndUpdateTimer, 1000);
