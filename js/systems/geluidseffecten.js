// geluidseffecten.js
// 🔊 UI Geluidseffecten voor Start je Veldje
// Kleine geluidjes voor knoppen, menu's en acties

let uiSynth, clickSynth, swooshSynth, bellSynth;
let geluidseffectenEnabled = true;

// Initialiseer de synthesizers voor UI geluiden
function initUISynths() {
  // Knop klik geluid (korte 'beep')
  clickSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.2 }
  }).toDestination();
  clickSynth.volume.value = -12;

  // Menu hover/swoosh geluid
  swooshSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.4 }
  }).toDestination();
  swooshSynth.volume.value = -18;

  // Bel geluid voor meldingen
  bellSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 1.0 }
  }).toDestination();
  bellSynth.volume.value = -10;

  // Algemene UI synth voor verschillende geluiden
  uiSynth = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }
  }).toDestination();
  uiSynth.volume.value = -15;
}

// Knop klik geluid (verschillende toonhoogtes voor variatie)
function speelKnopKlikGeluid(type = 'normaal') {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  switch(type) {
    case 'hoog':
      clickSynth.triggerAttackRelease("C5", "16n");
      break;
    case 'laag':
      clickSynth.triggerAttackRelease("G3", "16n");
      break;
    case 'belangrijk':
      clickSynth.triggerAttackRelease("E4", "8n");
      break;
    default:
      clickSynth.triggerAttackRelease("C4", "16n");
  }
}

// Menu hover geluid
function speelMenuHoverGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  swooshSynth.triggerAttackRelease("E4", "32n");
}

// Menu open/sluiten geluid
function speelMenuToggleGeluid(opening = true) {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  if (opening) {
    // Oplopend akkoord voor openen
    uiSynth.triggerAttackRelease("C4", "16n", now);
    uiSynth.triggerAttackRelease("E4", "16n", now + 0.1);
    uiSynth.triggerAttackRelease("G4", "16n", now + 0.2);
  } else {
    // Aflopend akkoord voor sluiten
    uiSynth.triggerAttackRelease("G4", "16n", now);
    uiSynth.triggerAttackRelease("E4", "16n", now + 0.1);
    uiSynth.triggerAttackRelease("C4", "16n", now + 0.2);
  }
}

// Succes geluid (voor verkopen, oogsten etc.)
function speelSuccesGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Vrolijk oplopend melodietje
  bellSynth.triggerAttackRelease("C4", "8n", now);
  bellSynth.triggerAttackRelease("E4", "8n", now + 0.15);
  bellSynth.triggerAttackRelease("G4", "8n", now + 0.3);
  bellSynth.triggerAttackRelease("C5", "4n", now + 0.45);
}

// Error/waarschuwing geluid
function speelErrorGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Lage dubbele toon
  uiSynth.triggerAttackRelease("F3", "8n", now);
  uiSynth.triggerAttackRelease("F3", "8n", now + 0.2);
}

// Melding/info geluid
function speelMeldingGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  bellSynth.triggerAttackRelease("A4", "4n");
}

// Geld/koop geluid
function speelGeldGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Ka-ching geluid simuleren
  bellSynth.triggerAttackRelease("G4", "16n", now);
  bellSynth.triggerAttackRelease("C5", "16n", now + 0.1);
  bellSynth.triggerAttackRelease("E5", "8n", now + 0.2);
}

// Plant/zaai geluid
function speelPlantGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  // Zachte toon voor planten
  uiSynth.triggerAttackRelease("D4", "8n");
}

// Water geven geluid
function speelWaterGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Druppel geluid simuleren met meerdere korte tonen
  uiSynth.triggerAttackRelease("B4", "32n", now);
  uiSynth.triggerAttackRelease("A4", "32n", now + 0.1);
  uiSynth.triggerAttackRelease("G4", "32n", now + 0.2);
}

// Oogst geluid
function speelOogstGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Blije korte melodie
  bellSynth.triggerAttackRelease("E4", "16n", now);
  bellSynth.triggerAttackRelease("G4", "16n", now + 0.1);
  bellSynth.triggerAttackRelease("B4", "8n", now + 0.2);
}

// Tab wissel geluid
function speelTabWisselGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  swooshSynth.triggerAttackRelease("F4", "16n");
}

// Loop/stap geluid (zachte drum-achtige toon)
function speelLoopGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  // Alterneer tussen twee toonhoogtes voor meer realistische stappen
  const tonen = ["C3", "G3"];
  const toon = tonen[Math.floor(Math.random() * tonen.length)];
  uiSynth.triggerAttackRelease(toon, "32n");
}

// Deur open/sluiten geluid
function speelDeurGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Deur geluid simuleren met twee verschillende tonen
  uiSynth.triggerAttackRelease("D3", "8n", now);
  swooshSynth.triggerAttackRelease("A3", "8n", now + 0.15);
}

// Slaap geluid (rustgevende melodie)
function speelSlaapGeluid() {
  if (!geluidseffectenEnabled) return;
  
  initializeIfNeeded();
  
  const now = Tone.now();
  
  // Zachte slaapliedje melodie
  bellSynth.triggerAttackRelease("C4", "4n", now);
  bellSynth.triggerAttackRelease("A3", "4n", now + 0.5);
  bellSynth.triggerAttackRelease("F3", "2n", now + 1.0);
}

// Helper functie om synths te initialiseren als dat nog niet gebeurd is
function initializeIfNeeded() {
  if (!clickSynth) {
    initUISynths();
  }
}

// Toggle voor geluidseffecten aan/uit
function toggleGeluidseffecten() {
  geluidseffectenEnabled = !geluidseffectenEnabled;
  speelMeldingGeluid(); // Bevestiging
  return geluidseffectenEnabled;
}

// Check of geluidseffecten aanstaan
function zijnGeluidseffectenAan() {
  return geluidseffectenEnabled;
}

// Update de geluid aan/uit knop tekst
function updateSoundButton() {
  const btn = document.getElementById("soundToggleBtn");
  if (!btn) return;
  btn.textContent = geluidseffectenEnabled ? "🔊 Geluid aan" : "🔇 Geluid uit";
}

// Exporteer alle functies voor gebruik in andere bestanden
window.speelKnopKlikGeluid = speelKnopKlikGeluid;
window.speelMenuHoverGeluid = speelMenuHoverGeluid;
window.speelMenuToggleGeluid = speelMenuToggleGeluid;
window.speelSuccesGeluid = speelSuccesGeluid;
window.speelErrorGeluid = speelErrorGeluid;
window.speelMeldingGeluid = speelMeldingGeluid;
window.speelGeldGeluid = speelGeldGeluid;
window.speelPlantGeluid = speelPlantGeluid;
window.speelWaterGeluid = speelWaterGeluid;
window.speelOogstGeluid = speelOogstGeluid;
window.speelTabWisselGeluid = speelTabWisselGeluid;
window.speelLoopGeluid = speelLoopGeluid;
window.speelDeurGeluid = speelDeurGeluid;
window.speelSlaapGeluid = speelSlaapGeluid;
window.toggleGeluidseffecten = toggleGeluidseffecten;
window.zijnGeluidseffectenAan = zijnGeluidseffectenAan;
window.updateSoundButton = updateSoundButton;