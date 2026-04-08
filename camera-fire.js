/* Camera Fire — finger-gun shooter using MediaPipe Hands.
 *
 * How it works:
 *   1. Get a webcam stream into a <video>.
 *   2. Feed each frame into MediaPipe Hands -> 21 landmarks per hand.
 *   3. Aim ray = vector from INDEX_MCP (5) -> INDEX_TIP (8).
 *   4. "Thumb bent" trigger = thumb tip distance to index MCP shrinks
 *      below a threshold (with debounce), like cocking a hammer.
 *   5. On trigger -> spawn a projectile along the aim ray.
 *   6. Targets float around the canvas; projectile hits = score.
 */

(() => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const startBtn = document.getElementById("startBtn");
  const permission = document.getElementById("permission");
  const errMsg = document.getElementById("errMsg");
  const hud = document.getElementById("hud");
  const handStat = document.getElementById("handStat");
  const thumbStat = document.getElementById("thumbStat");
  const shotsStat = document.getElementById("shotsStat");
  const hitsStat = document.getElementById("hitsStat");
  const scoreStat = document.getElementById("scoreStat");
  const sensSlider = document.getElementById("sensitivity");
  const sensVal = document.getElementById("sensVal");
  const funToggle = document.getElementById("funToggle");

  // MediaPipe landmark indices.
  const WRIST = 0;
  const THUMB_TIP = 4;
  const INDEX_MCP = 5;
  const INDEX_PIP = 6;
  const INDEX_TIP = 8;
  const PINKY_MCP = 17;

  // Game state.
  const state = {
    running: false,
    landmarks: null,
    handedness: null,
    thumbBent: false,
    thumbBentPrev: false,
    cooldownUntil: 0,
    shots: 0,
    hits: 0,
    score: 0,
    projectiles: [],
    targets: [],
    flashes: [],
    sparks: [],
    shards: [],
    cracks: [],
    lastFrame: performance.now(),
    sensitivity: 0.55,
    fun: true,
  };

  // Offscreen canvas used to grab a mirrored snapshot of the live video, so
  // that page-shatter shards can carry pieces of the visible scene as they fly.
  const grabber = document.createElement("canvas");
  const grabberCtx = grabber.getContext("2d");

  function refreshGrabber() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || !video.videoWidth) return false;
    if (grabber.width !== w) grabber.width = w;
    if (grabber.height !== h) grabber.height = h;
    grabberCtx.save();
    grabberCtx.clearRect(0, 0, w, h);
    // Mirror to match the visible (CSS-flipped) video.
    grabberCtx.translate(w, 0);
    grabberCtx.scale(-1, 1);
    // object-fit: cover math.
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.max(w / vw, h / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    grabberCtx.drawImage(video, dx, dy, dw, dh);
    grabberCtx.restore();
    return true;
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);

  sensSlider.addEventListener("input", () => {
    state.sensitivity = sensSlider.value / 100;
    sensVal.textContent = `${sensSlider.value}%`;
  });
  funToggle.addEventListener("change", () => {
    state.fun = funToggle.checked;
  });

  /* ---------- Targets ---------- */

  function spawnTarget() {
    const rect = canvas.getBoundingClientRect();
    const r = 22 + Math.random() * 18;
    const fromLeft = Math.random() < 0.5;
    const x = fromLeft ? -r : rect.width + r;
    const y = 60 + Math.random() * (rect.height - 160);
    const speed = 30 + Math.random() * 50;
    state.targets.push({
      x, y, r,
      vx: fromLeft ? speed : -speed,
      vy: (Math.random() - 0.5) * 20,
      hue: 30 + Math.random() * 40,
      ttl: 12,
    });
  }

  function updateTargets(dt) {
    for (const t of state.targets) {
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      t.ttl -= dt;
    }
    const rect = canvas.getBoundingClientRect();
    state.targets = state.targets.filter(
      t => t.ttl > 0 && t.x > -80 && t.x < rect.width + 80
    );
    if (state.targets.length < 4 && Math.random() < 0.03) spawnTarget();
  }

  /* ---------- Projectiles & particles ---------- */

  function fire(originX, originY, dirX, dirY) {
    const len = Math.hypot(dirX, dirY) || 1;
    const speed = 1200;
    state.projectiles.push({
      x: originX,
      y: originY,
      vx: (dirX / len) * speed,
      vy: (dirY / len) * speed,
      ttl: 1.2,
      trail: [],
    });
    state.flashes.push({ x: originX, y: originY, ttl: 0.18, max: 0.18 });
    state.shots++;
    shotsStat.textContent = state.shots;
  }

  function updateProjectiles(dt) {
    for (const p of state.projectiles) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) p.trail.shift();
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.ttl -= dt;

      // Hit test.
      for (const t of state.targets) {
        if (t.ttl <= 0) continue;
        const dx = p.x - t.x;
        const dy = p.y - t.y;
        if (dx * dx + dy * dy <= t.r * t.r) {
          t.ttl = 0;
          p.ttl = 0;
          state.hits++;
          state.score += Math.round(50 + (40 - t.r));
          hitsStat.textContent = state.hits;
          scoreStat.textContent = state.score;
          spawnSparks(t.x, t.y, t.hue);
          spawnShatter(t.x, t.y);
          spawnCrack(t.x, t.y);
          shakeFrame();
          break;
        }
      }
    }

    state.projectiles = state.projectiles.filter(p => {
      const r = canvas.getBoundingClientRect();
      return p.ttl > 0 && p.x > -50 && p.x < r.width + 50 && p.y > -50 && p.y < r.height + 50;
    });

    state.flashes = state.flashes.filter(f => (f.ttl -= dt) > 0);
    state.sparks = state.sparks.filter(s => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 600 * dt;
      s.ttl -= dt;
      return s.ttl > 0;
    });

    for (const s of state.shards) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 900 * dt; // gravity
      s.rot += s.vrot * dt;
      s.ttl -= dt;
    }
    state.shards = state.shards.filter(s => s.ttl > 0);

    for (const c of state.cracks) c.ttl -= dt;
    state.cracks = state.cracks.filter(c => c.ttl > 0);
  }

  /* ---------- Page shatter ---------- */

  function makeJaggedPoly(size) {
    const center = size / 2;
    const sides = 6 + Math.floor(Math.random() * 3);
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const r = (size / 2) * (0.55 + Math.random() * 0.45);
      pts.push({ x: center + Math.cos(a) * r, y: center + Math.sin(a) * r });
    }
    return pts;
  }

  function spawnShatter(hitX, hitY) {
    if (!refreshGrabber()) return;
    const count = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const size = 36 + Math.random() * 38;
      // Pick a sub-region of the grabber centered near the hit so each shard
      // carries a piece of what was actually on screen at that point.
      const ox = Math.round(hitX - size / 2 + (Math.random() - 0.5) * 30);
      const oy = Math.round(hitY - size / 2 + (Math.random() - 0.5) * 30);

      const shardCanvas = document.createElement("canvas");
      shardCanvas.width = size;
      shardCanvas.height = size;
      const sctx = shardCanvas.getContext("2d");

      const points = makeJaggedPoly(size);
      sctx.beginPath();
      sctx.moveTo(points[0].x, points[0].y);
      for (let j = 1; j < points.length; j++) sctx.lineTo(points[j].x, points[j].y);
      sctx.closePath();
      sctx.save();
      sctx.clip();
      // Drawing the grabber at (-ox, -oy) places the (ox, oy) corner at 0,0.
      sctx.drawImage(grabber, -ox, -oy);
      sctx.restore();
      // Glassy edge highlight.
      sctx.lineWidth = 1.5;
      sctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      sctx.stroke();
      sctx.lineWidth = 0.6;
      sctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      sctx.stroke();

      const angle = Math.random() * Math.PI * 2;
      const speed = 220 + Math.random() * 360;
      state.shards.push({
        img: shardCanvas,
        size,
        x: hitX,
        y: hitY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 160, // initial upward kick
        rot: 0,
        vrot: (Math.random() - 0.5) * 9,
        ttl: 1.7,
        max: 1.7,
      });
    }
  }

  function spawnCrack(hitX, hitY) {
    const arms = 5 + Math.floor(Math.random() * 4);
    const lines = [];
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      lines.push({
        a,
        len: 50 + Math.random() * 90,
        kinkA: a + (Math.random() - 0.5) * 0.9,
        kinkLen: 20 + Math.random() * 60,
      });
    }
    state.cracks.push({ x: hitX, y: hitY, lines, ttl: 5, max: 5 });
  }

  let shakeTimer = 0;
  function shakeFrame() {
    const frame = document.querySelector(".crt-frame");
    if (!frame) return;
    frame.classList.remove("shake");
    // Force reflow so the animation restarts on rapid hits.
    void frame.offsetWidth;
    frame.classList.add("shake");
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => frame.classList.remove("shake"), 280);
  }

  function spawnSparks(x, y, hue) {
    for (let i = 0; i < 22; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 80 + Math.random() * 240;
      state.sparks.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 80,
        ttl: 0.4 + Math.random() * 0.4,
        hue,
      });
    }
  }

  /* ---------- Hand math ---------- */

  // Mirror the x because video is flipped horizontally for natural feel.
  function mapLandmark(lm) {
    const rect = canvas.getBoundingClientRect();
    return { x: (1 - lm.x) * rect.width, y: lm.y * rect.height };
  }

  function handSize(landmarks) {
    const a = landmarks[WRIST];
    const b = landmarks[PINKY_MCP];
    return Math.hypot(a.x - b.x, a.y - b.y) || 0.0001;
  }

  function thumbBendRatio(landmarks) {
    // Distance from thumb tip to index MCP, normalized by hand size.
    // Smaller value = thumb pulled in (bent / hammer cocked).
    const tip = landmarks[THUMB_TIP];
    const ref = landmarks[INDEX_MCP];
    const d = Math.hypot(tip.x - ref.x, tip.y - ref.y);
    return d / handSize(landmarks);
  }

  function isFingerGun(landmarks) {
    // Index finger should be roughly extended: tip far from MCP relative to PIP.
    const mcp = landmarks[INDEX_MCP];
    const pip = landmarks[INDEX_PIP];
    const tip = landmarks[INDEX_TIP];
    const mcpToTip = Math.hypot(tip.x - mcp.x, tip.y - mcp.y);
    const mcpToPip = Math.hypot(pip.x - mcp.x, pip.y - mcp.y);
    return mcpToTip > mcpToPip * 1.6;
  }

  /* ---------- MediaPipe wiring ---------- */

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
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onHandResults);

    return true;
  }

  function onHandResults(results) {
    processing = false;
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      state.landmarks = results.multiHandLandmarks[0].map(mapLandmark);
      state.handedness = results.multiHandedness?.[0]?.label || "?";
    } else {
      state.landmarks = null;
      state.handedness = null;
    }
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
    requestAnimationFrame(pumpHands);
  }

  /* ---------- Render loop ---------- */

  function tick(now) {
    const dt = Math.min(0.05, (now - state.lastFrame) / 1000);
    state.lastFrame = now;

    // Process hand state.
    if (state.landmarks) {
      const lm = state.landmarks;
      const isGun = isFingerGun(lm);
      const ratio = thumbBendRatio(lm);
      // Threshold scales with sensitivity slider (higher = easier to fire).
      const threshold = 0.55 + (1 - state.sensitivity) * 0.35; // 0.55 .. 0.90
      state.thumbBent = isGun && ratio < threshold;
      handStat.textContent = state.handedness || "OK";
      thumbStat.textContent = state.thumbBent ? "BENT" : (isGun ? "READY" : "----");

      if (state.thumbBent && !state.thumbBentPrev && now > state.cooldownUntil) {
        const origin = lm[INDEX_TIP];
        const dx = lm[INDEX_TIP].x - lm[INDEX_MCP].x;
        const dy = lm[INDEX_TIP].y - lm[INDEX_MCP].y;
        fire(origin.x, origin.y, dx, dy);
        state.cooldownUntil = now + 220;
      }
      state.thumbBentPrev = state.thumbBent;
    } else {
      handStat.textContent = "--";
      thumbStat.textContent = "--";
      state.thumbBentPrev = false;
    }

    updateTargets(dt);
    updateProjectiles(dt);
    render();

    requestAnimationFrame(tick);
  }

  function render() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // Crosshair / scan lines overlay tinting (subtle).
    if (state.fun) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#0a3";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // Glass cracks — drawn beneath targets/effects so they read as damage on
    // the "screen" surface itself.
    for (const c of state.cracks) {
      const a = Math.min(1, c.ttl / c.max);
      ctx.save();
      ctx.lineCap = "round";
      // Dark outline so cracks read on bright backgrounds.
      ctx.strokeStyle = `rgba(0, 0, 0, ${a * 0.55})`;
      ctx.lineWidth = 3;
      for (const l of c.lines) {
        const ex = c.x + Math.cos(l.a) * l.len;
        const ey = c.y + Math.sin(l.a) * l.len;
        const kx = ex + Math.cos(l.kinkA) * l.kinkLen;
        const ky = ey + Math.sin(l.kinkA) * l.kinkLen;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(ex, ey);
        ctx.lineTo(kx, ky);
        ctx.stroke();
      }
      // White highlight on top.
      ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.95})`;
      ctx.lineWidth = 1.4;
      for (const l of c.lines) {
        const ex = c.x + Math.cos(l.a) * l.len;
        const ey = c.y + Math.sin(l.a) * l.len;
        const kx = ex + Math.cos(l.kinkA) * l.kinkLen;
        const ky = ey + Math.sin(l.kinkA) * l.kinkLen;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(ex, ey);
        ctx.lineTo(kx, ky);
        ctx.stroke();
      }
      // Impact dot.
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.fill();
      ctx.restore();
    }

    // Targets.
    for (const t of state.targets) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, t.r - i * 6, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0
          ? `hsl(${t.hue}, 100%, 60%)`
          : `hsl(${t.hue}, 100%, 85%)`;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    }

    // Projectile trails.
    for (const p of state.projectiles) {
      for (let i = 0; i < p.trail.length - 1; i++) {
        const a = p.trail[i];
        const b = p.trail[i + 1];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 2 + i * 0.6;
        ctx.strokeStyle = `rgba(255, 230, 107, ${0.2 + i * 0.1})`;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe66b";
      ctx.shadowColor = "#ffae2b";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Sparks.
    for (const s of state.sparks) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${Math.max(0, s.ttl)})`;
      ctx.fill();
    }

    // Muzzle flash.
    for (const f of state.flashes) {
      const k = f.ttl / f.max;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 18 + (1 - k) * 30, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 80, ${k * 0.6})`;
      ctx.fill();
    }

    // Hand overlay.
    if (state.landmarks) {
      const lm = state.landmarks;
      // Aim line.
      const mcp = lm[INDEX_MCP];
      const tip = lm[INDEX_TIP];
      const dx = tip.x - mcp.x;
      const dy = tip.y - mcp.y;
      const len = Math.hypot(dx, dy) || 1;
      const ex = tip.x + (dx / len) * 600;
      const ey = tip.y + (dy / len) * 600;
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = state.thumbBent
        ? "rgba(255, 80, 60, 0.9)"
        : "rgba(120, 255, 140, 0.55)";
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair at end.
      ctx.beginPath();
      ctx.arc(ex, ey, 14, 0, Math.PI * 2);
      ctx.strokeStyle = state.thumbBent ? "#ff4d2e" : "#9cffb1";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex - 20, ey);
      ctx.lineTo(ex + 20, ey);
      ctx.moveTo(ex, ey - 20);
      ctx.lineTo(ex, ey + 20);
      ctx.stroke();

      // Landmark dots.
      ctx.fillStyle = "#9cffb1";
      for (const p of lm) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect a few key bones.
      const bones = [
        [WRIST, INDEX_MCP], [INDEX_MCP, INDEX_PIP], [INDEX_PIP, INDEX_TIP],
        [WRIST, THUMB_TIP], [INDEX_MCP, PINKY_MCP],
      ];
      ctx.strokeStyle = "rgba(156, 255, 177, 0.6)";
      ctx.lineWidth = 2;
      for (const [a, b] of bones) {
        ctx.beginPath();
        ctx.moveTo(lm[a].x, lm[a].y);
        ctx.lineTo(lm[b].x, lm[b].y);
        ctx.stroke();
      }
    }

    // Page-shatter shards — drawn last so they tumble in front of everything
    // (including the hand overlay) like real flying debris.
    for (const s of state.shards) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      const a = Math.max(0, Math.min(1, s.ttl / s.max));
      ctx.globalAlpha = a;
      // Drop shadow under the shard.
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(s.img, -s.size / 2, -s.size / 2);
      ctx.restore();
    }
  }

  /* ---------- Boot ---------- */

  startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    startBtn.textContent = "STARTING…";
    const ok = await startCamera();
    if (!ok) {
      startBtn.disabled = false;
      startBtn.textContent = "RETRY";
      return;
    }
    permission.classList.add("hidden");
    hud.classList.remove("hidden");
    resizeCanvas();
    state.running = true;
    state.lastFrame = performance.now();
    // Seed a couple of targets so the player has something to shoot at.
    for (let i = 0; i < 3; i++) spawnTarget();
    pumpHands();
    requestAnimationFrame(tick);
  });

  // Initial canvas size so the start overlay sits at the right place.
  resizeCanvas();
})();
