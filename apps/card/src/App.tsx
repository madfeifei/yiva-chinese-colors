import { useEffect, useMemo, useState } from "react";
import { colors, CRED_EN, FAMILIES, FAMILY_EN, meta, REPO, ROLE_EN, SITE } from "./data";
import type { ChineseColor } from "./types";
import { contrast, copyText, hslString, oklchString, rgbString } from "./lib/color";

type Lang = "en" | "cn";

const STR = {
  en: {
    kicker: "China Colour Intelligence · Open Source",
    title: "Chinese Color Card",
    sub: "Traditional Chinese colour names — poetic, text-anchored, and bridged to CSS and Pantone. Every entry carries its system of origin and a credibility grade.",
    search: "Search name / pinyin / HEX",
    all: "All",
    showing: (a: number, b: number) => `Showing ${a} of ${b} colours in the open sample.`,
    full: "Full 161-colour library",
    github: "GitHub",
    colours: "colours",
    terms: "solar terms",
    families: "families",
    classical: "Classical name",
    solar: "Solar-term colour",
    meaning: "Meaning",
    origin: "Origin",
    citation: "Classical citation",
    caution: "Caution",
    values: "Values",
    matches: "Nearest matches",
    css: "CSS",
    pantone: "Pantone (approx.)",
    copy: "Copy HEX",
    copied: "Copied",
    open: "Read the full entry",
    sampleNote: "Open sample entry — the full library includes all four roles (起/承/转/合) for every solar term and 161 colours in total.",
    footer: "An open sample of the Chinese Colour Library by YIVA Digital.",
    dataLicence: "Data CC BY 4.0",
    codeLicence: "Code MIT",
    sources: "Sources & method",
    disclaimer: "Pantone and CSS matches are approximate (OKLab). Traditional colours have no single standard value.",
    lang: "中文",
    close: "Close",
    colourFamily: "Family",
    system: "System",
    credibility: "Credibility",
    termsCount: "solar terms",
  },
  cn: {
    kicker: "中国色彩智能 · 开源精选",
    title: "中国传统色卡",
    sub: "中国传统色名——诗意命名、文献可溯，并桥接 CSS 与 Pantone。每一色均标注体系来源与证据等级。",
    search: "搜索色名 / 拼音 / HEX",
    all: "全部",
    showing: (a: number, b: number) => `开源精选共 ${b} 色，当前显示 ${a} 色。`,
    full: "完整 161 色色库",
    github: "GitHub",
    colours: "色",
    terms: "节气",
    families: "色系",
    classical: "古典色名",
    solar: "节气色",
    meaning: "意象",
    origin: "来源",
    citation: "古籍出处",
    caution: "注意",
    values: "色值",
    matches: "最接近的匹配",
    css: "CSS",
    pantone: "Pantone（近似）",
    copy: "复制 HEX",
    copied: "已复制",
    open: "查看完整词条",
    sampleNote: "开源精选词条——完整色库包含每个节气的起/承/转/合四色，共 161 色。",
    footer: "YIVA Digital 中国传统色库的开源精选版本。",
    dataLicence: "数据 CC BY 4.0",
    codeLicence: "代码 MIT",
    sources: "来源与方法",
    disclaimer: "Pantone 与 CSS 为近似匹配（OKLab）。传统色无唯一标准色值。",
    lang: "EN",
    close: "关闭",
    colourFamily: "色系",
    system: "体系",
    credibility: "证据等级",
    termsCount: "节气",
  },
} as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string) => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(text);
    window.setTimeout(() => setCopied((cur) => (cur === text ? null : cur)), 1500);
  };
  return { copied, copy };
}

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [q, setQ] = useState("");
  const [fam, setFam] = useState<string | null>(null);
  const [selected, setSelected] = useState<ChineseColor | null>(null);
  const t = STR[lang];
  const en = lang === "en";

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return colors
      .filter((c) => !fam || c.family === fam)
      .filter((c) => {
        if (!needle) return true;
        return [c.name, c.pinyin, c.enName, c.hex, c.slug, c.term, c.termEn, c.role, c.roleEn, c.familyEn, c.systemName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle);
      });
  }, [q, fam]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [selected]);

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href={SITE} target="_blank" rel="noreferrer">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="brand-name">
            YIVA <span>Digital</span>
          </span>
        </a>
        <nav className="topnav">
          <a href={`${SITE}/colors`} target="_blank" rel="noreferrer" className="site-link">
            {t.full} <ArrowIcon />
          </a>
          <a href={REPO} target="_blank" rel="noreferrer">
            {t.github} <ArrowIcon />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-top">
              <div className="kicker">{t.kicker}</div>
              <button className="lang" onClick={() => setLang(en ? "cn" : "en")} aria-label="Switch language">
                {t.lang}
              </button>
            </div>
            <h1>{t.title}</h1>
            <p className="sub">{t.sub}</p>
            <div className="stats">
              <span>
                <b>{colors.length}</b> {t.colours}
              </span>
              <span>
                <b>{meta.counts.solarTerms}</b> {t.terms}
              </span>
              <span>
                <b>{meta.counts.families}</b> {t.families}
              </span>
              <span className="licence-pill">CC BY 4.0</span>
            </div>
          </div>
        </section>

        <section className="toolbar" aria-label="Filters">
          <label className="search">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.search}
              type="search"
              aria-label={t.search}
            />
          </label>
          <div className="chips">
            <button className={"chip" + (fam === null ? " on" : "")} onClick={() => setFam(null)}>
              {t.all} · {colors.length}
            </button>
            {FAMILIES.map((f) => (
              <button
                key={f}
                className={"chip" + (fam === f ? " on" : "")}
                onClick={() => setFam(fam === f ? null : f)}
                aria-pressed={fam === f}
              >
                {en ? FAMILY_EN[f] : `${f}色`}
              </button>
            ))}
          </div>
        </section>

        <section className="grid" aria-live="polite">
          {list.map((c) => (
            <ColorCard key={c.slug} color={c} lang={lang} onOpen={() => setSelected(c)} />
          ))}
        </section>

        {list.length === 0 && <p className="empty">{en ? "No colours match that search." : "没有匹配的颜色。"}</p>}

        <p className="note">{t.showing(list.length, colors.length)}</p>

        <section className="open-band">
          <div>
            <div className="kicker">{en ? "Open data" : "开放数据"}</div>
            <h2>{en ? "Use the library in your own work" : "把这套色库用在你自己的项目里"}</h2>
            <p>
              {en
                ? "The sample ships as JSON, CSS variables and a typed npm package. Code is MIT; the 33-colour sample is CC BY 4.0. Attribution: Chinese Colour Library — YIVA Digital."
                : "精选数据提供 JSON、CSS 变量与带类型的 npm 包。代码 MIT，33 色精选数据 CC BY 4.0。署名：Chinese Colour Library — YIVA Digital。"}
            </p>
          </div>
          <div className="band-links">
            <a className="button" href={REPO} target="_blank" rel="noreferrer">
              {t.github} <ArrowIcon />
            </a>
            <a className="button ghost" href={`${SITE}/colors`} target="_blank" rel="noreferrer">
              {t.full} <ArrowIcon />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <div className="brand-name small">
            YIVA <span>Digital</span>
          </div>
          <p>{t.footer}</p>
        </div>
        <div className="footer-meta">
          <span>{t.dataLicence}</span>
          <span>{t.codeLicence}</span>
          <a href={`${SITE}/colors`} target="_blank" rel="noreferrer">
            yivadigital.com/colors <ArrowIcon />
          </a>
        </div>
        <details className="sources">
          <summary>{t.sources}</summary>
          <ul>
            {meta.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p>{t.disclaimer}</p>
        </details>
      </footer>

      {selected && <ColorDetail color={selected} lang={lang} onClose={() => setSelected(null)} t={t} />}
    </div>
  );
}

function ColorCard({ color: c, lang, onOpen }: { color: ChineseColor; lang: Lang; onOpen: () => void }) {
  const en = lang === "en";
  const { copied, copy } = useCopy();
  const ink = contrast(c.hex);
  return (
    <article className="card">
      <div className="swatch" style={{ background: c.hex, color: ink }}>
        <span className="hex">{c.hex}</span>
        <span className="sys">{c.system === "solar" ? (en ? c.termEn || c.term : c.term) : en ? "Classical" : "古典"}</span>
        <button
          className={"copy" + (copied ? " done" : "")}
          style={{ color: ink }}
          onClick={(e) => {
            e.stopPropagation();
            void copy(c.hex);
          }}
          aria-label={`Copy ${c.hex}`}
          title={copied ? (en ? "Copied" : "已复制") : en ? "Copy HEX" : "复制 HEX"}
        >
          <CopyIcon />
        </button>
      </div>
      <button className="card-body" onClick={onOpen} aria-label={`${c.name} details`}>
        <span className="c-name">{c.name}</span>
        <span className="c-py">{c.pinyin}</span>
        <span className="c-en">{c.enName}</span>
        <span className="c-foot">
          <span className="c-fam">{en ? c.familyEn : c.family}</span>
          {c.role && <span className="c-term">{en ? ROLE_EN[c.role] || c.role : c.role}</span>}
        </span>
      </button>
    </article>
  );
}

function ColorDetail({
  color: c,
  lang,
  onClose,
  t,
}: {
  color: ChineseColor;
  lang: Lang;
  onClose: () => void;
  t: (typeof STR)["en"] | (typeof STR)["cn"];
}) {
  const en = lang === "en";
  const { copied, copy } = useCopy();
  const ink = contrast(c.hex);
  const pick = (b: { zh: string; en: string }) => (en ? b.en || b.zh : b.zh || b.en);
  const rows: Array<[string, string]> = [
    ["HEX", c.hex],
    ["RGB", rgbString(c.rgb)],
    ["HSL", hslString(c.hsl)],
    ["OKLCH", oklchString(c.oklch)],
  ];
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="sheet-head" style={{ background: c.hex, color: ink }}>
          <div>
            <span className="sheet-hex">{c.hex}</span>
            <span className="sheet-sys">{c.system === "solar" ? (en ? c.termEn || c.term : c.term) : en ? "Classical name" : "古典色名"}</span>
          </div>
          <button className="close" style={{ color: ink }} onClick={onClose} aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        <div className="sheet-body">
          <div className="sheet-title">
            <h2 id="detail-title">{c.name}</h2>
            <span className="sheet-py">{c.pinyin}</span>
            <span className="sheet-en">{c.enName}</span>
          </div>

          <div className="badges">
            <span>{c.system === "solar" ? t.solar : t.classical}</span>
            <span>
              {t.colourFamily} · {en ? c.familyEn : c.family}
            </span>
            {c.role && <span>{en ? c.roleEn || ROLE_EN[c.role] || c.role : c.role}</span>}
            {c.credibility && <span>{en ? CRED_EN[c.credibility] || c.credibility : c.credibility}</span>}
          </div>

          <div className="sheet-grid">
            <section>
              <h3>{t.values}</h3>
              <dl className="values">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <button className="button small" onClick={() => void copy(c.hex)}>
                <CopyIcon /> {copied ? t.copied : t.copy}
              </button>
            </section>

            <section>
              <h3>{t.matches}</h3>
              <div className="match">
                <div className="match-chip" style={{ background: c.css.hex }} />
                <div>
                  <div className="match-k">{t.css}</div>
                  <div className="match-v">
                    {c.css.name} · {c.css.hex}
                  </div>
                  <div className="match-d">ΔE {c.css.deltaE?.toFixed(3) ?? "—"}</div>
                </div>
              </div>
              <div className="match">
                <div className="match-chip" style={{ background: c.pantone.hex }} />
                <div>
                  <div className="match-k">{t.pantone}</div>
                  <div className="match-v">
                    {c.pantone.name} · {c.pantone.hex}
                  </div>
                  <div className="match-d">ΔE {c.pantone.deltaE?.toFixed(3) ?? "—"}</div>
                </div>
              </div>
            </section>
          </div>

          {pick(c.meaning) && (
            <section className="prose">
              <h3>{t.meaning}</h3>
              <p>{pick(c.meaning)}</p>
            </section>
          )}
          {pick(c.origin) && (
            <section className="prose">
              <h3>{t.origin}</h3>
              <p>{pick(c.origin)}</p>
            </section>
          )}
          {pick(c.citation) && (
            <section className="prose cite">
              <h3>{t.citation}</h3>
              <p>{pick(c.citation)}</p>
            </section>
          )}
          {c.caution && (
            <section className="prose caution">
              <h3>{t.caution}</h3>
              <p>{c.caution}</p>
            </section>
          )}

          <p className="sample-note">{t.sampleNote}</p>

          <a className="button wide" href={`${SITE}/colors/${c.slug}`} target="_blank" rel="noreferrer">
            {t.open} <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
