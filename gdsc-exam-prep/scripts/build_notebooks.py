"""Build practice + answer notebooks for GDSC IC50 exam prep."""
from pathlib import Path

import nbformat as nbf

ROOT = Path(__file__).resolve().parents[1]
NB = ROOT / "notebooks"
ANS = ROOT / "answers"


def md(text: str):
    return nbf.v4.new_markdown_cell(text)


def code(text: str):
    return nbf.v4.new_code_cell(text)


def write_nb(path: Path, cells):
    nb = nbf.v4.new_notebook()
    nb["cells"] = cells
    nb["metadata"] = {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        nbf.write(nb, f)
    print("wrote", path)


def day01():
    write_nb(
        NB / "day01_pipeline_map.ipynb",
        [
            md("# Day1：流水线地图（不写模型，先建立脑内导航）\n\n目标：合上答案，默写出完整 8 步。"),
            md("## 任务 A：按顺序填空（用中文或英文关键字）"),
            code(
                "# 1. ____\n# 2. ____\n# 3. ____\n# 4. ____\n# 5. ____\n# 6. ____\n# 7. ____\n# 8. ____"
            ),
            md("## 任务 B：解释为什么不能直接把 SMILES 字符串丢进 RandomForest"),
            code("# 你的解释：\n"),
            md("## 任务 C：画出数据流（用注释）\nsensitivity + compounds + cell_lines → ? → X,y → ? → metrics"),
            code(
                """# sensitivity --(merge drug_id)--> +compounds
#           --(merge cell_id)--> +cell_lines
#           --(smiles_to_fp)--> X
# IC50 ------------------------> y
# KFold(RF) ------------------> RMSE, R2
"""
            ),
        ],
    )
    write_nb(
        ANS / "day01_answers.ipynb",
        [
            md("# Day1 答案"),
            code(
                """# 1. 读 CSV
# 2. 清洗（dropna / drop_duplicates）
# 3. merge 三表
# 4. SMILES -> 特征矩阵 X
# 5. 取 y = IC50
# 6. KFold 划分
# 7. 每折 RandomForest fit/predict
# 8. 计算并汇总 RMSE / R2

# B: SMILES 是字符串，RF 需要数值矩阵；必须先 fingerprint / 描述符化。
"""
            ),
        ],
    )


def day02():
    blank = [
        md("# Day2：pandas 读表 / 清洗 / merge\n\n数据在 `../data/`。禁止复制答案，卡住再看 tips。"),
        code(
            """from pathlib import Path
import pandas as pd

DATA = Path("../data")
# TODO: 读入 compounds.csv, cell_lines.csv, sensitivity.csv
"""
        ),
        code(
            """# TODO: 去掉 IC50 缺失；去掉完全重复行；打印 shape
"""
        ),
        code(
            """# TODO: sensitivity merge compounds (drug_id) 再 merge cell_lines (cell_id)
# 最终应包含 smiles 与 IC50
"""
        ),
        code(
            """# TODO: 检查 smiles 是否还有 NaN；显示前 5 行
"""
        ),
    ]
    write_nb(NB / "day02_pandas_merge.ipynb", blank)

    write_nb(
        ANS / "day02_answers.ipynb",
        [
            md("# Day2 答案"),
            code(
                """from pathlib import Path
import pandas as pd

DATA = Path("../data")
compounds = pd.read_csv(DATA / "compounds.csv")
cell_lines = pd.read_csv(DATA / "cell_lines.csv")
sensitivity = pd.read_csv(DATA / "sensitivity.csv")

sensitivity = sensitivity.dropna(subset=["IC50"]).drop_duplicates()
print(sensitivity.shape)

df = sensitivity.merge(compounds, on="drug_id", how="inner").merge(
    cell_lines, on="cell_id", how="inner"
)
print(df.shape, df["smiles"].isna().sum())
df.head()
"""
            ),
        ],
    )


def day03():
    write_nb(
        NB / "day03_smiles_features.ipynb",
        [
            md("# Day3：SMILES → 特征（无 RDKit）"),
            code(
                """import numpy as np
import pandas as pd
from pathlib import Path

df = pd.read_csv(Path("../data") / "merged_raw.csv").dropna(subset=["IC50", "smiles"]).drop_duplicates()

# TODO: 实现 smiles_to_fp(smiles, n_bits=32)
def smiles_to_fp(smiles, n_bits=32):
    raise NotImplementedError

# TODO: 构造 X, y 并打印 X.shape, y.shape
"""
            ),
        ],
    )
    write_nb(
        ANS / "day03_answers.ipynb",
        [
            md("# Day3 答案"),
            code(
                """import numpy as np
import pandas as pd
from pathlib import Path

df = pd.read_csv(Path("../data") / "merged_raw.csv").dropna(subset=["IC50", "smiles"]).drop_duplicates()

def smiles_to_fp(smiles, n_bits=32):
    vec = np.zeros(n_bits)
    tokens = list("CNOSF=#()[]123cno") + ["Cl", "Br"]
    for i, tok in enumerate(tokens):
        vec[i % n_bits] += str(smiles).count(tok)
    vec[-1] = len(str(smiles))
    return vec

X = np.vstack([smiles_to_fp(s) for s in df["smiles"]])
y = df["IC50"].values
print(X.shape, y.shape)
"""
            ),
        ],
    )


def day04():
    write_nb(
        NB / "day04_metrics.ipynb",
        [
            md("# Day4：RMSE 与 R²\n\n先手写公式，再用 sklearn 验证。"),
            code(
                """import numpy as np
from sklearn.metrics import mean_squared_error, r2_score

y_true = np.array([1.0, 2.0, 3.0, 4.0])
y_pred = np.array([1.1, 1.8, 3.2, 3.7])

# TODO: 纯 numpy 计算 rmse, r2
"""
            ),
            code(
                """# TODO: 用 sklearn 再算一遍，确认一致
"""
            ),
        ],
    )
    write_nb(
        ANS / "day04_answers.ipynb",
        [
            md("# Day4 答案"),
            code(
                """import numpy as np
from sklearn.metrics import mean_squared_error, r2_score

y_true = np.array([1.0, 2.0, 3.0, 4.0])
y_pred = np.array([1.1, 1.8, 3.2, 3.7])

rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
ss_res = np.sum((y_true - y_pred) ** 2)
ss_tot = np.sum((y_true - y_true.mean()) ** 2)
r2 = 1 - ss_res / ss_tot
print(rmse, r2)
print(np.sqrt(mean_squared_error(y_true, y_pred)), r2_score(y_true, y_pred))
"""
            ),
        ],
    )


def day05():
    write_nb(
        NB / "day05_cross_validation.ipynb",
        [
            md("# Day5：手写 KFold 循环（先用假数据）"),
            code(
                """import numpy as np
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

rng = np.random.default_rng(0)
X = rng.normal(size=(40, 8))
y = X[:, 0] * 0.5 + rng.normal(scale=0.2, size=40)

# TODO: 5-fold CV，收集 rmse/r2，打印均值
"""
            ),
        ],
    )
    write_nb(
        ANS / "day05_answers.ipynb",
        [
            md("# Day5 答案"),
            code(
                """import numpy as np
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

rng = np.random.default_rng(0)
X = rng.normal(size=(40, 8))
y = X[:, 0] * 0.5 + rng.normal(scale=0.2, size=40)

kf = KFold(n_splits=5, shuffle=True, random_state=42)
rmses, r2s = [], []
for tr, te in kf.split(X):
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X[tr], y[tr])
    pred = model.predict(X[te])
    rmses.append(np.sqrt(mean_squared_error(y[te], pred)))
    r2s.append(r2_score(y[te], pred))
print(np.mean(rmses), np.mean(r2s))
"""
            ),
        ],
    )


def day06():
    write_nb(
        NB / "day06_random_forest.ipynb",
        [
            md("# Day6：RandomForest API 默写\n\n不看文档写出：创建 → fit → predict → 可选 feature_importances_"),
            code(
                """import numpy as np
from sklearn.ensemble import RandomForestRegressor

X = np.random.randn(30, 5)
y = np.random.randn(30)

# TODO
"""
            ),
        ],
    )
    write_nb(
        ANS / "day06_answers.ipynb",
        [
            md("# Day6 答案"),
            code(
                """import numpy as np
from sklearn.ensemble import RandomForestRegressor

X = np.random.randn(30, 5)
y = np.random.randn(30)

model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X, y)
pred = model.predict(X)
print(pred[:5])
print(model.feature_importances_)
"""
            ),
        ],
    )


def day07():
    write_nb(
        NB / "day07_full_pipeline.ipynb",
        [
            md(
                "# Day7：完整 SMILES→IC50（限时 45 分钟）\n\n从空 cell 写到打印 mean RMSE / mean R²。\n数据：`../data/compounds.csv` 等三表。"
            ),
            code("# 从 import 开始写完整脚本\n"),
        ],
    )
    write_nb(
        ANS / "day07_answers.ipynb",
        [
            md("# Day7 答案：完整 pipeline"),
            code(
                """from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error, r2_score

DATA = Path("../data")
compounds = pd.read_csv(DATA / "compounds.csv")
cell_lines = pd.read_csv(DATA / "cell_lines.csv")
sensitivity = pd.read_csv(DATA / "sensitivity.csv")

df = (
    sensitivity.dropna(subset=["IC50"])
    .drop_duplicates()
    .merge(compounds, on="drug_id", how="inner")
    .merge(cell_lines, on="cell_id", how="inner")
    .dropna(subset=["smiles"])
)

def smiles_to_fp(smiles, n_bits=32):
    vec = np.zeros(n_bits)
    tokens = list("CNOSF=#()[]123cno") + ["Cl", "Br"]
    for i, tok in enumerate(tokens):
        vec[i % n_bits] += str(smiles).count(tok)
    vec[-1] = len(str(smiles))
    return vec

X = np.vstack([smiles_to_fp(s) for s in df["smiles"]])
y = df["IC50"].values

kf = KFold(n_splits=5, shuffle=True, random_state=42)
rmses, r2s = [], []
for tr, te in kf.split(X):
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X[tr], y[tr])
    pred = model.predict(X[te])
    rmses.append(np.sqrt(mean_squared_error(y[te], pred)))
    r2s.append(r2_score(y[te], pred))

print("mean RMSE:", float(np.mean(rmses)))
print("mean R2:", float(np.mean(r2s)))
"""
            ),
        ],
    )


def day08():
    write_nb(
        NB / "day08_mock_exam_BLANK.ipynb",
        [
            md(
                """# Day8：90 分钟模考（空白卷）

## 题目（模拟南教授）

给定三张表（路径自己写）：
- `compounds.csv`: drug_id, drug_name, smiles
- `cell_lines.csv`: cell_id, cell_name, tissue
- `sensitivity.csv`: drug_id, cell_id, IC50

要求：
1. 合并并清洗数据
2. 用 SMILES 构造特征（可用任意合理数值化方法）
3. 5-fold cross validation + RandomForestRegressor
4. 报告平均 **RMSE** 与平均 **R²**

规则：断网；可看本地笔记；不要打开 `answers/`。

开始计时。
"""
            ),
            code(""),
            code(""),
            code(""),
        ],
    )


def day09():
    write_nb(
        NB / "day09_weak_spots.ipynb",
        [
            md(
                """# Day9：错题回炉

根据 Day8 模考，勾选你卡住的点，只重练勾选部分：

- [ ] merge 键 / how
- [ ] dropna 时机
- [ ] smiles_to_fp
- [ ] KFold 循环结构
- [ ] RMSE 写法（sqrt）
- [ ] R² 解读

然后：**默写必背卡第 6 节完整模板**（不看文件）。
"""
            ),
            code("# 默写完整 CV + RF 模板\n"),
            md("对照 `../cheatsheets/OFFLINE_CHEATSHEET.md` 第 6 节，标红差异。"),
        ],
    )


def main():
    day01()
    day02()
    day03()
    day04()
    day05()
    day06()
    day07()
    day08()
    day09()


if __name__ == "__main__":
    main()
