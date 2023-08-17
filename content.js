console.log("Content script loaded");

function displayTimer(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    let timerDiv = document.getElementById("overlayTimer");
    console.log("timer div is: " + timerDiv);
    if (!timerDiv) {
        console.log("we found no timer div, so we try to create one"); 
        timerDiv = document.createElement("div");
        timerDiv.id = "overlayTimer";
        timerDiv.style.position = "fixed";
        timerDiv.style.top = "10px";
        timerDiv.style.right = "10px";
        timerDiv.style.zIndex = 9999;
        timerDiv.style.padding = "5px 10px";
        timerDiv.style.backgroundColor = "#333";
        timerDiv.style.color = "#FFF";
        timerDiv.style.borderRadius = "5px";
        timerDiv.style.fontSize = "16px";

        document.body.appendChild(timerDiv);
    }
    console.log("timerDiv is now: " + timerDiv);
    timerDiv.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;

    if (time <= 0) {
        timerDiv.remove();
    }
}

function checkAndUpdateTimer() {
    console.log("About to send getTimer message to background.");
    chrome.runtime.sendMessage({ action: "getTimer" }, response => {
        console.log("Received response from background:", response);
        if (response && response.timer) {
            console.log("Updated timer:", response.timer.remainingTime);
            displayTimer(response.timer.remainingTime);
        }
    });
}

// Check timer on initial load
checkAndUpdateTimer();

// Set up an interval to keep checking and updating the timer every second
setInterval(checkAndUpdateTimer, 1000);
