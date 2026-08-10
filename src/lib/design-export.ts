import { baseImage, collarImage } from "@/components/designer/PhotoMockup";
import type { NeckCut, Sport, Template, View } from "@/components/designer/JerseyCanvas";

export interface ExportProps {
  sport: Sport;
  cut: NeckCut;
  template?: Template;
  jerseyColor: string;
  sleeveColor: string;
  bodySecondary?: string;
  trimColor: string;
  collarColor?: string;
  shortsColor?: string;
  teamName: string;
  playerName: string;
  number: string;
  fontFront: string;
  fontBack: string;
  teamNameSize: number;
  playerNameSize: number;
  numberSize: number;
  teamNameColor: string;
  playerNameColor: string;
  numberColor: string;
}

const S = 1000;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function newCanvas() {
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  return c;
}

/** Draw a mask image "contain"-fitted, matching the CSS mask-size: contain behaviour. */
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const r = Math.min(S / img.width, S / img.height);
  const w = img.width * r;
  const h = img.height * r;
  ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
}

type Clip = { inset: [number, number, number, number] } | { polygon: [number, number][] } | null;

/** Paint a fill (solid or gradient callback) restricted to a clip area and masked by an image. */
function zone(
  mask: HTMLImageElement,
  paint: (ctx: CanvasRenderingContext2D) => void,
  clip: Clip,
) {
  const c = newCanvas();
  const ctx = c.getContext("2d")!;
  ctx.save();
  if (clip && "inset" in clip) {
    const [t, r, b, l] = clip.inset.map((v) => (v / 100) * S);
    ctx.beginPath();
    ctx.rect(l, t, S - l - r, S - t - b);
    ctx.clip();
  } else if (clip && "polygon" in clip) {
    ctx.beginPath();
    clip.polygon.forEach(([x, y], i) => {
      const px = (x / 100) * S;
      const py = (y / 100) * S;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.clip();
  }
  paint(ctx);
  ctx.restore();
  ctx.globalCompositeOperation = "destination-in";
  drawContain(ctx, mask);
  return c;
}

const solid = (color: string) => (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, S, S);
};

const vGradient = (a: string, b: string) => (ctx: CanvasRenderingContext2D) => {
  const g = ctx.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
};

/** Renders the same composition as <PhotoMockup /> onto a canvas. */
export async function renderMockupCanvas(p: ExportProps, view: View) {
  const src = baseImage(p.sport, p.cut, view);
  const collarSrc = collarImage(p.sport, p.cut, view);
  const [base, mask, collarMask] = await Promise.all([
    loadImage(src),
    loadImage(src),
    loadImage(collarSrc),
  ]);

  const out = newCanvas();
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);

  const isSet = p.sport === "basket";
  const gradient = p.template === "gradient";
  const raglan = p.template === "raglan";
  const bodyPaint = gradient
    ? vGradient(p.jerseyColor, p.bodySecondary ?? p.sleeveColor)
    : solid(p.jerseyColor);

  ctx.drawImage(zone(mask, bodyPaint, null), 0, 0);

  if (isSet) {
    ctx.drawImage(zone(mask, solid(p.shortsColor ?? "#000000"), { inset: [51, 0, 0, 0] }), 0, 0);
    ctx.drawImage(zone(mask, solid(p.trimColor), { inset: [46.5, 0, 50.5, 0] }), 0, 0);
    if (!gradient) {
      ctx.drawImage(zone(mask, solid(p.sleeveColor), { inset: [5, 82, 56, 0] }), 0, 0);
      ctx.drawImage(zone(mask, solid(p.sleeveColor), { inset: [5, 0, 56, 82] }), 0, 0);
    }
    ctx.drawImage(zone(mask, solid(p.trimColor), { inset: [54, 88, 6, 0] }), 0, 0);
    ctx.drawImage(zone(mask, solid(p.trimColor), { inset: [54, 0, 6, 88] }), 0, 0);
  } else {
    const left: [number, number][] = raglan
      ? [[0, 4], [44, 6], [30, 22], [27, 47], [0, 47]]
      : [[0, 4], [31, 9], [27, 47], [0, 47]];
    const right: [number, number][] = raglan
      ? [[100, 4], [56, 6], [70, 22], [73, 47], [100, 47]]
      : [[100, 4], [69, 9], [73, 47], [100, 47]];
    ctx.drawImage(zone(mask, solid(p.sleeveColor), { polygon: left }), 0, 0);
    ctx.drawImage(zone(mask, solid(p.sleeveColor), { polygon: right }), 0, 0);
  }

  ctx.drawImage(zone(collarMask, solid(p.collarColor ?? p.trimColor), null), 0, 0);

  // Real photo in multiply keeps folds and shadows
  ctx.globalCompositeOperation = "multiply";
  const r = Math.min(S / base.width, S / base.height);
  ctx.drawImage(base, (S - base.width * r) / 2, (S - base.height * r) / 2, base.width * r, base.height * r);
  ctx.globalCompositeOperation = "source-over";

  // Lettering (SVG viewBox is 500 → scale x2)
  const k = 2;
  const text = (
    value: string,
    y: number,
    size: number,
    font: string,
    weight: string,
    fill: string,
    stroke: number,
    spacing: string,
  ) => {
    ctx.save();
    ctx.font = `${weight} ${size * k}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = spacing;
    ctx.fillStyle = fill;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = stroke * k;
    ctx.strokeText(value, 250 * k, y * k);
    ctx.fillText(value, 250 * k, y * k);
    ctx.restore();
  };

  if (view === "front" && p.teamName) {
    text(
      p.teamName.toUpperCase().slice(0, 14),
      isSet ? 175 : 235,
      p.teamNameSize * (isSet ? 0.55 : 0.9),
      p.fontFront,
      "800",
      p.teamNameColor,
      1.2,
      "4px",
    );
  }
  if (view === "back") {
    if (p.playerName) {
      text(
        p.playerName.toUpperCase().slice(0, 14),
        isSet ? 140 : 185,
        p.playerNameSize * (isSet ? 0.5 : 0.85),
        p.fontBack,
        "700",
        p.playerNameColor,
        1,
        "6px",
      );
    }
    if (p.number) {
      text(
        p.number.slice(0, 2),
        isSet ? 240 : 340,
        p.numberSize * (isSet ? 0.45 : 0.8),
        p.fontBack,
        "900",
        p.numberColor,
        2.5,
        "0px",
      );
    }
  }

  return out;
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const slug = (s: string) =>
  (s || "uniforme").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
  "uniforme";

/** Front + back side by side on a single PNG. */
export async function downloadDesignPng(p: ExportProps) {
  const [front, back] = await Promise.all([
    renderMockupCanvas(p, "front"),
    renderMockupCanvas(p, "back"),
  ]);
  const out = document.createElement("canvas");
  out.width = S * 2;
  out.height = S;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(front, 0, 0);
  ctx.drawImage(back, S, 0);
  const blob: Blob = await new Promise((res) => out.toBlob((b) => res(b!), "image/png"));
  saveBlob(blob, `ore-sports-${slug(p.teamName)}.png`);
}

export async function downloadDesignPdf(p: ExportProps) {
  const { jsPDF } = await import("jspdf");
  const [front, back] = await Promise.all([
    renderMockupCanvas(p, "front"),
    renderMockupCanvas(p, "back"),
  ]);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, W, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("ORE SPORTS · KITCRAFT — Diseño de uniforme", 10, 12);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(`Equipo: ${p.teamName || "—"}`, 10, 27);
  doc.text(`Jugador: ${p.playerName || "—"}   Número: ${p.number || "—"}`, 10, 33);
  doc.text(`Deporte: ${p.sport}   Corte: ${p.cut}`, 150, 27);
  doc.text(`Colores: ${p.jerseyColor} / ${p.sleeveColor} / ${p.collarColor ?? p.trimColor}`, 150, 33);

  const img = 120;
  doc.addImage(front.toDataURL("image/png"), "PNG", 15, 40, img, img, undefined, "FAST");
  doc.addImage(back.toDataURL("image/png"), "PNG", 160, 40, img, img, undefined, "FAST");
  doc.setFontSize(9);
  doc.text("Frente", 15, 40);
  doc.text("Espalda", 160, 40);
  doc.text("WhatsApp: +58 424-9669070", 10, 200);
  doc.save(`ore-sports-${slug(p.teamName)}.pdf`);
}
