import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, BookOpen, Award, BarChart3, Users } from "lucide-react";

const routes = [
  { id: 1, name: "Inducción General", courses: 5, assignedTo: "Todos los nuevos", duration: "8 hrs", completion: 72 },
  { id: 2, name: "Liderazgo Nivel 1", courses: 3, assignedTo: "Gerentes", duration: "12 hrs", completion: 45 },
  { id: 3, name: "Seguridad Industrial", courses: 4, assignedTo: "Operaciones", duration: "6 hrs", completion: 88 },
  { id: 4, name: "Ventas Consultivas", courses: 6, assignedTo: "Equipo Comercial", duration: "15 hrs", completion: 34 },
];

const courses = [
  { id: 1, name: "Bienvenida a la Empresa", route: "Inducción General", videos: 3, evaluation: true, certificate: true, completions: 120 },
  { id: 2, name: "Cultura y Valores", route: "Inducción General", videos: 2, evaluation: true, certificate: false, completions: 115 },
  { id: 3, name: "Liderazgo Situacional", route: "Liderazgo Nivel 1", videos: 5, evaluation: true, certificate: true, completions: 28 },
  { id: 4, name: "Uso de EPP", route: "Seguridad Industrial", videos: 4, evaluation: true, certificate: true, completions: 95 },
];

const areaProgress = [
  { area: "Ventas", progress: 78, employees: 45 },
  { area: "RRHH", progress: 92, employees: 12 },
  { area: "Operaciones", progress: 65, employees: 80 },
  { area: "Finanzas", progress: 85, employees: 15 },
  { area: "IT", progress: 71, employees: 20 },
];

export default function Capacitacion() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Onboarding y Capacitación</h1>
          <p className="text-sm text-muted-foreground mt-1">Rutas de aprendizaje, cursos y certificados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Nuevo Curso
          </Button>
          <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4" />
            Nueva Ruta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="rutas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rutas">Rutas</TabsTrigger>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
          <TabsTrigger value="avance">Avance por Área</TabsTrigger>
        </TabsList>

        <TabsContent value="rutas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((r) => (
              <Card key={r.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-display">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{r.courses} cursos</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.assignedTo}</span>
                    <span>{r.duration}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Completado</span>
                      <span className="font-medium">{r.completion}%</span>
                    </div>
                    <Progress value={r.completion} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cursos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <Card key={c.id} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-display">{c.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{c.route}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Play className="h-3 w-3" />{c.videos} videos</span>
                    {c.evaluation && <Badge variant="outline" className="text-[10px] h-5">Evaluación</Badge>}
                    {c.certificate && (
                      <Badge variant="outline" className="text-[10px] h-5 bg-accent/10 text-accent border-accent/20">
                        <Award className="h-2.5 w-2.5 mr-0.5" />Certificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.completions} empleados han completado</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avance" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Avance por Área
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {areaProgress.map((a) => (
                <div key={a.area} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.area}</span>
                      <span className="text-xs text-muted-foreground">({a.employees} empleados)</span>
                    </div>
                    <span className="text-sm font-semibold">{a.progress}%</span>
                  </div>
                  <Progress value={a.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
