console.log("Content script loaded");

function displayTimer(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    let timerDiv = document.getElementById("overlayTimer");
    if (!timerDiv) {
        timerDiv = document.createElement("div");
        timerDiv.id = "overlayTimer";
        timerDiv.style.position = "fixed";
        timerDiv.style.top = "10px";
        timerDiv.style.right = "10px";
        timerDiv.style.zIndex = "9999";
        timerDiv.style.padding = "5px 10px";
        timerDiv.style.backgroundColor = "#333";
        timerDiv.style.color = "#FFF";
        timerDiv.style.borderRadius = "5px";
        timerDiv.style.fontSize = "55px";

        document.body.appendChild(timerDiv);
    }

    timerDiv.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;

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

function removeTimer(){
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

chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "showModal") {
        showModal();
    } else if (message.action === "removeModal") {
        removeModal();
    } else if (message.action === "removeModalAndTimer") {
        removeModal();
        removeTimer();        
    }
});

// Check timer on initial load
checkAndUpdateTimer();

// Set up an interval to keep checking and updating the timer every second
setInterval(checkAndUpdateTimer, 1000);
