console.log("Content script loaded!");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'startTimer') {
      startTimer(Number(message.time));
    }
  });
  
  
  function startTimer(minutes) {
    let endTime = Date.now() + minutes * 60 * 1000;
  
    if (document.getElementById('timerOverlay')) {
      document.getElementById('timerOverlay').remove();
    }
  
    const overlay = document.createElement('div');
    overlay.id = 'timerOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'black';
    overlay.style.color = 'white';
    overlay.style.padding = '10px';
    overlay.style.borderRadius = '5px';
    document.body.appendChild(overlay);
  
    function updateTimer() {
      const remaining = Math.round((endTime - Date.now()) / (60 * 1000));
      if (remaining <= 0) {
        overlay.innerText = 'Time’s up!';
        clearInterval(interval);
        return;
      }
      overlay.innerText = remaining + ' minutes remaining';
    }
  
    const interval = setInterval(updateTimer, 1000);
    updateTimer();
  }
  