import React, { useState } from 'react';
import { Search, Trash2, Edit, Save, X, Users, QrCode } from 'lucide-react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Card, Button } from './UI'; 
import QRCode from "react-qr-code"; // Esta es la librería que acabas de instalar

export default function UsersListView({ vehicles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [qrModal, setQrModal] = useState(null); 

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.controlNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      try { await deleteDoc(doc(db, "vehicles", id)); } catch (e) { alert("Error"); }
    }
  };

  const startEdit = (vehicle) => { setEditingId(vehicle.id); setEditForm(vehicle); };

  const saveEdit = async () => {
    try { await updateDoc(doc(db, "vehicles", editingId), editForm); setEditingId(null); } catch (e) { alert("Error"); }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-900"/> Directorio & Gafetes
            </h2>
            <p className="text-slate-500 text-sm">Gestiona usuarios y genera sus códigos de acceso.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"/>
            <input 
              type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
              <tr>
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Placa</th>
                <th className="p-4">No. Control</th>
                <th className="p-4 text-center">QR</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  {editingId === v.id ? (
                    <>
                      <td className="p-2"><input className="border p-1 w-full" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})}/></td>
                      <td className="p-2"><select className="border p-1 w-full" value={editForm.role} onChange={e=>setEditForm({...editForm, role: e.target.value})}><option>Estudiante</option><option>Docente</option><option>Administrativo</option><option>Trabajador</option><option>Visitante</option></select></td>
                      <td className="p-2"><input className="border p-1 w-full" value={editForm.plate} onChange={e=>setEditForm({...editForm, plate: e.target.value})}/></td>
                      <td className="p-2"><input className="border p-1 w-full" value={editForm.controlNumber} onChange={e=>setEditForm({...editForm, controlNumber: e.target.value})}/></td>
                      <td className="p-2 text-center text-slate-300">-</td>
                      <td className="p-2 text-center flex justify-center gap-2">
                        <button onClick={saveEdit} className="p-2 bg-emerald-100 text-emerald-700 rounded"><Save className="w-4 h-4"/></button>
                        <button onClick={()=>setEditingId(null)} className="p-2 bg-slate-100 text-slate-700 rounded"><X className="w-4 h-4"/></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-medium text-slate-900">{v.name}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{v.role}</span></td>
                      <td className="p-4 font-mono font-bold text-slate-700">{v.plate}</td>
                      <td className="p-4 font-mono text-slate-500">{v.controlNumber}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setQrModal(v)}
                          className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Ver QR"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => startEdit(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(v.id, v.name)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {qrModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200" onClick={() => setQrModal(null)}>
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-blue-900" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-blue-900">Pase de Acceso</h3>
              <p className="text-slate-500">{qrModal.name}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 inline-block mb-4">
              <QRCode value={qrModal.plate} size={200} />
            </div>

            <div className="bg-slate-100 p-3 rounded-lg mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Placa</p>
              <p className="text-3xl font-mono font-black text-slate-800">{qrModal.plate}</p>
            </div>

            <button onClick={() => setQrModal(null)} className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}