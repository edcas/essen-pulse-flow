import StatCard from "@/components/StatCard";
import { Users, FolderOpen, ClipboardCheck, GraduationCap, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const recentActivity = [
  { action: "Evaluación 360° asignada", target: "Equipo Ventas Norte", time: "Hace 2h", type: "evaluacion" },
  { action: "Documentos completados", target: "María García López", time: "Hace 3h", type: "expediente" },
  { action: "Curso completado", target: "Juan Pérez - Inducción General", time: "Hace 5h", type: "capacitacion" },
  { action: "Aviso publicado", target: "Política de vacaciones 2026", time: "Hace 1d", type: "aviso" },
  { action: "NOM-035 aplicada", target: "Centro CDMX - 45 empleados", time: "Hace 1d", type: "evaluacion" },
];

const pendingEvals = [
  { name: "Clima Organizacional Q1", progress: 68, total: 150, completed: 102 },
  { name: "NOM-035 Anual", progress: 42, total: 200, completed: 84 },
  { name: "Evaluación 360° Gerentes", progress: 85, total: 20, completed: 17 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen general de la plataforma ESSEN</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Empleados"
          value="1,248"
          subtitle="12 centros de trabajo"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: "3.2% este mes", positive: true }}
        />
        <StatCard
          title="Expedientes Completos"
          value="87%"
          subtitle="1,086 de 1,248"
          icon={<FolderOpen className="h-5 w-5" />}
          trend={{ value: "5% vs mes anterior", positive: true }}
        />
        <StatCard
          title="Evaluaciones Activas"
          value="3"
          subtitle="365 pendientes de contestar"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Capacitación"
          value="72%"
          subtitle="Avance promedio"
          icon={<GraduationCap className="h-5 w-5" />}
          trend={{ value: "8% esta semana", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluaciones en progreso */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Evaluaciones en Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingEvals.map((ev) => (
              <div key={ev.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ev.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ev.completed}/{ev.total} ({ev.progress}%)
                  </span>
                </div>
                <Progress value={ev.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-destructive/5 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">162 expedientes incompletos</p>
                <p className="text-xs text-muted-foreground">Documentos faltantes en 3 centros</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-warning/5 p-3">
              <Clock className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">NOM-035 vence en 5 días</p>
                <p className="text-xs text-muted-foreground">84 de 200 han contestado</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-success/5 p-3">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Sincronización BeePayroll OK</p>
                <p className="text-xs text-muted-foreground">Última sync: hace 30 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.target}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
