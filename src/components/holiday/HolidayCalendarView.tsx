import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, HelpCircle } from "lucide-react";
import { Holiday } from "@/types/holiday";
import { cn } from "@/lib/utils";
import { HolidayConfigModal } from "./HolidayConfigModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HolidayCalendarViewProps {
  holidays: Holiday[];
  onAddHoliday: (date: Date, name: string, description: string) => void;
  onUpdateHoliday: (date: Date, name: string, description: string) => void;
  onDeleteHoliday: (date: Date) => void;
}

export const HolidayCalendarView = ({ holidays, onAddHoliday, onUpdateHoliday, onDeleteHoliday }: HolidayCalendarViewProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  const getHolidayForDate = (date: Date): Holiday | undefined => holidays.find(h => h.date.getDate() === date.getDate() && h.date.getMonth() === date.getMonth() && h.date.getFullYear() === date.getFullYear());

  const handleDayClick = (date: Date) => { setSelectedDate(date); setIsModalOpen(true); };
  const handleSaveHoliday = (date: Date, name: string, description: string) => { getHolidayForDate(date) ? onUpdateHoliday(date, name, description) : onAddHoliday(date, name, description); };

  const renderMonth = (monthIndex: number) => {
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <Card key={monthIndex} className="p-4">
        <div className="space-y-3">
          <div className="text-center"><h3 className="font-semibold text-sm">{months[monthIndex]}</h3></div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-medium">{weekDays.map((day, idx) => <div key={idx} className="h-6 flex items-center justify-center">{day}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="h-8" />;
              const date = new Date(currentYear, monthIndex, day);
              const holidayData = getHolidayForDate(date);
              const isHolidayDay = !!holidayData;
              const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

              const dayButton = (
                <button key={idx} onClick={() => handleDayClick(date)} className={cn("h-8 w-full rounded-md text-xs font-medium transition-all hover:scale-110 hover:shadow-md", isHolidayDay && "bg-primary text-primary-foreground hover:bg-primary/90", !isHolidayDay && "hover:bg-muted", isToday && !isHolidayDay && "border-2 border-primary", isToday && isHolidayDay && "ring-2 ring-primary-foreground")}>{day}</button>
              );

              if (isHolidayDay && holidayData?.name) {
                return <TooltipProvider key={idx}><Tooltip delayDuration={300}><TooltipTrigger asChild>{dayButton}</TooltipTrigger><TooltipContent><p className="font-semibold">{holidayData.name}</p></TooltipContent></Tooltip></TooltipProvider>;
              }
              return dayButton;
            })}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Calendario de Días Festivos {currentYear}</h2>
          <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><HelpCircle className="h-4 w-4 text-muted-foreground" /></Button></PopoverTrigger>
            <PopoverContent className="w-80" align="start"><p className="text-sm font-semibold mb-2">Instrucciones:</p><ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside"><li>Haz clic en cualquier día para configurar</li><li>Los días festivos se muestran en color primario</li></ul></PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentYear(currentYear - 1)}><ChevronLeft className="h-4 w-4" />{currentYear - 1}</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentYear(new Date().getFullYear())}>Hoy</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentYear(currentYear + 1)}>{currentYear + 1}<ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">15</div><span className="text-muted-foreground">Día festivo</span></div>
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-md border-2 border-primary flex items-center justify-center text-xs font-medium">15</div><span className="text-muted-foreground">Día actual</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{months.map((_, index) => renderMonth(index))}</div>
      <HolidayConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} existingHoliday={selectedDate ? getHolidayForDate(selectedDate) : undefined} onSave={handleSaveHoliday} onDelete={onDeleteHoliday} />
    </div>
  );
};