import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, XCircle, Clock, Calendar, Umbrella, Heart } from "lucide-react";
import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceFilterCardsProps {
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    pending: number;
    vacation: number;
    sickLeave: number;
  };
  selectedStatus: AttendanceStatus | "all";
  onStatusChange: (status: AttendanceStatus | "all") => void;
}

type StatusType = AttendanceStatus | "all";

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  activeColor: string;
  activeBg: string;
  activeIconBg: string;
  inactiveColor: string;
  inactiveBg: string;
  inactiveIconBg: string;
  badgeBg: string;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  all: {
    label: "Todos",
    icon: Users,
    activeColor: "text-primary-foreground",
    activeBg: "bg-primary border-primary",
    activeIconBg: "bg-primary-foreground/20",
    inactiveColor: "text-muted-foreground",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-muted",
    badgeBg: "bg-primary-foreground/20 text-primary-foreground",
  },
  present: {
    label: "Asistencias",
    icon: CheckCircle,
    activeColor: "text-white",
    activeBg: "bg-green-500 border-green-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-green-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-green-50",
    badgeBg: "bg-white/20 text-white",
  },
  absent: {
    label: "Faltas",
    icon: XCircle,
    activeColor: "text-white",
    activeBg: "bg-red-500 border-red-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-red-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-red-50",
    badgeBg: "bg-white/20 text-white",
  },
  late: {
    label: "Retardos",
    icon: Clock,
    activeColor: "text-white",
    activeBg: "bg-orange-500 border-orange-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-orange-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-orange-50",
    badgeBg: "bg-white/20 text-white",
  },
  pending: {
    label: "Por Registrar",
    icon: Calendar,
    activeColor: "text-white",
    activeBg: "bg-gray-500 border-gray-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-gray-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-gray-50",
    badgeBg: "bg-white/20 text-white",
  },
  vacation: {
    label: "Vacaciones",
    icon: Umbrella,
    activeColor: "text-white",
    activeBg: "bg-blue-500 border-blue-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-blue-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-blue-50",
    badgeBg: "bg-white/20 text-white",
  },
  sick_leave: {
    label: "Incapacidad",
    icon: Heart,
    activeColor: "text-white",
    activeBg: "bg-purple-500 border-purple-500",
    activeIconBg: "bg-white/20",
    inactiveColor: "text-purple-600",
    inactiveBg: "bg-card border-border hover:bg-accent/50",
    inactiveIconBg: "bg-purple-50",
    badgeBg: "bg-white/20 text-white",
  },
};

export const AttendanceFilterCards = ({
  stats,
  selectedStatus,
  onStatusChange,
}: AttendanceFilterCardsProps) => {
  const getCount = (type: StatusType): number => {
    switch (type) {
      case "all": return stats.total;
      case "present": return stats.present;
      case "absent": return stats.absent;
      case "late": return stats.late;
      case "pending": return stats.pending;
      case "vacation": return stats.vacation;
      case "sick_leave": return stats.sickLeave;
      default: return 0;
    }
  };

  const statusTypes: StatusType[] = ["all", "present", "absent", "late", "pending", "vacation", "sick_leave"];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
      {statusTypes.map((type) => {
        const config = STATUS_CONFIG[type];
        const count = getCount(type);
        const isSelected = selectedStatus === type;
        const Icon = config.icon;

        return (
          <Card
            key={type}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              isSelected ? config.activeBg : config.inactiveBg
            }`}
            onClick={() => onStatusChange(type)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${isSelected ? config.activeIconBg : config.inactiveIconBg}`}>
                  <Icon className={`h-4 w-4 ${isSelected ? config.activeColor : config.inactiveColor}`} />
                </div>
                {isSelected && (
                  <Badge variant="secondary" className={`text-xs ${config.badgeBg} border-0`}>
                    Activo
                  </Badge>
                )}
              </div>
              <div>
                <p className={`text-2xl font-bold ${isSelected ? config.activeColor : config.inactiveColor}`}>
                  {count}
                </p>
                <p className={`text-xs ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                  {config.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
