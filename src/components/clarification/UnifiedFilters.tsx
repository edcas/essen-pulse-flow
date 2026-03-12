import { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clarification, PendingType } from "@/types/clarification";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InteractiveFilterCards } from "./InteractiveFilterCards";

interface UnifiedFiltersProps {
  clarifications: Clarification[];
  onFilterChange: (filters: {
    pendingTypes: PendingType[];
    departments: string[];
    offices: string[];
    dateRange: { start: string | null; end: string | null };
    searchTerm: string;
  }) => void;
}

const PENDING_TYPE_LABELS: Record<PendingType, string> = {
  anomaly: "Anomalía", request: "Solicitud", correction: "Corrección",
};

export const UnifiedFilters = ({ clarifications, onFilterChange }: UnifiedFiltersProps) => {
  const [selectedTypes, setSelectedTypes] = useState<PendingType[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({ start: undefined, end: undefined });
  const [searchTerm, setSearchTerm] = useState("");

  const departments = Array.from(new Set(clarifications.map(c => c.department))).sort();
  const offices = Array.from(new Set(clarifications.map(c => c.office))).sort();

  const counts = useMemo(() => ({
    total: clarifications.filter(c => c.status === "pending").length,
    anomaly: clarifications.filter(c => c.status === "pending" && c.pendingType === "anomaly").length,
    request: clarifications.filter(c => c.status === "pending" && c.pendingType === "request").length,
    correction: clarifications.filter(c => c.status === "pending" && c.pendingType === "correction").length,
  }), [clarifications]);

  useEffect(() => {
    onFilterChange({
      pendingTypes: selectedTypes, departments: selectedDepartments, offices: selectedOffices,
      dateRange: {
        start: dateRange.start ? format(dateRange.start, "yyyy-MM-dd") : null,
        end: dateRange.end ? format(dateRange.end, "yyyy-MM-dd") : null,
      },
      searchTerm,
    });
  }, [selectedTypes, selectedDepartments, selectedOffices, dateRange, searchTerm]);

  const handleToggleType = (type: PendingType | null) => {
    if (type === null) { setSelectedTypes([]); }
    else { setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]); }
  };

  const clearFilters = () => {
    setSelectedTypes([]); setSelectedDepartments([]); setSelectedOffices([]);
    setDateRange({ start: undefined, end: undefined }); setSearchTerm("");
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedDepartments.length > 0 || selectedOffices.length > 0 || dateRange.start || dateRange.end || searchTerm;

  return (
    <div className="space-y-6">
      <InteractiveFilterCards counts={counts} selectedTypes={selectedTypes} onToggleType={handleToggleType} />
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por empleado, RFC o detalle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <Select value={selectedDepartments[0] || "all"} onValueChange={(value) => setSelectedDepartments(value === "all" ? [] : [value])}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Departamento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={selectedOffices[0] || "all"} onValueChange={(value) => setSelectedOffices(value === "all" ? [] : [value])}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Ubicación" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ubicaciones</SelectItem>
            {offices.map((office) => (<SelectItem key={office} value={office}>{office}</SelectItem>))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {dateRange.start || dateRange.end ? (
                <span>{dateRange.start ? format(dateRange.start, "dd/MM", { locale: es }) : "..."} - {dateRange.end ? format(dateRange.end, "dd/MM", { locale: es }) : "..."}</span>
              ) : ("Rango de fechas")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium">Fecha inicio</p>
              <Calendar mode="single" selected={dateRange.start} onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))} locale={es} />
              <p className="text-sm font-medium mt-4">Fecha fin</p>
              <Calendar mode="single" selected={dateRange.end} onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))} locale={es} />
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setDateRange({ start: undefined, end: undefined })}>Limpiar fechas</Button>
            </div>
          </PopoverContent>
        </Popover>
        {hasActiveFilters && (<Button variant="ghost" size="sm" onClick={clearFilters}>Limpiar filtros</Button>)}
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">{PENDING_TYPE_LABELS[type]}<button onClick={() => handleToggleType(type)} className="ml-1 hover:bg-muted rounded-full">×</button></Badge>
          ))}
          {selectedDepartments.map((dept) => (
            <Badge key={dept} variant="secondary" className="gap-1">{dept}<button onClick={() => setSelectedDepartments([])} className="ml-1 hover:bg-muted rounded-full">×</button></Badge>
          ))}
        </div>
      )}
    </div>
  );
};
