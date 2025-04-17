document.getElementById("volume").addEventListener("input", (e) => {
    localStorage.setItem("volume", e.target.value);
  });
  
  document.getElementById("sound-toggle").addEventListener("change", (e) => {
    localStorage.setItem("soundEnabled", e.target.checked);
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
  
    if (volume !== null)
      document.getElementById("volume").value = volume;
    if (soundEnabled !== null)
      document.getElementById("sound-toggle").checked = soundEnabled === "true";
  };