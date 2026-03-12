import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Smartphone, QrCode, Fingerprint, ScanFace } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Employee, Office } from "@/types/check-methods";
import { AssignMethodsPanel } from "./AssignMethodsPanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StandardFilters, FilterValues, FilterOptions } from "@/components/shared/StandardFilters";

export const CheckMethodsTable = () => {
  const { toast } = useToast();
  const [filterValues, setFilterValues] = useState<FilterValues>({ search: "", department: "all", costCenter: "all", position: "all", office: "all" });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "Juan Pérez", area: "Producción", department: "Operaciones", position: "Operador", costCenter: "CC-001", assignedOffice: "Planta Norte", checkMethods: { app: true, qr: true, biometric: false, facial: false } },
    { id: "2", name: "María González", area: "Administración", department: "Recursos Humanos", position: "Gerente", costCenter: "CC-002", assignedOffice: "Oficina Central", checkMethods: { app: true, qr: false, biometric: true, facial: false } },
    { id: "3", name: "Carlos Rodríguez", area: "Ventas", department: "Comercial", position: "Vendedor", costCenter: "CC-003", assignedOffice: "Sucursal Sur", checkMethods: { app: true, qr: true, biometric: false, facial: true } },
  ]);

  const offices: Office[] = [
    { id: "1", name: "Planta Norte", address: "Carretera Nacional 123", latitude: 25.6866, longitude: -100.3161, geofenceRadius: 500, allowMobileApp: false, allowHardware: true, assignedDevices: [], isActive: true, hasDevices: false },
    { id: "2", name: "Oficina Central", address: "Av. Insurgentes Sur 1602", latitude: 19.3910, longitude: -99.1720, geofenceRadius: 200, allowMobileApp: true, allowHardware: true, assignedDevices: ["2"], isActive: true, hasDevices: true, qrCode: "QR-CENTRAL-001" },
    { id: "3", name: "Sucursal Sur", address: "Calz. de Tlalpan 4800", latitude: 19.2899, longitude: -99.1419, geofenceRadius: 150, allowMobileApp: true, allowHardware: false, assignedDevices: [], isActive: true, hasDevices: false, qrCode: "QR-SUR-001" },
  ];

  const handleOpenEditModal = (employee: Employee) => { setEditingEmployee(employee); setShowAssignModal(true); };

  const handleAssignMethods = (officeId: string, methods: Employee['checkMethods']) => {
    const office = offices.find(o => o.id === officeId);
    if (!office) return;
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { ...emp, assignedOffice: office.name, checkMethods: methods } : emp));
      toast({ title: "Actualización completa", description: `Se actualizó la oficina y métodos para ${editingEmployee.name}` });
      setEditingEmployee(null); setShowAssignModal(false); return;
    }
    const updatedEmployees = employees.map(emp => !selectedEmployees.includes(emp.id) ? emp : { ...emp, assignedOffice: office.name, checkMethods: methods });
    setEmployees(updatedEmployees); setSelectedEmployees([]);
    toast({ title: "Asignación masiva completada", description: `Se asignó oficina "${office.name}" a ${selectedEmployees.length} empleado(s).` });
    setShowAssignModal(false);
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    setSelectedEmployees(prev => checked ? [...prev, employeeId] : prev.filter(id => id !== employeeId));
  };

  const filterOptions: FilterOptions = {
    departments: Array.from(new Set(employees.map(e => e.department))),
    costCenters: Array.from(new Set(employees.map(e => e.costCenter))),
    positions: Array.from(new Set(employees.map(e => e.position))),
    offices: Array.from(new Set(employees.map(e => e.assignedOffice))),
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = filterValues.search === "" || emp.name.toLowerCase().includes(filterValues.search.toLowerCase()) || emp.area.toLowerCase().includes(filterValues.search.toLowerCase());
    const matchesDepartment = filterValues.department === "all" || emp.department === filterValues.department;
    const matchesCostCenter = filterValues.costCenter === "all" || emp.costCenter === filterValues.costCenter;
    const matchesPosition = filterValues.position === "all" || emp.position === filterValues.position;
    const matchesOffice = filterValues.office === "all" || emp.assignedOffice === filterValues.office;
    return matchesSearch && matchesDepartment && matchesCostCenter && matchesPosition && matchesOffice;
  });

  const handleSelectAll = (checked: boolean) => { setSelectedEmployees(checked ? filteredEmployees.map(e => e.id) : []); };

  return (
    <div className="flex gap-4 items-start">
      <div className={selectedEmployees.length > 0 ? "w-[60%]" : "w-full"}>
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Checado</CardTitle>
            <CardDescription>Configura qué métodos de validación de asistencia puede utilizar cada colaborador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <StandardFilters options={filterOptions} values={filterValues} onValuesChange={setFilterValues} />
            </div>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay empleados</h3>
                <p className="text-muted-foreground">No se encontraron empleados con los criterios de búsqueda</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"><Checkbox checked={selectedEmployees.length === filteredEmployees.length} onCheckedChange={handleSelectAll} /></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Oficina Asignada</TableHead>
                      <TableHead>Métodos de Checado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell><Checkbox checked={selectedEmployees.includes(employee.id)} onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked as boolean)} /></TableCell>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.area}</TableCell>
                        <TableCell>{employee.assignedOffice}</TableCell>
                        <TableCell>
                          <button onClick={() => handleOpenEditModal(employee)} className="flex flex-wrap items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                            <TooltipProvider>
                              {employee.checkMethods.app && (<Tooltip><TooltipTrigger asChild><div className="flex items-center gap-1 text-primary"><Smartphone className="h-4 w-4" /><span className="text-xs">App/GPS</span></div></TooltipTrigger><TooltipContent><p>App / Geolocalización</p></TooltipContent></Tooltip>)}
                              {employee.checkMethods.qr && (<Tooltip><TooltipTrigger asChild><div className="flex items-center gap-1 text-primary"><QrCode className="h-4 w-4" /><span className="text-xs">QR</span></div></TooltipTrigger><TooltipContent><p>Código QR</p></TooltipContent></Tooltip>)}
                              {employee.checkMethods.biometric && (<Tooltip><TooltipTrigger asChild><div className="flex items-center gap-1 text-primary"><Fingerprint className="h-4 w-4" /><span className="text-xs">Biométrico</span></div></TooltipTrigger><TooltipContent><p>Biométrico / Hardware</p></TooltipContent></Tooltip>)}
                              {employee.checkMethods.facial && (<Tooltip><TooltipTrigger asChild><div className="flex items-center gap-1 text-primary"><ScanFace className="h-4 w-4" /><span className="text-xs">Facial</span></div></TooltipTrigger><TooltipContent><p>Reconocimiento Facial (App)</p></TooltipContent></Tooltip>)}
                              {!employee.checkMethods.app && !employee.checkMethods.qr && !employee.checkMethods.biometric && !employee.checkMethods.facial && (<span className="text-sm text-muted-foreground">Sin métodos asignados</span>)}
                            </TooltipProvider>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedEmployees.length > 0 && (
        <div className="w-[40%] sticky top-4">
          <AssignMethodsPanel
            onAssign={handleAssignMethods}
            onClose={() => { setSelectedEmployees([]); setEditingEmployee(null); setShowAssignModal(false); }}
            selectedCount={editingEmployee ? 1 : selectedEmployees.length}
            offices={offices}
            initialOfficeId={editingEmployee ? offices.find(o => o.name === editingEmployee.assignedOffice)?.id : undefined}
            initialMethods={editingEmployee?.checkMethods}
          />
        </div>
      )}
    </div>
  );
};