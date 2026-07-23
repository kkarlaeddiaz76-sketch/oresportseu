import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { waLink } from "@/components/site/WhatsAppButton";
import { z } from "zod";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — ORE Sports / KitCraft" },
      { name: "description", content: "Contacta con KitCraft para cotizar tu uniforme deportivo." },
      { property: "og:title", content: "Contacto — KitCraft" },
      { property: "og:description", content: "Escríbenos por WhatsApp o email." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { setErr(r.error.issues[0].message); return; }
    setErr(null);
    const msg = `Hola KitCraft, soy ${form.name} (${form.email}).\n${form.message}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Contacto</p>
      <h1 className="mb-10 text-4xl font-black uppercase text-black md:text-5xl">Hablemos de tu equipo</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <form onSubmit={submit} className="rounded-2xl border-2 border-black bg-white p-6">
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} />
            </div>
            <div>
              <Label>Mensaje</Label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                maxLength={1000}
                className="w-full rounded-md border border-black/20 p-3 text-sm"
              />
            </div>
            {err && <p className="text-sm text-primary">{err}</p>}
            <Button type="submit" size="lg" className="w-full bg-primary text-white hover:bg-primary/90">
              Enviar por WhatsApp
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-black bg-black p-6 text-white">
            <h3 className="text-lg font-black uppercase">Canales directos</h3>
            <div className="mt-4 space-y-3 text-sm">
              <a href={waLink("Hola KitCraft, quiero información.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary">
                <MessageCircle className="h-5 w-5 text-primary" /> WhatsApp directo
              </a>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> hola@ore.sports.eu</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> España — Envíos a toda Europa</div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-black bg-primary p-6 text-white">
            <p className="text-2xl font-black uppercase">🚚 Envío gratis</p>
            <p className="mt-1 text-sm text-white/90">A toda España a partir de 10 uniformes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
