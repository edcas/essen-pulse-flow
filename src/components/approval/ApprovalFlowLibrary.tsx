import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, X } from "lucide-react";
import { ApprovalFlow, ApprovalFlowType } from "@/types/approval-flow";
import { IncidenceConfig } from "@/types/incidence";
import { ApprovalFlowCard } from "./ApprovalFlowCard";
import { CreateApprovalFlowModal } from "./CreateApprovalFlowModal";
import { Input } from "@/components/ui/input";

interface ApprovalFlowLibraryProps {
  flows: ApprovalFlow[];
  incidences: IncidenceConfig[];
  onSave: (flow: ApprovalFlow) => void;
  onDelete: (id: string) => void;
}

export const ApprovalFlowLibrary = ({ flows, incidences, onSave, onDelete }: ApprovalFlowLibraryProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ApprovalFlow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ApprovalFlow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ApprovalFlowType | "all">("all");

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchQuery.toLowerCase()) || flow.incidenceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || flow.type === selectedType;
    return matchesSearch && matchesType;
  });

  const hasActiveFilters = selectedType !== "all" || searchQuery !== "";

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div><h2 className="text-2xl font-bold text-foreground">Flujos de Aprobación</h2><p className="text-sm text-muted-foreground mt-1">Define cadenas de aprobación para diferentes tipos de incidencias</p></div>
          <Button onClick={() => setIsCreating(true)} className="gap-2"><Plus className="h-4 w-4" />Nuevo Flujo</Button>
        </div>
        <div className="space-y-3">
          <Input placeholder="Buscar por nombre de flujo o incidencia..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-md" />
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && <Button variant="outline" size="sm" onClick={() => { setSelectedType("all"); setSearchQuery(""); }} className="gap-2"><X className="h-3 w-3" />Limpiar</Button>}
            <Button variant={selectedType === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("all")}>Todos</Button>
            <Button variant={selectedType === "solicitud" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("solicitud")}>Solicitudes</Button>
            <Button variant={selectedType === "incidencia" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("incidencia")}>Incidencias</Button>
          </div>
        </div>
        {filteredFlows.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg"><p className="text-muted-foreground">{hasActiveFilters ? "No se encontraron flujos" : "No hay flujos configurados"}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlows.map((flow) => (<ApprovalFlowCard key={flow.id} flow={flow} onEdit={setEditingFlow} onDelete={setDeleteConfirm} />))}
          </div>
        )}
      </div>
      <CreateApprovalFlowModal open={isCreating || !!editingFlow} onOpenChange={(open) => { if (!open) { setIsCreating(false); setEditingFlow(null); } }} onSave={onSave} incidences={incidences} existingFlow={editingFlow} />
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar flujo?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el flujo "{deleteConfirm?.name}".</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteConfirm) { onDelete(deleteConfirm.id); setDeleteConfirm(null); } }} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
};