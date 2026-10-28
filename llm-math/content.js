window.LLM_MATH_CONTENT = {
  "en": {
    "author": {
      "name": "Jiangnanyan",
      "bio": "Master’s in Computer Science with a decade of hands-on AI experience across deep learning and large models. Focuses on AI training and consulting while tracking the research frontier."
    },
    "chapters": [
      {
        "id": "ch1",
        "num": "01",
        "title": "Overview of AI Large Models",
        "blurb": "Definitions, history, applications — and why math unlocks how large models work.",
        "sections": [
          {
            "id": "1.1",
            "title": "What is an AI large model?",
            "blocks": [
              {
                "h": "Definition and scope",
                "p": "Large models are deep networks with huge parameter counts, pretrained on massive data, and adaptable to many tasks via prompts or fine-tuning. The point is not size alone, but emergent ability and a unified representation."
              },
              {
                "h": "Vs. traditional AI models",
                "p": "Classic models are often task-specific and feature-engineered. Large models learn representations end-to-end; one weight set can serve translation, summarization, reasoning, and more. Both rely on linear maps plus nonlinearities — at very different scales."
              }
            ],
            "lab": null
          },
          {
            "id": "1.2",
            "title": "History of large models",
            "blocks": [
              {
                "h": "Foundations (1950–2017)",
                "p": "From perceptrons and backprop to Word2Vec and early sequence models, linear algebra and calculus made trainable representation learning possible."
              },
              {
                "h": "Paradigm shift (2018–2020)",
                "p": "Transformers and BERT/GPT established “attention + large-scale pretraining”; matrix multiplication became the computational spine."
              },
              {
                "h": "Scale-up (2021–present)",
                "p": "Parameters, data, and compute grew together; multimodal and diffusion models rose. Optimization theory and probabilistic modeling matter more than ever."
              },
              {
                "h": "Challenges and trends",
                "p": "Efficiency, alignment, interpretability, data quality, and energy. Math tools move from “can train” toward “controllable and verifiable.”"
              }
            ],
            "lab": null
          },
          {
            "id": "1.3",
            "title": "Application domains",
            "blocks": [
              {
                "h": "Natural language processing",
                "p": "Language modeling learns a conditional distribution P(token | context) over word/subword space."
              },
              {
                "h": "Computer vision",
                "p": "Images become patch vectors that enter the same attention machinery; geometry and linear maps remain central."
              },
              {
                "h": "Recommendation systems",
                "p": "Users and items live in one embedding space; similarity is often an inner product or cosine."
              },
              {
                "h": "Healthcare, finance, and other domains",
                "p": "Domain fine-tuning and retrieval need intuition for loss landscapes, calibration, and uncertainty."
              }
            ],
            "lab": null
          },
          {
            "id": "1.4",
            "title": "Math foundations overview",
            "blocks": [
              {
                "h": "Why the math matters",
                "p": "You can call APIs without math — but debugging failures, changing architectures, and improving training pulls you back to linear algebra, calculus, and probability."
              },
              {
                "h": "Key mathematical areas",
                "p": "Linear algebra describes representation and transforms; calculus describes learning dynamics; probability describes uncertainty and generative objectives."
              },
              {
                "h": "Concrete uses in large models",
                "p": "Embeddings, attention, layer norm, losses, sampling, and diffusion SDEs/ODEs are all explicit mathematical objects."
              },
              {
                "h": "Open challenges",
                "p": "High-dimensional geometry, nonconvex optimization, finite-sample generalization, plus better matrix factorizations and MoE routing."
              }
            ],
            "lab": "overview"
          }
        ]
      },
      {
        "id": "ch2",
        "num": "02",
        "title": "Linear Algebra Basics",
        "blurb": "Vectors, matrices, eigen-decomposition — the native language of model weights.",
        "sections": [
          {
            "id": "2.1",
            "title": "Vectors",
            "blocks": [
              {
                "h": "Basic ideas",
                "p": "A vector is an ordered list — direction, features, or a word embedding. Every token is mapped to a point in ℝᵈ."
              },
              {
                "h": "Vector spaces",
                "p": "Sets closed under addition and scalar multiplication. Semantically related words often sit near related subspaces or manifolds."
              },
              {
                "h": "Operations",
                "p": "Add, scale, inner product, norms, cosine similarity. Attention scores are essentially query–key inner products."
              }
            ],
            "lab": "vectors"
          },
          {
            "id": "2.2",
            "title": "Matrices",
            "blocks": [
              {
                "h": "Representation and arithmetic",
                "p": "A matrix is a linear map. A dense layer y = Wx + b is matrix–vector multiplication plus a shift."
              },
              {
                "h": "Inverse, transpose, determinant",
                "p": "Transpose swaps rows/columns; inverses undo maps (when they exist); determinants measure volume scaling and stability intuition."
              },
              {
                "h": "Eigenvalues, eigenvectors, factorizations",
                "p": "Eigendecomposition and SVD reveal principal directions. LoRA, low-rank adapters, and compression lean on “important directions live in a low-rank subspace.”"
              }
            ],
            "lab": "matrix"
          }
        ]
      },
      {
        "id": "ch3",
        "num": "03",
        "title": "Linear Algebra in Large Models",
        "blurb": "Map matrix language onto BERT, GPT, and Stable Diffusion.",
        "sections": [
          {
            "id": "3.1",
            "title": "Linear algebra in BERT",
            "blocks": [
              {
                "h": "Embeddings as matrices",
                "p": "The embedding table is |V| × d; lookup selects a row. Positional encodings add another vector."
              },
              {
                "h": "Attention as matrix ops",
                "p": "Q=XW_Q, K=XW_K, V=XW_V; Attention = softmax(QKᵀ/√d) V. Every step is multiply + normalize."
              },
              {
                "h": "Pretraining and fine-tuning",
                "p": "MLM uses a linear head to the vocabulary; fine-tuning often freezes the backbone and trains a head or low-rank delta."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.2",
            "title": "Linear algebra in GPT",
            "blocks": [
              {
                "h": "Autoregression and matrices",
                "p": "A causal mask makes attention lower-triangular so position t only sees ≤ t."
              },
              {
                "h": "Decoder linear algebra",
                "p": "Stacked self-attention and MLPs (two linear maps around GELU) reshape representations; W_vocab maps to logits."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.3",
            "title": "Linear algebra in Stable Diffusion",
            "blocks": [
              {
                "h": "Diffusion as linear mixes",
                "p": "The forward process mixes data with noise: x_t = √ᾱ_t x_0 + √(1−ᾱ_t) ε."
              },
              {
                "h": "Conditional generation",
                "p": "Text becomes vectors/sequences that inject into U-Net/DiT via cross-attention matrices."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch4",
        "num": "04",
        "title": "Calculus Basics",
        "blurb": "Limits, derivatives, integrals — the language of optimization and continuous dynamics.",
        "sections": [
          {
            "id": "4.1",
            "title": "Functions and limits",
            "blocks": [
              {
                "h": "Functions, limits, continuity",
                "p": "Loss L(θ) is a function on parameter space. Continuity and differentiability let gradients point downhill."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.2",
            "title": "Derivatives and differentials",
            "blocks": [
              {
                "h": "Derivatives",
                "p": "A derivative is a local linear approximation. Backprop is the chain rule on a computation graph."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.3",
            "title": "Integrals",
            "blocks": [
              {
                "h": "Definite and indefinite integrals",
                "p": "Integrals appear in expectations, normalizing constants, and accumulated noise in continuous-time diffusion. Densities integrate to 1."
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch5",
        "num": "05",
        "title": "Calculus in Large Models",
        "blurb": "From embedding smoothness to diffusion ODEs — calculus inside training and generation.",
        "sections": [
          {
            "id": "5.1",
            "title": "Calculus in BERT",
            "blocks": [
              {
                "h": "Embeddings, attention, fine-tuning",
                "p": "Softmax and LayerNorm are differentiable; gradients flow through attention weights and decide which tokens move the representation."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.2",
            "title": "Calculus in GPT",
            "blocks": [
              {
                "h": "Autoregressive optimization",
                "p": "Maximizing ∑ log P(x_t | x_<t) is minimizing cross-entropy; Adam tracks first- and second-order gradient statistics."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.3",
            "title": "Calculus in Stable Diffusion",
            "blocks": [
              {
                "h": "Diffusion analysis",
                "p": "In the continuous limit, SDEs / probability-flow ODEs appear; score matching targets ∇_x log p_t(x)."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch6",
        "num": "06",
        "title": "Probability & Statistics Basics",
        "blurb": "Randomness, distributions, inference — where generative objectives come from.",
        "sections": [
          {
            "id": "6.1",
            "title": "Probability foundations",
            "blocks": [
              {
                "h": "Events, conditionals, Bayes",
                "p": "P(A|B)=P(B|A)P(A)/P(B). Language models keep computing the next-token conditional given the past."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.2",
            "title": "Random variables and distributions",
            "blocks": [
              {
                "h": "Common distributions and moments",
                "p": "Bernoulli, binomial, Poisson, Gaussian; mean and variance describe center and spread. Init and noise often assume Gaussians."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.3",
            "title": "Multivariate random variables",
            "blocks": [
              {
                "h": "Joint, marginal, covariance",
                "p": "Correlations across embedding dims shape representation; multivariate Gaussians are common in VI and diffusion."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.4",
            "title": "Estimation and hypothesis tests",
            "blocks": [
              {
                "h": "Point/interval estimates and tests",
                "p": "Maximum likelihood is the prototype of training; calibration and A/B evaluation need interval and testing thinking."
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch7",
        "num": "07",
        "title": "Probability in Large Models",
        "blurb": "Align probability language with MLM, autoregression, and diffusion.",
        "sections": [
          {
            "id": "7.1",
            "title": "Probability in BERT",
            "blocks": [
              {
                "h": "Masked LM and attention",
                "p": "MLM estimates the conditional at masked positions; attention weights are a discrete mixture over values."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "7.2",
            "title": "Probability in GPT",
            "blocks": [
              {
                "h": "Autoregressive probability",
                "p": "The joint factors into conditionals. Temperature, top-k, and nucleus sampling reshape that distribution."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "7.3",
            "title": "Probability in Stable Diffusion",
            "blocks": [
              {
                "h": "Diffusion and evaluation",
                "p": "Forward noising defines a Gaussian chain; the reverse learns denoising. FID and CLIP scores are statistical distances."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch8",
        "num": "08",
        "title": "DeepSeek Large Models",
        "blurb": "From history to math: efficient architectures still rest on the same foundations.",
        "sections": [
          {
            "id": "8.1",
            "title": "DeepSeek history",
            "blocks": [
              {
                "h": "Background and product line",
                "p": "DeepSeek LLM / Coder set the base; V2 and V3 pushed architecture efficiency; R1 emphasized reasoning and RL paths."
              },
              {
                "h": "V series and R series",
                "p": "Each generation aims for equal-or-better capability at lower train/infer cost — sparse compute, low rank, better objectives."
              }
            ],
            "lab": null
          },
          {
            "id": "8.2",
            "title": "Technical evolution",
            "blocks": [
              {
                "h": "From base to V2 / V3 / R1",
                "p": "MLA-style attention compresses KV cache with low rank; MoE routes to experts; R1 strengthens policy optimization under verifiable rewards."
              }
            ],
            "lab": "matrix"
          },
          {
            "id": "8.3",
            "title": "Math inside DeepSeek",
            "blocks": [
              {
                "h": "Linear algebra, calculus, probability",
                "p": "Low-rank attention is matrix factorization; training is still gradient flow on a loss; LM and RL remain expected-risk minimization."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "8.4",
            "title": "Outlook",
            "blocks": [
              {
                "h": "Lessons and directions",
                "p": "Architecture wins often trade better algebraic structure for compute; multimodal systems and more efficient math optimization will keep leading."
              }
            ],
            "lab": null
          }
        ]
      }
    ],
    "models": [
      {
        "id": "bert",
        "name": "BERT",
        "tag": "Bidirectional encoder",
        "math": "Masked LM + self-attention matrices",
        "points": [
          "Embedding matrices send discrete tokens into a continuous space",
          "Bidirectional attention: QKᵀ without a causal mask",
          "Fine-tuning is often a linear probe or low-rank adapter"
        ],
        "lab": "attention"
      },
      {
        "id": "gpt",
        "name": "GPT",
        "tag": "Autoregressive generation",
        "math": "Conditional probability chain × causal attention",
        "points": [
          "P(x) = ∏ P(x_t | x_<t)",
          "Lower-triangular masks enforce time causality",
          "Decoding reshapes logits into a sampling distribution"
        ],
        "lab": "probability"
      },
      {
        "id": "sd",
        "name": "Stable Diffusion",
        "tag": "Latent diffusion",
        "math": "Gaussian noise chain + score / noise prediction",
        "points": [
          "x_t is a linear mix of x_0 and noise",
          "Conditions enter via cross-attention",
          "Continuous limits map to SDEs / ODEs"
        ],
        "lab": "diffusion"
      },
      {
        "id": "deepseek",
        "name": "DeepSeek",
        "tag": "Efficiency & reasoning",
        "math": "Low-rank attention, MoE routing, RL expectations",
        "points": [
          "Matrix factorizations compress KV and compute",
          "Expert routing is discrete choice + linear mix",
          "R-series strengthens policy gradients under verifiable rewards"
        ],
        "lab": "matrix"
      }
    ]
  },
  "ko": {
    "author": {
      "name": "강남연 (江南燕)",
      "bio": "컴퓨터과학 석사. 딥러닝·대규모 모델 등 AI 현장에서 10년 경험을 쌓았으며, 현재 AI 교육·컨설팅에 집중하면서 기술 前沿을 꾸준히 추적합니다."
    },
    "chapters": [
      {
        "id": "ch1",
        "num": "01",
        "title": "인공지능 대규모 모델 개요",
        "blurb": "정의, 발전 과정, 응용 분야 — 그리고 수학이 대규모 모델을 여는 열쇠인 이유.",
        "sections": [
          {
            "id": "1.1",
            "title": "인공지능 대규모 모델이란",
            "blocks": [
              {
                "h": "정의와 범위",
                "p": "대규모 모델은 파라미터가 매우 크고 대용량 데이터로 사전학습되며, 프롬프트나 미세조정으로 여러 과제에 적응하는 심층 신경망입니다. 핵심은 ‘크기’ 자체가 아니라 규모가 만드는 창발 능력과 통합 표상입니다."
              },
              {
                "h": "전통 AI 모델과의 차이",
                "p": "전통 모델은 과제 특화·특징 공학 의존이 큽니다. 대규모 모델은 엔드투엔드 표현 학습이 중심이며 한 가중치로 번역·요약·추론 등을 수행합니다. 수학적으로 둘 다 선형 변환과 비선형 조합에 기대지만 스케일이 다릅니다."
              }
            ],
            "lab": null
          },
          {
            "id": "1.2",
            "title": "대규모 모델의 발전 과정",
            "blocks": [
              {
                "h": "기술 토대기 (1950–2017)",
                "p": "퍼셉트론·역전파부터 Word2Vec과 초기 시퀀스 모델까지, 선형대수와 미적분이 학습 가능한 표현 학습의 틀을 만들었습니다."
              },
              {
                "h": "패러다임 돌파기 (2018–2020)",
                "p": "Transformer와 BERT/GPT가 ‘어텐션 + 대규모 사전학습’을 확립했고, 행렬 곱이 계산의 뼈대가 되었습니다."
              },
              {
                "h": "규모 도약기 (2021–현재)",
                "p": "파라미터·데이터·연산이 함께 커지고 멀티모달·디퓨전이 부상했습니다. 최적화 이론과 확률 모델링이 더 중요해졌습니다."
              },
              {
                "h": "도전과 흐름",
                "p": "효율, 정렬, 해석 가능성, 데이터 품질, 에너지. 수학 도구는 ‘학습 가능’에서 ‘제어·검증 가능’으로 이동합니다."
              }
            ],
            "lab": null
          },
          {
            "id": "1.3",
            "title": "응용 분야",
            "blocks": [
              {
                "h": "자연어 처리",
                "p": "언어 모델링은 단어/서브워드 공간에서 조건부 분포 P(token | context)를 학습하는 일입니다."
              },
              {
                "h": "컴퓨터 비전",
                "p": "이미지는 패치 벡터로 잘려 같은 어텐션 구조에 들어가며, 기하와 선형 변환이 여전히 중심입니다."
              },
              {
                "h": "추천 시스템",
                "p": "사용자와 아이템이 같은 임베딩 공간에 놓이고, 유사도는 내적이나 코사인으로 측정됩니다."
              },
              {
                "h": "의료·금융 등 전문 영역",
                "p": "도메인 미세조정과 검색 증강은 손실 곡면, 보정, 불확실성 추정에 대한 이해를 필요로 합니다."
              }
            ],
            "lab": null
          },
          {
            "id": "1.4",
            "title": "수학 기초 개요",
            "blocks": [
              {
                "h": "수학 기초의 중요성",
                "p": "수학 없이도 API는 호출할 수 있습니다. 그러나 실패를 이해하고 구조를 바꾸며 학습을 개선하려면 선형대수·미적분·확률통계로 돌아가야 합니다."
              },
              {
                "h": "핵심 수학 영역",
                "p": "선형대수는 표현과 변환을, 미적분은 학습 동역학을, 확률통계는 불확실성과 생성 목표를 설명합니다."
              },
              {
                "h": "대규모 모델에서의 구체적 활용",
                "p": "임베딩, 어텐션, 레이어 정규화, 손실, 샘플링, 디퓨전 SDE/ODE는 모두 명확한 수학 객체입니다."
              },
              {
                "h": "도전과 발전 방향",
                "p": "고차원 기하, 비볼록 최적화, 유한 표본 일반화, 더 효율적인 행렬 분해와 MoE 라우팅."
              }
            ],
            "lab": "overview"
          }
        ]
      },
      {
        "id": "ch2",
        "num": "02",
        "title": "선형대수 기초",
        "blurb": "벡터·행렬·고유분해 — 모델 가중치의 모국어.",
        "sections": [
          {
            "id": "2.1",
            "title": "벡터 기초",
            "blocks": [
              {
                "h": "기본 개념",
                "p": "벡터는 순서 있는 배열로 방향, 특징, 단어 임베딩을 나타냅니다. 모델에서 각 토큰은 ℝᵈ의 한 점으로 사상됩니다."
              },
              {
                "h": "벡터 공간",
                "p": "덧셈과 스칼라 곱에 닫힌 집합. 의미가 가까운 단어는 관련 부분공간/다양체 근처에 모이는 경우가 많습니다."
              },
              {
                "h": "벡터 연산",
                "p": "덧셈, 스칼라 곱, 내적, 노름, 코사인 유사도. 어텐션 점수는 본질적으로 쿼리와 키의 내적입니다."
              }
            ],
            "lab": "vectors"
          },
          {
            "id": "2.2",
            "title": "행렬 기초",
            "blocks": [
              {
                "h": "표현과 기본 연산",
                "p": "행렬은 선형 사상입니다. 선형층 y = Wx + b는 행렬-벡터 곱과 평행이동입니다."
              },
              {
                "h": "역행렬, 전치, 행렬식",
                "p": "전치는 행·열을 바꾸고, 역행렬은 변환을 되돌리며(존재할 때), 행렬식은 부피 배율·안정성 직관을 줍니다."
              },
              {
                "h": "고유값·고유벡터·분해",
                "p": "고유분해와 SVD는 주방향을 드러냅니다. LoRA·저랭크 적응·압축은 ‘중요한 방향이 저랭크에 모인다’는 직관에 기대입니다."
              }
            ],
            "lab": "matrix"
          }
        ]
      },
      {
        "id": "ch3",
        "num": "03",
        "title": "대규모 모델 속 선형대수",
        "blurb": "행렬 언어를 BERT·GPT·Stable Diffusion에 대응시킵니다.",
        "sections": [
          {
            "id": "3.1",
            "title": "BERT의 선형대수",
            "blocks": [
              {
                "h": "임베딩의 선형대수 관점",
                "p": "임베딩 표는 |V| × d 행렬이고 lookup은 한 행을 고릅니다. 위치 인코딩은 벡터 덧셈으로 겹칩니다."
              },
              {
                "h": "어텐션의 행렬 연산",
                "p": "Q=XW_Q, K=XW_K, V=XW_V; Attention = softmax(QKᵀ/√d) V. 매 단계는 행렬곱과 정규화입니다."
              },
              {
                "h": "사전학습과 미세조정",
                "p": "MLM은 선형 헤드로 어휘에 투영하고, 미세조정은 백본을 고정한 채 분류 헤드나 저랭크 증분만 학습하는 경우가 많습니다."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.2",
            "title": "GPT의 선형대수",
            "blocks": [
              {
                "h": "자기회귀와 행렬",
                "p": "인과 마스크로 어텐션이 하삼각이 되어 위치 t는 ≤ t 정보만 봅니다."
              },
              {
                "h": "디코더의 선형대수",
                "p": "자기 어텐션과 MLP(두 선형 변환 사이 GELU)가 표현을 반복 재구성하고, 마지막에 W_vocab으로 로짓에 사상합니다."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.3",
            "title": "Stable Diffusion의 선형대수",
            "blocks": [
              {
                "h": "디퓨전 과정의 선형 기술",
                "p": "전향 과정은 데이터 벡터에 노이즈를 선형 혼합합니다: x_t = √ᾱ_t x_0 + √(1−ᾱ_t) ε."
              },
              {
                "h": "조건부 생성의 기초",
                "p": "텍스트 조건은 인코더를 거쳐 벡터/시퀀스가 되고, 교차 어텐션 행렬로 U-Net/DiT 중간 표현에 주입됩니다."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch4",
        "num": "04",
        "title": "미적분 기초",
        "blurb": "극한·도함수·적분 — 최적화와 연속 동역학의 언어.",
        "sections": [
          {
            "id": "4.1",
            "title": "함수와 극한",
            "blocks": [
              {
                "h": "함수, 극한, 연속",
                "p": "손실 L(θ)는 파라미터 공간의 함수입니다. 연속·미분 가능성은 기울기로 하강 방향을 가리키게 합니다."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.2",
            "title": "도함수와 미분",
            "blocks": [
              {
                "h": "도함수와 미분",
                "p": "도함수는 국소 선형 근사입니다. 역전파는 계산 그래프 위의 연쇄법칙입니다."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.3",
            "title": "적분",
            "blocks": [
              {
                "h": "정적분과 부정적분",
                "p": "적분은 기댓값, 정규화 상수, 연속시간 디퓨전의 누적 노이즈에 등장합니다. 확률밀도 적분은 1이어야 합니다."
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch5",
        "num": "05",
        "title": "대규모 모델 속 미적분",
        "blurb": "임베딩 매끄러움부터 디퓨전 ODE까지, 학습과 생성 안의 미적분.",
        "sections": [
          {
            "id": "5.1",
            "title": "BERT의 미적분",
            "blocks": [
              {
                "h": "임베딩·어텐션·미세조정",
                "p": "Softmax와 LayerNorm은 미분 가능하며, 기울기는 어텐션 가중치를 통해 흘러 어떤 토큰이 표현을 바꾸는지 결정합니다."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.2",
            "title": "GPT의 미적분",
            "blocks": [
              {
                "h": "자기회귀 최적화",
                "p": "∑ log P(x_t | x_<t) 최대화는 교차 엔트로피 최소화와 같고, Adam 등은 기울기의 1·2차 모멘트를 추적합니다."
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.3",
            "title": "Stable Diffusion의 미적분",
            "blocks": [
              {
                "h": "디퓨전 미적분 분석",
                "p": "연속 극한에서는 SDE/확률류 ODE로 기술되며, 스코어 매칭 목표는 ∇_x log p_t(x)와 연결됩니다."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch6",
        "num": "06",
        "title": "확률·통계 기초",
        "blurb": "무작위성·분포·추론 — 생성 모델 목적함수의 고향.",
        "sections": [
          {
            "id": "6.1",
            "title": "확률론 기초 개념",
            "blocks": [
              {
                "h": "사건, 조건부 확률, 베이즈",
                "p": "P(A|B)=P(B|A)P(A)/P(B). 언어 모델은 이미 본 문맥에서 다음 토큰의 조건부 분포를 계속 계산합니다."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.2",
            "title": "확률변수와 분포",
            "blocks": [
              {
                "h": "대표 분포와 모멘트",
                "p": "베르누이·이항·포아송·정규분포; 기댓값과 분산은 중심과 퍼짐을 나타냅니다. 초기화와 노이즈는 종종 가우스를 가정합니다."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.3",
            "title": "다차원 확률변수",
            "blocks": [
              {
                "h": "결합·주변·공분산",
                "p": "임베딩 차원 간 상관은 표상에 영향을 주고, 다변량 정규는 변분 추론·디퓨전에서 흔한 가정입니다."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.4",
            "title": "모수 추정과 가설검정",
            "blocks": [
              {
                "h": "점추정·구간·검정",
                "p": "최대우도는 학습의 이론적 원형이며, 보정과 A/B 평가는 구간 추정·가설검정 사고를 필요로 합니다."
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch7",
        "num": "07",
        "title": "대규모 모델 속 확률·통계",
        "blurb": "확률 언어를 MLM·자기회귀·디퓨전에 맞춥니다.",
        "sections": [
          {
            "id": "7.1",
            "title": "BERT의 확률·통계",
            "blocks": [
              {
                "h": "마스크와 어텐션의 확률 관점",
                "p": "MLM은 마스크 위치의 조건부 분포를 추정하고, 어텐션 가중치는 value에 대한 이산 확률 혼합입니다."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "7.2",
            "title": "GPT의 확률·통계",
            "blocks": [
              {
                "h": "자기회귀 확률 모델",
                "p": "결합분포는 조건부 곱으로 분해됩니다. 온도·top-k·nucleus sampling은 그 분포의 모양을 바꿉니다."
              }
            ],
            "lab": "probability"
          },
          {
            "id": "7.3",
            "title": "Stable Diffusion의 확률·통계",
            "blocks": [
              {
                "h": "디퓨전과 평가",
                "p": "전향 가산 노이즈는 조건부 가우스 체인을 정의하고, 역과정은 디노이징 분포를 학습합니다. FID·CLIP score도 통계적 거리입니다."
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch8",
        "num": "08",
        "title": "DeepSeek 대규모 모델",
        "blurb": "발전사부터 수학 기초까지: 효율 아키텍처도 같은 수학 위에 있습니다.",
        "sections": [
          {
            "id": "8.1",
            "title": "DeepSeek 발전 과정",
            "blocks": [
              {
                "h": "배경과 제품군",
                "p": "DeepSeek LLM/Coder가 기반을 닦고, V2·V3가 구조 효율을 강화했으며, R1은 추론과 강화학습 경로를 강조합니다."
              },
              {
                "h": "V 시리즈와 R 시리즈",
                "p": "세대마다 ‘같거나 더 나은 능력을 더 낮은 학습/추론 비용으로’를 목표로 하며, 희소 계산·저랭크·더 나은 목적함수로 이어집니다."
              }
            ],
            "lab": null
          },
          {
            "id": "8.2",
            "title": "기술 진화",
            "blocks": [
              {
                "h": "기반부터 V2 / V3 / R1까지",
                "p": "MLA류 어텐션은 저랭크로 KV 캐시를 압축하고, MoE는 전문가로 라우팅하며, R1은 검증 가능한 보상 아래 정책 최적화를 강화합니다."
              }
            ],
            "lab": "matrix"
          },
          {
            "id": "8.3",
            "title": "DeepSeek의 수학 기초",
            "blocks": [
              {
                "h": "선형대수·미적분·확률",
                "p": "저랭크 어텐션은 행렬 분해이고, 학습은 여전히 손실 곡면의 기울기 흐름이며, 언어모델링과 RL은 기대 위험 최소화입니다."
              }
            ],
            "lab": "attention"
          },
          {
            "id": "8.4",
            "title": "미래 전망",
            "blocks": [
              {
                "h": "시사와 방향",
                "p": "아키텍처 혁신은 종종 ‘더 나은 대수 구조로 연산을 바꾼다’는 형태이며, 멀티모달과 더 효율적인 수학 최적화가 다음 국면을 이끌 것입니다."
              }
            ],
            "lab": null
          }
        ]
      }
    ],
    "models": [
      {
        "id": "bert",
        "name": "BERT",
        "tag": "양방향 인코더",
        "math": "마스크 언어모델 + 자기 어텐션 행렬",
        "points": [
          "임베딩 행렬이 이산 토큰을 연속 공간으로 보냅니다",
          "양방향 어텐션: 인과 마스크 없는 QKᵀ",
          "미세조정은 선형 탐침이나 저랭크 적응이 흔합니다"
        ],
        "lab": "attention"
      },
      {
        "id": "gpt",
        "name": "GPT",
        "tag": "자기회귀 생성",
        "math": "조건부 확률 체인 × 인과 어텐션",
        "points": [
          "P(x) = ∏ P(x_t | x_<t)",
          "하삼각 마스크가 시간 인과성을 보장합니다",
          "디코딩은 로짓을 샘플링 분포로 재형성합니다"
        ],
        "lab": "probability"
      },
      {
        "id": "sd",
        "name": "Stable Diffusion",
        "tag": "잠재 디퓨전",
        "math": "가우시안 노이즈 체인 + 스코어/노이즈 예측",
        "points": [
          "x_t는 x_0과 노이즈의 선형 혼합입니다",
          "조건은 교차 어텐션으로 들어갑니다",
          "연속 극한은 SDE/ODE에 대응합니다"
        ],
        "lab": "diffusion"
      },
      {
        "id": "deepseek",
        "name": "DeepSeek",
        "tag": "효율과 추론",
        "math": "저랭크 어텐션, MoE 라우팅, RL 기댓값",
        "points": [
          "행렬 분해로 KV와 연산을 압축합니다",
          "전문가 라우팅은 이산 선택 + 선형 혼합입니다",
          "R 시리즈는 검증 가능 보상 아래 정책 기울기를 강화합니다"
        ],
        "lab": "matrix"
      }
    ]
  },
  "zh": {
    "author": {
      "name": "江南燕",
      "bio": "計算機碩士，在人工智能領域擁有十年實戰經驗，深耕深度學習、大模型等方向。目前專注于提供人工智能相關培訓與諮詢服務，並持續緊跟技術發展前沿。"
    },
    "chapters": [
      {
        "id": "ch1",
        "num": "01",
        "title": "人工智能大模型概覽",
        "blurb": "定義、發展歷程、應用領域，以及為什麼數學是理解大模型的鑰匙。",
        "sections": [
          {
            "id": "1.1",
            "title": "什麼是人工智能大模型",
            "blocks": [
              {
                "h": "定義與範疇",
                "p": "大模型通常指參數量巨大、以大規模資料預訓練、並可透過提示或微調適配多任務的深度神經網路。核心不是「更大」本身，而是規模帶來的湧現能力與統一表示。"
              },
              {
                "h": "與傳統人工智能模型的區別",
                "p": "傳統模型多為任務專用、特徵工程依賴高；大模型則以端到端表示學習為主，同一套權重可服務翻譯、摘要、推理等多任務。數學上，兩者都依賴線性變換與非線性組合，但大模型把高維表示空間推到了前所未有的尺度。"
              }
            ],
            "lab": null
          },
          {
            "id": "1.2",
            "title": "人工智能大模型的發展歷程",
            "blocks": [
              {
                "h": "技術奠基期（1950–2017）",
                "p": "從感知機、反向傳播，到 Word2Vec 與早期序列模型，線性代數與微積分奠定了可訓練的表示學習框架。"
              },
              {
                "h": "範式突破期（2018–2020）",
                "p": "Transformer 與 BERT / GPT 系列確立「注意力 + 大規模預訓練」範式；矩陣乘法成為計算主幹。"
              },
              {
                "h": "規模躍升期（2021 年至今）",
                "p": "參數、資料與算力同步擴張；多模態與擴散模型興起。優化理論與概率建模變得更加關鍵。"
              },
              {
                "h": "挑戰與趨勢",
                "p": "效率、對齊、可解釋性、資料品質與能耗。數學工具從「能訓練」走向「可控制、可驗證」。"
              }
            ],
            "lab": null
          },
          {
            "id": "1.3",
            "title": "人工智能大模型的應用領域",
            "blocks": [
              {
                "h": "自然語言處理",
                "p": "語言建模本質上是在詞／子詞空間上學習條件概率分佈 P(token | context)。"
              },
              {
                "h": "計算機視覺",
                "p": "影像被切成 patch 向量進入同一套注意力機制；幾何與線性變換仍是骨幹。"
              },
              {
                "h": "推薦系統",
                "p": "用戶與物品嵌入在同一向量空間，相似度可用內積或餘弦度量。"
              },
              {
                "h": "醫療、金融等專業領域",
                "p": "領域微調與檢索增強需要理解損失曲面、校準與不確定性估計。"
              }
            ],
            "lab": null
          },
          {
            "id": "1.4",
            "title": "人工智能大模型數學基礎概述",
            "blocks": [
              {
                "h": "數學基礎的重要性",
                "p": "不懂數學也能調用 API；但要理解失敗案例、改進架構與優化訓練，必須回到線性代數、微積分與概率統計。"
              },
              {
                "h": "關鍵數學領域概述",
                "p": "線性代數描述表示與變換；微積分描述學習動態；概率統計描述不確定性與生成目標。"
              },
              {
                "h": "數學在大模型中的具體應用",
                "p": "嵌入、注意力、層歸一化、損失、採樣、擴散 SDE／ODE，皆可寫成明確的數學物件。"
              },
              {
                "h": "挑戰和發展方向",
                "p": "高維幾何、非凸優化、有限樣本泛化，以及更高效的矩陣分解與混合專家路由。"
              }
            ],
            "lab": "overview"
          }
        ]
      },
      {
        "id": "ch2",
        "num": "02",
        "title": "線性代數基礎",
        "blurb": "向量、矩陣、特徵分解——大模型權重運算的母語。",
        "sections": [
          {
            "id": "2.1",
            "title": "向量基礎",
            "blocks": [
              {
                "h": "向量的基本概念",
                "p": "向量是有序數組，可表示方向、特徵或詞嵌入。在模型中，每一個 token 都被映射為 ℝᵈ 中的一點。"
              },
              {
                "h": "向量空間",
                "p": "閉合於加法與純量乘法的集合。語義相近的詞往往落在相近的子空間或流形附近。"
              },
              {
                "h": "向量運算",
                "p": "加法、純量乘、內積、範數與餘弦相似度。注意力分數本質上就是查詢與鍵的內積。"
              }
            ],
            "lab": "vectors"
          },
          {
            "id": "2.2",
            "title": "矩陣基礎",
            "blocks": [
              {
                "h": "矩陣的表示與基本運算",
                "p": "矩陣是線性映射。一層線性層 y = Wx + b 就是矩陣—向量乘法加上平移。"
              },
              {
                "h": "逆矩陣、轉置與行列式",
                "p": "轉置交換行列；逆矩陣還原變換（若存在）；行列式度量體積縮放，常用於穩定性直觀。"
              },
              {
                "h": "特徵值、特徵向量與矩陣分解",
                "p": "特徵分解與 SVD 揭示主方向。LoRA、低秩適配與壓縮都依賴「重要方向集中在低秩子空間」的直覺。"
              }
            ],
            "lab": "matrix"
          }
        ]
      },
      {
        "id": "ch3",
        "num": "03",
        "title": "人工智能大模型中的線性代數",
        "blurb": "把矩陣語言對應到 BERT、GPT 與 Stable Diffusion。",
        "sections": [
          {
            "id": "3.1",
            "title": "BERT 模型中的線性代數",
            "blocks": [
              {
                "h": "詞嵌入的線性代數視角",
                "p": "Embedding 表是 |V| × d 矩陣；lookup 是選取一列向量。位置編碼再以向量加法疊加。"
              },
              {
                "h": "注意力機制的矩陣運算",
                "p": "Q = XW_Q、K = XW_K、V = XW_V；Attention = softmax(QKᵀ / √d) V。每一步都是矩陣乘與按列歸一。"
              },
              {
                "h": "預訓練與微調中的線性代數",
                "p": "MLM 用線性頭投影到詞表；微調常凍結主幹、只訓練分類頭或低秩增量，減少需更新的自由度。"
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.2",
            "title": "GPT 模型中的線性代數",
            "blocks": [
              {
                "h": "自回歸特性與矩陣",
                "p": "因果遮罩使注意力矩陣成為下三角結構，保證位置 t 只能看見 ≤ t 的資訊。"
              },
              {
                "h": "解碼器中的線性代數",
                "p": "堆疊的自注意力與 MLP（兩次線性變換夾 GELU）反覆重塑表示；最後用 W_vocab 映射到 logits。"
              }
            ],
            "lab": "attention"
          },
          {
            "id": "3.3",
            "title": "Stable Diffusion 中的線性代數",
            "blocks": [
              {
                "h": "擴散過程的線性代數描述",
                "p": "前向過程可寫成對資料向量逐步加噪的線性組合：x_t = √ᾱ_t x_0 + √(1−ᾱ_t) ε。"
              },
              {
                "h": "條件生成的基礎",
                "p": "文字條件經編碼器成為向量／序列，以交叉注意力矩陣注入 U-Net／DiT 的中間表示。"
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch4",
        "num": "04",
        "title": "微積分基礎",
        "blurb": "極限、導數與積分——優化與連續動態的語言。",
        "sections": [
          {
            "id": "4.1",
            "title": "函數與極限",
            "blocks": [
              {
                "h": "函數、極限與連續性",
                "p": "損失 L(θ) 是參數空間上的函數。連續與可微假設讓我們能用梯度指出下降方向。"
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.2",
            "title": "導數與微分",
            "blocks": [
              {
                "h": "導數與微分",
                "p": "導數是局部線性近似。反向傳播就是鏈式法則在計算圖上的系統應用。"
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "4.3",
            "title": "積分",
            "blocks": [
              {
                "h": "定積分與不定積分",
                "p": "積分出現在期望、歸一化常數與連續時間擴散的累積噪聲中。概率密度的積分必須為 1。"
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch5",
        "num": "05",
        "title": "人工智能大模型中的微積分",
        "blurb": "從嵌入平滑性到擴散 ODE，看微積分如何進入訓練與生成。",
        "sections": [
          {
            "id": "5.1",
            "title": "BERT 中的微積分",
            "blocks": [
              {
                "h": "嵌入、注意力與微調",
                "p": "Softmax 與 LayerNorm 皆可微；梯度經注意力權重回傳，決定哪些 token 對表示更新貢獻更大。"
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.2",
            "title": "GPT 中的微積分",
            "blocks": [
              {
                "h": "自回歸優化",
                "p": "最大化對數似然 ∑ log P(x_t | x_<t) 等價於最小化交叉熵；Adam 等優化器追蹤梯度的一、二階動量。"
              }
            ],
            "lab": "gradient"
          },
          {
            "id": "5.3",
            "title": "Stable Diffusion 中的微積分",
            "blocks": [
              {
                "h": "擴散的微積分分析",
                "p": "連續極限下可用 SDE／概率流 ODE 描述；分數匹配目標與 ∇_x log p_t(x) 緊密相關。"
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch6",
        "num": "06",
        "title": "概率與統計基礎",
        "blurb": "隨機性、分佈與推斷——生成模型的目標函數來自這裡。",
        "sections": [
          {
            "id": "6.1",
            "title": "概率論的基礎概念",
            "blocks": [
              {
                "h": "隨機事件、條件概率與貝葉斯推理",
                "p": "P(A|B) = P(B|A)P(A)/P(B)。語言模型不斷計算「在已見上文下，下一詞的條件分佈」。"
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.2",
            "title": "隨機變數及其分佈",
            "blocks": [
              {
                "h": "常見分佈與矩",
                "p": "伯努利、二項、泊松、正態；期望與方差描述中心與離散程度。初始化與噪聲常假設高斯。"
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.3",
            "title": "多維隨機變數",
            "blocks": [
              {
                "h": "聯合、邊緣、協方差",
                "p": "嵌入維度之間的相關結構影響表徵；多維正態是變分推斷與擴散的常見假設。"
              }
            ],
            "lab": "probability"
          },
          {
            "id": "6.4",
            "title": "參數估計與假設檢驗",
            "blocks": [
              {
                "h": "點估計、區間與檢驗",
                "p": "最大似然是訓練的理論原型；校準與 A/B 評估需要區間估計與假設檢驗思維。"
              }
            ],
            "lab": null
          }
        ]
      },
      {
        "id": "ch7",
        "num": "07",
        "title": "人工智能大模型中的概率與統計",
        "blurb": "把概率語言對齊到掩碼語言模型、自回歸與擴散生成。",
        "sections": [
          {
            "id": "7.1",
            "title": "BERT 中的概率與統計",
            "blocks": [
              {
                "h": "掩碼與注意力的概率視角",
                "p": "MLM 估計被掩碼位置的條件分佈；注意力權重是對 value 的離散概率混合。"
              }
            ],
            "lab": "attention"
          },
          {
            "id": "7.2",
            "title": "GPT 中的概率與統計",
            "blocks": [
              {
                "h": "自回歸概率模型",
                "p": "聯合分佈分解為條件分佈乘積。溫度、top-k、nucleus sampling 皆在改寫該分佈的形狀。"
              }
            ],
            "lab": "probability"
          },
          {
            "id": "7.3",
            "title": "Stable Diffusion 中的概率與統計",
            "blocks": [
              {
                "h": "擴散與評估",
                "p": "前向加噪定義條件高斯鏈；反向學習去噪分佈。FID、CLIP score 等評估也建立在統計距離上。"
              }
            ],
            "lab": "diffusion"
          }
        ]
      },
      {
        "id": "ch8",
        "num": "08",
        "title": "DeepSeek 大模型",
        "blurb": "從發展歷程到數學基礎：效率架構如何仍建立在同一套數學上。",
        "sections": [
          {
            "id": "8.1",
            "title": "DeepSeek 大模型的發展歷程",
            "blocks": [
              {
                "h": "背景與產品線",
                "p": "DeepSeek LLM / Coder 奠定基礎；隨後 V2、V3 強化架構效率；R1 系列突出推理與強化學習路徑。"
              },
              {
                "h": "版本演進（V 系列與 R 系列）",
                "p": "每一代都在「同等或更優能力下降低訓練／推理成本」上做文章，數學上對應稀疏計算、低秩與更好的優化目標。"
              }
            ],
            "lab": null
          },
          {
            "id": "8.2",
            "title": "DeepSeek 大模型的技術演進",
            "blocks": [
              {
                "h": "從基礎到 V2 / V3 / R1",
                "p": "MLA 等注意力變體用低秩壓縮鍵值緩存；MoE 用路由矩陣選擇專家；R1 則強化可驗證獎勵下的策略優化。"
              }
            ],
            "lab": "matrix"
          },
          {
            "id": "8.3",
            "title": "DeepSeek 中的數學基礎",
            "blocks": [
              {
                "h": "線性代數、微積分與概率",
                "p": "低秩注意力是矩陣分解；訓練仍是損失曲面上的梯度流動；語言建模與 RL 目標仍是期望風險最小化。"
              }
            ],
            "lab": "attention"
          },
          {
            "id": "8.4",
            "title": "未來展望",
            "blocks": [
              {
                "h": "啟示與方向",
                "p": "架構創新往往是「用更好的代數結構換算力」；多模態與更高效率的數學優化將繼續主導下一輪演進。"
              }
            ],
            "lab": null
          }
        ]
      }
    ],
    "models": [
      {
        "id": "bert",
        "name": "BERT",
        "tag": "雙向編碼",
        "math": "掩碼語言模型 + 自注意力矩陣",
        "points": [
          "嵌入矩陣把離散 token 送到連續向量空間",
          "雙向注意力：QKᵀ 無因果遮罩",
          "微調多為線性探測頭或低秩適配"
        ],
        "lab": "attention"
      },
      {
        "id": "gpt",
        "name": "GPT",
        "tag": "自回歸生成",
        "math": "條件概率鏈 × 因果注意力",
        "points": [
          "P(x) = ∏ P(x_t | x_<t)",
          "下三角遮罩保證時間因果性",
          "解碼即對 logits 做概率整形與採樣"
        ],
        "lab": "probability"
      },
      {
        "id": "sd",
        "name": "Stable Diffusion",
        "tag": "潛空間擴散",
        "math": "高斯加噪鏈 + 分數／噪聲預測",
        "points": [
          "x_t 是 x_0 與噪聲的線性組合",
          "條件以交叉注意力注入",
          "連續極限對應 SDE / ODE"
        ],
        "lab": "diffusion"
      },
      {
        "id": "deepseek",
        "name": "DeepSeek",
        "tag": "效率與推理",
        "math": "低秩注意力、MoE 路由、RL 期望優化",
        "points": [
          "用矩陣分解壓縮 KV 與計算",
          "專家路由是離散選擇 + 線性組合",
          "R 系列強化可驗證獎勵下的策略梯度直覺"
        ],
        "lab": "matrix"
      }
    ]
  }
};
