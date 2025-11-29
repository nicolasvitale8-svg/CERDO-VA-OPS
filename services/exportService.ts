
import * as XLSX from 'xlsx';
import { RawMaterial, Recipe, FinalProduct, GlobalSettings } from '../types';
import { calculateRecipeStats, calculateProductStats, calculateMaterialCost } from './calcService';

export interface ExportDataParams {
  materials: RawMaterial[];
  recipes: Recipe[];
  products: FinalProduct[];
  settings: GlobalSettings;
  datasets: string[]; // 'MATERIALS' | 'RECIPES' | 'RECIPE_DETAILS' | 'PRODUCTS' | 'PACKAGING' | 'LABOR'
  filename?: string;
}

export const exportToExcel = (params: ExportDataParams) => {
  const { materials, recipes, products, settings, datasets } = params;
  const wb = XLSX.utils.book_new();

  // 1. Materials
  if (datasets.includes('MATERIALS')) {
    const data = materials.map(m => ({
      id: m.id,
      Rubro: m.rubro_compra,
      Item: m.nombre_item,
      'Unidad Compra': m.unidad_compra,
      'Cant/Unidad': m.cantidad_por_unidad_compra,
      'Merma (Factor)': m.merma_factor,
      'Ultimo Precio': m.fecha_ultimo_precio,
      'Precio Compra': m.precio_unidad_compra,
      'Unidad Costos': m.unidad_costos,
      'Precio p/ Costos': calculateMaterialCost(m),
      'Es Empaque': ['PACKAGING', 'EMPAQUE'].includes(m.rubro_compra) ? 'SI' : 'NO'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "MateriasPrimas");
  }

  // 2. Recipes
  if (datasets.includes('RECIPES')) {
    const data = recipes.map(r => {
      const stats = calculateRecipeStats(r, materials, settings);
      return {
        id: r.id,
        Linea: r.linea,
        Rubro: r.rubro_producto,
        Nombre: r.nombre_producto,
        'Rinde Mix (kg)': stats.rinde_kg,
        'Costo MP/kg': stats.costo_mp_por_kg,
        'Costo MO/kg': stats.costo_mo_por_kg,
        'Costo Total/kg': stats.costo_por_kg,
        'Min. Lote': r.minutos_totales_paston_lote,
        'Operarios': r.operarios_equivalentes_paston,
        'Ultima Mod': r.fecha_ultima_modificacion
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "RecetasBase");
  }

  // 3. Recipe Details
  if (datasets.includes('RECIPE_DETAILS')) {
    const data: any[] = [];
    recipes.forEach(r => {
      const stats = calculateRecipeStats(r, materials, settings);
      r.ingredientes.forEach(ing => {
        const mat = materials.find(m => m.id === ing.materia_prima_id);
        const lineCost = mat ? calculateMaterialCost(mat) * ing.cantidad_en_um_costos : 0;
        const weightPct = stats.rinde_kg > 0 ? (ing.cantidad_en_um_costos / stats.rinde_kg) : 0;
        
        data.push({
          receta_id: r.id,
          'Nombre Receta': r.nombre_producto,
          materia_prima_id: ing.materia_prima_id,
          'Nombre Insumo': mat?.nombre_item || 'N/A',
          'Cantidad (kg)': ing.cantidad_en_um_costos,
          'Costo Linea': lineCost,
          '% Peso': weightPct
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "DetalleRecetas");
  }

  // 4. Products
  if (datasets.includes('PRODUCTS')) {
    const data = products.map(p => {
      const r = recipes.find(rec => rec.id === p.receta_id);
      if (!r) return null;
      const stats = calculateProductStats(p, r, materials, settings);
      return {
        id: p.id,
        'Nombre Producto': p.nombre_producto_final,
        'Tipo': p.tipo_producto,
        'Receta Base': r.nombre_producto,
        'Peso Un (kg)': p.peso_unitario_kg,
        'Un/Paq': p.unidades_por_paquete,
        'Peso Paq (kg)': stats.peso_total_paquete_kg,
        'Costo MP/Un': stats.costo_unitario_mp,
        'Costo MO/Un': stats.costo_unitario_mo_total,
        'Costo Empaque/Paq': stats.costo_paquete_empaque,
        'Costo Total Paq': stats.costo_total_paquete,
        'Costo Equiv kg': stats.costo_por_kg_equivalente,
        'Precio Sugerido Neto': stats.precio_sugerido_neto,
        'Precio Real Neto': stats.precio_real_neto,
        'Margen Real %': stats.margen_real_pct,
        'Activo': p.activo ? 'SI' : 'NO'
      };
    }).filter(Boolean);
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "ProductosFinales");
  }

  // 5. Packaging Details
  if (datasets.includes('PACKAGING')) {
    const data: any[] = [];
    products.forEach(p => {
       if (p.empaque_items) {
         p.empaque_items.forEach(pkg => {
           const mat = materials.find(m => m.id === pkg.materia_prima_id);
           const costUnit = mat ? calculateMaterialCost(mat) : 0;
           data.push({
             producto_id: p.id,
             'Nombre Producto': p.nombre_producto_final,
             insumo_id: pkg.materia_prima_id,
             'Nombre Insumo': mat?.nombre_item || 'N/A',
             'Cant/Paquete': pkg.cantidad,
             'Costo Unit Insumo': costUnit,
             'Costo Linea': costUnit * pkg.cantidad
           });
         });
       }
       if (p.costo_empaque_extra) {
          data.push({
             producto_id: p.id,
             'Nombre Producto': p.nombre_producto_final,
             insumo_id: 'MANUAL',
             'Nombre Insumo': 'EXTRA MANUAL',
             'Cant/Paquete': 1,
             'Costo Unit Insumo': p.costo_empaque_extra,
             'Costo Linea': p.costo_empaque_extra
          });
       }
    });
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "ProductoEmpaque");
  }

  // 6. Labor
  if (datasets.includes('LABOR')) {
    const data = [{
      'Parametro': 'Costo Hora Operario',
      'Valor': settings.costo_hora_operario
    }, {
      'Parametro': 'Costo Minuto Operario',
      'Valor': settings.costo_hora_operario / 60
    }];
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "ManoDeObra");
  }

  // Download
  const fileName = params.filename || `pork-lab-export_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
