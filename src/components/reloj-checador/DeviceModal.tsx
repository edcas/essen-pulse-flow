import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Device } from "@/types/device";

const deviceSchema = (existingSerialNumbers: string[]) =>
  z.object({
    name: z.string().min(1, "El nombre es requerido"),
    serialNumber: z.string().min(1, "El número de serie es requerido").refine(val => !existingSerialNumbers.includes(val), "Este número de serie ya está registrado"),
    model: z.string().optional(),
  });

interface DeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (device: Omit<Device, "id" | "status">) => void;
  device?: Device;
  existingSerialNumbers: string[];
}

export const DeviceModal = ({ open, onOpenChange, onSubmit, device, existingSerialNumbers }: DeviceModalProps) => {
  const form = useForm({ resolver: zodResolver(deviceSchema(existingSerialNumbers)), defaultValues: { name: "", serialNumber: "", model: "" } });

  useEffect(() => {
    if (device) { form.reset({ name: device.name, serialNumber: device.serialNumber, model: device.model || "" }); }
    else { form.reset({ name: "", serialNumber: "", model: "" }); }
  }, [device, form]);

  const handleSubmit = (values: z.infer<ReturnType<typeof deviceSchema>>) => {
    onSubmit({ name: values.name, serialNumber: values.serialNumber, model: values.model, assignedLocation: device?.assignedLocation });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{device ? "Editar Dispositivo" : "Agregar Nuevo Dispositivo"}</DialogTitle>
          <DialogDescription>{device ? "Modifica la información del dispositivo" : "Registra un nuevo reloj checador en el inventario"}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre del Dispositivo *</FormLabel><FormControl><Input placeholder="Ej: Reloj Comedor" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="serialNumber" render={({ field }) => (<FormItem><FormLabel>Número de Serie *</FormLabel><FormControl><Input placeholder="Ej: SN-123456" {...field} disabled={!!device} className={device ? "bg-muted" : ""} /></FormControl>{device && <p className="text-xs text-muted-foreground">El número de serie no puede modificarse</p>}<FormMessage /></FormItem>)} />
            <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Ej: ZKTeco MB460" {...field} /></FormControl><FormMessage /></FormItem>)} />
            {device?.assignedLocation && (<div className="rounded-lg border p-3 bg-muted/50"><p className="text-sm font-medium mb-1">Ubicación Asignada</p><p className="text-sm text-muted-foreground">{device.assignedLocation}</p></div>)}
            <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit">{device ? "Guardar Cambios" : "Agregar Dispositivo"}</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};