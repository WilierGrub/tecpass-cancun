import React, { useState } from 'react';
import { Search, FileText, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { Card } from './UI';

export default function HistoryView({ accessLogs }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtramos por nombre o placa
  const filteredLogs = accessLogs.filter(log => 
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-900"/> Bitácora de Accesos
          </h2>
          <p className="text-slate-500 text-sm">Historial completo de entradas y salidas del campus.</p>
        </div>
        
        {/* Buscador */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"/>
          <input 
            type="text"
            placeholder="Buscar en historial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-0 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
              <tr>
                <th className="p-4">Evento</th>
                <th className="p-4">Fecha y Hora</th>
                <th className="p-4">Placa</th>
                <th className="p-4">Conductor</th>
                <th className="p-4">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className={`flex items-center gap-2 font-bold ${
                      log.type === 'Entrada' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {log.type === 'Entrada' ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400"/>
                    {log.timestamp ? log.timestamp.toLocaleString('es-MX', { 
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                    }) : 'Fecha inválida'}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800">{log.plate}</td>
                  <td className="p-4 text-slate-700">{log.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {log.role}
                    </span>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No hay registros que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}