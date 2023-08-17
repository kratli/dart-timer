console.log("background script loaded");
let timers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message: ", message);
    if (message.action === "startTimer") {
        const tabId = message.tabId;
        const time = Number(message.time) * 60; // Convert minutes to seconds

        if (timers[tabId]) {
            clearTimeout(timers[tabId].timeout);
        }

        timers[tabId] = {
            remainingTime: time,
            endTime: Date.now() + time * 1000
        };

        function tick() {
            timers[tabId].remainingTime -= 1;

            if (timers[tabId].remainingTime <= 0) {
                delete timers[tabId];
                chrome.tabs.sendMessage(tabId, { action: "showModal" });
                return;
            }

            timers[tabId].timeout = setTimeout(tick, 1000);
        }

        tick();

        sendResponse({ status: "Timer started" });
    } else if (message.action === "getTimer") {
        const tabId = sender.tab.id;
        const timer = timers[tabId];

        if (timer) {
            timer.remainingTime = Math.round((timer.endTime - Date.now()) / 1000);
        }

        sendResponse({ timer: timer || null });
    } else if (message.action === "removeModal") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const currentTabId = tabs[0].id;
            chrome.tabs.sendMessage(currentTabId, { action: "removeModal" });
        });
    } else if (message.action === "removeTimer") {
        const tabId = message.tabId;
    
        if (timers[tabId]) {
            clearTimeout(timers[tabId].timeout);
            delete timers[tabId];
        }
    
        // Send a message to content.js to remove the modal
        chrome.tabs.sendMessage(tabId, { action: "removeModalAndTimer" });
    
        sendResponse({ status: "Timer and modal removed" });
    }
});
