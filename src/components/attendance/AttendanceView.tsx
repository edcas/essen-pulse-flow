import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StandardFilters, FilterValues, FilterOptions } from "@/components/shared/StandardFilters";
import type { AttendanceRecord, AttendanceStats, AttendanceStatus } from "@/types/attendance";
import { MapPin, Clock, Download } from "lucide-react";
import { AttendanceFilterCards } from "./AttendanceFilterCards";

const generateMockAttendance = (): AttendanceRecord[] => {
  const workers = [
    { id: "w1", name: "Juan Pérez", rfc: "PEJX850101ABC", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", department: "Ventas", costCenter: "CC-001", position: "Vendedor" },
    { id: "w2", name: "María García", rfc: "GARM880202BCD", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", department: "Recursos Humanos", costCenter: "CC-002", position: "Gerente RH" },
    { id: "w3", name: "Carlos López", rfc: "LOPC900303CDE", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", department: "Tecnología", costCenter: "CC-003", position: "Desarrollador" },
    { id: "w4", name: "Ana Martínez", rfc: "MARA870404DEF", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", department: "Marketing", costCenter: "CC-004", position: "Coordinadora" },
    { id: "w5", name: "Pedro Sánchez", rfc: "SAMP920505EFG", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", department: "Operaciones", costCenter: "CC-001", position: "Operador" },
    { id: "w6", name: "Laura Rodríguez", rfc: "RORL880606FGH", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura", department: "Finanzas", costCenter: "CC-002", position: "Analista" },
    { id: "w7", name: "Roberto Hernández", rfc: "HERR910707GHI", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto", department: "Logística", costCenter: "CC-005", position: "Supervisor" },
    { id: "w8", name: "Sofia Torres", rfc: "TORS890808HIJ", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia", department: "Atención al Cliente", costCenter: "CC-004", position: "Ejecutiva" },
  ];

  const locations = ["Oficina Central", "Sucursal Norte", "Sucursal Sur", "Oficina Polanco"];
  const statuses: AttendanceStatus[] = ["present", "late", "absent", "pending", "vacation", "sick_leave"];
  const records: AttendanceRecord[] = [];
  const startDate = new Date(2024, 10, 1);
  const endDate = new Date(2024, 11, 31);

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    workers.forEach((worker, index) => {
      const randomFactor = (date.getDate() + index) % statuses.length;
      const status = statuses[randomFactor];
      const assignedLocation = locations[index % locations.length];
      const actualLocation = status === "present" || status === "late"
        ? (randomFactor % 4 === 0 ? locations[(index + 1) % locations.length] : assignedLocation)
        : null;
      const checkInTime = status === "present" || status === "late"
        ? status === "late" ? "09:15" : "08:45"
        : null;

      records.push({
        id: `att-${worker.id}-${format(date, "yyyy-MM-dd")}`,
        workerId: worker.id,
        workerName: worker.name,
        workerRFC: worker.rfc,
        workerAvatar: worker.avatar,
        department: worker.department,
        costCenter: worker.costCenter,
        position: worker.position,
        date: format(date, "yyyy-MM-dd"),
        status,
        assignedLocation,
        actualLocation,
        checkInTime,
        checkOutTime: null,
      });
    });
  }
  return records;
};

const getStatusLabel = (status: AttendanceStatus): string => {
  const labels: Record<AttendanceStatus, string> = {
    present: "Asistió", absent: "Falta", late: "Retardo",
    pending: "Por registrar", vacation: "Vacaciones", sick_leave: "Incapacidad",
  };
  return labels[status];
};

const getStatusVariant = (status: AttendanceStatus): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<AttendanceStatus, "default" | "secondary" | "destructive" | "outline"> = {
    present: "default", late: "secondary", absent: "destructive",
    pending: "outline", vacation: "secondary", sick_leave: "secondary",
  };
  return variants[status];
};

export const AttendanceView = () => {
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "", department: "all", costCenter: "all", position: "all", office: "all",
    dateFrom: new Date(2024, 10, 1), dateTo: new Date(2024, 11, 31),
  });

  const attendanceRecords = generateMockAttendance();

  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesSearch = !filterValues.search || record.workerName.toLowerCase().includes(filterValues.search.toLowerCase()) || record.workerRFC.toLowerCase().includes(filterValues.search.toLowerCase());
    const matchesDepartment = filterValues.department === "all" || record.department === filterValues.department;
    const matchesCostCenter = filterValues.costCenter === "all" || record.costCenter === filterValues.costCenter;
    const matchesPosition = filterValues.position === "all" || record.position === filterValues.position;
    const matchesOffice = filterValues.office === "all" || record.assignedLocation === filterValues.office;
    const matchesDateFrom = !filterValues.dateFrom || recordDate >= filterValues.dateFrom;
    const matchesDateTo = !filterValues.dateTo || recordDate <= filterValues.dateTo;
    return matchesStatus && matchesSearch && matchesDepartment && matchesCostCenter && matchesPosition && matchesOffice && matchesDateFrom && matchesDateTo;
  });

  const stats: AttendanceStats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === "present").length,
    absent: attendanceRecords.filter(r => r.status === "absent").length,
    late: attendanceRecords.filter(r => r.status === "late").length,
    vacation: attendanceRecords.filter(r => r.status === "vacation").length,
    sickLeave: attendanceRecords.filter(r => r.status === "sick_leave").length,
    pending: attendanceRecords.filter(r => r.status === "pending").length,
  };

  const filterOptions: FilterOptions = {
    departments: Array.from(new Set(attendanceRecords.map(r => r.department))),
    costCenters: Array.from(new Set(attendanceRecords.map(r => r.costCenter))),
    positions: Array.from(new Set(attendanceRecords.map(r => r.position))),
    offices: ["Oficina Central", "Sucursal Norte", "Sucursal Sur", "Oficina Polanco"],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <StandardFilters options={filterOptions} values={filterValues} onValuesChange={setFilterValues} showDateRange />
        <Button variant="outline" className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Descargar en Excel
        </Button>
      </div>

      <AttendanceFilterCards stats={stats} selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

      <Card>
        <CardHeader><CardTitle>Registro de Asistencias</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>ID Trabajador</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead><div className="flex items-center gap-1"><Clock className="h-4 w-4" />Hora de Registro</div></TableHead>
                <TableHead><div className="flex items-center gap-1"><MapPin className="h-4 w-4" />Ubicación Asignada</div></TableHead>
                <TableHead><div className="flex items-center gap-1"><MapPin className="h-4 w-4" />Lugar de Registro</div></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No hay registros para mostrar</TableCell></TableRow>
              ) : (
                filteredRecords.slice(0, 50).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.workerId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.workerAvatar} alt={record.workerName} />
                          <AvatarFallback>{record.workerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.workerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(record.status)}>{getStatusLabel(record.status)}</Badge></TableCell>
                    <TableCell>{record.checkInTime ? <span className="font-mono">{record.checkInTime}</span> : <span className="text-muted-foreground">-</span>}</TableCell>
                    <TableCell>{record.assignedLocation}</TableCell>
                    <TableCell>
                      {record.actualLocation ? (
                        <div className="flex items-center gap-2">
                          <span>{record.actualLocation}</span>
                          {record.actualLocation !== record.assignedLocation && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">Ubicación diferente</Badge>
                          )}
                        </div>
                      ) : (<span className="text-muted-foreground">-</span>)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
