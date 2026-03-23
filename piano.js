'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const FALL_SPEED    = 280;   // px per second
const PERFECT_WIN   = 55;    // ms either side
const GOOD_WIN      = 130;   // ms either side
const LOOKAHEAD_MS  = 2200;  // spawn notes this far ahead

const NOTE_FREQS = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4':  349.23, 'F#4': 369.99, 'G4':  392.00,
  'G#4': 415.30,'A4':  440.00, 'A#4': 466.16, 'B4':  493.88,
  'C5': 523.25
};

// Keyboard key → note name
const KEY_TO_NOTE = {
  'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4',
  'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5',
  'w': 'C#4','e': 'D#4','t': 'F#4','y': 'G#4','u': 'A#4'
};

// Note name → CSS-safe class suffix (no # symbols)
const NOTE_CLASS = {
  'C4':'C4','D4':'D4','E4':'E4','F4':'F4',
  'G4':'G4','A4':'A4','B4':'B4','C5':'C5',
  'C#4':'Cs4','D#4':'Ds4','F#4':'Fs4','G#4':'Gs4','A#4':'As4'
};

// Note name → lane element id
const NOTE_LANE_ID = {
  'C4':'lane-C4','D4':'lane-D4','E4':'lane-E4','F4':'lane-F4',
  'G4':'lane-G4','A4':'lane-A4','B4':'lane-B4','C5':'lane-C5',
  'C#4':'lane-Cs4','D#4':'lane-Ds4','F#4':'lane-Fs4','G#4':'lane-Gs4','A#4':'lane-As4'
};

// Note name → piano key element id
const NOTE_KEY_ID = {
  'C4':'key-C4','D4':'key-D4','E4':'key-E4','F4':'key-F4',
  'G4':'key-G4','A4':'key-A4','B4':'key-B4','C5':'key-C5',
  'C#4':'key-Cs4','D#4':'key-Ds4','F#4':'key-Fs4','G#4':'key-Gs4','A#4':'key-As4'
};

// ─── SongLibrary ──────────────────────────────────────────────────────────────
class SongLibrary {
  static SONGS = {
    twinkle: {
      id: 'twinkle',
      title: 'Twinkle Twinkle Little Star',
      bpm: 96,
      difficulty: 'easy',
      notes: [
        // "Twinkle twinkle"
        {beat:0,   note:'C4', dur:1}, {beat:1,   note:'C4', dur:1},
        {beat:2,   note:'G4', dur:1}, {beat:3,   note:'G4', dur:1},
        // "little star"
        {beat:4,   note:'A4', dur:1}, {beat:5,   note:'A4', dur:1},
        {beat:6,   note:'G4', dur:2},
        // "How I wonder"
        {beat:8,   note:'F4', dur:1}, {beat:9,   note:'F4', dur:1},
        {beat:10,  note:'E4', dur:1}, {beat:11,  note:'E4', dur:1},
        // "what you are"
        {beat:12,  note:'D4', dur:1}, {beat:13,  note:'D4', dur:1},
        {beat:14,  note:'C4', dur:2},
        // "Up above the world so high"
        {beat:16,  note:'G4', dur:1}, {beat:17,  note:'G4', dur:1},
        {beat:18,  note:'F4', dur:1}, {beat:19,  note:'F4', dur:1},
        {beat:20,  note:'E4', dur:1}, {beat:21,  note:'E4', dur:1},
        {beat:22,  note:'D4', dur:2},
        // "Like a diamond in the sky"
        {beat:24,  note:'G4', dur:1}, {beat:25,  note:'G4', dur:1},
        {beat:26,  note:'F4', dur:1}, {beat:27,  note:'F4', dur:1},
        {beat:28,  note:'E4', dur:1}, {beat:29,  note:'E4', dur:1},
        {beat:30,  note:'D4', dur:2},
        // "Twinkle twinkle little star"
        {beat:32,  note:'C4', dur:1}, {beat:33,  note:'C4', dur:1},
        {beat:34,  note:'G4', dur:1}, {beat:35,  note:'G4', dur:1},
        {beat:36,  note:'A4', dur:1}, {beat:37,  note:'A4', dur:1},
        {beat:38,  note:'G4', dur:2},
        // "How I wonder what you are"
        {beat:40,  note:'F4', dur:1}, {beat:41,  note:'F4', dur:1},
        {beat:42,  note:'E4', dur:1}, {beat:43,  note:'E4', dur:1},
        {beat:44,  note:'D4', dur:1}, {beat:45,  note:'D4', dur:1},
        {beat:46,  note:'C4', dur:2},
      ]
    },
    mary: {
      id: 'mary',
      title: 'Mary Had a Little Lamb',
      bpm: 108,
      difficulty: 'easy',
      notes: [
        {beat:0,  note:'E4', dur:1}, {beat:1,  note:'D4', dur:1},
        {beat:2,  note:'C4', dur:1}, {beat:3,  note:'D4', dur:1},
        {beat:4,  note:'E4', dur:1}, {beat:5,  note:'E4', dur:1},
        {beat:6,  note:'E4', dur:2},
        {beat:8,  note:'D4', dur:1}, {beat:9,  note:'D4', dur:1},
        {beat:10, note:'D4', dur:2},
        {beat:12, note:'E4', dur:1}, {beat:13, note:'G4', dur:1},
        {beat:14, note:'G4', dur:2},
        {beat:16, note:'E4', dur:1}, {beat:17, note:'D4', dur:1},
        {beat:18, note:'C4', dur:1}, {beat:19, note:'D4', dur:1},
        {beat:20, note:'E4', dur:1}, {beat:21, note:'E4', dur:1},
        {beat:22, note:'E4', dur:1}, {beat:23, note:'E4', dur:1},
        {beat:24, note:'D4', dur:1}, {beat:25, note:'D4', dur:1},
        {beat:26, note:'E4', dur:1}, {beat:27, note:'D4', dur:1},
        {beat:28, note:'C4', dur:4},
      ]
    },
    hotcrossbuns: {
      id: 'hotcrossbuns',
      title: 'Hot Cross Buns',
      bpm: 112,
      difficulty: 'easy',
      notes: [
        {beat:0,  note:'E4', dur:1}, {beat:1,  note:'D4', dur:1},
        {beat:2,  note:'C4', dur:2},
        {beat:4,  note:'E4', dur:1}, {beat:5,  note:'D4', dur:1},
        {beat:6,  note:'C4', dur:2},
        {beat:8,  note:'C4', dur:0.5}, {beat:8.5, note:'C4', dur:0.5},
        {beat:9,  note:'C4', dur:0.5}, {beat:9.5, note:'C4', dur:0.5},
        {beat:10, note:'D4', dur:0.5}, {beat:10.5,note:'D4', dur:0.5},
        {beat:11, note:'D4', dur:0.5}, {beat:11.5,note:'D4', dur:0.5},
        {beat:12, note:'E4', dur:1}, {beat:13, note:'D4', dur:1},
        {beat:14, note:'C4', dur:2},
      ]
    },
    birthday: {
      id: 'birthday',
      title: 'Happy Birthday',
      bpm: 90,
      difficulty: 'medium',
      notes: [
        {beat:0,   note:'C4', dur:0.5}, {beat:0.5, note:'C4', dur:0.5},
        {beat:1,   note:'D4', dur:1},   {beat:2,   note:'C4', dur:1},
        {beat:3,   note:'F4', dur:1},   {beat:4,   note:'E4', dur:2},
        {beat:6,   note:'C4', dur:0.5}, {beat:6.5, note:'C4', dur:0.5},
        {beat:7,   note:'D4', dur:1},   {beat:8,   note:'C4', dur:1},
        {beat:9,   note:'G4', dur:1},   {beat:10,  note:'F4', dur:2},
        {beat:12,  note:'C4', dur:0.5}, {beat:12.5,note:'C4', dur:0.5},
        {beat:13,  note:'C5', dur:1},   {beat:14,  note:'A4', dur:1},
        {beat:15,  note:'F4', dur:1},   {beat:16,  note:'E4', dur:1},
        {beat:17,  note:'D4', dur:2},
        {beat:19,  note:'B4', dur:0.5}, {beat:19.5,note:'B4', dur:0.5},
        {beat:20,  note:'A4', dur:1},   {beat:21,  note:'F4', dur:1},
        {beat:22,  note:'G4', dur:1},   {beat:23,  note:'F4', dur:3},
      ]
    },
    odetojoy: {
      id: 'odetojoy',
      title: 'Ode to Joy',
      bpm: 100,
      difficulty: 'medium',
      notes: [
        {beat:0,  note:'E4', dur:1}, {beat:1,  note:'E4', dur:1},
        {beat:2,  note:'F4', dur:1}, {beat:3,  note:'G4', dur:1},
        {beat:4,  note:'G4', dur:1}, {beat:5,  note:'F4', dur:1},
        {beat:6,  note:'E4', dur:1}, {beat:7,  note:'D4', dur:1},
        {beat:8,  note:'C4', dur:1}, {beat:9,  note:'C4', dur:1},
        {beat:10, note:'D4', dur:1}, {beat:11, note:'E4', dur:1},
        {beat:12, note:'E4', dur:1.5},{beat:13.5,note:'D4',dur:0.5},
        {beat:14, note:'D4', dur:2},
        {beat:16, note:'E4', dur:1}, {beat:17, note:'E4', dur:1},
        {beat:18, note:'F4', dur:1}, {beat:19, note:'G4', dur:1},
        {beat:20, note:'G4', dur:1}, {beat:21, note:'F4', dur:1},
        {beat:22, note:'E4', dur:1}, {beat:23, note:'D4', dur:1},
        {beat:24, note:'C4', dur:1}, {beat:25, note:'C4', dur:1},
        {beat:26, note:'D4', dur:1}, {beat:27, note:'E4', dur:1},
        {beat:28, note:'D4', dur:1.5},{beat:29.5,note:'C4',dur:0.5},
        {beat:30, note:'C4', dur:2},
      ]
    }
  };

  static getSong(id) { return this.SONGS[id] || null; }
  static getAllSongs() { return Object.values(this.SONGS); }
}

// ─── AudioEngine ──────────────────────────────────────────────────────────────
class AudioEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(noteName, duration = 1.4) {
    if (!this.ctx) return;
    this.resume();
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.value = 0.12;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.65, now + 0.006);
    env.gain.exponentialRampToValueAtTime(0.2, now + 0.22);
    env.gain.setValueAtTime(0.2, now + duration - 0.1);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration + 1.0);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3800;

    osc2.connect(overtoneGain);
    overtoneGain.connect(env);
    osc1.connect(env);
    env.connect(filter);
    filter.connect(this.ctx.destination);

    const stop = now + duration + 1.2;
    osc1.start(now); osc1.stop(stop);
    osc2.start(now); osc2.stop(stop);
  }
}

// ─── InputManager ─────────────────────────────────────────────────────────────
class InputManager {
  constructor(onNoteOn, onNoteOff) {
    this._onNoteOn  = onNoteOn;
    this._onNoteOff = onNoteOff;
    this._held = new Set();
    this._kbDown  = this._handleKeyDown.bind(this);
    this._kbUp    = this._handleKeyUp.bind(this);
    this._pointers = new Map(); // touch/mouse tracking per key el
    document.addEventListener('keydown', this._kbDown);
    document.addEventListener('keyup',   this._kbUp);
    this._bindPianoKeys();
  }

  _handleKeyDown(e) {
    if (e.repeat) return;
    const note = KEY_TO_NOTE[e.key.toLowerCase()];
    if (!note) return;
    if (this._held.has(note)) return;
    this._held.add(note);
    this._onNoteOn(note);
  }

  _handleKeyUp(e) {
    const note = KEY_TO_NOTE[e.key.toLowerCase()];
    if (!note) return;
    this._held.delete(note);
    this._onNoteOff(note);
  }

  _bindPianoKeys() {
    document.querySelectorAll('.white-key, .black-key').forEach(el => {
      const note = el.dataset.note;

      const onDown = (ev) => {
        ev.preventDefault();
        if (!this._pointers.has(el)) {
          this._pointers.set(el, true);
          this._onNoteOn(note);
        }
      };
      const onUp = (ev) => {
        ev.preventDefault();
        if (this._pointers.has(el)) {
          this._pointers.delete(el);
          this._onNoteOff(note);
        }
      };

      el.addEventListener('mousedown',  onDown);
      el.addEventListener('mouseup',    onUp);
      el.addEventListener('mouseleave', onUp);
      el.addEventListener('touchstart', onDown, { passive: false });
      el.addEventListener('touchend',   onUp,   { passive: false });
      el.addEventListener('touchcancel',onUp,   { passive: false });
    });
  }

  destroy() {
    document.removeEventListener('keydown', this._kbDown);
    document.removeEventListener('keyup',   this._kbUp);
    this._held.clear();
    this._pointers.clear();
  }
}

// ─── NoteRenderer ─────────────────────────────────────────────────────────────
class NoteRenderer {
  constructor(highwayEl) {
    this.highway = highwayEl;
    this._notes  = new Map();   // id → { el, lane, hitTimeMs }
    this._nextId = 0;
  }

  _hitZoneY() {
    return this.highway.clientHeight - parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--hit-zone-h') || '18'
    );
  }

  spawnNote(noteName, hitTimeMs) {
    const id = this._nextId++;
    const laneId = NOTE_LANE_ID[noteName];
    if (!laneId) return null;
    const laneEl = document.getElementById(laneId);
    if (!laneEl) return null;

    const el = document.createElement('div');
    el.className = `falling-note note-${NOTE_CLASS[noteName]}`;
    laneEl.appendChild(el);

    this._notes.set(id, { el, laneEl, noteName, hitTimeMs });
    return id;
  }

  update(nowMs) {
    const hitZoneY = this._hitZoneY();
    this._notes.forEach((note) => {
      const timeUntil = (note.hitTimeMs - nowMs) / 1000;
      const yPos = hitZoneY - FALL_SPEED * timeUntil;
      note.el.style.transform = `translateY(${yPos}px)`;
    });
  }

  hitNote(id) {
    const note = this._notes.get(id);
    if (!note) return;
    note.el.classList.add('hit-pop');
    note.el.addEventListener('animationend', () => {
      note.el.remove();
    }, { once: true });
    this._notes.delete(id);
  }

  missNote(id) {
    const note = this._notes.get(id);
    if (!note) return;
    note.el.classList.add('miss-flash');
    setTimeout(() => note.el.remove(), 200);
    this._notes.delete(id);
  }

  clear() {
    this._notes.forEach(note => note.el.remove());
    this._notes.clear();
  }
}

// ─── ScoreTracker ─────────────────────────────────────────────────────────────
class ScoreTracker {
  constructor() { this.reset(); }

  reset() {
    this.score   = 0;
    this.combo   = 0;
    this.maxCombo= 0;
    this.perfect = 0;
    this.good    = 0;
    this.miss    = 0;
  }

  _multiplier() {
    if (this.combo >= 30) return 4;
    if (this.combo >= 20) return 3;
    if (this.combo >= 10) return 2;
    return 1;
  }

  recordHit(deltaMs) {
    const isPerfect = deltaMs <= PERFECT_WIN;
    const pts = isPerfect ? 300 : 100;
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    this.score += pts * this._multiplier();
    if (isPerfect) this.perfect++; else this.good++;
    return isPerfect ? 'perfect' : 'good';
  }

  recordMiss() {
    this.combo = 0;
    this.miss++;
  }

  getGrade() {
    const total = this.perfect + this.good + this.miss;
    if (total === 0) return 'D';
    const pct = (this.perfect * 300 + this.good * 100) / (total * 300);
    if (pct >= 0.95) return 'S';
    if (pct >= 0.80) return 'A';
    if (pct >= 0.65) return 'B';
    if (pct >= 0.50) return 'C';
    return 'D';
  }
}

// ─── GameEngine ───────────────────────────────────────────────────────────────
class GameEngine {
  constructor() {
    this.state     = 'menu';
    this.audio     = new AudioEngine();
    this.score     = new ScoreTracker();
    this.renderer  = null;   // created after DOM ready
    this.input     = null;
    this.song      = null;
    this.noteQueue = [];     // sorted by hitTimeMs, not yet spawned
    this.activeNotes = [];   // { id, noteName, hitTimeMs }
    this.startTime = 0;      // performance.now() when song started
    this.animFrame = null;
    this._songLastBeat = 0;
    this._feedbackTimeout = null;
    this._lastPlayedSongId = null;
    this._heldNotes = new Set();
  }

  init() {
    this.renderer = new NoteRenderer(document.getElementById('note-highway'));
    this._buildSongCards();
    this._bindUI();
    this.setState('menu');
  }

  // ── UI wiring ────────────────────────────────────────────────────────────────
  _bindUI() {
    document.getElementById('btn-freeplay').addEventListener('click', () => {
      this.audio.init();
      this.startFreePlay();
    });
    document.getElementById('btn-songs').addEventListener('click', () => {
      this.audio.init();
      this.setState('songs');
    });
    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.setState('menu');
    });
    document.getElementById('btn-pause').addEventListener('click', () => {
      this.pause();
    });
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resume();
    });
    document.getElementById('btn-quit').addEventListener('click', () => {
      this._stopGame();
      this.setState('menu');
    });
    document.getElementById('btn-play-again').addEventListener('click', () => {
      if (this._lastPlayedSongId) {
        this.startSong(this._lastPlayedSongId);
      } else {
        this.startFreePlay();
      }
    });
    document.getElementById('btn-result-menu').addEventListener('click', () => {
      this.setState('menu');
    });
  }

  _buildSongCards() {
    const list = document.getElementById('song-list');
    SongLibrary.getAllSongs().forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card';
      const best = this._getBest(song.id);
      const diffLabel = song.difficulty.charAt(0).toUpperCase() + song.difficulty.slice(1);
      card.innerHTML = `
        <div class="song-card-left">
          <div class="song-title">${song.title}</div>
          <div class="song-meta">${song.bpm} BPM · ${song.notes.length} notes</div>
        </div>
        <div class="song-card-right">
          <span class="difficulty-badge diff-${song.difficulty}">${diffLabel}</span>
          <span class="song-best-score">Best: ${best > 0 ? best.toLocaleString() : '--'}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.audio.init();
        this.startSong(song.id);
      });
      list.appendChild(card);
    });
  }

  _refreshSongCards() {
    const list = document.getElementById('song-list');
    list.innerHTML = '';
    this._buildSongCards();
  }

  // ── State machine ────────────────────────────────────────────────────────────
  setState(name) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add('active');

    if (name !== 'playing' && name !== 'paused') {
      this._stopLoop();
    }
    if (name === 'menu' || name === 'songs' || name === 'results') {
      if (this.input) { this.input.destroy(); this.input = null; }
      this._heldNotes.clear();
    }
    this.state = name;
  }

  // ── Song start ───────────────────────────────────────────────────────────────
  startSong(songId) {
    const song = SongLibrary.getSong(songId);
    if (!song) return;
    this._lastPlayedSongId = songId;
    this.song = song;
    this._prepareSong(song);
    this._countdown(() => this._beginGameLoop());
  }

  startFreePlay() {
    this._lastPlayedSongId = null;
    this.song = null;
    this.score.reset();
    this.noteQueue   = [];
    this.activeNotes = [];
    this.renderer.clear();
    this.setState('playing');
    document.getElementById('hud-song-name').textContent = 'Free Play';
    this._updateHUD();
    this.input = new InputManager(
      note => this._noteOn(note),
      note => this._noteOff(note)
    );
    // No game loop needed for free play (no notes to fall)
    this._startLoop();
  }

  _prepareSong(song) {
    this.score.reset();
    this.renderer.clear();
    this.activeNotes = [];
    const secPerBeat = 60 / song.bpm;
    this.noteQueue = song.notes.map((n, i) => ({
      id: null,
      note: n.note,
      hitTimeMs: n.beat * secPerBeat * 1000,
      duration: n.dur,
      spawned: false,
      index: i
    })).sort((a, b) => a.hitTimeMs - b.hitTimeMs);
    this._songLastBeat = Math.max(...song.notes.map(n => n.beat + n.dur));
    this._songDurationMs = (this._songLastBeat + 2) * (60 / song.bpm) * 1000;
  }

  _countdown(cb) {
    this.setState('playing');
    document.getElementById('hud-song-name').textContent = this.song.title;
    this._updateHUD();

    const overlay = document.getElementById('countdown-overlay');
    const numEl   = document.getElementById('countdown-number');
    overlay.classList.remove('hidden');

    const steps = ['3','2','1','GO!'];
    let i = 0;
    const tick = () => {
      numEl.textContent = steps[i];
      // Restart animation
      numEl.style.animation = 'none';
      void numEl.offsetWidth;
      numEl.style.animation = '';
      i++;
      if (i < steps.length) {
        setTimeout(tick, 900);
      } else {
        setTimeout(() => {
          overlay.classList.add('hidden');
          cb();
        }, 600);
      }
    };
    tick();
  }

  _beginGameLoop() {
    this.startTime = performance.now();
    if (this.input) { this.input.destroy(); this.input = null; }
    this.input = new InputManager(
      note => this._noteOn(note),
      note => this._noteOff(note)
    );
    this._startLoop();
  }

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  _startLoop() {
    if (this.animFrame) return;
    const loop = (ts) => {
      this.animFrame = requestAnimationFrame(loop);
      this._tick(ts);
    };
    this.animFrame = requestAnimationFrame(loop);
  }

  _stopLoop() {
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
  }

  _stopGame() {
    this._stopLoop();
    if (this.input) { this.input.destroy(); this.input = null; }
    this.renderer.clear();
    this.activeNotes = [];
    this.noteQueue = [];
    this._heldNotes.clear();
    this._clearAllKeyHighlights();
  }

  _tick(ts) {
    if (this.state === 'paused') return;

    const nowMs = performance.now() - this.startTime;

    // Spawn upcoming notes
    if (this.song) {
      for (const qn of this.noteQueue) {
        if (qn.spawned) continue;
        if (qn.hitTimeMs - nowMs <= LOOKAHEAD_MS) {
          const rendId = this.renderer.spawnNote(qn.note, qn.hitTimeMs);
          qn.spawned = true;
          this.activeNotes.push({ rendId, note: qn.note, hitTimeMs: qn.hitTimeMs });
        }
      }
    }

    // Update note positions
    this.renderer.update(nowMs);

    // Detect misses (notes that passed the hit zone)
    for (let i = this.activeNotes.length - 1; i >= 0; i--) {
      const an = this.activeNotes[i];
      if (nowMs > an.hitTimeMs + GOOD_WIN) {
        this.score.recordMiss();
        this.renderer.missNote(an.rendId);
        this.activeNotes.splice(i, 1);
        this._showFeedback('miss');
        this._updateHUD();
      }
    }

    // Check if song is done
    if (this.song && nowMs > this._songDurationMs && this.activeNotes.length === 0) {
      this._endSong();
    }
  }

  // ── Note input ───────────────────────────────────────────────────────────────
  _noteOn(noteName) {
    if (this._heldNotes.has(noteName)) return;
    this._heldNotes.add(noteName);

    // Highlight key
    const keyId = NOTE_KEY_ID[noteName];
    if (keyId) document.getElementById(keyId)?.classList.add('active');

    // Play sound
    this.audio.playNote(noteName);

    if (this.state !== 'playing') return;

    if (this.song) {
      // Hit detection
      const nowMs = performance.now() - this.startTime;
      const candidates = this.activeNotes.filter(n =>
        n.note === noteName && Math.abs(nowMs - n.hitTimeMs) <= GOOD_WIN
      );
      if (candidates.length === 0) return;

      const hit = candidates.reduce((best, n) =>
        Math.abs(nowMs - n.hitTimeMs) < Math.abs(nowMs - best.hitTimeMs) ? n : best
      );
      const delta = Math.abs(nowMs - hit.hitTimeMs);
      const result = this.score.recordHit(delta);
      this.renderer.hitNote(hit.rendId);
      this.activeNotes = this.activeNotes.filter(n => n !== hit);
      this._showFeedback(result);
      this._updateHUD();
    }
  }

  _noteOff(noteName) {
    this._heldNotes.delete(noteName);
    const keyId = NOTE_KEY_ID[noteName];
    if (keyId) document.getElementById(keyId)?.classList.remove('active');
  }

  // ── Feedback ─────────────────────────────────────────────────────────────────
  _showFeedback(type) {
    const el = document.getElementById('feedback-popup');
    // Reset
    el.className = '';
    el.textContent = '';
    void el.offsetWidth; // force reflow

    const map = { perfect: ['PERFECT', 'show-perfect'], good: ['GOOD', 'show-good'], miss: ['MISS', 'show-miss'] };
    const [text, cls] = map[type] || ['', ''];
    el.textContent = text;
    el.className = cls;

    if (this._feedbackTimeout) clearTimeout(this._feedbackTimeout);
    this._feedbackTimeout = setTimeout(() => { el.className = ''; }, 600);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────────
  _updateHUD() {
    document.getElementById('hud-score').textContent = `Score: ${this.score.score.toLocaleString()}`;
    const comboEl = document.getElementById('hud-combo');
    const mult = this.score._multiplier ? this.score._multiplier() : 1;
    comboEl.textContent = `Combo: ${this.score.combo}x`;
    if (mult > 1) comboEl.textContent += ` (×${mult})`;

    // Pop animation on combo increment
    comboEl.classList.remove('pop');
    void comboEl.offsetWidth;
    if (this.score.combo > 0) comboEl.classList.add('pop');
    setTimeout(() => comboEl.classList.remove('pop'), 200);
  }

  // ── Pause / Resume ───────────────────────────────────────────────────────────
  pause() {
    if (this.state !== 'playing') return;
    this.setState('pause');
    this.audio.ctx && this.audio.ctx.suspend && this.audio.ctx.suspend();
    this._pauseTime = performance.now();
  }

  resume() {
    if (this.state !== 'pause') return;
    this.setState('playing');
    this.audio.resume();
    // Shift startTime forward by the duration of the pause
    const pausedFor = performance.now() - this._pauseTime;
    this.startTime += pausedFor;
    this._startLoop();
  }

  // ── Song end ─────────────────────────────────────────────────────────────────
  _endSong() {
    this._stopLoop();
    if (this.input) { this.input.destroy(); this.input = null; }
    this.renderer.clear();

    const grade = this.score.getGrade();
    const total = this.score.perfect + this.score.good + this.score.miss;

    // High score
    const isNew = this._saveBest(this.song.id, this.score.score);

    // Populate results screen
    document.getElementById('result-song-name').textContent = this.song.title;

    const gradeEl = document.getElementById('result-grade');
    gradeEl.textContent = grade;
    gradeEl.className = `result-grade grade-${grade}`;

    document.getElementById('result-score').textContent = this.score.score.toLocaleString();

    const newBestEl = document.getElementById('result-new-best');
    isNew ? newBestEl.classList.remove('hidden') : newBestEl.classList.add('hidden');

    document.getElementById('result-stats').innerHTML = `
      <div class="stat-item">
        <span class="stat-value stat-perfect">${this.score.perfect}</span>
        <span class="stat-label">Perfect</span>
      </div>
      <div class="stat-item">
        <span class="stat-value stat-good">${this.score.good}</span>
        <span class="stat-label">Good</span>
      </div>
      <div class="stat-item">
        <span class="stat-value stat-miss">${this.score.miss}</span>
        <span class="stat-label">Miss</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${this.score.maxCombo}</span>
        <span class="stat-label">Max Combo</span>
      </div>
    `;

    this._refreshSongCards();
    this.setState('results');
  }

  // ── Local storage ─────────────────────────────────────────────────────────────
  _getBest(songId) {
    return parseInt(localStorage.getItem(`piano-hero-best-${songId}`) || '0');
  }

  _saveBest(songId, newScore) {
    const prev = this._getBest(songId);
    if (newScore > prev) {
      localStorage.setItem(`piano-hero-best-${songId}`, String(newScore));
      return true;
    }
    return false;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  _clearAllKeyHighlights() {
    document.querySelectorAll('.white-key.active, .black-key.active')
      .forEach(el => el.classList.remove('active'));
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const game = new GameEngine();
document.addEventListener('DOMContentLoaded', () => game.init());
