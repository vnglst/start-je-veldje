// IJs data (zonder regenboog, mint, chocolade)
const iceCreams = {
  // Fruit-gebaseerde ijsjes (gemaakt van je eigen gewassen)
  strawberry: {
    emoji: "🍓",
    name: "Aardbei IJs",
    price: 20,
    sellPrice: 135, // Verkoop prijs - 2 aardbeien (€24) + winst!
    description: "Fris aardbei ijs",
    happiness: 7,
    canCraft: true,
    recipe: { strawberry: 2 }, // 2 aardbeien nodig
  },
  apple: {
    emoji: "🍎",
    name: "Appel IJs",
    price: 25,
    sellPrice: 150, // Verkoop prijs - 3 appels (€45) + winst!
    description: "Zoet appel ijs",
    happiness: 8,
    canCraft: true,
    recipe: { apple: 3 }, // 3 appels nodig
  },
  carrot: {
    emoji: "🥕",
    name: "Wortel IJs",
    price: 22,
    sellPrice: 125, // Verkoop prijs - 2 wortels (€16) + winst!
    description: "Uniek wortel ijs (gezond!)",
    happiness: 9,
    canCraft: true,
    recipe: { carrot: 2 }, // 2 wortels nodig
  },
  corn: {
    emoji: "🌽",
    name: "Maïs IJs",
    price: 28,
    sellPrice: 150, // Verkoop prijs - 2 maïs (€40) + winst!
    description: "Exotisch maïs ijs",
    happiness: 10,
    canCraft: true,
    recipe: { corn: 2 }, // 2 maïs nodig
  },
  berry_mix: {
    emoji: "🫐",
    name: "Bessen Mix IJs",
    price: 35,
    sellPrice: 160, // Verkoop prijs - 1 winterbes (€25) + 1 framboos (€18) + winst!
    description: "Deluxe bessen combinatie",
    happiness: 12,
    canCraft: true,
    recipe: { winterBerry: 1, raspberry: 1 }, // 1 winterbes + 1 framboos
  },

  // ===== SPECIALE COMBINATIE RECEPTEN =====
  tropical_paradise: {
    emoji: "🏝️",
    name: "Tropisch Paradijs IJs",
    price: 80,
    sellPrice: 550, // 2 mango (€140) + kiwi (€60) + drakenvrucht (€90) = €290 + flinke winst!
    description: "Exotische tropische vruchten mix - exclusief!",
    happiness: 20,
    canCraft: true,
    recipe: { mango: 2, kiwi: 1, dragon_fruit: 1 }, // Kas gewassen
    rarity: "legendary",
  },

  autumn_harvest: {
    emoji: "🍂",
    name: "Herfst Oogst IJs",
    price: 60,
    sellPrice: 390, // 2 appels (€30) + pompoen (€35) + aardappel (€7) = €72 + winst!
    description: "Rijke herfst smaken combinatie",
    happiness: 16,
    canCraft: true,
    recipe: { apple: 2, pumpkin: 1, potato: 1 },
    rarity: "epic",
  },

  rainbow_deluxe: {
    emoji: "🌈",
    name: "Regenboog Deluxe IJs",
    price: 100,
    sellPrice: 420, // 1 aardbei (€12) + 1 appel (€15) + 1 maïs (€20) + 1 winterbes (€25) + 1 wortel (€8) = €80 + winst!
    description: "Alle kleuren van de regenboog - ultiem!",
    happiness: 25,
    canCraft: true,
    recipe: { strawberry: 1, apple: 1, corn: 1, winterBerry: 1, carrot: 1 },
    rarity: "mythical",
  },

  veggie_surprise: {
    emoji: "🥗",
    name: "Groente Verrassing IJs",
    price: 45,
    sellPrice: 255, // 2 wortels (€16) + aardappel (€7) + tomaat (€14) = €37 + winst!
    description: "Verrassend lekker groente ijs",
    happiness: 14,
    canCraft: true,
    recipe: { carrot: 2, potato: 1, tomato: 1 },
    rarity: "rare",
  },

  summer_festival: {
    emoji: "🎪",
    name: "Zomer Festival IJs",
    price: 55,
    sellPrice: 375, // 2 aardbeien (€24) + framboos (€18) + tomaat (€14) = €56 + winst!
    description: "Feestelijke zomer smaak combinatie",
    happiness: 17,
    canCraft: true,
    recipe: { strawberry: 2, raspberry: 1, tomato: 1 },
    rarity: "epic",
  },

  golden_treasure: {
    emoji: "💰",
    name: "Gouden Schat IJs",
    price: 120,
    sellPrice: 1000, // 2 mango (€140) + 2 drakenvrucht (€180) + perzik (€50) + abrikoos (€40) = €410 + winst!
    description: "De meest waardevolle ijscreatie - zeldzaam!",
    happiness: 30,
    canCraft: true,
    recipe: { mango: 2, dragon_fruit: 2, peach: 1, apricot: 1 },
    rarity: "mythical",
  },
};

// iceCreams is nu beschikbaar als globale variabele
