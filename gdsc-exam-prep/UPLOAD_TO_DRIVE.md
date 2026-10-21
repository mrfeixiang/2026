# 上传 Google Drive / 离线 Colab 清单

把整个文件夹 `gdsc-exam-prep/` 上传到 Drive。建议结构：

```
MyDrive/gdsc-exam-prep/
  README.md
  data/
  notebooks/
  answers/          # 平时练完再看；模考当天别打开
  cheatsheets/
```

## Colab 用法（有网练）

1. Drive 里右键 notebook → 用 Google Colaboratory 打开  
2. 或 Colab 里：

```python
from google.colab import drive
drive.mount('/content/drive')
%cd /content/drive/MyDrive/gdsc-exam-prep/notebooks
```

## 断网考试准备

1. **提前**把以下文件下载到电脑本地（不要考试当天才下）：
   - `cheatsheets/OFFLINE_CHEATSHEET.md`（导出 PDF 最好）
   - `notebooks/MASTER_OFFLINE_TEMPLATE.ipynb`
   - `data/` 整夹（练手用；考试会给真数据）
2. 把 `GOOGLE_SLIDES_OUTLINE.md` 复制进 Google 幻灯片 → **文件 → 下载 → PDF**，本地可开。
3. 若允许本地查笔记：只留「必背卡 + 万能模板」两页，避免翻太多反而慌。

## 把你以前的 vibe 代码也放进来

在 Drive 建 `my_old_code/`，上传旧 notebook。  
任务：从旧代码里 **抽出不超过 40 行** 的「能跑核心」，对照本包模板，删掉 vibe 出来的冗余。
