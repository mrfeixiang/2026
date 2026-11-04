# 断网必背卡（打印 / 放本地笔记）

考试只靠这张卡也能拼出完整答案。每天睡前默写一遍。

---

## 1. 完整流水线（必须能默写）

```
读表 → 去重/去NaN → merge → SMILES转特征X → y=IC50
→ KFold → 每折 fit RF → predict → RMSE/R² → 汇总均值
```

---

## 2. Imports（一次性背熟）

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error, r2_score
```

---

## 3. pandas 高频

```python
df = pd.read_csv("xxx.csv")
df = df.dropna(subset=["IC50"])
df = df.drop_duplicates()
df = df.merge(compounds, on="drug_id", how="inner")
df = df.merge(cell_lines, on="cell_id", how="inner")
df.shape, df.columns, df.head()
```

Merge 记忆口诀：**左表.merge(右表, on=键, how="inner")**

---

## 4. SMILES → 特征（无 RDKit，考试最稳）

```python
def smiles_to_fp(smiles, n_bits=32):
    vec = np.zeros(n_bits)
    tokens = list("CNOSF=#()[]123cno") + ["Cl", "Br"]
    for i, tok in enumerate(tokens):
        vec[i % n_bits] += str(smiles).count(tok)
    vec[-1] = len(str(smiles))
    return vec

X = np.vstack([smiles_to_fp(s) for s in df["smiles"]])
y = df["IC50"].values
```

若老师要求 RDKit Morgan（有库才用）：

```python
from rdkit import Chem
from rdkit.Chem import AllChem
def smiles_to_fp(s):
    m = Chem.MolFromSmiles(s)
    if m is None:
        return np.zeros(2048)
    fp = AllChem.GetMorganFingerprintAsBitVect(m, 2, nBits=2048)
    return np.array(fp)
```

---

## 5. 指标公式（口算也能说）

- **MSE** = mean( (y - yhat)^2 )
- **RMSE** = sqrt(MSE)
- **R²** = 1 - SS_res / SS_tot  
  SS_res = sum( (y - yhat)^2 )  
  SS_tot = sum( (y - y.mean())^2 )

```python
rmse = mean_squared_error(y_true, y_pred) ** 0.5
# 新版也可: mean_squared_error(y_true, y_pred, squared=False)  # 旧API
# sklearn 1.4+: root_mean_squared_error(...)
r2 = r2_score(y_true, y_pred)
```

兼容写法（最稳，不依赖版本）：

```python
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
r2 = r2_score(y_true, y_pred)
```

---

## 6. KFold + RandomForest（核心模板）

```python
kf = KFold(n_splits=5, shuffle=True, random_state=42)
rmses, r2s = [], []

for train_idx, test_idx in kf.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    rmses.append(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2s.append(r2_score(y_test, y_pred))

print("RMSE:", np.mean(rmses), "R2:", np.mean(r2s))
```

---

## 7. 常见报错速查

| 报错/现象 | 原因 | 修法 |
|---|---|---|
| `KeyError` | 列名写错 | `df.columns` |
| `ValueError: Input contains NaN` | y 或 X 有空 | `dropna` |
| merge 后行数暴涨 | 键不唯一 | `drop_duplicates` |
| R² 很负 | 特征废/泄漏反了 | 检查 X/y，别用测试信息 |
| `smiles` 全 NaN | merge 键不对 | 先 `head()` 看 drug_id |

---

## 8. 90 分钟时间盒

| 分钟 | 做什么 |
|---|---|
| 0–5 | 读题、列名、要不要 CV |
| 5–20 | 读表清洗 merge |
| 20–35 | SMILES→X，取 y |
| 35–75 | KFold + RF + 指标 |
| 75–90 | 打印结果、修 bug |

---

## 9. 一句话理解「为什么这么折」

老师测的不是 fancy 模型，而是你能否 **独立把数据变成可训练矩阵，并用 CV 诚实报告误差**。Vibe coding 跳过的正是这中间每一步的命名、形状和泄漏。
