export interface Holiday {
  id: string;
  date: Date;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultHolidays: Holiday[] = [
  { id: "holiday-1", date: new Date(2026, 0, 1), name: "Año Nuevo", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-2", date: new Date(2026, 1, 2), name: "Día de la Constitución", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-3", date: new Date(2026, 2, 16), name: "Natalicio de Benito Juárez", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-4", date: new Date(2026, 4, 1), name: "Día del Trabajo", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-5", date: new Date(2026, 8, 16), name: "Día de la Independencia", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-6", date: new Date(2026, 10, 16), name: "Día de la Revolución Mexicana", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
  { id: "holiday-7", date: new Date(2026, 11, 25), name: "Navidad", description: "Día festivo oficial", createdAt: new Date(), updatedAt: new Date() },
];

export const isHoliday = (date: Date, holidays: Holiday[]): boolean => {
  return holidays.some(holiday =>
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  );
};

export const formatHolidayDate = (date: Date): string => {
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
};