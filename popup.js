document.addEventListener("DOMContentLoaded", function () {
    const btn55 = document.getElementById("btn-55");
    const btn115 = document.getElementById("btn-115");
    const btn180 = document.getElementById("btn-180");
    const customMinutes = document.getElementById("custom-minutes");
    const btnStart = document.getElementById("btn-start");
  
    let timerInterval;
    
    const timerDisplay = document.getElementById("timer-display");

  function updateTimerDisplay(minutes, seconds) {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }
  
    function startTimer(minutes) {
      clearInterval(timerInterval);
  
      let seconds = 0;
      updateTimerDisplay(minutes, seconds);
  
      timerInterval = setInterval(function () {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerInterval);
            // Timer finished, perform desired actions
          } else {
            minutes--;
            seconds = 59;
          }
        } else {
          seconds--;
        }
  
        updateTimerDisplay(minutes, seconds);
      }, 1000);
    }
  
    btn55.addEventListener("click", function () {
      startTimer(55);
    });
  
    btn115.addEventListener("click", function () {
      startTimer(115);
    });
  
    btn180.addEventListener("click", function () {
      startTimer(180);
    });
  
    btnStart.addEventListener("click", function () {
      const customMinutesValue = parseInt(customMinutes.value);
      if (!isNaN(customMinutesValue)) {
        startTimer(customMinutesValue);
      }
    });
  });
  