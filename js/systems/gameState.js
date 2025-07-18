// Game state management - hoofdstatus object
// Data wordt geïmporteerd vanuit aparte modules voor betere organisatie

let gameState = {
  money: 100,
  seeds: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
    raspberry: 0,
    pumpkin: 0,
    strawberry: 0,
    potato: 0,
    tomato: 0,
    // Kas gewassen
    apricot: 0,
    peach: 0,
    kiwi: 0,
    mango: 0,
    dragon_fruit: 0,
  },
  fruits: {
    carrot: 0,
    apple: 0,
    corn: 0,
    winterBerry: 0,
    raspberry: 0,
    pumpkin: 0,
    strawberry: 0,
    potato: 0,
    tomato: 0,
    // Kas gewassen
    apricot: 0,
    peach: 0,
    kiwi: 0,
    mango: 0,
    dragon_fruit: 0,
  },
  farm: [],
  greenhouseFarm: [], // Aparte boerderij voor in de kas
  inGreenhouse: false, // Of de speler momenteel in de kas is
  inIceCreamShop: false, // Of de speler momenteel in de ijssalon is
  day: 1,
  hour: 6, // Start om 6:00 's ochtends (zoals Stardew Valley)
  minute: 0,
  season: "Lente",
  wateringCan: true,
  water: 10,
  greenhouse: false, // Whether player has bought a greenhouse
  playerPosition: { x: 0, y: 0 }, // Player position on the map
  wellPosition: { x: 7, y: 1 }, // Well position outside the farm grid
  shopPosition: { x: 0, y: 5 }, // Shop position at bottom left
  greenhousePosition: { x: 0, y: 0 }, // Greenhouse position at top left
  iceCreamShopPosition: { x: 7, y: 5 }, // IJswinkel positie rechts onder
  iceCreamMachinePosition: { x: 0, y: 1 }, // IJsmachine positie links midden
  lemonadeMachinePosition: { x: 0, y: 2 }, // Limonade machine positie links onder ijsmachine
  groenlandPortalPosition: { x: 7, y: 0 }, // Portal naar Groenland rechts boven

  // Groenland avontuur systeem
  inGroenland: false, // Of de speler momenteel in Groenland is
  heeftZwaard: false, // Of de speler een zwaard heeft
  monstersInMijn: [], // Array met monsters in de mijn
  mijnBetreden: false, // Of de speler de mijn al is binnengegaan
  monsterAIRunning: false, // Of monster AI actief is
  hitPoints: 100, // Speler levenspunten (vol bij start)
  
  // Klanten systeem
  customers: [], // Array van klanten in de ijssalon
  customerQueue: [], // Wachtrij van klanten bij de balie
  nextCustomerId: 1, // ID voor nieuwe klanten
  customerSpawnTimer: 0, // Timer voor nieuwe klanten
  // Ijs inventaris toevoegen
  iceCream: {
    strawberry: 0,
    apple: 0,
    carrot: 0,
    corn: 0,
    berry_mix: 0,
    // Speciale combinatie recepten
    tropical_paradise: 0,
    autumn_harvest: 0,
    rainbow_deluxe: 0,
    veggie_surprise: 0,
    summer_festival: 0,
    golden_treasure: 0,
  },
  // Limonade inventaris toevoegen
  lemonade: {
    strawberry_lemonade: 0,
    apple_lemonade: 0,
    carrot_juice: 0,
    corn_smoothie: 0,
    berry_mix_lemonade: 0,
    veggie_surprise: 0,
    summer_paradise: 0,
    harvest_celebration: 0,
    rainbow_delight: 0,
    golden_elixir: 0,
  },
};

// Game mode variabelen
let wateringMode = false;
let infoMode = false;

// Data modules zijn verplaatst naar:
// - IJs data: js/data/iceCreams.js
// - Gewas data: js/data/crops.js
// - Save/Load functies: js/utils/saveLoad.js
