
import { RawMaterial, Recipe, CalculatedRecipeStats, FinalProduct, CalculatedProductStats, GlobalSettings } from '../types';

/**
 * Calculates the cost per unit (usually KG) for a raw material
 * Logic: (Price / Qty per Unit) * Merma Factor
 */
export const calculateMaterialCost = (material: RawMaterial): number => {
  if (material.cantidad_por_unidad_compra === 0) return 0;
  return (material.precio_unidad_compra / material.cantidad_por_unidad_compra) * material.merma_factor;
};

/**
 * Calculates full recipe statistics (Materials + Labor Stage 1)
 */
export const calculateRecipeStats = (recipe: Recipe, materials: RawMaterial[], settings: GlobalSettings): CalculatedRecipeStats => {
  let costMP = 0;
  let totalWeight = 0;
  const costPerMinute = settings.costo_hora_operario / 60;

  const materialMap = new Map(materials.map(m => [m.id, m]));

  // 1. Calculate Raw Materials Cost
  recipe.ingredientes.forEach(ing => {
    const mat = materialMap.get(ing.materia_prima_id);
    if (mat) {
      const costPerUnit = calculateMaterialCost(mat);
      costMP += costPerUnit * ing.cantidad_en_um_costos;
      totalWeight += ing.cantidad_en_um_costos;
    }
  });

  // 2. Calculate Labor Cost Stage 1 (Pastón)
  const minTotales = recipe.minutos_totales_paston_lote || 0;
  const operarios = recipe.operarios_equivalentes_paston || 1;
  const minHombreLote = minTotales * operarios;
  const costMO = minHombreLote * costPerMinute;

  // 3. Totals
  const totalCost = costMP + costMO;
  const costPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
  
  return {
    rinde_kg: totalWeight,
    costo_mp_total: costMP,
    costo_mo_total: costMO,
    costo_total_receta: totalCost,
    costo_por_kg: costPerKg,
    costo_mp_por_kg: totalWeight > 0 ? costMP / totalWeight : 0,
    costo_mo_por_kg: totalWeight > 0 ? costMO / totalWeight : 0,
  };
};

/**
 * Calculates final product costs including all 3 stages of labor, packaging, and Pricing Strategy
 */
export const calculateProductStats = (product: FinalProduct, recipe: Recipe, materials: RawMaterial[], settings: GlobalSettings): CalculatedProductStats => {
    const recipeStats = calculateRecipeStats(recipe, materials, settings);
    const costPerMinute = settings.costo_hora_operario / 60;
    
    // --- STAGE 1 COST (PASTON) ---
    const baseCostKg = recipeStats.costo_por_kg;
    const unitCostMP = recipeStats.costo_mp_por_kg * product.peso_unitario_kg;
    const unitCostMO_Paston = recipeStats.costo_mo_por_kg * product.peso_unitario_kg;

    // --- STAGE 2 COST (FORMING) ---
    const kgFormadosHora = product.kg_formados_por_hora || 60;
    const kgFormadosMin = kgFormadosHora / 60;
    const opFormado = product.operarios_equiv_formado || 1;
    
    // Variable labor per kg
    const minHombreVarKg = kgFormadosMin > 0 ? (1 / kgFormadosMin) * opFormado : 0;
    
    // Fixed labor per kg
    const minFijosLote = product.min_fijos_formado_lote || 0;
    const kgLote = product.kg_paston_lote_formado || 1;
    const minHombreFijoKg = kgLote > 0 ? (minFijosLote * opFormado) / kgLote : 0;

    const minHombreTotalFormadoKg = minHombreVarKg + minHombreFijoKg;
    const costMOFormadoKg = minHombreTotalFormadoKg * costPerMinute;
    const unitCostMO_Formado = costMOFormadoKg * product.peso_unitario_kg;

    // --- STAGE 3 COST (PACKING) ---
    const paqHora = product.paquetes_por_hora || 60;
    const paqMin = paqHora / 60;
    const opEmpaque = product.operarios_equiv_empaque || 1;

    // Variable labor per package
    const minHombreVarPaq = paqMin > 0 ? (1 / paqMin) * opEmpaque : 0;

    // Fixed labor per package
    const minFijosEmpaque = product.min_fijos_empaque_lote || 0;
    const paqLote = product.paquetes_lote_empaque || 1;
    const minHombreFijoPaq = paqLote > 0 ? (minFijosEmpaque * opEmpaque) / paqLote : 0;

    const minHombreTotalPaq = minHombreVarPaq + minHombreFijoPaq;
    const costMOEmpaquePaq = minHombreTotalPaq * costPerMinute;
    const unitCostMO_Empaque = product.unidades_por_paquete > 0 ? costMOEmpaquePaq / product.unidades_por_paquete : 0;

    // --- TOTALS ---
    const unitCostMO_Total = unitCostMO_Paston + unitCostMO_Formado + unitCostMO_Empaque;
    const unitTotalCost = unitCostMP + unitCostMO_Total; // This excludes package material cost which is per package

    // --- PACKAGING MATERIALS COST ---
    let pkgIngredientsCost = 0;
    if (product.empaque_items) {
        product.empaque_items.forEach(item => {
            const mat = materials.find(m => m.id === item.materia_prima_id);
            if (mat) {
                pkgIngredientsCost += calculateMaterialCost(mat) * item.cantidad;
            }
        });
    }
    const pkgExtraCost = product.costo_empaque_extra || 0;
    const pkgCostEmpaqueMat = pkgIngredientsCost + pkgExtraCost;

    const pkgWeight = product.peso_unitario_kg * product.unidades_por_paquete;
    const pkgCostMP = unitCostMP * product.unidades_por_paquete;
    const pkgCostMO = unitCostMO_Total * product.unidades_por_paquete;
    
    const pkgTotalCost = pkgCostMP + pkgCostMO + pkgCostEmpaqueMat;
    const pkgEquivalentCostKg = pkgWeight > 0 ? pkgTotalCost / pkgWeight : 0;

    // --- PRICING STRATEGY ---
    const costoBasePrecio = product.metodo_precio === 'POR_KG' 
        ? pkgEquivalentCostKg 
        : pkgTotalCost;

    const precioSugeridoNeto = costoBasePrecio * (product.coeficiente_sugerido || 1);
    const precioSugeridoIVA = precioSugeridoNeto * (1 + (product.iva_pct || 21)/100);

    // If custom price is not used, real price follows suggested price
    const precioRealNeto = product.usa_precio_real_custom && product.precio_venta_real_neto !== undefined
        ? product.precio_venta_real_neto
        : precioSugeridoNeto;
    
    const precioRealIVA = precioRealNeto * (1 + (product.iva_pct || 21)/100);

    // Real Margin Calculation
    // Margin % = (Price - Cost) / Price
    const margenRealPct = precioRealNeto > 0 
        ? ((precioRealNeto - costoBasePrecio) / precioRealNeto) * 100
        : 0;

    return {
        base_receta_costo_kg: baseCostKg,
        base_receta_costo_mp_kg: recipeStats.costo_mp_por_kg,
        base_receta_costo_mo_kg: recipeStats.costo_mo_por_kg,

        costo_unitario_mp: unitCostMP,
        costo_unitario_mo_paston: unitCostMO_Paston,
        costo_unitario_mo_formado: unitCostMO_Formado,
        costo_unitario_mo_empaque: unitCostMO_Empaque,
        
        costo_unitario_mo_total: unitCostMO_Total,
        costo_unitario_total: unitTotalCost,

        peso_total_paquete_kg: pkgWeight,
        costo_paquete_mp: pkgCostMP,
        costo_paquete_mo_total: pkgCostMO,
        costo_paquete_empaque: pkgCostEmpaqueMat,
        
        costo_total_paquete: pkgTotalCost,
        costo_por_kg_equivalente: pkgEquivalentCostKg,

        // Pricing
        costo_base_precio: costoBasePrecio,
        precio_sugerido_neto: precioSugeridoNeto,
        precio_sugerido_iva: precioSugeridoIVA,
        precio_real_neto: precioRealNeto,
        precio_real_iva: precioRealIVA,
        margen_real_pct: margenRealPct
    };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(val);
};

export const formatDecimal = (val: number, digits = 3) => {
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: digits, 
    maximumFractionDigits: digits 
  }).format(val);
};
