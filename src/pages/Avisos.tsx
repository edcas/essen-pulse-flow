import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Send, Bell, Calendar, Users, Eye } from "lucide-react";

const avisos = [
  {
    id: 1,
    title: "Política de Vacaciones 2026",
    content: "Se ha actualizado la política de vacaciones conforme a la reforma laboral...",
    date: "2026-02-20",
    segment: "Todos",
    status: "publicado",
    views: 834,
  },
  {
    id: 2,
    title: "Capacitación Obligatoria NOM-035",
    content: "Recordatorio: todos los colaboradores deben completar la evaluación NOM-035 antes del 1 de marzo...",
    date: "2026-02-18",
    segment: "CDMX, Monterrey",
    status: "publicado",
    views: 612,
  },
  {
    id: 3,
    title: "Evento de Integración Marzo",
    content: "Se llevará a cabo el evento anual de integración el próximo 15 de marzo...",
    date: "2026-02-15",
    segment: "Corporativo",
    status: "borrador",
    views: 0,
  },
  {
    id: 4,
    title: "Actualización de Beneficios",
    content: "A partir de marzo se incorporan nuevos beneficios al paquete de compensaciones...",
    date: "2026-02-10",
    segment: "Todos",
    status: "programado",
    views: 0,
  },
];

const statusStyle: Record<string, string> = {
  publicado: "bg-success/10 text-success border-success/20",
  borrador: "bg-muted text-muted-foreground border-border",
  programado: "bg-info/10 text-info border-info/20",
};

export default function Avisos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Avisos y Notificaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Crea y envía comunicados a tus trabajadores</p>
        </div>
        <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
          <Plus className="h-4 w-4" />
          Nuevo Aviso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {avisos.map((aviso) => (
          <Card key={aviso.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-display">{aviso.title}</CardTitle>
                <Badge variant="outline" className={statusStyle[aviso.status]}>
                  {aviso.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{aviso.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{aviso.date}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{aviso.segment}</span>
                {aviso.views > 0 && (
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{aviso.views} vistas</span>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                {aviso.status === "borrador" && (
                  <Button size="sm" className="h-7 text-xs gap-1 gradient-primary text-primary-foreground border-0">
                    <Send className="h-3 w-3" />
                    Publicar
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
