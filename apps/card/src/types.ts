export type ColourMatch = {
  name: string;
  hex: string;
  deltaE: number | null;
};

export type Bilingual = { zh: string; en: string };

export type ChineseColor = {
  slug: string;
  name: string;
  pinyin: string;
  enName: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  oklch: [number, number, number];
  family: string;
  familyEn: string;
  system: "classical" | "solar";
  systemCode: string;
  systemName: string;
  credibility: string;
  css: ColourMatch;
  pantone: ColourMatch;
  meaning: Bilingual;
  origin: Bilingual;
  citation: Bilingual;
  caution: string | null;
  term: string | null;
  termEn: string | null;
  termIndex: number | null;
  season: string | null;
  seasonEn: string | null;
  role: string | null;
  roleEn: string | null;
  phenology: string | null;
  story: string | null;
};

export type Dataset = {
  meta: {
    name: string;
    nameZh: string;
    version: string;
    generatedAt: string;
    count: number;
    counts: {
      classical: number;
      solar: number;
      solarTerms: number;
      families: number;
    };
    families: string[];
    familyLabels: Record<string, string>;
    sources: string[];
    disclaimer: string;
    sampleNote: string;
    license: { data: string; licenseUrl: string; code: string; attribution: string };
  };
  colors: ChineseColor[];
};
