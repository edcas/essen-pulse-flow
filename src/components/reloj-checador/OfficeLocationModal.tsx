import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Office } from "@/types/check-methods";
import { Device } from "@/types/device";
import { GeofenceMap } from "./GeofenceMap";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, HelpCircle } from "lucide-react";

interface OfficeLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (office: Office) => void;
  office?: Office;
  devices: Device[];
  existingOffices: Office[];
}

export const OfficeLocationModal = ({ open, onOpenChange, onSave, office, devices, existingOffices }: OfficeLocationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Office>({ id: "", name: "", address: "", latitude: 19.4326, longitude: -99.1332, geofenceRadius: 200, allowMobileApp: true, allowHardware: false, assignedDevices: [], isActive: true, hasDevices: false });

  useEffect(() => {
    if (office) setFormData(office);
    else setFormData({ id: Date.now().toString(), name: "", address: "", latitude: 19.4326, longitude: -99.1332, geofenceRadius: 200, allowMobileApp: true, allowHardware: false, assignedDevices: [], isActive: true, hasDevices: false });
  }, [office, open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) { toast({ title: "Error", description: "El nombre es requerido.", variant: "destructive" }); return; }
    if (!formData.address.trim()) { toast({ title: "Error", description: "La dirección es requerida.", variant: "destructive" }); return; }
    if (!formData.allowMobileApp && !formData.allowHardware) { toast({ title: "Error", description: "Selecciona al menos un método.", variant: "destructive" }); return; }
    onSave({ ...formData, hasDevices: formData.assignedDevices.length > 0, qrCode: formData.allowMobileApp ? `QR-${formData.name.toUpperCase().replace(/\s+/g, '-')}-001` : undefined });
  };

  const handleDeviceToggle = (deviceId: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, assignedDevices: checked ? [...prev.assignedDevices, deviceId] : prev.assignedDevices.filter(id => id !== deviceId) }));
  };

  const availableDevices = devices.filter(device => {
    const isAssignedToOther = existingOffices.some(off => off.id !== office?.id && off.assignedDevices.includes(device.id));
    return !isAssignedToOther || formData.assignedDevices.includes(device.id);
  });

  const getStatusIcon = (status: Device['status']) => {
    switch (status) { case 'online': return <Wifi className="h-4 w-4 text-green-500" />; case 'offline': return <WifiOff className="h-4 w-4 text-destructive" />; default: return <HelpCircle className="h-4 w-4 text-muted-foreground" />; }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{office ? "Editar Oficina" : "Nueva Oficina"}</DialogTitle><DialogDescription>Configura la ubicación y los métodos de checado permitidos</DialogDescription></DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
            <TabsTrigger value="geofence" disabled={!formData.allowMobileApp}>Geocerca</TabsTrigger>
            <TabsTrigger value="devices" disabled={!formData.allowHardware}>Dispositivos</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div><Label htmlFor="name">Nombre de la Oficina *</Label><Input id="name" placeholder="Ej. Oficina Central" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Reglas del Sitio</h4>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <div className="space-y-0.5"><Label htmlFor="allow-mobile">Permitir App Móvil (Geolocalización/QR)</Label><p className="text-sm text-muted-foreground">Habilita la validación por GPS y código QR</p></div>
                  <Switch id="allow-mobile" checked={formData.allowMobileApp} onCheckedChange={(checked) => setFormData({ ...formData, allowMobileApp: checked })} />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <div className="space-y-0.5"><Label htmlFor="allow-hardware">Permitir Reloj Checador Físico</Label><p className="text-sm text-muted-foreground">Habilita la sincronización con hardware biométrico</p></div>
                  <Switch id="allow-hardware" checked={formData.allowHardware} onCheckedChange={(checked) => setFormData({ ...formData, allowHardware: checked })} />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="geofence" className="space-y-4">
            <div className="space-y-4">
              <div><Label htmlFor="address">Dirección *</Label><Input id="address" placeholder="Dirección completa" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
              <div><Label htmlFor="radius">Radio de la Geocerca (metros)</Label><Input id="radius" type="number" min="50" max="1000" step="50" value={formData.geofenceRadius} onChange={(e) => setFormData({ ...formData, geofenceRadius: parseInt(e.target.value) })} /></div>
              <GeofenceMap latitude={formData.latitude} longitude={formData.longitude} radius={formData.geofenceRadius} onLocationChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))} />
            </div>
          </TabsContent>
          <TabsContent value="devices" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold mb-2">Dispositivos Asignados</h4>
              {availableDevices.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/50"><p className="text-muted-foreground">No hay dispositivos disponibles.</p></div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {availableDevices.map((device) => (
                    <div key={device.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox id={`device-${device.id}`} checked={formData.assignedDevices.includes(device.id)} onCheckedChange={(checked) => handleDeviceToggle(device.id, checked as boolean)} />
                      <div className="flex-1">
                        <Label htmlFor={`device-${device.id}`} className="flex items-center gap-2 cursor-pointer">
                          <span className="font-medium">{device.name}</span>{getStatusIcon(device.status)}<Badge variant="outline" className="ml-auto">{device.serialNumber}</Badge>
                        </Label>
                        {device.model && <p className="text-sm text-muted-foreground">{device.model}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={handleSubmit}>{office ? "Guardar Cambios" : "Crear Oficina"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};