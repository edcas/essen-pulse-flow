import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export const GeofenceMap = ({ latitude, longitude, radius, onLocationChange }: GeofenceMapProps) => {
  return (
    <div className="space-y-4">
      <Label>Ubicación en el Mapa</Label>
      <div className="w-full h-[300px] rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-3">
        <div className="p-3 rounded-full bg-primary/10">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Mapa interactivo no disponible. Ingresa las coordenadas manualmente.
        </p>
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label htmlFor="lat" className="text-xs">Latitud</Label>
            <Input id="lat" type="number" step="0.000001" value={latitude} onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude)} className="w-40" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lng" className="text-xs">Longitud</Label>
            <Input id="lng" type="number" step="0.000001" value={longitude} onChange={(e) => onLocationChange(latitude, parseFloat(e.target.value) || 0)} className="w-40" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Radio: {radius}m</p>
      </div>
    </div>
  );
};