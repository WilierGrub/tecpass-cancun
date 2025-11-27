import React from 'react';

// Tarjeta blanca con sombra
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
    {children}
  </div>
);

// Botón con variantes de color
export const Button = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-900 text-white hover:bg-blue-800 shadow-md",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// Input estándar
export const Input = ({ label, value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      required={required}
      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none transition-all" 
    />
  </div>
);