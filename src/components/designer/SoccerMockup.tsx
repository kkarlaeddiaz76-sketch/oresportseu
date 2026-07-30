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

  // Body silhouette traced from the official photo (shoulders -> bottom hem)
  const body =
    "M 700 302 Q 960 250 1216 302 L 1352 382 L 1455 500 L 1481 620 L 1511 800 L 1438 862 L 1292 900 L 1302 1400 L 1310 1645 Q 960 1706 610 1645 L 618 1400 L 628 900 L 482 862 L 409 800 L 439 620 L 465 500 L 568 382 Z";

  const sleeveLeft = "M 700 302 L 568 382 L 465 500 L 439 620 L 409 800 L 482 862 L 628 900 L 662 555 Z";
  const sleeveRight = "M 1216 302 L 1352 382 L 1455 500 L 1481 620 L 1511 800 L 1438 862 L 1292 900 L 1258 555 Z";

  // Collar: V on the front, ribbed band on the back
  const collar = front
    ? "M 812 274 Q 960 302 1108 274 L 1122 332 Q 960 500 798 332 Z"
    : "M 806 262 Q 960 318 1116 262 L 1128 322 Q 960 380 794 322 Z";



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
          <path d="M 415 806 L 482 862 L 628 900 L 632 852 L 492 814 Z" fill={trimColor} opacity="0.9" />
          <path d="M 1505 806 L 1438 862 L 1292 900 L 1288 852 L 1428 814 Z" fill={trimColor} opacity="0.9" />

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
