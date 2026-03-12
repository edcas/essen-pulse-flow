

## Plan: Integrar Reloj Checador e Incidencias en Detalle de Empresa

### Resumen
Copiar las pantallas de **Reloj Checador** e **Incidencias** del proyecto [Shift Master](/projects/c0dfc7e6-52a9-4843-82a2-66c8a9a34f12) e integrarlas como nuevas pestanas dentro del detalle de cada empresa (`EmpresaDetail.tsx`), adaptando los estilos al diseño corporativo ESSEN existente.

### Archivos a crear (desde Shift Master)

**Types:**
1. `src/types/device.ts` - Interface `Device`
2. `src/types/incidence.ts` - Tipos e incidencias por defecto
3. `src/types/check-methods.ts` - Interfaces `CheckMethod`, `Employee`, `Office`
4. `src/types/approval-flow.ts` - Tipos de flujos de aprobacion y defaults
5. `src/types/holiday.ts` - Interface `Holiday` y helpers

**Componentes Reloj Checador:**
6. `src/components/reloj-checador/CheckMethodsTable.tsx` - Tabla de metodos de checado por empleado
7. `src/components/reloj-checador/AssignMethodsPanel.tsx` - Panel lateral de asignacion
8. `src/components/reloj-checador/DeviceTable.tsx` - Inventario de dispositivos
9. `src/components/reloj-checador/DeviceModal.tsx` - Modal CRUD de dispositivos
10. `src/components/reloj-checador/OfficeLocationsTable.tsx` - Tabla de oficinas
11. `src/components/reloj-checador/OfficeLocationModal.tsx` - Modal de oficina con geocerca
12. `src/components/reloj-checador/GeofenceMap.tsx` - Mapa de geocerca (Mapbox)
13. `src/components/reloj-checador/QRCodesModal.tsx` - Modal de codigos QR

**Componentes Incidencias:**
14. `src/components/incidence/IncidenceLibrary.tsx` - Biblioteca de incidencias
15. `src/components/incidence/IncidenceConfigModal.tsx` - Modal de configuracion
16. `src/components/approval/ApprovalFlowLibrary.tsx` - Flujos de aprobacion
17. `src/components/approval/ApprovalFlowCard.tsx` - Card de flujo
18. `src/components/approval/CreateApprovalFlowModal.tsx` - Modal crear/editar flujo
19. `src/components/holiday/HolidayCalendarView.tsx` - Calendario anual de festivos
20. `src/components/holiday/HolidayConfigModal.tsx` - Modal de dia festivo

**Componente compartido:**
21. `src/components/shared/StandardFilters.tsx` - Filtros reutilizables

### Archivo a modificar

22. **`src/pages/EmpresaDetail.tsx`** - Agregar 2 nuevas pestanas:
   - `<TabsTrigger value="reloj-checador">Reloj Checador</TabsTrigger>`
   - `<TabsTrigger value="incidencias">Incidencias</TabsTrigger>`
   - Cada una renderiza los componentes correspondientes dentro de `<TabsContent>`, con la estructura de tabs interna (igual que en las paginas originales de Shift Master)

### Adaptaciones para ESSEN
- Eliminar el header/navegacion independiente de cada pagina (ya estaran dentro del layout de EmpresaDetail)
- Los componentes ya usan los mismos UI primitivos (shadcn/ui) asi que heredaran automaticamente los colores ESSEN definidos en `index.css`
- No se requiere instalar dependencias adicionales (todos los paquetes ya estan en el proyecto: radix, react-hook-form, zod, date-fns, cmdk)
- La unica dependencia externa es `mapbox-gl` para GeofenceMap, pero el componente ya maneja el caso sin token mostrando un input

### Nota sobre mapbox-gl
El componente `GeofenceMap` usa `mapbox-gl` que no esta instalado. Se reemplazara con un placeholder visual (cuadro con coordenadas editables) para evitar agregar una dependencia pesada, o se puede instalar `mapbox-gl` si se desea el mapa interactivo.

