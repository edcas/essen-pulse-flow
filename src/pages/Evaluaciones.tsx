import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Users, Calendar, BarChart3, FileText, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  {
    id: 1,
    name: "Clima Organizacional Q1 2026",
    type: "Clima",
    status: "activa",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    respondents: 102,
    total: 150,
    company: "ACME Corp",
  },
  {
    id: 2,
    name: "NOM-035 Anual",
    type: "NOM-035",
    status: "activa",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    respondents: 84,
    total: 200,
    company: "TechMex SA",
  },
  {
    id: 3,
    name: "Evaluación 360° Gerentes",
    type: "360°",
    status: "activa",
    startDate: "2026-02-10",
    endDate: "2026-03-10",
    respondents: 17,
    total: 20,
    company: "ACME Corp",
  },
  {
    id: 4,
    name: "Evaluación Desempeño 90° - Operaciones",
    type: "90°",
    status: "finalizada",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    respondents: 45,
    total: 45,
    company: "LogiMex",
  },
];

const typeColors: Record<string, string> = {
  "Clima": "bg-info/10 text-info border-info/20",
  "NOM-035": "bg-warning/10 text-warning border-warning/20",
  "360°": "bg-primary/10 text-primary border-primary/20",
  "90°": "bg-success/10 text-success border-success/20",
};

const nineBox = [
  ["Enigma", "Estrella en Crecimiento", "Estrella"],
  ["Dilema", "Core Employee", "Alto Desempeño"],
  ["Riesgo", "Efectivo Limitado", "Experto Técnico"],
];

const nineBoxColors = [
  ["bg-warning/20", "bg-info/20", "bg-success/20"],
  ["bg-warning/10", "bg-muted", "bg-info/10"],
  ["bg-destructive/10", "bg-warning/10", "bg-muted"],
];

const nineBoxCounts = [
  [3, 8, 5],
  [4, 25, 12],
  [2, 6, 10],
];

export default function Evaluaciones() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Evaluaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de campañas de evaluación y cuestionarios</p>
        </div>
        <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      <Tabs defaultValue="campanas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campanas">Campañas</TabsTrigger>
          <TabsTrigger value="9box">Matriz 9-Box</TabsTrigger>
          <TabsTrigger value="competencias">Competencias</TabsTrigger>
        </TabsList>

        <TabsContent value="campanas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => (
              <Card key={c.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-display">{c.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{c.company}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className={typeColors[c.type] || ""}>{c.type}</Badge>
                      <Badge variant={c.status === "activa" ? "default" : "secondary"}>
                        {c.status === "activa" ? "Activa" : "Finalizada"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.startDate} → {c.endDate}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.total} asignados</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Cobertura</span>
                      <span className="font-medium">{Math.round((c.respondents / c.total) * 100)}%</span>
                    </div>
                    <Progress value={(c.respondents / c.total) * 100} className="h-1.5" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 flex-1">
                      <BarChart3 className="h-3 w-3" />
                      Resultados
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 flex-1">
                      <FileText className="h-3 w-3" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="9box" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-display">Matriz de Talento (9-Box)</CardTitle>
              <p className="text-xs text-muted-foreground">Arrastra y suelta empleados para calibrar posiciones</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div />
                <div className="text-center text-xs font-medium text-muted-foreground pb-1">Desempeño Medio</div>
                <div />
              </div>

              <div className="flex gap-4">
                {/* Y axis label */}
                <div className="flex flex-col justify-center -mr-2">
                  <span className="text-xs font-medium text-muted-foreground [writing-mode:vertical-lr] rotate-180">
                    Potencial →
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 flex-1">
                  {nineBox.map((row, ri) =>
                    row.map((cell, ci) => (
                      <div
                        key={`${ri}-${ci}`}
                        className={`${nineBoxColors[ri][ci]} rounded-lg p-4 min-h-[100px] flex flex-col items-center justify-center text-center border border-border/50 hover:border-primary/30 transition-colors cursor-pointer`}
                      >
                        <span className="text-xs font-semibold">{cell}</span>
                        <span className="text-lg font-bold font-display mt-1">{nineBoxCounts[ri][ci]}</span>
                        <span className="text-[10px] text-muted-foreground">empleados</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <span className="text-xs font-medium text-muted-foreground">← Desempeño →</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competencias" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Biblioteca de Competencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {["Liderazgo", "Comunicación", "Trabajo en Equipo", "Orientación a Resultados", "Innovación", "Adaptabilidad"].map((comp) => (
                  <div key={comp} className="rounded-lg border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer">
                    <h4 className="text-sm font-semibold">{comp}</h4>
                    <p className="text-xs text-muted-foreground mt-1">5 indicadores de comportamiento</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="h-1.5 flex-1 rounded-full bg-primary/20" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
