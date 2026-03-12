export interface CheckMethod {
  app: boolean;
  qr: boolean;
  biometric: boolean;
  facial: boolean;
}

export interface Employee {
  id: string;
  name: string;
  area: string;
  department: string;
  position: string;
  costCenter: string;
  assignedOffice: string;
  checkMethods: CheckMethod;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
  allowMobileApp: boolean;
  allowHardware: boolean;
  assignedDevices: string[];
  isActive: boolean;
  qrCode?: string;
  hasDevices: boolean;
}