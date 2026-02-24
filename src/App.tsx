import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import ExpedienteDigital from "./pages/ExpedienteDigital";
import Evaluaciones from "./pages/Evaluaciones";
import Organigrama from "./pages/Organigrama";
import Avisos from "./pages/Avisos";
import Capacitacion from "./pages/Capacitacion";
import Sincronizacion from "./pages/Sincronizacion";
import Empleados from "./pages/Empleados";
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
            <Route path="/expediente" element={<ExpedienteDigital />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
            <Route path="/organigrama" element={<Organigrama />} />
            <Route path="/avisos" element={<Avisos />} />
            <Route path="/capacitacion" element={<Capacitacion />} />
            <Route path="/sincronizacion" element={<Sincronizacion />} />
            <Route path="/empleados" element={<Empleados />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
