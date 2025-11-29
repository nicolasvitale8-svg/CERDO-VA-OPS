
import React, { useMemo, useState } from 'react';
import { FinalProduct, Recipe, RawMaterial, GlobalSettings } from '../types';
import { calculateProductStats, formatCurrency, formatDecimal } from '../services/calcService';
import { Plus, Search, Tag, Box, ArrowRight, AlertTriangle, Filter } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';

interface Props {
  products: FinalProduct[];
  recipes: Recipe[];
  materials: RawMaterial[];
  settings: GlobalSettings;
  onSelectProduct: (p: FinalProduct) => void;
  onCreateProduct: () => void;
}

export const FinalProductsView: React.FC<Props> = ({ products, recipes, materials, settings, onSelectProduct, onCreateProduct }) => {
  const [filterRubro, setFilterRubro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState(false); // New state for risk filtering

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesRubro = filterRubro ? p.tipo_producto === filterRubro : true;
        const matchesSearch = p.nombre_producto_final.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesRisk = true;
        if (filterRisk) {
            const recipe = recipes.find(r => r.id === p.receta_id);
            if (recipe) {
                const stats = calculateProductStats(p, recipe, materials, settings);
                // Risk threshold: Margin < 20%
                matchesRisk = stats.margen_real_pct < 20;
            } else {
                matchesRisk = false;
            }
        }

        return matchesSearch && matchesRubro && matchesRisk;
    });
  }, [products, filterRubro, searchTerm, filterRisk, recipes, materials, settings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
            <div>
                <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Productos Finales</h2>
                <p className="text-text-secondary text-sm mt-1 font-mono">CATÁLOGO DE VENTA // PRECIOS & MÁRGENES</p>
            </div>
            <button
                onClick={onCreateProduct}
                className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded hover:bg-brand-primaryHover transition shadow-[0_0_15px_rgba(255,75,125,0.3)] font-medium tracking-wide"
            >
                <Plus size={18} />
                <span>NUEVO PRODUCTO</span>
            </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-bg-elevated p-4 rounded border border-border-soft">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-secondary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="BUSCAR PRODUCTO..."
                    className="w-full bg-bg-base pl-10 pr-4 py-2.5 border border-border-intense rounded text-text-main focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none font-mono text-sm placeholder:text-text-muted/50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Risk Filter Toggle */}
            <button
                onClick={() => setFilterRisk(!filterRisk)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded border transition-all text-sm font-bold uppercase tracking-wider ${
                    filterRisk 
                    ? 'bg-status-error/20 border-status-error text-status-error shadow-[0_0_10px_rgba(249,115,115,0.2)]' 
                    : 'bg-bg-base border-border-intense text-text-muted hover:text-white'
                }`}
            >
                <AlertTriangle size={16} />
                {filterRisk ? 'MOSTRANDO RIESGO' : 'VER RIESGO'}
            </button>

            <div className="flex items-center gap-2 overflow-x-auto border-l border-border-soft pl-4">
                <button
                    onClick={() => setFilterRubro('')}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all ${!filterRubro ? 'bg-text-main text-bg-base' : 'text-text-muted border-border-intense'}`}
                >
                    TODOS
                </button>
                {PRODUCT_CATEGORIES.map(c => (
                    <button
                        key={c}
                        onClick={() => setFilterRubro(c)}
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filterRubro === c ? 'bg-brand-secondary text-bg-base border-brand-secondary' : 'text-text-muted border-border-intense'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>

        {/* Table */}
        <div className="bg-bg-elevated rounded border border-border-soft overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-bg-highlight border-b border-border-intense text-xs font-mono text-text-secondary uppercase tracking-wider">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Base (Pastón)</th>
                            <th className="px-6 py-4 text-center">Formato</th>
                            <th className="px-6 py-4 text-right text-text-muted">Costo Paq.</th>
                            <th className="px-6 py-4 text-right text-brand-secondary">Precio Venta (Neto)</th>
                            <th className="px-6 py-4 text-center">Margen</th>
                            <th className="px-4 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-soft/50 text-sm">
                        {filteredProducts.map(p => {
                            const recipe = recipes.find(r => r.id === p.receta_id);
                            if (!recipe) return null;
                            const stats = calculateProductStats(p, recipe, materials, settings);

                            const isRisky = stats.margen_real_pct < 20;
                            const marginColor = stats.margen_real_pct < 15 ? 'text-status-error' : stats.margen_real_pct < 25 ? 'text-status-warning' : 'text-status-ok';
                            const rowClass = isRisky 
                                ? 'bg-status-error/5 hover:bg-status-error/10 border-l-2 border-status-error' 
                                : 'hover:bg-bg-highlight/50 border-l-2 border-transparent';

                            return (
                                <tr key={p.id} className={`${rowClass} transition-colors group cursor-pointer`} onClick={() => onSelectProduct(p)}>
                                    <td className="px-6 py-3">
                                        <div className="font-bold text-white group-hover:text-brand-secondary transition-colors flex items-center gap-2">
                                            {p.nombre_producto_final}
                                            {isRisky && <AlertTriangle size={14} className="text-status-error" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-bg-base border border-border-soft px-1.5 rounded text-text-muted uppercase font-mono">{p.tipo_producto}</span>
                                            {p.fecha_ultima_modificacion && <span className="text-[10px] text-text-muted font-mono ml-2">UPD: {p.fecha_ultima_modificacion}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-text-secondary text-xs">
                                        {recipe.nombre_producto}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="text-xs font-mono text-text-main">
                                            {formatDecimal(p.peso_unitario_kg * 1000, 0)}g
                                        </div>
                                        <div className="text-[10px] text-text-muted">
                                            x {p.unidades_por_paquete} ({p.tipo_paquete})
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-text-muted">
                                        {formatCurrency(stats.costo_total_paquete)}
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-white text-lg">
                                        {formatCurrency(stats.precio_real_neto)}
                                        {p.usa_precio_real_custom && (
                                            <div className="text-[8px] text-brand-secondary uppercase">Custom</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center font-mono font-bold">
                                        <span className={`px-2 py-1 rounded bg-bg-base border border-border-soft ${marginColor}`}>
                                            {formatDecimal(stats.margen_real_pct, 1)}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-text-muted group-hover:text-white">
                                        <ArrowRight size={16} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
        </div>
    </div>
  );
};
