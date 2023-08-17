const buttons = document.querySelectorAll('[data-time]');
const customTimeInput = document.getElementById('customTime');

buttons.forEach(button => {
  button.addEventListener('click', function() {
    const time = this.getAttribute('data-time') || customTimeInput.value;
    chrome.runtime.sendMessage({ action: "startTimer", time: time });
  });
});
