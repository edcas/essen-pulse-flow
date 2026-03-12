import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, MapPin, QrCode } from "lucide-react";
import { Office } from "@/types/check-methods";
import { useToast } from "@/hooks/use-toast";

interface QRCodesModalProps { open: boolean; onOpenChange: (open: boolean) => void; offices: Office[]; }

export const QRCodesModal = ({ open, onOpenChange, offices }: QRCodesModalProps) => {
  const { toast } = useToast();
  const officesWithQR = offices.filter(o => o.qrCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Códigos QR por Oficina</DialogTitle><DialogDescription>Descarga e imprime los códigos QR para cada ubicación.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          {officesWithQR.length === 0 ? (
            <div className="text-center py-12"><QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">No hay códigos QR disponibles</h3></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {officesWithQR.map((office) => (
                <Card key={office.id}>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4" />{office.name}</CardTitle><CardDescription>Código: {office.qrCode}</CardDescription></CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center"><QrCode className="h-24 w-24 text-muted-foreground" /></div>
                      <Button onClick={() => toast({ title: "Descargando código QR", description: `Generando QR para ${office.name}...` })} className="w-full"><Download className="h-4 w-4 mr-2" />Descargar PDF</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};