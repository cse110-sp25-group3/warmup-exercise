// settings.js

document.addEventListener("DOMContentLoaded", () => {
  const volumeSlider = document.getElementById("volume");
  const soundToggle = document.getElementById("sound-toggle");

  // Load saved values from localStorage
  const savedVolume = localStorage.getItem("volume");
  const soundEnabled = localStorage.getItem("soundEnabled");

  if (savedVolume !== null) volumeSlider.value = savedVolume;
  if (soundEnabled !== null) soundToggle.checked = soundEnabled === "true";

  // Save volume to localStorage
  volumeSlider.addEventListener("input", (e) => {
    localStorage.setItem("volume", e.target.value);
  });

  // Save sound toggle to localStorage
  soundToggle.addEventListener("change", (e) => {
    localStorage.setItem("soundEnabled", e.target.checked);
  });
});

function resetGame() {
  if (confirm("Are you sure you want to reset the game?")) {
    localStorage.clear();
    alert("Game has been reset.");
    window.parent.location.reload();
  }
}
