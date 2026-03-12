import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClarificationTable } from "./ClarificationTable";
import { ClarificationDetailModal } from "./ClarificationDetailModal";
import { CreateClarificationModal } from "./CreateClarificationModal";
import { Clarification, PendingType, AutoApprovalConfig } from "@/types/clarification";
import { toast } from "sonner";
import { UnifiedFilters } from "./UnifiedFilters";
import { AutoApprovalConfigModal } from "./AutoApprovalConfigModal";
import { EditRecordModal } from "./EditRecordModal";

const generateMockClarifications = (): Clarification[] => {
  const workers = [
    { id: "w1", name: "Juan Pérez", rfc: "PEJX850101ABC", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", department: "Operaciones", costCenter: "CC-001", position: "Operador", office: "Oficina Centro" },
    { id: "w2", name: "María García", rfc: "GARM880202BCD", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", department: "Administración", costCenter: "CC-002", position: "Administradora", office: "Oficina Norte" },
    { id: "w3", name: "Carlos López", rfc: "LOPC900303CDE", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", department: "Operaciones", costCenter: "CC-001", position: "Supervisor", office: "Oficina Centro" },
    { id: "w4", name: "Ana Martínez", rfc: "MARA870404DEF", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", department: "Recursos Humanos", costCenter: "CC-003", position: "Gerente RH", office: "Oficina Centro" },
    { id: "w5", name: "Pedro Sánchez", rfc: "SAMP920505EFG", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", department: "Ventas", costCenter: "CC-004", position: "Vendedor", office: "Oficina Sur" },
  ];

  const pendingTypes: PendingType[] = ["anomaly", "request", "correction"];
  const origins: Clarification["origin"][] = ["entrada", "salida", "inicio_comida", "fin_comida", "omision_entrada", "omision_salida"];
  const anomalyReasons = [
    { type: "absence" as const, reason: "Falta detectada - no se registró asistencia" },
    { type: "late" as const, reason: "Retardo de 15 minutos" },
    { type: "early_departure" as const, reason: "Salida anticipada detectada" },
  ];
  const requestReasons = [
    { type: "vacation" as const, reason: "Solicitud de vacaciones" },
    { type: "sick_leave" as const, reason: "Incapacidad médica" },
    { type: "permission" as const, reason: "Permiso personal" },
    { type: "home_office" as const, reason: "Trabajo desde casa" },
  ];
  const correctionReasons = ["Olvidé registrar mi entrada", "Olvidé registrar mi salida", "El sistema no capturó mi check-in", "Error en el registro de comida"];

  return Array.from({ length: 20 }, (_, i) => {
    const worker = workers[i % workers.length];
    const pendingType = pendingTypes[i % pendingTypes.length];
    const status: Clarification["status"] = i < 8 ? "pending" : i < 14 ? "approved" : i < 17 ? "resolved" : "rejected";
    const source: Clarification["source"] = i % 3 === 0 ? "admin" : "worker";
    const requestDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const incidentDate = new Date(requestDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000);

    let reason = "", requestType: Clarification["requestType"] = undefined, anomalyType: Clarification["anomalyType"] = undefined, dateRange: Clarification["dateRange"] = undefined, attachments: string[] = [];

    if (pendingType === "anomaly") { const a = anomalyReasons[i % anomalyReasons.length]; reason = a.reason; anomalyType = a.type; }
    else if (pendingType === "request") {
      const r = requestReasons[i % requestReasons.length]; reason = r.reason; requestType = r.type;
      if (requestType === "vacation" || requestType === "sick_leave") { const end = new Date(incidentDate); end.setDate(end.getDate() + Math.floor(Math.random() * 5) + 1); dateRange = { start: incidentDate.toISOString().split('T')[0], end: end.toISOString().split('T')[0] }; }
      if (requestType === "sick_leave") { attachments = ["receta_medica.pdf"]; }
    } else { reason = correctionReasons[i % correctionReasons.length]; }

    return {
      id: `c${i + 1}`, pendingType, workerId: worker.id, workerName: worker.name, workerRFC: worker.rfc, workerAvatar: worker.avatar,
      department: worker.department, costCenter: worker.costCenter, position: worker.position, office: worker.office,
      requestDate: requestDate.toISOString().split('T')[0], incidentDate: incidentDate.toISOString().split('T')[0],
      origin: origins[i % origins.length], reason, status, source, requestType, anomalyType, dateRange, attachments,
      comments: [{ id: `comment-${i}-1`, author: worker.name, authorRole: "worker" as const, content: `${reason}. Por favor revisar mi solicitud.`, timestamp: requestDate.toISOString() }],
      history: [{ id: `history-${i}-1`, action: "Solicitud creada", description: `${source === "admin" ? "Admin RHH" : worker.name} creó la solicitud`, performedBy: source === "admin" ? "Admin RHH" : worker.name, timestamp: requestDate.toISOString() }],
      originalCheckIn: pendingType === "correction" ? "09:00" : null, originalCheckOut: null,
      proposedCheckIn: pendingType === "correction" ? "09:15" : null, proposedCheckOut: pendingType === "correction" ? "18:00" : null,
    };
  });
};

export const ClarificationView = () => {
  const [clarifications, setClarifications] = useState<Clarification[]>(generateMockClarifications());
  const [filteredClarifications, setFilteredClarifications] = useState<Clarification[]>(generateMockClarifications());
  const [selectedClarification, setSelectedClarification] = useState<Clarification | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClarification, setEditingClarification] = useState<Clarification | null>(null);
  const [autoApprovalConfig, setAutoApprovalConfig] = useState<AutoApprovalConfig>({ enabled: false, daysBeforeAutoApproval: 3 });

  const handleClarificationClick = (clarification: Clarification) => { setSelectedClarification(clarification); setIsDetailModalOpen(true); };

  const handleStatusUpdate = (clarificationId: string, newStatus: Clarification["status"], comment?: string) => {
    setClarifications(prev => prev.map(c => {
      if (c.id !== clarificationId) return c;
      const updatedComments = comment ? [...c.comments, { id: `comment-${Date.now()}`, author: "Admin RHH", authorRole: "admin" as const, content: comment, timestamp: new Date().toISOString() }] : c.comments;
      const updatedHistory = [...c.history, { id: `history-${Date.now()}`, action: `Estado cambiado a ${newStatus}`, description: `Admin RHH cambió el estado`, performedBy: "Admin RHH", timestamp: new Date().toISOString() }];
      return { ...c, status: newStatus, comments: updatedComments, history: updatedHistory };
    }));
    const statusMessages = { approved: "Aclaración aprobada", rejected: "Aclaración rechazada", resolved: "Aclaración resuelta", pending: "Marcada como pendiente" };
    toast.success(statusMessages[newStatus]);
    setIsDetailModalOpen(false);
  };

  const handleAddComment = (clarificationId: string, comment: string) => {
    setClarifications(prev => prev.map(c => c.id === clarificationId ? { ...c, comments: [...c.comments, { id: `comment-${Date.now()}`, author: "Admin RHH", authorRole: "admin" as const, content: comment, timestamp: new Date().toISOString() }] } : c));
    toast.success("Comentario agregado");
  };

  const handleCreateClarification = (clarification: Partial<Clarification>) => {
    const newC: Clarification = {
      id: `c${clarifications.length + 1}`, pendingType: clarification.pendingType || "correction",
      workerId: clarification.workerId!, workerName: clarification.workerName!, workerRFC: clarification.workerRFC || "", workerAvatar: clarification.workerAvatar || "",
      department: clarification.department!, costCenter: clarification.costCenter || "", position: clarification.position || "", office: clarification.office || "",
      requestDate: new Date().toISOString().split('T')[0], incidentDate: clarification.incidentDate!, origin: clarification.origin!,
      reason: clarification.reason!, status: "pending", source: "admin", requestType: clarification.requestType, anomalyType: clarification.anomalyType, dateRange: clarification.dateRange,
      comments: [], history: [{ id: `history-${Date.now()}`, action: "Solicitud creada", description: "Admin RHH creó la solicitud manualmente", performedBy: "Admin RHH", timestamp: new Date().toISOString() }],
      originalCheckIn: clarification.originalCheckIn, originalCheckOut: clarification.originalCheckOut, proposedCheckIn: clarification.proposedCheckIn, proposedCheckOut: clarification.proposedCheckOut,
    };
    const updated = [newC, ...clarifications];
    setClarifications(updated);
    setFilteredClarifications(updated);
    setIsCreateModalOpen(false);
    toast.success("Incidencia creada correctamente");
  };

  const handleFilterChange = (filters: { pendingTypes: PendingType[]; departments: string[]; offices: string[]; dateRange: { start: string | null; end: string | null }; searchTerm: string }) => {
    let filtered = clarifications.filter(c => c.status === "pending");
    if (filters.pendingTypes.length > 0) filtered = filtered.filter(c => filters.pendingTypes.includes(c.pendingType));
    if (filters.departments.length > 0) filtered = filtered.filter(c => filters.departments.includes(c.department));
    if (filters.offices.length > 0) filtered = filtered.filter(c => filters.offices.includes(c.office));
    if (filters.dateRange.start) filtered = filtered.filter(c => c.incidentDate >= filters.dateRange.start!);
    if (filters.dateRange.end) filtered = filtered.filter(c => c.incidentDate <= filters.dateRange.end!);
    if (filters.searchTerm) { const term = filters.searchTerm.toLowerCase(); filtered = filtered.filter(c => c.workerName.toLowerCase().includes(term) || c.workerRFC.toLowerCase().includes(term) || c.reason.toLowerCase().includes(term)); }
    setFilteredClarifications(filtered);
  };

  const handleEditRecord = (clarificationId: string) => {
    const c = clarifications.find(x => x.id === clarificationId);
    if (c) { setEditingClarification(c); setIsDetailModalOpen(false); setIsEditModalOpen(true); }
  };

  const handleSaveEditedRecord = (clarificationId: string, checkIn: string | null, checkOut: string | null, generateIncident: boolean) => {
    setClarifications(prev => prev.map(c => c.id === clarificationId ? {
      ...c, proposedCheckIn: checkIn, proposedCheckOut: checkOut, status: "resolved" as const,
      history: [{ id: Date.now().toString(), action: "Registro editado manualmente", description: `Admin modificó el registro.`, performedBy: "Admin RHH", timestamp: new Date().toISOString() }, ...c.history],
    } : c));
    setIsEditModalOpen(false);
    setEditingClarification(null);
    toast.success(generateIncident ? "Registro actualizado. Se generó la incidencia de ajuste." : "Registro actualizado correctamente.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Centro de Aprobación Unificado</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona todas las incidencias de asistencia en un solo lugar</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsConfigModalOpen(true)} variant="outline" className="gap-2"><Settings className="h-4 w-4" />Configuración</Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Crear Incidencia</Button>
        </div>
      </div>
      <UnifiedFilters clarifications={clarifications} onFilterChange={handleFilterChange} />
      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Mostrando {filteredClarifications.length} pendientes</span></div>
      <ClarificationTable clarifications={filteredClarifications} onClarificationClick={handleClarificationClick} />
      {selectedClarification && (<ClarificationDetailModal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedClarification(null); }} clarification={selectedClarification} onStatusUpdate={handleStatusUpdate} onAddComment={handleAddComment} onEditRecord={handleEditRecord} />)}
      {editingClarification && (<EditRecordModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingClarification(null); }} clarification={editingClarification} onSave={handleSaveEditedRecord} />)}
      <CreateClarificationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateClarification} />
      <AutoApprovalConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} config={autoApprovalConfig} onSave={(config) => { setAutoApprovalConfig(config); setIsConfigModalOpen(false); toast.success("Configuración guardada"); }} />
    </div>
  );
};
