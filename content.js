// Check storage for timer end time
chrome.storage.local.get('timerEnd', (data) => {
    if (data.timerEnd) {
      const interval = setInterval(() => {
        const remainingMillis = data.timerEnd - Date.now();
        if (remainingMillis <= 0) {
          clearInterval(interval);
          displayTimer(0);
        } else {
          // Update the displayed time
          displayTimer(Math.round(remainingMillis / 1000 / 60));
        }
      }, 1000);
    }
  });
  
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
  