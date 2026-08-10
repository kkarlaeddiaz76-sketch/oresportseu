import { useEffect, useRef, useState } from "react";
import { PhotoMockup } from "./PhotoMockup";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Crosshair, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

type MockupProps = Omit<React.ComponentProps<typeof PhotoMockup>, "view">;

const START_ANGLE = -25;
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.6;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Turntable 3D preview: the front and back mockups are placed on the two faces
 * of a rotating plane, with perspective, tilt and a contact shadow.
 * Drag to spin, wheel/pinch to zoom, and reset to return to the default view.
 */
export function Jersey3DView(props: MockupProps) {
  const [angle, setAngle] = useState(START_ANGLE);
  const [tilt, setTilt] = useState(8);
  const [zoom, setZoom] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [speed, setSpeed] = useState(0.6);
  const [spinning, setSpinning] = useState(true);
  const target = useRef(START_ANGLE);
  const drag = useRef<{ x: number; y: number; a: number; t: number } | null>(null);
  const raf = useRef<number | null>(null);
  const zoomRef = useRef(zoom);
  const containerRef = useRef<HTMLDivElement>(null);
  zoomRef.current = zoom;

  // Smooth animation loop: eases the rendered angle towards the target angle.
  useEffect(() => {
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      if (spinning && !drag.current) target.current += dt * 0.025 * speed;
      setAngle((a) => a + (target.current - a) * (1 - Math.exp(-dt / 90)));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [spinning, speed]);

  // Non-passive wheel listener so page scroll is blocked while zooming.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      setZoom(clamp(zoomRef.current * Math.exp(-dy * 0.0015), MIN_ZOOM, MAX_ZOOM));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, a: target.current, t: tilt };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    target.current = drag.current.a + (e.clientX - drag.current.x) * 0.6;
    setTilt(clamp(drag.current.t - (e.clientY - drag.current.y) * 0.2, -20, 30));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const reset = () => {
    setSpinning(false);
    target.current = START_ANGLE;
    setTilt(8);
    setZoom(1);
    setOffsetY(0);
  };

  const norm = ((angle % 360) + 360) % 360;
  const showingBack = norm > 90 && norm < 270;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative mx-auto flex aspect-square w-full max-w-md cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
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
            transform: `translateY(${offsetY}%) scale(${zoom}) rotateX(${tilt}deg) rotateY(${angle}deg)`,
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

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
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
          onClick={() => {
            setSpinning(false);
            target.current = showingBack ? 0 : 180;
            setOffsetY(0);
          }}
          className="gap-2 border-black text-black hover:bg-black hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Ver {showingBack ? "frente" : "espalda"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSpinning(false);
            target.current = 180;
            setTilt(-14);
            setZoom(1.85);
            setOffsetY(58);
          }}
          className="gap-2 border-black text-black hover:bg-black hover:text-white"
          title="Acercar al cuello trasero"
        >
          <Crosshair className="h-4 w-4" /> Cuello
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={reset}
          className="gap-2 border-black text-black hover:bg-black hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Reiniciar vista
        </Button>
      </div>

      <div className="mx-auto mt-3 grid max-w-md gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase text-black/70">
            <span className="flex items-center gap-1">
              <ZoomOut className="h-3 w-3" /> Zoom <ZoomIn className="h-3 w-3" />
            </span>
            <span>{zoom.toFixed(2)}x</span>
          </div>
          <Slider
            value={[zoom]}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            onValueChange={([v]) => setZoom(v)}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase text-black/70">
            <span>Velocidad de giro</span>
            <span>{speed.toFixed(1)}x</span>
          </div>
          <Slider value={[speed]} min={0} max={2} step={0.1} onValueChange={([v]) => setSpeed(v)} />
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-black/60">
        Arrastra para girar e inclinar, usa la rueda o el control para acercar y revisa el encaje del cuello.
      </p>
    </div>
  );
}
