console.log("background script loaded");
let timers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);
    
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
                chrome.tabs.sendMessage(tabId, { action: 'timerEnded' });
                delete timers[tabId];
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
    }
});
