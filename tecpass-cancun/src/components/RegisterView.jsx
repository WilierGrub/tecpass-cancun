import React, { useState } from 'react';
import { PlusCircle, CheckCircle2 } from 'lucide-react'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Card, Button, Input } from './UI'; 

export default function RegisterView({ vehicles, setCurrentView, showNotification }) {
  const [form, setForm] = useState({ 
    name: '', 
    plate: '', 
    role: 'Estudiante', 
    controlNumber: '', 
    carModel: '' 
  });
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  
  // --- VALIDACIÓN DE PLACAS (NOM-001-SCT-2-2016) ---
  const validatePlateFormat = (plate) => {
    // Regex 1: Formato Actual (Ej. UVC-123-D) -> 3 Letras, 3 Números, 1 Letra
    const formatNew = /^[A-Z]{3}-\d{3}-[A-Z]$/;
    
    // Regex 2: Formato Clásico (Ej. ABC-12-34) -> 3 Letras, 4 Números (separados)
    const formatOld = /^[A-Z]{3}-\d{2}-\d{2}$/;

    // Permitimos cualquiera de los dos
    return formatNew.test(plate) || formatOld.test(plate);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Convertimos a mayúsculas automáticamente para ayudar a la validación
    const plateUpper = form.plate.toUpperCase().trim();

    // 1. VALIDACIÓN DE FORMATO (NUEVO)
    if (!validatePlateFormat(plateUpper)) {
      showNotification("Formato de placa inválido. Use: ABC-123-D o ABC-12-34", "error");
      setSaving(false);
      return; // Detenemos el guardado aquí
    }

    // 2. Validación de Duplicados
    if (vehicles.find(v => v.plate === plateUpper)) {
      showNotification("¡Esta placa ya está registrada!", "error");
      setSaving(false);
      return;
    }
    
    try {
      await addDoc(collection(db, 'vehicles'), { 
        ...form, 
        plate: plateUpper, 
        createdAt: serverTimestamp() 
      });
      
      setForm({ name: '', plate: '', role: 'Estudiante', controlNumber: '', carModel: '' });
      setShowModal(true);

    } catch (error) {
      console.error("Error al guardar:", error);
      showNotification("Error al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in relative">
      <Button variant="secondary" onClick={() => setCurrentView('dashboard')} className="mb-4">
        ← Volver al Dashboard
      </Button>
      
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-900"/> Alta de Usuario
        </h2>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input 
                label="Nombre Completo" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                placeholder="Ej. Max Hernández"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Usuario</label>
              <select 
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none transition-all bg-white"
              >
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Visitante">Visitante</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Placa (Formato Oficial)" 
              value={form.plate} 
              // Convertimos a mayúsculas mientras escribes para mejor UX
              onChange={e => setForm({...form, plate: e.target.value.toUpperCase()})} 
              required 
              placeholder="Ej. UVC-123-D"
            />
            <Input 
              label={form.role === 'Visitante' ? 'INE / Identificación' : 'No. Control / ID'} 
              value={form.controlNumber} 
              onChange={e => setForm({...form, controlNumber: e.target.value})} 
              required 
              placeholder={form.role === 'Visitante' ? 'INE' : '19390000'}
            />
          </div>
          
          <Input 
            label="Modelo del Auto" 
            value={form.carModel} 
            onChange={e => setForm({...form, carModel: e.target.value})} 
            required 
            placeholder="Ej. Nissan Versa Blanco"
          />
          
          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full py-3" disabled={saving}>
              {saving ? 'Validando y Guardando...' : 'Registrar Vehículo'}
            </Button>
          </div>
        </form>
      </Card>

      {/* --- MODAL (POP-UP) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center border-t-8 border-emerald-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Registro Exitoso!</h3>
            <p className="text-slate-500 mb-8">El vehículo ha sido guardado en la base de datos correctamente.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Registrar otro usuario
              </button>
              
              <button 
                onClick={() => { setShowModal(false); setCurrentView('dashboard'); }}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                No, ir al Panel Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}