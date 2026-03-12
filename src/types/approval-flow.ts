export type ApprovalFlowType = "solicitud" | "incidencia";
export type ApprovalLogic = "uno" | "todos";

export interface Approver {
  id: string;
  name: string;
  role?: string;
}

export interface ApprovalLevel {
  id: string;
  levelNumber: number;
  approvers: Approver[];
  logic: ApprovalLogic;
}

export interface ApprovalFlow {
  id: string;
  name: string;
  incidenceId: string;
  incidenceName: string;
  type: ApprovalFlowType;
  levels: ApprovalLevel[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mockApprovers: Approver[] = [
  { id: "1", name: "Juan Pérez", role: "Jefe de Área" },
  { id: "2", name: "María García", role: "Recursos Humanos" },
  { id: "3", name: "Carlos López", role: "Director" },
  { id: "4", name: "Ana Martínez", role: "Finanzas" },
  { id: "5", name: "Roberto Silva", role: "Recursos Humanos" },
  { id: "6", name: "Laura Hernández", role: "Jefe de Área" },
];

export const defaultApprovalFlows: ApprovalFlow[] = [
  {
    id: "flow-vacaciones", name: "Aprobación de Vacaciones",
    incidenceId: "vacaciones", incidenceName: "Vacaciones", type: "solicitud",
    levels: [{ id: "level-1", levelNumber: 1, approvers: [mockApprovers[0]], logic: "uno" }],
    active: true, createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "flow-horas-extra", name: "Aprobación de Horas Extra",
    incidenceId: "horas_extra", incidenceName: "Horas Extra", type: "solicitud",
    levels: [
      { id: "level-1", levelNumber: 1, approvers: [mockApprovers[0]], logic: "uno" },
      { id: "level-2", levelNumber: 2, approvers: [mockApprovers[1], mockApprovers[4]], logic: "uno" }
    ],
    active: true, createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "flow-bono", name: "Aprobación de Bonos",
    incidenceId: "bono", incidenceName: "Bono", type: "incidencia",
    levels: [
      { id: "level-1", levelNumber: 1, approvers: [mockApprovers[2]], logic: "uno" },
      { id: "level-2", levelNumber: 2, approvers: [mockApprovers[3]], logic: "uno" }
    ],
    active: true, createdAt: new Date(), updatedAt: new Date()
  }
];