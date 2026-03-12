import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IncidenceConfig, SolicitudTiempo, SolicitudFecha, MostrarEnMetricas } from "@/types/incidence";
import { Separator } from "@/components/ui/separator";

interface IncidenceConfigModalProps {
  incidence: IncidenceConfig | null;
  open: boolean;
  onClose: () => void;
  onSave: (incidence: IncidenceConfig) => void;
}

export const IncidenceConfigModal = ({ incidence, open, onClose, onSave }: IncidenceConfigModalProps) => {
  const [formData, setFormData] = useState<IncidenceConfig>(() => {
    if (incidence) return incidence;
    return {
      id: `incidence_${Date.now()}`, nombre: "", abreviatura: "", categoria: "ausentismo", activo: true,
      visibleAutoservicio: true, quienPuedeSolicitar: "todos", solicitablePorColaborador: true,
      solicitudTiempo: "futuro", solicitudFecha: "rango_fechas",
      requiereMonto: false, requiereCantidad: false, requiereTiempo: false, requiereIdentificador: false,
      puedeSubirArchivo: false, archivoObligatorio: false,
      justificaDias: false, justificaChecadas: false, quitaFaltaSumaTiempo: false,
      mostrarEnMetricas: "no_medir", notificarA: [], camposPersonalizados: []
    };
  });

  const handleSave = () => { if (!formData.nombre.trim()) return; onSave(formData); };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{incidence ? `Configurar: ${incidence.nombre}` : "Nueva Incidencia"}</DialogTitle></DialogHeader>
        <div className="space-y-6 py-2">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Información Básica</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej. Vacaciones" /></div>
              <div className="space-y-2"><Label>Abreviatura</Label><Input value={formData.abreviatura} onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })} placeholder="Ej. VAC" maxLength={5} /></div>
              <div className="space-y-2"><Label>Categoría</Label><Select value={formData.categoria} onValueChange={(v: any) => setFormData({ ...formData, categoria: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ausentismo">Ausentismo</SelectItem><SelectItem value="horas_extra">Horas Extra</SelectItem><SelectItem value="monetarias">Monetarias</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reglas de Solicitud</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><div><Label>Visible en autoservicio</Label><p className="text-xs text-muted-foreground">Será visible para quien pueda solicitarla</p></div><Switch checked={formData.visibleAutoservicio} onCheckedChange={(checked) => setFormData({ ...formData, visibleAutoservicio: checked })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tiempo de solicitud</Label><Select value={formData.solicitudTiempo} onValueChange={(v: SolicitudTiempo) => setFormData({ ...formData, solicitudTiempo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pasado">Solo pasadas</SelectItem><SelectItem value="futuro">Solo futuras</SelectItem><SelectItem value="ambas">Ambas</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Tipo de fecha</Label><Select value={formData.solicitudFecha} onValueChange={(v: SolicitudFecha) => setFormData({ ...formData, solicitudFecha: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="una_fecha">Una fecha</SelectItem><SelectItem value="rango_fechas">Rango</SelectItem></SelectContent></Select></div>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Campos del Formulario</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "Requiere Monto ($)", key: "requiereMonto" as const },
                { label: "Requiere Cantidad", key: "requiereCantidad" as const },
                { label: "Requiere Tiempo", key: "requiereTiempo" as const },
                { label: "Se puede subir archivo", key: "puedeSubirArchivo" as const },
              ].map(f => (
                <div key={f.key} className="flex items-center justify-between"><Label>{f.label}</Label><Switch checked={formData[f.key]} onCheckedChange={(checked) => setFormData({ ...formData, [f.key]: checked })} /></div>
              ))}
            </div>
            <div className="space-y-2 mt-3"><Label>Texto de ayuda</Label><Textarea value={formData.textoAyuda || ""} onChange={(e) => setFormData({ ...formData, textoAyuda: e.target.value })} placeholder="Ej. Adjuntar PDF" rows={2} /></div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Impacto</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center justify-between"><div><Label>Justifica Días</Label><p className="text-xs text-muted-foreground">Ej. Vacaciones justifican ausencias</p></div><Switch checked={formData.justificaDias} onCheckedChange={(checked) => setFormData({ ...formData, justificaDias: checked })} /></div>
              <div className="flex items-center justify-between"><div><Label>Justifica Checadas</Label><p className="text-xs text-muted-foreground">Ej. Permiso justifica checada tardía</p></div><Switch checked={formData.justificaChecadas} onCheckedChange={(checked) => setFormData({ ...formData, justificaChecadas: checked })} /></div>
            </div>
            <div className="flex items-center justify-between mt-3"><div><Label>¿Quita falta y suma tiempo trabajado?</Label></div><Switch checked={formData.quitaFaltaSumaTiempo} onCheckedChange={(checked) => setFormData({ ...formData, quitaFaltaSumaTiempo: checked })} /></div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="space-y-2"><Label>Mostrar en métricas</Label><Select value={formData.mostrarEnMetricas} onValueChange={(v: MostrarEnMetricas) => setFormData({ ...formData, mostrarEnMetricas: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="no_medir">No medir</SelectItem><SelectItem value="negativa">Negativa</SelectItem><SelectItem value="positiva">Positiva</SelectItem></SelectContent></Select></div>
            </div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={handleSave}>Guardar Configuración</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};