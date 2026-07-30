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
 * Basketball uniform mockup — fully vector (tank jersey + shorts).
 * Proportions drawn to scale so colors, trims and text always align.
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

  // Neckline: deeper scoop on the front, shallow on the back
  const neckline = front
    ? "Q 300 148 348 92"
    : "Q 300 116 348 92";

  // Tank-top silhouette (shoulders -> armhole -> side seam -> hem)
  const torso =
    `M 174 122 L 210 96 L 252 92 ${neckline} L 390 96 L 426 122 ` +
    `C 404 168 392 200 390 244 ` +
    `L 400 300 L 406 436 ` +
    `Q 300 458 194 436 ` +
    `L 200 300 L 210 244 ` +
    `C 208 200 196 168 174 122 Z`;

  const armholeLeft = "M 174 122 C 196 168 208 200 210 244";
  const armholeRight = "M 426 122 C 404 168 392 200 390 244";

  const neckTrim = front
    ? "M 252 92 Q 300 148 348 92"
    : "M 252 92 Q 300 116 348 92";

  // Shorts
  const shorts =
    "M 192 470 L 408 470 L 418 546 L 406 742 Q 358 756 314 744 L 300 596 L 286 744 Q 242 756 194 742 L 182 546 Z";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 600 820"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="bkShade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
            <stop offset="20%" stopColor="#000" stopOpacity="0.05" />
            <stop offset="48%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#000" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="bkFold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="65%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.24" />
          </linearGradient>
        </defs>

        {/* ---------- COMPRESSION SLEEVES (behind the jersey) ---------- */}
        {showSleeves && (
          <g>
            <path
              d="M 178 150 C 146 240 142 330 152 412 L 206 408 C 198 320 200 236 214 176 Z"
              fill={sleeveColor}
              stroke="#000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M 422 150 C 454 240 458 330 448 412 L 394 408 C 402 320 400 236 386 176 Z"
              fill={sleeveColor}
              stroke="#000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* ---------- SHORTS ---------- */}
        <g>
          <path d={shorts} fill={shortsColor} stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="182" y="452" width="236" height="30" rx="8" fill={trimColor} stroke="#000" strokeWidth="2.5" />
          <path d="M 194 486 L 188 738" stroke={trimColor} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 406 486 L 412 738" stroke={trimColor} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 194 730 Q 240 744 286 734" stroke={trimColor} strokeWidth="7" fill="none" />
          <path d="M 314 734 Q 360 744 406 730" stroke={trimColor} strokeWidth="7" fill="none" />
          <path d={shorts} fill="url(#bkShade)" pointerEvents="none" />
          <path d={shorts} fill="url(#bkFold)" pointerEvents="none" />
        </g>

        {/* ---------- JERSEY ---------- */}
        <g>
          <path d={torso} fill={jerseyColor} stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          {/* armhole + neck trim */}
          <path d={armholeLeft} fill="none" stroke={trimColor} strokeWidth="9" strokeLinecap="round" />
          <path d={armholeRight} fill="none" stroke={trimColor} strokeWidth="9" strokeLinecap="round" />
          <path d={neckTrim} fill="none" stroke={trimColor} strokeWidth="9" strokeLinecap="round" />
          {/* shoulder trim */}
          <path d="M 174 122 L 210 96 L 252 92" fill="none" stroke={trimColor} strokeWidth="7" strokeLinecap="round" />
          <path d="M 426 122 L 390 96 L 348 92" fill="none" stroke={trimColor} strokeWidth="7" strokeLinecap="round" />
          {/* bottom hem */}
          <path d="M 196 428 Q 300 450 404 428" stroke={trimColor} strokeWidth="8" fill="none" />
          <path d={torso} fill="url(#bkShade)" pointerEvents="none" />
          <path d={torso} fill="url(#bkFold)" pointerEvents="none" />
        </g>

        {/* ---------- TEXT ---------- */}
        {front && teamName && (
          <text
            x="300"
            y="268"
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
                y="186"
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
                y="360"
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
