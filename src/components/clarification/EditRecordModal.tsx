import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clarification } from "@/types/clarification";

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  clarification: Clarification;
  onSave: (clarificationId: string, checkIn: string | null, checkOut: string | null, generateIncident: boolean) => void;
}

export const EditRecordModal = ({ isOpen, onClose, clarification, onSave }: EditRecordModalProps) => {
  const [checkIn, setCheckIn] = useState(clarification.proposedCheckIn || clarification.originalCheckIn || "");
  const [checkOut, setCheckOut] = useState(clarification.proposedCheckOut || clarification.originalCheckOut || "");
  const [generateIncident, setGenerateIncident] = useState(true);

  const handleSave = () => { onSave(clarification.id, checkIn || null, checkOut || null, generateIncident); onClose(); };
  const handleClose = () => {
    setCheckIn(clarification.proposedCheckIn || clarification.originalCheckIn || "");
    setCheckOut(clarification.proposedCheckOut || clarification.originalCheckOut || "");
    setGenerateIncident(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Edit className="h-5 w-5" />Editar Registro Manualmente</DialogTitle>
          <DialogDescription>Modifica los tiempos de registro para {clarification.workerName} del día {format(new Date(clarification.incidentDate), "dd 'de' MMMM, yyyy", { locale: es })}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Registro Original</div>
              <div className="text-sm space-y-1">
                <div>Entrada: <span className="font-mono">{clarification.originalCheckIn || "--:--"}</span></div>
                <div>Salida: <span className="font-mono">{clarification.originalCheckOut || "--:--"}</span></div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-primary mb-2">Solicitado por Trabajador</div>
              <div className="text-sm space-y-1">
                <div>Entrada: <span className="font-mono">{clarification.proposedCheckIn || "--:--"}</span></div>
                <div>Salida: <span className="font-mono">{clarification.proposedCheckOut || "--:--"}</span></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Hora de Entrada (nuevo registro)</Label><Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="font-mono" /></div>
            <div className="space-y-2"><Label>Hora de Salida (nuevo registro)</Label><Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="font-mono" /></div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-lg border">
            <Checkbox id="generateIncident" checked={generateIncident} onCheckedChange={(checked) => setGenerateIncident(checked as boolean)} />
            <div className="space-y-1">
              <Label htmlFor="generateIncident" className="text-sm font-medium cursor-pointer">Generar incidencia de ajuste</Label>
              <p className="text-sm text-muted-foreground">Se creará una incidencia que contrarresta la falta original.</p>
            </div>
          </div>
          <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>Esta acción actualizará permanentemente el registro de asistencia.{generateIncident && " Se generará una incidencia automática."}</AlertDescription></Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
