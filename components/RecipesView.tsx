
import React, { useMemo } from 'react';
import { RawMaterial, Recipe, GlobalSettings } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';
import { calculateRecipeStats, formatCurrency, formatDecimal } from '../services/calcService';
import { Plus, ChefHat, Activity, Database } from 'lucide-react';

interface Props {
  recipes: Recipe[];
  materials: RawMaterial[];
  settings: GlobalSettings;
  onSelectRecipe: (r: Recipe) => void;
  onCreateRecipe: () => void;
}

// Category Color Mapping
const getCategoryColor = (cat: string) => {
  switch(cat) {
    case 'BIFES': return 'text-[#38E0FF] bg-[#38E0FF]/10 border-[#38E0FF]/20';
    case 'HAMBURGUESAS': return 'text-[#FF4B7D] bg-[#FF4B7D]/10 border-[#FF4B7D]/20';
    case 'MEDALLONES': return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20';
    case 'MILANESAS': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
    default: return 'text-text-secondary bg-bg-highlight border-border-soft';
  }
};

export const RecipesView: React.FC<Props> = ({ recipes, materials, settings, onSelectRecipe, onCreateRecipe }) => {
  const [filterRubro, setFilterRubro] = React.useState('');

  const displayedRecipes = useMemo(() => {
    return recipes.filter(r => filterRubro ? r.rubro_producto === filterRubro : true);
  }, [recipes, filterRubro]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Recetas Base</h2>
          <p className="text-text-secondary text-sm mt-1 font-mono">PASTONES // MEZCLAS & COSTOS DE MASA</p>
        </div>
        <button
          onClick={onCreateRecipe}
          className="flex items-center gap-2 bg-bg-highlight border border-brand-secondary/50 text-brand-secondary px-5 py-2.5 rounded hover:bg-brand-secondary/10 transition font-medium tracking-wide"
        >
          <Plus size={18} />
          <span>NUEVA RECETA BASE</span>
        </button>
      </div>

       {/* Filters */}
       <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setFilterRubro('')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                !filterRubro 
                ? 'bg-text-main text-bg-base border-text-main' 
                : 'bg-transparent text-text-muted border-border-intense hover:border-text-secondary'
            }`}
          >
            ALL
          </button>
          {PRODUCT_CATEGORIES.map(c => (
             <button
             key={c}
             onClick={() => setFilterRubro(c)}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                 filterRubro === c
                 ? getCategoryColor(c) + ' shadow-[0_0_10px_currentColor]'
                 : 'bg-transparent text-text-muted border-border-intense hover:border-text-secondary'
             }`}
           >
             {c}
           </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRecipes.map(recipe => {
          const stats = calculateRecipeStats(recipe, materials, settings);
          const categoryStyle = getCategoryColor(recipe.rubro_producto);
          
          return (
            <div 
              key={recipe.id} 
              className="bg-bg-elevated rounded border border-border-soft hover:border-brand-secondary/50 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
              onClick={() => onSelectRecipe(recipe)}
            >
              {/* Status Line */}
              <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${recipe.activo ? 'bg-status-ok' : 'bg-border-intense'}`}></div>

              <div className="p-5 border-b border-border-soft bg-gradient-to-r from-bg-highlight to-transparent">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-widest ${categoryStyle}`}>
                    {recipe.rubro_producto}
                  </span>
                  <div className="flex gap-1">
                      {recipe.activo && <div className="w-2 h-2 rounded-full bg-status-ok shadow-[0_0_5px_#22C55E]"></div>}
                  </div>
                </div>
                <h3 className="text-lg font-header font-bold text-white group-hover:text-brand-secondary transition-colors truncate flex items-center gap-2">
                  <Database size={16} className="text-text-muted opacity-50"/>
                  {recipe.nombre_producto}
                </h3>
                <p className="text-[10px] font-mono text-text-muted mt-1 ml-6">
                  LAST_MOD: {recipe.fecha_ultima_modificacion || new Date(recipe.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-5 grid grid-cols-2 gap-4 flex-grow items-end">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-mono mb-1">Rinde Mix</p>
                  <p className="font-mono font-bold text-text-main">{formatDecimal(stats.rinde_kg)} <span className="text-xs font-normal text-text-muted">kg</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-mono mb-1">Costo Mix / KG</p>
                  <p className="font-mono font-bold text-brand-secondary text-xl">{formatCurrency(stats.costo_por_kg)}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State Action */}
        <button 
          onClick={onCreateRecipe}
          className="border border-dashed border-border-intense rounded bg-bg-elevated/50 flex flex-col items-center justify-center text-text-muted hover:border-brand-primary/50 hover:text-brand-primary hover:bg-bg-highlight transition h-full min-h-[200px]"
        >
          <ChefHat size={32} className="mb-3 opacity-70" />
          <span className="font-mono text-sm tracking-widest">>> CREAR RECETA BASE</span>
        </button>
      </div>
    </div>
  );
};
