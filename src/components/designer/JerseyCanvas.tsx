import { useMemo, useRef, useState } from "react";

export type Sport = "futbol" | "basket" | "beisbol" | "softball" | "kickingball";
export type NeckCut = "crew" | "vneck" | "btn2" | "btn6";
export type View = "front" | "back";
export type Category = "kids" | "women" | "men";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  kind: "script" | "block";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "yellowtail", label: "Script Atlética Fuerte", family: "'Yellowtail', cursive", kind: "script" },
  { id: "allura", label: "Script Tradicional Béisbol", family: "'Allura', cursive", kind: "script" },
  { id: "pacifico", label: "Brush Script Moderna", family: "'Pacifico', cursive", kind: "script" },
  { id: "satisfy", label: "Script Elegante Inclinada", family: "'Satisfy', cursive", kind: "script" },
  { id: "sacramento", label: "Bold Athletic Script", family: "'Sacramento', cursive", kind: "script" },
  { id: "bungee", label: "Bloque Octagonal Colegial", family: "'Bungee', sans-serif", kind: "block" },
  { id: "alfa", label: "Slab Serif Imprenta Gruesa", family: "'Alfa Slab One', serif", kind: "block" },
  { id: "rye", label: "Retro Spur Serif Vintage", family: "'Rye', serif", kind: "block" },
  { id: "michroma", label: "Sans-Serif Rectangular Expandida", family: "'Michroma', sans-serif", kind: "block" },
  { id: "anton", label: "Heavy Athletic Block", family: "'Anton', 'Impact', sans-serif", kind: "block" },
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
}

export function JerseyCanvas({
  sport, view, cut, primary, secondary, accent,
  teamName, playerName, number,
  fontFront = "'Anton', 'Impact', sans-serif",
  fontBack = "'Anton', 'Impact', sans-serif",
  category = "men",
}: Props) {
  const sleeveless = sport === "basket";
  const showBaseballButtons = ["beisbol", "softball", "kickingball"].includes(sport);

  // Silhouette adjust by category
  const shape = useMemo(() => {
    if (category === "kids") return { scale: 0.82, tx: 45, waist: 0 };
    if (category === "women") return { scale: 0.95, tx: 12, waist: 12 }; // slight taper
    return { scale: 1, tx: 0, waist: 0 };
  }, [category]);

  return (
    <svg
      viewBox="0 0 500 620"
      className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
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
          cut={cut}
          waistTaper={shape.waist}
        />
        <rect x="0" y="0" width="500" height="620" fill="url(#shade)" pointerEvents="none" />
        <NeckCutShape cut={cut} accent={accent} />
        {showBaseballButtons && (cut === "btn2" || cut === "btn6") && (
          <ButtonsPlacket cut={cut} />
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
