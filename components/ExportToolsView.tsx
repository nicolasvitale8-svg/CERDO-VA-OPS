import React, { useState, useRef } from 'react';
import { RawMaterial, Recipe, FinalProduct, GlobalSettings, User, TechnicalDataSheet } from '../types';
import { exportToExcel } from '../services/exportService';
import { Download, CheckSquare, Square, Database, Upload, AlertTriangle, FileJson, RefreshCw, Save } from 'lucide-react';

interface Props {
  materials: RawMaterial[];
  recipes: Recipe[];
  products: FinalProduct[];
  settings: GlobalSettings;
  users: User[];
  techSheets: TechnicalDataSheet[];
  onRestoreBackup: (data: any) => void;
}

export const ExportToolsView: React.FC<Props> = ({ materials, recipes, products, settings, users, techSheets, onRestoreBackup }) => {
  const [datasets, setDatasets] = useState({
    MATERIALS: true,
    RECIPES: true,
    RECIPE_DETAILS: true,
    PRODUCTS: true,
    PACKAGING: true,
    LABOR: true
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDataset = (key: keyof typeof datasets) => {
    setDatasets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExcelExport = () => {
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

  const handleBackupDownload = () => {
      const backup = {
          meta: {
              version: '1.0',
              timestamp: new Date().toISOString(),
              app: 'CERDO VA! OPS'
          },
          data: {
              materials,
              recipes,
              products,
              settings,
              users,
              techSheets
          }
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cerdova_backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleBackupUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const json = JSON.parse(e.target?.result as string);
              if (!json.data) throw new Error("Formato de archivo inválido");
              
              if (window.confirm("⚠️ ADVERTENCIA CRÍTICA\n\nEsta acción SOBRESCRIBIRÁ TODOS los datos actuales (Recetas, Productos, Costos) con los del archivo de respaldo.\n\n¿Desea continuar?")) {
                  onRestoreBackup(json.data);
              }
          } catch (error) {
              alert("Error al leer el archivo. Asegúrese de que sea un backup válido de Cerdo Va! Ops.");
              console.error(error);
          }
      };
      reader.readAsText(file);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Herramientas</h2>
          <p className="text-text-secondary text-sm mt-1 font-mono">DATA CENTER // BACKUP & EXPORT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* EXCEL EXPORT */}
          <div className="bg-bg-elevated border border-border-soft rounded p-8 shadow-xl">
            <h3 className="text-lg font-header font-bold text-brand-secondary uppercase mb-6 flex items-center gap-2">
            <Database size={20} /> Reportes Excel
            </h3>

            <p className="text-sm text-text-secondary mb-6 font-mono">
                Seleccione los módulos para generar planillas de cálculo. Ideal para análisis externo o compartir con contabilidad.
            </p>

            <div className="grid grid-cols-1 gap-3 mb-8">
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
                        className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${datasets[item.id as keyof typeof datasets] ? 'bg-bg-highlight border-brand-secondary text-white' : 'bg-bg-base border-border-intense text-text-muted hover:border-text-secondary'}`}
                    >
                        {datasets[item.id as keyof typeof datasets] ? <CheckSquare size={16} className="text-brand-secondary"/> : <Square size={16} />}
                        <span className="font-mono text-xs uppercase font-bold">{item.label}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleExcelExport}
                className="w-full py-3 bg-brand-secondary text-bg-base rounded font-bold hover:bg-white transition shadow-[0_0_15px_rgba(56,224,255,0.3)] flex items-center justify-center gap-2"
            >
                <Download size={18} />
                DESCARGAR EXCEL
            </button>
          </div>

          {/* BACKUP & RESTORE */}
          <div className="space-y-6">
               {/* DOWNLOAD BACKUP */}
              <div className="bg-bg-elevated border border-border-soft rounded p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <FileJson size={100} />
                    </div>
                    <h3 className="text-lg font-header font-bold text-brand-primary uppercase mb-4 flex items-center gap-2">
                        <Save size={20} /> Copia de Seguridad
                    </h3>
                    <p className="text-sm text-text-secondary mb-6 font-mono">
                        Descargue una copia completa de la base de datos (JSON). Guarde este archivo en un lugar seguro para evitar pérdida de datos.
                    </p>
                    <button 
                        onClick={handleBackupDownload}
                        className="w-full py-3 bg-bg-highlight border border-brand-primary/50 text-brand-primary rounded font-bold hover:bg-brand-primary hover:text-white transition flex items-center justify-center gap-2"
                    >
                        <FileJson size={18} />
                        DESCARGAR RESPALDO
                    </button>
              </div>

              {/* RESTORE BACKUP */}
              <div className="bg-bg-elevated border border-status-warning/30 rounded p-8 shadow-xl">
                    <h3 className="text-lg font-header font-bold text-status-warning uppercase mb-4 flex items-center gap-2">
                        <RefreshCw size={20} /> Restaurar Datos
                    </h3>
                    <div className="bg-status-warning/10 border border-status-warning/20 p-3 rounded mb-6 flex gap-3 items-start">
                        <AlertTriangle className="text-status-warning shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] font-mono text-status-warning">
                            CUIDADO: Al restaurar un archivo, se borrarán todos los datos actuales de la aplicación y se reemplazarán por los del archivo.
                        </p>
                    </div>

                    <input 
                        type="file" 
                        accept=".json" 
                        ref={fileInputRef}
                        onChange={handleBackupUpload}
                        className="hidden" 
                    />
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 bg-status-warning text-bg-base rounded font-bold hover:bg-white transition shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2"
                    >
                        <Upload size={18} />
                        SELECCIONAR ARCHIVO
                    </button>
              </div>
          </div>
      </div>
      
       <div className="mt-8 text-center">
            <p className="text-[10px] text-text-muted font-mono">
                SYSTEM ID: PORK-LAB-CORE // EXPORT MODULE V1.0
            </p>
       </div>
    </div>
  );
};