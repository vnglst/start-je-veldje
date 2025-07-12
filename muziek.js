// muziek.js
// 🎵 Achtergrondmuziek voor Start je Veldje
// Gebaseerd op Stardew Valley-achtige vrolijke melodie

let synth, bassSynth, drumSynth, sequence, bassSequence, drumSequence;
let isPlaying = false;
let currentTempo = 120;

function initSynths() {
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.5 },
    filter: { frequency: 800, type: "lowpass" },
  }).toDestination();
  bassSynth = new Tone.MonoSynth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.8 },
  }).toDestination();
  drumSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 5,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
  }).toDestination();
  synth.volume.value = -8;
  bassSynth.volume.value = -15;
  drumSynth.volume.value = -20;
}

const mainMelody = [
  // Vivaldi-achtig: arpeggio's en toonladdermotieven
  { note: "C4", duration: "16n" },
  { note: "E4", duration: "16n" },
  { note: "G4", duration: "16n" },
  { note: "C5", duration: "8n" },
  { note: "B4", duration: "16n" },
  { note: "G4", duration: "16n" },
  { note: "E4", duration: "16n" },
  { note: "C4", duration: "8n" },
  { note: "D4", duration: "16n" },
  { note: "F4", duration: "16n" },
  { note: "A4", duration: "16n" },
  { note: "D5", duration: "8n" },
  { note: "C5", duration: "16n" },
  { note: "A4", duration: "16n" },
  { note: "F4", duration: "16n" },
  { note: "D4", duration: "8n" },
  // Sequentie stijgend
  { note: "E4", duration: "16n" },
  { note: "G4", duration: "16n" },
  { note: "B4", duration: "16n" },
  { note: "E5", duration: "8n" },
  { note: "D5", duration: "16n" },
  { note: "B4", duration: "16n" },
  { note: "G4", duration: "16n" },
  { note: "E4", duration: "8n" },
  // Rustig motief
  { note: "C5", duration: "4n" },
  null,
  { note: "A4", duration: "8n" },
  { note: "G4", duration: "8n" },
  { note: "F4", duration: "4n" },
  null,
  // Dalende toonladder
  { note: "E5", duration: "16n" },
  { note: "D5", duration: "16n" },
  { note: "C5", duration: "16n" },
  { note: "B4", duration: "16n" },
  { note: "A4", duration: "16n" },
  { note: "G4", duration: "16n" },
  { note: "F4", duration: "16n" },
  { note: "E4", duration: "8n" },
  // Afsluiting
  { note: "C4", duration: "2n" },
  null,
];
const mainBass = [
  // Barokke baslijn: grondtonen en kwinten
  "C2",
  null,
  "G2",
  null,
  "A2",
  null,
  "E2",
  null,
  "F2",
  null,
  "C3",
  null,
  "G2",
  null,
  "D2",
  null,
  "E2",
  null,
  "B1",
  null,
  "C2",
  null,
  "G1",
  null,
  "A1",
  null,
  "E2",
  null,
  "F2",
  null,
  "C2",
  null,
  // Afsluiting
  "C2",
  null,
  null,
  null,
];
const drumPattern = [
  // Simpele barokke puls, af en toe een accent
  "C2",
  null,
  null,
  null,
  "C2",
  null,
  null,
  null,
  null,
  "C2",
  null,
  null,
  "C2",
  null,
  null,
  null,
  null,
  null,
  "C2",
  null,
  null,
  null,
  "C2",
  null,
  null,
  null,
  null,
  "C2",
  null,
  null,
  null,
  null,
];

function createSequences() {
  stopMusic();
  sequence = new Tone.Sequence(
    (time, note) => {
      if (note && synth) synth.triggerAttackRelease(note.note, note.duration, time);
    },
    mainMelody,
    "4n"
  );
  bassSequence = new Tone.Sequence(
    (time, note) => {
      if (note && bassSynth) bassSynth.triggerAttackRelease(note, "8n", time);
    },
    mainBass,
    "8n"
  );
  drumSequence = new Tone.Sequence(
    (time, note) => {
      if (note && drumSynth) drumSynth.triggerAttackRelease(note, "16n", time);
    },
    drumPattern,
    "8n"
  );
}

function updateTempo() {
  if (Tone.Transport.state === "started") {
    Tone.Transport.bpm.value = currentTempo;
  }
}

async function playMusic() {
  if (isPlaying) return;
  await Tone.start();
  if (!synth) initSynths();
  createSequences();
  Tone.Transport.bpm.value = currentTempo;
  sequence.start(0);
  bassSequence.start(0);
  drumSequence.start(0);
  Tone.Transport.start();
  isPlaying = true;
  if (window.updateMusicButton) updateMusicButton();
}

function stopMusic() {
  if (!isPlaying) return;
  Tone.Transport.stop();
  if (sequence) sequence.stop();
  if (bassSequence) bassSequence.stop();
  if (drumSequence) drumSequence.stop();
  isPlaying = false;
  if (window.updateMusicButton) updateMusicButton();
}

// Voor knop UI
window.toggleMusic = function () {
  if (isPlaying) {
    stopMusic();
  } else {
    playMusic();
  }
};
window.updateMusicButton = function () {
  const btn = document.getElementById("musicToggleBtn");
  if (!btn) return;
  btn.textContent = isPlaying ? "🔈 Muziek uit" : "🎵 Muziek aan";
};

// Optioneel: stop muziek bij verlaten pagina
window.addEventListener("beforeunload", () => {
  if (isPlaying) stopMusic();
});
