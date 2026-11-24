# @yiva/chinese-colors

**An open sample of the Chinese Colour Library** — 33 traditional Chinese colours:
9 classical anchors (one per family) and the 24 solar-term opening colours (起色).

Every colour ships with:

- `hex`, `rgb`, `hsl`, `oklch`
- the nearest **CSS** and **Pantone** matches, each with a perceptual **ΔE** (OKLab distance)
- bilingual (`zh` / `en`) meaning, origin and the **classical citation** the colour comes from
- a `family` (赤/黄/绿/青/蓝/紫/白/黑/褐) and, for solar terms, the `term` / `season` / `role`

> Data: **CC BY 4.0** · Code: **MIT**. Pantone/CSS values are *nearest approximations*, not official references.

The **full 161-colour library** (24 solar terms × 4 roles) lives at <https://yivadigital.com/colors>.

---

## Install

```bash
npm install @yiva/chinese-colors
```

## Usage

```ts
import {
  colors, meta,
  byName, bySlug, byHex, byFamily, byTerm, search,
  cssVariable, toCss, normalizeHex,
} from "@yiva/chinese-colors";

colors.length;            // 33
meta.counts;              // { classical: 9, solar: 24, solarTerms: 24, families: 9 }

byName("黄白游");          // solar colour, hex #FFF799
byName("Cinnabar");       // classical 朱砂
byHex("#c3272b");         // 赤
byFamily("赤");            // all reds (accepts "Red" too)
byTerm("立春");            // the sample colour for Start of Spring
search("spring yellow");  // ranked free-text search
toCss();                  // :root { --cn-<slug>: #…; }
```

Each entry looks like:

```jsonc
{
  "slug": "huang-bai-you",
  "name": "黄白游",
  "pinyin": "Huáng Bái Yóu",
  "enName": "Yellow-White Drift",
  "hex": "#FFF799",
  "rgb": [255, 247, 153],
  "hsl": [55, 100, 80],
  "oklch": [0.962, 0.116, 104.1],
  "family": "黄",
  "system": "solar",
  "term": "立春",
  "role": "起色",
  "css": { "name": "khaki", "hex": "#F0E68C", "deltaE": 0.0489 },
  "pantone": { "name": "elfin yellow", "hex": "#eeea97", "deltaE": 0.0422 },
  "meaning": { "zh": "", "en": "…" },
  "origin": { "zh": "", "en": "…" },
  "citation": { "zh": "…", "en": "…" }
}
```

## Stylesheet and data files

```ts
import "@yiva/chinese-colors/chinese-colors.css";
// --cn-<slug> custom properties for all 33 colours

import data from "@yiva/chinese-colors/data.json";
// { meta, colors }
```

`chinese-colors.csv` is included for spreadsheets and design tooling.

## Regenerating the data

The package is built from the repository's `data/sample.json`:

```bash
node scripts/build-package-data.mjs
npm run build -w @yiva/chinese-colors
```

## Licence

- **Code** — MIT
- **Data** — CC BY 4.0 · Attribution: *Chinese Colour Library — YIVA Digital (https://yivadigital.com/colors)*

Pantone is a trademark of Pantone LLC. Values are nearest perceptual matches from an unofficial
community dataset and must not be presented as official Pantone references.
