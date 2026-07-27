import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, RotateCw, Trash2, Plus, Truck, Minus, ShoppingBag, MessageCircle } from "lucide-react";
import {
  JerseyCanvas, FONT_OPTIONS, FONT_CATEGORY_LABEL, TEMPLATES,
  type Sport, type NeckCut, type View, type Category, type FontCategory, type Template,
  useObjectUrl,
} from "@/components/designer/JerseyCanvas";

import { SizeGuideButton } from "@/components/site/SizeGuide";
import { waLink } from "@/components/site/WhatsAppButton";
import { z } from "zod";

const searchSchema = z.object({
  sport: z.enum(["futbol", "basket", "beisbol", "softball", "kickingball"]).optional(),
});

export const Route = createFileRoute("/disenador")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Diseñador Interactivo — ORE Sports / KitCraft" },
      { name: "description", content: "Personaliza tu uniforme deportivo: deporte, corte, colores, nombre, número y logo." },
      { property: "og:title", content: "Diseñador Interactivo — KitCraft" },
      { property: "og:description", content: "Configura tu uniforme en tiempo real." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DesignerPage,
});

interface Player { id: string; name: string; number: string; size: string; }
interface LogoState { x: number; y: number; scale: number } // x,y as % of preview box

const SPORTS: { v: Sport; label: string }[] = [
  { v: "futbol", label: "Fútbol" },
  { v: "basket", label: "Baloncesto" },
  { v: "beisbol", label: "Béisbol" },
  { v: "softball", label: "Softball" },
  { v: "kickingball", label: "Kickingball" },
];

const CATEGORIES: { v: Category; label: string; icon: string }[] = [
  { v: "kids", label: "Niños", icon: "👦" },
  { v: "women", label: "Dama", icon: "👩" },
  { v: "men", label: "Hombre", icon: "👨" },
];

const KIDS = ["4", "8", "12", "14", "16"];
const ADULTS = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const sizesForCategory = (c: Category) => (c === "kids" ? KIDS : ADULTS);

function DesignerPage() {
  const search = Route.useSearch();
  const [sport, setSport] = useState<Sport>(search.sport ?? "beisbol");
  const [view, setView] = useState<View>("front");
  const [cut, setCut] = useState<NeckCut>("btn2");
  const [category, setCategory] = useState<Category>("men");
  const [primary, setPrimary] = useState("#000000");
  const [secondary, setSecondary] = useState("#FF0000");
  const [accent, setAccent] = useState("#FFFFFF");
  const [teamName, setTeamName] = useState("Monarcas");
  const [playerName, setPlayerName] = useState("PEREZ");
  const [number, setNumber] = useState("23");
  const [fabric, setFabric] = useState<"standard" | "premium">("standard");
  const [fontFront, setFontFront] = useState("flipbash");
  const [fontBack, setFontBack] = useState("flipbash");
  const [designSize, setDesignSize] = useState<string>("L");
  const [template, setTemplate] = useState<Template>("solid");
  const [showSummary, setShowSummary] = useState(false);
  const { url: logoUrl, set: setLogo } = useObjectUrl();


  // Logo positions per view (percentages of preview area)
  const [logoPos, setLogoPos] = useState<{ front: LogoState; back: LogoState }>({
    front: { x: 20, y: 45, scale: 1 },
    back: { x: 50, y: 20, scale: 1 },
  });
  const [logoSelected, setLogoSelected] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => { if (!logoUrl) setLogoSelected(false); }, [logoUrl]);
  useEffect(() => {
    const opts = sizesForCategory(category);
    if (!opts.includes(designSize)) setDesignSize(opts[Math.min(2, opts.length - 1)]);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentPos = logoPos[view];
  const updatePos = (patch: Partial<LogoState>) =>
    setLogoPos((p) => ({ ...p, [view]: { ...p[view], ...patch } }));

  const onLogoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    setLogoSelected(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = previewRef.current.getBoundingClientRect();
    dragState.current = {
      startX: e.clientX, startY: e.clientY,
      origX: currentPos.x, origY: currentPos.y,
    };
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      if (!dragState.current || !previewRef.current) return;
      const dx = ((ev.clientX - dragState.current.startX) / rect.width) * 100;
      const dy = ((ev.clientY - dragState.current.startY) / rect.height) * 100;
      const nx = Math.max(0, Math.min(100, dragState.current.origX + dx));
      const ny = Math.max(0, Math.min(100, dragState.current.origY + dy));
      setLogoPos((p) => ({ ...p, [view]: { ...p[view], x: nx, y: ny } }));
    };
    const up = () => {
      dragState.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const fontFrontFamily = FONT_OPTIONS.find((f) => f.id === fontFront)!.family;
  const fontBackFamily = FONT_OPTIONS.find((f) => f.id === fontBack)!.family;

  // Roster
  const [players, setPlayers] = useState<Player[]>([
    { id: crypto.randomUUID(), name: "Pérez", number: "10", size: "L" },
  ]);
  const [paste, setPaste] = useState("");

  const cutsAllowed = useMemo<NeckCut[]>(() => {
    if (["beisbol", "softball", "kickingball"].includes(sport)) {
      return ["crew", "vneck", "btn2", "btn6"];
    }
    return ["crew", "vneck"];
  }, [sport]);

  const addPlayer = () =>
    setPlayers((p) => [...p, { id: crypto.randomUUID(), name: "", number: "", size: "M" }]);
  const removePlayer = (id: string) => setPlayers((p) => p.filter((x) => x.id !== id));
  const updatePlayer = (id: string, patch: Partial<Player>) =>
    setPlayers((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const parsePaste = () => {
    const lines = paste.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const parsed: Player[] = lines.map((l) => {
      const parts = l.split(/\s*[-|,;\t]\s*/);
      const [num, name, size] = parts;
      return { id: crypto.randomUUID(), number: num ?? "", name: name ?? "", size: size ?? "M" };
    });
    if (parsed.length) setPlayers(parsed);
    setPaste("");
  };

  const total = players.length;
  const freeShip = total >= 10;
  const catLabel = CATEGORIES.find((c) => c.v === category)?.label ?? "";
  const quoteMsg = `Hola KitCraft, quiero cotizar un pedido:%0ADeporte: ${sport}%0ACategoría: ${catLabel}%0AEquipo: ${teamName}%0ATela: ${fabric}%0AJugadores: ${total}`;

  const logoSizePx = 80 * currentPos.scale;

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Diseñador</p>
            <h1 className="text-4xl font-black uppercase text-black md:text-5xl">Configura tu uniforme</h1>
          </div>
          <SizeGuideButton />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* PREVIEW */}
          <div className="rounded-2xl border-2 border-black bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1 rounded-full border border-black p-1">
                <button
                  onClick={() => { setView("front"); setLogoSelected(false); }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${view === "front" ? "bg-black text-white" : "text-black"}`}
                >
                  Frente
                </button>
                <button
                  onClick={() => { setView("back"); setLogoSelected(false); }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${view === "back" ? "bg-black text-white" : "text-black"}`}
                >
                  Espalda
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setView((v) => (v === "front" ? "back" : "front")); setLogoSelected(false); }}
                className="gap-2 border-black text-black hover:bg-black hover:text-white"
              >
                <RotateCw className="h-4 w-4" /> Girar
              </Button>
            </div>
            <div
              ref={previewRef}
              className="relative rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200 p-6 select-none"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setLogoSelected(false);
              }}
            >
              <JerseyCanvas
                sport={sport} view={view} cut={cut}
                primary={primary} secondary={secondary} accent={accent}
                teamName={teamName} playerName={playerName} number={number}
                fontFront={fontFrontFamily}
                fontBack={fontBackFamily}
                category={category}
                template={template}
              />


              {logoUrl && (
                <div
                  role="button"
                  tabIndex={0}
                  onPointerDown={onLogoPointerDown}
                  style={{
                    position: "absolute",
                    left: `${currentPos.x}%`,
                    top: `${currentPos.y}%`,
                    width: logoSizePx,
                    height: logoSizePx,
                    transform: "translate(-50%,-50%)",
                    cursor: "grab",
                    touchAction: "none",
                  }}
                  className={`rounded ${logoSelected ? "outline outline-2 outline-primary" : "outline-dashed outline-1 outline-black/30 hover:outline-primary"}`}
                >
                  <img
                    src={logoUrl}
                    alt="Logo equipo"
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                  />
                  {logoSelected && (
                    <div
                      className="absolute -top-9 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-black bg-white p-1 shadow"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updatePos({ scale: Math.max(0.3, currentPos.scale - 0.15) })}
                        className="rounded-full p-1 hover:bg-black hover:text-white"
                        aria-label="Reducir logo"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => updatePos({ scale: Math.min(3, currentPos.scale + 0.15) })}
                        className="rounded-full p-1 hover:bg-black hover:text-white"
                        aria-label="Agrandar logo"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setLogo(null)}
                        className="rounded-full p-1 text-primary hover:bg-primary hover:text-white"
                        aria-label="Eliminar logo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-black/60">
              {logoUrl ? "Arrastra el logo sobre la camisa. La posición se guarda por vista (frente/espalda)." : "Vista previa aproximada. La producción final se ajusta al patrón elegido."}
            </p>
          </div>

          {/* CONTROLS */}
          <div className="space-y-6">
            {/* Category */}
            <Panel title="Categoría / Corte">
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.v}
                    onClick={() => setCategory(c.v)}
                    className={`rounded-lg border-2 p-2 text-xs font-bold uppercase transition ${
                      category === c.v ? "border-primary bg-primary text-white" : "border-black/20 bg-white text-black hover:border-black"
                    }`}
                  >
                    <span className="mr-1 text-base">{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </Panel>

            {/* Sport */}
            <Panel title="Deporte">
              <div className="grid grid-cols-3 gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => { setSport(s.v); if (!cutsAllowed.includes(cut)) setCut("crew"); }}
                    className={`rounded-lg border-2 p-2 text-xs font-bold uppercase transition ${
                      sport === s.v ? "border-primary bg-primary text-white" : "border-black/20 bg-white text-black hover:border-black"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Panel>

            {/* Cut */}
            <Panel title="Corte / Cuello">
              <div className="grid grid-cols-2 gap-2">
                {(["crew", "vneck", "btn2", "btn6"] as NeckCut[]).map((c) => {
                  const disabled = !cutsAllowed.includes(c);
                  const label = { crew: "Cuello Redondo", vneck: "Cuello en V", btn2: "2 Botones", btn6: "6 Botones (Full)" }[c];
                  return (
                    <button
                      key={c}
                      disabled={disabled}
                      onClick={() => setCut(c)}
                      className={`rounded-lg border-2 p-2 text-xs font-bold uppercase transition ${
                        cut === c ? "border-primary bg-primary text-white" : "border-black/20 bg-white text-black hover:border-black"
                      } ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {!["beisbol", "softball", "kickingball"].includes(sport) && (
                <p className="mt-2 text-xs text-black/60">Los cortes con botones aplican a Béisbol, Softball y Kickingball.</p>
              )}
            </Panel>

            {/* Templates */}
            <Panel title="Diseño Base / Plantilla">
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    title={t.desc}
                    className={`group flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 text-[10px] font-bold uppercase transition ${
                      template === t.id ? "border-primary bg-primary/5 text-primary" : "border-black/15 bg-white text-black hover:border-black"
                    }`}
                  >
                    <TemplateThumb template={t.id} primary={primary} secondary={secondary} accent={accent} />
                    <span className="truncate leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-black/60">
                Los colores Principal / Mangas / Acento siguen siendo editables sobre cualquier plantilla.
              </p>
            </Panel>

            {/* Colors */}
            <Panel title="Colores">

              <div className="grid grid-cols-3 gap-3">
                <ColorField label="Principal" value={primary} onChange={setPrimary} />
                <ColorField label="Mangas" value={secondary} onChange={setSecondary} />
                <ColorField label="Acento" value={accent} onChange={setAccent} />
              </div>
            </Panel>

            {/* Fonts */}
            <Panel title="Tipografías">
              <div className="space-y-3">
                <FontPicker
                  label="Nombre del Equipo (Frente)"
                  value={fontFront}
                  onChange={setFontFront}
                  sample={teamName || "EQUIPO"}
                />
                <FontPicker
                  label="Jugador & Número (Espalda)"
                  value={fontBack}
                  onChange={setFontBack}
                  sample={`${playerName || "JUGADOR"} 23`}
                />
              </div>
            </Panel>

            {/* Text */}
            <Panel title={view === "front" ? "Frente: Nombre del Equipo & Logo" : "Espalda: Jugador & Número"}>
              {view === "front" ? (
                <div className="space-y-3">
                  <div>
                    <Label>Nombre del Equipo</Label>
                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} maxLength={14} />
                  </div>
                  <div>
                    <Label>Logo del Equipo (PNG/JPG)</Label>
                    <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/30 p-4 text-sm font-semibold text-black hover:border-primary hover:text-primary">
                      <Upload className="h-4 w-4" />
                      {logoUrl ? "Cambiar logo" : "Subir logo"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {logoUrl && (
                      <p className="mt-2 text-xs text-black/60">
                        Arrastra el logo sobre la camisa para reposicionarlo. Toca el logo para escalar o eliminar.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <div>
                    <Label>Nombre Jugador</Label>
                    <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={14} />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" />
                  </div>
                </div>
              )}
            </Panel>

            {/* Fabric */}
            <Panel title="Tela">
              <div className="grid grid-cols-2 gap-2">
                <FabricOption
                  active={fabric === "standard"}
                  title="Estándar"
                  desc="Microperforado 170g"
                  tip="Tejido microperforado transpirable de 170g. Ideal para uso frecuente."
                  onClick={() => setFabric("standard")}
                />
                <FabricOption
                  active={fabric === "premium"}
                  title="Premium"
                  desc="Liso 280g"
                  tip="Tejido liso de alta resistencia de 280g. Acabado profesional."
                  onClick={() => setFabric("premium")}
                />
              </div>
            </Panel>
          </div>
        </div>

        {/* ROSTER */}
        <section className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Roster</p>
              <h2 className="text-3xl font-black uppercase text-black">Pedido grupal</h2>
            </div>
            <Button onClick={addPlayer} className="gap-2 bg-black text-white hover:bg-primary">
              <Plus className="h-4 w-4" /> Añadir jugador
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <div className="mb-3">
                <Label>Carga rápida — pega tu lista (ej: <code>10 - Pérez - L</code>)</Label>
                <div className="mt-1 flex gap-2">
                  <textarea
                    value={paste}
                    onChange={(e) => setPaste(e.target.value)}
                    rows={3}
                    placeholder={"10 - Pérez - L\n7 - García - M\n4 - Ruiz - S"}
                    className="flex-1 rounded-md border border-black/20 p-2 text-sm"
                  />
                  <Button onClick={parsePaste} className="bg-primary text-white hover:bg-primary/90">Cargar</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left w-24">Número</th>
                      <th className="p-2 text-left w-36">Talla</th>
                      <th className="p-2 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p) => (
                      <tr key={p.id} className="border-t border-black/10">
                        <td className="p-2">
                          <Input value={p.name} onChange={(e) => updatePlayer(p.id, { name: e.target.value })} />
                        </td>
                        <td className="p-2">
                          <Input value={p.number} onChange={(e) => updatePlayer(p.id, { number: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                        </td>
                        <td className="p-2">
                          <Select value={p.size} onValueChange={(v) => updatePlayer(p.id, { size: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <div className="px-2 py-1 text-xs font-bold uppercase text-primary">{catLabel}</div>
                              {sizesForCategory(category).map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 text-right">
                          <button onClick={() => removePlayer(p.id)} className="text-black/50 hover:text-primary">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="rounded-2xl border-2 border-black bg-black p-6 text-white">
              <h3 className="text-xl font-black uppercase">Resumen</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row k="Deporte" v={SPORTS.find((s) => s.v === sport)?.label ?? ""} />
                <Row k="Categoría" v={catLabel} />
                <Row k="Equipo" v={teamName || "—"} />
                <Row k="Tela" v={fabric === "standard" ? "Estándar 170g" : "Premium 280g"} />
                <Row k="Talla diseño" v={designSize} />
                <Row k="Uniformes" v={String(total)} />
              </dl>
              <div className="mt-4">
                <Label className="text-white/70">Talla del diseño</Label>
                <Select value={designSize} onValueChange={setDesignSize}>
                  <SelectTrigger className="mt-1 bg-white text-black"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sizesForCategory(category).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`mt-6 rounded-lg border p-3 text-sm font-semibold ${freeShip ? "border-primary bg-primary text-white" : "border-white/30 text-white/80"}`}>
                <Truck className="mr-2 inline h-4 w-4" />
                🚚 Envío gratis a partir de 10 uniformes
                {!freeShip && <div className="mt-1 text-xs font-normal opacity-80">Añade {10 - total} más para envío gratis.</div>}
              </div>
              <Button
                size="lg"
                onClick={() => setShowSummary(true)}
                className="mt-6 w-full gap-2 bg-primary text-white hover:bg-primary/90"
              >
                <ShoppingBag className="h-5 w-5" /> Guardar y Concretar Compra
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full border-white/30 bg-transparent text-white hover:bg-white hover:text-black">
                <a href={waLink(decodeURIComponent(quoteMsg))} target="_blank" rel="noopener noreferrer">
                  Solicitar cotización rápida
                </a>
              </Button>
            </aside>
          </div>
        </section>

        <PurchaseSummaryDialog
          open={showSummary}
          onOpenChange={setShowSummary}
          data={{
            sport: SPORTS.find((s) => s.v === sport)?.label ?? sport,
            cut: { crew: "Cuello Redondo", vneck: "Cuello en V", btn2: "2 Botones", btn6: "6 Botones (Full)" }[cut],
            fabric: fabric === "standard" ? "Estándar 170g microperforado" : "Premium 280g liso",
            template: TEMPLATES.find((t) => t.id === template)?.label ?? template,

            category: catLabel,
            size: designSize,
            fontFront: FONT_OPTIONS.find((f) => f.id === fontFront)?.label ?? fontFront,
            fontBack: FONT_OPTIONS.find((f) => f.id === fontBack)?.label ?? fontBack,
            teamName,
            playerName,
            number,
            total,
          }}
        />
      </div>
    </TooltipProvider>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-white p-5">
      <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-black">{title}</h3>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs font-semibold uppercase text-black/70">
      {label}
      <div className="mt-1 flex items-center gap-2 rounded-md border border-black/20 p-1">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-8 cursor-pointer border-0 bg-transparent" />
        <span className="text-xs font-mono">{value.toUpperCase()}</span>
      </div>
    </label>
  );
}

function FontPicker({
  label, value, onChange, sample,
}: { label: string; value: string; onChange: (v: string) => void; sample: string }) {
  const selected = FONT_OPTIONS.find((f) => f.id === value)!;
  const cats: FontCategory[] = ["mode", "script", "ore"];
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {cats.map((cat) => (
            <div key={cat}>
              <div className="sticky top-0 bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                {FONT_CATEGORY_LABEL[cat]}
              </div>
              {FONT_OPTIONS.filter((f) => f.category === cat).map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  <span style={{ fontFamily: f.family }} className="text-base">{f.label}</span>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      <div
        className="mt-2 truncate rounded-md border border-black/10 bg-neutral-50 px-3 py-2 text-2xl leading-tight text-black"
        style={{ fontFamily: selected.family }}
        title={sample}
      >
        {sample.toUpperCase().slice(0, 18)}
      </div>
    </div>
  );
}

interface SummaryData {
  sport: string; cut: string; fabric: string; template: string; category: string; size: string;
  fontFront: string; fontBack: string; teamName: string; playerName: string; number: string; total: number;
}


function PurchaseSummaryDialog({
  open, onOpenChange, data,
}: { open: boolean; onOpenChange: (v: boolean) => void; data: SummaryData }) {
  const msg = [
    "*🏆 NUEVO PEDIDO — ORE Sports / KitCraft*",
    "",
    `• Deporte: ${data.sport}`,
    `• Corte: ${data.cut}`,
    `• Tela: ${data.fabric}`,
    `• Diseño base: ${data.template}`,

    `• Categoría: ${data.category}`,
    `• Talla del diseño: ${data.size}`,
    `• Tipografía Frente: ${data.fontFront}`,
    `• Tipografía Espalda: ${data.fontBack}`,
    `• Nombre del Equipo: ${data.teamName || "—"}`,
    `• Nombre Jugador: ${data.playerName || "—"}`,
    `• Número: ${data.number || "—"}`,
    `• Uniformes en el roster: ${data.total}`,
    "",
    "¿Podemos concretar la compra?",
  ].join("\n");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase text-black">Ficha técnica del pedido</DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border-2 border-black bg-white">
          <dl className="divide-y divide-black/10 text-sm">
            <SumRow k="Deporte" v={data.sport} />
            <SumRow k="Corte" v={data.cut} />
            <SumRow k="Tela" v={data.fabric} />
            <SumRow k="Diseño base" v={data.template} />

            <SumRow k="Categoría" v={data.category} />
            <SumRow k="Talla" v={data.size} />
            <SumRow k="Tipografía Frente" v={data.fontFront} />
            <SumRow k="Tipografía Espalda" v={data.fontBack} />
            <SumRow k="Equipo" v={data.teamName || "—"} />
            <SumRow k="Jugador" v={data.playerName || "—"} />
            <SumRow k="Número" v={data.number || "—"} />
            <SumRow k="Uniformes" v={String(data.total)} />
          </dl>
        </div>
        <Button asChild size="lg" className="mt-2 w-full gap-2 bg-primary text-white hover:bg-primary/90">
          <a href={waLink(msg)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" /> Enviar por WhatsApp (+58 424-9669070)
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <dt className="text-black/60">{k}</dt>
      <dd className="max-w-[60%] truncate font-semibold text-black" title={v}>{v}</dd>
    </div>
  );
}


function FabricOption({ active, title, desc, tip, onClick }: { active: boolean; title: string; desc: string; tip: string; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`rounded-lg border-2 p-3 text-left transition ${active ? "border-primary bg-primary text-white" : "border-black/20 bg-white text-black hover:border-black"}`}
        >
          <div className="text-sm font-bold uppercase">{title}</div>
          <div className={`text-xs ${active ? "text-white/80" : "text-black/60"}`}>{desc}</div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">{tip}</TooltipContent>
    </Tooltip>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-1">
      <dt className="text-white/60">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}

function TemplateThumb({
  template, primary, secondary, accent,
}: { template: Template; primary: string; secondary: string; accent: string }) {
  const gid = `g-${template}`;
  const cid = `c-${template}`;
  const sid = `s-${template}`;
  return (
    <svg viewBox="0 0 60 70" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <pattern id={cid} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={primary} />
          <path d="M0 3 Q3 0 6 3 T10 3 L10 6 Q6 8 3 6 T0 7 Z" fill={secondary} opacity="0.6" />
          <ellipse cx="7" cy="8" rx="2" ry="1.2" fill={accent} opacity="0.4" />
        </pattern>
        <pattern id={sid} width="4" height="3.5" patternUnits="userSpaceOnUse">
          <rect width="4" height="3.5" fill={primary} />
          <path d="M2 0 A2 2 0 0 1 4 1.7 A2 2 0 0 1 2 3.5 A2 2 0 0 1 0 1.7 A2 2 0 0 1 2 0"
                fill="none" stroke={secondary} strokeWidth="0.25" opacity="0.6" />
        </pattern>
      </defs>
      {/* sleeves */}
      <path d="M18 12 L6 22 L12 30 L22 24 Z" fill={secondary} stroke="#000" strokeWidth="0.6" />
      <path d="M42 12 L54 22 L48 30 L38 24 Z" fill={secondary} stroke="#000" strokeWidth="0.6" />
      {template === "raglan" && (
        <>
          <path d="M26 10 L18 12 L6 22 L12 30 L22 24 L25 16 Z" fill={secondary} stroke="#000" strokeWidth="0.5" />
          <path d="M34 10 L42 12 L54 22 L48 30 L38 24 L35 16 Z" fill={secondary} stroke="#000" strokeWidth="0.5" />
        </>
      )}
      {/* torso */}
      <path
        d="M18 12 L24 8 Q30 6 36 8 L42 12 L46 24 L48 66 Q30 70 12 66 L14 24 Z"
        fill={
          template === "gradient" ? `url(#${gid})` :
          template === "camo" ? `url(#${cid})` :
          template === "geometric" ? `url(#${sid})` :
          primary
        }
        stroke="#000"
        strokeWidth="0.6"
      />
      {template === "sidePanels" && (
        <>
          <path d="M14 24 L18 26 L20 66 Q17 66.5 13 66 Z" fill={secondary} />
          <path d="M46 24 L42 26 L40 66 Q43 66.5 47 66 Z" fill={secondary} />
        </>
      )}
      {template === "piping" && (
        <g fill="none" stroke={accent} strokeWidth="0.8">
          <path d="M24 8 Q30 6 36 8" />
          <path d="M12 30 L22 24" />
          <path d="M48 30 L38 24" />
        </g>
      )}
      {template === "doublePiping" && (
        <g stroke={accent} strokeWidth="0.8" fill="none">
          <line x1="19" y1="27" x2="41" y2="27" />
          <line x1="18" y1="30" x2="42" y2="30" />
        </g>
      )}
      {template === "ribCollar" && (
        <>
          <rect x="10" y="28" width="12" height="1.2" fill={accent} />
          <rect x="10" y="29.2" width="12" height="1.2" fill={secondary} />
          <rect x="38" y="28" width="12" height="1.2" fill={accent} />
          <rect x="38" y="29.2" width="12" height="1.2" fill={secondary} />
        </>
      )}
      {/* neck */}
      <path d="M25 8 Q30 11 35 8 Q34 12 30 12 Q26 12 25 8 Z" fill="#111" stroke={accent} strokeWidth="0.5" />
    </svg>
  );
}
