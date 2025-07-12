// Sell fruit function
function sellFruit(fruitType) {
  if (gameState.fruits[fruitType] > 0) {
    gameState.fruits[fruitType]--;
    gameState.money += crops[fruitType].fruitPrice;
    showMessage(`Je hebt ${crops[fruitType].name} verkocht voor €${crops[fruitType].fruitPrice}! 💰`, "success");
    updateUI();
  }
}
