
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RawMaterialsView } from './components/RawMaterialsView';
import { RecipesView } from './components/RecipesView';
import { RecipeDetail } from './components/RecipeDetail';
import { FinalProductsView } from './components/FinalProductsView';
import { FinalProductDetail } from './components/FinalProductDetail';
import { Scaler } from './components/Scaler';
import { LaborView } from './components/LaborView';
import { DashboardView } from './components/DashboardView';
import { RawMaterial, Recipe, FinalProduct, ViewState, GlobalSettings } from './types';
import { INITIAL_MATERIALS, INITIAL_RECIPES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './constants';

function App() {
  // --- State Management ---
  const [view, setView] = useState<ViewState>('DASHBOARD');
  
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('cv_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [materials, setMaterials] = useState<RawMaterial[]>(() => {
    const saved = localStorage.getItem('cv_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('cv_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [products, setProducts] = useState<FinalProduct[]>(() => {
    const saved = localStorage.getItem('cv_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeProduct, setActiveProduct] = useState<FinalProduct | null>(null);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('cv_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('cv_materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('cv_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('cv_products', JSON.stringify(products)); }, [products]);

  // --- Handlers ---

  const handleSaveSettings = (s: GlobalSettings) => {
    setSettings(s);
  };

  const handleSaveMaterial = (material: RawMaterial) => {
    setMaterials(prev => {
      const exists = prev.find(p => p.id === material.id);
      if (exists) {
        return prev.map(p => p.id === material.id ? material : p);
      }
      return [...prev, material];
    });
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    // Update last modified date
    const updatedRecipe = { 
      ...recipe, 
      fecha_ultima_modificacion: new Date().toISOString().split('T')[0] 
    };

    setRecipes(prev => {
      const exists = prev.find(r => r.id === updatedRecipe.id);
      if (exists) {
        return prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
      }
      return [...prev, updatedRecipe];
    });
    // Don't auto-navigate back, stay on detail
    setActiveRecipe(updatedRecipe); 
  };

  const handleDeleteRecipe = (id: string) => {
      if (window.confirm('¿ESTÁ SEGURO? Eliminar esta receta base puede afectar productos que dependan de ella.\n\nEsta acción no se puede deshacer.')) {
          setRecipes(prev => prev.filter(r => r.id !== id));
          setActiveRecipe(null);
          setView('RECIPES');
      }
  };

  const handleCreateRecipe = () => {
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      linea: "CERDO VA!",
      rubro_producto: "MILANESAS",
      nombre_producto: "NUEVA RECETA BASE",
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_ultima_modificacion: new Date().toISOString().split('T')[0],
      peso_unitario_kg: 0,
      activo: true,
      minutos_totales_paston_lote: 15,
      operarios_equivalentes_paston: 1,
      ingredientes: []
    };
    setActiveRecipe(newRecipe);
    setView('RECIPE_DETAIL');
  };

  const handleSaveProduct = (product: FinalProduct) => {
      const updatedProduct = {
        ...product,
        fecha_ultima_modificacion: new Date().toISOString().split('T')[0]
      };
      
      setProducts(prev => {
          const exists = prev.find(p => p.id === updatedProduct.id);
          if (exists) return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
          return [...prev, updatedProduct];
      });
      setView('FINAL_PRODUCTS');
      setActiveProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
      if (window.confirm('¿ESTÁ SEGURO? Se eliminará este producto del catálogo.\n\nEsta acción no se puede deshacer.')) {
          setProducts(prev => prev.filter(p => p.id !== id));
          setActiveProduct(null);
          setView('FINAL_PRODUCTS');
      }
  };

  const handleCreateProduct = () => {
      // Default to first available recipe if exists
      const defaultRecipeId = recipes.length > 0 ? recipes[0].id : '';
      const newProduct: FinalProduct = {
          id: crypto.randomUUID(),
          receta_id: defaultRecipeId,
          nombre_producto_final: 'NUEVO PRODUCTO',
          tipo_producto: 'BIFES',
          peso_unitario_kg: 0.100,
          unidades_por_paquete: 1,
          tipo_paquete: 'BOLSA',
          costo_empaque_extra: 0,
          empaque_items: [],
          activo: true,
          fecha_ultima_modificacion: new Date().toISOString().split('T')[0],
          // Defaults for labor
          kg_formados_por_hora: 60,
          operarios_equiv_formado: 1,
          min_fijos_formado_lote: 15,
          kg_paston_lote_formado: 60,
          paquetes_por_hora: 60,
          operarios_equiv_empaque: 1,
          min_fijos_empaque_lote: 10,
          paquetes_lote_empaque: 60,
          // Defaults for pricing
          metodo_precio: 'POR_PAQUETE',
          coeficiente_sugerido: 1.35,
          iva_pct: 21,
          usa_precio_real_custom: false
      };
      setActiveProduct(newProduct);
      setView('FINAL_PRODUCT_DETAIL');
  };

  const handleDuplicateProduct = (source: FinalProduct) => {
      const newProduct = {
          ...source,
          id: crypto.randomUUID(),
          nombre_producto_final: `${source.nombre_producto_final} (COPIA)`,
          fecha_ultima_modificacion: new Date().toISOString().split('T')[0],
          // Reset custom price on duplicate to force recalculation or review
          usa_precio_real_custom: false
      };
      setActiveProduct(newProduct);
      // Stay on detail view with new product
  };

  const handleSelectRecipe = (r: Recipe) => {
    setActiveRecipe(r);
    setView('RECIPE_DETAIL');
  };

  const handleSelectProduct = (p: FinalProduct) => {
      setActiveProduct(p);
      setView('FINAL_PRODUCT_DETAIL');
  }

  const handleGoToScaler = (r: Recipe) => {
    setActiveRecipe(r);
    setView('SCALER');
  };

  const handleGoToRecipe = (rId: string) => {
      const r = recipes.find(recipe => recipe.id === rId);
      if (r) {
          setActiveRecipe(r);
          setView('RECIPE_DETAIL');
      }
  };

  // --- Router Logic ---

  let content;
  switch (view) {
    case 'DASHBOARD':
      content = (
          <DashboardView 
              products={products}
              recipes={recipes}
              materials={materials}
              settings={settings}
              onNavigateToProduct={handleSelectProduct}
              onNavigateToRecipe={handleGoToRecipe}
              onNavigateToMaterial={() => setView('RAW_MATERIALS')}
              onViewAllProducts={() => setView('FINAL_PRODUCTS')}
          />
      );
      break;
    case 'RAW_MATERIALS':
      content = <RawMaterialsView materials={materials} onSave={handleSaveMaterial} />;
      break;
    case 'RECIPES':
      content = (
        <RecipesView 
          recipes={recipes} 
          materials={materials} 
          settings={settings}
          onSelectRecipe={handleSelectRecipe}
          onCreateRecipe={handleCreateRecipe}
        />
      );
      break;
    case 'RECIPE_DETAIL':
      if (!activeRecipe) {
        setView('RECIPES');
        content = null;
      } else {
        content = (
          <RecipeDetail 
            recipe={activeRecipe} 
            materials={materials} 
            settings={settings}
            onSave={handleSaveRecipe}
            onDelete={handleDeleteRecipe}
            onBack={() => setView('RECIPES')}
            onGoToScaler={handleGoToScaler}
          />
        );
      }
      break;
    case 'FINAL_PRODUCTS':
        content = (
            <FinalProductsView 
                products={products}
                recipes={recipes}
                materials={materials}
                settings={settings}
                onSelectProduct={handleSelectProduct}
                onCreateProduct={handleCreateProduct}
            />
        );
        break;
    case 'FINAL_PRODUCT_DETAIL':
        if (!activeProduct) {
            setView('FINAL_PRODUCTS');
            content = null;
        } else {
            content = (
                <FinalProductDetail 
                    product={activeProduct}
                    recipes={recipes}
                    materials={materials}
                    settings={settings}
                    onSave={handleSaveProduct}
                    onDelete={handleDeleteProduct}
                    onBack={() => setView('FINAL_PRODUCTS')}
                    onDuplicate={handleDuplicateProduct}
                    onGoToRecipe={handleGoToRecipe}
                />
            );
        }
        break;
    case 'SCALER':
      content = (
        <Scaler 
          recipes={recipes} 
          materials={materials} 
          settings={settings}
          preSelectedRecipe={activeRecipe} 
          onBack={() => setView('RECIPES')}
        />
      );
      break;
    case 'LABOR':
      content = (
        <LaborView
          settings={settings}
          recipes={recipes}
          products={products}
          materials={materials}
          onSaveSettings={handleSaveSettings}
        />
      );
      break;
    default:
      content = <div className="text-center p-10">404 Not Found</div>;
  }

  return (
    <Layout currentView={view} setView={setView}>
      {content}
    </Layout>
  );
}

export default App;