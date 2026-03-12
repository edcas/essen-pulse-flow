import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, Plus, Search, Wifi, WifiOff, HelpCircle, Loader2 } from "lucide-react";
import { Device } from "@/types/device";
import { DeviceModal } from "./DeviceModal";
import { useToast } from "@/hooks/use-toast";

export const DeviceTable = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Reloj Comedor", serialNumber: "SN-123456", model: "ZKTeco MB460", assignedLocation: "Oficina Central", status: "online" },
    { id: "2", name: "Reloj Recepción", serialNumber: "SN-789012", model: "ZKTeco MB460", status: "unverified" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const filteredDevices = devices.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddDevice = (device: Omit<Device, "id" | "status">) => {
    setDevices([...devices, { ...device, id: Date.now().toString(), status: "unverified" }]);
    setIsModalOpen(false);
    toast({ title: "Dispositivo agregado", description: "El dispositivo se ha registrado correctamente." });
  };

  const handleEditDevice = (device: Omit<Device, "id" | "status">) => {
    if (!editingDevice) return;
    setDevices(devices.map(d => d.id === editingDevice.id ? { ...d, ...device } : d));
    setEditingDevice(undefined); setIsModalOpen(false);
    toast({ title: "Dispositivo actualizado", description: "Los cambios se han guardado correctamente." });
  };

  const handleDeleteDevice = (device: Device) => {
    if (device.assignedLocation) { toast({ title: "No se puede eliminar", description: `Este dispositivo está asignado a ${device.assignedLocation}.`, variant: "destructive" }); return; }
    setDeviceToDelete(device); setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deviceToDelete) { setDevices(devices.filter(d => d.id !== deviceToDelete.id)); toast({ title: "Dispositivo eliminado", description: "El dispositivo se ha eliminado del inventario." }); }
    setDeleteDialogOpen(false); setDeviceToDelete(null);
  };

  const testConnection = async (device: Device) => {
    setTestingConnection(device.id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const isSuccess = Math.random() > 0.3;
    setDevices(devices.map(d => d.id === device.id ? { ...d, status: isSuccess ? "online" as const : "offline" as const, lastChecked: new Date() } : d));
    toast({ title: isSuccess ? "Conexión exitosa" : "Conexión fallida", description: isSuccess ? "El dispositivo está en línea." : "No se pudo conectar.", variant: isSuccess ? undefined : "destructive" });
    setTestingConnection(null);
  };

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "online": return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><Wifi className="h-3 w-3 mr-1" />En línea</Badge>;
      case "offline": return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><WifiOff className="h-3 w-3 mr-1" />Sin conexión</Badge>;
      case "unverified": return <Badge variant="outline" className="text-muted-foreground"><HelpCircle className="h-3 w-3 mr-1" />Sin verificar</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>Inventario de Dispositivos</CardTitle><CardDescription>Administra los relojes checadores físicos y su conectividad</CardDescription></div>
            <Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Agregar Dispositivo</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nombre o número de serie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div></div>
          {filteredDevices.length === 0 ? (
            <div className="text-center py-12"><Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">{devices.length === 0 ? "No hay dispositivos registrados" : "No se encontraron resultados"}</h3></div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>No. de Serie / ID</TableHead><TableHead>Modelo</TableHead><TableHead>Ubicación Asignada</TableHead><TableHead>Estado</TableHead><TableHead className="w-[100px]">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell className="font-mono text-sm">{device.serialNumber}</TableCell>
                      <TableCell>{device.model || "-"}</TableCell>
                      <TableCell>{device.assignedLocation || <span className="text-muted-foreground">Sin asignar</span>}</TableCell>
                      <TableCell>{getStatusBadge(device.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => testConnection(device)} disabled={testingConnection === device.id}>
                            {testingConnection === device.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wifi className="h-4 w-4" />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingDevice(device); setIsModalOpen(true); }}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteDevice(device)} className="text-destructive">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <DeviceModal open={isModalOpen} onOpenChange={() => { setIsModalOpen(false); setEditingDevice(undefined); }} onSubmit={editingDevice ? handleEditDevice : handleAddDevice} device={editingDevice} existingSerialNumbers={devices.filter(d => d.id !== editingDevice?.id).map(d => d.serialNumber)} />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar dispositivo?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. El dispositivo "{deviceToDelete?.name}" será eliminado permanentemente.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
};