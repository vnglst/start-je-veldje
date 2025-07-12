# 🌱 Start je Veldje

Een simpel farming spel geïnspireerd door Stardew Valley, gebouwd met vanilla HTML, CSS en JavaScript.

## 🎮 Hoe te spelen

1. **Koop zaden** in de winkel (🏪)
2. **Plant zaden** door op lege veldjes te klikken
3. **Geef water** door gieter mode aan te zetten en op planten te klikken
4. **Ga slapen** om naar de volgende dag te gaan
5. **Oogst gewassen** wanneer ze klaar zijn
6. **Verkoop fruit** voor geld

## 📁 Project Structuur

```
start-je-veldje/
├── index-clean.html    # Nieuwe, opgeruimde hoofdpagina
├── index.html          # Originele versie (met alles in één bestand)
├── styles.css          # Alle CSS styling
├── gameState.js        # Game state en data management
├── ui.js              # UI update functies
├── farm.js            # Boerderij management
├── shop.js            # Winkel en inventory functies
├── game.js            # Game mechanics (slapen, seizoenen)
├── main.js            # Initialisatie en auto-save
└── .github/
    └── copilot-instructions.md  # GitHub Copilot instructies
```

## 🌾 Game Features

### Gewassen

- **Wortel** 🥕: €5 zaad → €8 fruit (3 dagen)
- **Appel** 🍎: €8 zaad → €15 fruit (5 dagen)
- **Maïs** 🌽: €12 zaad → €20 fruit (7 dagen)

### Systemen

- **Dag/Nacht Cyclus**: Ga slapen om tijd vooruit te zetten
- **Seizoenen**: Veranderen elke 30 dagen
- **Water Systeem**: Planten hebben dagelijks water nodig
- **Auto-Save**: Spel wordt elke 5 seconden opgeslagen

## 🚀 Hoe te runnen

1. Open `index-clean.html` in je browser
2. Of gebruik de originele `index.html` (alles in één bestand)

## 🛠️ Development

### Code Organisatie

- **gameState.js**: Bevat alle game data en save/load functies
- **ui.js**: UI updates en display functies
- **farm.js**: Planten, oogsten, water geven
- **shop.js**: Kopen en verkopen
- **game.js**: Dag cyclus en seizoenen
- **main.js**: Initialisatie en setup

### Nieuwe Features Toevoegen

1. Voeg crop data toe in `gameState.js`
2. Update shop HTML in `index-clean.html`
3. Logica wordt automatisch afgehandeld door bestaande functies

## 📝 Toekomstige Ideeën

- Meer gewassen (tomaten, bessen, tarwe)
- Dieren (kippen, koeien)
- Gebouwen (schuur, kas)
- Quest systeem
- Marktprijs fluctuaties
- Weer effecten

## 🎯 Technische Details

- **Geen frameworks**: Pure HTML, CSS, JavaScript
- **Responsive design**: Werkt op desktop en mobiel
- **LocalStorage**: Voor opslaan van voortgang
- **Emoji graphics**: Voor eenvoudige visuele elementen
