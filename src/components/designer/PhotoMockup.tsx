import type { NeckCut, Sport, Template, View } from "./JerseyCanvas";

interface Props {
  sport: Sport;
  cut: NeckCut;
  view: View;
  template?: Template;
  jerseyColor: string;
  sleeveColor: string;
  trimColor: string;
  collarColor?: string;
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

/** Precise collar mask (alpha PNG) generated from each base photo. */
export function collarImage(sport: Sport, cut: NeckCut, view: View) {
  return baseImage(sport, cut, view).replace(/\.png$/, "-cuello.png");
}


/** A color region clipped to a rectangle and masked by the garment silhouette. */
function Zone({
  src, color, background, clip, opacity = 1,
}: { src: string; color?: string; background?: string; clip?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        backgroundImage: background,
        backgroundSize: background && background.startsWith("url") ? "13% 13%" : undefined,
        backgroundRepeat: background && background.startsWith("url") ? "repeat" : undefined,
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

const enc = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

function camoPattern(p: string, s: string, a: string) {
  return enc(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">` +
      `<rect width="80" height="80" fill="${p}"/>` +
      `<path d="M0 20 Q20 5 40 20 T80 20 L80 40 Q60 55 40 40 T0 40 Z" fill="${s}" opacity="0.55"/>` +
      `<path d="M10 55 Q30 45 55 60 T80 70 L80 80 L0 80 L0 65 Z" fill="${a}" opacity="0.35"/>` +
      `<ellipse cx="60" cy="15" rx="12" ry="7" fill="${a}" opacity="0.28"/>` +
      `<ellipse cx="20" cy="65" rx="10" ry="6" fill="${s}" opacity="0.5"/>` +
      `</svg>`,
  );
}

function scalesPattern(p: string, s: string) {
  return enc(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="32" viewBox="0 0 36 32">` +
      `<rect width="36" height="32" fill="${p}"/>` +
      `<path d="M18 0 A18 16 0 0 1 36 16 A18 16 0 0 1 18 32 A18 16 0 0 1 0 16 A18 16 0 0 1 18 0" fill="none" stroke="${s}" stroke-width="2" opacity="0.6"/>` +
      `</svg>`,
  );
}

/** Body fill (color or pattern) for the selected base template. */
function bodyFill(template: Template, primary: string, secondary: string, accent: string) {
  switch (template) {
    case "gradient":
      return { background: `linear-gradient(180deg, ${primary} 0%, ${secondary} 100%)` };
    case "camo":
      return { background: camoPattern(primary, secondary, accent) };
    case "geometric":
      return { background: scalesPattern(primary, secondary) };
    default:
      return { color: primary };
  }
}


export function PhotoMockup({
  sport, cut, view, template = "solid",
  jerseyColor, sleeveColor, trimColor, collarColor, shortsColor = "#000000",
  bodySecondary,
  teamName, playerName, number,
  fontFront, fontBack,
  teamNameSize, playerNameSize, numberSize,
  teamNameColor, playerNameColor, numberColor,
}: Props) {
  const front = view === "front";
  const src = baseImage(sport, cut, view);
  const collarSrc = collarImage(sport, cut, view);
  const isSet = sport === "basket";
  const body = bodyFill(template, jerseyColor, bodySecondary ?? sleeveColor, trimColor);
  const patterned = template === "gradient" || template === "camo" || template === "geometric";
  const raglan = template === "raglan";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md select-none">
      {/* 1. Flat color / pattern zones, masked by the garment silhouette */}
      <Zone src={src} color={body.color} background={body.background} />

      {isSet ? (
        <>
          <Zone src={src} color={shortsColor} clip="inset(51% 0 0 0)" />
          <Zone src={src} color={trimColor} clip="inset(46.5% 0 50.5% 0)" />
          {!patterned && <Zone src={src} color={sleeveColor} clip="inset(5% 82% 56% 0)" />}
          {!patterned && <Zone src={src} color={sleeveColor} clip="inset(5% 0 56% 82%)" />}
          <Zone src={src} color={trimColor} clip="inset(54% 88% 6% 0)" />
          <Zone src={src} color={trimColor} clip="inset(54% 0 6% 88%)" />
        </>
      ) : (
        <>
          {raglan ? (
            <>
              <Zone src={src} color={sleeveColor} clip="polygon(0% 4%, 44% 6%, 30% 22%, 27% 47%, 0% 47%)" />
              <Zone src={src} color={sleeveColor} clip="polygon(100% 4%, 56% 6%, 70% 22%, 73% 47%, 100% 47%)" />
            </>
          ) : !patterned ? (
            <>
              <Zone src={src} color={sleeveColor} clip="polygon(0% 4%, 31% 9%, 27% 47%, 0% 47%)" />
              <Zone src={src} color={sleeveColor} clip="polygon(100% 4%, 69% 9%, 73% 47%, 100% 47%)" />
            </>
          ) : null}
          <Zone src={src} color={trimColor} clip="polygon(0% 41%, 28% 41%, 27% 47%, 0% 47%)" />
          <Zone src={src} color={trimColor} clip="polygon(100% 41%, 72% 41%, 73% 47%, 100% 47%)" />
        </>
      )}

      {/* 1a. Collar: exact mask traced from the real photo, keeps its own shadows */}
      <Zone src={collarSrc} color={collarColor ?? trimColor} />




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
