// Game state management
let gameState = {
  money: 100,
  seeds: {
    carrot: 0,
    apple: 0,
    corn: 0,
  },
  fruits: {
    carrot: 0,
    apple: 0,
    corn: 0,
  },
  farm: [],
  day: 1,
  season: "Lente",
  wateringCan: true,
  water: 10,
};

// Game mode
let wateringMode = false;

// Crop data
const crops = {
  carrot: {
    emoji: "🥕",
    name: "Wortel",
    seedPrice: 5,
    fruitPrice: 8,
    growthTime: 3, // days
  },
  apple: {
    emoji: "🍎",
    name: "Appel",
    seedPrice: 8,
    fruitPrice: 15,
    growthTime: 5, // days
  },
  corn: {
    emoji: "🌽",
    name: "Maïs",
    seedPrice: 12,
    fruitPrice: 20,
    growthTime: 7, // days
  },
};

// Save and load functions
function saveGame() {
  localStorage.setItem("startJeVeldje", JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem("startJeVeldje");
  if (saved) {
    gameState = JSON.parse(saved);
    return true;
  }
  return false;
}
