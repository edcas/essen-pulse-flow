import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmpresa, getEmpleadosByEmpresa, getCentrosByEmpresa } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Users, MapPin, ClipboardCheck, FolderOpen, Network, GraduationCap,
  Search, Download, Building2, CheckCircle2, Clock, AlertCircle, Calendar, BarChart3, FileText,
  BrainCircuit, Sparkles, Pencil, Save, ShieldAlert, TrendingUp, Lightbulb, ChevronDown, ChevronUp,
  Mail, Phone, Briefcase, Timer, FileWarning
} from "lucide-react";
import { CheckMethodsTable } from "@/components/reloj-checador/CheckMethodsTable";
import { DeviceTable } from "@/components/reloj-checador/DeviceTable";
import { OfficeLocationsTable } from "@/components/reloj-checador/OfficeLocationsTable";
import { IncidenceLibrary } from "@/components/incidence/IncidenceLibrary";
import { ApprovalFlowLibrary } from "@/components/approval/ApprovalFlowLibrary";
import { HolidayCalendarView } from "@/components/holiday/HolidayCalendarView";
import { Device } from "@/types/device";
import { IncidenceConfig, defaultIncidences } from "@/types/incidence";
import { ApprovalFlow, defaultApprovalFlows } from "@/types/approval-flow";
import { Holiday, defaultHolidays } from "@/types/holiday";
import { useToast } from "@/hooks/use-toast";

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

const orgTemplate: OrgNode = {
  name: "Roberto Flores Vega", position: "Director General", department: "Dirección", initials: "RF",
  email: "rflores@acme.com", phone: "+52 55 1234 5678", centro: "Oficinas Centrales",
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  children: [
    { name: "María García López", position: "Dir. Comercial", department: "Ventas", initials: "MG",
      email: "mgarcia@acme.com", phone: "+52 55 2345 6789", centro: "CDMX Norte",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Carlos Martínez Ruiz", position: "Supervisor Norte", department: "Ventas", initials: "CM", email: "cmartinez@acme.com", phone: "+52 81 3456 7890", centro: "Monterrey", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { name: "Laura Torres Díaz", position: "Supervisor Sur", department: "Ventas", initials: "LT", email: "ltorres@acme.com", phone: "+52 33 4567 8901", centro: "Guadalajara", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face" },
      ],
    },
    { name: "Ana Rodríguez Sánchez", position: "Dir. RRHH", department: "RRHH", initials: "AR",
      email: "arodriguez@acme.com", phone: "+52 55 5678 9012", centro: "Oficinas Centrales",
      photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Juan Pérez Hernández", position: "Analista RRHH", department: "RRHH", initials: "JP", email: "jperez@acme.com", phone: "+52 55 6789 0123", centro: "CDMX Centro", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      ],
    },
    { name: "Diego Ramírez Ortega", position: "Dir. Operaciones", department: "Operaciones", initials: "DR",
      email: "dramirez@acme.com", phone: "+52 55 8901 2345", centro: "Oficinas Centrales",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      children: [
        { name: "Sofía López Castillo", position: "Coord. Logística", department: "Operaciones", initials: "SL", email: "slopez@acme.com", phone: "+52 22 9012 3456", centro: "Puebla", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
      ],
    },
  ],
};

function OrgNodeCard({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className={`rounded-xl border border-border bg-card p-3 shadow-card text-center min-w-[160px] hover:shadow-elevated transition-shadow cursor-pointer ${isRoot ? "ring-2 ring-primary/30" : ""}`}>
            <Avatar className="h-10 w-10 mx-auto mb-1.5">
              <AvatarImage src={node.photo} alt={node.name} className="object-cover" />
              <AvatarFallback className={`text-xs font-semibold ${isRoot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{node.initials}</AvatarFallback>
            </Avatar>
            <p className="text-xs font-semibold">{node.name}</p>
            <p className="text-[10px] text-muted-foreground">{node.position}</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Mail className="h-2.5 w-2.5 text-muted-foreground" />
              <p className="text-[9px] text-muted-foreground truncate max-w-[120px]">{node.email}</p>
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
          <div className="w-px h-4 bg-border" />
          <div className="flex gap-6 relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: `calc(100% - 160px)` }} />
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

// Mock data for diagnostico
const areaRisks = [
  { area: "Ventas", risk: "alto", score: 78, issues: ["Alta rotación", "Baja satisfacción salarial"], priority: 1 },
  { area: "Operaciones", risk: "medio", score: 62, issues: ["Carga de trabajo excesiva", "Falta capacitación"], priority: 2 },
  { area: "RRHH", risk: "bajo", score: 35, issues: ["Comunicación interna"], priority: 4 },
  { area: "Finanzas", risk: "bajo", score: 28, issues: ["Sin hallazgos relevantes"], priority: 5 },
  { area: "IT", risk: "medio", score: 55, issues: ["Burnout", "Falta de reconocimiento"], priority: 3 },
];

const riskColor: Record<string, { bg: string; text: string; label: string }> = {
  alto: { bg: "bg-destructive", text: "text-destructive", label: "Alto" },
  medio: { bg: "bg-warning", text: "text-warning", label: "Medio" },
  bajo: { bg: "bg-success", text: "text-success", label: "Bajo" },
};

const defaultDiagnosticoInsight = `## Diagnóstico Integral — Resumen Ejecutivo

La organización presenta un **nivel de riesgo moderado-alto** concentrado principalmente en las áreas de **Ventas** y **Operaciones**.

### Hallazgos Clave
- **Ventas** muestra los indicadores más preocupantes: alta rotación (23% anual) combinada con baja satisfacción salarial. Se recomienda intervención inmediata con revisión de esquema de compensación variable.
- **Operaciones** reporta cargas de trabajo excesivas, particularmente en los centros de Monterrey y Guadalajara. La falta de capacitación técnica agrava el problema.
- **IT** presenta señales tempranas de burnout que requieren monitoreo preventivo.

### Acción con Mayor Retorno Esperado
**Programa de compensación variable en Ventas** — Impacto estimado: reducción del 40% en rotación en 6 meses. Costo: bajo. Retorno: alto.

### Recomendaciones Prioritarias
1. Implementar programa de reconocimiento y compensación variable (Ventas) — *Servicio ESSEN: Consultoría Compensaciones*
2. Redistribuir cargas de trabajo con análisis de puestos (Operaciones) — *Servicio ESSEN: Análisis Organizacional*
3. Programa de bienestar y prevención de burnout (IT) — *Servicio ESSEN: Wellbeing Corporativo*`;

// Mock action plans per evaluation
const evalActionPlans: Record<number, { actions: { action: string; service: string; impact: string; priority: string }[]; insight: string }> = {
  1: {
    insight: "La evaluación NOM-035 revela factores de riesgo psicosocial **nivel medio-alto** en 3 de 5 dominios. Las áreas prioritarias son: liderazgo negativo, cargas de trabajo y falta de control sobre el trabajo. Se recomienda intervenir con el programa de liderazgo positivo de ESSEN.",
    actions: [
      { action: "Taller de liderazgo positivo para gerentes y supervisores", service: "ESSEN Capacitación - Liderazgo", impact: "Alto", priority: "Urgente" },
      { action: "Redistribución de cargas de trabajo en Operaciones", service: "ESSEN Consultoría Organizacional", impact: "Alto", priority: "Urgente" },
      { action: "Implementar política de desconexión digital", service: "ESSEN Wellbeing", impact: "Medio", priority: "Corto plazo" },
      { action: "Capacitación en manejo de estrés para equipos", service: "ESSEN Capacitación - Bienestar", impact: "Medio", priority: "Corto plazo" },
    ],
  },
  2: {
    insight: "La evaluación 360° muestra que los gerentes tienen fortalezas en **orientación a resultados** pero áreas de mejora significativas en **comunicación** y **desarrollo de talento**. El 70% de los evaluados recibió feedback negativo de subordinados en habilidades de coaching.",
    actions: [
      { action: "Programa de coaching ejecutivo 1:1 para gerentes", service: "ESSEN Coaching Ejecutivo", impact: "Alto", priority: "Urgente" },
      { action: "Taller de feedback efectivo y comunicación asertiva", service: "ESSEN Capacitación - Soft Skills", impact: "Alto", priority: "Corto plazo" },
      { action: "Implementar sesiones de 1:1 quincenales obligatorias", service: "ESSEN Consultoría RRHH", impact: "Medio", priority: "Mediano plazo" },
    ],
  },
  3: {
    insight: "El clima organizacional refleja un **índice de satisfacción del 68%**, por debajo del benchmark de la industria (74%). Los factores con menor puntuación son: oportunidades de crecimiento, comunicación de la dirección y balance vida-trabajo.",
    actions: [
      { action: "Diseño de plan de carrera por puesto", service: "ESSEN Consultoría - Desarrollo de Talento", impact: "Alto", priority: "Urgente" },
      { action: "Programa de comunicación interna transparente", service: "ESSEN Comunicación Organizacional", impact: "Alto", priority: "Corto plazo" },
      { action: "Implementar programa de flexibilidad laboral", service: "ESSEN Wellbeing - Flexibilidad", impact: "Medio", priority: "Corto plazo" },
      { action: "Encuesta pulso mensual para monitoreo continuo", service: "ESSEN Diagnóstico - Pulso", impact: "Bajo", priority: "Mediano plazo" },
    ],
  },
};

const priorityColor: Record<string, string> = {
  Urgente: "bg-destructive/10 text-destructive border-destructive/20",
  "Corto plazo": "bg-warning/10 text-warning border-warning/20",
  "Mediano plazo": "bg-info/10 text-info border-info/20",
};

export default function EmpresaDetail() {
  const { empresaId } = useParams();
  const empresa = getEmpresa(empresaId || "");
  const empleados = getEmpleadosByEmpresa(empresaId || "");
  const centros = getCentrosByEmpresa(empresaId || "");

  const [diagnosticoInsight, setDiagnosticoInsight] = useState(defaultDiagnosticoInsight);
  const [isEditingDiagnostico, setIsEditingDiagnostico] = useState(false);
  const [expandedEval, setExpandedEval] = useState<number | null>(null);
  const { toast } = useToast();

  // Reloj Checador state
  const [devices] = useState<Device[]>([
    { id: "1", name: "Reloj Comedor", serialNumber: "SN-123456", model: "ZKTeco MB460", assignedLocation: "Oficina Central", status: "online" },
    { id: "2", name: "Reloj Recepción", serialNumber: "SN-789012", model: "ZKTeco MB460", status: "unverified" },
  ]);

  // Incidencias state
  const [incidences, setIncidences] = useState<IncidenceConfig[]>(defaultIncidences);
  const [approvalFlows, setApprovalFlows] = useState<ApprovalFlow[]>(defaultApprovalFlows);
  const [holidays, setHolidays] = useState<Holiday[]>(defaultHolidays);

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
          <TabsTrigger value="centros" className="gap-1.5"><MapPin className="h-3.5 w-3.5" />Centros</TabsTrigger>
          <TabsTrigger value="organigrama" className="gap-1.5"><Network className="h-3.5 w-3.5" />Organigrama</TabsTrigger>
          <TabsTrigger value="evaluaciones" className="gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" />Evaluaciones</TabsTrigger>
          <TabsTrigger value="diagnostico" className="gap-1.5"><BrainCircuit className="h-3.5 w-3.5" />Diagnóstico IA</TabsTrigger>
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

        {/* Evaluaciones with AI Action Plans */}
        <TabsContent value="evaluaciones" className="space-y-4">
          <div className="space-y-4">
            {mockEvals.map((ev) => {
              const plan = evalActionPlans[ev.id];
              const isExpanded = expandedEval === ev.id;
              return (
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
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1 flex-1 gradient-primary text-primary-foreground border-0"
                        onClick={() => setExpandedEval(isExpanded ? null : ev.id)}
                      >
                        <Sparkles className="h-3 w-3" />
                        Plan de Acción IA
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </div>

                    {/* AI Action Plan expandable */}
                    {isExpanded && plan && (
                      <div className="mt-3 pt-3 border-t border-border space-y-4 animate-fade-in">
                        {/* AI Insight */}
                        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary font-display">Análisis IA</span>
                            <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary">Generado con IA</Badge>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{plan.insight}</p>
                        </div>

                        {/* Action items */}
                        <div>
                          <h4 className="text-xs font-semibold font-display mb-2 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-accent" />
                            Plan de Acción — Servicios ESSEN
                          </h4>
                          <div className="space-y-2">
                            {plan.actions.map((a, i) => (
                              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{a.action}</p>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant="secondary" className="text-[10px]">{a.service}</Badge>
                                    <Badge variant="outline" className={priorityColor[a.priority] || ""}>{a.priority}</Badge>
                                    <span className="text-[10px] text-muted-foreground">Impacto: {a.impact}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Diagnóstico Integral IA */}
        <TabsContent value="diagnostico" className="space-y-6">
          {/* Semáforo por área */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                Semáforo de Riesgo por Área
              </CardTitle>
              <p className="text-xs text-muted-foreground">Alertas tempranas para RH basadas en las evaluaciones aplicadas</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {areaRisks.sort((a, b) => a.priority - b.priority).map((area) => {
                  const rc = riskColor[area.risk];
                  return (
                    <div key={area.area} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      {/* Semáforo */}
                      <div className={`h-3 w-3 rounded-full shrink-0 ${rc.bg}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{area.area}</span>
                            <Badge variant="outline" className={`text-[10px] ${rc.text}`}>{rc.label}</Badge>
                          </div>
                          <span className="text-sm font-bold font-display">{area.score}%</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {area.issues.map((issue, i) => (
                            <span key={i} className="text-[10px] text-muted-foreground">
                              {i > 0 && " · "}{issue}
                            </span>
                          ))}
                        </div>
                        <Progress value={area.score} className="h-1 mt-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top riesgos y prioridades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-card border-l-4 border-l-destructive">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">Prioridad #1</span>
                </div>
                <p className="text-sm font-semibold">Rotación en Ventas</p>
                <p className="text-xs text-muted-foreground mt-1">23% anual — Acción: Revisar esquema de compensación variable</p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-[10px] text-success font-medium">Mayor retorno esperado</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-l-4 border-l-warning">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-xs font-semibold text-warning">Prioridad #2</span>
                </div>
                <p className="text-sm font-semibold">Sobrecarga en Operaciones</p>
                <p className="text-xs text-muted-foreground mt-1">Cargas excesivas en centros Monterrey y Guadalajara</p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">Retorno medio</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-l-4 border-l-info">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-info" />
                  <span className="text-xs font-semibold text-info">Prioridad #3</span>
                </div>
                <p className="text-sm font-semibold">Burnout en IT</p>
                <p className="text-xs text-muted-foreground mt-1">Señales tempranas — Intervención preventiva recomendada</p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">Retorno preventivo</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insight editable */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Interpretación e Insights — {empresa.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary gap-1">
                    <BrainCircuit className="h-3 w-3" />
                    Diagnóstico generado con IA
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      if (isEditingDiagnostico) {
                        setIsEditingDiagnostico(false);
                      } else {
                        setIsEditingDiagnostico(true);
                      }
                    }}
                  >
                    {isEditingDiagnostico ? (
                      <><Save className="h-3 w-3" />Guardar</>
                    ) : (
                      <><Pencil className="h-3 w-3" />Editar</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingDiagnostico ? (
                <Textarea
                  value={diagnosticoInsight}
                  onChange={(e) => setDiagnosticoInsight(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-secondary border-0"
                />
              ) : (
                <div className="prose prose-sm max-w-none text-foreground">
                  {diagnosticoInsight.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold font-display mt-4 mb-2">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-bold font-display mt-3 mb-1">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("- ")) return <li key={i} className="text-sm text-foreground ml-4 mb-1">{renderBold(line.replace("- ", ""))}</li>;
                    if (line.match(/^\d+\. /)) return <li key={i} className="text-sm text-foreground ml-4 mb-1 list-decimal">{renderBold(line.replace(/^\d+\. /, ""))}</li>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-sm text-foreground mb-1">{renderBold(line)}</p>;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
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

// Simple bold text renderer for **text**
function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  );
}
