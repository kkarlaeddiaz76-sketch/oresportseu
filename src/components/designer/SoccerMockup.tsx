import futbolFront from "@/assets/futbol_v_front.png.asset.json";
import futbolBack from "@/assets/futbol_v_back.png.asset.json";
import type { View } from "./JerseyCanvas";

interface Props {
  view: View;
  jerseyColor: string;
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
}

/**
 * Official soccer V-neck mockup engine.
 * White base photo (1920x1920) + colored SVG zones with
 * mix-blend-mode: multiply so folds, shadows and fabric texture survive.
 */
export function SoccerMockup({
  view,
  jerseyColor,
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
}: Props) {
  const front = view === "front";
  const base = front ? futbolFront.url : futbolBack.url;

  // Body silhouette (shoulders -> bottom hem), sleeves included
  const body = front
    ? "M 640 330 Q 960 245 1290 330 L 1490 470 L 1450 860 L 1300 900 L 1330 1690 Q 960 1745 585 1690 L 615 900 L 465 860 L 425 470 Z"
    : "M 640 320 Q 960 235 1290 320 L 1490 470 L 1450 860 L 1300 900 L 1330 1690 Q 960 1745 585 1690 L 615 900 L 465 860 L 425 470 Z";

  const sleeveLeft = "M 640 330 L 425 470 L 465 860 L 615 900 L 655 560 Z";
  const sleeveRight = "M 1290 330 L 1490 470 L 1450 860 L 1300 900 L 1265 560 Z";

  // Collar: V on the front, ribbed band on the back
  const collar = front
    ? "M 800 285 Q 960 300 1120 285 L 1140 330 Q 960 520 785 330 Z"
    : "M 800 265 Q 960 320 1125 265 L 1135 320 Q 960 375 790 320 Z";

  return (
    <div className="relative mx-auto w-full">
      <svg
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto block h-full max-h-full w-full object-contain drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <image
          href={base}
          x="0"
          y="0"
          width="1920"
          height="1920"
          preserveAspectRatio="xMidYMid meet"
        />

        <g style={{ mixBlendMode: "multiply" }}>
          <path d={body} fill={jerseyColor} />
          <path d={sleeveLeft} fill={sleeveColor} />
          <path d={sleeveRight} fill={sleeveColor} />
          <path d={collar} fill={trimColor} />
          {/* sleeve cuff trims */}
          <path d="M 465 855 L 615 895 L 608 940 L 458 900 Z" fill={trimColor} opacity="0.9" />
          <path d="M 1450 855 L 1300 895 L 1307 940 L 1457 900 Z" fill={trimColor} opacity="0.9" />
        </g>

        {/* Dynamic text overlays */}
        {front && teamName && (
          <text
            x="960"
            y="672"
            textAnchor="middle"
            fontFamily={fontFront}
            fontSize={teamNameSize * 4.2}
            fontWeight="800"
            fill={teamNameColor}
            stroke="#000"
            strokeWidth="3"
            style={{ letterSpacing: "6px" }}
          >
            {teamName.toUpperCase().slice(0, 14)}
          </text>
        )}

        {!front && (
          <>
            {playerName && (
              <text
                x="960"
                y="480"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={playerNameSize * 4.2}
                fontWeight="700"
                fill={playerNameColor}
                stroke="#000"
                strokeWidth="2.5"
                style={{ letterSpacing: "8px" }}
              >
                {playerName.toUpperCase().slice(0, 14)}
              </text>
            )}
            {number && (
              <text
                x="960"
                y="1060"
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={numberSize * 3}
                fontWeight="900"
                fill={numberColor}
                stroke="#000"
                strokeWidth="7"
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
