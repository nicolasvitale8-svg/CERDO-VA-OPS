
import { RawMaterial, Recipe, FinalProduct, GlobalSettings } from './types';

export const INITIAL_SETTINGS: GlobalSettings = {
  costo_hora_operario: 5000,
};

export const INITIAL_MATERIALS: RawMaterial[] = [
  // --- ADITIVOS ---
  {
    id: 'rm-dybatter',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'DYBATTER X 25 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 25,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 414158.80,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-dypro-500',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'DYPRO-500 X 20 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 120966.73,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-mil-100-hr',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'MIL 100 HR X 20 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 411373.38,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-mil-100-v',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'MIL 100 V X 20 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 411373.38,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-dynugget',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'DYNUGGET X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 19148.86,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-ssg',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'SSG X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 34231.75,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-ssh-parrillera',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'SSH PARRILLERA X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 30105.77,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-dg-20-plus',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'DG-20 PLUS X 20 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 165286.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-stall001',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'STALL001',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-11-26',
    precio_unidad_compra: 50000.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-fecula-papa',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'FECULA DE PAPA X 25 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 25,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-11-26',
    precio_unidad_compra: 137390.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-fecula-mandioca',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'FECULA DE MANDIOCA',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 25,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-11-26',
    precio_unidad_compra: 50124.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-sal-entrefina',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'SAL ENTRE FINA SECA X 25 KG',
    unidad_compra: 'BOLSA',
    cantidad_por_unidad_compra: 25,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-11-26',
    precio_unidad_compra: 8900.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-glutamato',
    rubro_compra: 'ADITIVOS',
    nombre_item: 'GLUTAMATO MONOSODICO X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-29',
    precio_unidad_compra: 16451.61, // Derived from recipe cost
    unidad_costos: 'KG'
  },

  // --- FRIGORÍFICO ---
  {
    id: 'rm-carne-primera',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'CARNE DE PRIMERA',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 10500.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-carne-primera-rojo',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'CARNE DE PRIMERA ROJO',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-29',
    precio_unidad_compra: 5800.00, // Derived from recipe
    unidad_costos: 'KG'
  },
  {
    id: 'rm-carne-segunda',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'CARNE DE SEGUNDA',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 4750.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-pollo-mecanizada',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'POLLO MECANIZADA CMS X KG',
    unidad_compra: 'CAJA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 0, // Missing price in image
    unidad_costos: 'KG'
  },
  {
    id: 'rm-pechuga-molida',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'PECHUGA MOLIDA 3 MM X KG',
    unidad_compra: 'CAJA',
    cantidad_por_unidad_compra: 20,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 67300.00, // ~3365 per kg
    unidad_costos: 'KG'
  },
  {
    id: 'rm-carne-toro',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'CARNE DE TORO X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 5500.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-cerdo-pulpa',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'CERDO PULPA X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.35, // Important Merma
    fecha_ultimo_precio: '2025-10-21',
    precio_unidad_compra: 5362.00,
    unidad_costos: 'KG'
  },
  {
    id: 'rm-grasa-vacuna',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'GRASA VACUNA X KG',
    unidad_compra: 'KG',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-11-26',
    precio_unidad_compra: 924.00, // Derived from recipe
    unidad_costos: 'KG'
  },
  {
    id: 'rm-recorte-pechuga',
    rubro_compra: 'FRIGORÍFICO',
    nombre_item: 'RECORTE DE PECHUGA X 20 KG',
    unidad_compra: 'KG', // Treat as bulk kg for costing
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: '2025-10-29',
    precio_unidad_compra: 2986.43, // Derived from recipe unit cost
    unidad_costos: 'KG'
  },

  // --- PACKAGING ---
  {
    id: 'rm-pack-bolsa-2030',
    rubro_compra: 'PACKAGING',
    nombre_item: 'BOLSA VACIO 20x30 (x100)',
    unidad_compra: 'PACK',
    cantidad_por_unidad_compra: 100, // 100 bags
    merma_factor: 1.00,
    fecha_ultimo_precio: new Date().toISOString(),
    precio_unidad_compra: 4500, // $45 per bag
    unidad_costos: 'UN'
  },
  {
    id: 'rm-pack-caja-master',
    rubro_compra: 'PACKAGING',
    nombre_item: 'CAJA MASTER (x1)',
    unidad_compra: 'UN',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: new Date().toISOString(),
    precio_unidad_compra: 350,
    unidad_costos: 'UN'
  },
  {
    id: 'rm-pack-etiqueta',
    rubro_compra: 'PACKAGING',
    nombre_item: 'ETIQUETA ROLLO (x1000)',
    unidad_compra: 'ROLLO',
    cantidad_por_unidad_compra: 1000,
    merma_factor: 1.05, // 5% waste
    fecha_ultimo_precio: new Date().toISOString(),
    precio_unidad_compra: 15000, // $15 per label
    unidad_costos: 'UN'
  },

  // --- OTROS (AGUA) ---
  {
    id: 'rm-agua-grifo',
    rubro_compra: 'OTROS',
    nombre_item: 'AGUA GRIFO',
    unidad_compra: 'LT',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: new Date().toISOString(),
    precio_unidad_compra: 0,
    unidad_costos: 'LT'
  },
  {
    id: 'rm-agua-grifo-dypro',
    rubro_compra: 'OTROS',
    nombre_item: 'AGUA GRIFO DYPRO',
    unidad_compra: 'LT',
    cantidad_por_unidad_compra: 1,
    merma_factor: 1.00,
    fecha_ultimo_precio: new Date().toISOString(),
    precio_unidad_compra: 0,
    unidad_costos: 'LT'
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-milanesa-musculo',
    linea: 'CERDO VA!',
    rubro_producto: 'MILANESAS',
    nombre_producto: 'PASTON MILANESA MUSCULO',
    fecha_creacion: '2025-10-29',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-milanesa-musculo', materia_prima_id: 'rm-carne-primera-rojo', cantidad_en_um_costos: 16.200, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-milanesa-musculo', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 2.600, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-milanesa-musculo', materia_prima_id: 'rm-stall001', cantidad_en_um_costos: 0.500, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-milanesa-musculo', materia_prima_id: 'rm-fecula-mandioca', cantidad_en_um_costos: 0.750, orden_visual: 4 },
    ]
  },
  {
    id: 'rec-bife-ternera',
    linea: 'CERDO VA!',
    rubro_producto: 'BIFES',
    nombre_producto: 'PASTON DE BIFE DE TERNERA',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-carne-primera', cantidad_en_um_costos: 9.850, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 6.550, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 1.950, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.250, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-fecula-papa', cantidad_en_um_costos: 0.350, orden_visual: 6 },
      { id: 'i7', receta_id: 'rec-bife-ternera', materia_prima_id: 'rm-dybatter', cantidad_en_um_costos: 0.350, orden_visual: 7 },
    ]
  },
  {
    id: 'rec-suprema',
    linea: 'CERDO VA!',
    rubro_producto: 'MILANESAS',
    nombre_producto: 'PASTON SUPREMA',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-suprema', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 16.500, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-suprema', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-suprema', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 2.000, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-suprema', materia_prima_id: 'rm-mil-100-hr', cantidad_en_um_costos: 0.300, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-suprema', materia_prima_id: 'rm-mil-100-v', cantidad_en_um_costos: 0.150, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-suprema', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.400, orden_visual: 6 },
    ]
  },
  {
    id: 'rec-bife-cerdo',
    linea: 'CERDO VA!',
    rubro_producto: 'BIFES',
    nombre_producto: 'PASTON DE BIFE CERDO',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-cerdo-pulpa', cantidad_en_um_costos: 11.650, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 5.050, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 2.050, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.250, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-bife-cerdo', materia_prima_id: 'rm-dybatter', cantidad_en_um_costos: 0.350, orden_visual: 6 },
    ]
  },
  {
    id: 'rec-bife-criollo',
    linea: 'CERDO VA!',
    rubro_producto: 'BIFES',
    nombre_producto: 'PASTON DE BIFE CRIOLLO',
    fecha_creacion: '2025-09-14',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-cerdo-pulpa', cantidad_en_um_costos: 6.550, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-carne-toro', cantidad_en_um_costos: 3.250, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 3.250, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-dybatter', cantidad_en_um_costos: 0.350, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-grasa-vacuna', cantidad_en_um_costos: 3.250, orden_visual: 6 },
      { id: 'i7', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 1.950, orden_visual: 7 },
      { id: 'i8', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-ssg', cantidad_en_um_costos: 0.250, orden_visual: 8 },
      { id: 'i9', receta_id: 'rec-bife-criollo', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.400, orden_visual: 9 },
    ]
  },
  {
    id: 'rec-bife-pollo',
    linea: 'CERDO VA!',
    rubro_producto: 'BIFES',
    nombre_producto: 'PASTON DE BIFE DE POLLO',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-bife-pollo', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 16.600, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-bife-pollo', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-bife-pollo', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 2.000, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-bife-pollo', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.400, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-bife-pollo', materia_prima_id: 'rm-dybatter', cantidad_en_um_costos: 0.350, orden_visual: 5 },
    ]
  },
  {
    id: 'rec-milanesa-gral',
    linea: 'CERDO VA!',
    rubro_producto: 'MILANESAS',
    nombre_producto: 'PASTON MILANESA',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-carne-primera', cantidad_en_um_costos: 7.900, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 9.450, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.450, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 1.450, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.350, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-milanesa-gral', materia_prima_id: 'rm-mil-100-v', cantidad_en_um_costos: 0.350, orden_visual: 6 },
    ]
  },
  {
    id: 'rec-hamburguesa',
    linea: 'CERDO VA!',
    rubro_producto: 'HAMBURGUESAS',
    nombre_producto: 'PASTON HAMBURGUESA',
    fecha_creacion: '2025-10-17',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-carne-segunda', cantidad_en_um_costos: 6.550, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-grasa-vacuna', cantidad_en_um_costos: 3.300, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 6.550, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 1.950, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.400, orden_visual: 6 },
      { id: 'i7', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-ssh-parrillera', cantidad_en_um_costos: 0.250, orden_visual: 7 },
      { id: 'i8', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-dg-20-plus', cantidad_en_um_costos: 0.150, orden_visual: 8 },
      { id: 'i9', receta_id: 'rec-hamburguesa', materia_prima_id: 'rm-sal-entrefina', cantidad_en_um_costos: 0.100, orden_visual: 9 },
    ]
  },
  {
    id: 'rec-nuggets-20',
    linea: 'CERDO VA!',
    rubro_producto: 'MEDALLONES',
    nombre_producto: 'PASTON NUGGETS 2,0',
    fecha_creacion: '2025-10-29',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 5.050, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-recorte-pechuga', cantidad_en_um_costos: 13.150, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-fecula-papa', cantidad_en_um_costos: 1.400, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-dynugget', cantidad_en_um_costos: 0.250, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-sal-entrefina', cantidad_en_um_costos: 0.100, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-nuggets-20', materia_prima_id: 'rm-glutamato', cantidad_en_um_costos: 0.050, orden_visual: 6 },
    ]
  },
  {
    id: 'rec-bife-ternera-01',
    linea: 'CERDO VA!',
    rubro_producto: 'BIFES',
    nombre_producto: 'PASTON DE BIFE DE TERNERA ,01',
    fecha_creacion: '2025-11-06',
    fecha_ultima_modificacion: '2025-11-27',
    peso_unitario_kg: 0,
    activo: true,
    minutos_totales_paston_lote: 15,
    operarios_equivalentes_paston: 1,
    ingredientes: [
      { id: 'i1', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-carne-primera', cantidad_en_um_costos: 14.000, orden_visual: 1 },
      { id: 'i2', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-pechuga-molida', cantidad_en_um_costos: 2.400, orden_visual: 2 },
      { id: 'i3', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-dypro-500', cantidad_en_um_costos: 0.650, orden_visual: 3 },
      { id: 'i4', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-agua-grifo-dypro', cantidad_en_um_costos: 1.950, orden_visual: 4 },
      { id: 'i5', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-agua-grifo', cantidad_en_um_costos: 0.250, orden_visual: 5 },
      { id: 'i6', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-fecula-papa', cantidad_en_um_costos: 0.350, orden_visual: 6 },
      { id: 'i7', receta_id: 'rec-bife-ternera-01', materia_prima_id: 'rm-dybatter', cantidad_en_um_costos: 0.350, orden_visual: 7 },
    ]
  }
];

export const INITIAL_PRODUCTS: FinalProduct[] = [
  // MILANESAS
  {
    id: 'fp-mila-160',
    receta_id: 'rec-milanesa-gral',
    nombre_producto_final: 'MILANESA STD 160G',
    tipo_producto: 'MILANESAS',
    peso_unitario_kg: 0.160,
    unidades_por_paquete: 1,
    tipo_paquete: 'GRANEL',
    costo_empaque_extra: 0,
    empaque_items: [],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 60,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 60,
    paquetes_por_hora: 120,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 120,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.35,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  {
    id: 'fp-suprema-160',
    receta_id: 'rec-suprema',
    nombre_producto_final: 'SUPREMA POLLO 160G',
    tipo_producto: 'MILANESAS',
    peso_unitario_kg: 0.160,
    unidades_por_paquete: 1,
    tipo_paquete: 'GRANEL',
    costo_empaque_extra: 0,
    empaque_items: [],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 60,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 60,
    paquetes_por_hora: 120,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 120,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.35,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  // BIFES
  {
    id: 'fp-bife-ternera-100',
    receta_id: 'rec-bife-ternera',
    nombre_producto_final: 'BIFE TERNERA 100G',
    tipo_producto: 'BIFES',
    peso_unitario_kg: 0.100,
    unidades_por_paquete: 10,
    tipo_paquete: 'BOLSA',
    costo_empaque_extra: 5,
    empaque_items: [
        { id: 'pi1', materia_prima_id: 'rm-pack-bolsa-2030', cantidad: 1 },
        { id: 'pi2', materia_prima_id: 'rm-pack-etiqueta', cantidad: 1 }
    ],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 60,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 60,
    paquetes_por_hora: 60,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 50,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.35,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  {
    id: 'fp-bife-ternera-150',
    receta_id: 'rec-bife-ternera',
    nombre_producto_final: 'BIFE TERNERA 150G',
    tipo_producto: 'BIFES',
    peso_unitario_kg: 0.150,
    unidades_por_paquete: 10,
    tipo_paquete: 'BOLSA',
    costo_empaque_extra: 5,
    empaque_items: [
         { id: 'pi1', materia_prima_id: 'rm-pack-bolsa-2030', cantidad: 1 },
         { id: 'pi2', materia_prima_id: 'rm-pack-etiqueta', cantidad: 1 }
    ],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 60,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 60,
    paquetes_por_hora: 50,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 40,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.35,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  // HAMBURGUESAS
  {
    id: 'fp-hamburguesa-110',
    receta_id: 'rec-hamburguesa',
    nombre_producto_final: 'HAMBURGUESA 110G',
    tipo_producto: 'HAMBURGUESAS',
    peso_unitario_kg: 0.110,
    unidades_por_paquete: 2,
    tipo_paquete: 'CAJA',
    costo_empaque_extra: 10,
    empaque_items: [
         { id: 'pi1', materia_prima_id: 'rm-pack-caja-master', cantidad: 0.1 }, // Fraction of master box? Or maybe small box
         { id: 'pi2', materia_prima_id: 'rm-pack-etiqueta', cantidad: 1 }
    ],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 50,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 50,
    paquetes_por_hora: 100,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 100,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.40,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  {
    id: 'fp-hamburguesa-80',
    receta_id: 'rec-hamburguesa',
    nombre_producto_final: 'HAMBURGUESA JUNIOR 80G',
    tipo_producto: 'HAMBURGUESAS',
    peso_unitario_kg: 0.080,
    unidades_por_paquete: 2,
    tipo_paquete: 'CAJA',
    costo_empaque_extra: 10,
    empaque_items: [
         { id: 'pi1', materia_prima_id: 'rm-pack-caja-master', cantidad: 0.1 },
         { id: 'pi2', materia_prima_id: 'rm-pack-etiqueta', cantidad: 1 }
    ],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 50,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 15,
    kg_paston_lote_formado: 50,
    paquetes_por_hora: 100,
    operarios_equiv_empaque: 1,
    min_fijos_empaque_lote: 10,
    paquetes_lote_empaque: 100,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.40,
    iva_pct: 21,
    usa_precio_real_custom: false
  },
  // MEDALLONES / NUGGETS
  {
    id: 'fp-nuggets-30',
    receta_id: 'rec-nuggets-20',
    nombre_producto_final: 'NUGGETS 30G',
    tipo_producto: 'MEDALLONES',
    peso_unitario_kg: 0.030,
    unidades_por_paquete: 50,
    tipo_paquete: 'BOLSA',
    costo_empaque_extra: 5,
    empaque_items: [
         { id: 'pi1', materia_prima_id: 'rm-pack-bolsa-2030', cantidad: 2 },
         { id: 'pi2', materia_prima_id: 'rm-pack-etiqueta', cantidad: 1 }
    ],
    activo: true,
    fecha_ultima_modificacion: '2025-11-27',
    kg_formados_por_hora: 40,
    operarios_equiv_formado: 2,
    min_fijos_formado_lote: 20,
    kg_paston_lote_formado: 40,
    paquetes_por_hora: 30,
    operarios_equiv_empaque: 2,
    min_fijos_empaque_lote: 15,
    paquetes_lote_empaque: 30,
    metodo_precio: 'POR_PAQUETE',
    coeficiente_sugerido: 1.50,
    iva_pct: 21,
    usa_precio_real_custom: false
  }
];

export const PRODUCT_CATEGORIES = ['BIFES', 'HAMBURGUESAS', 'MEDALLONES', 'MILANESAS', 'EMBUTIDOS'];
export const PURCHASE_CATEGORIES = ['ALMACÉN', 'FRIGORÍFICO', 'VERDULERÍA', 'ADITIVOS', 'PACKAGING', 'OTROS'];
