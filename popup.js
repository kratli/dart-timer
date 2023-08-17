document.addEventListener("DOMContentLoaded", function() {

    const buttons = document.querySelectorAll("button[data-time]");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const timeValue = button.getAttribute("data-time");
            startTimer(timeValue);
        });
    });

    document.getElementById("startCustomTimer").addEventListener("click", function() {
        const customTime = document.getElementById("customTimeInput").value;
        if (customTime && Number(customTime) <= 999 && Number(customTime) > 0) {
            startTimer(customTime);
        }
    });

    function startTimer(time) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tabId = tabs[0].id;
            chrome.runtime.sendMessage({
                action: "startTimer",
                time: time,
                tabId: tabId
            });
        });
    }
});
