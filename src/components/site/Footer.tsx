import logo from "@/assets/logo.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={logo.url} alt="ORE Sports" className="h-14 w-auto" />
          <p className="mt-4 text-sm text-white/70">
            Uniformes deportivos personalizados. Made for the win.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase text-primary">Contacto</h4>
          <p className="text-sm text-white/70">Venezuela · Envíos internacionales</p>
          <p className="text-sm text-white/70">WhatsApp: +58 424-9669070</p>
          <p className="text-sm text-white/70">hola@ore.sports.eu</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase text-primary">Deportes</h4>
          <p className="text-sm text-white/70">Fútbol · Baloncesto · Béisbol · Softball · Kickingball</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ORE Sports / KitCraft — Todos los derechos reservados
      </div>
    </footer>
  );
}
