import { createFileRoute, Link } from "@tanstack/react-router";
import futbol from "@/assets/futbol.jpg.asset.json";
import basket from "@/assets/basket.jpg.asset.json";
import beisbol from "@/assets/beisbol.jpg.asset.json";
import kickingball from "@/assets/kickingball.jpg.asset.json";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — ORE Sports / KitCraft" },
      { name: "description", content: "Catálogo por deporte: Fútbol, Baloncesto, Béisbol, Softball y Kickingball." },
      { property: "og:title", content: "Catálogo — KitCraft" },
      { property: "og:description", content: "Explora uniformes por deporte." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Catalog,
});

const items = [
  { key: "futbol", label: "Fútbol", img: futbol, desc: "Camisetas técnicas transpirables, cuello redondo o en V." },
  { key: "basket", label: "Baloncesto", img: basket, desc: "Tank tops ligeros, corte atlético, tejido microperforado." },
  { key: "beisbol", label: "Béisbol", img: beisbol, desc: "Franelas con 2 o 6 botones, sublimación total." },
  { key: "kickingball", label: "Kickingball", img: kickingball, desc: "Diseño femenino con estilo profesional." },
] as const;

function Catalog() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Catálogo</p>
      <h1 className="mb-10 text-4xl font-black uppercase text-black md:text-5xl">Uniformes por deporte</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.key}
            to="/disenador"
            search={{ sport: it.key }}
            className="group relative block h-96 overflow-hidden rounded-2xl border-2 border-black bg-black"
          >
            <img src={it.img.url} alt={it.label} className="h-full w-full object-cover opacity-70 transition group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent p-6 text-white">
              <h3 className="text-3xl font-black uppercase">{it.label}</h3>
              <p className="mt-1 text-sm text-white/70">{it.desc}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
                Diseñar ahora <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
