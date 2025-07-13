// Sell fruit function
function sellFruit(fruitType) {
  if (gameState.fruits[fruitType] > 0) {
    gameState.fruits[fruitType]--;
    gameState.money += crops[fruitType].fruitPrice;
    speelGeldGeluid(); // Geluidseffect voor verkoop
    showMessage(`Je hebt ${crops[fruitType].name} verkocht voor €${crops[fruitType].fruitPrice}! 💰`, "success");
    updateUI();
  }
}

// Sell ice cream from inventory
function sellIceCreamFromInventory(iceCreamType) {
  if (gameState.iceCream[iceCreamType] > 0) {
    const iceCream = iceCreams[iceCreamType];
    gameState.iceCream[iceCreamType]--;
    gameState.money += iceCream.sellPrice;
    speelGeldGeluid(); // Geluidseffect voor verkoop
    showMessage(`Je hebt ${iceCream.name} verkocht voor €${iceCream.sellPrice}! 💰`, "success");
    updateUI();
    saveGame();
  }
}
