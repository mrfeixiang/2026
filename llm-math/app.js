(function () {
  const i18n = window.LLM_MATH_I18N;
  const labs = window.LLM_MATH_LABS;

  const views = {
    home: document.getElementById("view-home"),
    about: document.getElementById("view-about"),
    toc: document.getElementById("view-toc"),
    chapter: document.getElementById("view-chapter"),
    labs: document.getElementById("view-labs"),
    models: document.getElementById("view-models")
  };

  let currentFlatIndex = 0;
  let activeLab = "attention";
  let currentView = "home";

  function content() {
    return i18n.getContent();
  }

  function ui() {
    return i18n.getUi();
  }

  function flatSections() {
    const sections = [];
    content().chapters.forEach((ch) => {
      ch.sections.forEach((sec) => {
        sections.push({ chapter: ch, section: sec });
      });
    });
    return sections;
  }

  function labDefs() {
    const tabs = ui().labTabs;
    return [
      { id: "overview", name: tabs.overview },
      { id: "vectors", name: tabs.vectors },
      { id: "matrix", name: tabs.matrix },
      { id: "attention", name: tabs.attention },
      { id: "gradient", name: tabs.gradient },
      { id: "probability", name: tabs.probability },
      { id: "diffusion", name: tabs.diffusion }
    ];
  }

  function applyStaticUi() {
    const t = ui();
    document.documentElement.lang = t.htmlLang;
    document.title = t.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.description);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] != null) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (t[key] != null) el.innerHTML = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] != null) el.setAttribute("placeholder", t[key]);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (t[key] != null) el.setAttribute("aria-label", t[key]);
    });

    // Author bio from content pack
    const author = content().author;
    const aboutName = document.getElementById("aboutName");
    const aboutBio = document.getElementById("aboutBio");
    if (aboutName) aboutName.textContent = author.name;
    if (aboutBio) aboutBio.textContent = author.bio;

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === i18n.getLang());
      btn.setAttribute("aria-pressed", btn.dataset.lang === i18n.getLang() ? "true" : "false");
    });
  }

  function showView(name) {
    currentView = name;
    Object.entries(views).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("hidden", key !== name);
    });
    document.querySelectorAll(".top-nav [data-nav]").forEach((btn) => {
      const nav = btn.dataset.nav;
      btn.classList.toggle("active", nav === name || (name === "chapter" && nav === "toc"));
    });
    document.querySelector(".top-nav")?.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setHash(hash) {
    if (location.hash.replace(/^#/, "") === hash.replace(/^#/, "")) return;
    history.replaceState(null, "", hash);
  }

  function navigate(target, opts = {}) {
    if (target === "labs") {
      showView("labs");
      renderLabs(opts.lab || activeLab);
      setHash(`#labs/${opts.lab || activeLab}`);
      return;
    }
    if (target === "models") {
      showView("models");
      renderModels();
      setHash("#models");
      return;
    }
    if (target === "toc") {
      showView("toc");
      renderToc(document.getElementById("tocSearch")?.value || "");
      setHash("#toc");
      return;
    }
    if (target === "about") {
      showView("about");
      setHash("#about");
      return;
    }
    if (target === "home") {
      showView("home");
      setHash("#top");
    }
  }

  function renderToc(query = "") {
    const grid = document.getElementById("tocGrid");
    const t = ui();
    const q = query.trim().toLowerCase();
    grid.innerHTML = "";
    content().chapters.forEach((ch) => {
      const hay = `${ch.title} ${ch.blurb} ${ch.sections.map((s) => s.title).join(" ")}`.toLowerCase();
      if (q && !hay.includes(q)) return;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "toc-card";
      card.innerHTML = `
        <div class="num">${i18n.format(t.tocChapter, { num: ch.num })}</div>
        <h3>${ch.title}</h3>
        <p>${ch.blurb}</p>
        <div class="secs">${ch.sections
          .slice(0, 4)
          .map((s) => `<span class="chip">${s.id}</span>`)
          .join("")}</div>`;
      card.addEventListener("click", () => openChapterSection(ch.id, ch.sections[0].id));
      grid.appendChild(card);
    });
    if (!grid.children.length) {
      grid.innerHTML = `<p class="note">${i18n.format(t.tocEmpty, { query })}</p>`;
    }
  }

  function openChapterSection(chapterId, sectionId) {
    const list = flatSections();
    const idx = list.findIndex(
      (item) => item.chapter.id === chapterId && item.section.id === sectionId
    );
    currentFlatIndex = idx < 0 ? 0 : idx;
    renderChapter();
    showView("chapter");
    const item = list[currentFlatIndex];
    setHash(`#chapter/${item.chapter.id}/${item.section.id}`);
  }

  function openChapterByFlat(index) {
    const list = flatSections();
    currentFlatIndex = Math.max(0, Math.min(list.length - 1, index));
    renderChapter();
    showView("chapter");
    const item = list[currentFlatIndex];
    setHash(`#chapter/${item.chapter.id}/${item.section.id}`);
  }

  function renderChapter() {
    const list = flatSections();
    const item = list[currentFlatIndex];
    const { chapter, section } = item;
    const t = ui();
    const article = document.getElementById("chapterArticle");
    const blocks = section.blocks
      .map((b) => `<div class="block"><h4>${b.h}</h4><p>${b.p}</p></div>`)
      .join("");

    let formula = "";
    if (section.lab === "attention") {
      formula = `<div class="formula">Attention(Q,K,V) = softmax(QKᵀ / √d_k) V</div>`;
    } else if (section.lab === "diffusion") {
      formula = `<div class="formula">x_t = √ᾱ_t · x_0 + √(1 − ᾱ_t) · ε</div>`;
    } else if (section.lab === "gradient") {
      formula = `<div class="formula">θ ← θ − η ∇_θ L(θ)</div>`;
    } else if (section.lab === "probability") {
      formula = `<div class="formula">P(x_t | x_&lt;t) = softmax(z / T)</div>`;
    } else if (section.lab === "vectors") {
      formula = `<div class="formula">a · b = |a| |b| cos θ</div>`;
    } else if (section.lab === "matrix") {
      formula = `<div class="formula">y = W x + b</div>`;
    }

    const labCta = section.lab
      ? `<div class="inline-lab-cta"><button type="button" class="btn primary" data-open-lab="${section.lab}">${t.openLab}</button></div>`
      : "";

    article.innerHTML = `
      <p class="chapter-kicker">${i18n.format(t.chapterKicker, { num: chapter.num, id: section.id })}</p>
      <h2>${chapter.title}</h2>
      <h3 class="section-title">${section.title}</h3>
      ${blocks}
      ${formula}
      ${labCta}
    `;

    article.querySelector("[data-open-lab]")?.addEventListener("click", (e) => {
      navigate("labs", { lab: e.currentTarget.getAttribute("data-open-lab") });
    });

    document.getElementById("prevChapter").disabled = currentFlatIndex === 0;
    document.getElementById("nextChapter").disabled = currentFlatIndex === list.length - 1;
  }

  function renderLabs(labId) {
    activeLab = labId;
    const tabs = document.getElementById("labTabs");
    tabs.innerHTML = "";
    labDefs().forEach((lab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = lab.name;
      btn.classList.toggle("active", lab.id === labId);
      btn.addEventListener("click", () => {
        renderLabs(lab.id);
        setHash(`#labs/${lab.id}`);
      });
      tabs.appendChild(btn);
    });
    labs.mount(document.getElementById("labStage"), labId);
  }

  function renderModels() {
    const grid = document.getElementById("modelGrid");
    const t = ui();
    grid.innerHTML = "";
    content().models.forEach((m) => {
      const card = document.createElement("article");
      card.className = "model-card";
      card.innerHTML = `
        <span class="tag">${m.tag}</span>
        <h3>${m.name}</h3>
        <p class="math">${m.math}</p>
        <ul>${m.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        <button type="button" class="btn ghost" data-lab="${m.lab}">${t.relatedLab}</button>`;
      card.querySelector("button").addEventListener("click", () => navigate("labs", { lab: m.lab }));
      grid.appendChild(card);
    });
  }

  function refreshActiveView() {
    applyStaticUi();
    if (currentView === "toc") renderToc(document.getElementById("tocSearch")?.value || "");
    else if (currentView === "chapter") renderChapter();
    else if (currentView === "labs") renderLabs(activeLab);
    else if (currentView === "models") renderModels();
    else if (currentView === "about") showView("about");
    else showView("home");
  }

  function applyHash() {
    const hash = location.hash.replace(/^#/, "");
    if (!hash || hash === "top") {
      showView("home");
      return;
    }
    const parts = hash.split("/");
    if (parts[0] === "labs") {
      showView("labs");
      renderLabs(parts[1] || "attention");
      return;
    }
    if (parts[0] === "chapter" && parts[1]) {
      const ch = content().chapters.find((c) => c.id === parts[1]);
      const secId = parts[2] || ch?.sections[0]?.id;
      if (ch && secId) openChapterSection(ch.id, secId);
      else showView("home");
      return;
    }
    if (parts[0] === "toc" || parts[0] === "about" || parts[0] === "models") {
      navigate(parts[0]);
      return;
    }
    showView("home");
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.tagName === "A") e.preventDefault();
      navigate(el.getAttribute("data-nav"));
    });
  });

  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.querySelector(".top-nav")?.classList.toggle("open");
  });

  document.getElementById("tocSearch")?.addEventListener("input", (e) => {
    renderToc(e.target.value);
  });

  document.getElementById("prevChapter")?.addEventListener("click", () => {
    openChapterByFlat(currentFlatIndex - 1);
  });
  document.getElementById("nextChapter")?.addEventListener("click", () => {
    openChapterByFlat(currentFlatIndex + 1);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      i18n.setLang(btn.dataset.lang);
      refreshActiveView();
    });
  });

  window.addEventListener("llm-math:lang", () => {
    // already handled via refreshActiveView from click; keep for external callers
  });

  const heroCanvas = document.getElementById("heroCanvas");
  if (heroCanvas) labs.startHero(heroCanvas);

  window.addEventListener("hashchange", applyHash);
  applyStaticUi();
  applyHash();
  if (currentView === "home") {
    // toc pre-render not required
  } else if (currentView === "toc") {
    renderToc();
  }
})();
