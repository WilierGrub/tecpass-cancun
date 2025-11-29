import React, { useMemo } from 'react';
import { Car, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Card, Button } from './UI';

export default function ActiveVehiclesView({ accessLogs, setCurrentView }) {
  
  // --- LÓGICA DE CÁLCULO ---
  // Analizamos los logs para saber quién sigue adentro
  const activeVehicles = useMemo(() => {
    const vehicleStatus = {};
    
    // Recorremos los logs (asumiendo que vienen ordenados del más reciente al más antiguo)
    accessLogs.forEach(log => {
      // Si ya vimos este coche, ignoramos registros más viejos (solo nos importa el último movimiento)
      if (!vehicleStatus[log.plate]) {
        vehicleStatus[log.plate] = log;
      }
    });

    // Filtramos solo aquellos cuyo ÚLTIMO movimiento fue 'Entrada'
    return Object.values(vehicleStatus).filter(log => log.type === 'Entrada');
  }, [accessLogs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600"/> Vehículos en Campus
          </h2>
          <p className="text-slate-500 text-sm">
            Listado en tiempo real de unidades dentro de las instalaciones.
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold text-xl">
          {activeVehicles.length} <span className="text-sm font-normal">Adentro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeVehicles.map((log) => (
          <Card key={log.id} className="border-t-4 border-t-emerald-500 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-slate-100 p-2 rounded-full">
                <Car className="w-6 h-6 text-slate-600"/>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                EN SITIO
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 font-mono mb-1">
              {log.plate}
            </h3>
            <p className="text-slate-600 font-medium mb-4">{log.name}</p>
            
            <div className="pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4"/>
                <span>Entró: {log.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-xs bg-slate-50 p-1 rounded text-center">
                {log.role}
              </p>
            </div>
          </Card>
        ))}

        {activeVehicles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-50"/>
            <p>El campus está vacío actualmente.</p>
          </div>
        )}
      </div>

      <div className="text-center pt-8">
        <Button variant="secondary" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2"/> Volver al Panel
        </Button>
      </div>
    </div>
  );
}