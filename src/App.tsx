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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
