import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Importamos la conexión
import { Card, Button, Input } from './UI';

export default function RegisterView({ vehicles, setCurrentView, showNotification }) {
  const [form, setForm] = useState({ name: '', plate: '', role: 'Estudiante', controlNumber: '', carModel: '' });
  const [saving, setSaving] = useState(false);
  
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const plateUpper = form.plate.toUpperCase().trim();

    // Validación: ¿Ya existe la placa?
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
      showNotification("Vehículo registrado exitosamente");
      setForm({ name: '', plate: '', role: 'Estudiante', controlNumber: '', carModel: '' });
    } catch (error) {
      console.error(error);
      showNotification("Error al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Button variant="secondary" onClick={() => setCurrentView('dashboard')} className="mb-4">
        ← Volver al Dashboard
      </Button>
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-900"/> Alta de Usuario
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nombre Completo" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required placeholder="Ej. Max Hernández"/>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Placa" value={form.plate} onChange={e=>setForm({...form, plate: e.target.value.toUpperCase()})} required placeholder="UVC-123-D"/>
            <Input label="No. Control" value={form.controlNumber} onChange={e=>setForm({...form, controlNumber: e.target.value})} required placeholder="19390000"/>
          </div>
          <Input label="Modelo del Auto" value={form.carModel} onChange={e=>setForm({...form, carModel: e.target.value})} required placeholder="Ej. Nissan Versa Blanco"/>
          
          <div className="pt-4">
            <Button type="submit" className="w-full py-3" disabled={saving}>
              {saving ? 'Guardando...' : 'Registrar Vehículo'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}