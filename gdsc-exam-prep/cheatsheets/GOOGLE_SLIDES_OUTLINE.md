# Google Slides 大纲（复制到幻灯片，约 12 页）

每页只放标题 + 3–5 行。考试当天可本地打开 PDF。

---

## Slide 1 — 考试目标
- 输入：SMILES（化合物）
- 输出：IC50（连续值 → 回归）
- 模型：RandomForestRegressor
- 指标：RMSE ↓ 好，R² ↑ 好（接近 1）

## Slide 2 — 为什么要 merge
- GDSC 常拆成：化合物表 / 细胞系表 / 药敏表
- 药敏表只有 id + IC50
- 必须 join 才拿到 smiles

## Slide 3 — Merge 口诀
- `sensitivity.merge(compounds, on="drug_id")`
- 再 `.merge(cell_lines, on="cell_id")`
- `how="inner"`：两边都有才留

## Slide 4 — 清洗清单
- `dropna(subset=["IC50"])`
- `drop_duplicates()`
- 检查 `df.shape` 与 `df["smiles"].isna().sum()`

## Slide 5 — SMILES 不是数字
- 模型吃的是矩阵 X
- 必须把字符串变成向量（fingerprint / 计数特征）
- 一行 SMILES → 一行特征向量

## Slide 6 — 无 RDKit 特征（稳）
- 字符/片段计数 + 长度
- `np.vstack([...])` 得到 X
- `y = df["IC50"].values`

## Slide 7 — RMSE
- 预测差了多少的「平均平方根」
- 和 IC50 同单位，越小越好
- `np.sqrt(mean_squared_error(y, yhat))`

## Slide 8 — R²
- 解释了多少方差
- 1 完美，0 等于猜均值，负=比猜均值还差
- `r2_score(y, yhat)`

## Slide 9 — 为什么 Cross Validation
- 单次 train/test 看运气
- KFold：轮流当测试集
- 报告各折均值更诚实

## Slide 10 — CV 循环骨架
- `for train_idx, test_idx in kf.split(X):`
- 只在 train 上 fit
- 在 test 上 predict + 记指标

## Slide 11 — RandomForest 最小参数
- `n_estimators=100`
- `random_state=42`
- `fit` → `predict`

## Slide 12 — 考试开场顺序
- 读题 → 清洗 merge → 特征 → CV+RF → 打印 RMSE/R²
