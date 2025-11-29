const TOTAL_SECONDS = 180 * 60; // 3 hours
let remaining = TOTAL_SECONDS;
let intervalId = null;

const timerEl = document.getElementById("timer");
const resetMsgEl = document.getElementById("resetMsg");
const closeBtn = document.getElementById("closeBtn");
const messageEl = document.getElementById("message");

// Streak tracking
chrome.storage.local.get(["lastRelapse"], (data) => {
  const lastRelapse = data.lastRelapse ? new Date(data.lastRelapse) : null;
  const today = new Date();

  let streak = 0;

  if (lastRelapse) {
    const diffTime = Math.abs(today - lastRelapse);
    streak = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  document.getElementById("streak").textContent = `Current streak: ${streak} days`;
});

// Mark relapse trigger
chrome.storage.local.set({ lastRelapse: new Date().toISOString() });

function formatTime(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateDisplay() {
  timerEl.textContent = formatTime(remaining);
}

function startTimer() {
  clearInterval(intervalId);
  updateDisplay();
  intervalId = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(intervalId);
      timerEl.textContent = "00:00:00";
      closeBtn.disabled = false;
      closeBtn.focus();
      messageEl.textContent =
        "You made it through the urge. Close this tab and go do something that builds your life.";
    } else {
      updateDisplay();
    }
  }, 1000);
}

function resetTimer(reason) {
  remaining = TOTAL_SECONDS;
  updateDisplay();
  if (intervalId) clearInterval(intervalId);

  startTimer();

  if (reason) {
    resetMsgEl.textContent = `Timer reset: ${reason}`;
  } else {
    resetMsgEl.textContent = "Timer reset.";
  }
}

// Reset when tab loses visibility (switching tabs / minimizing / new window)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetTimer("you left the page or switched tabs.");
  }
});

// Reset silently if refresh or close is attempted — removed dialog requirement
window.addEventListener("beforeunload", () => {
  resetTimer("you tried to close or reload the tab.");
});

// Enable close button once finished
closeBtn.addEventListener("click", () => {
  window.close();
});

// Start timer immediately
startTimer();
