import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, FileCheck, FileEdit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clarification, PendingType } from "@/types/clarification";

interface ClarificationTableProps {
  clarifications: Clarification[];
  onClarificationClick: (clarification: Clarification) => void;
}

const pendingTypeConfig: Record<PendingType, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" }> = {
  anomaly: { label: "Anomalía", icon: <AlertTriangle className="h-3 w-3" />, variant: "destructive" },
  request: { label: "Solicitud", icon: <FileCheck className="h-3 w-3" />, variant: "secondary" },
  correction: { label: "Corrección", icon: <FileEdit className="h-3 w-3" />, variant: "default" },
};

const getDetailText = (clarification: Clarification) => {
  if (clarification.pendingType === "request" && clarification.dateRange) {
    return `${format(new Date(clarification.dateRange.start), "dd/MM", { locale: es })} - ${format(new Date(clarification.dateRange.end), "dd/MM", { locale: es })}`;
  }
  return clarification.reason;
};

export const ClarificationTable = ({ clarifications, onClarificationClick }: ClarificationTableProps) => {
  if (clarifications.length === 0) {
    return (<div className="rounded-md border bg-card p-12 text-center"><p className="text-muted-foreground">No hay pendientes para mostrar</p></div>);
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Empleado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Fecha(s) Relevante(s)</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clarifications.map((clarification) => {
            const config = pendingTypeConfig[clarification.pendingType];
            return (
              <TableRow key={clarification.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onClarificationClick(clarification)}>
                <TableCell><Badge variant={config.variant} className="gap-1">{config.icon}{config.label}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={clarification.workerAvatar} />
                      <AvatarFallback>{clarification.workerName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{clarification.workerName}</div>
                      <div className="text-xs text-muted-foreground">{clarification.workerRFC}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{clarification.department}</TableCell>
                <TableCell>{clarification.office}</TableCell>
                <TableCell>
                  {clarification.dateRange ? (
                    <div className="text-sm">
                      <div>{format(new Date(clarification.dateRange.start), "dd MMM", { locale: es })}</div>
                      <div className="text-muted-foreground">→ {format(new Date(clarification.dateRange.end), "dd MMM", { locale: es })}</div>
                    </div>
                  ) : (format(new Date(clarification.incidentDate), "dd/MM/yyyy", { locale: es }))}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{getDetailText(clarification)}</div>
                  {clarification.attachments && clarification.attachments.length > 0 && (
                    <Badge variant="outline" className="mt-1 text-xs">{clarification.attachments.length} archivo(s)</Badge>
                  )}
                </TableCell>
                <TableCell><span className="text-sm text-primary hover:underline">Ver detalle</span></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
