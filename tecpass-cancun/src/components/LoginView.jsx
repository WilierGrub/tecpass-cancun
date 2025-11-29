import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Importa la autenticación desde tu archivo local
import { Card, Button } from './UI'; // Importa los componentes de UI locales

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // El cambio de vista lo maneja App.jsx automáticamente al detectar el usuario
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[url('https://www.cancun.tecnm.mx/wp-content/uploads/2021/04/Fondo-TecNM-Cancun-2.jpg')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
      <div className="max-w-md w-full animate-fade-in">
        
        {/* LOGO INSTITUCIONAL */}
        <div className="text-center mb-8">
          <div className="bg-white/90 p-4 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center shadow-lg ring-4 ring-blue-500/30">
            {/* Referencia a la imagen en la carpeta public */}
            <img 
              src="/logo_tec.png" 
              alt="Logo TECNM Cancún" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/f/fc/Tecnologico_Nacional_de_Mexico.svg"; // Fallback por si no carga la imagen local
              }}
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">TECNM CANCÚN</h1>
          <p className="text-blue-200 mt-1 font-medium text-lg">Control de Acceso Vehicular</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-blue-900"/> Iniciar Sesión
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600 mb-1 block">Correo Institucional</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                placeholder="admin@cancun.tecnm.mx"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-1 block">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-4 bg-blue-900 hover:bg-blue-800 border-0 shadow-lg text-lg font-bold" disabled={loading}>
              {loading ? 'Validando...' : 'INGRESAR AL SISTEMA'}
            </Button>
          </form>
        </Card>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          Desarrollado por Rafael Diaz para Residencia Profesional 2025
        </p>
      </div>
    </div>
  );
}