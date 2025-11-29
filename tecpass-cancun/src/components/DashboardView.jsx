import React from 'react';
import { Clock, ShieldCheck, PlusCircle, Trash2, CarFront, Users, MapPin } from 'lucide-react'; // Agregamos MapPin
import { doc, deleteDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { Card, Button } from './UI';

export default function DashboardView({ vehicles, accessLogs, setCurrentView }) {
  const today = new Date().toDateString();
  const todayLogs = accessLogs.filter(log => log.timestamp?.toDateString() === today);
  const uniqueVehiclesToday = new Set(todayLogs.map(l => l.plate)).size;

  // --- LÓGICA DE "QUIÉN ESTÁ ADENTRO" ---
  // Calculamos esto aquí también para mostrar el número correcto en la tarjeta
  const currentInside = (() => {
    const status = {};
    accessLogs.forEach(log => {
      if (!status[log.plate]) status[log.plate] = log.type;
    });
    // Contamos cuántos se quedaron en "Entrada"
    return Object.values(status).filter(type => type === 'Entrada').length;
  })();

  const handleDelete = async (id, plate) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${plate}?`)) {
      try {
        await deleteDoc(doc(db, "vehicles", id));
      } catch (error) {
        console.error(error);
        alert("Error al borrar");
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }) => (
    <div onClick={onClick} className="cursor-pointer group">
      <Card className={`border-l-4 ${color} shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl relative overflow-hidden`}>
        <div className="relative z-10">
          <h3 className="text-4xl font-bold text-slate-800 mb-1">{value}</h3>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4"/> {title}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
        </div>
        <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 text-slate-900 transform group-hover:scale-110 transition-transform"/>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tarjetas Interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* AQUI ESTÁ EL CAMBIO: Ahora muestra los que están ADENTRO y lleva a la nueva vista */}
        <StatCard 
          title="Autos en Campus" 
          value={currentInside}  // <-- Número real de coches adentro
          icon={MapPin}          // <-- Icono de ubicación
          color="border-l-blue-900"
          onClick={() => setCurrentView('activeVehicles')} // <-- Lleva a la nueva vista
          subtitle="Ver ubicación en tiempo real →"
        />

        <StatCard 
          title="Accesos Hoy" 
          value={todayLogs.length} 
          icon={ShieldCheck} 
          color="border-l-emerald-600"
          onClick={() => setCurrentView('history')}
          subtitle="Ver bitácora de hoy →"
        />

        <StatCard 
          title="Usuarios Únicos" 
          value={uniqueVehiclesToday} 
          icon={Users} 
          color="border-l-amber-500"
          onClick={() => setCurrentView('history')}
          subtitle="Analizar tráfico →"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla Rápida (Directorio) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-slate-800">Directorio Registrado</h3>
             <div className="flex gap-2">
               {/* Botón extra para ver la lista completa si quieren borrar a alguien */}
               <Button onClick={() => setCurrentView('usersList')} variant="secondary" className="text-sm">
                  Ver Todos
               </Button>
               <Button onClick={() => setCurrentView('register')} variant="primary" className="text-sm">
                  <PlusCircle className="w-4 h-4 mr-1"/> Nuevo
               </Button>
             </div>
          </div>
          
          <Card className="p-0 overflow-hidden border-0 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Placa</th>
                    <th className="p-4">Propietario</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {vehicles.slice(0, 5).map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-900">{v.plate}</td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">{v.name}</p>
                        <p className="text-xs text-slate-400">{v.carModel}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          v.role === 'Estudiante' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {v.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(v.id, v.plate)} className="p-2 text-slate-400 hover:text-red-600 rounded-full">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vehicles.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">Sin registros</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500"/> Actividad Reciente
            </h3>
            <div className="space-y-4">
              {accessLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                   <div className={`p-2 rounded-full ${log.type === 'Entrada' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      <ShieldCheck className={`w-4 h-4 ${log.type === 'Entrada' ? 'text-emerald-600' : 'text-blue-600'}`}/>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">{log.plate}</p>
                      <p className="text-xs text-slate-500">
                        {log.timestamp ? log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'} • {log.type}
                      </p>
                   </div>
                </div>
              ))}
              {accessLogs.length === 0 && <p className="text-sm text-slate-400 italic">Esperando accesos...</p>}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900 to-slate-900 text-white border-none shadow-xl">
             <h3 className="font-bold text-lg mb-2">Modo Guardia</h3>
             <p className="text-blue-200 text-sm mb-4">Activar control de acceso.</p>
             <Button onClick={() => setCurrentView('access')} className="w-full bg-white text-blue-900 hover:bg-blue-50 border-0">
               <ShieldCheck className="w-5 h-5"/> Abrir Sistema
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}