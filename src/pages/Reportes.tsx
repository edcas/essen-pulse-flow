import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ShieldCheck, Grid3X3, Users, Loader2 } from "lucide-react";
import { empresas } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badgeLabel: string;
  badgeClass: string;
}

const reports: ReportCard[] = [
  {
    id: "nom035",
    title: "Reporte NOM-035",
    description: "Dashboard de riesgos psicosociales por categoría, dominio y resultado general. Incluye semáforos y recomendaciones.",
    icon: <ShieldCheck className="h-6 w-6" />,
    badgeLabel: "NOM-035",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
  },
  {
    id: "9box",
    title: "Reporte Matriz 9-Box",
    description: "Matriz de talento con posicionamiento de empleados, cuadrantes personalizados, íconos y colores.",
    icon: <Grid3X3 className="h-6 w-6" />,
    badgeLabel: "9-Box",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  {
    id: "360",
    title: "Reporte Evaluación 360°",
    description: "Resultados de evaluación de desempeño 360° con análisis por competencia, evaluadores y plan de acción.",
    icon: <Users className="h-6 w-6" />,
    badgeLabel: "360°",
    badgeClass: "bg-info/10 text-info border-info/20",
  },
];

export default function Reportes() {
  const [selectedEmpresa, setSelectedEmpresa] = useState<Record<string, string>>({});
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (reportId: string) => {
    const empresa = selectedEmpresa[reportId];
    if (!empresa) {
      toast({ title: "Selecciona una empresa", description: "Debes seleccionar una empresa antes de descargar el reporte.", variant: "destructive" });
      return;
    }
    const empresaName = empresas.find(e => e.id === empresa)?.name;
    setDownloading(reportId);
    setTimeout(() => {
      setDownloading(null);
      toast({ title: "Reporte generado", description: `${reports.find(r => r.id === reportId)?.title} — ${empresaName} descargado exitosamente.` });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-1">Genera y descarga reportes en PDF por empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-card hover:shadow-elevated transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-foreground">
                  {report.icon}
                </div>
                <Badge variant="outline" className={report.badgeClass}>{report.badgeLabel}</Badge>
              </div>
              <CardTitle className="text-base font-display mt-3">{report.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">{report.description}</p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Empresa</label>
                  <Select
                    value={selectedEmpresa[report.id] || ""}
                    onValueChange={(val) => setSelectedEmpresa((prev) => ({ ...prev, [report.id]: val }))}
                  >
                    <SelectTrigger className="h-9 bg-secondary border-0">
                      <SelectValue placeholder="Selecciona empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.filter(e => e.status === "activo").map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => handleDownload(report.id)}
                  disabled={!selectedEmpresa[report.id] || downloading === report.id}
                  className="w-full gap-2 gradient-primary text-primary-foreground border-0"
                  size="sm"
                >
                  {downloading === report.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Generando...</>
                  ) : (
                    <><Download className="h-4 w-4" />Descargar PDF</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
