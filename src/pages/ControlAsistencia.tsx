import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceView } from "@/components/attendance/AttendanceView";
import { RegisterView } from "@/components/register/RegisterView";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function ControlAsistencia() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sistema de Control de Asistencia</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona turnos, registros y asistencias de tus trabajadores</p>
      </div>

      <Tabs defaultValue="asistencias" className="w-full">
        <TabsList>
          <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
          <TabsTrigger value="programar">Programar turnos</TabsTrigger>
        </TabsList>

        <TabsContent value="asistencias" className="m-0">
          <AttendanceView />
        </TabsContent>

        <TabsContent value="registros" className="m-0">
          <RegisterView />
        </TabsContent>

        <TabsContent value="programar" className="m-0">
          <div className="p-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Programador de Turnos</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  El programador visual de turnos con vista semanal/quincenal, asignación drag-and-drop y recurrencia estará disponible próximamente.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
