import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, LogOut, LogIn, Clock, Camera, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, Button } from './UI';
import { Scanner } from '@yudiel/react-qr-scanner'; // Librería de escáner

export default function AccessView({ vehicles, accessLogs, setCurrentView, isAdmin }) {
  const [plate, setPlate] = useState('');
  const [status, setStatus] = useState(null); 
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const processAccess = async (plateInput) => {
    if (!plateInput) return;
    const p = plateInput.toUpperCase().trim();
    if (p.length < 5) return; 

    const foundVehicle = vehicles.find(v => v.plate === p);
    
    if (foundVehicle) {
      setScannedData(foundVehicle);
      
      const lastLog = accessLogs.find(log => log.plate === p);
      const isInside = lastLog?.type === 'Entrada';
      const newAction = isInside ? 'Salida' : 'Entrada';

      setStatus(isInside ? 'exit' : 'entry');

      await addDoc(collection(db, 'access_logs'), {
        plate: p, 
        name: foundVehicle.name, 
        role: foundVehicle.role, 
        type: newAction,
        timestamp: serverTimestamp()
      });

    } else {
      setStatus('denied');
      setScannedData(null);
    }

    setIsScanning(false);
    setTimeout(() => { setPlate(''); setStatus(null); setScannedData(null); }, 4000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processAccess(plate);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      {isAdmin && (
        <Button variant="secondary" onClick={() => setCurrentView('dashboard')} className="mb-4">
          ← Salir del Modo Guardia
        </Button>
      )}

      {isScanning ? (
        <Card className="border-4 border-blue-500 overflow-hidden relative bg-black">
          <p className="text-white text-center mb-2 animate-pulse">Escaneando QR...</p>
          <div className="rounded-xl overflow-hidden aspect-square max-w-sm mx-auto">
             <Scanner 
                onScan={(result) => {
                  if (result && result[0]) {
                    processAccess(result[0].rawValue);
                  }
                }}
                onError={(error) => console.log(error)}
                components={{ audio: false, finder: false }}
             />
          </div>
          <button onClick={() => setIsScanning(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"><X className="w-6 h-6"/></button>
        </Card>
      ) : (
        <Card className="text-center py-8 border-t-8 border-t-blue-900 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Punto de Control</h2>
          <p className="text-slate-500 mb-6">Escanea el QR o ingresa la placa manual</p>
          
          <button onClick={() => setIsScanning(true)} className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-3 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <Camera className="w-6 h-6" /> ACTIVAR ESCÁNER QR
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-slate-400 text-sm absolute">o ingreso manual</span>
          </div>
          
          <form onSubmit={handleManualSubmit} className="flex gap-3 max-w-md mx-auto">
            <input autoFocus className="flex-1 text-4xl text-center font-mono border-2 border-slate-300 rounded-xl py-3 uppercase tracking-widest focus:border-blue-900 outline-none transition-colors" value={plate} onChange={e => setPlate(e.target.value)} placeholder="PLACA" />
            <Button type="submit" className="px-6 rounded-xl"><Search className="w-8 h-8"/></Button>
          </form>
        </Card>
      )}

      {status === 'entry' && (
        <div className="bg-emerald-100 border-2 border-emerald-500 p-8 rounded-xl text-center shadow-xl animate-bounce">
          <LogIn className="w-20 h-20 text-emerald-600 mx-auto mb-4"/>
          <h2 className="text-4xl font-extrabold text-emerald-800 mb-2">ENTRADA AUTORIZADA</h2>
          <p className="text-xl text-emerald-700 font-medium">{scannedData?.name}</p>
          <p className="text-emerald-600 mt-2">{scannedData?.role} • {scannedData?.carModel}</p>
        </div>
      )}

      {status === 'exit' && (
        <div className="bg-blue-100 border-2 border-blue-500 p-8 rounded-xl text-center shadow-xl animate-bounce">
          <LogOut className="w-20 h-20 text-blue-600 mx-auto mb-4"/>
          <h2 className="text-4xl font-extrabold text-blue-800 mb-2">SALIDA REGISTRADA</h2>
          <p className="text-xl text-blue-700 font-medium">Hasta luego, {scannedData?.name}</p>
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