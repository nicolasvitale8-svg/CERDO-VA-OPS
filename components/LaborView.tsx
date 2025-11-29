
import React, { useState } from 'react';
import { GlobalSettings, Recipe, FinalProduct, RawMaterial } from '../types';
import { calculateRecipeStats, calculateProductStats, formatCurrency } from '../services/calcService';
import { Save, Users, Clock, AlertCircle } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface Props {
  settings: GlobalSettings;
  recipes: Recipe[];
  products: FinalProduct[];
  materials: RawMaterial[];
  onSaveSettings: (s: GlobalSettings) => void;
}

export const LaborView: React.FC<Props> = ({ settings, recipes, products, materials, onSaveSettings }) => {
  const [costPerHour, setCostPerHour] = useState(settings.costo_hora_operario);
  const costPerMinute = costPerHour / 60;

  const handleSave = () => {
    onSaveSettings({ ...settings, costo_hora_operario: costPerHour });
  };

  // Stats Calculation
  const recipeStats = recipes.map(r => calculateRecipeStats(r, materials, { costo_hora_operario: costPerHour }));
  const avgMoPaston = recipeStats.length > 0 
    ? recipeStats.reduce((acc, curr) => acc + curr.costo_mo_por_kg, 0) / recipeStats.length 
    : 0;

  const productStats = products.map(p => {
    const r = recipes.find(rec => rec.id === p.receta_id);
    if (!r) return null;
    return calculateProductStats(p, r, materials, { costo_hora_operario: costPerHour });
  }).filter(Boolean);

  const avgMoFormado = productStats.length > 0
    ? productStats.reduce((acc, curr) => acc + (curr?.costo_unitario_mo_formado || 0), 0) / productStats.length
    : 0;

  const avgMoEmpaque = productStats.length > 0
    ? productStats.reduce((acc, curr) => acc + (curr?.costo_unitario_mo_empaque || 0), 0) / productStats.length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Mano de Obra</h2>
          <p className="text-text-secondary text-sm mt-1 font-mono">COSTOS OPERATIVOS // HH GLOBAL</p>
        </div>
      </div>

      {/* Global Parameter */}
      <div className="bg-bg-elevated border border-border-soft rounded p-8 shadow-xl max-w-2xl">
        <h3 className="text-lg font-header font-bold text-brand-secondary uppercase mb-6 flex items-center gap-2">
            <Users size={20} /> Parámetro Global
        </h3>
        
        <div className="flex items-end gap-6">
            <div className="flex-1">
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2">Costo Hora Operario ($/h)</label>
                <NumberInput
                    className="w-full bg-bg-base border border-border-intense rounded px-4 py-3 text-2xl font-mono font-bold text-white outline-none focus:border-brand-primary"
                    value={costPerHour}
                    onChange={val => setCostPerHour(val)}
                />
            </div>
            <button 
                onClick={handleSave}
                className="px-6 py-3 bg-brand-primary text-white rounded font-bold hover:bg-brand-primaryHover shadow-[0_0_15px_rgba(255,75,125,0.3)] transition h-14 flex items-center gap-2"
            >
                <Save size={20} />
                GUARDAR
            </button>
        </div>
        <p className="text-xs text-text-muted mt-4 font-mono">
            * Este valor se aplica a todas las etapas (Pastón, Formado, Empaque).
            <br/>
            Costo por minuto actual: <span className="text-white font-bold">{formatCurrency(costPerMinute)}</span>
        </p>
      </div>

      {/* Stages Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stage 1 */}
        <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Clock size={60} />
            </div>
            <h4 className="font-header font-bold text-white uppercase mb-4 text-sm tracking-wider">Etapa 1: Pastón</h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-mono text-text-muted">
                    <span>Promedio MO / KG</span>
                    <span className="text-brand-secondary font-bold text-lg">{formatCurrency(avgMoPaston)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-text-muted font-mono border-t border-border-soft pt-2">
                    <span>Recetas Activas</span>
                    <span>{recipes.length}</span>
                </div>
            </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Users size={60} />
            </div>
            <h4 className="font-header font-bold text-white uppercase mb-4 text-sm tracking-wider">Etapa 2: Formado</h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-mono text-text-muted">
                    <span>Promedio MO / Unidad</span>
                    <span className="text-brand-secondary font-bold text-lg">{formatCurrency(avgMoFormado)}</span>
                </div>
                <div className="text-[10px] text-text-muted mt-2">
                   Variable según velocidad de formado y peso unitario.
                </div>
            </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Users size={60} />
            </div>
            <h4 className="font-header font-bold text-white uppercase mb-4 text-sm tracking-wider">Etapa 3: Empaque</h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-mono text-text-muted">
                    <span>Promedio MO / Unidad</span>
                    <span className="text-brand-secondary font-bold text-lg">{formatCurrency(avgMoEmpaque)}</span>
                </div>
                <div className="text-[10px] text-text-muted mt-2">
                   Depende de la velocidad de empaque y unidades por paquete.
                </div>
            </div>
        </div>
      </div>

      <div className="bg-bg-highlight/30 border border-status-info/20 rounded p-4 flex gap-3 items-start text-sm text-text-secondary">
        <AlertCircle className="text-status-info shrink-0 mt-0.5" size={18} />
        <div>
            <p className="font-bold text-status-info mb-1 font-mono uppercase">CONFIGURACIÓN DETALLADA</p>
            <p>
                Para ajustar los tiempos y operarios específicos, vaya a la <strong>Ficha de Receta</strong> (para Pastones) o a la <strong>Ficha de Producto</strong> (para Formado y Empaque).
                Esta pantalla solo define el valor de la hora.
            </p>
        </div>
      </div>

    </div>
  );
};
