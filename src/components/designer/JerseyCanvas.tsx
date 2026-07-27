import { useMemo, useRef, useState } from "react";

export type Sport = "futbol" | "basket" | "beisbol" | "softball" | "kickingball";
export type NeckCut = "crew" | "vneck" | "btn2" | "btn6";
export type View = "front" | "back";
export type Category = "kids" | "women" | "men";

export type FontCategory = "mode" | "script" | "ore";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  category: FontCategory;
}

export const FONT_CATEGORY_LABEL: Record<FontCategory, string> = {
  mode: "MODE (Deportivas / Bloque)",
  script: "SCRIPT (Cursivas)",
  ore: "ORE SPORTS (Oficial)",
};

export const FONT_OPTIONS: FontOption[] = [
  // MODE
  { id: "flipbash", label: "Flipbash Condensed Italic", family: "'Oswald', 'Impact', sans-serif", category: "mode" },
  { id: "mlb-pirates", label: "MLB Pirates", family: "'Graduate', serif", category: "mode" },
  { id: "nba-hornets", label: "NBA Hornets Buzz City", family: "'Teko', sans-serif", category: "mode" },
  { id: "spy-agency", label: "Spy Agency 3.2 Semi-Italic", family: "'Chakra Petch', sans-serif", category: "mode" },
  { id: "texat", label: "Texat Bold", family: "'Staatliches', sans-serif", category: "mode" },
  { id: "university", label: "University", family: "'Ultra', serif", category: "mode" },
  // SCRIPT
  { id: "atelier", label: "Atelier du Soleil", family: "'Great Vibes', cursive", category: "script" },
  { id: "black-stars", label: "Black Stars Regular", family: "'Kaushan Script', cursive", category: "script" },
  { id: "campana", label: "Campana Script", family: "'Alex Brush', cursive", category: "script" },
  { id: "lobster", label: "Lobster 1.4", family: "'Lobster', cursive", category: "script" },
  { id: "sunday-midnight", label: "Sunday Midnight", family: "'Yellowtail', cursive", category: "script" },
  { id: "united-kings", label: "United Kings", family: "'Sacramento', cursive", category: "script" },
  // ORE SPORTS
  { id: "eurostile", label: "Eurostile Extended Black", family: "'Michroma', sans-serif", category: "ore" },
];

export type Template =
  | "solid"
  | "gradient"
  | "piping"
  | "doublePiping"
  | "raglan"
  | "sidePanels"
  | "ribCollar"
  | "camo"
  | "geometric";

export const TEMPLATES: { id: Template; label: string; desc: string }[] = [
  { id: "solid", label: "Sólido", desc: "Base limpia sin patrón" },
  { id: "gradient", label: "Degradado", desc: "Ombré vertical Principal → Mangas" },
  { id: "piping", label: "Piping Clásico", desc: "Ribete fino en cuello, botonera y mangas" },
  { id: "doublePiping", label: "Doble Ribete", desc: "Dos líneas paralelas en la pechera" },
  { id: "raglan", label: "Raglan / Mangas Contraste", desc: "Corte diagonal desde el cuello" },
  { id: "sidePanels", label: "Paneles Laterales", desc: "Franjas verticales de contraste" },
  { id: "ribCollar", label: "Rib Tricolor", desc: "Franjas retro en cuello y puños" },
  { id: "camo", label: "Camuflaje", desc: "Sublimado camo deportivo" },
  { id: "geometric", label: "Escamas", desc: "Textura geométrica sutil" },
];

interface Props {
  sport: Sport;
  view: View;
  cut: NeckCut;
  primary: string;
  secondary: string;
  accent: string;
  teamName: string;
  playerName: string;
  number: string;
  fontFront?: string;
  fontBack?: string;
  category?: Category;
  template?: Template;
}


export function JerseyCanvas({
  sport, view, cut, primary, secondary, accent,
  teamName, playerName, number,
  fontFront = "'Anton', 'Impact', sans-serif",
  fontBack = "'Anton', 'Impact', sans-serif",
  category = "men",
  template = "solid",
}: Props) {
  const sleeveless = sport === "basket";
  const showBaseballButtons = ["beisbol", "softball", "kickingball"].includes(sport);

  // Silhouette adjust by category
  const shape = useMemo(() => {
    if (category === "kids") return { scale: 0.82, tx: 45, waist: 0 };
    if (category === "women") return { scale: 0.95, tx: 12, waist: 12 };
    return { scale: 1, tx: 0, waist: 0 };
  }, [category]);

  return (
    <svg
      viewBox="0 0 500 620"
      className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      <TemplateDefs primary={primary} secondary={secondary} accent={accent} />
      <defs>
        <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <g transform={`translate(${shape.tx} ${(1 - shape.scale) * 310}) scale(${shape.scale})`}>
        <JerseyShape
          sleeveless={sleeveless}
          primary={primary}
          secondary={secondary}
          accent={accent}
          cut={cut}
          waistTaper={shape.waist}
          template={template}
        />
        <rect x="0" y="0" width="500" height="620" fill="url(#shade)" pointerEvents="none" />
        <NeckCutShape cut={cut} accent={accent} template={template} secondary={secondary} primary={primary} />
        {showBaseballButtons && (cut === "btn2" || cut === "btn6") && (
          <ButtonsPlacket cut={cut} template={template} accent={accent} />
        )}
        {view === "front" ? (
          <FrontContent teamName={teamName} accent={accent} fontFamily={fontFront} />
        ) : (
          <BackContent playerName={playerName} number={number} accent={accent} fontFamily={fontBack} />
        )}
      </g>
    </svg>
  );
}

function TemplateDefs({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  return (
    <defs>
      <linearGradient id="tplGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={primary} />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
      <pattern id="tplCamo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill={primary} />
        <path d="M0 20 Q20 5 40 20 T80 20 L80 40 Q60 55 40 40 T0 40 Z" fill={secondary} opacity="0.55" />
        <path d="M10 55 Q30 45 55 60 T80 70 L80 80 L0 80 L0 65 Z" fill={accent} opacity="0.35" />
        <ellipse cx="60" cy="15" rx="12" ry="7" fill={accent} opacity="0.28" />
        <ellipse cx="20" cy="65" rx="10" ry="6" fill={secondary} opacity="0.5" />
      </pattern>
      <pattern id="tplScales" x="0" y="0" width="18" height="16" patternUnits="userSpaceOnUse">
        <rect width="18" height="16" fill={primary} />
        <path d="M9 0 A9 9 0 0 1 18 8 A9 9 0 0 1 9 16 A9 9 0 0 1 0 8 A9 9 0 0 1 9 0"
              fill="none" stroke={secondary} strokeWidth="0.8" opacity="0.55" />
      </pattern>
    </defs>
  );
}


function JerseyShape({
  sleeveless, primary, secondary, cut, waistTaper,
}: { sleeveless: boolean; primary: string; secondary: string; cut: NeckCut; waistTaper: number }) {
  void cut;
  const w = waistTaper;
  const torso =
    `M 150 110 L 200 90 Q 250 75 300 90 L 350 110 L ${380 - w} 200 L ${400 - w} 560 Q 250 590 ${100 + w} 560 L ${120 + w} 200 Z`;

  const sleeveLeft = sleeveless
    ? "M 150 110 L 130 190 L 165 200 L 185 130 Z"
    : "M 150 110 L 70 170 L 100 260 L 175 220 Z";
  const sleeveRight = sleeveless
    ? "M 350 110 L 370 190 L 335 200 L 315 130 Z"
    : "M 350 110 L 430 170 L 400 260 L 325 220 Z";

  return (
    <g>
      <path d={sleeveLeft} fill={secondary} stroke="#000" strokeWidth="2" />
      <path d={sleeveRight} fill={secondary} stroke="#000" strokeWidth="2" />
      <path d={torso} fill={primary} stroke="#000" strokeWidth="2" />
    </g>
  );
}

function NeckCutShape({ cut, accent }: { cut: NeckCut; accent: string }) {
  if (cut === "vneck") {
    return (
      <path
        d="M 220 92 L 250 145 L 280 92 Q 250 100 220 92 Z"
        fill="#111"
        stroke={accent}
        strokeWidth="3"
      />
    );
  }
  return (
    <path
      d="M 215 92 Q 250 115 285 92 Q 275 130 250 132 Q 225 130 215 92 Z"
      fill="#111"
      stroke={accent}
      strokeWidth="3"
    />
  );
}

function ButtonsPlacket({ cut }: { cut: NeckCut }) {
  if (cut === "btn2") {
    return (
      <g>
        <circle cx="250" cy="140" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
        <circle cx="250" cy="165" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
      </g>
    );
  }
  const buttons = [140, 195, 250, 305, 360, 415];
  return (
    <g>
      <line x1="250" y1="130" x2="250" y2="560" stroke="#fff" strokeWidth="2" opacity="0.85" />
      {buttons.map((y) => (
        <circle key={y} cx="250" cy={y} r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
      ))}
    </g>
  );
}

function FrontContent({
  teamName, accent, fontFamily,
}: { teamName: string; accent: string; fontFamily: string }) {
  return (
    <g>
      {teamName && (
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize="44"
          fontWeight="800"
          fill="#fff"
          stroke="#000"
          strokeWidth="2"
          style={{ letterSpacing: "2px" }}
        >
          {teamName.toUpperCase().slice(0, 14)}
        </text>
      )}
      <circle cx="440" cy="230" r="6" fill={accent} />
    </g>
  );
}

function BackContent({
  playerName, number, accent, fontFamily,
}: { playerName: string; number: string; accent: string; fontFamily: string }) {
  return (
    <g>
      {playerName && (
        <text
          x="250"
          y="180"
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize="30"
          fontWeight="700"
          fill="#fff"
          stroke="#000"
          strokeWidth="1.5"
          style={{ letterSpacing: "3px" }}
        >
          {playerName.toUpperCase().slice(0, 14)}
        </text>
      )}
      {number && (
        <text
          x="250"
          y="400"
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize="180"
          fontWeight="900"
          fill="#fff"
          stroke="#000"
          strokeWidth="4"
        >
          {number.slice(0, 2)}
        </text>
      )}
      <circle cx="440" cy="230" r="6" fill={accent} />
    </g>
  );
}

export function useObjectUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const previous = useRef<string | null>(null);
  const set = (file: File | null) => {
    if (previous.current) URL.revokeObjectURL(previous.current);
    if (!file) { setUrl(null); previous.current = null; return; }
    const u = URL.createObjectURL(file);
    previous.current = u;
    setUrl(u);
  };
  return { url, set };
}

export function sportLabel(s: Sport) {
  return useMemo(() => ({
    futbol: "Fútbol", basket: "Baloncesto", beisbol: "Béisbol",
    softball: "Softball", kickingball: "Kickingball",
  }[s]), [s]);
}
