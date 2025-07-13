// Game mechanics and day/night cycle
function sleep() {
  // Speel slaap geluid
  if (window.speelSlaapGeluid) {
    speelSlaapGeluid();
  }
  
  // Start sleep animation
  startSleepAnimation();

  // Process game logic after animation starts
  setTimeout(() => {
    gameState.day++;

    // Update seasons every 30 days
    const seasons = ["Lente", "Zomer", "Herfst", "Winter"];
    const seasonIndex = Math.floor((gameState.day - 1) / 30) % 4;
    gameState.season = seasons[seasonIndex];

    // Check for crop growth on regular farm
    let newlyGrownCrops = 0;
    let witheredPlants = 0;
    let deadPlants = 0;

    // Process regular farm
    gameState.farm.forEach((plot, index) => {
      if (plot.planted && !plot.grown && plot.cropType) {
        const wasWateredYesterday = plot.watered && plot.lastWateredDay === gameState.day - 1;

        // Check if crop can survive current season
        const crop = crops[plot.cropType];
        const canGrowInSeason = crop.seasons.includes(gameState.season);

        if (wasWateredYesterday && canGrowInSeason) {
          // Plant was watered yesterday and can grow in current season
          plot.daysWithoutWater = 0;

          // Initialize growthDays if it doesn't exist (for backwards compatibility)
          if (!plot.growthDays) {
            plot.growthDays = gameState.day - plot.plantedDay;
          } else {
            // Apply seasonal growth rate modifier
            let growthRate = 1;
            if (gameState.season === "Lente") growthRate = 1.2; // 20% faster in spring
            else if (gameState.season === "Zomer") growthRate = 1.1; // 10% faster in summer
            else if (gameState.season === "Herfst") growthRate = 1.0; // Normal in autumn
            else if (gameState.season === "Winter") growthRate = 0.5; // 50% slower in winter

            plot.growthDays += growthRate;
          }

          // Check if plant is fully grown
          if (plot.growthDays >= crop.growthTime) {
            plot.grown = true;
            newlyGrownCrops++;
          }
        } else if (!canGrowInSeason) {
          // Plant cannot survive current season - it withers faster
          plot.daysWithoutWater = (plot.daysWithoutWater || 0) + 2; // Double penalty for wrong season

          if (plot.daysWithoutWater >= 2) {
            // Plant dies from seasonal incompatibility
            plot.planted = false;
            plot.cropType = null;
            plot.plantedDay = null;
            plot.grown = false;
            plot.watered = false;
            plot.lastWateredDay = null;
            plot.daysWithoutWater = 0;
            plot.growthDays = 0;
            deadPlants++;
          } else {
            witheredPlants++;
          }
        } else {
          // Plant was not watered yesterday
          plot.daysWithoutWater = (plot.daysWithoutWater || 0) + 1;

          if (plot.daysWithoutWater >= 2) {
            // Plant dies after 2 days without water
            plot.planted = false;
            plot.cropType = null;
            plot.plantedDay = null;
            plot.grown = false;
            plot.watered = false;
            plot.lastWateredDay = null;
            plot.growthDays = 0;
            plot.daysWithoutWater = 0;
            deadPlants++;
          } else {
            // Plant is withering but still alive
            witheredPlants++;
          }
        }

        // Reset daily watering status
        if (plot.lastWateredDay < gameState.day - 1) {
          plot.watered = false;
        }
      }
    });

    // Process greenhouse farm (if greenhouse exists)
    if (gameState.greenhouse) {
      gameState.greenhouseFarm.forEach((plot, index) => {
        if (plot.planted && !plot.grown && plot.cropType) {
          const wasWateredYesterday = plot.watered && plot.lastWateredDay === gameState.day - 1;
          const crop = crops[plot.cropType];

          if (wasWateredYesterday) {
            // Plant was watered yesterday - greenhouse plants always grow optimally
            plot.daysWithoutWater = 0;

            // Initialize growthDays if it doesn't exist
            if (!plot.growthDays) {
              plot.growthDays = gameState.day - plot.plantedDay;
            } else {
              // Greenhouse provides steady optimal growth (no seasonal effects)
              plot.growthDays += 1;
            }

            // Check if plant is fully grown
            if (plot.growthDays >= crop.growthTime) {
              plot.grown = true;
              newlyGrownCrops++;
            }
          } else {
            // Plant was not watered yesterday
            plot.daysWithoutWater = (plot.daysWithoutWater || 0) + 1;

            if (plot.daysWithoutWater >= 2) {
              // Plant dies after 2 days without water (even in greenhouse)
              plot.planted = false;
              plot.cropType = null;
              plot.plantedDay = null;
              plot.grown = false;
              plot.watered = false;
              plot.lastWateredDay = null;
              plot.growthDays = 0;
              plot.daysWithoutWater = 0;
              deadPlants++;
            } else {
              // Plant is withering but still alive
              witheredPlants++;
            }
          }

          // Reset daily watering status
          if (plot.lastWateredDay < gameState.day - 1) {
            plot.watered = false;
          }
        }
      });
    }

    // Update UI and show morning message
    updateUI();

    setTimeout(() => {
      let message = `🌅 Dag ${gameState.day} - `;

      if (deadPlants > 0) {
        message += `💀 ${deadPlants} plant(en) zijn doodgegaan door gebrek aan water! `;
        if (newlyGrownCrops > 0) {
          message += `Maar ${newlyGrownCrops} gewas(sen) zijn klaar om te oogsten! ✨`;
          showMessage(message, "error");
        } else if (witheredPlants > 0) {
          message += `En ${witheredPlants} plant(en) verwelken nog steeds. Geef ze snel water! 💧`;
          showMessage(message, "error");
        } else {
          showMessage(message, "error");
        }
      } else if (newlyGrownCrops > 0 && witheredPlants > 0) {
        message += `${newlyGrownCrops} gewas(sen) zijn klaar om te oogsten! ✨ Maar ${witheredPlants} plant(en) verwelken door gebrek aan water. 💧`;
        showMessage(message, "success");
      } else if (newlyGrownCrops > 0) {
        message += `${newlyGrownCrops} gewas(sen) zijn klaar om te oogsten! ✨`;
        showMessage(message, "success");
      } else if (witheredPlants > 0) {
        message += `${witheredPlants} plant(en) verwelken door gebrek aan water. Geef ze snel water voordat ze doodgaan! 💧`;
        showMessage(message, "error");
      } else {
        message += "Goedemorgen! Tijd om je boerderij te verzorgen. 🌱";
        showMessage(message, "success");
      }
    }, 500);
  }, 1500);
}

// Sleep animation function
function startSleepAnimation() {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "sleep-overlay";
  document.body.appendChild(overlay);

  // Create sleep message
  const message = document.createElement("div");
  message.className = "sleep-message";
  message.textContent = "😴 Welterusten...";
  document.body.appendChild(message);

  // Create moon
  const moon = document.createElement("div");
  moon.className = "moon";
  moon.textContent = "🌙";
  document.body.appendChild(moon);

  // Create owl
  const owl = document.createElement("div");
  owl.className = "owl";
  owl.textContent = "🦉";
  document.body.appendChild(owl);

  // Create random stars
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const star = document.createElement("div");
      star.className = "star";
      star.textContent = "⭐";
      star.style.top = Math.random() * 60 + 20 + "%";
      star.style.left = Math.random() * 80 + 10 + "%";
      star.style.animationDelay = Math.random() * 2 + "s";
      document.body.appendChild(star);

      // Remove star after animation
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 4000);
    }, i * 200);
  }

  // Activate overlay
  setTimeout(() => {
    overlay.classList.add("active");
  }, 100);

  // Remove all elements after animation
  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (message.parentNode) message.parentNode.removeChild(message);
    if (moon.parentNode) moon.parentNode.removeChild(moon);
    if (owl.parentNode) owl.parentNode.removeChild(owl);
  }, 4000);
}

// Toggle watering mode
function toggleWateringMode() {
  wateringMode = !wateringMode;
  updateUI();
  if (wateringMode) {
    showMessage("Gieter mode geactiveerd! Klik op planten om water te geven. 🚿", "success");
  } else {
    showMessage("Gieter mode gedeactiveerd. 🌱", "success");
  }
}
