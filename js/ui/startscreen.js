// Beginscherm functionaliteit
function toonBeginschermStats() {
  // Probeer stats uit DOM te halen (of fallback)
  document.getElementById("begin-money").textContent = document.getElementById("money")?.textContent || "0";
  document.getElementById("begin-seeds").textContent = document.getElementById("seedCount")?.textContent || "0";
  document.getElementById("begin-fruit").textContent = document.getElementById("fruitCount")?.textContent || "0";
  document.getElementById("begin-ice").textContent = document.getElementById("iceCreamCount")?.textContent || "0";
  document.getElementById("begin-lemonade").textContent = document.getElementById("lemonadeCount")?.textContent || "0";
  document.getElementById("begin-water").textContent = document.getElementById("water")?.textContent || "0";
  document.getElementById("begin-day").textContent = document.getElementById("day")?.textContent || "1";
  document.getElementById("begin-time").textContent = document.getElementById("time")?.textContent || "06:00";
  document.getElementById("begin-season").textContent = document.getElementById("season")?.textContent || "Lente";
  document.getElementById("begin-sword").textContent = document.getElementById("sword")?.textContent || "❌";
}

function hideBeginschermEnStartSpel() {
  document.getElementById("startscreen").style.display = "none";
  var gc = document.getElementById("gameContainer");
  gc.classList.remove("startscreen-blur");
  // Start muziek op basis van opgeslagen settings
  if (typeof window.startMusic === "function") {
    window.startMusic();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  toonBeginschermStats();
  document.getElementById("gameContainer").classList.add("startscreen-blur");
  document.getElementById("startSpelBtn").addEventListener("click", hideBeginschermEnStartSpel);

  // Laad muziek settings en update UI
  if (typeof window.loadMusicSettings === "function") {
    window.loadMusicSettings();
  }
  if (typeof window.updateMusicButton === "function") {
    window.updateMusicButton();
  }
  if (typeof window.updateMusicDropdown === "function") {
    window.updateMusicDropdown();
  }

  // Laad geluid settings
  if (typeof window.initSoundSettings === "function") {
    window.initSoundSettings();
  }
});
