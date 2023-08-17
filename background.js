chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        const endTime = Date.now() + message.time * 60 * 1000;
        
        chrome.storage.local.set({ timerEnd: endTime }, () => {
            // Notify all tabs that the timer has been updated
            chrome.tabs.query({}, (tabs) => {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: 'timerUpdated' });
                }
            });

            sendResponse({ status: 'Timer started' });
        });
        
        return true;  // This ensures the sendResponse callback can be invoked later
    }
});
