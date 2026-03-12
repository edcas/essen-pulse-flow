export type AttendanceStatus = 
  | "present" 
  | "absent" 
  | "late" 
  | "pending" 
  | "vacation" 
  | "sick_leave";

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerRFC: string;
  workerAvatar: string;
  department: string;
  costCenter: string;
  position: string;
  date: string;
  status: AttendanceStatus;
  assignedLocation: string;
  actualLocation: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  vacation: number;
  sickLeave: number;
  pending: number;
}
