
// Domain Models

export interface GlobalSettings {
  costo_hora_operario: number;
}

export interface RawMaterial {
  id: string;
  rubro_compra: string; // e.g., ALMACÉN, FRIGORÍFICO
  nombre_item: string;
  unidad_compra: string; // e.g., BOLSA, CAJA
  cantidad_por_unidad_compra: number; // e.g., 25 (kg per bag)
  merma_factor: number; // e.g., 1.0 or 1.02
  fecha_ultimo_precio: string; // ISO Date
  precio_unidad_compra: number; // The price of the bag/box
  unidad_costos: string; // Usually 'KG'
  // Calculated property logic: (precio_unidad_compra / cantidad_por_unidad_compra) * merma_factor
}

export interface Ingredient {
  id: string;
  receta_id: string;
  materia_prima_id: string;
  cantidad_en_um_costos: number; // Kilos used in the recipe
  orden_visual: number;
}

export interface PackagingIngredient {
  id: string;
  materia_prima_id: string;
  cantidad: number; // Units per package (e.g., 1 bag, 2 labels)
}

export interface Recipe {
  id: string;
  linea: string; // "CERDO VA!"
  rubro_producto: string; // BIFES, HAMBURGUESAS, etc.
  nombre_producto: string;
  fecha_creacion: string;
  fecha_ultima_modificacion?: string;
  peso_unitario_kg: number; // DEPRECATED in favor of FinalProduct logic
  activo: boolean;
  ingredientes: Ingredient[];
  
  // Labor Stage 1: Pastón
  minutos_totales_paston_lote?: number;
  operarios_equivalentes_paston?: number;
}

export type PricingMethod = 'POR_PAQUETE' | 'POR_KG';

export interface FinalProduct {
  id: string;
  receta_id: string; // Link to the Base Recipe (Pastón)
  nombre_producto_final: string;
  tipo_producto: string; // BIFE, HAMBURGUESA, MEDALLON, MILANESA
  peso_unitario_kg: number; // e.g., 0.100
  unidades_por_paquete: number; // e.g., 10
  tipo_paquete: string; // BOLSA, CAJA, BANDEJA
  
  // Packaging Logic
  empaque_items: PackagingIngredient[];
  costo_empaque_extra: number; // Manual extra cost (optional)

  // Pricing Strategy
  metodo_precio: PricingMethod;
  coeficiente_sugerido: number; // e.g. 1.35 (35% markup)
  iva_pct: number; // e.g. 21
  precio_venta_real_neto?: number; // Optional, defaults to suggested if null
  usa_precio_real_custom: boolean; // True if user manually edited the price

  activo: boolean;
  fecha_ultima_modificacion?: string;

  // Labor Stage 2: Formado
  kg_formados_por_hora?: number;
  operarios_equiv_formado?: number;
  min_fijos_formado_lote?: number;
  kg_paston_lote_formado?: number;

  // Labor Stage 3: Empaque
  paquetes_por_hora?: number;
  operarios_equiv_empaque?: number;
  min_fijos_empaque_lote?: number;
  paquetes_lote_empaque?: number;
}

// Helper types for View logic
export type ViewState = 'DASHBOARD' | 'RAW_MATERIALS' | 'RECIPES' | 'RECIPE_DETAIL' | 'SCALER' | 'FINAL_PRODUCTS' | 'FINAL_PRODUCT_DETAIL' | 'LABOR';

export interface CalculatedRecipeStats {
  rinde_kg: number;
  
  // Cost breakdown
  costo_mp_total: number;
  costo_mo_total: number;
  
  // Totals
  costo_total_receta: number; // MP + MO
  costo_por_kg: number; // (MP + MO) / Rinde
  
  // Per KG Breakdown
  costo_mp_por_kg: number;
  costo_mo_por_kg: number;
}

export interface CalculatedProductStats {
  // Base stats
  base_receta_costo_kg: number;
  base_receta_costo_mp_kg: number;
  base_receta_costo_mo_kg: number;

  // Unit Breakdown
  costo_unitario_mp: number; // Materia Prima per unit
  costo_unitario_mo_paston: number; // Labor from Stage 1 per unit
  costo_unitario_mo_formado: number; // Labor Stage 2 per unit
  costo_unitario_mo_empaque: number; // Labor Stage 3 per unit
  
  costo_unitario_mo_total: number; // Sum of all MO per unit
  costo_unitario_total: number; // MP + MO Total

  // Package Breakdown
  peso_total_paquete_kg: number;
  costo_paquete_mp: number;
  costo_paquete_mo_total: number;
  costo_paquete_empaque: number; // Material empaque (box/bag)
  
  costo_total_paquete: number; // MP + MO + Empaque Material
  costo_por_kg_equivalente: number;

  // Pricing Stats
  costo_base_precio: number; // The cost used for markup (Per Pkg or Per Kg)
  precio_sugerido_neto: number;
  precio_sugerido_iva: number;
  precio_real_neto: number;
  precio_real_iva: number;
  margen_real_pct: number;
}