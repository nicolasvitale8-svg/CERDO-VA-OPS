
import React, { useState, useMemo } from 'react';
import { FinalProduct, Recipe, RawMaterial, GlobalSettings, PackagingIngredient, User } from '../types';
import { calculateProductStats, calculateMaterialCost, formatCurrency, formatDecimal } from '../services/calcService';
import { canEditCosts } from '../services/authService';
import { ArrowLeft, Save, Copy, Package, Box, ExternalLink, Tag, Trash2, Clock, Users, Plus, X, DollarSign, AlertTriangle } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';
import { NumberInput } from './NumberInput';

interface Props {
  product: FinalProduct;
  recipes: Recipe[];
  materials: RawMaterial[];
  settings: GlobalSettings;
  currentUser: User;
  onSave: (p: FinalProduct) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onDuplicate: (p: FinalProduct) => void;
  onGoToRecipe: (rId: string) => void;
}

export const FinalProductDetail: React.FC<Props> = ({ product: initialProduct, recipes, materials, settings, currentUser, onSave, onDelete, onBack, onDuplicate, onGoToRecipe }) => {
  const [product, setProduct] = useState<FinalProduct>(initialProduct);
  const [addingPkgItem, setAddingPkgItem] = useState('');
  
  const canEdit = canEditCosts(currentUser.rol);
  const baseRecipe = recipes.find(r => r.id === product.receta_id);
  
  if (!baseRecipe) return (
      <div className="p-10 text-center">
          <p className="text-status-error font-bold">ERROR: Receta base no encontrada.</p>
          <button onClick={onBack} className="mt-4 text-text-secondary hover:text-white underline">Volver</button>
      </div>
  );

  const stats = calculateProductStats(product, baseRecipe, materials, settings);

  const packagingMaterials = useMemo(() => {
    return materials.filter(m => m.rubro_compra === 'PACKAGING' || m.rubro_compra === 'EMPAQUE' || m.unidad_costos === 'UN');
  }, [materials]);

  const handleAddPkgItem = () => {
    if (!canEdit || !addingPkgItem) return;
    const newItem: PackagingIngredient = {
        id: crypto.randomUUID(),
        materia_prima_id: addingPkgItem,
        cantidad: 1
    };
    setProduct(prev => ({
        ...prev,
        empaque_items: [...(prev.empaque_items || []), newItem]
    }));
    setAddingPkgItem('');
  };

  const removePkgItem = (itemId: string) => {
      if (!canEdit) return;
      setProduct(prev => ({
          ...prev,
          empaque_items: prev.empaque_items.filter(i => i.id !== itemId)
      }));
  };

  const updatePkgItemQty = (itemId: string, qty: number) => {
      if (!canEdit) return;
      setProduct(prev => ({
          ...prev,
          empaque_items: prev.empaque_items.map(i => i.id === itemId ? { ...i, cantidad: qty } : i)
      }));
  };

  const handleUseSuggestedPrice = () => {
      if (!canEdit) return;
      setProduct(prev => ({
          ...prev,
          precio_venta_real_neto: undefined,
          usa_precio_real_custom: false
      }));
  };

  const handleSave = () => {
    onSave(product);
  };

  const marginColor = stats.margen_real_pct < 15 ? 'text-status-error' : stats.margen_real_pct < 25 ? 'text-status-warning' : 'text-status-ok';

  return (
    <div className="space-y-6 pb-20 animate-in slide-in-from-right-4 duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <button onClick={onBack} className="flex items-center text-text-secondary hover:text-white font-mono text-sm uppercase tracking-wide transition-colors">
                <ArrowLeft size={16} className="mr-2" /> VOLVER
            </button>
            <div className="flex gap-3">
                 {canEdit && (
                    <>
                        <button 
                            onClick={() => onDelete(product.id)}
                            className="flex items-center gap-2 px-3 py-2 border border-status-error/50 bg-bg-highlight text-status-error rounded hover:bg-status-error hover:text-white transition group"
                            title="Eliminar Producto"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button 
                            onClick={() => onDuplicate(product)}
                            className="flex items-center gap-2 px-4 py-2 border border-border-intense bg-bg-highlight text-text-secondary rounded hover:text-white hover:border-text-secondary transition"
                        >
                            <Copy size={16} />
                            <span className="font-mono text-xs hidden sm:inline tracking-wider">DUPLICAR</span>
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded hover:bg-brand-primaryHover shadow-[0_0_15px_rgba(255,75,125,0.4)] transition"
                        >
                            <Save size={18} />
                            <span className="font-bold tracking-wide text-sm">GUARDAR PRODUCTO</span>
                        </button>
                    </>
                 )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Editor */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-bg-elevated border border-border-soft rounded p-6 shadow-lg relative">
                    {!canEdit && <div className="absolute top-0 right-0 p-2 text-[10px] text-text-muted border border-text-muted rounded m-2">SOLO LECTURA</div>}
                    <h3 className="text-sm font-header font-bold text-text-secondary uppercase mb-4 border-b border-border-soft pb-2">
                        Configuración del Producto
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-brand-secondary uppercase mb-1">Nombre Comercial</label>
                            <input 
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 font-header font-bold text-white focus:border-brand-primary outline-none transition-colors text-lg disabled:opacity-70"
                                value={product.nombre_producto_final}
                                onChange={e => setProduct({...product, nombre_producto_final: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Tipo / Rubro</label>
                                <select 
                                    disabled={!canEdit}
                                    className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-xs text-white outline-none font-mono disabled:opacity-70"
                                    value={product.tipo_producto}
                                    onChange={e => setProduct({...product, tipo_producto: e.target.value})}
                                >
                                    {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Receta Base</label>
                                <select 
                                    disabled={!canEdit}
                                    className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-xs text-white outline-none font-mono truncate disabled:opacity-70"
                                    value={product.receta_id}
                                    onChange={e => setProduct({...product, receta_id: e.target.value})}
                                >
                                    {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre_producto}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-soft">
                             <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Peso Un. (KG)</label>
                                <NumberInput
                                    disabled={!canEdit}
                                    className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-sm text-white outline-none font-mono text-right font-bold disabled:opacity-70"
                                    value={product.peso_unitario_kg}
                                    onChange={val => setProduct({...product, peso_unitario_kg: val})}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Config Empaque</label>
                                <div className="flex gap-2">
                                    <NumberInput
                                        placeholder="Cant."
                                        disabled={!canEdit}
                                        className="w-20 bg-bg-base border border-border-intense rounded px-2 py-2 text-sm text-white outline-none font-mono text-right disabled:opacity-70"
                                        value={product.unidades_por_paquete}
                                        onChange={val => setProduct({...product, unidades_por_paquete: val})}
                                    />
                                    <input 
                                        type="text" placeholder="Tipo (ej. CAJA)"
                                        disabled={!canEdit}
                                        className="flex-1 bg-bg-base border border-border-intense rounded px-2 py-2 text-sm text-white outline-none font-mono disabled:opacity-70"
                                        value={product.tipo_paquete}
                                        onChange={e => setProduct({...product, tipo_paquete: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Packaging Recipe Table */}
                        <div className="pt-2">
                             <label className="block text-[10px] font-mono text-text-secondary uppercase mb-2">Insumos de Empaque (por paquete)</label>
                             <div className="bg-bg-base border border-border-intense rounded overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead className="bg-bg-highlight text-text-muted font-mono uppercase">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Insumo</th>
                                            <th className="px-2 py-1 text-right w-16">Cant.</th>
                                            <th className="px-2 py-1 text-right w-20">Costo</th>
                                            <th className="w-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-soft/50">
                                        {product.empaque_items?.map(item => {
                                            const mat = materials.find(m => m.id === item.materia_prima_id);
                                            const cost = mat ? calculateMaterialCost(mat) * item.cantidad : 0;
                                            return (
                                                <tr key={item.id}>
                                                    <td className="px-2 py-1 text-white truncate max-w-[120px]">{mat?.nombre_item || '???'}</td>
                                                    <td className="px-2 py-1">
                                                        <NumberInput
                                                            disabled={!canEdit}
                                                            className="w-full bg-transparent text-right outline-none text-white font-mono disabled:opacity-50"
                                                            value={item.cantidad}
                                                            onChange={val => updatePkgItemQty(item.id, val)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-right text-text-muted font-mono">{formatCurrency(cost)}</td>
                                                    <td className="px-1 text-center">
                                                        {canEdit && (
                                                            <button onClick={() => removePkgItem(item.id)} className="text-text-muted hover:text-status-error">
                                                                <X size={12}/>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {canEdit && (
                                            <tr className="bg-bg-highlight/20">
                                                <td className="p-1" colSpan={3}>
                                                    <select 
                                                        className="w-full bg-transparent text-xs text-text-secondary outline-none"
                                                        value={addingPkgItem}
                                                        onChange={e => setAddingPkgItem(e.target.value)}
                                                    >
                                                        <option value="">+ AGREGAR EMPAQUE...</option>
                                                        {packagingMaterials.map(m => (
                                                            <option key={m.id} value={m.id}>{m.nombre_item}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="text-center">
                                                    <button onClick={handleAddPkgItem} disabled={!addingPkgItem} className="text-brand-secondary disabled:opacity-30">
                                                        <Plus size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-bg-highlight/50 font-mono text-[10px] text-text-secondary">
                                        <tr>
                                            <td colSpan={2} className="px-2 py-1 text-right">SUBTOTAL INSUMOS:</td>
                                            <td className="px-2 py-1 text-right font-bold text-white">
                                                {formatCurrency(stats.costo_paquete_empaque - (product.costo_empaque_extra || 0))}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                             </div>
                             
                             <div className="mt-3 flex items-center justify-between">
                                <label className="text-[10px] font-mono text-text-secondary uppercase">Costo Extra Manual ($)</label>
                                <div className="relative w-24">
                                    <span className="absolute left-2 top-1.5 text-text-muted text-xs">$</span>
                                    <NumberInput
                                        disabled={!canEdit}
                                        className="w-full bg-bg-base border border-border-intense rounded pl-5 pr-2 py-1 text-xs text-white outline-none font-mono text-right disabled:opacity-50"
                                        value={product.costo_empaque_extra || 0}
                                        onChange={val => setProduct({...product, costo_empaque_extra: val})}
                                    />
                                </div>
                             </div>
                             
                             <div className="mt-2 text-right border-t border-border-soft pt-2">
                                <span className="text-xs font-mono text-brand-secondary font-bold">
                                    TOTAL EMPAQUE: {formatCurrency(stats.costo_paquete_empaque)}
                                </span>
                             </div>
                        </div>
                    </div>
                     {product.fecha_ultima_modificacion && (
                        <div className="flex items-center gap-2 justify-end pt-2 border-t border-border-soft mt-4">
                             <Clock size={12} className="text-text-muted" />
                             <span className="text-[10px] font-mono text-text-muted">Actualizado: {product.fecha_ultima_modificacion}</span>
                        </div>
                    )}
                </div>

                {/* Labor Config: Forming */}
                <div className="bg-bg-elevated border border-border-soft rounded p-6 shadow-lg">
                    <h3 className="text-sm font-header font-bold text-text-secondary uppercase mb-4 flex items-center gap-2 border-b border-border-soft pb-2">
                        <Users size={14} /> Mano de Obra: Formado
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Kg / Hora</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.kg_formados_por_hora || 0}
                                onChange={val => setProduct({...product, kg_formados_por_hora: val})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Operarios</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.operarios_equiv_formado || 1}
                                onChange={val => setProduct({...product, operarios_equiv_formado: val})}
                            />
                        </div>
                         <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Min. Prep. (Fijos)</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.min_fijos_formado_lote || 0}
                                onChange={val => setProduct({...product, min_fijos_formado_lote: val})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Kg Base Prep.</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.kg_paston_lote_formado || 1}
                                onChange={val => setProduct({...product, kg_paston_lote_formado: val})}
                            />
                        </div>
                    </div>
                </div>

                {/* Labor Config: Packing */}
                <div className="bg-bg-elevated border border-border-soft rounded p-6 shadow-lg">
                    <h3 className="text-sm font-header font-bold text-text-secondary uppercase mb-4 flex items-center gap-2 border-b border-border-soft pb-2">
                        <Users size={14} /> Mano de Obra: Empaque
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Paquetes / Hora</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.paquetes_por_hora || 0}
                                onChange={val => setProduct({...product, paquetes_por_hora: val})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Operarios</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.operarios_equiv_empaque || 1}
                                onChange={val => setProduct({...product, operarios_equiv_empaque: val})}
                            />
                        </div>
                         <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Min. Prep. (Fijos)</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.min_fijos_empaque_lote || 0}
                                onChange={val => setProduct({...product, min_fijos_empaque_lote: val})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Paquetes Base</label>
                            <NumberInput
                                disabled={!canEdit}
                                className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono disabled:opacity-50"
                                value={product.paquetes_lote_empaque || 1}
                                onChange={val => setProduct({...product, paquetes_lote_empaque: val})}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Analysis & Price */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Base Recipe Info */}
                <div className="bg-bg-highlight/50 border border-border-soft rounded p-4 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] text-text-muted uppercase font-mono">Origen del Costo (Pastón)</p>
                        <p className="text-white font-bold text-sm flex items-center gap-2">
                            <Box size={14} className="text-brand-secondary"/>
                            {baseRecipe.nombre_producto}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-text-muted uppercase font-mono">Costo Base Mix</p>
                        <p className="text-brand-secondary font-mono font-bold text-lg">{formatCurrency(stats.base_receta_costo_kg)} / kg</p>
                        <p className="text-[10px] text-text-muted font-mono">(MP: {formatCurrency(stats.base_receta_costo_mp_kg)} + MO: {formatCurrency(stats.base_receta_costo_mo_kg)})</p>
                     </div>
                     <button onClick={() => onGoToRecipe(baseRecipe.id)} className="p-2 hover:bg-bg-elevated rounded text-text-muted hover:text-white transition">
                        <ExternalLink size={16} />
                     </button>
                </div>

                {/* PRICING PANEL */}
                <div className="bg-bg-elevated border border-brand-primary/30 rounded shadow-xl overflow-hidden">
                    <div className="bg-brand-primary/10 p-3 border-b border-brand-primary/20 flex items-center gap-2">
                        <DollarSign size={18} className="text-brand-primary" />
                        <span className="font-header font-bold text-brand-primary uppercase text-sm">Estrategia de Precio</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-soft">
                        {/* COLUMN 1: SUGGESTED STRATEGY */}
                        <div className="p-6 space-y-4">
                            <h4 className="text-xs font-mono text-text-secondary uppercase font-bold mb-4">Configuración Sugerida</h4>
                            
                            <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Base del Precio</label>
                                <div className="flex bg-bg-base p-1 rounded border border-border-intense">
                                    <button 
                                        disabled={!canEdit}
                                        onClick={() => setProduct({...product, metodo_precio: 'POR_PAQUETE'})}
                                        className={`flex-1 py-1 text-xs font-bold font-mono rounded transition-colors ${product.metodo_precio === 'POR_PAQUETE' ? 'bg-bg-highlight text-white border border-border-soft shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                                    >
                                        PAQUETE
                                    </button>
                                    <button 
                                        disabled={!canEdit}
                                        onClick={() => setProduct({...product, metodo_precio: 'POR_KG'})}
                                        className={`flex-1 py-1 text-xs font-bold font-mono rounded transition-colors ${product.metodo_precio === 'POR_KG' ? 'bg-bg-highlight text-white border border-border-soft shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                                    >
                                        POR KG
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Costo Base</label>
                                <div className="font-mono font-bold text-white text-lg">
                                    {formatCurrency(stats.costo_base_precio)}
                                    <span className="text-xs text-text-muted font-normal ml-1">
                                        / {product.metodo_precio === 'POR_PAQUETE' ? 'paq' : 'kg'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Coeficiente</label>
                                    <NumberInput
                                        disabled={!canEdit}
                                        className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono text-center font-bold disabled:opacity-50"
                                        value={product.coeficiente_sugerido || 1.35}
                                        onChange={val => setProduct({...product, coeficiente_sugerido: val})}
                                    />
                                    <p className="text-[10px] text-text-muted mt-1 text-center font-mono">
                                        Markup {Math.round(((product.coeficiente_sugerido || 1.35) - 1) * 100)}%
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">IVA %</label>
                                    <NumberInput
                                        disabled={!canEdit}
                                        className="w-full bg-bg-base border border-border-intense rounded px-2 py-2 text-white outline-none font-mono text-center disabled:opacity-50"
                                        value={product.iva_pct || 21}
                                        onChange={val => setProduct({...product, iva_pct: val})}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border-soft">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-text-muted font-mono uppercase">Sugerido Neto</span>
                                    <span className="font-mono font-bold text-white">{formatCurrency(stats.precio_sugerido_neto)}</span>
                                </div>
                                <div className="flex justify-between items-end text-xs text-text-muted mt-1">
                                    <span>Con IVA</span>
                                    <span>{formatCurrency(stats.precio_sugerido_iva)}</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: REAL PRICE */}
                        <div className="p-6 space-y-4 bg-bg-highlight/20 relative">
                             {product.usa_precio_real_custom && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded border border-brand-secondary/20">
                                    <AlertTriangle size={10} /> PERSONALIZADO
                                </div>
                             )}

                             <h4 className="text-xs font-mono text-brand-primary uppercase font-bold mb-4">Precio de Venta REAL</h4>

                             <div>
                                <label className="block text-[10px] font-mono text-text-secondary uppercase mb-1">Precio Neto (Cobrar)</label>
                                <NumberInput
                                    disabled={!canEdit}
                                    className={`w-full bg-bg-base border rounded px-4 py-3 text-2xl font-mono font-bold text-white outline-none focus:ring-1 transition-all disabled:opacity-50 ${product.usa_precio_real_custom ? 'border-brand-secondary ring-brand-secondary' : 'border-border-intense focus:border-brand-primary'}`}
                                    value={Number((product.usa_precio_real_custom ? (product.precio_venta_real_neto || 0) : stats.precio_sugerido_neto).toFixed(2))}
                                    onChange={val => setProduct({
                                        ...product, 
                                        precio_venta_real_neto: val,
                                        usa_precio_real_custom: true
                                    })}
                                />
                             </div>

                             <div className="flex justify-between items-center bg-bg-base p-2 rounded border border-border-soft">
                                 <span className="text-xs text-text-muted font-mono uppercase">Final con IVA</span>
                                 <span className="font-mono font-bold text-white text-lg">
                                     {formatCurrency(product.usa_precio_real_custom ? stats.precio_real_iva : stats.precio_sugerido_iva)}
                                 </span>
                             </div>

                             <div className={`flex items-center justify-between border-t border-border-soft pt-4 mt-2 ${marginColor}`}>
                                <span className="text-xs font-mono uppercase font-bold">Margen Real</span>
                                <span className="text-2xl font-mono font-bold">{formatDecimal(stats.margen_real_pct, 1)}%</span>
                             </div>

                             {product.usa_precio_real_custom && canEdit && (
                                 <button 
                                    onClick={handleUseSuggestedPrice}
                                    className="w-full text-xs py-2 border border-dashed border-text-muted text-text-muted hover:text-white hover:border-white rounded transition-colors uppercase tracking-wider"
                                 >
                                    Restaurar a Sugerido
                                 </button>
                             )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Unit Breakdown */}
                    <div className="bg-bg-elevated border border-border-soft rounded p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
                            <Tag size={60} />
                        </div>
                        <h4 className="text-xs font-header font-bold text-text-secondary uppercase mb-4 flex items-center gap-2">
                            <Tag size={14} /> Por Unidad ({formatDecimal(product.peso_unitario_kg * 1000, 0)}g)
                        </h4>
                        
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>Materia Prima</span>
                                <span>{formatCurrency(stats.costo_unitario_mp)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>MO Pastón</span>
                                <span>{formatCurrency(stats.costo_unitario_mo_paston)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>MO Formado</span>
                                <span>{formatCurrency(stats.costo_unitario_mo_formado)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono border-b border-border-soft/50 pb-2">
                                <span>MO Empaque</span>
                                <span>{formatCurrency(stats.costo_unitario_mo_empaque)}</span>
                             </div>

                             <div className="flex justify-between items-end pt-2">
                                <span className="text-xs text-brand-secondary font-bold font-mono">COSTO UNITARIO</span>
                                <span className="text-xl text-brand-secondary font-bold font-mono">{formatCurrency(stats.costo_unitario_total)}</span>
                             </div>
                        </div>
                    </div>

                    {/* Package Breakdown */}
                    <div className="bg-bg-elevated border border-border-soft rounded p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
                            <Package size={60} />
                        </div>
                         <h4 className="text-xs font-header font-bold text-text-secondary uppercase mb-4 flex items-center gap-2">
                            <Package size={14} /> Por Paquete ({product.unidades_por_paquete} u.)
                        </h4>

                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>Contenido Neto</span>
                                <span>{formatDecimal(stats.peso_total_paquete_kg, 2)} kg</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>MP Total</span>
                                <span>{formatCurrency(stats.costo_paquete_mp)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono">
                                <span>MO Total (3 Etapas)</span>
                                <span>{formatCurrency(stats.costo_paquete_mo_total)}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs text-text-muted font-mono border-b border-border-soft/50 pb-2">
                                <span>Mat. Empaque</span>
                                <span>+ {formatCurrency(stats.costo_paquete_empaque)}</span>
                             </div>
                             <div className="flex justify-between items-end pt-1">
                                <span className="text-xs text-white font-bold font-mono">COSTO TOTAL</span>
                                <span className="text-xl text-white font-bold font-mono">{formatCurrency(stats.costo_total_paquete)}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
