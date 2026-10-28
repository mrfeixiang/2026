(function () {
  const Labs = {
    current: null,
    raf: null,

    labText() {
      return window.LLM_MATH_I18N.getLabs();
    },

    mount(root, labId) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.current = labId;
      const makers = {
        overview: this.overview,
        vectors: this.vectors,
        matrix: this.matrix,
        attention: this.attention,
        gradient: this.gradient,
        probability: this.probability,
        diffusion: this.diffusion
      };
      const fn = makers[labId] || makers.attention;
      root.innerHTML = "";
      fn.call(this, root);
    },

    shell(root, title, desc) {
      const wrap = document.createElement("div");
      wrap.className = "lab-layout";
      wrap.innerHTML = `
        <div class="lab-canvas-wrap"><canvas width="640" height="420"></canvas></div>
        <div class="lab-controls">
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="controls"></div>
          <div class="stats"></div>
        </div>`;
      root.appendChild(wrap);
      return {
        canvas: wrap.querySelector("canvas"),
        controls: wrap.querySelector(".controls"),
        stats: wrap.querySelector(".stats")
      };
    },

    slider(parent, { id, label, min, max, step, value }) {
      const el = document.createElement("div");
      el.className = "control";
      el.innerHTML = `<label><span>${label}</span><span class="val"></span></label>
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" />`;
      parent.appendChild(el);
      const input = el.querySelector("input");
      const val = el.querySelector(".val");
      const sync = () => { val.textContent = input.value; };
      sync();
      input.addEventListener("input", sync);
      return input;
    },

    setStats(statsEl, pairs) {
      statsEl.innerHTML = pairs
        .map(([k, v]) => `<div class="stat"><span class="k">${k}</span><span class="v">${v}</span></div>`)
        .join("");
    },

    overview(root) {
      const t = this.labText().overview;
      const ui = this.shell(root, t.title, t.desc);
      const w = this.slider(ui.controls, { id: "ov-w", label: t.w, min: -2, max: 2, step: 0.05, value: 1.2 });
      const b = this.slider(ui.controls, { id: "ov-b", label: t.b, min: -2, max: 2, step: 0.05, value: 0.1 });
      const temp = this.slider(ui.controls, { id: "ov-t", label: t.temp, min: 0.3, max: 2.5, step: 0.05, value: 1 });
      const ctx = ui.canvas.getContext("2d");
      const xs = [-1.5, -0.5, 0.4, 1.2];

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const ww = +w.value;
        const bb = +b.value;
        const t = +temp.value;
        const logits = xs.map((x) => ww * x + bb);
        const maxL = Math.max(...logits);
        const exps = logits.map((l) => Math.exp((l - maxL) / t));
        const sum = exps.reduce((a, c) => a + c, 0);
        const probs = exps.map((e) => e / sum);
        const target = 2;
        const loss = -Math.log(probs[target] + 1e-9);
        const grad = probs.map((p, i) => p - (i === target ? 1 : 0));

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        // axes
        ctx.strokeStyle = "rgba(156,214,186,0.25)";
        ctx.beginPath();
        ctx.moveTo(40, H - 40);
        ctx.lineTo(W - 20, H - 40);
        ctx.moveTo(40, 20);
        ctx.lineTo(40, H - 40);
        ctx.stroke();

        const barW = 70;
        probs.forEach((p, i) => {
          const x = 80 + i * 120;
          const h = p * (H - 120);
          ctx.fillStyle = i === target ? "#d4a35c" : "#5ec4a0";
          ctx.globalAlpha = 0.85;
          ctx.fillRect(x, H - 40 - h, barW, h);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#e7f3ec";
          ctx.font = "12px JetBrains Mono";
          ctx.fillText(`x=${xs[i]}`, x, H - 18);
          ctx.fillText(p.toFixed(2), x + 12, H - 48 - h);
        });

        ctx.fillStyle = "#9bb5a8";
        ctx.fillText(t.chart, 50, 36);
        this.setStats(ui.stats, [
          [t.loss, loss.toFixed(3)],
          [t.grad0, grad[0].toFixed(3)],
          [t.linear, `y = ${ww.toFixed(2)}x + ${bb.toFixed(2)}`],
          [t.targetP, probs[target].toFixed(3)]
        ]);
      };

      const loop = () => {
        draw();
        if (this.current === "overview") this.raf = requestAnimationFrame(loop);
      };
      [w, b, temp].forEach((el) => el.addEventListener("input", draw));
      loop();
    },

    vectors(root) {
      const t = this.labText().vectors;
      const ui = this.shell(root, t.title, t.desc);
      const ang = this.slider(ui.controls, { id: "v-ang", label: t.ang, min: 0, max: 180, step: 1, value: 35 });
      const lenA = this.slider(ui.controls, { id: "v-a", label: "|a|", min: 0.4, max: 2, step: 0.05, value: 1.4 });
      const lenB = this.slider(ui.controls, { id: "v-b", label: "|b|", min: 0.4, max: 2, step: 0.05, value: 1.1 });
      const ctx = ui.canvas.getContext("2d");

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const cx = W / 2;
        const cy = H / 2;
        const scale = 90;
        const theta = (+ang.value * Math.PI) / 180;
        const ax = +lenA.value;
        const bx = +lenB.value * Math.cos(theta);
        const by = +lenB.value * Math.sin(theta);
        const dot = ax * bx;
        const cos = dot / (+lenA.value * +lenB.value);

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = "rgba(156,214,186,0.2)";
        ctx.beginPath();
        ctx.moveTo(40, cy);
        ctx.lineTo(W - 40, cy);
        ctx.moveTo(cx, 40);
        ctx.lineTo(cx, H - 40);
        ctx.stroke();

        const drawVec = (x, y, color, label) => {
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + x * scale, cy - y * scale);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + x * scale, cy - y * scale, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "14px Noto Sans TC";
          ctx.fillText(label, cx + x * scale + 8, cy - y * scale - 8);
        };

        drawVec(ax, 0, "#d4a35c", "a (query)");
        drawVec(bx, by, "#5ec4a0", "b (key)");

        // projection
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "rgba(212,163,92,0.5)";
        ctx.beginPath();
        ctx.moveTo(cx + bx * scale, cy - by * scale);
        ctx.lineTo(cx + dot * scale / ax, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        this.setStats(ui.stats, [
          ["a · b", dot.toFixed(3)],
          ["cos θ", cos.toFixed(3)],
          ["—", cos > 0.7 ? t.interpretHi : cos > 0.2 ? t.interpretMid : t.interpretLo]
        ]);
      };

      [ang, lenA, lenB].forEach((el) => el.addEventListener("input", draw));
      draw();
    },

    matrix(root) {
      const t = this.labText().matrix;
      const ui = this.shell(root, t.title, t.desc);
      const a11 = this.slider(ui.controls, { id: "m11", label: "a₁₁", min: -1.5, max: 1.5, step: 0.05, value: 1.1 });
      const a12 = this.slider(ui.controls, { id: "m12", label: "a₁₂", min: -1.5, max: 1.5, step: 0.05, value: 0.35 });
      const a21 = this.slider(ui.controls, { id: "m21", label: "a₂₁", min: -1.5, max: 1.5, step: 0.05, value: -0.2 });
      const a22 = this.slider(ui.controls, { id: "m22", label: "a₂₂", min: -1.5, max: 1.5, step: 0.05, value: 0.9 });
      const ctx = ui.canvas.getContext("2d");

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const cx = W / 2;
        const cy = H / 2;
        const s = 70;
        const m = [
          [+a11.value, +a12.value],
          [+a21.value, +a22.value]
        ];
        const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
        const apply = (x, y) => [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = "rgba(156,214,186,0.15)";
        for (let i = -4; i <= 4; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i * s, 20);
          ctx.lineTo(cx + i * s, H - 20);
          ctx.moveTo(20, cy + i * s);
          ctx.lineTo(W - 20, cy + i * s);
          ctx.stroke();
        }

        const unit = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        ctx.strokeStyle = "rgba(155,181,168,0.5)";
        ctx.beginPath();
        unit.forEach(([x, y], i) => {
          const px = cx + x * s;
          const py = cy - y * s;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();

        const mapped = unit.map(([x, y]) => apply(x, y));
        ctx.fillStyle = "rgba(94,196,160,0.2)";
        ctx.strokeStyle = "#5ec4a0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        mapped.forEach(([x, y], i) => {
          const px = cx + x * s;
          const py = cy - y * s;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 1;

        // basis images
        const e1 = apply(1, 0);
        const e2 = apply(0, 1);
        const arrow = (x, y, color, label) => {
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + x * s, cy - y * s);
          ctx.stroke();
          ctx.fillText(label, cx + x * s + 6, cy - y * s - 6);
        };
        ctx.font = "13px JetBrains Mono";
        arrow(e1[0], e1[1], "#d4a35c", "Ae₁");
        arrow(e2[0], e2[1], "#e07a5f", "Ae₂");

        this.setStats(ui.stats, [
          [t.det, det.toFixed(3)],
          [t.volume, Math.abs(det).toFixed(3)],
          ["—", Math.abs(det) < 0.15 ? t.singular : det < 0 ? t.reflect : t.preserve]
        ]);
      };

      [a11, a12, a21, a22].forEach((el) => el.addEventListener("input", draw));
      draw();
    },

    attention(root) {
      const t = this.labText().attention;
      const ui = this.shell(root, t.title, t.desc);
      const focus = this.slider(ui.controls, { id: "at-f", label: t.focus, min: -2, max: 3, step: 0.05, value: 1.5 });
      const scale = this.slider(ui.controls, { id: "at-s", label: t.scale, min: 0.5, max: 3, step: 0.05, value: 1.4 });
      const causal = this.slider(ui.controls, { id: "at-c", label: t.causal, min: 0, max: 1, step: 1, value: 0 });
      const ctx = ui.canvas.getContext("2d");
      const labels = ["Tok₁", "Tok₂", "Tok₃"];

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const f = +focus.value;
        const d = +scale.value;
        const scores = [
          [1.0, 0.2, -0.4],
          [0.3, f, 0.1],
          [-0.2, 0.5, 1.1]
        ];
        if (+causal.value === 1) {
          scores[0][1] = -1e9;
          scores[0][2] = -1e9;
          scores[1][2] = -1e9;
        }
        const weights = scores.map((row) => {
          const scaled = row.map((v) => v / d);
          const m = Math.max(...scaled.filter((x) => x > -1e8), -1e8);
          const ex = scaled.map((v) => (v < -1e8 ? 0 : Math.exp(v - m)));
          const s = ex.reduce((a, b) => a + b, 0) || 1;
          return ex.map((e) => e / s);
        });

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        const cell = 70;
        const ox = 120;
        const oy = 80;
        ctx.fillStyle = "#9bb5a8";
        ctx.font = "13px Noto Sans TC, Noto Sans KR, sans-serif";
        ctx.fillText(t.chart, 40, 40);

        for (let i = 0; i < 3; i++) {
          ctx.fillText(labels[i], 50, oy + i * cell + 38);
          ctx.fillText(labels[i], ox + i * cell + 18, oy - 16);
          for (let j = 0; j < 3; j++) {
            const p = weights[i][j];
            const g = Math.floor(30 + p * 180);
            ctx.fillStyle = `rgba(94, 196, 160, ${0.15 + p * 0.75})`;
            ctx.fillRect(ox + j * cell, oy + i * cell, cell - 8, cell - 8);
            ctx.fillStyle = "#e7f3ec";
            ctx.font = "14px JetBrains Mono";
            ctx.fillText(p.toFixed(2), ox + j * cell + 16, oy + i * cell + 38);
            ctx.fillStyle = `rgb(${g + 40},${g + 80},${g + 60})`;
          }
        }

        // value mix for query 2
        const v = [
          [0.2, 0.8],
          [0.9, 0.3],
          [0.4, 0.6]
        ];
        const out = [0, 0];
        for (let j = 0; j < 3; j++) {
          out[0] += weights[1][j] * v[j][0];
          out[1] += weights[1][j] * v[j][1];
        }
        ctx.fillStyle = "#d4a35c";
        ctx.font = "13px JetBrains Mono";
        ctx.fillText(`${t.out} [${out[0].toFixed(2)}, ${out[1].toFixed(2)}]`, 40, H - 36);

        this.setStats(ui.stats, [
          [t.mode, +causal.value ? t.modeGpt : t.modeBert],
          ["Tok₂→Tok₂", weights[1][1].toFixed(3)],
          [t.entropy, (-weights[1].reduce((a, p) => a + (p > 0 ? p * Math.log(p) : 0), 0)).toFixed(3)]
        ]);
      };

      [focus, scale, causal].forEach((el) => el.addEventListener("input", draw));
      draw();
    },

    gradient(root) {
      const t = this.labText().gradient;
      const ui = this.shell(root, t.title, t.desc);
      const lr = this.slider(ui.controls, { id: "g-lr", label: t.lr, min: 0.01, max: 0.45, step: 0.01, value: 0.08 });
      const start = this.slider(ui.controls, { id: "g-s", label: t.start, min: -2, max: 2, step: 0.05, value: -1.6 });
      const btn = document.createElement("button");
      btn.className = "btn primary";
      btn.type = "button";
      btn.textContent = t.step;
      ui.controls.appendChild(btn);

      const ctx = ui.canvas.getContext("2d");
      let theta = +start.value;
      let path = [theta];
      const L = (t) => (t * t - 1) ** 2 + 0.1 * t;
      const dL = (t) => 4 * t * (t * t - 1) + 0.1;

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        const xMin = -2.2;
        const xMax = 2.2;
        const mapX = (x) => ((x - xMin) / (xMax - xMin)) * (W - 60) + 30;
        const ys = [];
        for (let i = 0; i <= 200; i++) {
          const x = xMin + (i / 200) * (xMax - xMin);
          ys.push(L(x));
        }
        const yMin = Math.min(...ys) - 0.2;
        const yMax = Math.max(...ys) + 0.2;
        const mapY = (y) => H - 40 - ((y - yMin) / (yMax - yMin)) * (H - 80);

        ctx.strokeStyle = "#5ec4a0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = xMin + (i / 200) * (xMax - xMin);
          const px = mapX(x);
          const py = mapY(L(x));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(212,163,92,0.7)";
        ctx.beginPath();
        path.forEach((t, i) => {
          const px = mapX(t);
          const py = mapY(L(t));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();

        ctx.fillStyle = "#d4a35c";
        ctx.beginPath();
        ctx.arc(mapX(theta), mapY(L(theta)), 7, 0, Math.PI * 2);
        ctx.fill();

        // tangent
        const g = dL(theta);
        ctx.strokeStyle = "#e07a5f";
        ctx.beginPath();
        ctx.moveTo(mapX(theta), mapY(L(theta)));
        ctx.lineTo(mapX(theta) - g * 25, mapY(L(theta)) - 30);
        ctx.stroke();
        ctx.fillStyle = "#9bb5a8";
        ctx.font = "12px JetBrains Mono";
        ctx.fillText(t.dir, mapX(theta) + 10, mapY(L(theta)) - 12);

        this.setStats(ui.stats, [
          ["θ", theta.toFixed(3)],
          ["L(θ)", L(theta).toFixed(3)],
          ["∇L", g.toFixed(3)],
          [t.steps, String(path.length - 1)]
        ]);
      };

      btn.addEventListener("click", () => {
        if (path.length > 40) {
          theta = +start.value;
          path = [theta];
        } else {
          theta = theta - +lr.value * dL(theta);
          path.push(theta);
        }
        draw();
      });
      start.addEventListener("input", () => {
        theta = +start.value;
        path = [theta];
        draw();
      });
      lr.addEventListener("input", draw);
      draw();
    },

    probability(root) {
      const t = this.labText().probability;
      const ui = this.shell(root, t.title, t.desc);
      const temp = this.slider(ui.controls, { id: "p-t", label: t.temp, min: 0.2, max: 2.5, step: 0.05, value: 0.9 });
      const peak = this.slider(ui.controls, { id: "p-p", label: t.peak, min: 0, max: 6, step: 0.1, value: 3.2 });
      const ctx = ui.canvas.getContext("2d");
      const names = t.tokens;

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const logits = [1.1, 0.6, 0.4, 0.35, 0.3, +peak.value, 1.8];
        const T = +temp.value;
        const m = Math.max(...logits);
        const ex = logits.map((l) => Math.exp((l - m) / T));
        const s = ex.reduce((a, b) => a + b, 0);
        const p = ex.map((e) => e / s);
        const entropy = -p.reduce((a, x) => a + (x > 0 ? x * Math.log(x) : 0), 0);

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        const barW = 54;
        p.forEach((prob, i) => {
          const x = 50 + i * 80;
          const h = prob * (H - 130);
          ctx.fillStyle = i === 5 ? "#d4a35c" : "#5ec4a0";
          ctx.fillRect(x, H - 50 - h, barW, h);
          ctx.fillStyle = "#e7f3ec";
          ctx.font = "13px Noto Sans TC, Noto Sans KR, sans-serif";
          ctx.fillText(names[i], x + 8, H - 24);
          ctx.font = "12px JetBrains Mono";
          ctx.fillText(prob.toFixed(2), x + 8, H - 58 - h);
        });

        ctx.fillStyle = "#9bb5a8";
        ctx.font = "13px JetBrains Mono";
        ctx.fillText(t.chart, 40, 36);

        this.setStats(ui.stats, [
          [t.entropy, entropy.toFixed(3)],
          ["argmax", names[p.indexOf(Math.max(...p))]],
          [`P(${names[5]})`, p[5].toFixed(3)]
        ]);
      };

      [temp, peak].forEach((el) => el.addEventListener("input", draw));
      draw();
    },

    diffusion(root) {
      const copy = this.labText().diffusion;
      const ui = this.shell(root, copy.title, copy.desc);
      const t = this.slider(ui.controls, { id: "d-t", label: copy.t, min: 0, max: 100, step: 1, value: 35 });
      const noise = this.slider(ui.controls, { id: "d-n", label: copy.seed, min: 1, max: 40, step: 1, value: 7 });
      const ctx = ui.canvas.getContext("2d");

      const seeded = (n) => {
        const out = [];
        let s = n * 999;
        for (let i = 0; i < 64; i++) {
          s = (s * 16807) % 2147483647;
          out.push((s / 2147483647) * 2 - 1);
        }
        return out;
      };

      const draw = () => {
        const W = ui.canvas.width;
        const H = ui.canvas.height;
        const tt = +t.value / 100;
        const alphaBar = Math.pow(1 - tt, 2);
        const signal = Math.sqrt(alphaBar);
        const noiseScale = Math.sqrt(1 - alphaBar);
        const eps = seeded(+noise.value);
        const x0 = [];
        for (let i = 0; i < 64; i++) {
          const u = i / 63;
          x0.push(Math.sin(u * Math.PI * 2) * 0.7 + Math.sin(u * Math.PI * 6) * 0.25);
        }
        const xt = x0.map((v, i) => signal * v + noiseScale * eps[i]);

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        const plot = (arr, color, label, yOff) => {
          ctx.strokeStyle = color;
          ctx.beginPath();
          arr.forEach((v, i) => {
            const x = 40 + (i / 63) * (W - 80);
            const y = H / 2 + yOff - v * 70;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.font = "12px JetBrains Mono";
          ctx.fillText(label, 48, H / 2 + yOff - 78);
        };

        plot(x0, "rgba(155,181,168,0.55)", copy.x0, -70);
        plot(xt, "#5ec4a0", copy.xt, 70);

        ctx.fillStyle = "#d4a35c";
        ctx.font = "13px JetBrains Mono";
        ctx.fillText(`√ᾱ=${signal.toFixed(3)}  √(1-ᾱ)=${noiseScale.toFixed(3)}`, 40, 36);

        this.setStats(ui.stats, [
          ["ᾱ_t", alphaBar.toFixed(3)],
          [copy.signal, `${(signal * 100).toFixed(1)}%`],
          [copy.noise, `${(noiseScale * 100).toFixed(1)}%`]
        ]);
      };

      [t, noise].forEach((el) => el.addEventListener("input", draw));
      draw();
    },

    startHero(canvas) {
      const ctx = canvas.getContext("2d");
      let tick = 0;
      const loop = () => {
        tick += 0.016;
        const hero = this.labText().hero;
        const tokens = hero.tokens;
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#06140f";
        ctx.fillRect(0, 0, W, H);

        const n = tokens.length;
        const scores = [];
        for (let i = 0; i < n; i++) {
          scores[i] = [];
          for (let j = 0; j < n; j++) {
            scores[i][j] = Math.cos(tick + i * 0.7) * Math.sin(tick * 0.8 + j) + (i === j ? 0.8 : 0.1);
          }
        }
        const weights = scores.map((row) => {
          const m = Math.max(...row);
          const ex = row.map((v) => Math.exp(v - m));
          const s = ex.reduce((a, b) => a + b, 0);
          return ex.map((e) => e / s);
        });

        const ox = 110;
        const oy = 90;
        const cell = 78;
        ctx.fillStyle = "#9bb5a8";
        ctx.font = "14px Noto Sans TC, Noto Sans KR, sans-serif";
        ctx.fillText(hero.title, 48, 48);
        for (let i = 0; i < n; i++) {
          ctx.fillStyle = "#d4a35c";
          ctx.fillText(tokens[i], 48, oy + i * cell + 42);
          ctx.fillText(tokens[i], ox + i * cell + 24, oy - 18);
          for (let j = 0; j < n; j++) {
            const p = weights[i][j];
            ctx.fillStyle = `rgba(94,196,160,${0.12 + p * 0.8})`;
            ctx.beginPath();
            const x = ox + j * cell;
            const y = oy + i * cell;
            const r = 12;
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + cell - 10, y, x + cell - 10, y + cell - 10, r);
            ctx.arcTo(x + cell - 10, y + cell - 10, x, y + cell - 10, r);
            ctx.arcTo(x, y + cell - 10, x, y, r);
            ctx.arcTo(x, y, x + cell - 10, y, r);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#e7f3ec";
            ctx.font = "13px JetBrains Mono";
            ctx.fillText(p.toFixed(2), x + 18, y + 42);
          }
        }
        requestAnimationFrame(loop);
      };
      loop();
    }
  };

  window.LLM_MATH_LABS = Labs;
})();
