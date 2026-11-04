# GDSC / SMILES → IC50 断网备考包（目标日 10/30）

面向：**会 vibe coding、但断网手写很慌** 的水平。每天约 **60–90 分钟**。  
考试形态假设：Jupyter **无网**，指标 **RMSE + R²**，模型 **RandomForest 回归**，输入 **SMILES**。

## 你怎么用

1. 把整个 `gdsc-exam-prep/` 上传 Google Drive → 用 Colab **下载到本地 / 提前打开**，考试当天当本地笔记。
2. 每天只做当天 notebook：先 **空白格手写**，再对照 `answers/`。
3. 允许本地查笔记时：打印或另开 `cheatsheets/OFFLINE_CHEATSHEET.md`（建议背到能默写）。

## 10 天计划（10/20 → 10/30）

| 天 | 日期建议 | 主题 | 文件 | 通过标准 |
|---|---|---|---|---|
| D1 | 10/20–21 | 考试心智模型：完整流水线一张图 | `notebooks/day01_pipeline_map.ipynb` | 能默写 8 步流水线 |
| D2 | 10/22 | pandas：读表、清洗、merge | `day02_pandas_merge.ipynb` | 无提示写出三表 merge |
| D3 | 10/23 | SMILES → 特征（无 RDKit 版） | `day03_smiles_features.ipynb` | 写出 `smiles_to_fp` |
| D4 | 10/24 | 指标：RMSE / R² 手算 + sklearn | `day04_metrics.ipynb` | 默写公式与 3 行代码 |
| D5 | 10/25 | KFold 交叉验证手写循环 | `day05_cross_validation.ipynb` | 空 notebook 写出完整 CV |
| D6 | 10/26 | RandomForestRegressor 整段 API | `day06_random_forest.ipynb` | 默写 fit/predict + 关键参数 |
| D7 | 10/27 | 串起来：SMILES→IC50 完整脚本 | `day07_full_pipeline.ipynb` | 45 分钟内独立写完 |
| D8 | 10/28 | **90 分钟计时模考**（空白卷） | `day08_mock_exam_BLANK.ipynb` | 能跑出 RMSE/R² |
| D9 | 10/29 | 错题回炉 + 必背卡默写 | `day09_weak_spots.ipynb` | 必背卡 0 翻答案 |
| D10 | 10/30 考前 | 轻量复盘（只看卡，不学新） | `cheatsheets/` | 冷静开卷 |

## 目录

```
gdsc-exam-prep/
  data/                 # 合成 GDSC 风格小表（可离线）
  notebooks/            # 每日练习（含空白格）
  answers/              # 参考答案 notebook
  cheatsheets/          # 断网必背 + Google Slides 大纲
  scripts/              # 生成数据脚本
```

## 生成 / 刷新练习数据

```bash
python scripts/make_synthetic_data.py
```

## 每日训练法（重要）

1. **合上答案**，在空白 cell 里从 `import` 开始写。
2. 卡住 **超过 3 分钟** → 看必背卡一行提示 → 再写。
3. 跑通后，删掉自己的代码，再默写一遍（同一天第二次更快）。
4. 不要复制粘贴 vibe 出来的长代码；考试要的是 **短、稳、能跑**。

## 考试当天推荐开场顺序（90 min 假设）

1. 读题，确认列名 / 目标列 / 是否要 CV（5 min）
2. 读 CSV + 清洗 + merge（15 min）
3. SMILES → 特征矩阵 X，y = IC50（15 min）
4. KFold + RandomForest + 记 RMSE/R²（40 min）
5. 检查 shape、NaN、打印均值指标（15 min）
