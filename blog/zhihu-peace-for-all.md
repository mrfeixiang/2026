# 优衣库 T 恤背面印了段能跑的 Bash：我把它拆开，又做了个「antibody love vhh」版

逛优衣库时，如果你翻到一件米色的 **PEACE FOR ALL** 联名 Tee，背面可能不是普通印花，而是一整面 **能在终端里跑的代码**。

开头是熟悉的 shebang：

```bash
#!/bin/bash
eval "$(base64 -d <<< '……一大坨 Base64……')"
```

对，真的是 `eval` + `base64`。街上卖的衣服，长得像运维脚本，也像黑客彩蛋。我把它跑通了，做成了网页动画，还按同一套路重制了一版口号：**antibody love vhh**。

在线体验（可直接点开）：

- 原版动画：https://mrfeixiang.github.io/2026/peace-for-all.html  
- 重制版：https://mrfeixiang.github.io/2026/antibody-love-vhh.html  

---

## 这件衣服是谁做的？

联名方是 **Akamai Technologies**（CDN / 网络安全 / 云厂商）和 **UNIQLO** 的慈善系列 **PEACE FOR ALL**。

据 Akamai 新闻稿，设计语言大致是这样：

- **米色** → 致敬早期电脑的「beige box」塑料机箱  
- **正面花括号里的心** → 互联网也可以被用于善意  
- **背面真实可跑的 Linux/Bash** → 开源语言把工程师、品牌和用户连在一起  

PEACE FOR ALL 从 2022 年启动，利润捐赠给 UNHCR、Plan International、Save the Children 等。公开数据里，截至 2025 年 1 月已售出逾 660 万件、募得超过约 1280 万美元。

所以这不是「程序员梗周边」那么简单：它是公益 Tee，碰巧把黑客美学做得特别到位。

新闻稿：https://www.akamai.com/newsroom/press-release/uniqlo-adds-new-akamai-tshirt-to-peace-for-all-collection

---

## 代码到底在干什么？

外层包装可以读成一句话：

> 把一段脚本锁进 Base64 信封，打开信封，立刻执行。

这在运维里很常见（打包、投递）；在黑客文化里也很常见——**一眼看不透，一跑就明白**。

解码之后，惊喜其实很温柔。注释里写着：

> Congratulations! You found the easter egg!  
> おめでとうございます！隠されたサプライズを見つけました！

然后它会：

1. 用 `tput` 读终端宽高，藏起光标  
2. 用 `bc` 算正弦，让字符横向「波浪」摆动  
3. 用 256 色 ANSI，从青色（12）渐变到橙色（208）  
4. 无限循环画出：`♥PEACE♥FOR♥ALL♥…`  
5. Ctrl+C 时恢复光标，干净退出  

更妙的是印花本身：Base64 乱码里，有一串 **橙色高亮字母**，按阅读顺序正好拼出 **PEACE FOR ALL**。  
程序、图形、口号，叠在同一层布料上。

---

## 我怎么复现 / 重制的？

原版我整理成了可跑脚本（需要 `bash`、`tput`、`bc`）：

```bash
# 仓库里
./peace-animation/akamai-peace-for-all.sh
# 或 T 恤同款包装
./peace-animation/akamai-peace-for-all-shirt.sh
```

然后按同一配方，把文案换成：

```text
♥ANTIBODY♥LOVE♥VHH♥…
```

色相改成青绿 → 玫红，同样保留 Base64 信封和橙色高亮拼字。网页版用 Canvas 复刻同一套正弦数学，不装 `bc` 也能看动画。

如果你只想「看一眼效果」，直接打开上面的 GitHub Pages 链接就行；想自己改口号，把 `text=` 那一行换掉即可。

仓库：https://github.com/mrfeixiang/2026

---

## 这算什么艺术？

我会把它放进几条相邻的线：

- **Code as fashion / wearable source**：源码不是说明书附图，而是视觉主体  
- **ANSI / ASCII art**：字符即像素，终端即画布  
- **Demoscene**：极小程序做出很大视觉冲击  
- **IOCCC（混乱 C 代码大赛）**：故意难读，但读通之后觉得美  
- **Net.art / glitch、代码诗**：界面、噪声、语法，都可以是材质  

Akamai 这件 Tee 的特殊点在于：**零售货架遇见了黑客彩蛋**。你不需要去地下派对或读论文，优衣库货架上就能摸到一段能跑的 Bash。

---

## 写在最后

和平口号被锁进 Base64，再被正弦波一笔一笔画出来——技术在这里不是炫技，更像一句悄声说出来的祝福。

如果你也拆过这件衣服、跑通过这段脚本，或者想用自己的一句话重制一版，欢迎评论区贴结果。  
我的两个在线版本也欢迎随便玩、随便 fork。

（安全提醒：网上随手复制的 `eval "$(base64 …)"` 请先解码再跑；这件官方 Tee 的 payload 是善意彩蛋，不代表所有长得像它的脚本都安全。）
