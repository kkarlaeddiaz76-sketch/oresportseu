import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import monarcas from "@/assets/monarcas.jpg.asset.json";
import cachorros from "@/assets/cachorros.jpg.asset.json";
import leones from "@/assets/leones.jpg.asset.json";
import quisqueya from "@/assets/quisqueya.jpg.asset.json";
import caciques from "@/assets/caciques.jpg.asset.json";
import halcones from "@/assets/halcones.jpg.asset.json";
import naiguata from "@/assets/naiguata.jpg.asset.json";
import raptors from "@/assets/raptors.jpg.asset.json";
import espartanos from "@/assets/espartanos.jpg.asset.json";
import astros from "@/assets/astros.jpg.asset.json";
import { waLink } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/trabajos")({
  head: () => ({
    meta: [
      { title: "Trabajos Realizados — ORE Sports / KitCraft" },
      { name: "description", content: "Galería de uniformes deportivos personalizados fabricados por KitCraft." },
      { property: "og:title", content: "Trabajos Realizados — KitCraft" },
      { property: "og:description", content: "Equipos que ya visten KitCraft." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: monarcas.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: monarcas.url },
    ],
  }),
  component: Gallery,
});

const items = [
  { img: monarcas, name: "Monarcas" },
  { img: cachorros, name: "Cachorros" },
  { img: leones, name: "Leones" },
  { img: quisqueya, name: "Quisqueya Buccaneers" },
  { img: caciques, name: "Caciques" },
  { img: halcones, name: "Halcones" },
  { img: naiguata, name: "Naiguatá" },
  { img: raptors, name: "Raptors" },
  { img: espartanos, name: "Espartanos" },
  { img: astros, name: "Astros" },
];

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Galería</p>
      <h1 className="mb-3 text-4xl font-black uppercase text-black md:text-5xl">Trabajos realizados</h1>
      <p className="mb-10 max-w-2xl text-black/70">Uniformes confeccionados para equipos reales en España y Europa.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <figure
            key={i}
            className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-xl border-2 border-black bg-black"
            onClick={() => setOpen(it.img.url)}
          >
            <img src={it.img.url} alt={it.name} className="h-full w-full object-cover transition group-hover:scale-105 group-hover:opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 opacity-0 transition group-hover:opacity-100">
              <span className="text-2xl font-black uppercase text-white">{it.name}</span>
              <a
                href={waLink(`Hola KitCraft, quiero un diseño similar al de ${it.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold uppercase text-white hover:bg-white hover:text-primary"
              >
                Quiero un diseño similar
              </a>
            </div>
          </figure>
        ))}
      </div>

      {/* Caps section */}
      <section className="mt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Accesorios</p>
        <h2 className="mb-6 text-3xl font-black uppercase text-black">Gorras personalizadas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-black bg-neutral-900">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 grid h-32 w-32 place-items-center rounded-full bg-black text-primary shadow-lg ring-4 ring-white/10">
                    <span className="text-4xl font-black">CAP</span>
                  </div>
                  <p className="text-sm font-semibold uppercase text-white/80">Bordado 3D</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.15),transparent_60%)]" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-black/60">Próximamente más modelos de gorras con bordado 3D disponibles.</p>
      </section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-4xl border-0 bg-black p-0">
          {open && <img src={open} alt="Uniforme" className="h-auto w-full" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
