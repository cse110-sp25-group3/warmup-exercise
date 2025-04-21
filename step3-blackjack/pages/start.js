function toggleHelp() {
  const modal = document.getElementById("help-modal");
  const overlay = document.getElementById("overlay");
  modal.classList.toggle("hidden");
  overlay.style.display = modal.classList.contains("hidden") ? "none" : "block";
}

function toggleSettings() {
  const modal = document.getElementById("settings-modal");
  const overlay = document.getElementById("overlay");
  modal.classList.toggle("hidden");
  overlay.style.display = modal.classList.contains("hidden") ? "none" : "block";
  
  // Force iframe to reload to ensure settings are up to date
  const iframe = modal.querySelector("iframe");
  if (iframe && !modal.classList.contains("hidden")) {
    iframe.src = iframe.src;
  }
}

// Function to close all modals
function closeAllModals() {
  document.getElementById("help-modal").classList.add("hidden");
  document.getElementById("settings-modal").classList.add("hidden");
  document.getElementById("overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");

  overlay.addEventListener("click", () => {
    closeAllModals();
  });
  
  // Initialize hints setting if not set
  if (localStorage.getItem("hintsEnabled") === null) {
    localStorage.setItem("hintsEnabled", "false");
  }
});