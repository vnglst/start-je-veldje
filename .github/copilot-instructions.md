# Start je Veldje - Game Ontwikkelings Instructies

LET OP: Spreek altijd Nederlands met de gebruiker in Copilot!!!

## Project Overzicht

"Start je Veldje" is een boerderij spel geïnspireerd door Stardew Valley, gebouwd met modulaire HTML, CSS en JavaScript. Het spel stelt spelers in staat om:

- Zaden te kopen in een winkel
- Zaden te planten op boerderij percelen
- Planten dagelijks water te geven voor groei
- Te wachten tot gewassen groeien over meerdere dagen
- Gewassen te oogsten en te verkopen voor winst

## Huidige Spel Functies

### Kern Mechanismen

1. **Economie Systeem**: Spelers beginnen met €100 en kunnen geld verdienen door gewassen te verkopen
2. **Boerderij Systeem**: 24 boerderij percelen (6x4 raster) waar spelers gewassen kunnen planten
3. **Water Systeem**: Planten hebben dagelijks water nodig om goed te groeien
4. **Groei Systeem**: Gewassen duren meerdere dagen om te groeien (3-7 dagen afhankelijk van type)
5. **Dag/Nacht Cyclus**: Slapen om naar de volgende dag te gaan
6. **Seizoenen Systeem**: Seizoenen veranderen elke 30 dagen
7. **Inventaris Beheer**: Bijhouden van zaden, vruchten en water

### Beschikbare Gewassen

- **Wortel** 🥕: Kost €5, Verkoopt voor €8, Groeit in 3 dagen
- **Appel** 🍎: Kost €8, Verkoopt voor €15, Groeit in 5 dagen
- **Maïs** 🌽: Kost €12, Verkoopt voor €20, Groeit in 7 dagen

### UI Componenten

- **Spel Statistieken**: Toon geld, aantal zaden, aantal vruchten, water, dag en seizoen
- **Boerderij Raster**: Interactief 6x4 raster van boerderij percelen met visuele feedback
- **Winkel**: Koop verschillende soorten zaden en water
- **Inventaris**: Bekijk bezeten items en verkoop vruchten
- **Gereedschap**: Gieter schakel modus
- **Slaap Knop**: Ga naar de volgende dag
- **Berichten**: Succes/fout feedback naar speler

## Technische Implementatie

### Bestand Structuur (Modulaire Architectuur)
