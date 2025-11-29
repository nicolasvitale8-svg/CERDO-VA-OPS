
import React, { useState } from 'react';
import { RawMaterial, Recipe, FinalProduct, GlobalSettings } from '../types';
import { exportToExcel } from '../services/exportService';
import { Download, CheckSquare, Square, Database } from 'lucide-react';

interface Props {
  materials: RawMaterial[];
  recipes: Recipe[];
  products: FinalProduct[];
  settings: GlobalSettings;
}

export const ExportToolsView: React.FC<Props> = ({ materials, recipes, products, settings }) => {
  const [datasets, setDatasets] = useState({
    MATERIALS: true,
    RECIPES: true,
    RECIPE_DETAILS: true,
    PRODUCTS: true,
    PACKAGING: true,
    LABOR: true
  });

  const toggleDataset = (key: keyof typeof datasets) => {
    setDatasets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    const selected = Object.keys(datasets).filter(k => datasets[k as keyof typeof datasets]);
    exportToExcel({
      materials,
      recipes,
      products,
      settings,
      datasets: selected,
      filename: `cerdova_full_export_${new Date().toISOString().split('T')[0]}.xlsx`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Herramientas</h2>
          <p className="text-text-secondary text-sm mt-1 font-mono">DATA EXPORT // BACKUP & ANALYTICS</p>
        </div>
      </div>

      <div className="bg-bg-elevated border border-border-soft rounded p-8 shadow-2xl">
        <h3 className="text-lg font-header font-bold text-brand-secondary uppercase mb-6 flex items-center gap-2">
           <Database size={20} /> Exportar Base de Datos
        </h3>

        <p className="text-sm text-text-secondary mb-6 font-mono">
            Seleccione los módulos que desea descargar. Se generará un archivo Excel (.xlsx) con una hoja por cada tabla seleccionada.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
                { id: 'MATERIALS', label: 'Materias Primas' },
                { id: 'RECIPES', label: 'Recetas Base (Pastones)' },
                { id: 'RECIPE_DETAILS', label: 'Detalle de Ingredientes' },
                { id: 'PRODUCTS', label: 'Productos Finales' },
                { id: 'PACKAGING', label: 'Config. Empaque' },
                { id: 'LABOR', label: 'Param. Mano de Obra' },
            ].map(item => (
                <div 
                    key={item.id}
                    onClick={() => toggleDataset(item.id as any)}
                    className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-all ${datasets[item.id as keyof typeof datasets] ? 'bg-bg-highlight border-brand-secondary text-white' : 'bg-bg-base border-border-intense text-text-muted hover:border-text-secondary'}`}
                >
                    {datasets[item.id as keyof typeof datasets] ? <CheckSquare size={18} className="text-brand-secondary"/> : <Square size={18} />}
                    <span className="font-mono text-sm uppercase font-bold">{item.label}</span>
                </div>
            ))}
        </div>

        <button 
            onClick={handleExport}
            className="w-full py-4 bg-brand-primary text-white rounded font-bold hover:bg-brand-primaryHover shadow-[0_0_20px_rgba(255,75,125,0.3)] transition flex items-center justify-center gap-2 group"
        >
            <Download size={20} className="group-hover:translate-y-1 transition-transform"/>
            DESCARGAR EXCEL
        </button>

         <div className="mt-4 text-center">
            <p className="text-[10px] text-text-muted font-mono">
                LOG: {new Date().toISOString()} // USER_INITIATED_EXPORT
            </p>
         </div>
      </div>
    </div>
  );
};
