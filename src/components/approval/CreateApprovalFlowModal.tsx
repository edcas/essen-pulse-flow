import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Plus, X, Users } from "lucide-react";
import { ApprovalFlow, ApprovalLevel, Approver, mockApprovers, ApprovalFlowType, ApprovalLogic } from "@/types/approval-flow";
import { IncidenceConfig } from "@/types/incidence";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateApprovalFlowModalProps {
  open: boolean; onOpenChange: (open: boolean) => void; onSave: (flow: ApprovalFlow) => void;
  incidences: IncidenceConfig[]; existingFlow?: ApprovalFlow | null;
}

export const CreateApprovalFlowModal = ({ open, onOpenChange, onSave, incidences, existingFlow }: CreateApprovalFlowModalProps) => {
  const [name, setName] = useState("");
  const [incidenceId, setIncidenceId] = useState("");
  const [type, setType] = useState<ApprovalFlowType>("solicitud");
  const [levels, setLevels] = useState<ApprovalLevel[]>([{ id: "level-1", levelNumber: 1, approvers: [], logic: "uno" }]);

  useEffect(() => {
    if (existingFlow) { setName(existingFlow.name); setIncidenceId(existingFlow.incidenceId); setType(existingFlow.type); setLevels(existingFlow.levels); }
    else { setName(""); setIncidenceId(""); setType("solicitud"); setLevels([{ id: "level-1", levelNumber: 1, approvers: [], logic: "uno" }]); }
  }, [existingFlow, open]);

  const addLevel = () => setLevels([...levels, { id: `level-${levels.length + 1}`, levelNumber: levels.length + 1, approvers: [], logic: "uno" }]);
  const removeLevel = (levelId: string) => { if (levels.length > 1) setLevels(levels.filter(l => l.id !== levelId).map((l, idx) => ({ ...l, levelNumber: idx + 1, id: `level-${idx + 1}` }))); };

  const toggleApprover = (levelId: string, approver: Approver) => {
    setLevels(levels.map(level => {
      if (level.id === levelId) { const exists = level.approvers.some(a => a.id === approver.id); return { ...level, approvers: exists ? level.approvers.filter(a => a.id !== approver.id) : [...level.approvers, approver] }; }
      return level;
    }));
  };

  const updateLevelLogic = (levelId: string, logic: ApprovalLogic) => setLevels(levels.map(l => l.id === levelId ? { ...l, logic } : l));
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = () => {
    const incidence = incidences.find(i => i.id === incidenceId);
    if (!incidence) return;
    onSave({ id: existingFlow?.id || `flow-${Date.now()}`, name, incidenceId, incidenceName: incidence.nombre, type, levels, active: true, createdAt: existingFlow?.createdAt || new Date(), updatedAt: new Date() });
    onOpenChange(false);
  };

  const isValid = name && incidenceId && levels.every(l => l.approvers.length > 0);
  const colors = [
    { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-700" },
    { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-700" },
    { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-700" },
    { bg: "bg-green-100", border: "border-green-500", text: "text-green-700" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader><DialogTitle>{existingFlow ? "Editar" : "Nuevo"} Flujo de Aprobación</DialogTitle><DialogDescription>Define la cadena de aprobación para una incidencia específica</DialogDescription></DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre del flujo</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Aprobación de Vacaciones" /></div>
              <div className="space-y-2"><Label>Incidencia</Label><Select value={incidenceId} onValueChange={setIncidenceId}><SelectTrigger><SelectValue placeholder="Selecciona una incidencia" /></SelectTrigger><SelectContent>{incidences.map((inc) => <SelectItem key={inc.id} value={inc.id}>{inc.nombre} ({inc.abreviatura})</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Tipo de flujo</Label>
                <RadioGroup value={type} onValueChange={(v) => setType(v as ApprovalFlowType)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="solicitud" id="type-solicitud" /><Label htmlFor="type-solicitud" className="font-normal cursor-pointer">Solicitud</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="incidencia" id="type-incidencia" /><Label htmlFor="type-incidencia" className="font-normal cursor-pointer">Incidencia</Label></div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><Label className="text-base font-semibold">Niveles de Aprobación</Label><Button type="button" variant="outline" size="sm" onClick={addLevel} className="gap-2"><Plus className="h-4 w-4" />Agregar Nivel</Button></div>
              {levels.map((level, index) => {
                const c = colors[index % colors.length];
                return (
                  <div key={level.id} className="relative">
                    {index < levels.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />}
                    <div className="flex gap-4 pb-6">
                      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 ${c.border} ${c.bg} flex items-center justify-center`}><span className={`text-sm font-semibold ${c.text}`}>{level.levelNumber}</span></div>
                      <Card className="flex-1 p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div><Badge variant="outline" className={`text-xs ${c.text}`}>Nivel {level.levelNumber}</Badge><p className="text-xs text-muted-foreground mt-1">{level.logic === "uno" ? "Cualquiera puede aprobar" : "Todos deben aprobar"}</p></div>
                            {levels.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeLevel(level.id)}><X className="h-4 w-4" /></Button>}
                          </div>
                          {level.approvers.length > 1 && (
                            <RadioGroup value={level.logic} onValueChange={(v: ApprovalLogic) => updateLevelLogic(level.id, v)} className="flex gap-4">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="uno" id={`uno-${level.id}`} /><Label htmlFor={`uno-${level.id}`} className="text-xs font-normal">Cualquiera</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="todos" id={`todos-${level.id}`} /><Label htmlFor={`todos-${level.id}`} className="text-xs font-normal">Todos</Label></div>
                            </RadioGroup>
                          )}
                          <Popover>
                            <PopoverTrigger asChild><Button type="button" variant="outline" size="sm" className="w-full justify-start text-xs"><Users className="mr-2 h-3 w-3" />{level.approvers.length > 0 ? `${level.approvers.length} seleccionado${level.approvers.length > 1 ? 's' : ''}` : 'Seleccionar aprobadores'}</Button></PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="start">
                              <Command><CommandInput placeholder="Buscar persona..." /><CommandList><CommandEmpty>No se encontró.</CommandEmpty><CommandGroup>
                                {mockApprovers.map((approver) => (
                                  <CommandItem key={approver.id} onSelect={() => toggleApprover(level.id, approver)}>
                                    <Checkbox checked={level.approvers.some(a => a.id === approver.id)} className="mr-2" />
                                    <Avatar className="h-6 w-6 mr-2"><AvatarFallback className="text-xs">{getInitials(approver.name)}</AvatarFallback></Avatar>
                                    <div><span className="text-sm">{approver.name}</span>{approver.role && <span className="text-xs text-muted-foreground block">{approver.role}</span>}</div>
                                  </CommandItem>
                                ))}
                              </CommandGroup></CommandList></Command>
                            </PopoverContent>
                          </Popover>
                          {level.approvers.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {level.approvers.map((approver) => (
                                <div key={approver.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                  <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{getInitials(approver.name)}</AvatarFallback></Avatar>
                                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{approver.name}</p>{approver.role && <p className="text-xs text-muted-foreground truncate">{approver.role}</p>}</div>
                                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleApprover(level.id, approver)}><X className="h-3 w-3" /></Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={handleSave} disabled={!isValid}>{existingFlow ? "Actualizar" : "Crear"} Flujo</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};