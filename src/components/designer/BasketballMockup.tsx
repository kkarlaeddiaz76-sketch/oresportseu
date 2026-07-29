import basketFront from "@/assets/basket_front.png.asset.json";
import basketBack from "@/assets/basket_back.png.asset.json";
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
 * Basketball uniform mockup engine.
 * Renders a white base uniform photo and overlays colored SVG zones
 * using mix-blend-mode: multiply so 3D shadows and fabric folds
 * from the base photo are preserved.
 *
 * viewBox matches the base image dimensions (1024 x 1280).
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
  const base = view === "front" ? basketFront.url : basketBack.url;

  // Approximate zone geometry (aligned to the generated white mockup 1024x1280)
  // Jersey torso: rounded rectangle ~ x 280..740, y 60..640
  const jerseyPath =
    "M 340 70 Q 512 40 684 70 L 720 130 L 745 640 Q 700 660 512 660 Q 324 660 279 640 L 304 130 Z";

  // Shorts: two legs with waistband
  const shortsPath =
    "M 300 660 L 720 660 L 735 730 L 720 1140 Q 620 1160 512 1150 Q 512 900 512 900 Q 512 1160 404 1150 Q 296 1160 289 1140 L 304 730 Z";

  // Neck/trim ring (front & back)
  const neckPath =
    view === "front"
      ? "M 430 62 Q 512 105 594 62 Q 594 130 512 130 Q 430 130 430 62 Z"
      : "M 420 45 Q 512 70 604 45 Q 604 95 512 95 Q 420 95 420 45 Z";

  // Armhole trim
  const armholeLeft = "M 280 130 Q 260 260 300 400 L 340 380 Q 330 260 340 150 Z";
  const armholeRight = "M 744 130 Q 764 260 724 400 L 684 380 Q 694 260 684 150 Z";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 1024 1280"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full drop-shadow-2xl"
      >
        {/* Base white uniform photo */}
        <image
          href={base}
          x="0"
          y="0"
          width="1024"
          height="1280"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Color zones — multiply blend preserves shadows/folds from base */}
        <g style={{ mixBlendMode: "multiply" }}>
          <path d={jerseyPath} fill={jerseyColor} />
          <path d={shortsPath} fill={shortsColor} />
          {/* Trim (neck + armholes) as accent color */}
          <path d={neckPath} fill={trimColor} opacity="0.95" />
          <path d={armholeLeft} fill={trimColor} opacity="0.55" />
          <path d={armholeRight} fill={trimColor} opacity="0.55" />
          {/* Optional compression sleeves (coderas) */}
          {showSleeves && (
            <>
              <ellipse cx="240" cy="360" rx="70" ry="140" fill={sleeveColor} opacity="0.9" />
              <ellipse cx="784" cy="360" rx="70" ry="140" fill={sleeveColor} opacity="0.9" />
            </>
          )}
          {/* Waistband highlight */}
          <rect x="290" y="660" width="445" height="42" fill={trimColor} opacity="0.85" />
        </g>

        {/* Text overlays — rendered above the mockup */}
        {view === "front" && teamName && (
          <text
            x="512"
            y="380"
            textAnchor="middle"
            fontFamily={fontFront}
            fontSize={teamNameSize * 3.2}
            fontWeight="800"
            fill={teamNameColor}
            stroke="#000"
            strokeWidth="3"
            style={{ letterSpacing: "4px" }}
          >
            {teamName.toUpperCase().slice(0, 14)}
          </text>
        )}

        {view === "back" && (
          <>
            {playerName && (
              <text
                x="512"
                y="200"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={playerNameSize * 3.2}
                fontWeight="700"
                fill={playerNameColor}
                stroke="#000"
                strokeWidth="2"
                style={{ letterSpacing: "5px" }}
              >
                {playerName.toUpperCase().slice(0, 14)}
              </text>
            )}
            {number && (
              <text
                x="512"
                y="480"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={numberSize * 2.2}
                fontWeight="900"
                fill={numberColor}
                stroke="#000"
                strokeWidth="6"
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
