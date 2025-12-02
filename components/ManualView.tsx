
import React from 'react';
import { BookOpen, Shield, Package, ChefHat, ShoppingBag, Scale, LayoutDashboard, Settings, LifeBuoy, AlertTriangle, CheckCircle } from 'lucide-react';

export const ManualView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-border-soft pb-6">
        <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide flex items-center gap-3">
          <BookOpen className="text-brand-primary" size={32} />
          Manual de Operaciones
        </h2>
        <p className="text-text-secondary text-sm mt-2 font-mono">DOCUMENTACIÓN OFICIAL V1.3 // ONLINE</p>
      </div>

      {/* 1. Intro */}
      <section className="space-y-4">
        <h3 className="text-xl font-header font-bold text-white uppercase border-l-4 border-brand-secondary pl-3">1. Introducción</h3>
        <div className="bg-bg-elevated border border-border-soft rounded p-6 text-sm text-text-secondary leading-relaxed">
          <p className="mb-4">
            <strong className="text-white">CERDO VA! OPS</strong> es la plataforma centralizada para la gestión de costos industriales, 
            estandarización de recetas y órdenes de producción.
          </p>
          <ul className="space-y-2 font-mono text-xs">
            <li className="flex items-start gap-2">
              <span className="text-brand-secondary">>></span>
              <span><strong>Dato Único:</strong> El precio de la carne se actualiza en un solo lugar y repercute en todo el sistema.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-secondary">>></span>
              <span><strong>Seguridad:</strong> Los roles operativos no ven datos financieros sensibles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-secondary">>></span>
              <span><strong>Nube:</strong> Todo cambio se guarda en internet en tiempo real.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Roles */}
      <section className="space-y-4">
        <h3 className="text-xl font-header font-bold text-white uppercase border-l-4 border-brand-secondary pl-3 flex items-center gap-2">
            2. Roles y Permisos <Shield size={20} className="text-text-muted" />
        </h3>
        <div className="bg-bg-elevated border border-border-soft rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-highlight text-xs font-mono uppercase text-text-secondary">
              <tr>
                <th className="p-4">Rol</th>
                <th className="p-4">Usuario Típico</th>
                <th className="p-4">Permisos Clave</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              <tr className="group hover:bg-bg-highlight/20">
                <td className="p-4 font-bold text-brand-primary">ADMIN</td>
                <td className="p-4 text-text-secondary">Dueños / Gerencia</td>
                <td className="p-4 text-white">Acceso Total. Gestión de usuarios, costos, precios y backups.</td>
              </tr>
              <tr className="group hover:bg-bg-highlight/20">
                <td className="p-4 font-bold text-brand-secondary">COSTOS</td>
                <td className="p-4 text-text-secondary">Administración</td>
                <td className="p-4 text-white">Edición Total. Puede cambiar precios, recetas y productos. Ve márgenes.</td>
              </tr>
              <tr className="group hover:bg-bg-highlight/20">
                <td className="p-4 font-bold text-status-warning">PRODUCCIÓN</td>
                <td className="p-4 text-text-secondary">Jefe de Planta</td>
                <td className="p-4 text-white">Operativo. Ve recetas, usa el Escalador e imprime órdenes. <span className="text-status-error font-bold">NO VE</span> precios.</td>
              </tr>
              <tr className="group hover:bg-bg-highlight/20">
                <td className="p-4 font-bold text-text-muted">LECTURA</td>
                <td className="p-4 text-text-secondary">Auditoría</td>
                <td className="p-4 text-white">Solo puede mirar. No puede guardar ni editar nada.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Guía de Módulos */}
      <section className="space-y-6">
        <h3 className="text-xl font-header font-bold text-white uppercase border-l-4 border-brand-secondary pl-3">4. Guía de Módulos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Materias Primas */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <Package className="text-brand-secondary" size={18} /> A. Materias Primas
                </h4>
                <p className="text-xs text-text-muted mb-4 font-mono">Aquí nace el costo.</p>
                <ul className="text-sm text-text-secondary space-y-2 list-disc pl-4">
                    <li><strong>Unidad de Compra:</strong> Cómo viene del proveedor (ej: BOLSA).</li>
                    <li><strong>Merma (Factor):</strong> Crítico. Si la carne pierde 30% al limpiar, el factor es 1.30.</li>
                    <li><strong>Precio:</strong> Siempre cargar el precio de factura (bulto cerrado).</li>
                </ul>
            </div>

            {/* Recetas */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <ChefHat className="text-brand-secondary" size={18} /> B. Recetas Base (Pastones)
                </h4>
                <p className="text-xs text-text-muted mb-4 font-mono">La fórmula de la masa.</p>
                <ul className="text-sm text-text-secondary space-y-2 list-disc pl-4">
                    <li>Concepto: Mezcla a granel antes de dar forma.</li>
                    <li>Usa el <strong>buscador predictivo</strong> para agregar ingredientes.</li>
                    <li>Define la <strong>Mano de Obra (Etapa 1)</strong>: Tiempos de mezclado/picado.</li>
                </ul>
            </div>

            {/* Productos */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <ShoppingBag className="text-brand-secondary" size={18} /> C. Productos Finales
                </h4>
                <p className="text-xs text-text-muted mb-4 font-mono">Lo que vendemos al cliente.</p>
                <ul className="text-sm text-text-secondary space-y-2 list-disc pl-4">
                    <li>Transforma Pastón en unidad de venta (ej: Bife 100g).</li>
                    <li>Define el <strong>Empaque</strong> (bolsa, etiqueta, caja).</li>
                    <li>El sistema sugiere precio según tu <strong>Markup</strong>.</li>
                    <li><span className="text-status-error font-bold">ALERTA ROJA:</span> Margen menor al 20%.</li>
                </ul>
            </div>

            {/* Escalador */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <Scale className="text-brand-secondary" size={18} /> D. Escalador (Producción)
                </h4>
                <p className="text-xs text-text-muted mb-4 font-mono">Herramienta diaria de Planta.</p>
                <ol className="text-sm text-text-secondary space-y-2 list-decimal pl-4">
                    <li>Selecciona la Receta.</li>
                    <li>Ingresa el objetivo (Kg o Unidades).</li>
                    <li>El sistema recalcula todo.</li>
                    <li><strong>IMPRIMIR:</strong> Genera hoja limpia sin precios para operarios.</li>
                </ol>
            </div>

            {/* Dashboard */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <LayoutDashboard className="text-brand-secondary" size={18} /> E. Dashboard
                </h4>
                <ul className="text-sm text-text-secondary space-y-2 list-disc pl-4">
                    <li><strong>KPIs:</strong> Costo promedio, Margen global.</li>
                    <li><strong>Alertas:</strong> Avisa precios desactualizados o márgenes bajos.</li>
                    <li><strong>Calidad de Datos:</strong> Muestra qué falta cargar.</li>
                </ul>
            </div>

            {/* Herramientas */}
            <div className="bg-bg-elevated border border-border-soft rounded p-5 hover:border-brand-secondary/30 transition">
                <h4 className="font-header font-bold text-white uppercase mb-2 flex items-center gap-2">
                    <Settings className="text-brand-secondary" size={18} /> F. Herramientas
                </h4>
                <ul className="text-sm text-text-secondary space-y-2 list-disc pl-4">
                    <li><strong>Excel:</strong> Descarga reportes completos.</li>
                    <li><strong>Backup (JSON):</strong> Descarga una copia de seguridad.</li>
                    <li><strong>Restaurar:</strong> Recupera datos de un archivo anterior.</li>
                </ul>
            </div>
        </div>
      </section>

      {/* 5. Mantenimiento */}
      <section className="space-y-4">
        <h3 className="text-xl font-header font-bold text-white uppercase border-l-4 border-brand-secondary pl-3 flex items-center gap-2">
            5. Solución de Problemas <LifeBuoy size={20} className="text-text-muted" />
        </h3>
        <div className="bg-bg-highlight/30 border border-border-soft rounded p-6 space-y-4">
            <div className="flex gap-3 items-start">
                <AlertTriangle className="text-status-warning shrink-0 mt-1" size={18} />
                <div>
                    <p className="font-bold text-white text-sm uppercase">"No veo los cambios que hizo Administración"</p>
                    <p className="text-text-secondary text-sm">Presiona <span className="font-mono bg-bg-base border border-border-intense px-1 rounded">F5</span> o actualiza la página. La sincronización es rápida, pero a veces requiere refrescar.</p>
                </div>
            </div>
            <div className="flex gap-3 items-start">
                <AlertTriangle className="text-status-warning shrink-0 mt-1" size={18} />
                <div>
                    <p className="font-bold text-white text-sm uppercase">"Pantalla negra al entrar"</p>
                    <p className="text-text-secondary text-sm">Borra la caché del navegador o prueba en modo Incógnito.</p>
                </div>
            </div>
            <div className="flex gap-3 items-start">
                <CheckCircle className="text-status-ok shrink-0 mt-1" size={18} />
                <div>
                    <p className="font-bold text-white text-sm uppercase">Backup Recomendado</p>
                    <p className="text-text-secondary text-sm">
                        Aunque el sistema es seguro en la nube, se recomienda descargar un respaldo (JSON) una vez por semana desde el menú Herramientas.
                    </p>
                </div>
            </div>
        </div>
      </section>

      <div className="text-center pt-10 text-xs font-mono text-text-muted">
        <p>SOPORTE TÉCNICO: Contactar al desarrollador.</p>
        <p>CONSULTAS DE COSTOS: Departamento de Administración.</p>
      </div>

    </div>
  );
};
