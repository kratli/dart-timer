let timers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        const tabId = message.tabId;
        timers[tabId] = message.time;

        chrome.tabs.sendMessage(tabId, {
            action: "updateTimer",
            time: message.time
        });

        sendResponse({ status: "Timer started" });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (timers[tabId] && changeInfo.status === "complete") {
        chrome.tabs.sendMessage(tabId, {
            action: "updateTimer",
            time: timers[tabId]
        });
    }
});
