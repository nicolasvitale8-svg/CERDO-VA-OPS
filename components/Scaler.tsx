
import React, { useState, useMemo } from 'react';
import { RawMaterial, Recipe, GlobalSettings } from '../types';
import { calculateRecipeStats, calculateMaterialCost, formatCurrency, formatDecimal } from '../services/calcService';
import { Printer, ArrowLeft } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface Props {
  recipes: Recipe[];
  materials: RawMaterial[];
  settings: GlobalSettings;
  preSelectedRecipe?: Recipe | null;
  onBack?: () => void;
}

type ScaleMode = 'KG' | 'UNITS';

export const Scaler: React.FC<Props> = ({ recipes, materials, settings, preSelectedRecipe, onBack }) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(preSelectedRecipe?.id || '');
  const [mode, setMode] = useState<ScaleMode>('KG');
  const [targetValue, setTargetValue] = useState<number>(10);

  const selectedRecipe = useMemo(() => recipes.find(r => r.id === selectedRecipeId), [recipes, selectedRecipeId]);
  const baseStats = selectedRecipe ? calculateRecipeStats(selectedRecipe, materials, settings) : null;

  const calculation = useMemo(() => {
    if (!selectedRecipe || !baseStats) return null;

    let targetKg = 0;
    let scalingFactor = 0;

    if (mode === 'KG') {
      targetKg = targetValue;
      scalingFactor = baseStats.rinde_kg > 0 ? targetKg / baseStats.rinde_kg : 0;
    } else {
      const unitWeight = selectedRecipe.peso_unitario_kg || 1; 
      targetKg = targetValue * unitWeight;
      scalingFactor = baseStats.rinde_kg > 0 ? targetKg / baseStats.rinde_kg : 0;
    }

    const scaledIngredients = selectedRecipe.ingredientes.map(ing => {
      const mat = materials.find(m => m.id === ing.materia_prima_id);
      const qty = ing.cantidad_en_um_costos * scalingFactor;
      const cost = mat ? calculateMaterialCost(mat) * qty : 0;
      return {
        ...ing,
        materialName: mat?.nombre_item || 'Desconocido',
        qty,
        cost
      };
    });

    const totalCost = scaledIngredients.reduce((acc, curr) => acc + curr.cost, 0);

    return {
      targetKg,
      totalCost,
      costPerKg: targetKg > 0 ? totalCost / targetKg : 0,
      ingredients: scaledIngredients,
    };
  }, [selectedRecipe, baseStats, mode, targetValue, materials]);

  const handlePrint = () => {
    window.print();
  };

  if (!selectedRecipeId || !selectedRecipe) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-header font-bold text-white mb-8 tracking-wide">ESCALADOR DE PRODUCCIÓN</h2>
        <div className="bg-bg-elevated p-10 rounded border border-border-soft inline-block w-full max-w-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]">
           <p className="text-text-secondary mb-6 font-mono text-sm">SELECCIONE UNA RECETA PARA INICIAR EL PROCESO</p>
           <select 
             className="w-full px-4 py-3 bg-bg-base border border-border-intense rounded text-white outline-none focus:border-brand-primary text-lg"
             onChange={(e) => setSelectedRecipeId(e.target.value)}
             value={selectedRecipeId}
           >
             <option value="">-- SELECCIONAR RECETA --</option>
             {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre_producto}</option>)}
           </select>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="no-print flex items-center justify-between border-b border-border-soft pb-6">
         <div className="flex items-center gap-4">
             {onBack && (
                <button onClick={onBack} className="flex items-center text-text-muted hover:text-white transition">
                    <ArrowLeft size={20} className="mr-2" />
                </button>
             )}
             <div>
                <h2 className="text-2xl font-header font-bold text-white tracking-wide">ORDEN DE PRODUCCIÓN</h2>
                <p className="text-xs font-mono text-brand-primary mt-0.5">GENERADOR DE LOTES</p>
             </div>
         </div>
         <div className="flex gap-3">
            <select 
                className="px-3 py-2 bg-bg-elevated border border-border-intense rounded text-sm text-white w-64 outline-none focus:border-brand-secondary"
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                value={selectedRecipeId}
            >
                {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre_producto}</option>)}
            </select>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 bg-text-main text-bg-base rounded font-bold hover:bg-white transition shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
                <Printer size={18} />
                <span>IMPRIMIR</span>
            </button>
         </div>
      </div>

      {/* Input Section - Hidden on Print */}
      <div className="no-print bg-bg-elevated p-8 rounded border border-border-soft shadow-xl relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-secondary"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-secondary"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand-secondary"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-secondary"></div>

        <div className="flex flex-col md:flex-row gap-8 items-end">
             <div className="flex-1 w-full">
                <label className="block text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">Modo de Escalado</label>
                <div className="flex bg-bg-base p-1 rounded border border-border-intense">
                    <button 
                        onClick={() => setMode('KG')}
                        className={`flex-1 py-2 text-sm font-bold font-mono rounded transition-all ${mode === 'KG' ? 'bg-brand-secondary text-bg-base shadow-[0_0_10px_rgba(56,224,255,0.4)]' : 'text-text-muted hover:text-white'}`}
                    >
                        OBJ. KILOS
                    </button>
                </div>
             </div>
             <div className="flex-1 w-full">
                <label className="block text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">
                    ¿Cuántos Kilos?
                </label>
                <div className="relative group">
                    <NumberInput
                        className="w-full px-4 py-3 bg-bg-base border border-brand-secondary focus:ring-1 focus:ring-brand-secondary rounded outline-none text-3xl font-mono font-bold text-white transition-colors"
                        value={targetValue}
                        onChange={val => setTargetValue(val)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">
                        KG
                    </span>
                </div>
             </div>
        </div>
      </div>

      {/* Printable Output */}
      {calculation && (
        <div className="bg-white p-8 rounded shadow-sm print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
            {/* Print Header */}
            <div className="mb-6 border-b-2 border-black pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">ORDEN DE PRODUCCIÓN</p>
                        <h1 className="text-4xl font-black text-black uppercase tracking-tight">{selectedRecipe.nombre_producto}</h1>
                        <p className="text-lg text-gray-800 font-bold mt-1 bg-gray-100 inline-block px-2">{selectedRecipe.rubro_producto}</p>
                    </div>
                    <div className="text-right">
                         <div className="border border-black px-6 py-3 rounded">
                            <p className="text-xs text-gray-500 uppercase font-bold">OBJETIVO LOTE</p>
                            <p className="text-4xl font-mono font-bold text-black">{formatDecimal(calculation.targetKg)} <span className="text-lg font-sans font-normal">KG</span></p>
                         </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-8 text-sm no-print">
                    <div className="bg-bg-base px-4 py-2 rounded border border-border-soft">
                        <span className="text-text-muted mr-2 font-mono text-xs uppercase">Costo Total MP:</span>
                        <span className="font-mono font-bold text-brand-secondary text-lg">{formatCurrency(calculation.totalCost)}</span>
                    </div>
                    <div className="bg-bg-base px-4 py-2 rounded border border-border-soft">
                        <span className="text-text-muted mr-2 font-mono text-xs uppercase">Costo MP / Kg:</span>
                        <span className="font-mono font-bold text-white text-lg">{formatCurrency(calculation.costPerKg)}</span>
                    </div>
                </div>
            </div>

            {/* Ingredients List */}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-black text-sm uppercase tracking-wide">
                        <th className="py-2 w-2/3 font-bold text-black">Materia Prima</th>
                        <th className="py-2 text-right font-bold text-black">Cantidad (KG)</th>
                        <th className="py-2 text-right no-print font-bold text-black">Costo Est.</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {calculation.ingredients.map((ing, idx) => (
                        <tr key={idx} className="print-break-inside-avoid">
                            <td className="py-3 pr-4">
                                <div className="font-bold text-lg text-black">{ing.materialName}</div>
                            </td>
                            <td className="py-3 text-right">
                                <div className="font-mono font-bold text-xl text-black bg-gray-50 px-2 py-1 inline-block rounded">{formatDecimal(ing.qty)}</div>
                            </td>
                            <td className="py-3 text-right text-gray-500 no-print font-mono">
                                {formatCurrency(ing.cost)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                     <tr className="border-t-2 border-black bg-gray-50 print:bg-transparent">
                        <td className="py-4 pl-2 font-black text-black uppercase text-lg">TOTAL PESADA</td>
                        <td className="py-4 text-right font-black text-2xl text-black font-mono">{formatDecimal(calculation.targetKg)}</td>
                        <td className="no-print"></td>
                     </tr>
                </tfoot>
            </table>

            <div className="mt-8 pt-4 border-t border-gray-300 print:block hidden">
                <div className="flex justify-between text-xs text-gray-500">
                    <p>CERDO VA! // SISTEMA DE PRODUCCIÓN</p>
                    <p>GENERADO: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
