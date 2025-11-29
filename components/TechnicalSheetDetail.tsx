
import React, { useState } from 'react';
import { TechnicalDataSheet, Recipe, RawMaterial, User } from '../types';
import { canEditCosts } from '../services/authService';
import { ArrowLeft, Save, Printer, Plus, Trash2, FileText, Code, X, Upload, Copy } from 'lucide-react';

interface Props {
  sheet: TechnicalDataSheet;
  recipe: Recipe;
  materials: RawMaterial[];
  currentUser: User;
  onSave: (sheet: TechnicalDataSheet) => void;
  onBack: () => void;
}

export const TechnicalSheetDetail: React.FC<Props> = ({ sheet: initialSheet, recipe, materials, currentUser, onSave, onBack }) => {
  const [sheet, setSheet] = useState<TechnicalDataSheet>(initialSheet);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const canEdit = canEditCosts(currentUser.rol);

  const handleSave = () => {
    onSave(sheet);
  };

  const handlePrint = () => {
    window.print();
  };

  const addParameter = () => {
    const newParam = {
        id: crypto.randomUUID(),
        control: '',
        limite_criterio: '',
        accion_correctiva: ''
    };
    setSheet({...sheet, parametros_criticos: [...sheet.parametros_criticos, newParam]});
  };

  const removeParameter = (id: string) => {
      setSheet({...sheet, parametros_criticos: sheet.parametros_criticos.filter(p => p.id !== id)});
  };

  const updateParameter = (id: string, field: keyof typeof sheet.parametros_criticos[0], value: string) => {
      setSheet({
          ...sheet,
          parametros_criticos: sheet.parametros_criticos.map(p => p.id === id ? { ...p, [field]: value } : p)
      });
  };

  const handleObservationChange = (ingId: string, value: string) => {
      setSheet({
          ...sheet,
          bom_observaciones: {
              ...sheet.bom_observaciones,
              [ingId]: value
          }
      });
  };

  const openJsonModal = () => {
      setJsonInput(JSON.stringify(sheet, null, 2));
      setShowJsonModal(true);
  };

  const handleImportJson = () => {
      try {
          const parsed = JSON.parse(jsonInput);
          // Basic validation
          if (!parsed.codigo || !parsed.area) throw new Error("Formato inválido");
          
          // Keep current IDs to avoid breaking references if imported from another system
          setSheet({
              ...parsed,
              id: sheet.id,
              receta_id: sheet.receta_id
          });
          setShowJsonModal(false);
          alert("Ficha importada correctamente. Revise los datos y guarde.");
      } catch (e) {
          alert("Error al importar JSON. Verifique el formato.");
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(jsonInput);
      alert("Copiado al portapapeles");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* APP HEADER - No Print */}
      <div className="no-print flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center text-text-secondary hover:text-white font-mono text-sm uppercase tracking-wide transition-colors">
                <ArrowLeft size={16} className="mr-2" /> VOLVER A RECETA
            </button>
         </div>
         <div className="flex gap-3">
             {canEdit && (
                 <button 
                    onClick={openJsonModal}
                    className="flex items-center gap-2 px-3 py-2 bg-bg-elevated border border-brand-secondary/30 text-brand-secondary rounded hover:bg-brand-secondary/10 transition"
                    title="Importar / Exportar JSON"
                 >
                     <Code size={18} />
                 </button>
             )}
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border-intense text-text-main rounded hover:bg-bg-highlight transition"
             >
                 <Printer size={18} /> IMPRIMIR
             </button>
             {canEdit && (
                 <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded hover:bg-brand-primaryHover shadow-[0_0_15px_rgba(255,75,125,0.3)] transition font-bold"
                 >
                     <Save size={18} /> GUARDAR
                 </button>
             )}
         </div>
      </div>

      {/* DOCUMENT CONTAINER - A4-ish look */}
      <div className="bg-white text-black p-10 md:p-14 shadow-2xl rounded-sm min-h-[1000px] print:p-0 print:shadow-none print:w-full">
        
        {/* DOCUMENT HEADER */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-1">{recipe.nombre_producto}</h1>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Ficha Técnica de Proceso</p>
            </div>
            <div className="text-right">
                 <div className="text-3xl font-black tracking-tight">{sheet.codigo}</div>
                 <div className="text-sm font-mono text-gray-500">{sheet.version} | Vigencia: {sheet.vigencia}</div>
            </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-8 text-sm border-b border-gray-300 pb-6">
            <div>
                <span className="block text-xs font-bold text-gray-500 uppercase">Área</span>
                <input 
                    disabled={!canEdit}
                    className="w-full border-b border-dotted border-gray-400 focus:border-black outline-none font-medium bg-transparent disabled:border-transparent"
                    value={sheet.area}
                    onChange={e => setSheet({...sheet, area: e.target.value})}
                />
            </div>
            <div>
                <span className="block text-xs font-bold text-gray-500 uppercase">Responsable</span>
                <input 
                    disabled={!canEdit}
                    className="w-full border-b border-dotted border-gray-400 focus:border-black outline-none font-medium bg-transparent disabled:border-transparent"
                    value={sheet.responsable}
                    onChange={e => setSheet({...sheet, responsable: e.target.value})}
                />
            </div>
            <div>
                <span className="block text-xs font-bold text-gray-500 uppercase">Verificado Por</span>
                <input 
                    disabled={!canEdit}
                    className="w-full border-b border-dotted border-gray-400 focus:border-black outline-none font-medium bg-transparent disabled:border-transparent"
                    value={sheet.verificador}
                    onChange={e => setSheet({...sheet, verificador: e.target.value})}
                />
            </div>
        </div>

        {/* SECTION 1: BOM */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold uppercase border-l-4 border-black pl-3">1. Especificación del Lote</h2>
                <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">Base Lote: {recipe.rinde_kg} kg</div>
            </div>
            
            <table className="w-full text-sm text-left border-collapse border border-black mb-4">
                <thead className="bg-gray-200 text-xs uppercase font-bold">
                    <tr>
                        <th className="border border-black p-2 w-12 text-center">Ord.</th>
                        <th className="border border-black p-2">Insumo</th>
                        <th className="border border-black p-2 text-right w-24">Cant. (Kg)</th>
                        <th className="border border-black p-2 text-right w-20">%</th>
                        <th className="border border-black p-2">Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {recipe.ingredientes.map((ing, idx) => {
                         const mat = materials.find(m => m.id === ing.materia_prima_id);
                         const pct = recipe.rinde_kg > 0 ? (ing.cantidad_en_um_costos / recipe.rinde_kg) * 100 : 0;
                         return (
                             <tr key={ing.id}>
                                 <td className="border border-black p-2 text-center">{idx + 1}</td>
                                 <td className="border border-black p-2 font-medium">{mat?.nombre_item || '???'}</td>
                                 <td className="border border-black p-2 text-right">{ing.cantidad_en_um_costos.toFixed(3)}</td>
                                 <td className="border border-black p-2 text-right">{pct.toFixed(2)}%</td>
                                 <td className="border border-black p-0">
                                     <input 
                                        disabled={!canEdit}
                                        className="w-full h-full p-2 outline-none bg-transparent"
                                        placeholder="..."
                                        value={sheet.bom_observaciones?.[ing.id] || ''}
                                        onChange={e => handleObservationChange(ing.id, e.target.value)}
                                     />
                                 </td>
                             </tr>
                         )
                    })}
                </tbody>
            </table>
            
            <div className="bg-yellow-50 border border-yellow-200 p-3 text-sm">
                <span className="font-bold text-yellow-800 mr-2">NOTA CRÍTICA:</span>
                <input 
                    disabled={!canEdit}
                    className="w-full bg-transparent outline-none border-b border-dotted border-yellow-400 text-gray-800"
                    value={sheet.nota_critica_bom}
                    onChange={e => setSheet({...sheet, nota_critica_bom: e.target.value})}
                />
            </div>
        </div>

        {/* SECTION 2: PROCESS */}
        <div className="mb-8 print:break-inside-avoid">
             <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold uppercase border-l-4 border-black pl-3">2. Proceso Operativo</h2>
                <input 
                    disabled={!canEdit}
                    className="text-right text-xs font-mono bg-transparent border-none outline-none text-gray-500 w-64"
                    placeholder="Ref. SOP..."
                    value={sheet.sop_referencia}
                    onChange={e => setSheet({...sheet, sop_referencia: e.target.value})}
                />
            </div>
            <textarea 
                disabled={!canEdit}
                className="w-full border border-gray-300 p-4 text-sm min-h-[150px] outline-none focus:border-black transition-colors resize-none bg-transparent whitespace-pre-wrap leading-relaxed"
                value={sheet.texto_proceso}
                onChange={e => setSheet({...sheet, texto_proceso: e.target.value})}
            />
        </div>

        {/* SECTION 3: CRITICAL PARAMETERS */}
        <div className="mb-8 print:break-inside-avoid">
            <h2 className="text-lg font-bold uppercase border-l-4 border-black pl-3 mb-2">3. Parámetros Críticos de Control</h2>
            <table className="w-full text-sm text-left border-collapse border border-black">
                <thead className="bg-gray-200 text-xs uppercase font-bold">
                    <tr>
                        <th className="border border-black p-2 w-1/3">Control</th>
                        <th className="border border-black p-2 w-1/3">Límite / Criterio</th>
                        <th className="border border-black p-2 w-1/3">Acción Correctiva</th>
                        {canEdit && <th className="border border-black p-2 w-8 no-print"></th>}
                    </tr>
                </thead>
                <tbody>
                    {sheet.parametros_criticos.map(param => (
                        <tr key={param.id}>
                            <td className="border border-black p-0">
                                <input disabled={!canEdit} className="w-full p-2 outline-none bg-transparent font-medium" value={param.control} onChange={e => updateParameter(param.id, 'control', e.target.value)} />
                            </td>
                             <td className="border border-black p-0">
                                <input disabled={!canEdit} className="w-full p-2 outline-none bg-transparent" value={param.limite_criterio} onChange={e => updateParameter(param.id, 'limite_criterio', e.target.value)} />
                            </td>
                             <td className="border border-black p-0">
                                <input disabled={!canEdit} className="w-full p-2 outline-none bg-transparent" value={param.accion_correctiva} onChange={e => updateParameter(param.id, 'accion_correctiva', e.target.value)} />
                            </td>
                            {canEdit && (
                                <td className="border border-black p-0 text-center no-print">
                                    <button onClick={() => removeParameter(param.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {canEdit && (
                <button onClick={addParameter} className="no-print mt-2 text-xs font-bold text-brand-secondary flex items-center gap-1 hover:underline">
                    <Plus size={12}/> AGREGAR PARÁMETRO
                </button>
            )}
        </div>

        {/* SECTION 4: CONSERVATION */}
        <div className="mb-8 print:break-inside-avoid">
             <h2 className="text-lg font-bold uppercase border-l-4 border-black pl-3 mb-2">4. Conservación Intermedia</h2>
              <textarea 
                disabled={!canEdit}
                className="w-full border border-gray-300 p-4 text-sm min-h-[80px] outline-none focus:border-black transition-colors resize-none bg-transparent"
                value={sheet.texto_conservacion}
                onChange={e => setSheet({...sheet, texto_conservacion: e.target.value})}
            />
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t-2 border-black flex justify-between text-[10px] text-gray-500 uppercase tracking-widest print:fixed print:bottom-0 print:left-0 print:w-full print:bg-white print:p-4 print:border-t-0">
            <div>Cerdo Va! Ops System</div>
            <div>Impreso: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            <div>Página 1/1</div>
        </div>

      </div>

      {/* JSON IMPORT/EXPORT MODAL */}
      {showJsonModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
              <div className="bg-bg-elevated border border-border-intense rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-6 py-4 border-b border-border-intense bg-bg-highlight flex justify-between items-center">
                      <h3 className="font-header font-bold text-white uppercase flex items-center gap-2">
                          <Code size={18} className="text-brand-secondary"/> DATOS RAW (JSON)
                      </h3>
                      <button onClick={() => setShowJsonModal(false)} className="text-text-muted hover:text-white">&times;</button>
                  </div>
                  <div className="p-6">
                      <p className="text-xs text-text-secondary mb-2 font-mono">
                          Copie este texto para backup, o pegue aquí un JSON generado por IA para importar datos.
                      </p>
                      <textarea 
                          className="w-full h-64 bg-bg-base border border-border-intense rounded p-4 text-xs font-mono text-brand-secondary outline-none focus:border-brand-primary"
                          value={jsonInput}
                          onChange={e => setJsonInput(e.target.value)}
                      />
                      <div className="flex gap-3 mt-4">
                          <button 
                              onClick={copyToClipboard}
                              className="flex-1 px-4 py-2 border border-border-intense text-text-secondary rounded hover:bg-bg-highlight font-medium transition-colors flex items-center justify-center gap-2"
                          >
                              <Copy size={16} /> COPIAR
                          </button>
                          <button 
                              onClick={handleImportJson}
                              className="flex-1 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primaryHover font-medium transition-colors flex items-center justify-center gap-2"
                          >
                              <Upload size={16} /> IMPORTAR & REEMPLAZAR
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
