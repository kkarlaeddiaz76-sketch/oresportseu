import { useEffect, useRef, useState } from "react";
import { PhotoMockup } from "./PhotoMockup";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

type MockupProps = Omit<React.ComponentProps<typeof PhotoMockup>, "view">;

/**
 * Turntable 3D preview: the front and back mockups are placed on the two faces
 * of a rotating plane, with perspective, tilt and a contact shadow.
 * Drag horizontally to spin the jersey.
 */
export function Jersey3DView(props: MockupProps) {
  const [angle, setAngle] = useState(-25);
  const [spinning, setSpinning] = useState(true);
  const drag = useRef<{ x: number; a: number } | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!spinning) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      setAngle((a) => a + dt * 0.025);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [spinning]);

  const onPointerDown = (e: React.PointerEvent) => {
    setSpinning(false);
    drag.current = { x: e.clientX, a: angle };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setAngle(drag.current.a + (e.clientX - drag.current.x) * 0.6);
  };
  const onPointerUp = () => { drag.current = null; };

  const norm = ((angle % 360) + 360) % 360;
  const showingBack = norm > 90 && norm < 270;

  return (
    <div className="w-full">
      <div
        className="relative mx-auto flex aspect-square w-full max-w-md cursor-grab items-center justify-center active:cursor-grabbing"
        style={{ perspective: "1400px", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(8deg) rotateY(${angle}deg)`,
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}>
            <PhotoMockup {...props} view="front" />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", transformStyle: "preserve-3d" }}
          >
            <PhotoMockup {...props} view="back" />
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md"
          style={{ transform: `translateX(-50%) scaleX(${0.55 + 0.45 * Math.abs(Math.cos((angle * Math.PI) / 180))})` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSpinning((s) => !s)}
          className="gap-2 border-black text-black hover:bg-black hover:text-white"
        >
          {spinning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {spinning ? "Pausar giro" : "Girar"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => { setSpinning(false); setAngle(showingBack ? 0 : 180); }}
          className="gap-2 border-black text-black hover:bg-black hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Ver {showingBack ? "frente" : "espalda"}
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-black/60">
        Vista 3D: arrastra con el ratón o el dedo para girar el uniforme.
      </p>
    </div>
  );
}
