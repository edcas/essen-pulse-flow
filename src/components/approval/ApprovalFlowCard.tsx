import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Trash2 } from "lucide-react";
import { ApprovalFlow } from "@/types/approval-flow";

interface ApprovalFlowCardProps { flow: ApprovalFlow; onEdit: (flow: ApprovalFlow) => void; onDelete: (flow: ApprovalFlow) => void; }

export const ApprovalFlowCard = ({ flow, onEdit, onDelete }: ApprovalFlowCardProps) => {
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const allApprovers = flow.levels.flatMap(level => level.approvers);
  const uniqueApprovers = Array.from(new Map(allApprovers.map(a => [a.id, a])).values());

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-lg font-semibold">{flow.name}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{flow.incidenceName}</Badge>
              <Badge variant={flow.type === "solicitud" ? "default" : "secondary"} className="text-xs">{flow.type === "solicitud" ? "Solicitud" : "Incidencia"}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(flow)} className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(flow)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Etapas</span><Badge variant="outline">{flow.levels.length}</Badge></div>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Aprobadores</span>
          <div className="flex -space-x-2">
            {uniqueApprovers.slice(0, 5).map((a) => (<Avatar key={a.id} className="h-8 w-8 border-2 border-background"><AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(a.name)}</AvatarFallback></Avatar>))}
            {uniqueApprovers.length > 5 && <Avatar className="h-8 w-8 border-2 border-background"><AvatarFallback className="text-xs bg-muted">+{uniqueApprovers.length - 5}</AvatarFallback></Avatar>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};