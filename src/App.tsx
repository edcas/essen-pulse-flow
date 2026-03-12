import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Empresas from "./pages/Empresas";
import EmpresaDetail from "./pages/EmpresaDetail";
import Evaluaciones from "./pages/Evaluaciones";
import Avisos from "./pages/Avisos";
import Capacitacion from "./pages/Capacitacion";
import Sincronizacion from "./pages/Sincronizacion";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import ControlAsistencia from "./pages/ControlAsistencia";
import CentroAprobacion from "./pages/CentroAprobacion";
import Empleados from "./pages/Empleados";
import Organigrama from "./pages/Organigrama";
import ExpedienteDigital from "./pages/ExpedienteDigital";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/:empresaId" element={<EmpresaDetail />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
            <Route path="/avisos" element={<Avisos />} />
            <Route path="/capacitacion" element={<Capacitacion />} />
            <Route path="/sincronizacion" element={<Sincronizacion />} />
            <Route path="/reportes" element={<Reportes />} />
            {/* Ver como cliente */}
            <Route path="/cliente/asistencia" element={<ControlAsistencia />} />
            <Route path="/cliente/aprobacion" element={<CentroAprobacion />} />
            <Route path="/cliente/empleados" element={<Empleados />} />
            <Route path="/cliente/centros" element={<Empresas />} />
            <Route path="/cliente/organigrama" element={<Organigrama />} />
            <Route path="/cliente/expediente" element={<ExpedienteDigital />} />
            <Route path="/cliente/capacitacion" element={<Capacitacion />} />
            <Route path="/cliente/reloj-checador" element={<ControlAsistencia />} />
            <Route path="/cliente/incidencias" element={<CentroAprobacion />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
