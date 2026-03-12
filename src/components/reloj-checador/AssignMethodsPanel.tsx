import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Employee, Office } from "@/types/check-methods";
import { MapPin, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AssignMethodsPanelProps {
  onAssign: (officeId: string, methods: Employee['checkMethods']) => void;
  onClose: () => void;
  selectedCount: number;
  offices: Office[];
  initialOfficeId?: string;
  initialMethods?: Employee['checkMethods'];
}

export const AssignMethodsPanel = ({ onAssign, onClose, selectedCount, offices, initialOfficeId, initialMethods }: AssignMethodsPanelProps) => {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(initialOfficeId || "");
  const [methods, setMethods] = useState<Employee['checkMethods']>(initialMethods || { app: false, qr: false, biometric: false, facial: false });
  const selectedOffice = offices.find(office => office.id === selectedOfficeId);

  useEffect(() => {
    if (selectedOffice && !initialMethods) {
      setMethods({ app: selectedOffice.allowMobileApp, qr: selectedOffice.allowMobileApp, biometric: selectedOffice.allowHardware && selectedOffice.hasDevices, facial: selectedOffice.allowMobileApp });
    }
  }, [selectedOfficeId, selectedOffice, initialMethods]);

  const canUseMobileApp = selectedOffice?.allowMobileApp ?? false;
  const canUseHardware = (selectedOffice?.allowHardware && selectedOffice?.hasDevices) ?? false;

  const handleSubmit = () => {
    if (selectedOfficeId) { onAssign(selectedOfficeId, methods); setSelectedOfficeId(""); setMethods({ app: false, qr: false, biometric: false, facial: false }); }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /><CardTitle className="text-lg">Asignar Oficina y Métodos</CardTitle></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <CardDescription>Configura la oficina y métodos de checado para {selectedCount} empleado(s)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="office">Oficina Asignada</Label>
          <Select value={selectedOfficeId} onValueChange={setSelectedOfficeId}>
            <SelectTrigger id="office"><SelectValue placeholder="Selecciona una oficina" /></SelectTrigger>
            <SelectContent>{offices.filter(o => o.isActive).map((office) => (<SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        {!selectedOfficeId && (<Alert><AlertCircle className="h-4 w-4" /><AlertDescription>Selecciona una oficina para ver los métodos disponibles</AlertDescription></Alert>)}
        {selectedOfficeId && selectedOffice && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-sm">Métodos de Checado Disponibles</h4>
            {[
              { id: "app-method", label: "App / Geolocalización", desc: canUseMobileApp ? "Permite checar por GPS desde el celular" : "No disponible - oficina sin app móvil", key: "app" as const, disabled: !canUseMobileApp },
              { id: "qr-method", label: "Código QR", desc: canUseMobileApp ? "Permite escanear el QR de la oficina" : "No disponible - oficina sin app móvil", key: "qr" as const, disabled: !canUseMobileApp },
              { id: "biometric-method", label: "Biométrico / Hardware", desc: canUseHardware ? "Permite huella/rostro en relojes físicos" : "No disponible - sin hardware", key: "biometric" as const, disabled: !canUseHardware },
              { id: "facial-method", label: "Reconocimiento Facial (App)", desc: canUseMobileApp ? "Permite usar la cámara del celular" : "No disponible - oficina sin app móvil", key: "facial" as const, disabled: !canUseMobileApp },
            ].map(m => (
              <div key={m.id} className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor={m.id} className={m.disabled ? "opacity-50" : ""}>{m.label}</Label>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
                <Switch id={m.id} checked={methods[m.key]} onCheckedChange={(checked) => setMethods({ ...methods, [m.key]: checked })} disabled={m.disabled} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-4 border-t space-y-2">
        <Button onClick={handleSubmit} disabled={!selectedOfficeId} className="w-full">Asignar a {selectedCount} empleado(s)</Button>
        <Button variant="outline" onClick={onClose} className="w-full">Cancelar</Button>
      </div>
    </Card>
  );
};