import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const empleados = [
  { id: 1, name: "María García López", department: "Ventas", rfc: "GALM850312AB1", position: "Gerente de Ventas" },
  { id: 2, name: "Juan Pérez Hernández", department: "Recursos Humanos", rfc: "PEHJ900115CD3", position: "Analista RRHH" },
  { id: 3, name: "Ana Rodríguez Sánchez", department: "Operaciones", rfc: "ROSA880723EF5", position: "Coordinadora" },
  { id: 4, name: "Carlos Martínez Ruiz", department: "Ventas", rfc: "MARC910430GH7", position: "Supervisor" },
  { id: 5, name: "Laura Torres Díaz", department: "Finanzas", rfc: "TODL870218IJ9", position: "Contadora Sr." },
  { id: 6, name: "Roberto Flores Vega", department: "Dirección", rfc: "FOVR760505KL2", position: "Director General" },
  { id: 7, name: "Patricia Mendoza Cruz", department: "Finanzas", rfc: "MECP930812MN4", position: "Auxiliar Contable" },
  { id: 8, name: "Diego Ramírez Ortega", department: "Operaciones", rfc: "RAOD850929OP6", position: "Dir. Operaciones" },
  { id: 9, name: "Sofía López Castillo", department: "Operaciones", rfc: "LOCS960117QR8", position: "Coord. Logística" },
  { id: 10, name: "Fernando Guzmán Ríos", department: "IT", rfc: "GURF881204ST0", position: "Desarrollador Sr." },
  { id: 11, name: "Gabriela Herrera Mora", department: "RRHH", rfc: "HEMG940610UV2", position: "Reclutadora" },
  { id: 12, name: "Alejandro Vidal Peña", department: "Ventas", rfc: "VIPA790322WX4", position: "Ejecutivo Comercial" },
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("");
}

const deptColor: Record<string, string> = {
  Ventas: "bg-info/10 text-info border-info/20",
  "Recursos Humanos": "bg-primary/10 text-primary border-primary/20",
  RRHH: "bg-primary/10 text-primary border-primary/20",
  Operaciones: "bg-warning/10 text-warning border-warning/20",
  Finanzas: "bg-success/10 text-success border-success/20",
  Dirección: "bg-accent/10 text-accent border-accent/20",
  IT: "bg-chart-3/10 text-info border-info/20",
};

export default function Empleados() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Empleados</h1>
          <p className="text-sm text-muted-foreground mt-1">Directorio de trabajadores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4" />
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="shadow-card">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{empleados.length}</p>
              <p className="text-xs text-muted-foreground">Total de empleados registrados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Lista de Trabajadores</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por nombre, RFC..." className="pl-10 h-8 text-sm bg-secondary border-0" />
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
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>RFC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleados.map((emp) => (
                <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{emp.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{emp.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={deptColor[emp.department] || ""}>
                      {emp.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{emp.rfc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
