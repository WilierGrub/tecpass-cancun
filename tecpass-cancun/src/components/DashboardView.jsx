import React from 'react';
import { Clock, ShieldCheck, PlusCircle } from 'lucide-react';
import { Card, Button } from './UI';

export default function DashboardView({ vehicles, accessLogs, setCurrentView }) {
  // Cálculos simples
  const today = new Date().toDateString();
  const todayLogs = accessLogs.filter(log => log.timestamp?.toDateString() === today);
  const uniqueVehiclesToday = new Set(todayLogs.map(l => l.plate)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-900">
          <h3 className="text-3xl font-bold text-slate-800">{vehicles.length}</h3>
          <p className="text-slate-500 text-sm font-medium">Vehículos Registrados</p>
        </Card>
        <Card className="border-l-4 border-l-emerald-600">
          <h3 className="text-3xl font-bold text-slate-800">{todayLogs.length}</h3>
          <p className="text-slate-500 text-sm font-medium">Accesos Hoy</p>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <h3 className="text-3xl font-bold text-slate-800">{uniqueVehiclesToday}</h3>
          <p className="text-slate-500 text-sm font-medium">Vehículos Únicos</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de últimos accesos */}
        <Card>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500"/> Actividad Reciente
          </h3>
          <div className="space-y-3">
            {accessLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">{log.plate}</span>
                  <span className="text-xs text-slate-500">{log.name}</span>
                </div>
                <span className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded border">
                  {log.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
            {accessLogs.length === 0 && (
              <p className="text-slate-400 text-center py-4 text-sm">No hay registros de acceso aún.</p>
            )}
          </div>
        </Card>

        {/* Botones de Acción */}
        <div className="space-y-4">
          <Card className="bg-blue-50 border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Operación Diaria</h3>
            <Button className="w-full py-4 text-lg justify-start mb-3" variant="success" onClick={() => setCurrentView('access')}>
              <ShieldCheck className="w-6 h-6 mr-2" /> Abrir Panel de Guardia
            </Button>
            <p className="text-xs text-blue-700">Usa esto en la caseta de vigilancia.</p>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-800 mb-2">Administración</h3>
            <Button className="w-full py-3 justify-start" onClick={() => setCurrentView('register')}>
              <PlusCircle className="w-5 h-5 mr-2" /> Registrar Nuevo Alumno/Auto
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}