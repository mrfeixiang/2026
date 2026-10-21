# antibody love vhh — PEACE FOR ALL style terminal easter egg

Recreates the Uniqlo × Akamai **PEACE FOR ALL** t-shirt bash easter egg, then remakes it for **antibody love vhh**.

## What the shirt does

```bash
#!/bin/bash
eval "$(base64 -d <<< '...')"
```

Decoded, it draws a sine-wave of characters across the terminal in a cyan→orange (or teal→rose) 256-color gradient.

## Run in a terminal

Needs `bash`, `tput`, and `bc`.

```bash
# Original PEACE FOR ALL animation
./akamai-peace-for-all.sh

# Same animation for antibody love vhh
./antibody-love-vhh.sh

# Shirt-style obfuscated wrappers (base64 + eval)
./akamai-peace-for-all-shirt.sh
./antibody-love-vhh-shirt.sh
```

Press `Ctrl+C` to restore the cursor and exit.

## Browser version

- [`../peace-for-all.html`](../peace-for-all.html) — **原版** Uniqlo × Akamai PEACE FOR ALL
- [`../antibody-love-vhh.html`](../antibody-love-vhh.html) — remake for antibody love vhh

Live on GitHub Pages: https://mrfeixiang.github.io/2026/peace-for-all.html
