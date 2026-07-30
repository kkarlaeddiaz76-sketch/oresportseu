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
    ? "M 640 315 Q 960 235 1290 315 L 1545 505 L 1495 895 L 1290 935 L 1345 1700 Q 960 1760 575 1700 L 630 935 L 425 895 L 375 505 Z"
    : "M 640 305 Q 960 225 1290 305 L 1545 505 L 1495 895 L 1290 935 L 1345 1700 Q 960 1760 575 1700 L 630 935 L 425 895 L 375 505 Z";

  const sleeveLeft = "M 640 315 L 375 505 L 425 895 L 630 935 L 668 560 Z";
  const sleeveRight = "M 1290 315 L 1545 505 L 1495 895 L 1290 935 L 1252 560 Z";

  // Collar: V on the front, ribbed band on the back
  const collar = front
    ? "M 830 288 Q 960 305 1090 288 L 1108 338 Q 960 505 812 338 Z"
    : "M 810 258 Q 960 318 1120 258 L 1132 318 Q 960 380 798 318 Z";


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
          <path d="M 425 890 L 630 930 L 622 975 L 418 935 Z" fill={trimColor} opacity="0.9" />
          <path d="M 1495 890 L 1290 930 L 1298 975 L 1502 935 Z" fill={trimColor} opacity="0.9" />

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
