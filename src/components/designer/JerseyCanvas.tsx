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
  { id: "gradient", label: "Degradado", desc: "Ombré vertical Principal → Secundario" },
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
  teamNameSize?: number;
  playerNameSize?: number;
  numberSize?: number;
  teamNameColor?: string;
  playerNameColor?: string;
  numberColor?: string;
}


export function JerseyCanvas({
  sport, view, cut, primary, secondary, accent,
  teamName, playerName, number,
  fontFront = "'Anton', 'Impact', sans-serif",
  fontBack = "'Anton', 'Impact', sans-serif",
  category = "men",
  template = "solid",
  teamNameSize = 44,
  playerNameSize = 30,
  numberSize = 180,
  teamNameColor = "#ffffff",
  playerNameColor = "#ffffff",
  numberColor = "#ffffff",
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
        {showBaseballButtons && view === "front" && (cut === "btn2" || cut === "btn6") && (
          <ButtonsPlacket cut={cut} template={template} accent={accent} />
        )}
        {view === "front" ? (
          <FrontContent teamName={teamName} accent={accent} fontFamily={fontFront} fontSize={teamNameSize} color={teamNameColor} />
        ) : (
          <BackContent playerName={playerName} number={number} accent={accent} fontFamily={fontBack} nameSize={playerNameSize} numberSize={numberSize} nameColor={playerNameColor} numberColor={numberColor} />
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
  sleeveless, primary, secondary, accent, cut, waistTaper, template,
}: { sleeveless: boolean; primary: string; secondary: string; accent: string; cut: NeckCut; waistTaper: number; template: Template }) {
  void cut;
  const w = waistTaper;
  const torso =
    `M 150 110 L 200 90 Q 250 75 300 90 L 350 110 L ${380 - w} 200 L ${400 - w} 560 Q 250 590 ${100 + w} 560 L ${120 + w} 200 Z`;

  // Raglan sleeves cut diagonally from neck
  const raglan = template === "raglan";
  const sleeveLeft = sleeveless
    ? "M 150 110 L 130 190 L 165 200 L 185 130 Z"
    : raglan
      ? "M 220 92 L 150 110 L 70 170 L 100 260 L 175 220 L 210 150 Z"
      : "M 150 110 L 70 170 L 100 260 L 175 220 Z";
  const sleeveRight = sleeveless
    ? "M 350 110 L 370 190 L 335 200 L 315 130 Z"
    : raglan
      ? "M 280 92 L 350 110 L 430 170 L 400 260 L 325 220 L 290 150 Z"
      : "M 350 110 L 430 170 L 400 260 L 325 220 Z";

  // Body fill by template
  let torsoFill: string = primary;
  if (template === "gradient") torsoFill = "url(#tplGradient)";
  else if (template === "camo") torsoFill = "url(#tplCamo)";
  else if (template === "geometric") torsoFill = "url(#tplScales)";

  const sleeveFill = template === "raglan" || template === "sidePanels" ? secondary : secondary;

  return (
    <g>
      <path d={sleeveLeft} fill={sleeveFill} stroke="#000" strokeWidth="2" />
      <path d={sleeveRight} fill={sleeveFill} stroke="#000" strokeWidth="2" />
      <path d={torso} fill={torsoFill} stroke="#000" strokeWidth="2" />

      {/* Side panels */}
      {template === "sidePanels" && (
        <g>
          <path d={`M ${120 + w} 200 L 175 220 L 195 560 Q 185 565 ${105 + w} 560 Z`} fill={secondary} opacity="0.95" />
          <path d={`M ${380 - w} 200 L 325 220 L 305 560 Q 315 565 ${395 - w} 560 Z`} fill={secondary} opacity="0.95" />
          <line x1="175" y1="220" x2="195" y2="560" stroke={accent} strokeWidth="2" />
          <line x1="325" y1="220" x2="305" y2="560" stroke={accent} strokeWidth="2" />
        </g>
      )}

      {/* Piping — accent line on shoulders & sleeve edges */}
      {template === "piping" && (
        <g fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round">
          <path d="M 200 90 Q 250 75 300 90" />
          {!sleeveless && <path d="M 100 260 L 175 220" />}
          {!sleeveless && <path d="M 400 260 L 325 220" />}
        </g>
      )}

      {/* Double piping across chest */}
      {template === "doublePiping" && (
        <g stroke={accent} strokeWidth="3" fill="none">
          <line x1="155" y1="215" x2="345" y2="215" />
          <line x1="150" y1="235" x2="350" y2="235" />
        </g>
      )}

      {/* Rib collar tricolor cuffs */}
      {template === "ribCollar" && !sleeveless && (
        <g>
          <rect x="95" y="245" width="90" height="8" fill={accent} />
          <rect x="95" y="253" width="90" height="8" fill={primary} />
          <rect x="95" y="261" width="90" height="8" fill={secondary} />
          <rect x="315" y="245" width="90" height="8" fill={accent} />
          <rect x="315" y="253" width="90" height="8" fill={primary} />
          <rect x="315" y="261" width="90" height="8" fill={secondary} />
        </g>
      )}
    </g>
  );
}

function NeckCutShape({
  cut, accent, template, secondary, primary,
}: { cut: NeckCut; accent: string; template: Template; secondary: string; primary: string }) {
  const strokeW = template === "piping" || template === "ribCollar" ? 5 : 3;
  if (cut === "vneck") {
    return (
      <g>
        <path
          d="M 220 92 L 250 145 L 280 92 Q 250 100 220 92 Z"
          fill="#111"
          stroke={accent}
          strokeWidth={strokeW}
        />
        {template === "ribCollar" && (
          <path d="M 218 90 Q 250 102 282 90" fill="none" stroke={secondary} strokeWidth="3" />
        )}
      </g>
    );
  }
  return (
    <g>
      <path
        d="M 215 92 Q 250 115 285 92 Q 275 130 250 132 Q 225 130 215 92 Z"
        fill="#111"
        stroke={accent}
        strokeWidth={strokeW}
      />
      {template === "ribCollar" && (
        <>
          <path d="M 213 88 Q 250 112 287 88" fill="none" stroke={secondary} strokeWidth="3" />
          <path d="M 216 96 Q 250 118 284 96" fill="none" stroke={primary} strokeWidth="2" />
        </>
      )}
    </g>
  );
}

function ButtonsPlacket({ cut, template, accent }: { cut: NeckCut; template: Template; accent: string }) {
  const pipe = template === "piping";
  if (cut === "btn2") {
    return (
      <g>
        {pipe && <line x1="250" y1="132" x2="250" y2="175" stroke={accent} strokeWidth="2" />}
        <circle cx="250" cy="140" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
        <circle cx="250" cy="165" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
      </g>
    );
  }
  const buttons = [140, 195, 250, 305, 360, 415];
  return (
    <g>
      {pipe && <line x1="244" y1="130" x2="244" y2="560" stroke={accent} strokeWidth="1.5" />}
      {pipe && <line x1="256" y1="130" x2="256" y2="560" stroke={accent} strokeWidth="1.5" />}
      <line x1="250" y1="130" x2="250" y2="560" stroke="#fff" strokeWidth="2" opacity="0.85" />
      {buttons.map((y) => (
        <circle key={y} cx="250" cy={y} r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
      ))}
    </g>
  );
}


function FrontContent({
  teamName, accent, fontFamily, fontSize, color,
}: { teamName: string; accent: string; fontFamily: string; fontSize: number; color: string }) {
  return (
    <g>
      {teamName && (
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight="800"
          fill={color}
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
  playerName, number, accent, fontFamily, nameSize, numberSize, nameColor, numberColor,
}: { playerName: string; number: string; accent: string; fontFamily: string; nameSize: number; numberSize: number; nameColor: string; numberColor: string }) {
  return (
    <g>
      {playerName && (
        <text
          x="250"
          y="180"
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize={nameSize}
          fontWeight="700"
          fill={nameColor}
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
          fontSize={numberSize}
          fontWeight="900"
          fill={numberColor}
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
