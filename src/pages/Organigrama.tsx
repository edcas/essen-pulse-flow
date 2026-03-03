import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ZoomIn, ZoomOut, Download, Maximize2, Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface OrgNode {
  name: string;
  position: string;
  department: string;
  initials: string;
  email: string;
  phone: string;
  centro: string;
  photo: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  name: "Roberto Flores Vega",
  position: "Director General",
  department: "Dirección",
  initials: "RF",
  email: "rflores@acme.com",
  phone: "+52 55 1234 5678",
  centro: "Oficinas Centrales",
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  children: [
    {
      name: "María García López",
      position: "Dir. Comercial",
      department: "Ventas",
      initials: "MG",
      email: "mgarcia@acme.com",
      phone: "+52 55 2345 6789",
      centro: "CDMX Norte",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Carlos Martínez Ruiz", position: "Supervisor Norte", department: "Ventas", initials: "CM", email: "cmartinez@acme.com", phone: "+52 81 3456 7890", centro: "Monterrey", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { name: "Laura Torres Díaz", position: "Supervisor Sur", department: "Ventas", initials: "LT", email: "ltorres@acme.com", phone: "+52 33 4567 8901", centro: "Guadalajara", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face" },
      ],
    },
    {
      name: "Ana Rodríguez Sánchez",
      position: "Dir. RRHH",
      department: "RRHH",
      initials: "AR",
      email: "arodriguez@acme.com",
      phone: "+52 55 5678 9012",
      centro: "Oficinas Centrales",
      photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Juan Pérez Hernández", position: "Analista RRHH", department: "RRHH", initials: "JP", email: "jperez@acme.com", phone: "+52 55 6789 0123", centro: "CDMX Centro", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { name: "Patricia Mendoza Cruz", position: "Contadora", department: "Finanzas", initials: "PM", email: "pmendoza@acme.com", phone: "+52 44 7890 1234", centro: "Querétaro", photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop&crop=face" },
      ],
    },
    {
      name: "Diego Ramírez Ortega",
      position: "Dir. Operaciones",
      department: "Operaciones",
      initials: "DR",
      email: "dramirez@acme.com",
      phone: "+52 55 8901 2345",
      centro: "Oficinas Centrales",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Sofía López Castillo", position: "Coord. Logística", department: "Operaciones", initials: "SL", email: "slopez@acme.com", phone: "+52 22 9012 3456", centro: "Puebla", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
      ],
    },
  ],
};

const deptColor: Record<string, string> = {
  Ventas: "bg-info/10 text-info border-info/20",
  RRHH: "bg-primary/10 text-primary border-primary/20",
  Operaciones: "bg-warning/10 text-warning border-warning/20",
  Finanzas: "bg-success/10 text-success border-success/20",
  Dirección: "bg-accent/10 text-accent border-accent/20",
};

function OrgNodeCard({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className={`rounded-xl border border-border bg-card p-4 shadow-card text-center min-w-[180px] hover:shadow-elevated transition-shadow cursor-pointer ${isRoot ? "ring-2 ring-primary/30" : ""}`}>
            <Avatar className="h-12 w-12 mx-auto mb-2">
              <AvatarImage src={node.photo} alt={node.name} className="object-cover" />
              <AvatarFallback className={`text-xs font-semibold ${isRoot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {node.initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold">{node.name}</p>
            <p className="text-xs text-muted-foreground">{node.position}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{node.email}</p>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-72" side="right" sideOffset={8}>
          <div className="flex gap-3">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={node.photo} alt={node.name} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{node.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{node.name}</h4>
              <p className="text-xs text-muted-foreground">{node.position}</p>
              <Badge variant="outline" className={`text-[10px] ${deptColor[node.department] || ""}`}>{node.department}</Badge>
            </div>
          </div>
          <div className="mt-3 space-y-2 border-t pt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{node.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{node.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{node.centro}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{node.department}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border"
                style={{ width: `calc(100% - 180px)` }}
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
          <Button variant="outline" size="sm" className="gap-1"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="gap-1"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="gap-1"><Maximize2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
        </div>
      </div>

      <Card className="shadow-card overflow-x-auto">
        <CardContent className="py-10 flex justify-center min-w-[900px]">
          <OrgNodeCard node={orgData} isRoot />
        </CardContent>
      </Card>
    </div>
  );
}
