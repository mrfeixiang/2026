"""Generate tiny GDSC-like tables for offline SMILES -> IC50 practice."""
from pathlib import Path

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)
OUT = Path(__file__).resolve().parents[1] / "data"


def simple_fp(smiles: str, n_bits: int = 32) -> np.ndarray:
    """Deterministic bag-of-tokens fingerprint (no RDKit needed)."""
    vec = np.zeros(n_bits, dtype=np.float64)
    tokens = [
        "C",
        "N",
        "O",
        "S",
        "F",
        "Cl",
        "Br",
        "=",
        "#",
        "(",
        ")",
        "[",
        "]",
        "1",
        "2",
        "3",
        "@",
        "+",
        "-",
        "c",
        "n",
        "o",
    ]
    for i, tok in enumerate(tokens):
        vec[i % n_bits] += smiles.count(tok)
    vec[n_bits - 1] = len(smiles)
    return vec


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    compounds = pd.DataFrame(
        [
            {"drug_id": 1, "drug_name": "DrugA", "smiles": "CCO"},
            {"drug_id": 2, "drug_name": "DrugB", "smiles": "c1ccccc1"},
            {"drug_id": 3, "drug_name": "DrugC", "smiles": "CC(=O)Oc1ccccc1C(=O)O"},
            {"drug_id": 4, "drug_name": "DrugD", "smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C"},
            {"drug_id": 5, "drug_name": "DrugE", "smiles": "CC(C)Cc1ccc(cc1)C(C)C(=O)O"},
            {"drug_id": 6, "drug_name": "DrugF", "smiles": "C1CCCCC1"},
            {"drug_id": 7, "drug_name": "DrugG", "smiles": "Nc1ncnc2nccnc12"},
            {"drug_id": 8, "drug_name": "DrugH", "smiles": "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12"},
        ]
    )

    cell_lines = pd.DataFrame(
        [
            {"cell_id": 101, "cell_name": "A549", "tissue": "lung"},
            {"cell_id": 102, "cell_name": "MCF7", "tissue": "breast"},
            {"cell_id": 103, "cell_name": "HCT116", "tissue": "colon"},
            {"cell_id": 104, "cell_name": "PC3", "tissue": "prostate"},
            {"cell_id": 105, "cell_name": "A375", "tissue": "skin"},
        ]
    )

    rows = []
    for _, drug in compounds.iterrows():
        fp = simple_fp(drug["smiles"])
        base = 1.5 + 0.08 * fp.sum()
        for _, cell in cell_lines.iterrows():
            tissue_shift = {"lung": 0.2, "breast": -0.1, "colon": 0.0, "prostate": 0.3, "skin": -0.2}[
                cell["tissue"]
            ]
            # ~80% coverage like sparse GDSC screens
            if RNG.random() < 0.2:
                continue
            ic50 = base + tissue_shift + RNG.normal(0, 0.25)
            rows.append(
                {
                    "drug_id": drug["drug_id"],
                    "cell_id": cell["cell_id"],
                    "IC50": round(float(ic50), 4),
                }
            )

    sensitivity = pd.DataFrame(rows)

    # Intentionally messy duplicates / NaN for cleaning drills
    sensitivity.loc[0, "IC50"] = np.nan
    sensitivity = pd.concat([sensitivity, sensitivity.iloc[[1]]], ignore_index=True)

    compounds.to_csv(OUT / "compounds.csv", index=False)
    cell_lines.to_csv(OUT / "cell_lines.csv", index=False)
    sensitivity.to_csv(OUT / "sensitivity.csv", index=False)

    # Pre-merged practice table (optional shortcut path)
    merged = sensitivity.merge(compounds, on="drug_id", how="inner").merge(
        cell_lines, on="cell_id", how="inner"
    )
    merged.to_csv(OUT / "merged_raw.csv", index=False)

    print(f"Wrote tables to {OUT}")
    print(f"sensitivity rows={len(sensitivity)}, compounds={len(compounds)}, cells={len(cell_lines)}")


if __name__ == "__main__":
    main()
