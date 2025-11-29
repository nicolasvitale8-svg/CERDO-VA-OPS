
import React, { useState, useMemo } from 'react';
import { RawMaterial, Recipe, Ingredient, GlobalSettings } from '../types';
import { calculateRecipeStats, calculateMaterialCost, formatCurrency, formatDecimal } from '../services/calcService';
import { ArrowLeft, Plus, Trash2, Save, Calculator, AlertCircle, Clock, Users } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';

interface Props {
  recipe: Recipe;
  materials: RawMaterial[];
  settings: GlobalSettings;
  onSave: (r: Recipe) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onGoToScaler: (r: Recipe) => void;
}

export const RecipeDetail: React.FC<Props> = ({ recipe: initialRecipe, materials, settings, onSave, onDelete, onBack, onGoToScaler }) => {
  const [recipe, setRecipe] = useState<Recipe>(JSON.parse(JSON.stringify(initialRecipe)));
  const [addingIngredient, setAddingIngredient] = useState<string>('');
  
  const stats = calculateRecipeStats(recipe, materials, settings);

  const availableMaterials = useMemo(() => {
    const usedIds = new Set(recipe.ingredientes.map(i => i.materia_prima_id));
    return materials.sort((a,b) => a.nombre_item.localeCompare(b.nombre_item));
  }, [materials]);

  const handleAddIngredient = () => {
    if (!addingIngredient) return;
    const newIng: Ingredient = {
      id: crypto.randomUUID(),
      receta_id: recipe.id,
      materia_prima_id: addingIngredient,
      cantidad_en_um_costos: 0,
      orden_visual: recipe.ingredientes.length + 1
    };
    setRecipe(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, newIng]
    }));
    setAddingIngredient('');
  };

  const updateIngredientQty = (id: string, qty: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.map(i => i.id === id ? { ...i, cantidad_en_um_costos: qty } : i)
    }));
  };

  const removeIngredient = (id: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter(i => i.id !== id)
    }));
  };

  const handleSave = () => {
    onSave(recipe);
  };

  return (
    <div className="space-y-6 pb-20 animate-in slide-in-from-right-4 duration-300">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center text-text-secondary hover:text-white font-mono text-sm uppercase tracking-wide transition-colors">
          <ArrowLeft size={16} className="mr-2" /> VOLVER
        </button>
        <div className="flex gap-3">
            <button 
                onClick={() => onDelete(recipe.id)}
                className="flex items-center gap-2 px-3 py-2 border border-status-error/50 bg-bg-highlight text-status-error rounded hover:bg-status-error hover:text-white transition group"
                title="Eliminar Receta"
            >
                <Trash2 size={18} />
            </button>
            <button 
                onClick={() => onGoToScaler(recipe)}
                className="flex items-center gap-2 px-4 py-2 border border-border-intense bg-bg-highlight text-brand-secondary rounded hover:bg-brand-secondary/10 hover:border-brand-secondary/50 transition"
            >
                <Calculator size={18} />
                <span className="font-mono text-xs hidden sm:inline tracking-wider">ESCALAR RECETA</span>
            </button>
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded hover:bg-brand-primaryHover shadow-[0_0_15px_rgba(255,75,125,0.4)] transition"
            >
                <Save size={18} />
                <span className="font-bold tracking-wide text-sm">GUARDAR</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Summary & Stats */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-bg-elevated border border-border-soft rounded p-6 shadow-lg">
                <div className="mb-6">
                    <label className="block text-[10px] font-mono text-brand-secondary uppercase mb-1">Nombre del Pastón (Mix)</label>
                    <input 
                        className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 font-header font-bold text-white focus:border-brand-primary outline-none transition-colors text-lg"
                        value={recipe.nombre_producto}
                        onChange={e => setRecipe({...recipe, nombre_producto: e.target.value})}
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Rubro General</label>
                    <select 
                        className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-xs text-white outline-none font-mono"
                        value={recipe.rubro_producto}
                        onChange={e => setRecipe({...recipe, rubro_producto: e.target.value})}
                    >
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="space-y-3 pt-6 border-t border-border-soft">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted uppercase font-mono">Rinde Total</span>
                        <span className="font-mono text-white font-bold">{formatDecimal(stats.rinde_kg)} kg</span>
                    </div>
                    
                    {/* Cost Breakdown */}
                    <div className="flex justify-between items-center text-xs font-mono pt-2">
                         <span className="text-text-muted">Costo MP/kg</span>
                         <span className="text-text-main">{formatCurrency(stats.costo_mp_por_kg)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                         <span className="text-text-muted">Costo MO/kg</span>
                         <span className="text-text-main">{formatCurrency(stats.costo_mo_por_kg)}</span>
                    </div>

                    <div className="bg-bg-highlight p-3 rounded border border-border-soft flex justify-between items-center mt-2">
                        <span className="text-xs text-brand-secondary uppercase font-mono font-bold">Costo Mix / KG</span>
                        <span className="font-mono text-xl text-brand-secondary font-bold">{formatCurrency(stats.costo_por_kg)}</span>
                    </div>
                     {recipe.fecha_ultima_modificacion && (
                        <div className="flex items-center gap-2 justify-end pt-2">
                             <Clock size={12} className="text-text-muted" />
                             <span className="text-[10px] font-mono text-text-muted">Actualizado: {recipe.fecha_ultima_modificacion}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Labor Configuration Section */}
            <div className="bg-bg-elevated border border-border-soft rounded p-6 shadow-lg">
                <h4 className="text-sm font-header font-bold text-text-secondary uppercase mb-4 flex items-center gap-2 border-b border-border-soft pb-2">
                    <Users size={14} /> Mano de Obra (Pastón)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Min. Totales Lote</label>
                        <input 
                            type="number" 
                            className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono"
                            value={recipe.minutos_totales_paston_lote || 0}
                            onChange={e => setRecipe({...recipe, minutos_totales_paston_lote: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Cant. Operarios</label>
                         <input 
                            type="number" 
                            className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono"
                            value={recipe.operarios_equivalentes_paston || 1}
                            onChange={e => setRecipe({...recipe, operarios_equivalentes_paston: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>
                <div className="mt-4 text-[10px] text-text-muted font-mono">
                    <p>Costo MO Lote: <span className="text-white">{formatCurrency(stats.costo_mo_total)}</span></p>
                    <p>Impacto: {stats.costo_por_kg > 0 ? formatDecimal((stats.costo_mo_por_kg / stats.costo_por_kg) * 100, 1) : 0}% del costo final.</p>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Ingredients Table */}
        <div className="lg:col-span-8">
             <div className="bg-bg-elevated border border-border-soft rounded shadow-lg overflow-hidden">
                <div className="p-4 bg-bg-highlight border-b border-border-intense flex justify-between items-center">
                     <h3 className="font-bold text-white flex items-center gap-2 font-header uppercase tracking-wide text-sm">
                        Ingredientes
                        <span className="text-[10px] font-mono text-bg-base bg-text-secondary px-1.5 py-0.5 rounded">{recipe.ingredientes.length}</span>
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-mono uppercase text-text-secondary border-b border-border-intense">
                                <th className="py-3 pl-4">Materia Prima</th>
                                <th className="py-3 text-right w-32">Cant (KG)</th>
                                <th className="py-3 text-right w-24">% Peso</th>
                                <th className="py-3 text-right w-32 pr-4">Subtotal</th>
                                <th className="py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft/30 text-sm">
                            {recipe.ingredientes.map(ing => {
                                const mat = materials.find(m => m.id === ing.materia_prima_id);
                                if (!mat) return null; 
                                const cost = calculateMaterialCost(mat) * ing.cantidad_en_um_costos;
                                const weightPct = stats.rinde_kg > 0 ? (ing.cantidad_en_um_costos / stats.rinde_kg) * 100 : 0;

                                return (
                                    <tr key={ing.id} className="group hover:bg-bg-highlight transition-colors">
                                        <td className="py-2 pl-4 text-white">
                                            <div className="font-medium">{mat.nombre_item}</div>
                                            <div className="text-[10px] text-text-muted font-mono">Base: {formatCurrency(calculateMaterialCost(mat))}</div>
                                        </td>
                                        <td className="py-2">
                                            <input 
                                                type="number" 
                                                step="0.001"
                                                min="0"
                                                className="w-full text-right bg-transparent border border-transparent hover:border-border-intense focus:border-brand-secondary focus:bg-bg-base rounded px-2 py-1 outline-none font-mono font-bold text-brand-secondary transition-all"
                                                value={ing.cantidad_en_um_costos}
                                                onChange={(e) => updateIngredientQty(ing.id, parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="py-2 text-right text-xs font-mono text-text-muted">
                                            {formatDecimal(weightPct, 1)}%
                                        </td>
                                        <td className="py-2 text-right text-xs font-mono text-text-main pr-4">
                                            {formatCurrency(cost)}
                                        </td>
                                        <td className="py-2 text-center">
                                            <button 
                                                onClick={() => removeIngredient(ing.id)}
                                                className="text-text-muted hover:text-status-error transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {/* Add Row */}
                            <tr className="bg-bg-highlight/30">
                                <td className="py-3 pl-4 pr-4" colSpan={5}>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 text-xs bg-bg-base border border-border-intense rounded px-3 py-2 outline-none text-text-main font-mono focus:border-brand-primary"
                                            value={addingIngredient}
                                            onChange={(e) => setAddingIngredient(e.target.value)}
                                        >
                                            <option value="">// SELECCIONAR INSUMO...</option>
                                            {availableMaterials.map(m => (
                                                <option key={m.id} value={m.id}>{m.nombre_item}</option>
                                            ))}
                                        </select>
                                        <button 
                                            disabled={!addingIngredient}
                                            onClick={handleAddIngredient}
                                            className="bg-brand-primary text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primaryHover transition"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
