import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Smartphone, Fingerprint, Plus, Edit, Trash2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Office } from "@/types/check-methods";
import { Device } from "@/types/device";
import { OfficeLocationModal } from "./OfficeLocationModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface OfficeLocationsTableProps { devices: Device[]; }

export const OfficeLocationsTable = ({ devices }: OfficeLocationsTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | undefined>();
  const [deleteOffice, setDeleteOffice] = useState<Office | undefined>();
  const [deactivateOffice, setDeactivateOffice] = useState<Office | undefined>();

  const [offices, setOffices] = useState<Office[]>([
    { id: "1", name: "Oficina Central", address: "Av. Insurgentes Sur 1602, CDMX", latitude: 19.3910, longitude: -99.1720, geofenceRadius: 200, allowMobileApp: true, allowHardware: true, assignedDevices: ["2"], isActive: true, qrCode: "QR-CENTRAL-001", hasDevices: true },
    { id: "2", name: "Planta Norte", address: "Carretera Nacional 123, Monterrey", latitude: 25.6866, longitude: -100.3161, geofenceRadius: 500, allowMobileApp: false, allowHardware: true, assignedDevices: [], isActive: true, hasDevices: false },
    { id: "3", name: "Sucursal Sur", address: "Calz. de Tlalpan 4800, CDMX", latitude: 19.2899, longitude: -99.1419, geofenceRadius: 150, allowMobileApp: true, allowHardware: false, assignedDevices: [], isActive: true, qrCode: "QR-SUR-001", hasDevices: false },
  ]);

  const handleSaveOffice = (office: Office) => {
    if (editingOffice) { setOffices(prev => prev.map(o => o.id === office.id ? office : o)); toast({ title: "Oficina actualizada", description: `${office.name} ha sido actualizada.` }); }
    else { setOffices(prev => [...prev, office]); toast({ title: "Oficina creada", description: `${office.name} ha sido creada.` }); }
    setShowModal(false);
  };

  const handleDeleteOffice = () => { if (!deleteOffice) return; setOffices(prev => prev.filter(o => o.id !== deleteOffice.id)); toast({ title: "Oficina eliminada" }); setDeleteOffice(undefined); };

  const handleToggleActive = (office: Office) => {
    if (office.isActive) { setDeactivateOffice(office); return; }
    setOffices(prev => prev.map(o => o.id === office.id ? { ...o, isActive: true } : o));
    toast({ title: "Oficina activada" });
  };

  const handleConfirmDeactivate = () => { if (!deactivateOffice) return; setOffices(prev => prev.map(o => o.id === deactivateOffice.id ? { ...o, isActive: false } : o)); toast({ title: "Oficina desactivada" }); setDeactivateOffice(undefined); };

  const filteredOffices = offices.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.address.toLowerCase().includes(searchTerm.toLowerCase()));

  const getAssignedDeviceNames = (deviceIds: string[]) => devices.filter(d => deviceIds.includes(d.id)).map(d => d.name).join(", ") || "Sin dispositivos";

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>Oficinas y Ubicaciones</CardTitle><CardDescription>Administra las ubicaciones de trabajo y sus configuraciones de checado</CardDescription></div>
            <Button onClick={() => { setEditingOffice(undefined); setShowModal(true); }}><Plus className="h-4 w-4 mr-2" />Nueva Oficina</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nombre o dirección..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></div>
          {filteredOffices.length === 0 ? (
            <div className="text-center py-12"><MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">No hay oficinas configuradas</h3></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[100px] text-center">Estado</TableHead><TableHead className="w-[200px]">Oficina</TableHead><TableHead className="w-[250px]">Dirección</TableHead><TableHead>Métodos Activos</TableHead><TableHead>Dispositivos</TableHead><TableHead className="w-[120px] text-right">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredOffices.map((office) => (
                    <TableRow key={office.id} className={!office.isActive ? "opacity-50" : ""}>
                      <TableCell className="text-center"><Switch checked={office.isActive} onCheckedChange={() => handleToggleActive(office)} /></TableCell>
                      <TableCell><div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-primary/10 shrink-0"><MapPin className="h-3.5 w-3.5 text-primary" /></div><span className="font-medium">{office.name}</span></div></TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{office.address}</span></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {office.allowMobileApp && <Badge variant="secondary" className="gap-1.5 font-normal text-xs"><Smartphone className="h-3 w-3" />App / GPS</Badge>}
                          {office.allowHardware && <Badge variant="secondary" className="gap-1.5 font-normal text-xs"><Fingerprint className="h-3 w-3" />Hardware</Badge>}
                        </div>
                        {office.allowMobileApp && <div className="text-xs text-muted-foreground mt-1">Radio: {office.geofenceRadius}m</div>}
                      </TableCell>
                      <TableCell>
                        {office.allowHardware ? (<div className="space-y-1"><Badge variant={office.assignedDevices.length > 0 ? "default" : "destructive"} className="text-xs">{office.assignedDevices.length} Reloj{office.assignedDevices.length !== 1 ? 'es' : ''}</Badge>{office.assignedDevices.length > 0 && <div className="text-xs text-muted-foreground">{getAssignedDeviceNames(office.assignedDevices)}</div>}</div>) : <span className="text-xs text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {office.allowMobileApp && <Button variant="ghost" size="sm" onClick={() => toast({ title: "Descargando QR", description: `Generando código QR para ${office.name}...` })} className="h-8 px-2 hover:bg-primary/10"><QrCode className="h-4 w-4" /></Button>}
                          <Button variant="ghost" size="sm" onClick={() => { setEditingOffice(office); setShowModal(true); }} className="h-8 px-2 hover:bg-primary/10"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteOffice(office)} className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <OfficeLocationModal open={showModal} onOpenChange={setShowModal} onSave={handleSaveOffice} office={editingOffice} devices={devices} existingOffices={offices} />
      <AlertDialog open={!!deleteOffice} onOpenChange={() => setDeleteOffice(undefined)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar oficina?</AlertDialogTitle><AlertDialogDescription>¿Estás seguro de eliminar "{deleteOffice?.name}"?</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteOffice}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deactivateOffice} onOpenChange={() => setDeactivateOffice(undefined)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Desactivar oficina?</AlertDialogTitle><AlertDialogDescription>Los trabajadores quedarán sin reglas de check-in/check-out asignadas.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeactivate}>Desactivar de todas formas</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
};