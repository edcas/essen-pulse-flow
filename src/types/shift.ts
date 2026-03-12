export type ShiftType = "simple" | "rotating";

export interface TimeEntry {
  start: string;
  end: string;
}

export interface SimpleSchedule {
  start: string;
  end: string;
  isRemote?: boolean;
}

export interface DaySchedule {
  active: boolean;
  entries: TimeEntry[];
  isRemote?: boolean;
  isRestDay?: boolean;
}

export interface MealBlock {
  start: string;
  end: string;
}

export interface CycleDaySchedule {
  day: number;
  start: string;
  end: string;
  isRemote?: boolean;
  isRestDay?: boolean;
  mealBlocks?: MealBlock[];
}

export interface ShiftSchedule {
  sunday?: DaySchedule;
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
}

export interface ShiftRules {
  requiresCheckIn: boolean;
  isOvernightShift: boolean;
  multipleCheckInsPerDay: boolean;
}

export interface FlexibilityPolicies {
  tardyToleranceMinutes: number;
  entryExitFlexibilityMinutes: number;
  intermediateToleranceMinutes: number;
  intermediateFlexibilityMinutes: number;
}

export interface ShiftTemplate {
  id: string;
  label: string;
  identifier?: string;
  color?: string;
  type: ShiftType;
  simpleSchedule?: SimpleSchedule;
  schedule?: ShiftSchedule;
  cycleSchedule?: CycleDaySchedule[];
  rules?: ShiftRules;
  policies?: FlexibilityPolicies;
}

export interface Worker {
  id: string;
  name: string;
  department: string;
  costCenter?: string;
  position?: string;
  office?: string;
  shiftId: string | null;
  shifts?: {
    monday?: string | null;
    tuesday?: string | null;
    wednesday?: string | null;
    thursday?: string | null;
    friday?: string | null;
    saturday?: string | null;
    sunday?: string | null;
  };
  remoteWork?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };
  avatar?: string;
}
