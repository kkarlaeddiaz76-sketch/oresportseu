import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

const men = [
  { t: "S", h: 90, w: 50 }, { t: "M", h: 90, w: 52 }, { t: "L", h: 90, w: 56 },
  { t: "XL", h: 90, w: 62 }, { t: "2XL", h: 90, w: 67 }, { t: "3XL", h: 90, w: 72 }, { t: "4XL", h: 90, w: 77 },
];
const women = [
  { t: "S", h: 81, w: 48 }, { t: "M", h: 81, w: 51 }, { t: "L", h: 83, w: 53 },
  { t: "XL", h: 83, w: 56 }, { t: "2XL", h: 86, w: 62 }, { t: "3XL", h: 88, w: 67 }, { t: "4XL", h: 88, w: 72 },
];
const kids = [
  { t: "4", h: 57, w: 34 }, { t: "8", h: 62, w: 38 }, { t: "12", h: 68, w: 42 },
  { t: "14", h: 69, w: 44 }, { t: "16", h: 71, w: 46 },
];

function Table({ rows }: { rows: { t: string; h: number; w: number }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10">
      <table className="w-full text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-3 text-left font-semibold">TALLA</th>
            {rows.map((r) => <th key={r.t} className="p-3 text-center font-semibold">{r.t}</th>)}
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          <tr className="border-t border-black/10">
            <td className="p-3 font-medium">ALTO (cm)</td>
            {rows.map((r) => <td key={r.t} className="p-3 text-center">{r.h}</td>)}
          </tr>
          <tr className="border-t border-black/10">
            <td className="p-3 font-medium">ANCHO (cm)</td>
            {rows.map((r) => <td key={r.t} className="p-3 text-center">{r.w}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideButton({ variant = "outline" }: { variant?: "outline" | "ghost" | "default" }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="gap-2 border-black text-black hover:bg-black hover:text-white">
          <Ruler className="h-4 w-4" /> Guía de Tallas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">Guía de Tallas</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="men">
          <TabsList className="grid w-full grid-cols-3 bg-black">
            <TabsTrigger value="men" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white">HOMBRE</TabsTrigger>
            <TabsTrigger value="women" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white">DAMAS</TabsTrigger>
            <TabsTrigger value="kids" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white">NIÑOS</TabsTrigger>
          </TabsList>
          <TabsContent value="men" className="mt-4"><Table rows={men} /></TabsContent>
          <TabsContent value="women" className="mt-4"><Table rows={women} /></TabsContent>
          <TabsContent value="kids" className="mt-4"><Table rows={kids} /></TabsContent>
        </Tabs>
        <p className="mt-2 text-xs text-muted-foreground">
          La medida de <b>Alto</b> se toma desde el hombro hasta el borde inferior. El <b>Ancho</b> se mide de axila a axila.
        </p>
      </DialogContent>
    </Dialog>
  );
}
