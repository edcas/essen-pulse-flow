import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clarification } from "@/types/clarification";
import { cn } from "@/lib/utils";

interface CreateClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clarification: Partial<Clarification>) => void;
}

const mockWorkers = [
  { id: "w1", name: "Juan Pérez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", department: "Operaciones" },
  { id: "w2", name: "María García", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", department: "Administración" },
  { id: "w3", name: "Carlos López", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", department: "Operaciones" },
  { id: "w4", name: "Ana Martínez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", department: "Recursos Humanos" },
  { id: "w5", name: "Pedro Sánchez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", department: "Ventas" },
];

const originOptions: Array<{ value: Clarification["origin"]; label: string }> = [
  { value: "entrada", label: "Entrada" }, { value: "salida", label: "Salida" },
  { value: "inicio_comida", label: "Inicio de Comida" }, { value: "fin_comida", label: "Fin de Comida" },
  { value: "omision_entrada", label: "Omisión de Entrada" }, { value: "omision_salida", label: "Omisión de Salida" },
];

export const CreateClarificationModal = ({ isOpen, onClose, onSubmit }: CreateClarificationModalProps) => {
  const [formData, setFormData] = useState<Partial<Clarification>>({ workerId: "", incidentDate: "", origin: undefined, reason: "", originalCheckIn: "", originalCheckOut: "", proposedCheckIn: "", proposedCheckOut: "" });
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleWorkerChange = (workerId: string) => {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (worker) { setFormData(prev => ({ ...prev, workerId: worker.id, workerName: worker.name, workerAvatar: worker.avatar, department: worker.department })); }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) { setSelectedDate(date); setFormData(prev => ({ ...prev, incidentDate: format(date, "yyyy-MM-dd") })); }
  };

  const handleSubmit = () => {
    if (!formData.workerId || !formData.incidentDate || !formData.origin || !formData.reason) return;
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ workerId: "", incidentDate: "", origin: undefined, reason: "", originalCheckIn: "", originalCheckOut: "", proposedCheckIn: "", proposedCheckOut: "" });
    setSelectedDate(undefined);
    onClose();
  };

  const isValid = formData.workerId && formData.incidentDate && formData.origin && formData.reason;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Crear Nueva Aclaración</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="worker">Colaborador *</Label>
            <Select value={formData.workerId} onValueChange={handleWorkerChange}>
              <SelectTrigger id="worker"><SelectValue placeholder="Selecciona un colaborador" /></SelectTrigger>
              <SelectContent>{mockWorkers.map((worker) => (<SelectItem key={worker.id} value={worker.id}>{worker.name} - {worker.department}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fecha del Incidente *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />{selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} locale={es} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origen *</Label>
            <Select value={formData.origin} onValueChange={(value) => setFormData(prev => ({ ...prev, origin: value as Clarification["origin"] }))}>
              <SelectTrigger id="origin"><SelectValue placeholder="Selecciona el origen" /></SelectTrigger>
              <SelectContent>{originOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea id="reason" placeholder="Describe el motivo..." value={formData.reason} onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Hora Original de Entrada</Label><Input type="time" value={formData.originalCheckIn} onChange={(e) => setFormData(prev => ({ ...prev, originalCheckIn: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Hora Original de Salida</Label><Input type="time" value={formData.originalCheckOut} onChange={(e) => setFormData(prev => ({ ...prev, originalCheckOut: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Hora Propuesta de Entrada</Label><Input type="time" value={formData.proposedCheckIn} onChange={(e) => setFormData(prev => ({ ...prev, proposedCheckIn: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Hora Propuesta de Salida</Label><Input type="time" value={formData.proposedCheckOut} onChange={(e) => setFormData(prev => ({ ...prev, proposedCheckOut: e.target.value }))} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>Crear Aclaración</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
