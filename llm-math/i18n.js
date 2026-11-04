(function () {
  const SUPPORTED = ["en", "ko", "zh"];
  const STORAGE_KEY = "llm-math-lang";

  const ui = {
    en: {
      htmlLang: "en",
      title: "LLM Math Studio — From Linear Algebra to DeepSeek",
      description:
        "Interactive site: understand BERT, GPT, Stable Diffusion, and DeepSeek through vectors, matrices, calculus, and probability.",
      brand: "LLM Math Studio",
      navAria: "Main navigation",
      navToc: "Contents",
      navLabs: "Labs",
      navModels: "Models",
      navAbout: "About",
      menuOpen: "Open menu",
      heroTitle: "See how language models<br />think in math",
      heroLede:
        "From vector spaces to attention matrices, from gradient descent to diffusion — learn BERT, GPT, Stable Diffusion, and DeepSeek by tuning the math yourself.",
      ctaToc: "Browse contents",
      ctaLabs: "Open interactive labs",
      heroCaption: "Live: query × key → Softmax attention weights",
      aboutEyebrow: "Instructor",
      aboutNote:
        "This site turns the course outline into an interactive lab: tune parameters, then see the math.",
      tocEyebrow: "Course map",
      tocTitle: "Contents",
      tocSearch: "Search chapters, models, or ideas…",
      tocSearchAria: "Search chapters",
      tocChapter: "Chapter {num}",
      tocEmpty: "No chapters match “{query}”.",
      backToc: "← Back to contents",
      chapterKicker: "Chapter {num} · {id}",
      openLab: "Open matching lab →",
      prevSection: "Previous",
      nextSection: "Next",
      labsEyebrow: "Learn by doing",
      labsTitle: "Interactive labs",
      modelsEyebrow: "Model lens",
      modelsTitle: "How math drives four models",
      relatedLab: "Related lab",
      footer: "LLM Math Studio · Interactive learning prototype",
      backHome: "← Site home",
      langLabel: "Language",
      labTabs: {
        overview: "Math confluence",
        vectors: "Dot product",
        matrix: "Matrix map",
        attention: "Attention",
        gradient: "Gradient descent",
        probability: "Temperature",
        diffusion: "Diffusion noise"
      }
    },
    ko: {
      htmlLang: "ko",
      title: "LLM 수학 스튜디오 — 선형대수에서 DeepSeek까지",
      description:
        "벡터·행렬·미적분·확률로 BERT, GPT, Stable Diffusion, DeepSeek를 이해하는 인터랙티브 사이트.",
      brand: "LLM 수학 스튜디오",
      navAria: "주요 탐색",
      navToc: "목차",
      navLabs: "실험실",
      navModels: "모델",
      navAbout: "소개",
      menuOpen: "메뉴 열기",
      heroTitle: "수학으로 보는<br />언어 모델의 사고",
      heroLede:
        "벡터 공간부터 어텐션 행렬까지, 경사하강부터 디퓨전까지 — 직접 파라미터를 만지며 BERT, GPT, Stable Diffusion, DeepSeek의 원리를 이해합니다.",
      ctaToc: "목차 보기",
      ctaLabs: "실험실 열기",
      heroCaption: "실시간: 쿼리 × 키 → Softmax 어텐션 가중치",
      aboutEyebrow: "강사",
      aboutNote:
        "본 사이트는 강의 목차를 인터랙티브 실험으로 재구성했습니다. 파라미터를 조절하고 수학을 눈으로 확인하세요.",
      tocEyebrow: "전체 지도",
      tocTitle: "목차",
      tocSearch: "장·모델·개념 검색…",
      tocSearchAria: "장 검색",
      tocChapter: "{num}장",
      tocEmpty: "“{query}”에 맞는 장이 없습니다.",
      backToc: "← 목차로",
      chapterKicker: "{num}장 · {id}",
      openLab: "관련 실험 열기 →",
      prevSection: "이전",
      nextSection: "다음",
      labsEyebrow: "직접 이해하기",
      labsTitle: "인터랙티브 실험",
      modelsEyebrow: "모델 관점",
      modelsTitle: "수학이 네 모델을 움직이는 방식",
      relatedLab: "관련 실험",
      footer: "LLM 수학 스튜디오 · 인터랙티브 학습 프로토타입",
      backHome: "← 사이트 홈",
      langLabel: "언어",
      labTabs: {
        overview: "수학 합류",
        vectors: "내적",
        matrix: "행렬 변환",
        attention: "어텐션",
        gradient: "경사하강",
        probability: "온도 샘플링",
        diffusion: "디퓨전 노이즈"
      }
    },
    zh: {
      htmlLang: "zh-Hant",
      title: "大模型數學工坊 — 從線性代數到 DeepSeek",
      description:
        "互動式網站：以向量、矩陣、微積分與概率視角理解 BERT、GPT、Stable Diffusion 與 DeepSeek。",
      brand: "大模型數學工坊",
      navAria: "主導航",
      navToc: "目錄",
      navLabs: "互動實驗",
      navModels: "模型視角",
      navAbout: "關於",
      menuOpen: "開啟選單",
      heroTitle: "用數學看見<br />語言模型如何思考",
      heroLede:
        "從向量空間到注意力矩陣，從梯度下降到擴散過程——以可操作的實驗理解 BERT、GPT、Stable Diffusion 與 DeepSeek 背後的原理。",
      ctaToc: "開始閱讀目錄",
      ctaLabs: "打開互動實驗",
      heroCaption: "即時：查詢向量 × 鍵矩陣 → Softmax 注意力權重",
      aboutEyebrow: "講師",
      aboutNote:
        "本站依其課程大綱重構為互動學習介面，強調「動手調參 → 看見數學」而非純文字閱讀。",
      tocEyebrow: "全書地圖",
      tocTitle: "目錄",
      tocSearch: "搜尋章節、模型或概念…",
      tocSearchAria: "搜尋章節",
      tocChapter: "第 {num} 章",
      tocEmpty: "沒有符合「{query}」的章節。",
      backToc: "← 返回目錄",
      chapterKicker: "第 {num} 章 · {id}",
      openLab: "打開對應互動實驗 →",
      prevSection: "上一節",
      nextSection: "下一節",
      labsEyebrow: "動手理解",
      labsTitle: "互動實驗",
      modelsEyebrow: "模型視角",
      modelsTitle: "數學如何驅動四大模型",
      relatedLab: "相關實驗",
      footer: "大模型數學工坊 · 互動學習原型",
      backHome: "← 返回首頁",
      langLabel: "語言",
      labTabs: {
        overview: "數學匯流",
        vectors: "向量內積",
        matrix: "矩陣變換",
        attention: "注意力",
        gradient: "梯度下降",
        probability: "溫度採樣",
        diffusion: "擴散加噪"
      }
    }
  };

  const labs = {
    en: {
      overview: {
        title: "Where three maths meet",
        desc: "Drag weights to see linear maps, loss gradients, and output probabilities move together.",
        w: "Linear weight w",
        b: "Bias b",
        temp: "Softmax temperature",
        chart: "Output P(class | x) · gold = target",
        loss: "Cross-entropy",
        grad0: "∂L/∂logit₀",
        linear: "Linear form",
        targetP: "Target probability"
      },
      vectors: {
        title: "Vectors & dot product",
        desc: "Change angle and length to see the prototype of attention scores: a · b and cosine similarity.",
        ang: "Angle (°)",
        interpretHi: "Highly aligned",
        interpretMid: "Partly related",
        interpretLo: "Nearly orthogonal / opposite"
      },
      matrix: {
        title: "Matrices as linear maps",
        desc: "Tune a 2×2 matrix and watch the unit square stretch and rotate — what a linear layer does.",
        det: "det(A)",
        volume: "Volume scale",
        singular: "Nearly singular / collapse",
        reflect: "Includes reflection",
        preserve: "Orientation-preserving"
      },
      attention: {
        title: "Attention matrix",
        desc: "Query–key similarities for three tokens become Softmax weights, then mix values.",
        focus: "Q₂ alignment",
        scale: "√d scale",
        causal: "Causal mask (0 off / 1 on)",
        chart: "Attention weights softmax(QKᵀ / √d)",
        out: "Tok₂ output ≈",
        mode: "Mode",
        modeGpt: "GPT causal",
        modeBert: "BERT bidirectional",
        entropy: "Entropy (Tok₂ row)"
      },
      gradient: {
        title: "Gradient descent",
        desc: "Walk the loss L(θ)=(θ²−1)²+0.1θ. Learning rate decides glide vs oscillation.",
        lr: "Learning rate",
        start: "Start θ",
        step: "Step once / reset path",
        dir: "∇L direction",
        steps: "Steps"
      },
      probability: {
        title: "Temperature & sampling",
        desc: "Logits pass through temperature Softmax. Lower T is peakier; higher T is flatter.",
        temp: "Temperature T",
        peak: "Lead-token logit",
        chart: "Next-token PMF",
        entropy: "Entropy H",
        tokens: ["the", "is", "in", "a", "and", "model", "math"]
      },
      diffusion: {
        title: "Diffusion noise path",
        desc: "x_t = √ᾱ_t x₀ + √(1−ᾱ_t) ε. Drag time to see signal linearly mixed with Gaussian noise.",
        t: "Timestep t",
        seed: "Noise seed",
        x0: "x₀ clean signal",
        xt: "x_t noisy",
        signal: "Signal share",
        noise: "Noise share"
      },
      hero: {
        title: "Live attention weights",
        tokens: ["tok", "emb", "att", "mat", "soft"]
      }
    },
    ko: {
      overview: {
        title: "세 수학이 만나는 곳",
        desc: "가중치를 조절하며 선형 변환, 손실 기울기, 출력 확률이 함께 변하는 모습을 봅니다.",
        w: "선형 가중치 w",
        b: "편향 b",
        temp: "Softmax 온도",
        chart: "출력 P(class | x) · 금색 = 목표",
        loss: "교차 엔트로피",
        grad0: "∂L/∂logit₀",
        linear: "선형식",
        targetP: "목표 확률"
      },
      vectors: {
        title: "벡터와 내적",
        desc: "각도와 길이를 바꿔 어텐션 점수의 원형인 a · b와 코사인 유사도를 확인합니다.",
        ang: "각도 (°)",
        interpretHi: "강하게 정렬",
        interpretMid: "부분 관련",
        interpretLo: "거의 직교/반대"
      },
      matrix: {
        title: "행렬 = 선형 변환",
        desc: "2×2 행렬을 조절해 단위 정사각형이 늘어나고 회전하는 모습 — 선형층의 역할 — 을 봅니다.",
        det: "det(A)",
        volume: "부피 배율",
        singular: "특이에 가까움 / 붕괴",
        reflect: "반사 포함",
        preserve: "방향 보존"
      },
      attention: {
        title: "어텐션 행렬",
        desc: "세 토큰의 쿼리·키 유사도가 Softmax 가중치가 되어 값을 혼합합니다.",
        focus: "Q₂ 정렬 강도",
        scale: "√d 스케일",
        causal: "인과 마스크 (0 끔 / 1 켬)",
        chart: "어텐션 가중치 softmax(QKᵀ / √d)",
        out: "Tok₂ 출력 ≈",
        mode: "모드",
        modeGpt: "GPT 인과",
        modeBert: "BERT 양방향",
        entropy: "엔트로피 (Tok₂ 행)"
      },
      gradient: {
        title: "경사하강법",
        desc: "손실 L(θ)=(θ²−1)²+0.1θ 위를 걷습니다. 학습률이 미끄러짐과 진동을 가릅니다.",
        lr: "학습률",
        start: "시작 θ",
        step: "한 걸음 / 경로 초기화",
        dir: "∇L 방향",
        steps: "걸음 수"
      },
      probability: {
        title: "온도와 샘플링",
        desc: "로짓이 온도 Softmax를 거칩니다. T가 낮을수록 뾰족, 높을수록 평평합니다.",
        temp: "온도 T",
        peak: "주 토큰 logit",
        chart: "다음 토큰 확률질량함수",
        entropy: "엔트로피 H",
        tokens: ["은", "는", "이", "가", "와", "모델", "수학"]
      },
      diffusion: {
        title: "디퓨전 노이즈 경로",
        desc: "x_t = √ᾱ_t x₀ + √(1−ᾱ_t) ε. 시간을 끌어 신호가 가우시안 노이즈와 선형 혼합되는 모습을 봅니다.",
        t: "시간 단계 t",
        seed: "노이즈 시드",
        x0: "x₀ 원신호",
        xt: "x_t 노이즈",
        signal: "신호 비율",
        noise: "노이즈 비율"
      },
      hero: {
        title: "동적 어텐션 가중치",
        tokens: ["단", "어", "임", "베", "딩"]
      }
    },
    zh: {
      overview: {
        title: "三門數學如何匯流",
        desc: "拖動權重，看線性變換、損失梯度與輸出概率如何同時變化。",
        w: "線性權重 w",
        b: "偏置 b",
        temp: "Softmax 溫度",
        chart: "輸出概率 P(class | x)  · 金色為目標類",
        loss: "交叉熵損失",
        grad0: "∂L/∂logit₀",
        linear: "線性式",
        targetP: "目標類概率"
      },
      vectors: {
        title: "向量與內積",
        desc: "拖動兩向量角度與長度，觀察點積與餘弦相似度——注意力分數的原型。",
        ang: "夾角 (°)",
        interpretHi: "高度對齊",
        interpretMid: "部分相關",
        interpretLo: "近乎正交／反向"
      },
      matrix: {
        title: "矩陣作為線性變換",
        desc: "調整 2×2 矩陣，看單位方塊被拉伸、旋轉——線性層在做的事。",
        det: "det(A)",
        volume: "體積縮放",
        singular: "近奇異／信息坍縮",
        reflect: "含反射",
        preserve: "保向變換"
      },
      attention: {
        title: "注意力矩陣",
        desc: "三個 token 的查詢／鍵相似度經 Softmax 變成權重，再混合 value。",
        focus: "Q₂ 對齊強度",
        scale: "√d 縮放",
        causal: "因果遮罩 (0 關 / 1 開)",
        chart: "注意力權重 softmax(QKᵀ / √d)",
        out: "Tok₂ 輸出 ≈",
        mode: "模式",
        modeGpt: "GPT 因果",
        modeBert: "BERT 雙向",
        entropy: "熵 (Tok₂ 行)"
      },
      gradient: {
        title: "梯度下降",
        desc: "在損失曲面 L(θ)= (θ²-1)² + 0.1θ 上行走。學習率決定你是滑向谷底還是震盪飛出。",
        lr: "學習率",
        start: "起始 θ",
        step: "執行一步 / 重置軌跡",
        dir: "∇L 方向",
        steps: "步數"
      },
      probability: {
        title: "溫度與採樣分佈",
        desc: "語言模型 logits 經溫度縮放後 Softmax。溫度越低越「自信」，越高越平滑。",
        temp: "溫度 T",
        peak: "主詞 logit",
        chart: "下一 token 概率質量函數",
        entropy: "熵 H",
        tokens: ["的", "是", "在", "了", "與", "模型", "數學"]
      },
      diffusion: {
        title: "擴散加噪軌跡",
        desc: "x_t = √ᾱ_t x₀ + √(1-ᾱ_t) ε。拖動時間步，看信號如何被高斯噪聲線性混合。",
        t: "時間步 t",
        seed: "噪聲種子",
        x0: "x₀ 原始信號",
        xt: "x_t 加噪結果",
        signal: "信號占比",
        noise: "噪聲占比"
      },
      hero: {
        title: "動態注意力權重",
        tokens: ["詞", "嵌", "入", "注", "意"]
      }
    }
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (_) {}
    const nav = String(navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("zh")) return "zh";
    return "en";
  }

  let lang = detectLang();

  function format(template, vars = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, k) =>
      vars[k] != null ? String(vars[k]) : `{${k}}`
    );
  }

  function getUi() {
    return ui[lang] || ui.en;
  }

  function getLabs() {
    return labs[lang] || labs.en;
  }

  function getContent() {
    const pack = window.LLM_MATH_CONTENT;
    if (!pack) return null;
    return pack[lang] || pack.en || pack.zh;
  }

  function setLang(next) {
    if (!SUPPORTED.includes(next)) return lang;
    lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
    document.documentElement.lang = getUi().htmlLang;
    window.dispatchEvent(new CustomEvent("llm-math:lang", { detail: { lang } }));
    return lang;
  }

  window.LLM_MATH_I18N = {
    SUPPORTED,
    detectLang,
    getLang: () => lang,
    setLang,
    format,
    getUi,
    getLabs,
    getContent,
    ui,
    labs
  };
})();
