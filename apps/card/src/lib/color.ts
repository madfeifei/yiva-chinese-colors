const DARK = "#241f19";
const LIGHT = "#fffdf8";

function channels(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable ink for a swatch: whichever of dark/light has the higher contrast. */
export function contrast(hex: string): string {
  const l = luminance(hex);
  const vsDark = (l + 0.05) / (luminance(DARK) + 0.05);
  const vsLight = 1.05 / (l + 0.05);
  return vsDark >= vsLight ? DARK : LIGHT;
}

export function rgbString(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function hslString(hsl: [number, number, number]): string {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

export function oklchString(oklch: [number, number, number]): string {
  return `oklch(${oklch[0]} ${oklch[1]} ${oklch[2]})`;
}

export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy path
    }
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
