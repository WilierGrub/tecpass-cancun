import React, { useState, useEffect } from 'react';
import { ShieldCheck, LayoutDashboard, Car, PlusCircle, AlertCircle, CheckCircle2, LogOut, User, Users, FileText, MapPin } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { collection, onSnapshot } from 'firebase/firestore';

// Componentes
import { auth, db } from './firebase'; 
import LoginView from './components/LoginView'; 
import DashboardView from './components/DashboardView';
import RegisterView from './components/RegisterView';
import AccessView from './components/AccessView';
import UsersListView from './components/UsersListView'; 
import HistoryView from './components/HistoryView';
import ActiveVehiclesView from './components/ActiveVehiclesView';

export default function AccessControlSystem() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [currentView, setCurrentView] = useState('dashboard');
  const [vehicles, setVehicles] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  // 1. Gestión de Sesión y Roles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // CAMBIA ESTE CORREO por el tuyo si tú eres el admin
        if (currentUser.email !== 'admin@tecnm.mx') {
          setCurrentView('access');
        } else {
          setCurrentView('dashboard');
        }
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Cargar Datos
  useEffect(() => {
    if (!user) return; 

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), 
      snap => setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.log("Esperando datos...")
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

  const handleLogout = () => {
    signOut(auth);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- RENDERIZADO ---

  if (loadingAuth) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando sistema...</div>;

  if (!user) {
    return <LoginView />;
  }

  const isAdmin = user.email === 'admin@tecnm.mx';

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Notificaciones */}
      {notification && (
        <div className={`fixed top-5 right-5 px-6 py-4 rounded-lg shadow-2xl z-50 text-white font-bold flex items-center gap-3 animate-bounce ${
          notification.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
        }`}>
          {notification.type === 'error' ? <AlertCircle/> : <CheckCircle2/>}
          {notification.message}
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white w-full md:w-64 p-6 flex flex-col shadow-xl z-10">
        
        {/* --- AQUÍ ESTÁ EL LOGO NUEVO --- */}
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg w-12 h-12 flex items-center justify-center">
             <img 
               src="/logo_tec.png" 
               alt="Logo" 
               className="w-full h-full object-contain"
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://upload.wikimedia.org/wikipedia/commons/f/fc/Tecnologico_Nacional_de_Mexico.svg";
               }}
             />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">TECNM</h1>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest">CAMPUS CANCÚN</p>
          </div>
        </div>
        
        {/* Info del Usuario */}
        <div className="mb-6 px-3 py-2 bg-slate-800 rounded-lg flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <User className="w-4 h-4 text-white"/>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 uppercase font-bold">{isAdmin ? 'Administrador' : 'Guardia'}</p>
            <p className="text-xs text-white truncate">{user.email}</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          {isAdmin && (
            <>
              <SidebarBtn icon={LayoutDashboard} label="Panel Principal" view="dashboard" current={currentView} set={setCurrentView}/>
              <SidebarBtn icon={PlusCircle} label="Registro" view="register" current={currentView} set={setCurrentView}/>
              <SidebarBtn icon={Users} label="Lista de Usuarios" view="usersList" current={currentView} set={setCurrentView}/>
              <SidebarBtn icon={FileText} label="Bitácora Accesos" view="history" current={currentView} set={setCurrentView}/>
              {/* Agregamos también el botón directo a la vista de activos por si acaso */}
              <SidebarBtn icon={MapPin} label="Autos en Campus" view="activeVehicles" current={currentView} set={setCurrentView}/>
            </>
          )}
          
          <SidebarBtn icon={Car} label="Guardia / Acceso" view="access" current={currentView} set={setCurrentView}/>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {currentView === 'dashboard' ? 'Panel de Control' : 
             currentView === 'usersList' ? 'Directorio de Usuarios' : 
             currentView === 'history' ? 'Bitácora de Accesos' :
             currentView === 'activeVehicles' ? 'Vehículos en Campus' :
             currentView === 'access' ? 'Punto de Acceso' : 'Registro de Vehículos'}
          </h1>
        </header>

        {currentView === 'dashboard' && <DashboardView vehicles={vehicles} accessLogs={accessLogs} setCurrentView={setCurrentView} />}
        {currentView === 'register' && <RegisterView vehicles={vehicles} setCurrentView={setCurrentView} showNotification={showNotification} />}
        {currentView === 'usersList' && <UsersListView vehicles={vehicles} />} 
        {currentView === 'history' && <HistoryView accessLogs={accessLogs} />}
        {currentView === 'activeVehicles' && <ActiveVehiclesView accessLogs={accessLogs} setCurrentView={setCurrentView} />}
        {currentView === 'access' && <AccessView vehicles={vehicles} accessLogs={accessLogs} setCurrentView={setCurrentView} isAdmin={isAdmin} />}
      </main>
    </div>
  );
}

const SidebarBtn = ({ icon: Icon, label, view, current, set }) => (
  <button 
    onClick={()=>set(view)} 
    className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${current===view ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon className="w-5 h-5"/> {label}
  </button>
);