import React, { useState, useEffect } from 'react';
import { ShieldCheck, LayoutDashboard, Car, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';

// Importamos nuestros propios archivos
import { auth, db } from './firebase'; 
import DashboardView from './components/DashboardView';
import RegisterView from './components/RegisterView';
import AccessView from './components/AccessView';

export default function AccessControlSystem() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [vehicles, setVehicles] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  // 1. Autenticación
  useEffect(() => {
    if(!auth) return;
    signInAnonymously(auth).catch(err => console.error("Error Auth:", err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Cargar Datos en Tiempo Real
  useEffect(() => {
    if (!user || !db) return;

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), 
      snap => setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.log("Esperando vehículos...")
    );

    const unsubLogs = onSnapshot(collection(db, 'access_logs'), 
      snap => {
        const logs = snap.docs.map(d => ({ 
          id: d.id, ...d.data(), timestamp: d.data().timestamp?.toDate() 
        })).sort((a, b) => b.timestamp - a.timestamp);
        setAccessLogs(logs);
      },
      err => console.log("Esperando logs...")
    );

    return () => { unsubVehicles(); unsubLogs(); };
  }, [user]);

  // Sistema de Notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Renderizado del Layout
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Notificación Toast */}
      {notification && (
        <div className={`fixed top-5 right-5 px-6 py-4 rounded-lg shadow-2xl z-50 text-white font-bold flex items-center gap-3 ${
          notification.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
        }`}>
          {notification.type === 'error' ? <AlertCircle/> : <CheckCircle2/>}
          {notification.message}
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white w-full md:w-64 p-6 flex flex-col shadow-xl z-10">
        <div className="font-bold text-2xl mb-10 flex gap-3 items-center text-blue-400">
          <ShieldCheck className="w-8 h-8"/> <span>TECPASS</span>
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarBtn icon={LayoutDashboard} label="Panel Principal" view="dashboard" current={currentView} set={setCurrentView}/>
          <SidebarBtn icon={Car} label="Guardia / Acceso" view="access" current={currentView} set={setCurrentView}/>
          <SidebarBtn icon={PlusCircle} label="Registro" view="register" current={currentView} set={setCurrentView}/>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          <p>TECNM Campus Cancún</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {currentView === 'dashboard' ? 'Panel de Control' : currentView === 'access' ? 'Punto de Acceso' : 'Registro de Vehículos'}
          </h1>
        </header>

        {/* Router Simple */}
        {currentView === 'dashboard' && <DashboardView vehicles={vehicles} accessLogs={accessLogs} setCurrentView={setCurrentView} />}
        {currentView === 'register' && <RegisterView vehicles={vehicles} setCurrentView={setCurrentView} showNotification={showNotification} />}
        {currentView === 'access' && <AccessView vehicles={vehicles} setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}

// Botón auxiliar para el sidebar
const SidebarBtn = ({ icon: Icon, label, view, current, set }) => (
  <button 
    onClick={()=>set(view)} 
    className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${current===view ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon className="w-5 h-5"/> {label}
  </button>
);