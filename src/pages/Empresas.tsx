import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Building2, Users, MapPin, ClipboardCheck, ArrowRight } from "lucide-react";
import { empresas } from "@/data/mockData";
import { Link } from "react-router-dom";

const planColor: Record<string, string> = {
  Premium: "bg-accent/10 text-accent border-accent/20",
  Estándar: "bg-info/10 text-info border-info/20",
  Básico: "bg-muted text-muted-foreground border-border",
};

export default function Empresas() {
  const activas = empresas.filter((e) => e.status === "activo").length;
  const totalEmployees = empresas.reduce((s, e) => s + e.employees, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Empresas Cliente</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de empresas que contratan servicios ESSEN</p>
        </div>
        <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
          <Plus className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{empresas.length}</p>
                <p className="text-xs text-muted-foreground">Total empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Building2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{activas}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{totalEmployees.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Empleados totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <ClipboardCheck className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{empresas.reduce((s, e) => s + e.activeEvals, 0)}</p>
                <p className="text-xs text-muted-foreground">Evaluaciones activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar empresa..." className="pl-10 bg-secondary border-0" />
      </div>

      {/* Company cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empresas.map((emp) => (
          <Link key={emp.id} to={`/empresas/${emp.id}`}>
            <Card className="shadow-card hover:shadow-elevated transition-all cursor-pointer group h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                        {emp.logo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-display group-hover:text-primary transition-colors">{emp.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{emp.industry}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={planColor[emp.plan]}>{emp.plan}</Badge>
                  <Badge variant={emp.status === "activo" ? "default" : "secondary"}>
                    {emp.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary p-2">
                    <p className="text-sm font-bold font-display">{emp.employees}</p>
                    <p className="text-[10px] text-muted-foreground">Empleados</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-2">
                    <p className="text-sm font-bold font-display">{emp.centros}</p>
                    <p className="text-[10px] text-muted-foreground">Centros</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-2">
                    <p className="text-sm font-bold font-display">{emp.activeEvals}</p>
                    <p className="text-[10px] text-muted-foreground">Eval. activas</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Expediente</span>
                      <span className="font-medium">{emp.expedienteProgress}%</span>
                    </div>
                    <Progress value={emp.expedienteProgress} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Capacitación</span>
                      <span className="font-medium">{emp.capacitacionProgress}%</span>
                    </div>
                    <Progress value={emp.capacitacionProgress} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
