import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, Button } from './UI';

export default function AccessView({ vehicles, setCurrentView }) {
  const [plate, setPlate] = useState('');
  const [status, setStatus] = useState(null); // null, 'authorized', 'denied'
  const [scannedData, setScannedData] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!plate) return;

    const p = plate.toUpperCase().trim();
    const found = vehicles.find(v => v.plate === p);
    
    if (found) {
      setStatus('authorized');
      setScannedData(found);
      // Registrar en historial
      await addDoc(collection(db, 'access_logs'), {
        plate: p, 
        name: found.name, 
        role: found.role, 
        type: 'Entrada', 
        timestamp: serverTimestamp()
      });
    } else {
      setStatus('denied');
      setScannedData(null);
    }

    // Resetear a los 4 segundos
    setTimeout(() => { 
      setPlate(''); 
      setStatus(null); 
      setScannedData(null);
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="secondary" onClick={() => setCurrentView('dashboard')} className="mb-4">
        ← Salir del Modo Guardia
      </Button>

      <Card className="text-center py-8 border-t-8 border-t-blue-900 shadow-lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Punto de Control</h2>
        <p className="text-slate-500 mb-8">Ingrese la placa manualmente o use el lector</p>
        
        <form onSubmit={handleCheck} className="flex gap-3 max-w-md mx-auto">
          <input 
            autoFocus 
            className="flex-1 text-4xl text-center font-mono border-2 border-slate-300 rounded-xl py-4 uppercase tracking-widest focus:border-blue-900 outline-none transition-colors"
            value={plate} 
            onChange={e => setPlate(e.target.value)} 
            placeholder="PLACA" 
          />
          <Button type="submit" className="px-6 rounded-xl">
            <Search className="w-8 h-8"/>
          </Button>
        </form>
      </Card>

      {status === 'authorized' && (
        <div className="bg-emerald-100 border-2 border-emerald-500 p-8 rounded-xl text-center shadow-xl animate-bounce">
          <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto mb-4"/>
          <h2 className="text-4xl font-extrabold text-emerald-800 mb-2">ACCESO PERMITIDO</h2>
          <p className="text-xl text-emerald-700 font-medium">Bienvenido, {scannedData?.name}</p>
          <p className="text-emerald-600 mt-2">{scannedData?.role} • {scannedData?.carModel}</p>
        </div>
      )}

      {status === 'denied' && (
        <div className="bg-red-100 border-2 border-red-500 p-8 rounded-xl text-center shadow-xl animate-pulse">
          <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4"/>
          <h2 className="text-4xl font-extrabold text-red-800 mb-2">ACCESO DENEGADO</h2>
          <p className="text-xl text-red-700 font-medium">Placa no registrada</p>
        </div>
      )}
    </div>
  );
}