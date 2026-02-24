// Shared mock data for ESSEN platform

export interface Empresa {
  id: string;
  name: string;
  logo: string;
  industry: string;
  employees: number;
  centros: number;
  plan: "Premium" | "Estándar" | "Básico";
  status: "activo" | "inactivo";
  activeEvals: number;
  expedienteProgress: number;
  capacitacionProgress: number;
  contactName: string;
  contactEmail: string;
  joinDate: string;
}

export interface Empleado {
  id: number;
  name: string;
  department: string;
  rfc: string;
  position: string;
  empresaId: string;
  centro: string;
  email: string;
}

export interface CentroTrabajo {
  id: number;
  name: string;
  address: string;
  city: string;
  employees: number;
  empresaId: string;
}

export const empresas: Empresa[] = [
  {
    id: "acme",
    name: "ACME Corp",
    logo: "AC",
    industry: "Manufactura",
    employees: 450,
    centros: 5,
    plan: "Premium",
    status: "activo",
    activeEvals: 3,
    expedienteProgress: 87,
    capacitacionProgress: 72,
    contactName: "Ing. Ricardo Soto",
    contactEmail: "rsoto@acme.com",
    joinDate: "2024-03-15",
  },
  {
    id: "techmex",
    name: "TechMex SA",
    logo: "TM",
    industry: "Tecnología",
    employees: 200,
    centros: 3,
    plan: "Premium",
    status: "activo",
    activeEvals: 2,
    expedienteProgress: 92,
    capacitacionProgress: 65,
    contactName: "Lic. Andrea Villanueva",
    contactEmail: "avillanueva@techmex.mx",
    joinDate: "2024-06-01",
  },
  {
    id: "logimex",
    name: "LogiMex",
    logo: "LM",
    industry: "Logística",
    employees: 320,
    centros: 8,
    plan: "Estándar",
    status: "activo",
    activeEvals: 1,
    expedienteProgress: 78,
    capacitacionProgress: 54,
    contactName: "Lic. Fernando Mendez",
    contactEmail: "fmendez@logimex.com",
    joinDate: "2024-09-10",
  },
  {
    id: "grupoalfa",
    name: "Grupo Alfa",
    logo: "GA",
    industry: "Retail",
    employees: 580,
    centros: 12,
    plan: "Premium",
    status: "activo",
    activeEvals: 4,
    expedienteProgress: 68,
    capacitacionProgress: 81,
    contactName: "C.P. Mariana Reyes",
    contactEmail: "mreyes@grupoalfa.mx",
    joinDate: "2025-01-20",
  },
  {
    id: "construmex",
    name: "ConstruMex",
    logo: "CM",
    industry: "Construcción",
    employees: 150,
    centros: 4,
    plan: "Básico",
    status: "activo",
    activeEvals: 1,
    expedienteProgress: 55,
    capacitacionProgress: 40,
    contactName: "Arq. Luis Paredes",
    contactEmail: "lparedes@construmex.com",
    joinDate: "2025-06-05",
  },
  {
    id: "farmavida",
    name: "FarmaVida",
    logo: "FV",
    industry: "Farmacéutica",
    employees: 95,
    centros: 2,
    plan: "Estándar",
    status: "inactivo",
    activeEvals: 0,
    expedienteProgress: 90,
    capacitacionProgress: 88,
    contactName: "Dra. Carmen Solís",
    contactEmail: "csolis@farmavida.mx",
    joinDate: "2024-11-12",
  },
];

export const empleados: Empleado[] = [
  { id: 1, name: "María García López", department: "Ventas", rfc: "GALM850312AB1", position: "Gerente de Ventas", empresaId: "acme", centro: "CDMX Norte", email: "mgarcia@acme.com" },
  { id: 2, name: "Juan Pérez Hernández", department: "RRHH", rfc: "PEHJ900115CD3", position: "Analista RRHH", empresaId: "acme", centro: "CDMX Centro", email: "jperez@acme.com" },
  { id: 3, name: "Ana Rodríguez Sánchez", department: "Operaciones", rfc: "ROSA880723EF5", position: "Coordinadora", empresaId: "acme", centro: "Monterrey", email: "arodriguez@acme.com" },
  { id: 4, name: "Carlos Martínez Ruiz", department: "Ventas", rfc: "MARC910430GH7", position: "Supervisor", empresaId: "acme", centro: "Guadalajara", email: "cmartinez@acme.com" },
  { id: 5, name: "Laura Torres Díaz", department: "Finanzas", rfc: "TODL870218IJ9", position: "Contadora Sr.", empresaId: "techmex", centro: "CDMX", email: "ltorres@techmex.mx" },
  { id: 6, name: "Roberto Flores Vega", department: "Dirección", rfc: "FOVR760505KL2", position: "Director General", empresaId: "techmex", centro: "CDMX", email: "rflores@techmex.mx" },
  { id: 7, name: "Patricia Mendoza Cruz", department: "Finanzas", rfc: "MECP930812MN4", position: "Auxiliar Contable", empresaId: "logimex", centro: "Querétaro", email: "pmendoza@logimex.com" },
  { id: 8, name: "Diego Ramírez Ortega", department: "Operaciones", rfc: "RAOD850929OP6", position: "Dir. Operaciones", empresaId: "logimex", centro: "CDMX", email: "dramirez@logimex.com" },
  { id: 9, name: "Sofía López Castillo", department: "Operaciones", rfc: "LOCS960117QR8", position: "Coord. Logística", empresaId: "grupoalfa", centro: "Puebla", email: "slopez@grupoalfa.mx" },
  { id: 10, name: "Fernando Guzmán Ríos", department: "IT", rfc: "GURF881204ST0", position: "Desarrollador Sr.", empresaId: "grupoalfa", centro: "CDMX", email: "fguzman@grupoalfa.mx" },
  { id: 11, name: "Gabriela Herrera Mora", department: "RRHH", rfc: "HEMG940610UV2", position: "Reclutadora", empresaId: "construmex", centro: "Mérida", email: "gherrera@construmex.com" },
  { id: 12, name: "Alejandro Vidal Peña", department: "Ventas", rfc: "VIPA790322WX4", position: "Ejecutivo Comercial", empresaId: "farmavida", centro: "CDMX", email: "avidal@farmavida.mx" },
];

export const centrosTrabajo: CentroTrabajo[] = [
  { id: 1, name: "Planta Norte", address: "Av. Industrial 456", city: "Monterrey, NL", employees: 120, empresaId: "acme" },
  { id: 2, name: "Oficinas Centrales", address: "Paseo de la Reforma 222", city: "CDMX", employees: 180, empresaId: "acme" },
  { id: 3, name: "Centro Distribución", address: "Carr. Panamericana Km 12", city: "Guadalajara, JAL", employees: 90, empresaId: "acme" },
  { id: 4, name: "Planta Sur", address: "Blvd. Juárez 890", city: "Puebla, PUE", employees: 40, empresaId: "acme" },
  { id: 5, name: "Laboratorio", address: "Calle Innovación 33", city: "Querétaro, QRO", employees: 20, empresaId: "acme" },
  { id: 6, name: "HQ TechMex", address: "Av. Santa Fe 100", city: "CDMX", employees: 130, empresaId: "techmex" },
  { id: 7, name: "Dev Center", address: "Parque Tec 45", city: "Guadalajara, JAL", employees: 50, empresaId: "techmex" },
  { id: 8, name: "Soporte Remoto", address: "Calle Digital 78", city: "Monterrey, NL", employees: 20, empresaId: "techmex" },
  { id: 9, name: "CEDIS Central", address: "Av. Logística 200", city: "CDMX", employees: 80, empresaId: "logimex" },
  { id: 10, name: "CEDIS Norte", address: "Carr. Nacional Km 5", city: "Monterrey, NL", employees: 65, empresaId: "logimex" },
  { id: 11, name: "Sucursal Reforma", address: "Av. Reforma 500", city: "CDMX", employees: 45, empresaId: "grupoalfa" },
  { id: 12, name: "Sucursal Polanco", address: "Av. Horacio 120", city: "CDMX", employees: 38, empresaId: "grupoalfa" },
  { id: 13, name: "Obra Poniente", address: "Blvd. Constitución 300", city: "Mérida, YUC", employees: 75, empresaId: "construmex" },
  { id: 14, name: "Farmacia Central", address: "Av. Insurgentes 890", city: "CDMX", employees: 60, empresaId: "farmavida" },
];

export function getEmpresa(id: string) {
  return empresas.find((e) => e.id === id);
}

export function getEmpleadosByEmpresa(empresaId: string) {
  return empleados.filter((e) => e.empresaId === empresaId);
}

export function getCentrosByEmpresa(empresaId: string) {
  return centrosTrabajo.filter((c) => c.empresaId === empresaId);
}
