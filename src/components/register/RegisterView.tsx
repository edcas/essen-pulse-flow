import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { RegisterTable } from "./RegisterTable";
import { RegisterModal } from "./RegisterModal";
import { CheckInRecord } from "@/types/register";
import { toast } from "sonner";

const mockRegisters: CheckInRecord[] = [
  { id: "r1", date: "2025-01-15", workerId: "w1", workerName: "Juan Pérez", workerRFC: "PEJX850101ABC", department: "Operaciones", costCenter: "CC-001", position: "Operador", device: "mobile", assignedOffice: "Oficina Centro", registeredOffice: "Oficina Centro", checkInTimes: [{ type: "entry", time: "08:58", label: "Entrada" }, { type: "lunch_start", time: "14:02", label: "Inicio Comida" }, { type: "lunch_end", time: "15:01", label: "Fin Comida" }, { type: "exit", time: "18:05", label: "Salida" }] },
  { id: "r2", date: "2025-01-15", workerId: "w2", workerName: "María García", workerRFC: "GARM880202BCD", department: "Administración", costCenter: "CC-002", position: "Administradora", device: "web", assignedOffice: "Oficina Norte", registeredOffice: "Oficina Norte", checkInTimes: [{ type: "entry", time: "09:00", label: "Entrada" }, { type: "lunch_start", time: "14:00", label: "Inicio Comida" }, { type: "lunch_end", time: "15:00", label: "Fin Comida" }, { type: "exit", time: "18:00", label: "Salida" }] },
  { id: "r3", date: "2025-01-15", workerId: "w3", workerName: "Carlos López", workerRFC: "LOPC900303CDE", department: "Operaciones", costCenter: "CC-001", position: "Supervisor", device: "physical", assignedOffice: "Oficina Centro", registeredOffice: "Oficina Sur", checkInTimes: [{ type: "entry", time: "22:05", label: "Entrada" }, { type: "exit", time: null, label: "Salida" }] },
  { id: "r4", date: "2025-01-15", workerId: "w4", workerName: "Ana Martínez", workerRFC: "MARA870404DEF", department: "Recursos Humanos", costCenter: "CC-003", position: "Gerente RH", device: "mobile", assignedOffice: "Oficina Centro", registeredOffice: "Oficina Centro", checkInTimes: [{ type: "entry", time: "09:15", label: "Entrada" }, { type: "lunch_start", time: "14:00", label: "Inicio Comida" }, { type: "lunch_end", time: "15:00", label: "Fin Comida" }, { type: "exit", time: "18:10", label: "Salida" }] },
  { id: "r5", date: "2025-01-15", workerId: "w5", workerName: "Pedro Sánchez", workerRFC: "SAMP920505EFG", department: "Operaciones", costCenter: "CC-001", position: "Operador", device: "mobile", assignedOffice: "Oficina Centro", registeredOffice: "Oficina Centro", checkInTimes: [{ type: "entry", time: "07:00", label: "Entrada" }, { type: "exit", time: "19:00", label: "Salida" }] },
  { id: "r6", date: "2025-01-15", workerId: "w6", workerName: "Laura Rodríguez", workerRFC: "RORL880606FGH", department: "Ventas", costCenter: "CC-004", position: "Vendedora", device: "web", assignedOffice: "Oficina Norte", registeredOffice: "Oficina Centro", checkInTimes: [{ type: "entry", time: "08:45", label: "Entrada" }, { type: "lunch_start", time: "13:30", label: "Inicio Comida" }, { type: "lunch_end", time: "14:30", label: "Fin Comida" }, { type: "exit", time: "17:45", label: "Salida" }] },
  { id: "r7", date: "2025-01-15", workerId: "w7", workerName: "Roberto Fernández", workerRFC: "FERR910707GHI", department: "TI", costCenter: "CC-005", position: "Desarrollador", device: "physical", assignedOffice: "Oficina Centro", registeredOffice: "Oficina Centro", checkInTimes: [{ type: "entry", time: "09:10", label: "Entrada" }, { type: "lunch_start", time: "14:15", label: "Inicio Comida" }, { type: "lunch_end", time: "15:10", label: "Fin Comida" }, { type: "exit", time: "18:30", label: "Salida" }] },
  { id: "r8", date: "2025-01-15", workerId: "w8", workerName: "Sofia Torres", workerRFC: "TORS890808HIJ", department: "Ventas", costCenter: "CC-004", position: "Coordinadora", device: "mobile", assignedOffice: "Oficina Sur", registeredOffice: "Oficina Sur", checkInTimes: [{ type: "entry", time: "08:50", label: "Entrada" }, { type: "lunch_start", time: "14:00", label: "Inicio Comida" }, { type: "lunch_end", time: "15:00", label: "Fin Comida" }, { type: "exit", time: "18:15", label: "Salida" }] },
];

export function RegisterView() {
  const [registers, setRegisters] = useState<CheckInRecord[]>(mockRegisters);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState<CheckInRecord | null>(null);

  const handleCreateRegister = () => { setSelectedRegister(null); setIsModalOpen(true); };
  const handleEditRegister = (register: CheckInRecord) => { setSelectedRegister(register); setIsModalOpen(true); };

  const handleSaveRegister = (register: CheckInRecord) => {
    if (selectedRegister) {
      setRegisters(registers.map(r => r.id === register.id ? register : r));
      toast.success("Registro actualizado correctamente");
    } else {
      setRegisters([...registers, { ...register, id: Date.now().toString() }]);
      toast.success("Registro creado correctamente");
    }
    setIsModalOpen(false);
    setSelectedRegister(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Matriz de Registros</h2>
          <p className="text-sm text-muted-foreground">Consulta, filtra y administra los registros de asistencia diarios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Descargar reporte</Button>
          <Button onClick={handleCreateRegister} className="gap-2"><Plus className="h-4 w-4" />Crear</Button>
        </div>
      </div>
      <RegisterTable registers={registers} selectedDate={selectedDate} onDateChange={setSelectedDate} onEditRegister={handleEditRegister} />
      <RegisterModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedRegister(null); }} onSave={handleSaveRegister} register={selectedRegister} />
    </div>
  );
}
