import type { NeckCut, Sport, View } from "./JerseyCanvas";

interface Props {
  sport: Sport;
  cut: NeckCut;
  view: View;
  jerseyColor: string;
  sleeveColor: string;
  trimColor: string;
  shortsColor?: string;
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

/** Base garment photos (white, transparent background) living in /public/uniformes */
export function baseImage(sport: Sport, cut: NeckCut, view: View) {
  const side = view === "front" ? "frente" : "espalda";
  if (sport === "basket") return `/uniformes/basket-conjunto-${side}.png`;
  if (cut === "vneck") return `/uniformes/camisa-cuellov-${side}.png`;
  if (cut === "btn6") return `/uniformes/camisa-6botones-${side}.png`;
  return `/uniformes/camisa-2botones-${side}.png`;
}

/** A color region clipped to a rectangle and masked by the garment silhouette. */
function Zone({ src, color, clip, opacity = 1 }: { src: string; color: string; clip?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        opacity,
        clipPath: clip,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function PhotoMockup({
  sport, cut, view,
  jerseyColor, sleeveColor, trimColor, shortsColor = "#000000",
  teamName, playerName, number,
  fontFront, fontBack,
  teamNameSize, playerNameSize, numberSize,
  teamNameColor, playerNameColor, numberColor,
}: Props) {
  const front = view === "front";
  const src = baseImage(sport, cut, view);
  const isSet = sport === "basket";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md select-none">
      {/* 1. Flat color zones, masked by the garment silhouette */}
      <Zone src={src} color={isSet ? jerseyColor : jerseyColor} />

      {isSet ? (
        <>
          <Zone src={src} color={shortsColor} clip="inset(51% 0 0 0)" />
          <Zone src={src} color={trimColor} clip="inset(46.5% 0 50.5% 0)" />
          <Zone src={src} color={trimColor} clip="inset(0 40% 92% 40%)" />
          <Zone src={src} color={sleeveColor} clip="inset(5% 82% 56% 0)" />
          <Zone src={src} color={sleeveColor} clip="inset(5% 0 56% 82%)" />
          <Zone src={src} color={trimColor} clip="inset(54% 88% 6% 0)" />
          <Zone src={src} color={trimColor} clip="inset(54% 0 6% 88%)" />
        </>
      ) : (
        <>
          <Zone src={src} color={sleeveColor} clip="inset(8% 76% 50% 0)" />
          <Zone src={src} color={sleeveColor} clip="inset(8% 0 50% 76%)" />
          <Zone src={src} color={trimColor} clip="inset(42% 76% 45% 0)" />
          <Zone src={src} color={trimColor} clip="inset(42% 0 45% 76%)" />
          <Zone src={src} color={trimColor} clip="inset(2% 38% 88% 38%)" />
        </>
      )}

      {/* 2. The real photo on top in multiply keeps folds, shadows and fabric texture */}
      <img
        src={src}
        alt="Base del uniforme"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* 3. Dynamic lettering */}
      <svg viewBox="0 0 500 500" className="pointer-events-none absolute inset-0 h-full w-full">
        {front && teamName && (
          <text
            x="250"
            y={isSet ? 175 : 235}
            textAnchor="middle"
            fontFamily={fontFront}
            fontSize={teamNameSize * (isSet ? 0.55 : 0.9)}
            fontWeight="800"
            fill={teamNameColor}
            stroke="#000"
            strokeWidth="1.2"
            style={{ letterSpacing: "2px" }}
          >
            {teamName.toUpperCase().slice(0, 14)}
          </text>
        )}

        {!front && (
          <>
            {playerName && (
              <text
                x="250"
                y={isSet ? 140 : 185}
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={playerNameSize * (isSet ? 0.5 : 0.85)}
                fontWeight="700"
                fill={playerNameColor}
                stroke="#000"
                strokeWidth="1"
                style={{ letterSpacing: "3px" }}
              >
                {playerName.toUpperCase().slice(0, 14)}
              </text>
            )}
            {number && (
              <text
                x="250"
                y={isSet ? 240 : 340}
                textAnchor="middle"
                fontFamily={fontBack}
                fontSize={numberSize * (isSet ? 0.45 : 0.8)}
                fontWeight="900"
                fill={numberColor}
                stroke="#000"
                strokeWidth="2.5"
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
