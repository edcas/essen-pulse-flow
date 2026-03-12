import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AutoApprovalConfig } from "@/types/clarification";
import { AlertCircle } from "lucide-react";

interface AutoApprovalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AutoApprovalConfig;
  onSave: (config: AutoApprovalConfig) => void;
}

export const AutoApprovalConfigModal = ({ isOpen, onClose, config, onSave }: AutoApprovalConfigModalProps) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [days, setDays] = useState(config.daysBeforeAutoApproval);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuración de Aprobación Automática</DialogTitle>
          <DialogDescription>Configura las reglas para aprobar automáticamente anomalías del sistema</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-approval">Aprobación automática</Label>
              <p className="text-sm text-muted-foreground">Aprobar automáticamente anomalías después de cierto tiempo</p>
            </div>
            <Switch id="auto-approval" checked={enabled} onCheckedChange={setEnabled} />
          </div>
          {enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="days">Días antes de auto-aprobar</Label>
                <Input id="days" type="number" min="1" max="30" value={days} onChange={(e) => setDays(parseInt(e.target.value) || 3)} />
                <p className="text-sm text-muted-foreground">Las anomalías pendientes se aprobarán automáticamente después de {days} {days === 1 ? "día" : "días"}</p>
              </div>
              <div className="flex gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Importante</p>
                  <p className="text-sm text-muted-foreground">Esta regla solo se aplicará a las <strong>Anomalías</strong> del sistema. Las <strong>Solicitudes</strong> y <strong>Correcciones</strong> siempre requerirán aprobación manual.</p>
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave({ enabled, daysBeforeAutoApproval: days })}>Guardar Configuración</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
