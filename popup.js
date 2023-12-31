document.addEventListener("DOMContentLoaded", function() {

    const buttons = document.querySelectorAll("button[data-time]");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const timeValue = button.getAttribute("data-time");
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const tabId = tabs[0].id;
                startTimer(timeValue, tabId);
            });
        });
    });

    document.getElementById("startCustomTimer").addEventListener("click", function() {
        const customTime = document.getElementById("customTimeInput").value;
        if (customTime && Number(customTime) <= 999 && Number(customTime) > 0) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const tabId = tabs[0].id;
                startTimer(customTime, tabId);
            });
        }
    });

    document.getElementById('removeTimer').addEventListener('click', function () {
        toggleTimerMenu(); // Hide the menu
        removeTimeoutModal();
        removeTimer();     
    
        chrome.runtime.sendMessage({action: "getTabId"}, function(response) {
            if (response && response.tabId) {
                chrome.runtime.sendMessage({
                    action: "removeTimer",
                    tabId: response.tabId
                });
            }
        });
    });
    
    function removeTimer() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tabId = tabs[0].id;
            chrome.runtime.sendMessage({
                action: "removeTimer",
                tabId: tabId
            });
        });
    }
    

    function startTimer(time, tabId) {
        chrome.runtime.sendMessage({ 
            action: "removeModal",
            tabId: tabId
        }); 
        chrome.runtime.sendMessage({
            action: "startTimer",
            time: time,
            tabId: tabId
        });
    }
});
