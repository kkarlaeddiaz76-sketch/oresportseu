import { useMemo, useRef, useState } from "react";

export type Sport = "futbol" | "basket" | "beisbol" | "softball" | "kickingball";
export type NeckCut = "crew" | "vneck" | "btn2" | "btn6";
export type View = "front" | "back";

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
  logoUrl?: string | null;
}

// A stylized baseball/soccer jersey silhouette that adapts.
export function JerseyCanvas({
  sport, view, cut, primary, secondary, accent,
  teamName, playerName, number, logoUrl,
}: Props) {
  const sleeveless = sport === "basket";
  const showBaseballButtons = ["beisbol", "softball", "kickingball"].includes(sport);

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

      {/* Body */}
      <JerseyShape
        sleeveless={sleeveless}
        primary={primary}
        secondary={secondary}
        cut={cut}
      />
      <rect x="0" y="0" width="500" height="620" fill="url(#shade)" pointerEvents="none" />

      {/* Neck cut */}
      <NeckCutShape cut={cut} accent={accent} />

      {/* Baseball buttons */}
      {showBaseballButtons && (cut === "btn2" || cut === "btn6") && (
        <ButtonsPlacket cut={cut} accent={accent} />
      )}

      {/* Front / Back content */}
      {view === "front" ? (
        <FrontContent teamName={teamName} logoUrl={logoUrl} accent={accent} sleeveless={sleeveless} />
      ) : (
        <BackContent playerName={playerName} number={number} accent={accent} />
      )}
    </svg>
  );
}

function JerseyShape({
  sleeveless, primary, secondary, cut,
}: { sleeveless: boolean; primary: string; secondary: string; cut: NeckCut }) {
  // Torso path
  const torso =
    "M 150 110 L 200 90 Q 250 75 300 90 L 350 110 L 380 200 L 400 560 Q 250 590 100 560 L 120 200 Z";

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
  // Crew / buttons default to rounded collar
  return (
    <path
      d="M 215 92 Q 250 115 285 92 Q 275 130 250 132 Q 225 130 215 92 Z"
      fill="#111"
      stroke={accent}
      strokeWidth="3"
    />
  );
}

function ButtonsPlacket({ cut, accent }: { cut: NeckCut; accent: string }) {
  // 2-button: only top chest area; NO continuous vertical seam.
  if (cut === "btn2") {
    return (
      <g>
        <circle cx="250" cy="140" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
        <circle cx="250" cy="165" r="4" fill="#fff" stroke="#000" strokeWidth="1" />
      </g>
    );
  }
  // 6-button full placket: continuous line + 6 buttons
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
  teamName, logoUrl, accent, sleeveless,
}: { teamName: string; logoUrl?: string | null; accent: string; sleeveless: boolean }) {
  return (
    <g>
      {teamName && (
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fontFamily="Oswald, Impact, sans-serif"
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
      {logoUrl && !sleeveless && (
        <>
          <image href={logoUrl} x="85" y="200" width="45" height="45" preserveAspectRatio="xMidYMid meet" />
          <image href={logoUrl} x="370" y="200" width="45" height="45" preserveAspectRatio="xMidYMid meet" />
        </>
      )}
      {logoUrl && sleeveless && (
        <image href={logoUrl} x="200" y="360" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
      )}
      <circle cx="440" cy="230" r="6" fill={accent} />
    </g>
  );
}

function BackContent({
  playerName, number, accent,
}: { playerName: string; number: string; accent: string }) {
  return (
    <g>
      {playerName && (
        <text
          x="250"
          y="180"
          textAnchor="middle"
          fontFamily="Oswald, Impact, sans-serif"
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
          fontFamily="Oswald, Impact, sans-serif"
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
