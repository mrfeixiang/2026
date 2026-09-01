/* 药物化学家之眼 — app logic + 结构渲染引擎 */
(function () {
  'use strict';

  var MOL = window.CHEMIST_MOLECULES || [];
  var byId = {};
  MOL.forEach(function (m) { byId[m.id] = m; });

  /* ---------------- 结构渲染引擎 ----------------
   * 把 struct{atoms,bonds,aromatic,highlight} 画成 SVG。
   * 坐标以键长≈1 为单位;此处放大并居中到 viewBox。 */
  var ELEM_COLOR = { O: 'var(--o)', N: 'var(--n)', S: 'var(--s)' };

  function elemOf(label) {
    if (!label) return 'C';
    // 取首个大写字母开头的元素符号
    if (label[0] === 'O' || label === 'HO' || label === 'OH') return 'O';
    if (label[0] === 'N' || label === 'HN') return 'N';
    if (label[0] === 'S') return 'S';
    return 'C';
  }

  function renderStructure(struct, opts) {
    opts = opts || {};
    var scale = 40;
    var pad = 34;
    var atoms = struct.atoms.map(function (a) {
      return { x: a[0] * scale, y: a[1] * scale, label: a[2] || '' };
    });

    // bounds
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    atoms.forEach(function (a) {
      if (a.x < minX) minX = a.x; if (a.x > maxX) maxX = a.x;
      if (a.y < minY) minY = a.y; if (a.y > maxY) maxY = a.y;
    });
    var ox = pad - minX, oy = pad - minY;
    atoms.forEach(function (a) { a.x += ox; a.y += oy; });
    var w = (maxX - minX) + pad * 2;
    var h = (maxY - minY) + pad * 2;

    var svg = [];
    svg.push('<svg viewBox="0 0 ' + w.toFixed(1) + ' ' + h.toFixed(1) + '" xmlns="http://www.w3.org/2000/svg" role="img">');

    // defs: soft blur for halo
    svg.push('<defs><filter id="haloBlur" x="-50%" y="-50%" width="200%" height="200%">' +
      '<feGaussianBlur stdDeviation="7"/></filter>' +
      '<radialGradient id="haloGrad"><stop offset="0%" stop-color="var(--amber)" stop-opacity="0.85"/>' +
      '<stop offset="100%" stop-color="var(--amber)" stop-opacity="0.15"/></radialGradient></defs>');

    // --- highlight halo (behind everything) ---
    if (struct.highlight && struct.highlight.length) {
      svg.push('<g class="halo" filter="url(#haloBlur)">');
      struct.highlight.forEach(function (idx) {
        var a = atoms[idx];
        svg.push('<circle cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="26" fill="url(#haloGrad)"/>');
      });
      svg.push('</g>');
    }

    // helper: does atom have a label (so bonds should stop short)
    function trim(p, q, r) {
      var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: p.x + dx / d * r, y: p.y + dy / d * r };
    }

    var STROKE = 'var(--ink)';
    // --- bonds ---
    svg.push('<g stroke="' + STROKE + '" stroke-width="2.1" stroke-linecap="round" fill="none">');
    struct.bonds.forEach(function (b) {
      var A = atoms[b[0]], B = atoms[b[1]], order = b[2];
      var p = A.label ? trim(A, B, 13) : { x: A.x, y: A.y };
      var q = B.label ? trim(B, A, 13) : { x: B.x, y: B.y };
      if (order === 2) {
        // two parallel lines
        var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / d * 2.9, ny = dx / d * 2.9;
        svg.push(line(p.x + nx, p.y + ny, q.x + nx, q.y + ny));
        svg.push(line(p.x - nx, p.y - ny, q.x - nx, q.y - ny));
      } else {
        svg.push(line(p.x, p.y, q.x, q.y));
      }
    });
    svg.push('</g>');

    // --- aromatic inner circles ---
    if (struct.aromatic && struct.aromatic.length) {
      svg.push('<g stroke="' + STROKE + '" stroke-width="1.8" fill="none" opacity="0.9">');
      struct.aromatic.forEach(function (ring) {
        var cx = 0, cy = 0;
        ring.forEach(function (i) { cx += atoms[i].x; cy += atoms[i].y; });
        cx /= ring.length; cy /= ring.length;
        var rr = 0;
        ring.forEach(function (i) { rr += Math.hypot(atoms[i].x - cx, atoms[i].y - cy); });
        rr = (rr / ring.length) * 0.62;
        svg.push('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rr.toFixed(1) + '"/>');
      });
      svg.push('</g>');
    }

    // --- atom labels ---
    struct.atoms.forEach(function (raw, i) {
      var a = atoms[i];
      if (!a.label) return;
      var col = ELEM_COLOR[elemOf(a.label)] || STROKE;
      var txt = sub(a.label);
      // mask behind text
      var wLbl = a.label.length * 8.5 + 6;
      svg.push('<rect x="' + (a.x - wLbl / 2).toFixed(1) + '" y="' + (a.y - 11).toFixed(1) +
        '" width="' + wLbl.toFixed(1) + '" height="22" rx="4" fill="var(--paper-2)"/>');
      svg.push('<text x="' + a.x.toFixed(1) + '" y="' + a.y.toFixed(1) + '" text-anchor="middle" ' +
        'dominant-baseline="central" font-family="var(--sans)" font-size="16" font-weight="600" fill="' + col + '">' +
        txt + '</text>');
    });

    svg.push('</svg>');
    return svg.join('');

    function line(x1, y1, x2, y2) {
      return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
  }

  // unicode subscripts already used in data; keep any trailing digits as subscript too
  function sub(s) {
    return s.replace(/([0-9])/g, function (d) {
      var map = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
      return map[d] || d;
    });
  }

  /* mini thumbnail (no halo, no labels-mask fuss) reusing renderer */
  function miniStructure(struct) {
    return renderStructure(struct, {});
  }

  /* ---------------- DOM refs ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  var screens = { home: $('home'), thinking: $('thinking'), result: $('result') };

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle('is-active', k === name);
    });
    if (name === 'result') $('resultScroll').scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* ---------------- Home: example chips ---------------- */
  (function buildChips() {
    var wrap = $('exampleChips');
    MOL.forEach(function (m) {
      var btn = document.createElement('button');
      btn.className = 'chip';
      btn.type = 'button';
      btn.innerHTML =
        '<span class="c-name">' + m.name_zh + '</span>' +
        '<span class="c-klass">' + m.klass + '</span>' +
        '<span class="c-mini">' + miniStructure(m.struct) + '</span>';
      btn.addEventListener('click', function () { analyze(m.id, null); });
      wrap.appendChild(btn);
    });
  })();

  /* ---------------- Capture -> picker ---------------- */
  var lastShotURL = null;
  function onFile(input) {
    var f = input.files && input.files[0];
    if (!f) return;
    if (lastShotURL) URL.revokeObjectURL(lastShotURL);
    lastShotURL = URL.createObjectURL(f);
    input.value = '';
    openPicker(lastShotURL);
  }
  $('cameraInput').addEventListener('change', function () { onFile(this); });
  $('galleryInput').addEventListener('change', function () { onFile(this); });

  var picker = $('picker');
  function openPicker(shotURL) {
    $('pickerShot').innerHTML = shotURL ? '<img src="' + shotURL + '" alt="拍摄样本">' : '';
    var list = $('pickerList');
    list.innerHTML = '';
    MOL.forEach(function (m) {
      var it = document.createElement('button');
      it.className = 'picker-item';
      it.type = 'button';
      it.innerHTML =
        '<span class="p-mini">' + miniStructure(m.struct) + '</span>' +
        '<span><span class="p-name">' + m.name_zh + '</span><br><span class="p-klass">' + m.klass + '</span></span>';
      it.addEventListener('click', function () {
        picker.hidden = true;
        analyze(m.id, shotURL);
      });
      list.appendChild(it);
    });
    picker.hidden = false;
  }
  $('pickerClose').addEventListener('click', function () { picker.hidden = true; });
  picker.addEventListener('click', function (e) { if (e.target === picker) picker.hidden = true; });

  /* ---------------- Thinking animation ---------------- */
  var STEPS = [
    '定位骨架与官能团 …',
    '识别可能的药效团 …',
    '推演与靶点的结合方式 …',
    '扫描代谢软点与结构警示 …',
    '权衡「只改一处」的起点 …'
  ];
  function runThinking(shotURL, done) {
    var spec = $('thinkSpecimen');
    spec.innerHTML = shotURL
      ? '<img src="' + shotURL + '" alt="样本">'
      : '<div class="ph"><svg viewBox="0 0 24 24" width="46" height="46"><path fill="none" stroke="var(--teal)" stroke-width="1.4" d="M9 3h6v5l4 9a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 17l4-9z"/><line x1="9" y1="8" x2="15" y2="8" stroke="var(--teal)" stroke-width="1.4"/></svg></div>';
    var ul = $('thinkSteps');
    ul.innerHTML = '';
    var lis = STEPS.map(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
      return li;
    });
    var i = 0;
    (function tick() {
      if (i > 0) lis[i - 1].classList.add('done');
      if (i < lis.length) {
        lis[i].classList.add('on');
        i++;
        setTimeout(tick, 300 + Math.random() * 220);
      } else {
        setTimeout(done, 260);
      }
    })();
  }

  /* ---------------- Analyze -> result ---------------- */
  function analyze(id, shotURL) {
    var m = byId[id];
    if (!m) return;
    show('thinking');
    runThinking(shotURL, function () {
      buildResult(m);
      show('result');
    });
  }

  function buildResult(m) {
    // structure
    var frame = $('structFrame');
    frame.innerHTML = renderStructure(m.struct, {});
    $('structFrame').parentElement.classList.remove('hl-off'); // ensure halo on
    $('hlToggle').classList.add('is-on');
    $('hlCaption').textContent = m.highlight_label;

    // id
    $('molName').textContent = m.name_zh;
    $('molEn').textContent = m.name_en + (m.aka ? '  ·  ' + m.aka : '');
    var chips = $('molChips');
    chips.innerHTML = '<span class="klass">' + m.klass.split(' · ')[0] + '</span>';
    m.klass.split(' · ').slice(1).forEach(function (k) {
      chips.innerHTML += '<span>' + k + '</span>';
    });

    // cards
    var host = $('cards');
    host.innerHTML = '';
    host.appendChild(card(1, '一句话看懂', 'THE GIST', '<p>' + m.tldr + '</p>', { open: true, cls: 'card--tldr' }));
    host.appendChild(card(2, '结构亮点', 'WHAT CATCHES THE EYE',
      '<p><strong style="color:var(--amber)">◆ ' + m.highlight_label + '</strong></p><p style="margin-top:8px">' + m.highlight_text + '</p>', { open: true }));
    host.appendChild(card(3, '为什么可能有活性', 'WHY IT WORKS', '<p>' + m.why + '</p>'));
    var risks = '<ul class="risk-list">' + m.liabilities.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    host.appendChild(card(4, '潜在风险 / 结构警示', 'LIABILITIES', risks, { cls: 'card--risk' }));
    host.appendChild(card(5, '如果只能改一个位置', 'ONE MOVE',
      '<span class="opt-flag">◎ 优化起点</span><p>' + m.optimize + '</p>'));
    host.appendChild(card(6, '发现故事', 'THE BACKSTORY', '<p>' + m.story + '</p>'));

    var p = m.profile;
    var prof = '<ul class="profile">' +
      row('SMILES', '<span class="v smiles">' + p.smiles + '</span>') +
      row('分子式', sub(p.formula)) +
      row('分子量', p.mw) +
      row('靶点', p.target) +
      row('来源', p.origin) +
      '</ul>';
    host.appendChild(card(7, '分子档案', 'PROFILE', prof));
  }

  function row(k, v) {
    return '<li><span class="k">' + k + '</span><span class="v">' + v + '</span></li>';
  }

  function card(num, title, en, bodyHTML, o) {
    o = o || {};
    var d = document.createElement('details');
    d.className = 'card' + (o.cls ? ' ' + o.cls : '');
    if (o.open) d.open = true;
    d.innerHTML =
      '<summary><div class="card-head">' +
      '<span class="card-num">' + num + '</span>' +
      '<span class="card-title"><small>' + en + '</small>' + title + '</span>' +
      '<span class="card-caret">▶</span>' +
      '</div></summary>' +
      '<div class="card-body">' + bodyHTML + '</div>';
    return d;
  }

  /* highlight toggle */
  $('hlToggle').addEventListener('click', function () {
    var hero = $('structFrame').parentElement;
    var on = hero.classList.toggle('hl-off') === false;
    this.classList.toggle('is-on', on);
  });

  $('backBtn').addEventListener('click', function () { show('home'); });

})();
