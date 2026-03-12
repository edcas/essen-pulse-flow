export type ClarificationStatus = "pending" | "approved" | "rejected" | "resolved";

export type PendingType = "anomaly" | "request" | "correction";

export type ClarificationOrigin = 
  | "entrada" 
  | "salida" 
  | "inicio_comida" 
  | "fin_comida"
  | "omision_entrada"
  | "omision_salida";

export type ClarificationSource = "worker" | "admin";

export type RequestType = 
  | "vacation" 
  | "sick_leave" 
  | "permission" 
  | "home_office";

export type AnomalyType = 
  | "absence" 
  | "late" 
  | "early_departure";

export interface ClarificationComment {
  id: string;
  author: string;
  authorRole: "worker" | "admin";
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface ClarificationHistory {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface Clarification {
  id: string;
  pendingType: PendingType;
  workerId: string;
  workerName: string;
  workerRFC: string;
  workerAvatar: string;
  department: string;
  costCenter: string;
  position: string;
  office: string;
  incidentDate: string;
  requestDate: string;
  origin: ClarificationOrigin;
  reason: string;
  status: ClarificationStatus;
  source: ClarificationSource;
  originalCheckIn?: string | null;
  originalCheckOut?: string | null;
  proposedCheckIn?: string | null;
  proposedCheckOut?: string | null;
  comments: ClarificationComment[];
  history: ClarificationHistory[];
  requestType?: RequestType;
  anomalyType?: AnomalyType;
  dateRange?: {
    start: string;
    end: string;
  };
  attachments?: string[];
}

export interface AutoApprovalConfig {
  enabled: boolean;
  daysBeforeAutoApproval: number;
}
