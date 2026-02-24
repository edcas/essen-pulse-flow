import { useParams, Link } from "react-router-dom";
import { getEmpresa, getEmpleadosByEmpresa, getCentrosByEmpresa } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Users, MapPin, ClipboardCheck, FolderOpen, Network, GraduationCap,
  Search, Download, Building2, CheckCircle2, Clock, AlertCircle, Calendar, BarChart3, FileText
} from "lucide-react";

const deptColor: Record<string, string> = {
  Ventas: "bg-info/10 text-info border-info/20",
  RRHH: "bg-primary/10 text-primary border-primary/20",
  "Recursos Humanos": "bg-primary/10 text-primary border-primary/20",
  Operaciones: "bg-warning/10 text-warning border-warning/20",
  Finanzas: "bg-success/10 text-success border-success/20",
  Dirección: "bg-accent/10 text-accent border-accent/20",
  IT: "bg-info/10 text-info border-info/20",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("");
}

// Mock evaluations per company
const mockEvals = [
  { id: 1, name: "NOM-035 Anual", type: "NOM-035", status: "activa", respondents: 84, total: 200, end: "2026-03-01" },
  { id: 2, name: "Evaluación 360° Gerentes", type: "360°", status: "activa", respondents: 17, total: 20, end: "2026-03-10" },
  { id: 3, name: "Clima Organizacional Q1", type: "Clima", status: "activa", respondents: 102, total: 150, end: "2026-02-28" },
];

const typeColors: Record<string, string> = {
  "Clima": "bg-info/10 text-info border-info/20",
  "NOM-035": "bg-warning/10 text-warning border-warning/20",
  "360°": "bg-primary/10 text-primary border-primary/20",
};

// Simple org chart per company
interface OrgNode {
  name: string;
  position: string;
  initials: string;
  children?: OrgNode[];
}

const orgTemplate: OrgNode = {
  name: "Director General",
  position: "Dirección",
  initials: "DG",
  children: [
    {
      name: "Dir. Comercial",
      position: "Ventas",
      initials: "DC",
      children: [
        { name: "Supervisor A", position: "Ventas", initials: "SA" },
        { name: "Supervisor B", position: "Ventas", initials: "SB" },
      ],
    },
    {
      name: "Dir. RRHH",
      position: "RRHH",
      initials: "RH",
      children: [
        { name: "Analista RRHH", position: "RRHH", initials: "AR" },
      ],
    },
    {
      name: "Dir. Operaciones",
      position: "Operaciones",
      initials: "DO",
      children: [
        { name: "Coord. Logística", position: "Operaciones", initials: "CL" },
      ],
    },
  ],
};

function OrgNodeCard({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-xl border border-border bg-card p-3 shadow-card text-center min-w-[140px] hover:shadow-elevated transition-shadow cursor-pointer ${isRoot ? "ring-2 ring-primary/30" : ""}`}>
        <Avatar className="h-8 w-8 mx-auto mb-1.5">
          <AvatarFallback className={`text-xs font-semibold ${isRoot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            {node.initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs font-semibold">{node.name}</p>
        <p className="text-[10px] text-muted-foreground">{node.position}</p>
      </div>
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex gap-6 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: `calc(100% - 140px)` }} />
            )}
            {node.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <OrgNodeCard node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EmpresaDetail() {
  const { empresaId } = useParams();
  const empresa = getEmpresa(empresaId || "");
  const empleados = getEmpleadosByEmpresa(empresaId || "");
  const centros = getCentrosByEmpresa(empresaId || "");

  if (!empresa) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Empresa no encontrada</p>
        <Link to="/empresas">
          <Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="h-4 w-4" />Volver</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/empresas">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">{empresa.logo}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display">{empresa.name}</h1>
            <Badge variant={empresa.status === "activo" ? "default" : "secondary"}>{empresa.status}</Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">{empresa.plan}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{empresa.industry} · {empresa.contactName} · {empresa.contactEmail}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Reporte
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold font-display">{empresa.employees}</p>
              <p className="text-[10px] text-muted-foreground">Empleados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-info" />
            <div>
              <p className="text-lg font-bold font-display">{empresa.centros}</p>
              <p className="text-[10px] text-muted-foreground">Centros</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-success" />
            <div>
              <p className="text-lg font-bold font-display">{empresa.expedienteProgress}%</p>
              <p className="text-[10px] text-muted-foreground">Expediente</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-warning" />
            <div>
              <p className="text-lg font-bold font-display">{empresa.capacitacionProgress}%</p>
              <p className="text-[10px] text-muted-foreground">Capacitación</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="empleados" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="empleados" className="gap-1.5"><Users className="h-3.5 w-3.5" />Empleados</TabsTrigger>
          <TabsTrigger value="centros" className="gap-1.5"><MapPin className="h-3.5 w-3.5" />Centros de Trabajo</TabsTrigger>
          <TabsTrigger value="organigrama" className="gap-1.5"><Network className="h-3.5 w-3.5" />Organigrama</TabsTrigger>
          <TabsTrigger value="evaluaciones" className="gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" />Evaluaciones</TabsTrigger>
          <TabsTrigger value="expediente" className="gap-1.5"><FolderOpen className="h-3.5 w-3.5" />Expediente</TabsTrigger>
          <TabsTrigger value="capacitacion" className="gap-1.5"><GraduationCap className="h-3.5 w-3.5" />Capacitación</TabsTrigger>
        </TabsList>

        {/* Empleados */}
        <TabsContent value="empleados">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-display">Empleados de {empresa.name}</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar..." className="pl-10 h-8 text-sm bg-secondary border-0" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Centro</TableHead>
                    <TableHead>RFC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleados.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No hay empleados registrados</TableCell></TableRow>
                  ) : empleados.map((emp) => (
                    <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">{getInitials(emp.name)}</AvatarFallback></Avatar>
                          <span className="font-medium text-sm">{emp.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{emp.position}</TableCell>
                      <TableCell><Badge variant="outline" className={deptColor[emp.department] || ""}>{emp.department}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{emp.centro}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{emp.rfc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Centros de Trabajo */}
        <TabsContent value="centros">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centros.map((c) => (
              <Card key={c.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 shrink-0">
                      <Building2 className="h-5 w-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.address}</p>
                      <p className="text-xs text-muted-foreground">{c.city}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{c.employees} empleados</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Organigrama */}
        <TabsContent value="organigrama">
          <Card className="shadow-card overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-sm font-display">Organigrama de {empresa.name}</CardTitle>
            </CardHeader>
            <CardContent className="py-8 flex justify-center min-w-[700px]">
              <OrgNodeCard node={orgTemplate} isRoot />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluaciones */}
        <TabsContent value="evaluaciones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEvals.map((ev) => (
              <Card key={ev.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-display">{ev.name}</CardTitle>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className={typeColors[ev.type] || ""}>{ev.type}</Badge>
                      <Badge>Activa</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Vence: {ev.end}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev.total} asignados</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Cobertura</span>
                      <span className="font-medium">{Math.round((ev.respondents / ev.total) * 100)}%</span>
                    </div>
                    <Progress value={(ev.respondents / ev.total) * 100} className="h-1.5" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 flex-1"><BarChart3 className="h-3 w-3" />Resultados</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 flex-1"><FileText className="h-3 w-3" />PDF</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expediente */}
        <TabsContent value="expediente">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display">Expediente Digital - {empresa.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Docs. entregados</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleados.map((emp, i) => {
                    const docs = Math.min(8, 3 + i * 2);
                    const total = 8;
                    const pct = Math.round((docs / total) * 100);
                    const status = pct === 100 ? "completo" : pct >= 50 ? "parcial" : "pendiente";
                    const stConfig = {
                      completo: { label: "Completo", icon: CheckCircle2, cls: "bg-success/10 text-success border-success/20" },
                      parcial: { label: "Parcial", icon: Clock, cls: "bg-warning/10 text-warning border-warning/20" },
                      pendiente: { label: "Pendiente", icon: AlertCircle, cls: "bg-destructive/10 text-destructive border-destructive/20" },
                    }[status];
                    const StIcon = stConfig.icon;
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium text-sm">{emp.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{docs}/{total}</TableCell>
                        <TableCell><Progress value={pct} className="h-1.5 w-24" /></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={stConfig.cls}><StIcon className="h-3 w-3 mr-1" />{stConfig.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacitación */}
        <TabsContent value="capacitacion">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-display">Avance de Capacitación - {empresa.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Inducción General", "Seguridad Industrial", "Liderazgo"].map((route, i) => {
                const pct = [72, 88, 45][i];
                return (
                  <div key={route} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{route}</span>
                      <span className="text-sm font-semibold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
