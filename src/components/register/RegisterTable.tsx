import { useState } from "react";
import { CheckInRecord } from "@/types/register";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StandardFilters, FilterValues, FilterOptions } from "@/components/shared/StandardFilters";

interface RegisterTableProps {
  registers: CheckInRecord[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEditRegister: (register: CheckInRecord) => void;
}

export function RegisterTable({ registers, selectedDate, onDateChange, onEditRegister }: RegisterTableProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "", department: "all", costCenter: "all", position: "all", office: "all",
    dateFrom: selectedDate, dateTo: undefined,
  });

  const filteredRegisters = registers.filter((record) => {
    const recordDate = new Date(record.date);
    const matchesDateFrom = !filterValues.dateFrom || recordDate >= filterValues.dateFrom;
    const matchesDateTo = !filterValues.dateTo || recordDate <= filterValues.dateTo;
    const matchesSearch = !filterValues.search || record.workerName.toLowerCase().includes(filterValues.search.toLowerCase()) || record.workerId.toLowerCase().includes(filterValues.search.toLowerCase()) || record.workerRFC.toLowerCase().includes(filterValues.search.toLowerCase());
    const matchesDepartment = filterValues.department === "all" || record.department === filterValues.department;
    const matchesCostCenter = filterValues.costCenter === "all" || record.costCenter === filterValues.costCenter;
    const matchesPosition = filterValues.position === "all" || record.position === filterValues.position;
    const matchesOffice = filterValues.office === "all" || record.assignedOffice === filterValues.office || record.registeredOffice === filterValues.office;
    return matchesDateFrom && matchesDateTo && matchesSearch && matchesDepartment && matchesCostCenter && matchesPosition && matchesOffice;
  });

  const getDeviceBadge = (device: string) => {
    const variants = {
      web: { label: "Web", variant: "secondary" as const },
      mobile: { label: "App Móvil", variant: "default" as const },
      physical: { label: "Reloj Físico", variant: "outline" as const },
    };
    const config = variants[device as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterOptions: FilterOptions = {
    departments: Array.from(new Set(registers.map(r => r.department))),
    costCenters: Array.from(new Set(registers.map(r => r.costCenter))),
    positions: Array.from(new Set(registers.map(r => r.position))),
    offices: Array.from(new Set([...registers.map(r => r.assignedOffice), ...registers.map(r => r.registeredOffice)])),
  };

  return (
    <div className="space-y-4">
      <StandardFilters
        options={filterOptions}
        values={filterValues}
        onValuesChange={(values) => {
          setFilterValues(values);
          if (values.dateFrom) onDateChange(values.dateFrom);
        }}
        showDateRange
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>ID Trabajador</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Centro Costos</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Oficina Asignada</TableHead>
              <TableHead>Oficina Registro</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Inicio Comida</TableHead>
              <TableHead>Fin Comida</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegisters.length === 0 ? (
              <TableRow><TableCell colSpan={13} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell></TableRow>
            ) : (
              filteredRegisters.map((record) => {
                const officesMismatch = record.assignedOffice !== record.registeredOffice;
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.workerId}</TableCell>
                    <TableCell>{record.workerName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.costCenter}</TableCell>
                    <TableCell>{getDeviceBadge(record.device)}</TableCell>
                    <TableCell>{record.assignedOffice}</TableCell>
                    <TableCell><span className={cn(officesMismatch && "text-destructive font-medium")}>{record.registeredOffice}</span></TableCell>
                    {["entry", "lunch_start", "lunch_end", "exit"].map((type) => {
                      const checkIn = record.checkInTimes.find(ct => ct.type === type);
                      return (
                        <TableCell key={type}>
                          {checkIn?.time ? <span className="font-mono">{checkIn.time}</span> : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onEditRegister(record)} className="gap-2">
                        <Edit className="h-4 w-4" />Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">Mostrando {filteredRegisters.length} registro(s)</div>
    </div>
  );
}
