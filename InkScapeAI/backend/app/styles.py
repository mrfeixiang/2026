"""Style catalog for InkScape AI.

Each style bundles:
  - display metadata (id, name_zh, name_en)
  - a text-to-image prompt (used when a real generator is configured)
  - local-stylization parameters (used by the Pillow fallback)
  - curated fallback poems / titles / seal text (used when GPT is off)

IMPORTANT (originality): prompts describe *aesthetic traditions*, never
"reproduce painting X" or "in the style of living artist Y". We borrow the
visual language of a genre, not any specific copyrighted work.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass(frozen=True)
class StyleLocalParams:
    """Parameters that drive the local Pillow ink-stylization fallback."""
    paper: str = "#efe7d3"           # rice-paper base
    ink: str = "#1a1a1a"             # darkest ink tone
    saturation: float = 0.0          # 0 = monochrome ink, 1 = full color
    contrast: float = 1.35
    edge_strength: float = 0.55      # ink-line emphasis
    wash: float = 0.65               # how much soft ink wash to blend
    tint: str | None = None          # optional overall color wash (hex)
    grain: float = 0.12              # paper grain amount


@dataclass(frozen=True)
class Style:
    id: str
    name_zh: str
    name_en: str
    prompt: str
    local: StyleLocalParams = field(default_factory=StyleLocalParams)
    titles: List[str] = field(default_factory=list)     # 题字 candidates
    poems: List[str] = field(default_factory=list)       # 落款诗 (\n between lines)
    seal: str = "墨境"                                   # 印章 text (1-4 chars)


STYLES: Dict[str, Style] = {
    "ink": Style(
        id="ink",
        name_zh="水墨山水",
        name_en="Ink-Wash Landscape",
        prompt=(
            "traditional Chinese ink-wash landscape painting (shanshui), "
            "misty mountains, flowing water, generous negative space (liubai), "
            "soft brush gradients on xuan paper, monochrome black ink"
        ),
        local=StyleLocalParams(saturation=0.0, wash=0.7, edge_strength=0.5),
        titles=["山高水长", "云山无尽", "空谷幽兰", "溪山清远"],
        poems=[
            "空山新雨后，\n天气晚来秋。",
            "行到水穷处，\n坐看云起时。",
            "青山看不厌，\n流水趣何长。",
        ],
        seal="墨境",
    ),
    "green": Style(
        id="green",
        name_zh="青绿山水",
        name_en="Blue-Green Landscape",
        prompt=(
            "traditional Chinese blue-green landscape painting (qinglu shanshui), "
            "layered malachite green and azurite blue mineral pigments, "
            "gold outlines, majestic mountains and rivers, decorative and luminous"
        ),
        local=StyleLocalParams(
            saturation=0.55, wash=0.5, edge_strength=0.45,
            tint="#2e6f5e", paper="#f2ead6",
        ),
        titles=["千里江山", "碧水丹山", "江山如画", "山青水远"],
        poems=[
            "日出江花红胜火，\n春来江水绿如蓝。",
            "青山横北郭，\n白水绕东城。",
            "两岸青山相对出，\n孤帆一片日边来。",
        ],
        seal="江山",
    ),
    "gongbi": Style(
        id="gongbi",
        name_zh="工笔花鸟",
        name_en="Gongbi Flower-and-Bird",
        prompt=(
            "traditional Chinese gongbi fine-line painting, flowers and birds, "
            "meticulous outlines, layered translucent color washes, elegant, "
            "delicate botanical detail on silk"
        ),
        local=StyleLocalParams(
            saturation=0.7, wash=0.4, edge_strength=0.7,
            contrast=1.25, paper="#f5efe0",
        ),
        titles=["花开富贵", "鸟语花香", "国色天香", "春满枝头"],
        poems=[
            "接天莲叶无穷碧，\n映日荷花别样红。",
            "感时花溅泪，\n恨别鸟惊心。",
            "花间一壶酒，\n独酌无相亲。",
        ],
        seal="清趣",
    ),
    "dunhuang": Style(
        id="dunhuang",
        name_zh="敦煌壁画",
        name_en="Dunhuang Mural",
        prompt=(
            "Dunhuang cave-mural aesthetic, flying apsaras and flowing ribbons, "
            "earthy mineral pigments, ochre red and lapis, aged wall texture, "
            "ornamental halos and swirling clouds"
        ),
        local=StyleLocalParams(
            saturation=0.6, wash=0.55, edge_strength=0.5,
            tint="#8a4b2f", paper="#e6d4b0", grain=0.2,
        ),
        titles=["飞天曼舞", "大漠佛光", "千年一梦", "梵音入画"],
        poems=[
            "大漠孤烟直，\n长河落日圆。",
            "劝君更尽一杯酒，\n西出阳关无故人。",
            "羌笛何须怨杨柳，\n春风不度玉门关。",
        ],
        seal="敦煌",
    ),
    "figure": Style(
        id="figure",
        name_zh="古风人物",
        name_en="Classical Figure",
        prompt=(
            "traditional Chinese figure painting (renwu hua), graceful robed "
            "figure, flowing line-drawing (baimiao), subtle color, poetic and "
            "serene, classical hanfu"
        ),
        local=StyleLocalParams(
            saturation=0.35, wash=0.55, edge_strength=0.6, paper="#f0e8d6",
        ),
        titles=["清风入袖", "陌上花开", "月下独立", "红尘一梦"],
        poems=[
            "云想衣裳花想容，\n春风拂槛露华浓。",
            "众里寻他千百度，\n蓦然回首，那人却在灯火阑珊处。",
            "人生若只如初见，\n何事秋风悲画扇。",
        ],
        seal="风雅",
    ),
    "anime": Style(
        id="anime",
        name_zh="中国动漫",
        name_en="Chinese Animation",
        prompt=(
            "original hand-painted Chinese animation background aesthetic, "
            "warm gouache colors, soft light, poetic scenery, gentle and "
            "nostalgic mood (original style, no copyrighted characters)"
        ),
        local=StyleLocalParams(
            saturation=0.85, wash=0.3, edge_strength=0.4,
            contrast=1.15, paper="#f4efe3",
        ),
        titles=["夏日物语", "微风轻语", "故乡的云", "少年心事"],
        poems=[
            "绿树阴浓夏日长，\n楼台倒影入池塘。",
            "儿童急走追黄蝶，\n飞入菜花无处寻。",
            "最是一年春好处，\n绝胜烟柳满皇都。",
        ],
        seal="童心",
    ),
}

DEFAULT_STYLE = "ink"


def get_style(style_id: str) -> Style:
    return STYLES.get(style_id, STYLES[DEFAULT_STYLE])


def list_styles() -> List[dict]:
    return [
        {
            "id": s.id,
            "name_zh": s.name_zh,
            "name_en": s.name_en,
            "seal": s.seal,
        }
        for s in STYLES.values()
    ]
