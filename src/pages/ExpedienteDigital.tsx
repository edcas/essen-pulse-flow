import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Plus, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const employees = [
  { id: 1, name: "María García López", position: "Gerente de Ventas", center: "CDMX Norte", docs: 8, total: 8, status: "completo" },
  { id: 2, name: "Juan Pérez Hernández", position: "Analista RRHH", center: "CDMX Centro", docs: 6, total: 8, status: "parcial" },
  { id: 3, name: "Ana Rodríguez Sánchez", position: "Coordinadora", center: "Monterrey", docs: 8, total: 8, status: "completo" },
  { id: 4, name: "Carlos Martínez Ruiz", position: "Supervisor", center: "Guadalajara", docs: 3, total: 8, status: "pendiente" },
  { id: 5, name: "Laura Torres Díaz", position: "Asistente", center: "CDMX Norte", docs: 7, total: 8, status: "parcial" },
  { id: 6, name: "Roberto Flores Vega", position: "Director Comercial", center: "Corporativo", docs: 8, total: 8, status: "completo" },
  { id: 7, name: "Patricia Mendoza", position: "Contadora", center: "Monterrey", docs: 2, total: 8, status: "pendiente" },
];

const statusConfig = {
  completo: { label: "Completo", icon: CheckCircle2, variant: "default" as const, className: "bg-success/10 text-success border-success/20" },
  parcial: { label: "Parcial", icon: Clock, variant: "secondary" as const, className: "bg-warning/10 text-warning border-warning/20" },
  pendiente: { label: "Pendiente", icon: AlertCircle, variant: "destructive" as const, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const requiredDocs = [
  "INE/IFE", "CURP", "RFC", "Comprobante de domicilio", "Acta de nacimiento", "NSS (IMSS)", "Contrato firmado", "CV actualizado"
];

export default function ExpedienteDigital() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Expediente Digital</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de documentos de trabajadores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4" />
            Definir Documentos
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">3</p>
                <p className="text-xs text-muted-foreground">Expedientes completos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">2</p>
                <p className="text-xs text-muted-foreground">Parcialmente completos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">2</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Docs requeridos */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">Documentos Requeridos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {requiredDocs.map((doc) => (
              <Badge key={doc} variant="secondary" className="text-xs">{doc}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Trabajadores</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar empleado..." className="pl-10 h-8 text-sm bg-secondary border-0" />
              </div>
              <Button variant="outline" size="sm" className="gap-1 h-8">
                <Filter className="h-3 w-3" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Centro</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const st = statusConfig[emp.status as keyof typeof statusConfig];
                const StatusIcon = st.icon;
                return (
                  <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.position}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.center}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={(emp.docs / emp.total) * 100} className="h-1.5" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{emp.docs}/{emp.total}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={st.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {st.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
