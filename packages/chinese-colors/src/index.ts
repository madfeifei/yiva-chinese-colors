/**
 * @yiva/chinese-colors — open sample
 * ---------------------------------------------------------------------------
 * 33 traditional Chinese colours: 9 classical anchors (one per family) and the
 * 24 solar-term opening colours (起色).
 *
 * The full library — 161 colours, all four roles (起/承/转/合) for every solar
 * term — lives at https://yivadigital.com/colors.
 *
 * Each colour carries HEX/RGB/HSL/OKLCH values, the nearest CSS and Pantone
 * matches (with perceptual ΔE), provenance and bilingual cultural notes.
 *
 * Data: CC BY 4.0 · Code: MIT · https://yivadigital.com/colors
 *
 * `data.json` is generated from `data/sample.json` by
 * `node scripts/build-package-data.mjs`.
 */
import dataset from "./data.json";

export interface Bilingual {
  zh: string;
  en: string;
}

/** A nearest-match reference to an international colour standard. */
export interface ColourMatch {
  name: string;
  hex: string;
  /** OKLab perceptual distance from the traditional colour (0 = identical). */
  deltaE: number | null;
}

export type ColourFamily = "赤" | "黄" | "绿" | "青" | "蓝" | "紫" | "白" | "黑" | "褐";
export type ColourSystem = "classical" | "solar";

export interface ChineseColor {
  /** Stable kebab-case id, unique across the library (e.g. "huang-bai-you"). */
  slug: string;
  /** Chinese colour name, e.g. 黄白游. */
  name: string;
  pinyin: string;
  enName: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  oklch: [number, number, number];
  family: ColourFamily;
  familyEn: string;
  system: ColourSystem;
  systemCode: string;
  systemName: string;
  credibility: string;
  css: ColourMatch;
  pantone: ColourMatch;
  meaning: Bilingual;
  origin: Bilingual;
  citation: Bilingual;
  caution: string | null;
  /** Solar-term fields — null for classical colours. */
  term: string | null;
  termEn: string | null;
  termIndex: number | null;
  season: string | null;
  seasonEn: string | null;
  role: string | null;
  roleEn: string | null;
  phenology: string | null;
  story: string | null;
}

export interface ChineseColorMeta {
  name: string;
  nameZh: string;
  version: string;
  generatedAt: string;
  count: number;
  counts: { classical: number; solar: number; solarTerms: number; families: number };
  families: string[];
  familyLabels: Record<string, string>;
  systems: Record<string, string>;
  license: { data: string; licenseUrl: string; code: string; attribution: string };
  sources: string[];
  disclaimer: string;
  sampleNote: string;
  provenance: unknown;
}

const data = dataset as unknown as { meta: ChineseColorMeta; colors: ChineseColor[] };

/** Dataset metadata (counts, license, sources, disclaimer). */
export const meta: ChineseColorMeta = data.meta;

/** All 33 sample colours: 9 classical first, then the 24 solar-term colours. */
export const colors: ChineseColor[] = data.colors;

export const families: string[] = data.meta.families;

export default colors;

// ----------------------------------------------------------------- helpers ---

/** Normalise any hex-ish string to `#RRGGBB` (upper-case); returns "" if invalid. */
export function normalizeHex(input: string): string {
  let h = String(input || "").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  return /^[0-9a-f]{6}$/i.test(h) ? "#" + h.toUpperCase() : "";
}

/** The CSS custom-property name for a colour (`--cn-<slug>`). */
export function cssVariable(color: ChineseColor | string): string {
  const slug = typeof color === "string" ? color : color.slug;
  return `--cn-${slug}`;
}

/** Find a colour by its Chinese name (exact), pinyin or English name (case-insensitive). */
export function byName(name: string): ChineseColor | undefined {
  const q = String(name || "").trim();
  if (!q) return undefined;
  const lower = q.toLowerCase();
  return (
    colors.find((c) => c.name === q) ||
    colors.find((c) => c.pinyin.toLowerCase() === lower) ||
    colors.find((c) => c.enName.toLowerCase() === lower)
  );
}

/** Find a colour by its slug id. */
export function bySlug(slug: string): ChineseColor | undefined {
  return colors.find((c) => c.slug === slug);
}

/** Find a colour by hex value (accepts `#abc`, `abc`, `#AABBCC`). */
export function byHex(hex: string): ChineseColor | undefined {
  const n = normalizeHex(hex);
  if (!n) return undefined;
  return colors.find((c) => normalizeHex(c.hex) === n);
}

/** All colours of a family — accepts the Chinese glyph (赤) or English label (Red). */
export function byFamily(family: string): ChineseColor[] {
  const f = String(family || "").trim();
  return colors.filter((c) => c.family === f || c.familyEn.toLowerCase() === f.toLowerCase());
}

/** The sample colour for a solar term (e.g. 立春 or "Start of Spring"). */
export function byTerm(term: string): ChineseColor[] {
  const t = String(term || "").trim();
  return colors.filter((c) => c.term === t || c.termEn?.toLowerCase() === t.toLowerCase());
}

/**
 * Free-text search across name, pinyin, English name, family, solar term and hex.
 * Multi-token queries are AND-ed (every token must match). Results are ranked by
 * where the match occurs and returned up to `limit` entries.
 */
export function search(query: string, limit = 20): ChineseColor[] {
  const tokens = String(query || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored: { c: ChineseColor; score: number }[] = [];
  for (const c of colors) {
    const hay = [c.name, c.pinyin, c.enName, c.family, c.familyEn, c.systemName, c.term, c.termEn, c.slug, c.hex]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      if (!hay.includes(t)) {
        ok = false;
        break;
      }
      if (c.name === t || c.slug === t || normalizeHex(c.hex).toLowerCase() === t) score += 100;
      else if (c.name.toLowerCase().includes(t) || c.enName.toLowerCase().includes(t)) score += 20;
      else score += 5;
    }
    if (ok) scored.push({ c, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.c);
}

/** Ready-to-use `:root { … }` CSS custom-property block for the sample. */
export function toCss(selector = ":root"): string {
  const lines = colors.map((c) => `  ${cssVariable(c)}: ${c.hex}; /* ${c.name}${c.enName ? " · " + c.enName : ""} */`);
  return `${selector}{\n${lines.join("\n")}\n}`;
}
