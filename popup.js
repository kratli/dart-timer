document.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", function() {
        const time = this.getAttribute("data-time");
        chrome.runtime.sendMessage({ action: "startTimer", time: time }, (response) => {
            if (response && response.status === "Timer started") {
                window.close();  // Close the popup after starting the timer
            }
        });
    });
});

document.getElementById("startCustomTimer").addEventListener("click", function() {
    const customTime = document.getElementById("customTimeInput").value;
    if (customTime && customTime > 0 && customTime <= 999) {
        chrome.runtime.sendMessage({ action: "startTimer", time: customTime }, (response) => {
            if (response && response.status === "Timer started") {
                window.close();  // Close the popup after starting the timer
            }
        });
    } else {
        alert("Please enter a valid time between 1 and 999 minutes.");
    }
});
