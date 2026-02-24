import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";

interface OrgNode {
  name: string;
  position: string;
  department: string;
  initials: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  name: "Roberto Flores",
  position: "Director General",
  department: "Dirección",
  initials: "RF",
  children: [
    {
      name: "María García",
      position: "Dir. Comercial",
      department: "Ventas",
      initials: "MG",
      children: [
        { name: "Carlos Martínez", position: "Supervisor Norte", department: "Ventas", initials: "CM" },
        { name: "Laura Torres", position: "Supervisor Sur", department: "Ventas", initials: "LT" },
      ],
    },
    {
      name: "Ana Rodríguez",
      position: "Dir. RRHH",
      department: "RRHH",
      initials: "AR",
      children: [
        { name: "Juan Pérez", position: "Analista RRHH", department: "RRHH", initials: "JP" },
        { name: "Patricia Mendoza", position: "Contadora", department: "Finanzas", initials: "PM" },
      ],
    },
    {
      name: "Diego Ramírez",
      position: "Dir. Operaciones",
      department: "Operaciones",
      initials: "DR",
      children: [
        { name: "Sofía López", position: "Coord. Logística", department: "Operaciones", initials: "SL" },
      ],
    },
  ],
};

function OrgNodeCard({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-xl border border-border bg-card p-4 shadow-card text-center min-w-[160px] hover:shadow-elevated transition-shadow cursor-pointer ${isRoot ? "ring-2 ring-primary/30" : ""}`}>
        <Avatar className="h-10 w-10 mx-auto mb-2">
          <AvatarFallback className={`text-xs font-semibold ${isRoot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            {node.initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold">{node.name}</p>
        <p className="text-xs text-muted-foreground">{node.position}</p>
        <Badge variant="secondary" className="mt-1.5 text-[10px]">{node.department}</Badge>
      </div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border"
                style={{
                  width: `calc(100% - 160px)`,
                }}
              />
            )}
            {node.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgNodeCard node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Organigrama() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Organigrama</h1>
          <p className="text-sm text-muted-foreground mt-1">Estructura organizacional dinámica</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card className="shadow-card overflow-x-auto">
        <CardContent className="py-10 flex justify-center min-w-[800px]">
          <OrgNodeCard node={orgData} isRoot />
        </CardContent>
      </Card>
    </div>
  );
}
