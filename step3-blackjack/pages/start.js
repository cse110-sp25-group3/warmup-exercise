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
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
  
    overlay.addEventListener("click", () => {
      document.getElementById("help-modal").classList.add("hidden");
      document.getElementById("settings-modal").classList.add("hidden");
      overlay.style.display = "none";
    });
  });
  