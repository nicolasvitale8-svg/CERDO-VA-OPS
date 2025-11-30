
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
import { INITIAL_SETTINGS } from './constants';
import { loginUser, canManageUsers, canEditCosts } from './services/authService';
import * as dataService from './services/dataService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Loader2, AlertTriangle, Database } from 'lucide-react';

function App() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
      const saved = localStorage.getItem('cv_session');
      return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState('');

  // --- Data State ---
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<FinalProduct[]>([]);
  const [techSheets, setTechSheets] = useState<TechnicalDataSheet[]>([]);

  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeProduct, setActiveProduct] = useState<FinalProduct | null>(null);
  const [activeSheet, setActiveSheet] = useState<TechnicalDataSheet | null>(null);

  // --- Initial Load ---
  const loadSystemData = async () => {
      if (!isSupabaseConfigured()) {
          setIsLoading(false);
          return;
      }

      try {
          setIsLoading(true);
          const data = await dataService.loadInitialData();
          setSettings(data.settings);
          setMaterials(data.materials);
          setRecipes(data.recipes);
          setProducts(data.products);
          setUsers(data.users);
          setTechSheets(data.techSheets);
      } catch (error) {
          console.error("Error connecting to database:", error);
          // Don't alert immediately on load, maybe just log
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      if (currentUser) {
          loadSystemData();
      } else {
          setIsLoading(false);
      }
  }, [currentUser]);

  // Session persistence
  useEffect(() => { 
      if (currentUser) localStorage.setItem('cv_session', JSON.stringify(currentUser));
      else localStorage.removeItem('cv_session');
  }, [currentUser]);

  // --- Auth Handlers ---

  const handleLogin = (email: string, pass: string) => {
      if (!isSupabaseConfigured()) {
          // Fallback login for testing UI without DB
          if (email === 'admin@test.com' && pass === 'admin') {
              setCurrentUser({ id: 'local', email, nombre: 'Local Admin', rol: 'ADMIN', password_hash: '', activo: true });
              return;
          }
      }

      dataService.loadInitialData().then(data => {
          const user = loginUser(data.users, email, pass);
          if (user) {
              setCurrentUser(user);
              setLoginError('');
              // Now load the rest
              setSettings(data.settings);
              setMaterials(data.materials);
              setRecipes(data.recipes);
              setProducts(data.products);
              setUsers(data.users);
              setTechSheets(data.techSheets);
              setView('DASHBOARD');
          } else {
              setLoginError('Credenciales inválidas.');
          }
      }).catch(() => setLoginError('Error de conexión o configuración.'));
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setView('LOGIN');
      setMaterials([]);
      setRecipes([]);
      setProducts([]);
  };

  const handleSaveUser = async (u: User) => {
      try {
          await dataService.saveUser(u);
          setUsers(prev => {
              const exists = prev.find(user => user.id === u.id);
              if (exists) return prev.map(user => user.id === u.id ? u : user);
              return [...prev, u];
          });
      } catch (e) { alert("Error al guardar usuario"); }
  };

  // --- Data Handlers ---

  const handleRestoreBackup = async (data: any) => {
      if (!isSupabaseConfigured()) {
          alert("Error: No hay conexión a Supabase configurada.");
          return;
      }

      if (window.confirm("Se subirán los datos del archivo a la Base de Datos en la Nube. Esto puede tardar unos segundos. ¿Continuar?")) {
          setIsLoading(true);
          try {
              await dataService.migrateFromBackup(data);
              await loadSystemData(); // Reload from DB
              alert("Migración a la nube completada con éxito.");
              setView('DASHBOARD');
          } catch (e) {
              console.error(e);
              alert("Error durante la migración.");
              setIsLoading(false);
          }
      }
  };

  const handleSaveSettings = async (s: GlobalSettings) => {
    try {
        await dataService.saveSettings(s);
        setSettings(s);
    } catch (e) { alert("Error al guardar configuración"); }
  };

  const handleSaveMaterial = async (material: RawMaterial) => {
    try {
        await dataService.saveRawMaterial(material);
        setMaterials(prev => {
            const exists = prev.find(p => p.id === material.id);
            if (exists) return prev.map(p => p.id === material.id ? material : p);
            return [...prev, material];
        });
    } catch (e) { alert("Error al guardar insumo"); }
  };

  const handleDeleteMaterial = async (id: string) => {
      try {
        const usedInRecipe = recipes.find(r => r.ingredientes?.some(i => i.materia_prima_id === id));
        if (usedInRecipe) {
            alert(`NO SE PUEDE ELIMINAR:\nEste insumo se utiliza en la receta "${usedInRecipe.nombre_producto}".`);
            return;
        }
        const usedInProduct = products.find(p => p.empaque_items?.some(i => i.materia_prima_id === id));
        if (usedInProduct) {
            alert(`NO SE PUEDE ELIMINAR:\nEste insumo se utiliza como empaque en "${usedInProduct.nombre_producto_final}".`);
            return;
        }

        if (window.confirm('¿Eliminar definitivamente este insumo?')) {
            await dataService.deleteRawMaterial(id);
            setMaterials(prev => prev.filter(m => m.id !== id));
        }
      } catch (error) {
          console.error(error);
          alert("Error al eliminar material.");
      }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    const updatedRecipe = { 
      ...recipe, 
      fecha_ultima_modificacion: new Date().toISOString().split('T')[0] 
    };
    try {
        await dataService.saveRecipe(updatedRecipe);
        setRecipes(prev => {
            const exists = prev.find(r => r.id === updatedRecipe.id);
            if (exists) return prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
            return [...prev, updatedRecipe];
        });
        setActiveRecipe(updatedRecipe);
    } catch (e) { alert("Error al guardar receta"); }
  };

  const handleDeleteRecipe = async (id: string) => {
      if (window.confirm('¿ESTÁ SEGURO? Eliminar esta receta base puede afectar productos que dependan de ella.')) {
          try {
              await dataService.deleteRecipe(id);
              setRecipes(prev => prev.filter(r => r.id !== id));
              setActiveRecipe(null);
              setView('RECIPES');
          } catch (e) { alert("Error al eliminar receta"); }
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

  const handleSaveProduct = async (product: FinalProduct) => {
      const updatedProduct = {
        ...product,
        fecha_ultima_modificacion: new Date().toISOString().split('T')[0]
      };
      try {
          await dataService.saveProduct(updatedProduct);
          setProducts(prev => {
              const exists = prev.find(p => p.id === updatedProduct.id);
              if (exists) return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
              return [...prev, updatedProduct];
          });
          setView('FINAL_PRODUCTS');
          setActiveProduct(null);
      } catch (e) { alert("Error al guardar producto"); }
  };

  const handleDeleteProduct = async (id: string) => {
      if (window.confirm('¿ESTÁ SEGURO? Se eliminará este producto del catálogo.')) {
          try {
              await dataService.deleteProduct(id);
              setProducts(prev => prev.filter(p => p.id !== id));
              setActiveProduct(null);
              setView('FINAL_PRODUCTS');
          } catch (e) { alert("Error al eliminar producto"); }
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
      // We don't save immediately, user edits first
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

  const handleSaveTechSheet = async (sheet: TechnicalDataSheet) => {
      try {
          await dataService.saveTechSheet(sheet);
          setTechSheets(prev => {
              const exists = prev.find(s => s.id === sheet.id);
              if (exists) return prev.map(s => s.id === sheet.id ? sheet : s);
              return [...prev, sheet];
          });
      } catch (e) { alert("Error al guardar ficha técnica"); }
  };


  // --- Render & Routing ---

  // CRITICAL CONFIG CHECK
  if (!isSupabaseConfigured()) {
      return (
          <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-bg-elevated border border-status-error/50 p-8 rounded-lg max-w-lg shadow-2xl">
                  <div className="flex justify-center mb-4 text-status-error">
                      <AlertTriangle size={64} />
                  </div>
                  <h1 className="text-2xl font-header font-bold text-white mb-2">ERROR DE CONFIGURACIÓN</h1>
                  <p className="text-text-secondary mb-6 font-mono text-sm">
                      La aplicación no detecta las credenciales de Supabase.
                  </p>
                  
                  <div className="bg-bg-base p-4 rounded border border-border-intense text-left mb-6 overflow-x-auto">
                      <p className="text-xs text-text-muted font-mono mb-2">Verifique que el archivo <span className="text-white font-bold">.env</span> existe en la raíz y contiene:</p>
                      <code className="text-xs font-mono text-brand-secondary block whitespace-pre">
                          VITE_SUPABASE_URL=...<br/>
                          VITE_SUPABASE_ANON_KEY=...
                      </code>
                  </div>

                  <div className="text-xs text-text-muted">
                      <p className="mb-2">Si ya creó el archivo:</p>
                      <ol className="list-decimal list-inside space-y-1">
                          <li>Detenga la terminal (Ctrl + C)</li>
                          <li>Ejecute <span className="font-mono text-white bg-bg-highlight px-1 rounded">npm run dev</span> nuevamente</li>
                      </ol>
                  </div>
              </div>
          </div>
      );
  }

  if (isLoading) {
      return (
          <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-white">
              <Loader2 size={48} className="animate-spin text-brand-primary mb-4" />
              <h2 className="text-xl font-header font-bold tracking-widest">CONECTANDO A SUPABASE...</h2>
              <p className="text-sm font-mono text-text-muted mt-2">Sincronizando datos en la nube</p>
          </div>
      );
  }

  if (!currentUser) {
      return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  // Protection Guard for Admin Route
  if (view === 'USERS' && !canManageUsers(currentUser.rol)) {
      setView('DASHBOARD');
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
