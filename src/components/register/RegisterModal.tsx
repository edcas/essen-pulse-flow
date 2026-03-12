import { useState, useEffect } from "react";
import { CheckInRecord, CheckInTime } from "@/types/register";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (register: CheckInRecord) => void;
  register: CheckInRecord | null;
}

const mockWorkers = [
  { id: "w1", name: "Juan Pérez", department: "Operaciones", costCenter: "CC-001" },
  { id: "w2", name: "María García", department: "Administración", costCenter: "CC-002" },
  { id: "w3", name: "Carlos López", department: "Operaciones", costCenter: "CC-001" },
  { id: "w4", name: "Ana Martínez", department: "Recursos Humanos", costCenter: "CC-003" },
];

const mockOffices = ["Oficina Centro", "Oficina Norte", "Oficina Sur"];

export function RegisterModal({ isOpen, onClose, onSave, register }: RegisterModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWorker, setSelectedWorker] = useState("");
  const [device, setDevice] = useState<"web" | "mobile" | "physical">("mobile");
  const [assignedOffice, setAssignedOffice] = useState("");
  const [registeredOffice, setRegisteredOffice] = useState("");
  const [checkInTimes, setCheckInTimes] = useState<CheckInTime[]>([
    { type: "entry", time: "", label: "Entrada" },
    { type: "lunch_start", time: "", label: "Inicio Comida" },
    { type: "lunch_end", time: "", label: "Fin Comida" },
    { type: "exit", time: "", label: "Salida" },
  ]);

  useEffect(() => {
    if (register) {
      setSelectedDate(new Date(register.date));
      setSelectedWorker(register.workerId);
      setDevice(register.device);
      setAssignedOffice(register.assignedOffice);
      setRegisteredOffice(register.registeredOffice);
      setCheckInTimes(register.checkInTimes);
    } else {
      resetForm();
    }
  }, [register]);

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedWorker("");
    setDevice("mobile");
    setAssignedOffice("");
    setRegisteredOffice("");
    setCheckInTimes([
      { type: "entry", time: "", label: "Entrada" },
      { type: "lunch_start", time: "", label: "Inicio Comida" },
      { type: "lunch_end", time: "", label: "Fin Comida" },
      { type: "exit", time: "", label: "Salida" },
    ]);
  };

  const handleSave = () => {
    const worker = mockWorkers.find((w) => w.id === selectedWorker);
    if (!worker) return;
    const newRegister: CheckInRecord = {
      id: register?.id || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      workerId: worker.id,
      workerName: worker.name,
      workerRFC: "RFC" + worker.id.toUpperCase(),
      department: worker.department,
      costCenter: worker.costCenter,
      position: "Empleado",
      device,
      assignedOffice,
      registeredOffice,
      checkInTimes: checkInTimes.map(ct => ({ ...ct, time: ct.time || null })),
    };
    onSave(newRegister);
  };

  const updateCheckInTime = (index: number, time: string) => {
    setCheckInTimes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], time };
      return updated;
    });
  };

  const selectedWorkerData = mockWorkers.find((w) => w.id === selectedWorker);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{register ? "Editar Registro" : "Crear Registro Manual"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedDate, "PPP", { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Trabajador</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger><SelectValue placeholder="Seleccionar trabajador" /></SelectTrigger>
                <SelectContent>
                  {mockWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>{worker.name} - {worker.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedWorkerData && (
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Departamento:</span> <span className="font-medium">{selectedWorkerData.department}</span></div>
                <div><span className="text-muted-foreground">Centro de Costos:</span> <span className="font-medium">{selectedWorkerData.costCenter}</span></div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dispositivo</Label>
              <Select value={device} onValueChange={(v: any) => setDevice(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">App Móvil</SelectItem>
                  <SelectItem value="physical">Reloj Físico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Oficina Asignada</Label>
              <Select value={assignedOffice} onValueChange={setAssignedOffice}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {mockOffices.map((office) => (<SelectItem key={office} value={office}>{office}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Oficina de Registro</Label>
              <Select value={registeredOffice} onValueChange={setRegisteredOffice}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {mockOffices.map((office) => (<SelectItem key={office} value={office}>{office}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Horarios de Registro</Label>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {checkInTimes.map((checkIn, index) => (
                <div key={index} className="space-y-2">
                  <Label>{checkIn.label}</Label>
                  <Input type="time" value={checkIn.time || ""} onChange={(e) => updateCheckInTime(index, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!selectedWorker || !assignedOffice || !registeredOffice}>
            {register ? "Guardar Cambios" : "Crear Registro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
