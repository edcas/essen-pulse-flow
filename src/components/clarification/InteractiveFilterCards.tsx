import { PendingType } from "@/types/clarification";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ClipboardList, Edit3, LayoutGrid } from "lucide-react";

interface InteractiveFilterCardsProps {
  counts: {
    total: number;
    anomaly: number;
    request: number;
    correction: number;
  };
  selectedTypes: PendingType[];
  onToggleType: (type: PendingType | null) => void;
}

const TYPE_CONFIG = {
  all: {
    label: "Todos", icon: LayoutGrid,
    color: "bg-primary/10 hover:bg-primary/20 border-primary/20",
    activeColor: "bg-primary border-primary shadow-lg ring-2 ring-primary/20",
    iconColor: "text-primary", badgeVariant: "default" as const,
  },
  anomaly: {
    label: "Anomalías", icon: AlertCircle,
    color: "bg-destructive/10 hover:bg-destructive/20 border-destructive/20",
    activeColor: "bg-destructive border-destructive shadow-lg ring-2 ring-destructive/20",
    iconColor: "text-destructive", badgeVariant: "destructive" as const,
  },
  request: {
    label: "Solicitudes", icon: ClipboardList,
    color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    activeColor: "bg-blue-500 border-blue-500 shadow-lg ring-2 ring-blue-500/20",
    iconColor: "text-blue-500", badgeVariant: "secondary" as const,
  },
  correction: {
    label: "Correcciones", icon: Edit3,
    color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
    activeColor: "bg-amber-500 border-amber-500 shadow-lg ring-2 ring-amber-500/20",
    iconColor: "text-amber-500", badgeVariant: "secondary" as const,
  },
};

export const InteractiveFilterCards = ({ counts, selectedTypes, onToggleType }: InteractiveFilterCardsProps) => {
  const isAllSelected = selectedTypes.length === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {(["all", "anomaly", "request", "correction"] as const).map((type) => {
        const config = TYPE_CONFIG[type];
        const isActive = type === "all" ? isAllSelected : selectedTypes.includes(type as PendingType);
        const count = type === "all" ? counts.total : counts[type as PendingType];
        const Icon = config.icon;

        return (
          <Card
            key={type}
            className={`cursor-pointer transition-all duration-200 ${isActive ? config.activeColor : config.color}`}
            onClick={() => onToggleType(type === "all" ? null : type as PendingType)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={isActive ? "text-white" : config.iconColor}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? "text-white" : "text-foreground"}`}>{config.label}</p>
                    <p className={`text-2xl font-bold ${isActive ? "text-white" : "text-foreground"}`}>{count}</p>
                  </div>
                </div>
                {isActive && (
                  <Badge variant={config.badgeVariant} className={type === "all" ? "bg-primary-foreground text-primary" : "bg-white text-foreground"}>
                    Activo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
