import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, XCircle, MessageSquare, Clock, Paperclip, AlertTriangle, FileCheck, FileEdit, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clarification } from "@/types/clarification";
import { cn } from "@/lib/utils";

interface ClarificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clarification: Clarification;
  onStatusUpdate: (clarificationId: string, status: Clarification["status"], comment?: string) => void;
  onAddComment: (clarificationId: string, comment: string) => void;
  onEditRecord: (clarificationId: string) => void;
}

const pendingTypeLabels = {
  anomaly: { label: "Anomalía del Sistema", icon: AlertTriangle, color: "text-destructive" },
  request: { label: "Solicitud de Ausencia", icon: FileCheck, color: "text-secondary" },
  correction: { label: "Corrección de Registro", icon: FileEdit, color: "text-primary" },
};

const requestTypeLabels: Record<string, string> = { vacation: "Vacaciones", sick_leave: "Incapacidad médica", permission: "Permiso personal", home_office: "Trabajo desde casa" };
const anomalyTypeLabels: Record<string, string> = { absence: "Falta detectada", late: "Retardo", early_departure: "Salida anticipada" };

export const ClarificationDetailModal = ({ isOpen, onClose, clarification, onStatusUpdate, onAddComment, onEditRecord }: ClarificationDetailModalProps) => {
  const [comment, setComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleApprove = () => { onStatusUpdate(clarification.id, "approved", comment.trim() || undefined); setComment(""); };
  const handleReject = () => { onStatusUpdate(clarification.id, "rejected", comment.trim() || undefined); setComment(""); };
  const handleSendComment = () => { if (comment.trim()) { onAddComment(clarification.id, comment); setComment(""); setIsReplying(false); } };

  const isPending = clarification.status === "pending";
  const typeConfig = pendingTypeLabels[clarification.pendingType];
  const TypeIcon = typeConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                <span>{typeConfig.label}</span>
              </div>
              <Badge variant={clarification.status === "pending" ? "secondary" : clarification.status === "approved" ? "default" : clarification.status === "rejected" ? "destructive" : "outline"}>
                {clarification.status === "pending" ? "Pendiente" : clarification.status === "approved" ? "Aprobada" : clarification.status === "rejected" ? "Rechazada" : "Resuelta"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <Avatar className="h-12 w-12">
                <AvatarImage src={clarification.workerAvatar} />
                <AvatarFallback>{clarification.workerName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-lg">{clarification.workerName}</div>
                <div className="text-sm text-muted-foreground">{clarification.department} • {clarification.workerId}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {clarification.dateRange ? (
                <>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Fecha de inicio</div>
                    <div className="font-medium">{format(new Date(clarification.dateRange.start), "dd 'de' MMMM, yyyy", { locale: es })}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Fecha de fin</div>
                    <div className="font-medium">{format(new Date(clarification.dateRange.end), "dd 'de' MMMM, yyyy", { locale: es })}</div>
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Fecha del Incidente</div>
                  <div className="font-medium">{format(new Date(clarification.incidentDate), "dd 'de' MMMM, yyyy", { locale: es })}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Tipo</div>
                {clarification.requestType && <Badge variant="secondary">{requestTypeLabels[clarification.requestType]}</Badge>}
                {clarification.anomalyType && <Badge variant="destructive">{anomalyTypeLabels[clarification.anomalyType]}</Badge>}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Fuente</div>
                <Badge variant="secondary">{clarification.source === "admin" ? "Admin RHH" : "Trabajador"}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {clarification.pendingType === "anomaly" ? "Detalle de la Anomalía" : clarification.pendingType === "request" ? "Motivo de la Solicitud" : "Motivo de la Corrección"}
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-sm">{clarification.reason}</div>
            </div>

            {clarification.attachments && clarification.attachments.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Archivos Adjuntos</div>
                <div className="flex flex-wrap gap-2">
                  {clarification.attachments.map((file, index) => (
                    <Button key={index} variant="outline" size="sm" className="gap-2"><Paperclip className="h-4 w-4" />{file}<Download className="h-4 w-4 ml-2" /></Button>
                  ))}
                </div>
              </div>
            )}

            {clarification.pendingType === "correction" && (clarification.originalCheckIn || clarification.proposedCheckIn) && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Comparación de Registros</div>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Registro Original</div>
                    <div className="font-mono text-sm">
                      <div className="flex justify-between py-1"><span>Entrada:</span><span className="font-semibold">{clarification.originalCheckIn || "--:--"}</span></div>
                      <div className="flex justify-between py-1"><span>Salida:</span><span className="font-semibold">{clarification.originalCheckOut || "--:--"}</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-primary mb-2">Registro Solicitado</div>
                    <div className="font-mono text-sm">
                      <div className="flex justify-between py-1"><span>Entrada:</span><span className="font-semibold text-primary">{clarification.proposedCheckIn || "--:--"}</span></div>
                      <div className="flex justify-between py-1"><span>Salida:</span><span className="font-semibold text-primary">{clarification.proposedCheckOut || "--:--"}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium"><Clock className="h-4 w-4 text-primary" />Historial de Acciones</div>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-border" />
                {clarification.history.map((item, index) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-6 top-1.5">
                      <div className={cn("h-3 w-3 rounded-full border-2 transition-all duration-300", index === 0 ? "bg-primary border-primary shadow-lg shadow-primary/50" : "bg-background border-primary/30")} />
                    </div>
                    <div className={cn("p-4 rounded-lg border", index === 0 ? "bg-primary/5 border-primary/20" : "bg-card border-border")}>
                      <div className="flex items-center gap-2"><div className={cn("font-semibold text-sm", index === 0 && "text-primary")}>{item.action}</div></div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{format(new Date(item.timestamp), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}</div>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs font-medium text-muted-foreground">{item.performedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4" />Conversación</div>
              <div className="space-y-3">
                {clarification.comments.map((commentItem) => (
                  <div key={commentItem.id} className={cn("flex gap-3 p-3 rounded-lg", commentItem.authorRole === "admin" ? "bg-primary/5" : "bg-muted/50")}>
                    <Avatar className="h-8 w-8"><AvatarFallback>{commentItem.author.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{commentItem.author}</span>
                        <Badge variant="outline" className="text-xs">{commentItem.authorRole === "admin" ? "Admin" : "Trabajador"}</Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(commentItem.timestamp), "dd/MM/yy HH:mm", { locale: es })}</span>
                      </div>
                      <div className="text-sm">{commentItem.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              {isReplying || isPending ? (
                <div className="space-y-2">
                  <Textarea placeholder="Escribe tu respuesta..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setIsReplying(false); setComment(""); }}>Cancelar</Button>
                    <Button size="sm" onClick={handleSendComment} disabled={!comment.trim()}>Enviar Comentario</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsReplying(true)} className="gap-2"><MessageSquare className="h-4 w-4" />Responder</Button>
              )}
            </div>
          </div>
        </ScrollArea>

        {isPending && (
          <div className="px-6 pb-6 pt-4 border-t bg-muted/30">
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {clarification.pendingType === "anomaly" && (
                <>
                  <Button variant="outline" onClick={handleReject} className="gap-2"><XCircle className="h-4 w-4" />Descartar</Button>
                  <Button onClick={handleApprove} className="gap-2"><CheckCircle className="h-4 w-4" />Aprobar Anomalía</Button>
                </>
              )}
              {clarification.pendingType === "request" && (
                <>
                  <Button variant="destructive" onClick={handleReject} className="gap-2"><XCircle className="h-4 w-4" />Rechazar Solicitud</Button>
                  <Button onClick={handleApprove} className="gap-2"><CheckCircle className="h-4 w-4" />Aprobar Solicitud</Button>
                </>
              )}
              {clarification.pendingType === "correction" && (
                <>
                  <Button variant="outline" onClick={handleReject} className="gap-2"><XCircle className="h-4 w-4" />Rechazar</Button>
                  <Button variant="secondary" onClick={() => onEditRecord(clarification.id)} className="gap-2"><FileEdit className="h-4 w-4" />Editar Registro</Button>
                  <Button onClick={handleApprove} className="gap-2"><CheckCircle className="h-4 w-4" />Aplicar y Aprobar</Button>
                </>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
