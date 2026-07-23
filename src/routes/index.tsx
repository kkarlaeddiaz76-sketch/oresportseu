import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Sparkles, Truck } from "lucide-react";
import hero from "@/assets/hero.png.asset.json";
import futbol from "@/assets/futbol.jpg.asset.json";
import basket from "@/assets/basket.jpg.asset.json";
import beisbol from "@/assets/beisbol.jpg.asset.json";
import kickingball from "@/assets/kickingball.jpg.asset.json";
import monarcas from "@/assets/monarcas.jpg.asset.json";
import cachorros from "@/assets/cachorros.jpg.asset.json";
import leones from "@/assets/leones.jpg.asset.json";
import quisqueya from "@/assets/quisqueya.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORE Sports / KitCraft — Uniformes deportivos personalizados" },
      { name: "description", content: "Diseña tu uniforme deportivo personalizado. Fútbol, Baloncesto, Béisbol, Softball y Kickingball. +500 equipos vestidos en España y Europa." },
      { property: "og:title", content: "ORE Sports — Made for the win" },
      { property: "og:description", content: "Configurador interactivo de uniformes deportivos personalizados." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: hero.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: hero.url },
    ],
  }),
  component: Home,
});

const sports = [
  { key: "futbol", label: "Fútbol", img: futbol },
  { key: "basket", label: "Baloncesto", img: basket },
  { key: "beisbol", label: "Béisbol", img: beisbol },
  { key: "kickingball", label: "Kickingball", img: kickingball },
] as const;

const showcases = [monarcas, cachorros, leones, quisqueya];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <img
          src={hero.url}
          alt="Bateador en estadio"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Star className="h-4 w-4 fill-primary" /> +500 Equipos vestidos en España y Europa
          </span>
          <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.95] md:text-7xl">
            Diseña el uniforme <span className="text-primary">que hace ganar</span> a tu equipo.
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Configurador interactivo. Producción profesional. Envío gratis a toda España a partir de 10 uniformes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
              <Link to="/disenador">
                <Sparkles className="mr-2 h-5 w-5" /> Abrir Diseñador
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-black">
              <Link to="/trabajos">Ver trabajos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SPORTS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Deportes</p>
            <h2 className="mt-1 text-4xl font-black uppercase text-black">Elige tu disciplina</h2>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold uppercase text-black hover:text-primary md:inline">
            Ver catálogo →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sports.map((s) => (
            <Link
              key={s.key}
              to="/disenador"
              search={{ sport: s.key }}
              className="group relative block h-72 overflow-hidden rounded-xl border border-black/10 bg-black"
            >
              <img src={s.img.url} alt={s.label} className="h-full w-full object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black to-transparent p-4">
                <span className="text-xl font-black uppercase text-white">{s.label}</span>
                <span className="rounded-full bg-primary p-2 text-white transition group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-black py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Trabajos Realizados</p>
              <h2 className="mt-1 text-4xl font-black uppercase">Equipos que ya visten KitCraft</h2>
            </div>
            <Link to="/trabajos" className="hidden text-sm font-semibold uppercase text-white hover:text-primary md:inline">
              Ver toda la galería →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showcases.map((img, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                <img src={img.url} alt={`Uniforme ${i + 1}`} className="h-full w-full object-cover transition hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            <Truck className="h-4 w-4 text-primary" /> Envío gratis a España desde 10 uniformes
          </span>
          <h2 className="text-4xl font-black uppercase text-black md:text-5xl">
            Tu equipo, tus colores, <span className="text-primary">tu victoria.</span>
          </h2>
          <p className="max-w-xl text-black/70">
            Abre el diseñador, elige deporte, personaliza texto, número y logo. Nosotros lo confeccionamos.
          </p>
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Link to="/disenador">Empezar a diseñar</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
