import { Search, CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  departments: string[];
  costCenters: string[];
  positions: string[];
  offices: string[];
}

export interface FilterValues {
  search: string;
  department: string;
  costCenter: string;
  position: string;
  office: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface StandardFiltersProps {
  options: FilterOptions;
  values: FilterValues;
  onValuesChange: (values: FilterValues) => void;
  showDateRange?: boolean;
  singleDate?: boolean;
}

export function StandardFilters({
  options, values, onValuesChange, showDateRange = false, singleDate = false,
}: StandardFiltersProps) {
  const updateValue = (key: keyof FilterValues, value: any) => {
    onValuesChange({ ...values, [key]: value });
  };

  const clearFilters = () => {
    onValuesChange({ search: "", department: "all", costCenter: "all", position: "all", office: "all", dateFrom: undefined, dateTo: undefined });
  };

  const hasActiveFilters = values.search || values.department !== "all" || values.costCenter !== "all" || values.position !== "all" || values.office !== "all" || values.dateFrom || values.dateTo;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[250px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o RFC..." value={values.search} onChange={(e) => updateValue("search", e.target.value)} className="pl-9" />
          </div>
        </div>

        {showDateRange && (
          <>
            {singleDate ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[180px]">
                    <CalendarIcon className="h-4 w-4" />
                    {values.dateFrom ? format(values.dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={values.dateFrom} onSelect={(date) => updateValue("dateFrom", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 min-w-[180px]">
                      <CalendarIcon className="h-4 w-4" />
                      {values.dateFrom ? format(values.dateFrom, "dd/MM/yyyy", { locale: es }) : "Fecha inicio"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={values.dateFrom} onSelect={(date) => updateValue("dateFrom", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 min-w-[180px]">
                      <CalendarIcon className="h-4 w-4" />
                      {values.dateTo ? format(values.dateTo, "dd/MM/yyyy", { locale: es }) : "Fecha fin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={values.dateTo} onSelect={(date) => updateValue("dateTo", date)} initialFocus disabled={(date) => values.dateFrom ? date < values.dateFrom : false} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </>
        )}

        <Select value={values.department} onValueChange={(value) => updateValue("department", value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Departamento" /></SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos</SelectItem>
            {options.departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={values.costCenter} onValueChange={(value) => updateValue("costCenter", value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Centro de Costos" /></SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos</SelectItem>
            {options.costCenters.map((cc) => (<SelectItem key={cc} value={cc}>{cc}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={values.position} onValueChange={(value) => updateValue("position", value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Puesto" /></SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos</SelectItem>
            {options.positions.map((pos) => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={values.office} onValueChange={(value) => updateValue("office", value)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Oficina" /></SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todas</SelectItem>
            {options.offices.map((office) => (<SelectItem key={office} value={office}>{office}</SelectItem>))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}