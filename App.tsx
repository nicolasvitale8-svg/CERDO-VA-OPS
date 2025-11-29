
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
import { LoginView } from './components/LoginView';
import { UsersView } from './components/UsersView';
import { ExportToolsView } from './components/ExportToolsView';
import { TechnicalSheetDetail } from './components/TechnicalSheetDetail';
import { RawMaterial, Recipe, FinalProduct, ViewState, GlobalSettings, User, TechnicalDataSheet } from './types';
import { INITIAL_MATERIALS, INITIAL_RECIPES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_USERS, INITIAL_TECHNICAL_SHEETS } from './constants';
import { loginUser, canManageUsers, canEditCosts } from './services/authService';

function App() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
      const saved = localStorage.getItem('cv_session');
      return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState('');

  // --- Data State ---
  const [view, setView] = useState<ViewState>('DASHBOARD');
  
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('cv_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [users, setUsers] = useState<User[]>(() => {
      const saved = localStorage.getItem('cv_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
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

  const [techSheets, setTechSheets] = useState<TechnicalDataSheet[]>(() => {
    const saved = localStorage.getItem('cv_tech_sheets');
    return saved ? JSON.parse(saved) : INITIAL_TECHNICAL_SHEETS;
  });

  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeProduct, setActiveProduct] = useState<FinalProduct | null>(null);
  const [activeSheet, setActiveSheet] = useState<TechnicalDataSheet | null>(null);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('cv_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('cv_materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('cv_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('cv_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('cv_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cv_tech_sheets', JSON.stringify(techSheets)); }, [techSheets]);
  useEffect(() => { 
      if (currentUser) localStorage.setItem('cv_session', JSON.stringify(currentUser));
      else localStorage.removeItem('cv_session');
  }, [currentUser]);

  // --- Auth Handlers ---

  const handleLogin = (email: string, pass: string) => {
      const user = loginUser(users, email, pass);
      if (user) {
          setCurrentUser(user);
          setLoginError('');
          setView('DASHBOARD');
      } else {
          setLoginError('Credenciales inválidas o usuario inactivo.');
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setView('LOGIN');
  };

  const handleSaveUser = (u: User) => {
      setUsers(prev => {
          const exists = prev.find(user => user.id === u.id);
          if (exists) return prev.map(user => user.id === u.id ? u : user);
          return [...prev, u];
      });
  };

  // --- Data Handlers ---

  const handleRestoreBackup = (data: any) => {
      if (data.materials) setMaterials(data.materials);
      if (data.recipes) setRecipes(data.recipes);
      if (data.products) setProducts(data.products);
      if (data.settings) setSettings(data.settings);
      if (data.users) setUsers(data.users);
      if (data.techSheets) setTechSheets(data.techSheets);
      
      alert("Copia de seguridad restaurada correctamente.");
      setView('DASHBOARD');
  };

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

  const handleDeleteMaterial = (id: string) => {
      try {
        console.log("Intentando eliminar insumo:", id);
        
        // 1. Check integrity in Recipes (using optional chaining for safety)
        const usedInRecipe = recipes.find(r => r.ingredientes?.some(i => i.materia_prima_id === id));
        if (usedInRecipe) {
            alert(`NO SE PUEDE ELIMINAR:\nEste insumo se utiliza en la receta "${usedInRecipe.nombre_producto}".\n\nDebe quitarlo de la receta antes de eliminarlo.`);
            return;
        }

        // 2. Check integrity in Products (Packaging) (using optional chaining)
        const usedInProduct = products.find(p => p.empaque_items?.some(i => i.materia_prima_id === id));
        if (usedInProduct) {
            alert(`NO SE PUEDE ELIMINAR:\nEste insumo se utiliza como empaque en "${usedInProduct.nombre_producto_final}".\n\nDebe quitarlo del producto antes de eliminarlo.`);
            return;
        }

        if (window.confirm('¿Eliminar definitivamente este insumo?')) {
            setMaterials(prev => prev.filter(m => m.id !== id));
        }
      } catch (error) {
          console.error("Error al eliminar material:", error);
          alert("Ocurrió un error al intentar eliminar. Por favor recargue la página.");
      }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
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
          kg_formados_por_hora: 60,
          operarios_equiv_formado: 1,
          min_fijos_formado_lote: 15,
          kg_paston_lote_formado: 60,
          paquetes_por_hora: 60,
          operarios_equiv_empaque: 1,
          min_fijos_empaque_lote: 10,
          paquetes_lote_empaque: 60,
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
          usa_precio_real_custom: false
      };
      setActiveProduct(newProduct);
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

  // --- Tech Sheet Handlers ---
  const handleViewTechSheet = (r: Recipe) => {
      const existingSheet = techSheets.find(ts => ts.receta_id === r.id);
      if (existingSheet) {
          setActiveSheet(existingSheet);
      } else {
          // Create new Sheet skeleton
          const newSheet: TechnicalDataSheet = {
              id: crypto.randomUUID(),
              receta_id: r.id,
              codigo: 'NEW-FT-000',
              version: 'v1.0',
              vigencia: new Date().toISOString().split('T')[0],
              area: 'Producción',
              responsable: '',
              verificador: '',
              base_lote_kg: 20,
              bom_observaciones: {},
              nota_critica_bom: '',
              sop_referencia: '',
              texto_proceso: '',
              parametros_criticos: [],
              texto_conservacion: ''
          };
          setActiveSheet(newSheet);
      }
      setView('TECH_SHEET_DETAIL');
  };

  const handleSaveTechSheet = (sheet: TechnicalDataSheet) => {
      setTechSheets(prev => {
          const exists = prev.find(s => s.id === sheet.id);
          if (exists) return prev.map(s => s.id === sheet.id ? sheet : s);
          return [...prev, sheet];
      });
  };


  // --- Render & Routing ---

  if (!currentUser) {
      return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  // Protection Guard for Admin Route
  if (view === 'USERS' && !canManageUsers(currentUser.rol)) {
      setView('DASHBOARD'); // Redirect fallback
  }

  // Protection Guard for Tools Route
  if (view === 'TOOLS' && !canEditCosts(currentUser.rol)) {
      setView('DASHBOARD');
  }

  let content;
  switch (view) {
    case 'DASHBOARD':
      content = (
          <DashboardView 
              products={products}
              recipes={recipes}
              materials={materials}
              settings={settings}
              currentUser={currentUser}
              onNavigateToProduct={handleSelectProduct}
              onNavigateToRecipe={handleGoToRecipe}
              onNavigateToMaterial={() => setView('RAW_MATERIALS')}
              onViewAllProducts={() => setView('FINAL_PRODUCTS')}
          />
      );
      break;
    case 'USERS':
        content = <UsersView users={users} onSaveUser={handleSaveUser} />;
        break;
    case 'TOOLS':
        content = (
            <ExportToolsView 
                materials={materials}
                recipes={recipes}
                products={products}
                settings={settings}
                users={users}
                techSheets={techSheets}
                onRestoreBackup={handleRestoreBackup}
            />
        );
        break;
    case 'RAW_MATERIALS':
      content = (
          <RawMaterialsView 
            materials={materials} 
            onSave={handleSaveMaterial} 
            onDelete={handleDeleteMaterial}
            currentUser={currentUser} 
          />
      );
      break;
    case 'RECIPES':
      content = (
        <RecipesView 
          recipes={recipes} 
          materials={materials} 
          settings={settings}
          currentUser={currentUser}
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
            currentUser={currentUser}
            onSave={handleSaveRecipe}
            onDelete={handleDeleteRecipe}
            onBack={() => setView('RECIPES')}
            onGoToScaler={handleGoToScaler}
            onViewTechSheet={handleViewTechSheet}
          />
        );
      }
      break;
    case 'TECH_SHEET_DETAIL':
        if (!activeSheet || !activeRecipe) {
            setView('RECIPES');
            content = null;
        } else {
            content = (
                <TechnicalSheetDetail 
                    sheet={activeSheet}
                    recipe={activeRecipe}
                    materials={materials}
                    currentUser={currentUser}
                    onSave={handleSaveTechSheet}
                    onBack={() => setView('RECIPE_DETAIL')}
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
                currentUser={currentUser}
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
                    currentUser={currentUser}
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
    <Layout currentView={view} setView={setView} currentUser={currentUser} onLogout={handleLogout}>
      {content}
    </Layout>
  );
}

export default App;
