import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowRightLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const syncLogs = [
  { id: 1, direction: "BeePayroll → ESSEN", type: "Altas", records: 12, status: "exitoso", time: "Hace 30 min" },
  { id: 2, direction: "ESSEN → BeePayroll", type: "Actualización datos", records: 5, status: "exitoso", time: "Hace 30 min" },
  { id: 3, direction: "BeePayroll → ESSEN", type: "Bajas", records: 2, status: "exitoso", time: "Hace 1 hr" },
  { id: 4, direction: "ESSEN → BeePayroll", type: "Cambio de puesto", records: 1, status: "error", time: "Hace 2 hrs" },
  { id: 5, direction: "BeePayroll → ESSEN", type: "Actualización nómina", records: 248, status: "exitoso", time: "Hace 3 hrs" },
];

export default function Sincronizacion() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Sincronización</h1>
          <p className="text-sm text-muted-foreground mt-1">Sincronización bidireccional con BeePayroll</p>
        </div>
        <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
          <RefreshCw className="h-4 w-4" />
          Sincronizar Ahora
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">98.5%</p>
                <p className="text-xs text-muted-foreground">Tasa de éxito</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <ArrowRightLeft className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">268</p>
                <p className="text-xs text-muted-foreground">Registros hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">30 min</p>
                <p className="text-xs text-muted-foreground">Última sincronización</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-display">Historial de Sincronización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {log.status === "exitoso" ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{log.direction}</p>
                    <p className="text-xs text-muted-foreground">{log.type} · {log.records} registros</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={log.status === "exitoso" ? "secondary" : "destructive"} className="text-xs">
                    {log.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
