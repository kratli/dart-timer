let timer = null;
let endTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    // Clear any existing timer
    if (timer) {
      clearInterval(timer);
    }

    // Calculate the end time based on the current time + the duration provided
    const durationMillis = message.time * 60 * 1000;
    endTime = Date.now() + durationMillis;

    // Start a new timer
    timer = setInterval(() => {
      const remainingMillis = endTime - Date.now();
      if (remainingMillis <= 0) {
        clearInterval(timer);
        chrome.storage.local.set({ timerEnd: null });
      } else {
        chrome.storage.local.set({ timerEnd: endTime });
      }
    }, 1000);

    sendResponse({ status: 'Timer started' });
  }
});

chrome.storage.local.get('timerEnd', (data) => {
  if (data.timerEnd) {
    endTime = data.timerEnd;
    timer = setInterval(() => {
      const remainingMillis = endTime - Date.now();
      if (remainingMillis <= 0) {
        clearInterval(timer);
        chrome.storage.local.set({ timerEnd: null });
      }
    }, 1000);
  }
});
