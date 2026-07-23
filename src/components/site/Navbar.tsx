import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { SizeGuideButton } from "./SizeGuide";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/disenador", label: "Diseñador" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/trabajos", label: "Trabajos Realizados" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="ORE Sports / KitCraft" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold uppercase tracking-wide text-white/80 transition hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <SizeGuideButton />
        </nav>
        <button
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-black lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm font-semibold uppercase text-white/90 hover:bg-white/10"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <SizeGuideButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
