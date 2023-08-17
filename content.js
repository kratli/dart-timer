// Function to display the timer on the page
console.log("Content script loaded");
let timerInterval;
let timerOverlay;

function displayTimer(minutes) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    if (!timerOverlay) {
        timerOverlay = document.createElement("div");
        timerOverlay.style.position = "fixed";
        timerOverlay.style.top = "10px";
        timerOverlay.style.right = "10px";
        timerOverlay.style.zIndex = "10000";
        timerOverlay.style.fontSize = "24px";
        timerOverlay.style.background = "rgba(0, 0, 0, 0.5)";
        timerOverlay.style.padding = "10px";
        timerOverlay.style.borderRadius = "5px";
        timerOverlay.style.color = "white";
        document.body.appendChild(timerOverlay);
    }

    let timeLeft = minutes * 60;

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerOverlay.textContent = "Timer Done!";
            return;
        }

        const displayMinutes = Math.floor(timeLeft / 60);
        const displaySeconds = timeLeft % 60;

        timerOverlay.textContent = `${displayMinutes}:${String(displaySeconds).padStart(2, '0')}`;
        timeLeft--;
    }, 1000);
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTimer") {
        displayTimer(message.time);
    }
});
