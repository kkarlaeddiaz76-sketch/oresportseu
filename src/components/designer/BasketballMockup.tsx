import type { View } from "./JerseyCanvas";

interface Props {
  view: View;
  jerseyColor: string;
  shortsColor: string;
  sleeveColor: string;
  trimColor: string;
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
  showSleeves?: boolean;
}

/**
 * Basketball uniform mockup — fully vector (jersey + shorts).
 * Drawn to scale so colors, trims and text always align perfectly.
 * viewBox: 0 0 600 820
 */
export function BasketballMockup({
  view,
  jerseyColor,
  shortsColor,
  sleeveColor,
  trimColor,
  teamName,
  playerName,
  number,
  fontFront,
  fontBack,
  teamNameSize,
  playerNameSize,
  numberSize,
  teamNameColor,
  playerNameColor,
  numberColor,
  showSleeves = false,
}: Props) {
  const front = view === "front";

  // --- Tank top torso ---------------------------------------------------
  const torso = front
    ? "M 205 96 L 258 78 Q 300 108 342 78 L 395 96 Q 430 112 442 152 L 462 236 L 414 254 L 404 232 L 412 424 Q 300 446 188 424 L 196 232 L 186 254 L 138 236 L 158 152 Q 170 112 205 96 Z"
    : "M 205 96 L 262 80 Q 300 96 338 80 L 395 96 Q 430 112 442 152 L 462 236 L 414 254 L 404 232 L 412 424 Q 300 446 188 424 L 196 232 L 186 254 L 138 236 L 158 152 Q 170 112 205 96 Z";

  // Neck opening
  const neck = front
    ? "M 258 78 Q 300 108 342 78 Q 344 92 300 118 Q 256 92 258 78 Z"
    : "M 262 80 Q 300 96 338 80 Q 338 92 300 104 Q 262 92 262 80 Z";

  // Armholes (cut-outs of the tank)
  const armL = "M 205 96 Q 168 150 172 244 L 196 232 Q 196 150 224 108 Z";
  const armR = "M 395 96 Q 432 150 428 244 L 404 232 Q 404 150 376 108 Z";

  // --- Shorts -----------------------------------------------------------
  const shorts =
    "M 196 452 L 404 452 L 416 520 L 404 730 Q 356 744 312 732 L 300 566 L 288 732 Q 244 744 196 730 L 184 520 Z";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 600 820"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="bkShade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="22%" stopColor="#000" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#000" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="bkFold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* ---------- SHORTS ---------- */}
        <g>
          <path d={shorts} fill={shortsColor} stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          {/* waistband */}
          <rect x="184" y="440" width="232" height="30" rx="6" fill={trimColor} stroke="#000" strokeWidth="2.5" />
          {/* side stripes */}
          <path d="M 196 470 L 190 726" stroke={trimColor} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 404 470 L 410 726" stroke={trimColor} strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* leg hems */}
          <path d="M 196 716 Q 244 730 288 720" stroke={trimColor} strokeWidth="6" fill="none" />
          <path d="M 312 720 Q 356 730 404 716" stroke={trimColor} strokeWidth="6" fill="none" />
          <path d={shorts} fill="url(#bkShade)" pointerEvents="none" />
          <path d={shorts} fill="url(#bkFold)" pointerEvents="none" />
        </g>

        {/* ---------- COMPRESSION SLEEVES ---------- */}
        {showSleeves && (
          <g>
            <path d="M 150 210 Q 118 300 128 400 L 178 400 Q 172 300 194 232 Z" fill={sleeveColor} stroke="#000" strokeWidth="2" />
            <path d="M 450 210 Q 482 300 472 400 L 422 400 Q 428 300 406 232 Z" fill={sleeveColor} stroke="#000" strokeWidth="2" />
          </g>
        )}

        {/* ---------- JERSEY ---------- */}
        <g>
          <path d={torso} fill={jerseyColor} stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          {/* armhole trim */}
          <path d={armL} fill={trimColor} opacity="0.95" />
          <path d={armR} fill={trimColor} opacity="0.95" />
          {/* neck trim */}
          <path d={neck} fill={trimColor} stroke="#000" strokeWidth="2" />
          {/* bottom hem */}
          <path d="M 190 414 Q 300 436 410 414" stroke={trimColor} strokeWidth="8" fill="none" />
          <path d={torso} fill="url(#bkShade)" pointerEvents="none" />
          <path d={torso} fill="url(#bkFold)" pointerEvents="none" />
        </g>

        {/* ---------- TEXT ---------- */}
        {front && teamName && (
          <text
            x="300"
            y="248"
            textAnchor="middle"
            fontFamily={fontFront}
            fontSize={teamNameSize}
            fontWeight="800"
            fill={teamNameColor}
            stroke="#000"
            strokeWidth="1.5"
            style={{ letterSpacing: "2px" }}
          >
            {teamName.toUpperCase().slice(0, 14)}
          </text>
        )}

        {!front && (
          <>
            {playerName && (
              <text
                x="300"
                y="168"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={playerNameSize}
                fontWeight="700"
                fill={playerNameColor}
                stroke="#000"
                strokeWidth="1.2"
                style={{ letterSpacing: "3px" }}
              >
                {playerName.toUpperCase().slice(0, 14)}
              </text>
            )}
            {number && (
              <text
                x="300"
                y="340"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={numberSize}
                fontWeight="900"
                fill={numberColor}
                stroke="#000"
                strokeWidth="3"
              >
                {number.slice(0, 2)}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
