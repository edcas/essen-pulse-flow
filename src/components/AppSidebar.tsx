import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Bell, ClipboardCheck, GraduationCap, Settings,
  ChevronLeft, RefreshCw, BarChart3, Eye, Clock, CheckSquare, Users,
  MapPin, Network, FolderOpen, Timer, FileWarning, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import EssenLogo from "./EssenLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Building2, label: "Empresas", path: "/empresas" },
  { icon: ClipboardCheck, label: "Evaluaciones", path: "/evaluaciones" },
  { icon: GraduationCap, label: "Capacitación", path: "/capacitacion" },
  { icon: Bell, label: "Avisos", path: "/avisos" },
  { icon: RefreshCw, label: "Sincronización", path: "/sincronizacion" },
  { icon: BarChart3, label: "Reportes", path: "/reportes" },
];

const clientViewItems = [
  { icon: Clock, label: "Control de Asistencia", path: "/cliente/asistencia" },
  { icon: CheckSquare, label: "Centro de Aprobación", path: "/cliente/aprobacion" },
  { icon: Users, label: "Empleados", path: "/cliente/empleados" },
  { icon: MapPin, label: "Centros", path: "/cliente/centros" },
  { icon: Network, label: "Organigrama", path: "/cliente/organigrama" },
  { icon: FolderOpen, label: "Expediente", path: "/cliente/expediente" },
  { icon: GraduationCap, label: "Capacitación", path: "/cliente/capacitacion" },
  { icon: Timer, label: "Reloj Checador", path: "/cliente/reloj-checador" },
  { icon: FileWarning, label: "Incidencias", path: "/cliente/incidencias" },
];

const bottomItems = [
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export default function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [clientViewOpen, setClientViewOpen] = useState(
    location.pathname.startsWith("/cliente")
  );

  const isClientRoute = location.pathname.startsWith("/cliente");

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{ background: "var(--gradient-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <EssenLogo size={36} />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-display text-lg font-extrabold text-sidebar-foreground tracking-tight leading-none">
              Essen
            </span>
            <span className="text-[9px] font-semibold tracking-[0.15em] text-sidebar-muted uppercase leading-none mt-0.5">
              Wellbeing Corporativo
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Separator */}
        <div className="my-3 border-t border-sidebar-border/50" />

        {/* Ver como cliente */}
        <button
          onClick={() => setClientViewOpen(!clientViewOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isClientRoute
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Eye className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Ver como cliente</span>
              {clientViewOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0" />
              )}
            </>
          )}
        </button>

        {clientViewOpen && !collapsed && (
          <div className="ml-3 space-y-0.5 border-l border-sidebar-border/50 pl-3">
            {clientViewItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 px-3 pb-4">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
