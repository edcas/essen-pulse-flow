export type IncidenceCategory = "ausentismo" | "horas_extra" | "monetarias";

export type SolicitudTiempo = "pasado" | "futuro" | "ambas";
export type SolicitudFecha = "una_fecha" | "rango_fechas";
export type MostrarEnMetricas = "no_medir" | "negativa" | "positiva";

export interface IncidenceConfig {
  id: string;
  nombre: string;
  abreviatura: string;
  categoria: IncidenceCategory;
  activo: boolean;
  visibleAutoservicio: boolean;
  quienPuedeSolicitar: "todos" | "jefes" | "grupo_especifico";
  solicitablePorColaborador: boolean;
  solicitudTiempo: SolicitudTiempo;
  solicitudFecha: SolicitudFecha;
  requiereMonto: boolean;
  requiereCantidad: boolean;
  requiereTiempo: boolean;
  requiereIdentificador: boolean;
  puedeSubirArchivo: boolean;
  archivoObligatorio: boolean;
  textoAyuda?: string;
  justificaDias: boolean;
  justificaChecadas: boolean;
  quitaFaltaSumaTiempo: boolean;
  mostrarEnMetricas: MostrarEnMetricas;
  notificarA: string[];
  gestionPersonalizada?: string;
  camposPersonalizados: Array<{
    nombre: string;
    tipo: string;
    requerido: boolean;
  }>;
}

export const defaultIncidences: IncidenceConfig[] = [
  {
    id: "vacaciones", nombre: "Vacaciones", abreviatura: "VAC", categoria: "ausentismo", activo: true,
    visibleAutoservicio: true, quienPuedeSolicitar: "todos", solicitablePorColaborador: true,
    solicitudTiempo: "futuro", solicitudFecha: "rango_fechas",
    requiereMonto: false, requiereCantidad: true, requiereTiempo: false, requiereIdentificador: false,
    puedeSubirArchivo: false, archivoObligatorio: false,
    justificaDias: true, justificaChecadas: false, quitaFaltaSumaTiempo: true,
    mostrarEnMetricas: "positiva", notificarA: [], camposPersonalizados: []
  },
  {
    id: "falta", nombre: "Falta", abreviatura: "FLT", categoria: "ausentismo", activo: true,
    visibleAutoservicio: false, quienPuedeSolicitar: "jefes", solicitablePorColaborador: false,
    solicitudTiempo: "ambas", solicitudFecha: "una_fecha",
    requiereMonto: false, requiereCantidad: false, requiereTiempo: false, requiereIdentificador: false,
    puedeSubirArchivo: true, archivoObligatorio: false,
    justificaDias: false, justificaChecadas: false, quitaFaltaSumaTiempo: false,
    mostrarEnMetricas: "negativa", notificarA: [], camposPersonalizados: []
  },
  {
    id: "permiso", nombre: "Permiso", abreviatura: "PRM", categoria: "ausentismo", activo: true,
    visibleAutoservicio: true, quienPuedeSolicitar: "todos", solicitablePorColaborador: true,
    solicitudTiempo: "ambas", solicitudFecha: "una_fecha",
    requiereMonto: false, requiereCantidad: false, requiereTiempo: true, requiereIdentificador: false,
    puedeSubirArchivo: true, archivoObligatorio: false,
    justificaDias: false, justificaChecadas: true, quitaFaltaSumaTiempo: true,
    mostrarEnMetricas: "positiva", notificarA: [], camposPersonalizados: []
  },
  {
    id: "horas_extra", nombre: "Horas Extra", abreviatura: "HE", categoria: "horas_extra", activo: true,
    visibleAutoservicio: true, quienPuedeSolicitar: "todos", solicitablePorColaborador: true,
    solicitudTiempo: "pasado", solicitudFecha: "una_fecha",
    requiereMonto: false, requiereCantidad: false, requiereTiempo: true, requiereIdentificador: false,
    puedeSubirArchivo: false, archivoObligatorio: false,
    justificaDias: false, justificaChecadas: false, quitaFaltaSumaTiempo: false,
    mostrarEnMetricas: "positiva", notificarA: [], camposPersonalizados: []
  },
  {
    id: "bono", nombre: "Bono", abreviatura: "BNO", categoria: "monetarias", activo: true,
    visibleAutoservicio: false, quienPuedeSolicitar: "jefes", solicitablePorColaborador: false,
    solicitudTiempo: "ambas", solicitudFecha: "una_fecha",
    requiereMonto: true, requiereCantidad: false, requiereTiempo: false, requiereIdentificador: false,
    puedeSubirArchivo: true, archivoObligatorio: false,
    justificaDias: false, justificaChecadas: false, quitaFaltaSumaTiempo: false,
    mostrarEnMetricas: "no_medir", notificarA: [], camposPersonalizados: []
  }
];