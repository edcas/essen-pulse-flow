export interface CheckInTime {
  type: "entry" | "lunch_start" | "lunch_end" | "exit";
  time: string | null;
  label: string;
}

export interface CheckInRecord {
  id: string;
  date: string;
  workerId: string;
  workerName: string;
  workerRFC: string;
  department: string;
  costCenter: string;
  position: string;
  device: "web" | "mobile" | "physical";
  assignedOffice: string;
  registeredOffice: string;
  checkInTimes: CheckInTime[];
}
