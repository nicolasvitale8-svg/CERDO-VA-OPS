
import React, { useMemo, useState } from 'react';
import { FinalProduct, Recipe, RawMaterial, GlobalSettings, CalculatedProductStats, User } from '../types';
import { calculateProductStats, formatCurrency, formatDecimal } from '../services/calcService';
import { canViewFinancials } from '../services/authService';
import { PRODUCT_CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle, ArrowRight, DollarSign, Package, Lock } from 'lucide-react';

interface Props {
  products: FinalProduct[];
  recipes: Recipe[];
  materials: RawMaterial[];
  settings: GlobalSettings;
  currentUser: User;
  onNavigateToProduct: (p: FinalProduct) => void;
  onNavigateToRecipe: (rId: string) => void;
  onNavigateToMaterial: (mId: string) => void;
  onViewAllProducts: () => void;
}

export const DashboardView: React.FC<Props> = ({ 
    products, recipes, materials, settings, currentUser,
    onNavigateToProduct, onNavigateToRecipe, onNavigateToMaterial, onViewAllProducts 
}) => {
  const [filterRubro, setFilterRubro] = useState('TODOS');
  const showFinancials = canViewFinancials(currentUser.rol);
  
  // 1. Prepare Data
  const dashboardData = useMemo(() => {
    let filtered = products;
    if (filterRubro !== 'TODOS') {
        filtered = products.filter(p => p.tipo_producto === filterRubro);
    }
    // Only active products typically matter for dashboards
    filtered = filtered.filter(p => p.activo);

    const statsMap = new Map<string, CalculatedProductStats>();
    
    let totalCostKgAccum = 0;
    let totalWeightAccum = 0;
    let totalMarginAccum = 0;
    
    // Components Accumulators for Avg Structure
    let totalMP = 0;
    let totalMO = 0;
    let totalPkg = 0;

    // Risk Counter
    let lowMarginCount = 0;
    const marginThreshold = 20; // 20%

    // Data Health
    const recipesWithoutLabor = recipes.filter(r => !r.minutos_totales_paston_lote).length;
    const materialsWithoutPrice = materials.filter(m => m.precio_unidad_compra <= 0).length;
    const productsWithoutPkg = products.filter(p => !p.empaque_items || p.empaque_items.length === 0).length;

    filtered.forEach(p => {
        const recipe = recipes.find(r => r.id === p.receta_id);
        if (recipe) {
            const stats = calculateProductStats(p, recipe, materials, settings);
            statsMap.set(p.id, stats);

            // Weighted Avg Cost / Kg
            const pkgWeight = stats.peso_total_paquete_kg;
            totalCostKgAccum += stats.costo_por_kg_equivalente * pkgWeight;
            totalWeightAccum += pkgWeight;

            // Simple Avg Margin (could be weighted by revenue, but simple is often safer for operational view)
            totalMarginAccum += stats.margen_real_pct;

            // Structure Breakdown
            totalMP += stats.costo_paquete_mp;
            totalMO += stats.costo_paquete_mo_total;
            totalPkg += stats.costo_paquete_empaque;

            if (stats.margen_real_pct < marginThreshold) lowMarginCount++;
        }
    });

    const count = filtered.length;
    const avgCostKg = totalWeightAccum > 0 ? totalCostKgAccum / totalWeightAccum : 0;
    const avgMargin = count > 0 ? totalMarginAccum / count : 0;

    // Chart Data: Structure
    const totalCostSum = totalMP + totalMO + totalPkg;
    const structureData = totalCostSum > 0 ? [
        { name: 'Mat. Prima', value: totalMP, color: '#38E0FF' }, // Brand Secondary
        { name: 'Mano de Obra', value: totalMO, color: '#FF4B7D' }, // Brand Primary
        { name: 'Empaque', value: totalPkg, color: '#FACC15' }, // Yellow
    ] : [];

    // Chart Data: Margin by Category
    const marginByCat = PRODUCT_CATEGORIES.map(cat => {
        const catProducts = products.filter(p => p.tipo_producto === cat && p.activo);
        const catTotalMargin = catProducts.reduce((acc, p) => {
            const r = recipes.find(rec => rec.id === p.receta_id);
            if (!r) return acc;
            const s = calculateProductStats(p, r, materials, settings);
            return acc + s.margen_real_pct;
        }, 0);
        const avg = catProducts.length > 0 ? catTotalMargin / catProducts.length : 0;
        return { name: cat, margin: avg };
    });

    // Alerts
    const alerts = [];
    if (showFinancials) {
        filtered.forEach(p => {
            const s = statsMap.get(p.id);
            if (s && s.margen_real_pct < 15) {
                alerts.push({ type: 'CRITICAL', msg: `Margen crítico (${formatDecimal(s.margen_real_pct, 1)}%)`, item: p.nombre_producto_final, id: p.id, entity: 'PRODUCT' });
            }
        });
    }
    if (materialsWithoutPrice > 0) alerts.push({ type: 'WARN', msg: `${materialsWithoutPrice} insumos sin precio`, item: 'Base de Datos', id: '', entity: 'MATERIAL_DB' });

    return {
        count,
        avgCostKg,
        avgMargin,
        lowMarginCount,
        dataHealth: { recipesWithoutLabor, materialsWithoutPrice, productsWithoutPkg },
        structureData,
        marginByCat,
        alerts,
        filtered
    };

  }, [products, recipes, materials, settings, filterRubro, showFinancials]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Global Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft pb-4">
         <div>
            <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Dashboard</h2>
            <p className="text-text-secondary text-sm mt-1 font-mono">PANEL DE CONTROL // KPIs & ALERTAS</p>
         </div>
         <div className="flex items-center gap-2 overflow-x-auto bg-bg-elevated p-1 rounded border border-border-intense">
            {['TODOS', ...PRODUCT_CATEGORIES].map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilterRubro(cat)}
                    className={`px-4 py-2 rounded text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                        filterRubro === cat 
                        ? 'bg-brand-secondary text-bg-base shadow-[0_0_10px_rgba(56,224,255,0.4)]' 
                        : 'text-text-muted hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
         </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI 1: Cost Avg */}
          <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group hover:border-brand-secondary/50 transition">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest">Costo Prom. / KG</h3>
                  <DollarSign size={16} className="text-brand-secondary" />
              </div>
              {showFinancials ? (
                <div className="text-3xl font-header font-bold text-white mb-2">
                    {formatCurrency(dashboardData.avgCostKg)}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-text-muted mb-2">
                    <Lock size={20} /> <span className="text-sm font-mono">RESTRICTED</span>
                </div>
              )}
              <p className="text-[10px] text-text-muted font-mono">
                  Promedio ponderado global
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-transparent opacity-50"></div>
          </div>

          {/* KPI 2: Margin */}
          <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group hover:border-brand-primary/50 transition">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest">Margen Promedio</h3>
                  {showFinancials ? (
                    <TrendingUp size={16} className={dashboardData.avgMargin >= 25 ? 'text-status-ok' : 'text-status-warning'} />
                  ) : (
                    <Lock size={16} className="text-text-muted" />
                  )}
              </div>
              {showFinancials ? (
                  <>
                    <div className={`text-3xl font-header font-bold mb-2 ${dashboardData.avgMargin >= 25 ? 'text-status-ok' : 'text-status-warning'}`}>
                        {formatDecimal(dashboardData.avgMargin, 1)}%
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-bg-highlight px-1.5 py-0.5 rounded text-text-muted font-mono border border-border-intense">OBJ: 25%</span>
                        <span className="text-[10px] text-text-muted font-mono">Real vs Objetivo</span>
                    </div>
                  </>
              ) : (
                <div className="flex items-center gap-2 text-text-muted mb-2">
                    <span className="text-sm font-mono">RESTRICTED ACCESS</span>
                </div>
              )}
          </div>

          {/* KPI 3: Risk */}
          <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden group hover:border-status-error/50 transition cursor-pointer" onClick={onViewAllProducts}>
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest">En Riesgo</h3>
                  <AlertTriangle size={16} className="text-status-error" />
              </div>
              {showFinancials ? (
                  <>
                    <div className="text-3xl font-header font-bold text-white mb-2">
                        {Math.round((dashboardData.lowMarginCount / (dashboardData.count || 1)) * 100)}%
                    </div>
                    <p className="text-[10px] text-status-error font-mono flex items-center gap-1">
                        <span className="font-bold">{dashboardData.lowMarginCount}</span> productos margen &lt; 20%
                    </p>
                  </>
              ) : (
                 <div className="text-sm text-text-muted font-mono mb-2">
                     Revise alertas operativas
                 </div>
              )}
          </div>

          {/* KPI 4: Data Health */}
          <div className="bg-bg-elevated border border-border-soft p-6 rounded relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest">Calidad Datos</h3>
                  <CheckCircle size={16} className="text-brand-secondary" />
              </div>
              <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">Insumos sin Precio</span>
                      <span className={dashboardData.dataHealth.materialsWithoutPrice > 0 ? 'text-status-warning font-bold' : 'text-status-ok'}>
                          {dashboardData.dataHealth.materialsWithoutPrice}
                      </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">Recetas sin MO</span>
                      <span className={dashboardData.dataHealth.recipesWithoutLabor > 0 ? 'text-status-warning font-bold' : 'text-status-ok'}>
                          {dashboardData.dataHealth.recipesWithoutLabor}
                      </span>
                  </div>
                   <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">Prod. sin Empaque</span>
                      <span className={dashboardData.dataHealth.productsWithoutPkg > 0 ? 'text-status-warning font-bold' : 'text-status-ok'}>
                          {dashboardData.dataHealth.productsWithoutPkg}
                      </span>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Charts Row */}
      {showFinancials && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart A: Structure */}
            <div className="bg-bg-elevated border border-border-soft p-6 rounded">
                <h3 className="text-xs font-header font-bold text-text-secondary uppercase mb-6 flex items-center gap-2">
                    <Package size={14} /> Estructura de Costos (Promedio)
                </h3>
                <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboardData.structureData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {dashboardData.structureData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0C1017', borderColor: '#343C4F', borderRadius: '4px', color: '#F5F7FF' }}
                                    itemStyle={{ color: '#F5F7FF', fontSize: '12px', fontFamily: 'monospace' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                            </PieChart>
                    </ResponsiveContainer>
                    {/* Legend Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-2xl font-bold text-white font-mono">
                                {formatCurrency(dashboardData.avgCostKg)}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono uppercase">Costo/Kg</span>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-[10px] font-mono text-text-secondary uppercase">
                        {dashboardData.structureData.map(d => (
                            <div key={d.name} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                {d.name}
                            </div>
                        ))}
                </div>
            </div>

            {/* Chart B: Margin by Rubro */}
            <div className="lg:col-span-2 bg-bg-elevated border border-border-soft p-6 rounded">
                <h3 className="text-xs font-header font-bold text-text-secondary uppercase mb-6 flex items-center gap-2">
                    <TrendingUp size={14} /> Margen por Rubro
                </h3>
                <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dashboardData.marginByCat}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tick={{ fill: '#A2ADC7', fontSize: 10, fontFamily: 'monospace' }} width={100} />
                                <Tooltip 
                                    cursor={{fill: '#151B26'}}
                                    contentStyle={{ backgroundColor: '#0C1017', borderColor: '#343C4F', borderRadius: '4px', color: '#F5F7FF' }}
                                    itemStyle={{ color: '#F5F7FF', fontSize: '12px', fontFamily: 'monospace' }}
                                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Margen']}
                                />
                                <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                                    {dashboardData.marginByCat.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.margin >= 25 ? '#22C55E' : entry.margin < 15 ? '#F97373' : '#FACC15'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}

      {/* 4. Alerts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-elevated border border-border-soft rounded p-6">
                <h3 className="text-xs font-header font-bold text-text-secondary uppercase mb-4 border-b border-border-intense pb-2">
                   Alertas Críticas
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {dashboardData.alerts.length === 0 ? (
                        <div className="text-sm text-text-muted font-mono flex items-center gap-2 py-4">
                            <CheckCircle size={16} className="text-status-ok"/> Sin alertas pendientes. Sistema saludable.
                        </div>
                    ) : (
                        dashboardData.alerts.map((alert, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    if(alert.entity === 'PRODUCT') {
                                        const p = products.find(prod => prod.id === alert.id);
                                        if(p) onNavigateToProduct(p);
                                    } else if (alert.entity === 'MATERIAL_DB') {
                                        onNavigateToMaterial('ALL');
                                    }
                                }}
                                className={`flex items-center justify-between bg-bg-base p-3 rounded border border-border-soft/50 group transition ${alert.entity === 'PRODUCT' ? 'cursor-pointer hover:border-status-error hover:bg-bg-highlight' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    {alert.type === 'CRITICAL' ? (
                                        <AlertCircle size={16} className="text-status-error shrink-0" />
                                    ) : (
                                        <AlertTriangle size={16} className="text-status-warning shrink-0" />
                                    )}
                                    <div>
                                        <p className={`text-xs font-bold uppercase ${alert.type === 'CRITICAL' ? 'text-white' : 'text-text-secondary'}`}>{alert.item}</p>
                                        <p className="text-[10px] text-text-muted font-mono">{alert.msg}</p>
                                    </div>
                                </div>
                                {alert.entity === 'PRODUCT' && (
                                    <button 
                                        className="text-[10px] bg-bg-highlight border border-border-intense px-2 py-1 rounded text-text-secondary group-hover:text-white group-hover:border-brand-secondary transition"
                                    >
                                        VER
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
          </div>

          <div className="bg-bg-elevated border border-border-soft rounded p-6">
                <h3 className="text-xs font-header font-bold text-text-secondary uppercase mb-4 border-b border-border-intense pb-2">
                   Accesos Rápidos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                     {showFinancials && (
                        <button 
                            onClick={onViewAllProducts}
                            className="p-4 bg-bg-base border border-border-soft rounded hover:border-brand-primary/50 group transition text-left"
                        >
                            <div className="text-brand-primary mb-2 group-hover:scale-110 transition-transform origin-left">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-xs font-bold text-white uppercase">Ver Productos Riesgo</div>
                            <div className="text-[10px] text-text-muted mt-1">Margen &lt; 20%</div>
                        </button>
                     )}
                     
                     <button 
                        onClick={() => onNavigateToMaterial('ALL')}
                        className="p-4 bg-bg-base border border-border-soft rounded hover:border-brand-secondary/50 group transition text-left"
                     >
                        <div className="text-brand-secondary mb-2 group-hover:scale-110 transition-transform origin-left">
                            <DollarSign size={24} />
                        </div>
                        <div className="text-xs font-bold text-white uppercase">Revisar Precios MP</div>
                        <div className="text-[10px] text-text-muted mt-1">Actualizar costos base</div>
                     </button>
                </div>
          </div>
      </div>

    </div>
  );
};
