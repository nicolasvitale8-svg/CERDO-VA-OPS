
// Domain Models

export interface GlobalSettings {
  costo_hora_operario: number;
}

export type UserRole = 'ADMIN' | 'COSTOS' | 'PRODUCCION' | 'LECTURA';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  password_hash: string; // In a real app this is hashed. Here we simulate.
  activo: boolean;
  ultimo_login?: string;
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

// --- TECHNICAL DATA SHEET (FICHA TÉCNICA) ---
export interface CriticalParameter {
    id: string;
    control: string; // e.g. "Tiempo de mezclado"
    limite_criterio: string; // e.g. "<= 2 min"
    accion_correctiva: string; // e.g. "Detener y enfriar"
}

export interface TechnicalDataSheet {
    id: string;
    receta_id: string; // One-to-one with Recipe
    codigo: string; // e.g. "CERDOVA-FT-PST-CER-001"
    version: string; // e.g. "v1.0"
    vigencia: string; // Date string
    area: string; // e.g. "Producción / Molienda"
    responsable: string; // e.g. "Jefe de Producción"
    verificador: string; // e.g. "Calidad"
    base_lote_kg: number; // e.g. 20.00
    
    // Section 1: BOM Extra Info (Observations per ingredient)
    // Key: ingredient_id, Value: observation string
    bom_observaciones: Record<string, string>; 
    nota_critica_bom: string;

    // Section 2: Process
    sop_referencia: string; // e.g. "SOP MOL-MEZ-001 v0.3.0"
    texto_proceso: string; // Markdown/Text area

    // Section 3: Critical Params
    parametros_criticos: CriticalParameter[];

    // Section 4: Conservation
    texto_conservacion: string;
}

// Helper types for View logic
export type ViewState = 'LOGIN' | 'DASHBOARD' | 'RAW_MATERIALS' | 'RECIPES' | 'RECIPE_DETAIL' | 'SCALER' | 'FINAL_PRODUCTS' | 'FINAL_PRODUCT_DETAIL' | 'LABOR' | 'USERS' | 'TOOLS' | 'TECH_SHEET_DETAIL' | 'MANUAL';

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