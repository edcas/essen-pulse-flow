import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings, Trash2, X } from "lucide-react";
import { IncidenceConfig, IncidenceCategory } from "@/types/incidence";
import { IncidenceConfigModal } from "./IncidenceConfigModal";

interface IncidenceLibraryProps {
  incidences: IncidenceConfig[];
  onToggle: (id: string, active: boolean) => void;
  onCreate: () => void;
  onEdit: (incidence: IncidenceConfig) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<IncidenceCategory, string> = { ausentismo: "Ausentismo", horas_extra: "Horas Extra", monetarias: "Monetarias" };
const categoryColors: Record<IncidenceCategory, string> = { ausentismo: "bg-destructive/10 text-destructive", horas_extra: "bg-info/10 text-info", monetarias: "bg-success/10 text-success" };

export const IncidenceLibrary = ({ incidences, onToggle, onCreate, onEdit, onDelete }: IncidenceLibraryProps) => {
  const [selectedIncidence, setSelectedIncidence] = useState<IncidenceConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<IncidenceConfig | null>(null);
  const [deactivateConfirm, setDeactivateConfirm] = useState<IncidenceConfig | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<IncidenceCategory[]>([]);

  const toggleCategory = (category: IncidenceCategory) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const clearFilters = () => setSelectedCategories([]);
  const hasActiveFilters = selectedCategories.length > 0;
  const filteredIncidences = selectedCategories.length === 0 ? incidences : incidences.filter(inc => selectedCategories.includes(inc.categoria));

  const handleToggleActive = (incidence: IncidenceConfig, checked: boolean) => {
    if (!checked && incidence.activo) setDeactivateConfirm(incidence);
    else onToggle(incidence.id, checked);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h2 className="text-2xl font-bold text-foreground">Biblioteca de Incidencias</h2><p className="text-sm text-muted-foreground mt-1">Define las reglas de negocio e impacto en nómina de cada tipo de incidencia</p></div>
          <Button onClick={() => setIsCreating(true)} className="gap-2"><Plus className="h-4 w-4" />Crear Incidencia</Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant={!hasActiveFilters ? "default" : "outline"} size="sm" onClick={clearFilters}>Todos</Button>
          {(["ausentismo", "horas_extra", "monetarias"] as IncidenceCategory[]).map(cat => (
            <Button key={cat} variant={selectedCategories.includes(cat) ? "default" : "outline"} size="sm" onClick={() => toggleCategory(cat)}>{categoryLabels[cat]}</Button>
          ))}
          {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2"><X className="h-4 w-4" />Limpiar</Button>}
        </div>
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="w-[80px]">Estado</TableHead><TableHead>Nombre</TableHead><TableHead className="w-[100px]">Abreviatura</TableHead><TableHead className="w-[140px]">Categoría</TableHead><TableHead>Configuración</TableHead><TableHead className="w-[120px] text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredIncidences.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No hay incidencias que coincidan</TableCell></TableRow>) :
                filteredIncidences.map((incidence) => (
                  <TableRow key={incidence.id} className="hover:bg-muted/50">
                    <TableCell><Switch checked={incidence.activo} onCheckedChange={(checked) => handleToggleActive(incidence, checked)} /></TableCell>
                    <TableCell className="font-medium">{incidence.nombre}</TableCell>
                    <TableCell><Badge variant="secondary">{incidence.abreviatura}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={categoryColors[incidence.categoria]}>{categoryLabels[incidence.categoria]}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {incidence.visibleAutoservicio && <Badge variant="outline" className="text-xs">Autoservicio</Badge>}
                        {incidence.justificaDias && <Badge variant="outline" className="text-xs">Justifica días</Badge>}
                        {incidence.justificaChecadas && <Badge variant="outline" className="text-xs">Justifica checadas</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedIncidence(incidence)}><Settings className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(incidence)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
      {selectedIncidence && <IncidenceConfigModal incidence={selectedIncidence} open={!!selectedIncidence} onClose={() => setSelectedIncidence(null)} onSave={(updated) => { onEdit(updated); setSelectedIncidence(null); }} />}
      <IncidenceConfigModal incidence={null} open={isCreating} onClose={() => setIsCreating(false)} onSave={(newIncidence) => { onCreate(); onEdit(newIncidence); setIsCreating(false); }} />
      <AlertDialog open={!!deactivateConfirm} onOpenChange={(open) => !open && setDeactivateConfirm(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Desactivar incidencia?</AlertDialogTitle><AlertDialogDescription>Al desactivar "{deactivateConfirm?.nombre}", los usuarios ya no podrán crearla ni verla.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { if (deactivateConfirm) { onToggle(deactivateConfirm.id, false); setDeactivateConfirm(null); } }}>Confirmar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar incidencia?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer y eliminará toda la configuración asociada.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteConfirm) { onDelete(deleteConfirm.id); setDeleteConfirm(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
};