import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Holiday, formatHolidayDate } from "@/types/holiday";
import { Trash2 } from "lucide-react";

interface HolidayConfigModalProps {
  isOpen: boolean; onClose: () => void; selectedDate: Date | null;
  existingHoliday?: Holiday; onSave: (date: Date, name: string, description: string) => void; onDelete: (date: Date) => void;
}

export const HolidayConfigModal = ({ isOpen, onClose, selectedDate, existingHoliday, onSave, onDelete }: HolidayConfigModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (existingHoliday) { setName(existingHoliday.name || ""); setDescription(existingHoliday.description || ""); }
    else { setName(""); setDescription(""); }
  }, [existingHoliday, isOpen]);

  const handleSave = () => { if (selectedDate && name.trim()) { onSave(selectedDate, name.trim(), description.trim()); onClose(); } };
  const handleDelete = () => { if (selectedDate) { onDelete(selectedDate); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{existingHoliday ? "Editar" : "Agregar"} Día Festivo: {selectedDate ? formatHolidayDate(selectedDate) : ""}</DialogTitle><DialogDescription>Define el nombre y un mensaje para tus colaboradores.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label>Nombre del día festivo <span className="text-destructive">*</span></Label><Input placeholder="Ej. Navidad" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
          <div className="space-y-2"><Label>Mensaje al trabajador</Label><Textarea placeholder="Ej. ¡Feliz Navidad!" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={500} /><p className="text-xs text-muted-foreground">{description.length}/500</p></div>
        </div>
        <DialogFooter className="gap-2">
          {existingHoliday && <Button variant="destructive" onClick={handleDelete} className="mr-auto"><Trash2 className="h-4 w-4 mr-2" />Eliminar</Button>}
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>{existingHoliday ? "Guardar" : "Confirmar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};