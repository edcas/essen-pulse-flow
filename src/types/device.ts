export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  model?: string;
  assignedLocation?: string;
  status: 'online' | 'offline' | 'unverified';
  lastChecked?: Date;
}