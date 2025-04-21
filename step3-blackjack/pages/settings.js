
document.getElementById("volume").addEventListener("input", (e) => {
  localStorage.setItem("volume", e.target.value);
});

document.getElementById("sound-toggle").addEventListener("change", (e) => {
  localStorage.setItem("soundEnabled", e.target.checked);
});

document.getElementById("hints-toggle").addEventListener("change", (e) => {
  localStorage.setItem("hintsEnabled", e.target.checked);
  
  // Notify the parent window that hints setting has changed
  if (window.parent && window.parent.updateHintSetting) {
    window.parent.updateHintSetting(e.target.checked);
  }
});

function resetGame() {
  if (confirm("Are you sure you want to reset the game?")) {
    localStorage.clear();
    alert("Game has been reset.");
  }
}

window.onload = () => {
  const volume = localStorage.getItem("volume");
  const soundEnabled = localStorage.getItem("soundEnabled");
  const hintsEnabled = localStorage.getItem("hintsEnabled");

  if (volume !== null)
    document.getElementById("volume").value = volume;
  if (soundEnabled !== null)
    document.getElementById("sound-toggle").checked = soundEnabled === "true";
  if (hintsEnabled !== null)
    document.getElementById("hints-toggle").checked = hintsEnabled === "true";
  else
    document.getElementById("hints-toggle").checked = false; // Default to off
};

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

