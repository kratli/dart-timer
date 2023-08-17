chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'timerUpdated') {
        // This will reset the timer and fetch the updated end time from storage
        displayUpdatedTimer();
    }
});

function displayUpdatedTimer() {
    // Stop any previous intervals if they exist
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    chrome.storage.local.get('timerEnd', (data) => {
        if (data.timerEnd) {
            window.timerInterval = setInterval(() => {
                const remainingMillis = data.timerEnd - Date.now();
                if (remainingMillis <= 0) {
                    clearInterval(window.timerInterval);
                    displayTimer(0);
                } else {
                    // Update the displayed time
                    displayTimer(Math.round(remainingMillis / 1000 / 60));
                }
            }, 1000);
        }
    });
}

function displayTimer(minutes) {
    // Logic to display the timer on the page

    let timerElement = document.getElementById("timerOverlay");
  
    // If the timer element doesn't exist yet, create it
    if (!timerElement) {
        timerElement = document.createElement("div");
        timerElement.id = "timerOverlay";
        
        // Style the timer overlay
        timerElement.style.position = 'fixed';
        timerElement.style.top = '10px';
        timerElement.style.right = '10px';
        timerElement.style.zIndex = '10000';
        timerElement.style.padding = '5px 10px';
        timerElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
        timerElement.style.color = 'white';
        timerElement.style.borderRadius = '5px';
        timerElement.style.fontSize = '14px';

        document.body.appendChild(timerElement);
    }

    timerElement.textContent = minutes + " minutes remaining";
}

// Initialize the timer on content script load
displayUpdatedTimer();
