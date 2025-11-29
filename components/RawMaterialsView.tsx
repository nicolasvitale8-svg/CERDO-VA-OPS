
import React, { useState, useMemo } from 'react';
import { RawMaterial, User } from '../types';
import { PURCHASE_CATEGORIES } from '../constants';
import { calculateMaterialCost, formatCurrency } from '../services/calcService';
import { canEditCosts } from '../services/authService';
import { exportToExcel } from '../services/exportService';
import { Plus, Search, Edit2, CheckCircle, Download } from 'lucide-react';

interface Props {
  materials: RawMaterial[];
  onSave: (m: RawMaterial) => void;
  currentUser: User;
}

export const RawMaterialsView: React.FC<Props> = ({ materials, onSave, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<RawMaterial>>({});

  const canEdit = canEditCosts(currentUser.rol);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.nombre_item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? m.rubro_compra === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, categoryFilter]);

  const handleEdit = (item: RawMaterial) => {
    if (!canEdit) return;
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      rubro_compra: PURCHASE_CATEGORIES[0],
      unidad_compra: 'KG',
      cantidad_por_unidad_compra: 1,
      merma_factor: 1.0,
      fecha_ultimo_precio: new Date().toISOString().split('T')[0],
      precio_unidad_compra: 0,
      unidad_costos: 'KG',
      nombre_item: ''
    });
    setIsEditing(true);
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem.nombre_item && editingItem.id) {
      onSave(editingItem as RawMaterial);
      setIsEditing(false);
    }
  };

  const handleExport = () => {
    exportToExcel({
        materials: filteredMaterials,
        recipes: [],
        products: [],
        settings: { costo_hora_operario: 0 }, // Not needed for materials export
        datasets: ['MATERIALS'],
        filename: `materias_primas_${new Date().toISOString().slice(0,10)}.xlsx`
    });
  };

  const calculatedCostPreview = editingItem.precio_unidad_compra !== undefined && editingItem.cantidad_por_unidad_compra
    ? (editingItem.precio_unidad_compra / editingItem.cantidad_por_unidad_compra) * (editingItem.merma_factor || 1)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Materias Primas</h2>
          <p className="text-text-secondary text-sm mt-1 font-mono">DATABASE // INSUMOS & COSTOS BASE</p>
        </div>
        <div className="flex gap-3">
             {canEdit && (
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border border-border-intense bg-bg-highlight text-text-secondary rounded hover:text-white transition font-medium tracking-wide text-sm"
                    title="Exportar Filtrados"
                >
                    <Download size={16} />
                    EXPORTAR
                </button>
             )}
            {canEdit && (
                <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded hover:bg-brand-primaryHover transition shadow-[0_0_15px_rgba(255,75,125,0.3)] font-medium tracking-wide"
                >
                <Plus size={18} />
                <span>NUEVO INSUMO</span>
                </button>
            )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-bg-elevated p-4 rounded border border-border-soft">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-secondary transition-colors" size={18} />
          <input
            type="text"
            placeholder="BUSCAR ITEM..."
            className="w-full bg-bg-base pl-10 pr-4 py-2.5 border border-border-intense rounded text-text-main focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none font-mono text-sm placeholder:text-text-muted/50"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-bg-base border border-border-intense rounded text-text-main focus:border-brand-secondary outline-none font-mono text-sm"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">// TODOS LOS RUBROS</option>
          {PURCHASE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-elevated rounded border border-border-soft overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-highlight border-b border-border-intense text-xs font-mono text-text-secondary uppercase tracking-wider">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Rubro</th>
                <th className="px-6 py-4">Unidad Compra</th>
                <th className="px-6 py-4 text-right">Precio Compra</th>
                <th className="px-6 py-4 text-right text-brand-secondary">Costo Real</th>
                {canEdit && <th className="px-6 py-4 text-center">Edit</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/50 text-sm">
              {filteredMaterials.map(m => {
                const realCost = calculateMaterialCost(m);
                return (
                  <tr key={m.id} className="hover:bg-bg-highlight/50 transition-colors group">
                    <td className="px-6 py-3 font-medium text-text-main group-hover:text-white">
                        {m.nombre_item}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2 py-0.5 bg-bg-base border border-border-soft rounded text-[10px] text-text-secondary font-mono uppercase tracking-wider">
                        {m.rubro_compra}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-text-secondary font-mono text-xs">
                      {m.unidad_compra} x <span className="text-text-main">{m.cantidad_por_unidad_compra}</span>
                    </td>
                    <td className="px-6 py-3 text-right text-text-muted font-mono">
                      <div className="text-text-secondary">{formatCurrency(m.precio_unidad_compra)}</div>
                      <div className="text-[10px] opacity-60">{m.fecha_ultimo_precio}</div>
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-brand-secondary group-hover:text-brand-secondary/80">
                      {formatCurrency(realCost)} <span className="text-[10px] font-normal text-text-muted">/ {m.unidad_costos}</span>
                    </td>
                    {canEdit && (
                        <td className="px-6 py-3 text-center">
                        <button
                            onClick={() => handleEdit(m)}
                            className="text-text-muted hover:text-brand-primary transition-colors p-2"
                        >
                            <Edit2 size={16} />
                        </button>
                        </td>
                    )}
                  </tr>
                );
              })}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-6 py-12 text-center text-text-muted font-mono">
                    [ NO_DATA_FOUND ]
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elevated border border-border-intense rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-border-intense flex justify-between items-center bg-bg-highlight">
              <h3 className="font-header font-bold text-lg text-white uppercase">
                {editingItem.id ? '>> EDITAR INSUMO' : '>> NUEVO INSUMO'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-white transition">&times;</button>
            </div>
            
            <form onSubmit={saveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Nombre Item</label>
                  <input
                    required
                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                    value={editingItem.nombre_item}
                    onChange={e => setEditingItem({ ...editingItem, nombre_item: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Rubro</label>
                  <select
                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none"
                    value={editingItem.rubro_compra}
                    onChange={e => setEditingItem({ ...editingItem, rubro_compra: e.target.value })}
                  >
                    {PURCHASE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Unidad Compra</label>
                  <input
                    placeholder="Ej: BOLSA"
                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none"
                    value={editingItem.unidad_compra}
                    onChange={e => setEditingItem({ ...editingItem, unidad_compra: e.target.value.toUpperCase() })}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Cant. p/ Unidad</label>
                  <input
                    type="number" step="0.01"
                    required
                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none font-mono"
                    value={editingItem.cantidad_por_unidad_compra}
                    onChange={e => setEditingItem({ ...editingItem, cantidad_por_unidad_compra: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                   <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Merma (Factor)</label>
                   <div className="relative">
                    <input
                      type="number" step="0.01"
                      required
                      className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none font-mono"
                      value={editingItem.merma_factor}
                      onChange={e => setEditingItem({ ...editingItem, merma_factor: parseFloat(e.target.value) })}
                    />
                    <div className="absolute right-2 top-2 text-[10px] text-text-muted font-mono pointer-events-none">1.0 = 0%</div>
                   </div>
                </div>

                <div className="col-span-2 border-t border-border-intense pt-4 mt-2">
                   <label className="block text-xs font-mono text-brand-secondary mb-1 uppercase">Precio Compra ($)</label>
                   <input
                      type="number" step="0.01"
                      required
                      className="w-full bg-bg-base border border-brand-secondary/30 rounded px-4 py-3 text-lg font-mono font-bold text-white outline-none focus:border-brand-secondary"
                      value={editingItem.precio_unidad_compra}
                      onChange={e => setEditingItem({ 
                        ...editingItem, 
                        precio_unidad_compra: parseFloat(e.target.value),
                        fecha_ultimo_precio: new Date().toISOString().split('T')[0]
                      })}
                    />
                </div>
              </div>

              <div className="bg-bg-base border border-border-intense rounded p-3 flex items-start gap-3 mt-4">
                <CheckCircle className="text-brand-secondary mt-1" size={16} />
                <div>
                  <p className="text-xs text-text-secondary font-mono uppercase">Costo Calculado</p>
                  <p className="text-xl font-mono font-bold text-brand-secondary">
                    {formatCurrency(calculatedCostPreview)} 
                    <span className="text-xs font-sans font-normal text-text-muted ml-1">/ {editingItem.unidad_costos}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border border-border-intense text-text-secondary rounded hover:bg-bg-highlight font-medium transition-colors"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primaryHover font-medium shadow-[0_0_10px_rgba(255,75,125,0.2)] transition-colors tracking-wide"
                >
                  GUARDAR DATOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};