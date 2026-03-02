import StatCard from "@/components/StatCard";
import { Building2, Users, ClipboardCheck, GraduationCap, TrendingUp, BarChart3, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { empresas } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const totalEmployees = empresas.reduce((s, e) => s + e.employees, 0);
const activeCompanies = empresas.filter((e) => e.status === "activo").length;
const totalEvals = empresas.reduce((s, e) => s + e.activeEvals, 0);
const avgExpediente = Math.round(empresas.reduce((s, e) => s + e.expedienteProgress, 0) / empresas.length);
const avgCapacitacion = Math.round(empresas.reduce((s, e) => s + e.capacitacionProgress, 0) / empresas.length);

const recentActivity = [
  { action: "NOM-035 completada", target: "ACME Corp — Planta Norte", time: "Hace 1h" },
  { action: "Nueva empresa registrada", target: "ConstruMex", time: "Hace 3h" },
  { action: "Evaluación 360° iniciada", target: "Grupo Alfa — Gerentes", time: "Hace 5h" },
  { action: "Expedientes completados al 100%", target: "TechMex SA", time: "Hace 1d" },
  { action: "Ruta de capacitación asignada", target: "LogiMex — Operaciones", time: "Hace 1d" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard ESSEN</h1>
        <p className="text-sm text-muted-foreground mt-1">Vista general de todos los clientes y servicios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Empresas Activas" value={activeCompanies} subtitle={`${empresas.length} totales`} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Empleados Totales" value={totalEmployees.toLocaleString()} subtitle={`${empresas.reduce((s, e) => s + e.centros, 0)} centros de trabajo`} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Evaluaciones Activas" value={totalEvals} icon={<ClipboardCheck className="h-5 w-5" />} trend={{ value: "2 nuevas esta semana", positive: true }} />
        <StatCard title="Expediente Promedio" value={`${avgExpediente}%`} icon={<FolderOpen className="h-5 w-5" />} />
        <StatCard title="Capacitación Promedio" value={`${avgCapacitacion}%`} icon={<GraduationCap className="h-5 w-5" />} trend={{ value: "5% vs mes anterior", positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies overview */}
        <Card className="lg:col-span-3 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Resumen por Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {empresas.filter(e => e.status === "activo").map((emp) => (
              <Link key={emp.id} to={`/empresas/${emp.id}`} className="block">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{emp.logo}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{emp.name}</p>
                      <Badge variant="outline" className="text-[10px]">{emp.plan}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{emp.employees} emp.</span>
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-[10px] text-muted-foreground w-14">Expediente</span>
                        <Progress value={emp.expedienteProgress} className="h-1 flex-1" />
                        <span className="text-[10px] font-medium w-8 text-right">{emp.expedienteProgress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* Servicios activos por empresa */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Servicios Activos por Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Empresa</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">NOM-035</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">360°</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">9-Box</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Clima</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Capacitación</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Expediente</th>
                </tr>
              </thead>
              <tbody>
                {empresas.filter(e => e.status === "activo").map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium">{emp.name}</td>
                    <td className="text-center py-2.5"><Badge variant="default" className="text-[10px] h-5">Activa</Badge></td>
                    <td className="text-center py-2.5">{emp.activeEvals > 1 ? <Badge variant="default" className="text-[10px] h-5">Activa</Badge> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="text-center py-2.5">{emp.plan === "Premium" ? <Badge variant="default" className="text-[10px] h-5">Activa</Badge> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="text-center py-2.5"><Badge variant="default" className="text-[10px] h-5">Activa</Badge></td>
                    <td className="text-center py-2.5"><Badge variant="secondary" className="text-[10px] h-5">{emp.capacitacionProgress}%</Badge></td>
                    <td className="text-center py-2.5"><Badge variant="secondary" className="text-[10px] h-5">{emp.expedienteProgress}%</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
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
