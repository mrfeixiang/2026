/* Camera Fire Rhythm — fingertip touch-to-clear on the beat.
 *
 * Targets spawn on musical note onsets. Touch them with your fingertip
 * (index / middle / ring / pinky / thumb tips) inside the timing window
 * for PERFECT / GOOD.
 *
 * Music is synthesized in-browser with Web Audio API:
 *   - ode: Beethoven "Ode to Joy" (public domain melody)
 *   - andFire: original Hawkwind-flavored space-rock synth tribute
 *   - viva: original Coldplay-inspired orchestral-pop tribute
 *           (NOT the copyrighted "Viva La Vida" recording or melody)
 */

(() => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("startBtn");
  const replayBtn = document.getElementById("replayBtn");
  const permission = document.getElementById("permission");
  const result = document.getElementById("result");
  const resultText = document.getElementById("resultText");
  const errMsg = document.getElementById("errMsg");
  const hud = document.getElementById("hud");
  const beatRing = document.getElementById("beatRing");
  const judgeEl = document.getElementById("judge");
  const comboBanner = document.getElementById("comboBanner");
  const trackSelect = document.getElementById("trackSelect");
  const trackPicks = document.getElementById("trackPicks");
  const muteToggle = document.getElementById("muteToggle");
  const sensSlider = document.getElementById("sensitivity");
  const sensVal = document.getElementById("sensVal");
  const touchStat = document.getElementById("touchStat");

  const trackStat = document.getElementById("trackStat");
  const beatStat = document.getElementById("beatStat");
  const comboStat = document.getElementById("comboStat");
  const perfectStat = document.getElementById("perfectStat");
  const goodStat = document.getElementById("goodStat");
  const missStat = document.getElementById("missStat");
  const scoreStat = document.getElementById("scoreStat");

  const WRIST = 0;
  const THUMB_TIP = 4;
  const INDEX_TIP = 8;
  const MIDDLE_TIP = 12;
  const RING_TIP = 16;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const TOUCH_TIPS = [INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP, THUMB_TIP];

  const PERFECT_WIN = 0.12;
  const GOOD_WIN = 0.26;

  const NOTE = {
    G3: 196.0, A3: 220.0, Bb3: 233.08, B3: 246.94,
    C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
    G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99,
  };

  const BASS = {
    F2: 87.31, G2: 98.0, A2: 110.0, Bb2: 116.54, C3: 130.81, D2: 73.42, E2: 82.41, D3: 146.83,
  };

  const TRACKS = {
    ode: {
      id: "ode",
      label: "欢乐颂",
      bpm: 96,
      hue: 48,
      notes: [
        ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
        ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
        ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
        ["E4", 1.5], ["D4", 0.5], ["D4", 2],
        ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
        ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
        ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
        ["D4", 1.5], ["C4", 0.5], ["C4", 2],
        ["D4", 1], ["D4", 1], ["E4", 1], ["C4", 1],
        ["D4", 1], ["E4", 0.5], ["F4", 0.5], ["E4", 1], ["C4", 1],
        ["D4", 1], ["E4", 0.5], ["F4", 0.5], ["E4", 1], ["D4", 1],
        ["C4", 1], ["D4", 1], ["G3", 2],
        ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
        ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
        ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
        ["D4", 1.5], ["C4", 0.5], ["C4", 2],
      ],
      bass: ["C3", "C3", "G2", "G2", "C3", "C3", "G2", "C3"],
      style: "classical",
    },
    andFire: {
      id: "andFire",
      label: "And Fire",
      bpm: 128,
      hue: 18,
      notes: [
        ["E4", 0.5], ["E4", 0.5], ["G4", 0.5], ["E4", 0.5],
        ["A4", 1], ["G4", 1],
        ["E4", 0.5], ["E4", 0.5], ["G4", 0.5], ["B4", 0.5],
        ["A4", 1], ["G4", 0.5], ["E4", 0.5],
        ["D4", 0.5], ["E4", 0.5], ["G4", 0.5], ["A4", 0.5],
        ["B4", 1], ["A4", 1],
        ["G4", 0.5], ["E4", 0.5], ["D4", 0.5], ["E4", 0.5],
        ["E4", 2],
        ["E4", 0.5], ["G4", 0.5], ["A4", 0.5], ["B4", 0.5],
        ["C5", 1], ["B4", 1],
        ["A4", 0.5], ["G4", 0.5], ["E4", 0.5], ["G4", 0.5],
        ["A4", 1], ["E4", 1],
        ["E4", 0.5], ["E4", 0.5], ["G4", 0.5], ["E4", 0.5],
        ["A4", 0.5], ["G4", 0.5], ["E4", 1],
        ["D4", 0.5], ["E4", 0.5], ["G4", 1],
        ["E4", 2],
      ],
      bass: ["E2", "E2", "G2", "A2", "E2", "D2", "E2", "E2"],
      style: "space",
    },
    // Original anthemic tribute — Coldplay-inspired energy, NOT Viva La Vida.
    viva: {
      id: "viva",
      label: "Viva (tribute)",
      bpm: 138,
      hue: 205,
      notes: [
        ["C5", 1], ["G4", 1], ["E4", 0.5], ["G4", 0.5], ["A4", 1],
        ["G4", 1], ["E4", 1], ["D4", 1], ["E4", 1],
        ["C5", 0.5], ["D5", 0.5], ["E5", 1], ["D5", 1], ["C5", 1], ["G4", 1],
        ["A4", 1], ["G4", 0.5], ["E4", 0.5], ["D4", 1], ["C4", 2],
        ["E5", 1], ["D5", 1], ["C5", 0.5], ["D5", 0.5], ["E5", 1],
        ["G5", 1], ["E5", 1], ["D5", 1], ["C5", 1],
        ["A4", 0.5], ["G4", 0.5], ["E4", 1], ["G4", 1], ["A4", 1], ["C5", 1],
        ["D5", 1], ["E5", 0.5], ["D5", 0.5], ["C5", 2],
        ["C5", 0.5], ["G4", 0.5], ["A4", 0.5], ["C5", 0.5],
        ["E5", 1], ["D5", 1],
        ["C5", 0.5], ["A4", 0.5], ["G4", 1], ["E4", 1], ["G4", 1],
        ["A4", 1], ["C5", 1], ["D5", 1], ["E5", 1],
        ["G5", 0.5], ["E5", 0.5], ["D5", 1], ["C5", 2],
      ],
      bass: ["C3", "G2", "A2", "F2", "C3", "G2", "A2", "F2"],
      style: "anthem",
    },
  };

  const state = {
    running: false,
    landmarks: null,
    handedness: null,
    tips: [],
    sensitivity: 0.55,
    muted: false,
    trackId: "ode",
    audioCtx: null,
    musicStart: 0,
    beatSec: 0,
    durationSec: 0,
    schedule: [],
    targets: [],
    flashes: [],
    sparks: [],
    combo: 0,
    maxCombo: 0,
    perfect: 0,
    good: 0,
    miss: 0,
    score: 0,
    lastFrame: performance.now(),
    lastPulseBeat: -1,
    finished: false,
    oscillators: [],
    masterGain: null,
  };

  function setTrack(id) {
    if (!TRACKS[id]) return;
    state.trackId = id;
    trackSelect.value = id;
    trackPicks.querySelectorAll(".track-pick").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.track === id);
    });
  }

  trackPicks.addEventListener("click", (e) => {
    const btn = e.target.closest(".track-pick");
    if (btn) setTrack(btn.dataset.track);
  });
  trackSelect.addEventListener("change", () => setTrack(trackSelect.value));
  muteToggle.addEventListener("change", () => {
    state.muted = muteToggle.checked;
    if (state.masterGain) state.masterGain.gain.value = state.muted ? 0 : 0.55;
  });
  sensSlider.addEventListener("input", () => {
    state.sensitivity = sensSlider.value / 100;
    sensVal.textContent = `${sensSlider.value}%`;
  });

  function touchRadius() {
    // Higher sensitivity = larger fingertip hit radius.
    return 36 + state.sensitivity * 50;
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);

  function buildSchedule(track) {
    const beatSec = 60 / track.bpm;
    const schedule = [];
    let beat = 0;
    let i = 0;
    for (const [name, dur] of track.notes) {
      if (name) {
        schedule.push({
          t: beat * beatSec,
          note: name,
          lane: i % 4,
          hit: false,
          judged: false,
        });
        i++;
      }
      beat += dur;
    }
    return { schedule, beatSec, durationSec: beat * beatSec + 1.2 };
  }

  function freqOf(name) {
    return NOTE[name] || BASS[name] || 0;
  }

  function playTone(ctx, freq, when, dur, type, gainVal, dest) {
    if (!freq) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gainVal, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.05, dur));
    osc.connect(g);
    g.connect(dest);
    osc.start(when);
    osc.stop(when + dur + 0.03);
    state.oscillators.push(osc);
  }

  function playNoiseHit(ctx, when, dest, style, strength = 1) {
    const len = Math.floor(ctx.sampleRate * (style === "anthem" ? 0.06 : 0.08));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = style === "space" ? 900 : style === "anthem" ? 600 : 1800;
    const base = style === "space" ? 0.22 : style === "anthem" ? 0.28 : 0.12;
    g.gain.setValueAtTime(base * strength, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(when);
    src.stop(when + 0.09);
  }

  function leadType(style) {
    if (style === "space") return "sawtooth";
    if (style === "anthem") return "triangle";
    return "triangle";
  }

  function startMusic(track, schedule) {
    const ctx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    state.audioCtx = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const master = ctx.createGain();
    master.gain.value = state.muted ? 0 : 0.55;
    master.connect(ctx.destination);
    state.masterGain = master;

    const lead = ctx.createGain();
    lead.gain.value = 0.72;
    lead.connect(master);
    const bassG = ctx.createGain();
    bassG.gain.value = 0.45;
    bassG.connect(master);
    const drumG = ctx.createGain();
    drumG.gain.value = 0.55;
    drumG.connect(master);

    const t0 = ctx.currentTime + 0.12;
    state.musicStart = t0;
    state.oscillators = [];

    const beatSec = 60 / track.bpm;
    const type = leadType(track.style);

    for (const n of schedule) {
      const f = freqOf(n.note);
      const dur = Math.min(beatSec * 0.9, track.style === "anthem" ? 0.55 : 0.45);
      playTone(ctx, f, t0 + n.t, dur, type, track.style === "space" ? 0.18 : 0.22, lead);
      if (track.style === "space" || track.style === "anthem") {
        playTone(ctx, f * 2, t0 + n.t, dur * 0.65, "sine", 0.05, lead);
      }
    }

    const totalBeats = Math.ceil(state.durationSec / beatSec);
    for (let b = 0; b < totalBeats; b++) {
      const name = track.bass[b % track.bass.length];
      playTone(ctx, freqOf(name), t0 + b * beatSec, beatSec * 0.75, "sine", 0.28, bassG);
      if (track.style === "anthem") {
        // Martial march: kick every beat, snare on 2 & 4.
        playNoiseHit(ctx, t0 + b * beatSec, drumG, track.style, b % 2 === 0 ? 1.1 : 0.7);
        if (b % 2 === 1) {
          playNoiseHit(ctx, t0 + b * beatSec + 0.01, drumG, track.style, 1.2);
        }
      } else {
        if (b % 2 === 0) playNoiseHit(ctx, t0 + b * beatSec, drumG, track.style);
        if (track.style === "space" && b % 4 === 2) {
          playNoiseHit(ctx, t0 + b * beatSec + beatSec * 0.5, drumG, track.style);
        }
      }
    }

    return t0;
  }

  function songTime() {
    if (!state.audioCtx) return 0;
    return Math.max(0, state.audioCtx.currentTime - state.musicStart);
  }

  function laneY(lane, h) {
    const top = 80;
    const bot = h - 80;
    return top + ((lane + 0.5) / 4) * (bot - top);
  }

  function spawnUpcoming(nowSong) {
    const rect = canvas.getBoundingClientRect();
    const lookAhead = 1.6;
    const track = TRACKS[state.trackId];
    for (const n of state.schedule) {
      if (n.spawned || n.judged) continue;
      if (n.t - lookAhead <= nowSong && nowSong <= n.t + GOOD_WIN) {
        n.spawned = true;
        const fromLeft = n.lane % 2 === 0;
        const r = 28;
        state.targets.push({
          note: n,
          x: fromLeft ? -r : rect.width + r,
          y: laneY(n.lane, rect.height),
          r,
          fromLeft,
          hue: track.hue,
        });
      }
    }
  }

  function updateTargets(dt, nowSong) {
    const rect = canvas.getBoundingClientRect();
    for (const t of state.targets) {
      const ideal = t.note.t;
      const travel = 1.6;
      const start = ideal - travel;
      const p = Math.min(1, Math.max(0, (nowSong - start) / travel));
      const startX = t.fromLeft ? -t.r : rect.width + t.r;
      const endX = rect.width * 0.5;
      t.x = startX + (endX - startX) * p;
      if (nowSong > ideal) {
        const over = nowSong - ideal;
        t.x = endX + (t.fromLeft ? 1 : -1) * over * 180;
      }
    }

    for (const n of state.schedule) {
      if (!n.judged && nowSong > n.t + GOOD_WIN) {
        n.judged = true;
        n.hit = false;
        state.miss++;
        state.combo = 0;
        missStat.textContent = state.miss;
        comboStat.textContent = state.combo;
        showJudge("MISS", "miss");
        updateComboBanner();
      }
    }

    state.targets = state.targets.filter(t => !t.note.judged);
  }

  function judgeHit(note, nowSong) {
    if (note.judged) return;
    const err = Math.abs(nowSong - note.t);
    note.judged = true;
    note.hit = true;
    if (err <= PERFECT_WIN) {
      state.perfect++;
      state.combo++;
      state.score += 300 + Math.min(state.combo, 20) * 10;
      showJudge("PERFECT", "perfect");
    } else if (err <= GOOD_WIN) {
      state.good++;
      state.combo++;
      state.score += 150 + Math.min(state.combo, 20) * 5;
      showJudge("GOOD", "good");
    } else {
      note.hit = false;
      state.miss++;
      state.combo = 0;
      showJudge("MISS", "miss");
    }
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    perfectStat.textContent = state.perfect;
    goodStat.textContent = state.good;
    missStat.textContent = state.miss;
    comboStat.textContent = state.combo;
    scoreStat.textContent = state.score;
    updateComboBanner();
  }

  let judgeTimer = 0;
  function showJudge(text, cls) {
    judgeEl.textContent = text;
    judgeEl.className = `judge show ${cls}`;
    clearTimeout(judgeTimer);
    judgeTimer = setTimeout(() => { judgeEl.className = "judge"; }, 420);
  }

  function updateComboBanner() {
    comboBanner.textContent = state.combo >= 2 ? `${state.combo} COMBO` : "";
  }

  function updateParticles(dt) {
    state.flashes = state.flashes.filter(f => (f.ttl -= dt) > 0);
    state.sparks = state.sparks.filter(s => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 500 * dt;
      s.ttl -= dt;
      return s.ttl > 0;
    });
  }

  function spawnSparks(x, y, hue) {
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 90 + Math.random() * 220;
      state.sparks.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60,
        ttl: 0.35 + Math.random() * 0.35,
        hue,
      });
    }
  }

  /* ---------- Touch hit test ---------- */

  function checkTouches(nowSong) {
    if (!state.tips.length) {
      if (touchStat) touchStat.textContent = "--";
      return;
    }
    if (touchStat) touchStat.textContent = "OK";
    const rad = touchRadius();
    const rad2 = rad * rad;

    for (const t of state.targets) {
      if (t.note.judged) continue;
      const err = Math.abs(nowSong - t.note.t);
      if (err > GOOD_WIN) continue;

      for (const tip of state.tips) {
        const dx = tip.x - t.x;
        const dy = tip.y - t.y;
        if (dx * dx + dy * dy <= (t.r + rad * 0.35) * (t.r + rad * 0.35) ||
            dx * dx + dy * dy <= rad2) {
          judgeHit(t.note, nowSong);
          spawnSparks(t.x, t.y, t.hue);
          state.flashes.push({ x: t.x, y: t.y, ttl: 0.18, max: 0.18 });
          break;
        }
      }
    }
  }

  function mapLandmark(lm) {
    const rect = canvas.getBoundingClientRect();
    return { x: (1 - lm.x) * rect.width, y: lm.y * rect.height };
  }

  let hands = null;
  let processing = false;

  async function startCamera() {
    errMsg.textContent = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      errMsg.textContent = `Camera error: ${err.message || err.name}`;
      return false;
    }

    hands = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });
    hands.onResults((results) => {
      processing = false;
      const tips = [];
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        state.landmarks = results.multiHandLandmarks[0].map(mapLandmark);
        state.handedness = results.multiHandedness?.[0]?.label || "?";
        for (const hand of results.multiHandLandmarks) {
          const mapped = hand.map(mapLandmark);
          for (const idx of TOUCH_TIPS) tips.push(mapped[idx]);
        }
      } else {
        state.landmarks = null;
        state.handedness = null;
      }
      state.tips = tips;
    });
    return true;
  }

  async function pumpHands() {
    if (state.running && video.readyState >= 2 && !processing && hands) {
      processing = true;
      try {
        await hands.send({ image: video });
      } catch (e) {
        processing = false;
      }
    }
    if (state.running) requestAnimationFrame(pumpHands);
  }

  function render(nowSong) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // Center clear zone
    ctx.save();
    ctx.strokeStyle = "rgba(255, 230, 107, 0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 40);
    ctx.lineTo(w * 0.5, h - 40);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, 36, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 230, 107, 0.25)";
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < 4; i++) {
      const y = laneY(i, h);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 40, y);
      ctx.strokeStyle = "rgba(120, 255, 140, 0.08)";
      ctx.stroke();
    }

    for (const t of state.targets) {
      const err = Math.abs(nowSong - t.note.t);
      const hot = err <= GOOD_WIN;
      const perfect = err <= PERFECT_WIN;
      ctx.save();
      ctx.translate(t.x, t.y);
      const glow = hot ? (perfect ? 0.9 : 0.55) : 0.25;
      ctx.shadowColor = `hsla(${t.hue}, 100%, 60%, ${glow})`;
      ctx.shadowBlur = perfect ? 28 : hot ? 16 : 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, t.r - i * 7, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0
          ? `hsla(${t.hue}, 100%, ${perfect ? 70 : 55}%, ${0.7 + glow * 0.3})`
          : `hsla(${t.hue}, 100%, 90%, 0.9)`;
        ctx.lineWidth = perfect ? 3 : 2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "14px VT323, monospace";
      ctx.textAlign = "center";
      ctx.fillText(t.note.note, 0, t.r + 16);
      ctx.restore();
    }

    for (const s of state.sparks) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${Math.max(0, s.ttl)})`;
      ctx.fill();
    }

    for (const f of state.flashes) {
      const k = f.ttl / f.max;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 18 + (1 - k) * 28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(120, 220, 255, ${k * 0.45})`;
      ctx.fill();
    }

    // Fingertip cursors + touch radius
    const rad = touchRadius();
    for (const tip of state.tips) {
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, rad, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(156, 255, 177, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(156, 255, 177, 0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffe66b";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (state.landmarks) {
      ctx.fillStyle = "rgba(156, 255, 177, 0.35)";
      for (const p of state.landmarks) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function finishSet() {
    if (state.finished) return;
    state.finished = true;
    state.running = false;
    hud.classList.add("hidden");
    result.classList.remove("hidden");
    const total = state.perfect + state.good + state.miss;
    const acc = total ? Math.round(((state.perfect + state.good) / total) * 100) : 0;
    resultText.textContent =
      `${TRACKS[state.trackId].label}  ·  Score ${state.score}  ·  Acc ${acc}%  ·  ` +
      `Perfect ${state.perfect} / Good ${state.good} / Miss ${state.miss}  ·  Max combo ${state.maxCombo}`;
  }

  function tick(now) {
    if (!state.running) return;
    const dt = Math.min(0.05, (now - state.lastFrame) / 1000);
    state.lastFrame = now;
    const nowSong = songTime();

    const beatIdx = Math.floor(nowSong / state.beatSec);
    if (beatIdx !== state.lastPulseBeat && beatIdx >= 0) {
      state.lastPulseBeat = beatIdx;
      beatRing.classList.remove("pulse");
      void beatRing.offsetWidth;
      beatRing.classList.add("pulse");
      beatStat.textContent = `${beatIdx + 1}`;
    }

    spawnUpcoming(nowSong);
    updateTargets(dt, nowSong);
    checkTouches(nowSong);
    updateParticles(dt);
    render(nowSong);

    if (nowSong >= state.durationSec) {
      finishSet();
      return;
    }
    requestAnimationFrame(tick);
  }

  function resetStats() {
    state.targets = [];
    state.flashes = [];
    state.sparks = [];
    state.tips = [];
    state.combo = 0;
    state.maxCombo = 0;
    state.perfect = 0;
    state.good = 0;
    state.miss = 0;
    state.score = 0;
    state.lastPulseBeat = -1;
    state.finished = false;
    comboStat.textContent = "0";
    perfectStat.textContent = "0";
    goodStat.textContent = "0";
    missStat.textContent = "0";
    scoreStat.textContent = "0";
    beatStat.textContent = "--";
    if (touchStat) touchStat.textContent = "--";
    updateComboBanner();
  }

  async function beginGame() {
    const track = TRACKS[state.trackId];
    const built = buildSchedule(track);
    state.schedule = built.schedule;
    state.beatSec = built.beatSec;
    state.durationSec = built.durationSec;
    resetStats();
    trackStat.textContent = track.label;
    document.getElementById("title").textContent =
      `Camera Fire Rhythm — ${track.label}`;

    startMusic(track, state.schedule);

    permission.classList.add("hidden");
    result.classList.add("hidden");
    hud.classList.remove("hidden");
    resizeCanvas();
    state.running = true;
    state.lastFrame = performance.now();
    pumpHands();
    requestAnimationFrame(tick);
  }

  startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    startBtn.textContent = "STARTING…";
    const ok = await startCamera();
    if (!ok) {
      startBtn.disabled = false;
      startBtn.textContent = "RETRY";
      return;
    }
    try {
      await beginGame();
    } catch (e) {
      errMsg.textContent = `Audio error: ${e.message || e}`;
      startBtn.disabled = false;
      startBtn.textContent = "RETRY";
    }
  });

  replayBtn.addEventListener("click", async () => {
    setTrack(trackSelect.value);
    try {
      if (state.audioCtx) {
        try { await state.audioCtx.close(); } catch (_) {}
        state.audioCtx = null;
      }
      await beginGame();
    } catch (e) {
      resultText.textContent = `Replay failed: ${e.message || e}`;
    }
  });

  setTrack("ode");
  resizeCanvas();
})();
