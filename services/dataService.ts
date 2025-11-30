
import { supabase } from './supabaseClient';
import { RawMaterial, Recipe, FinalProduct, GlobalSettings, User, TechnicalDataSheet, Ingredient, PackagingIngredient } from '../types';

// --- LOADERS ---

export const loadInitialData = async () => {
  try {
    // 1. Settings
    const { data: settingsData } = await supabase.from('global_settings').select('*').single();
    
    // 2. Materials
    const { data: materialsData } = await supabase.from('raw_materials').select('*');

    // 3. Recipes (Join with Ingredients)
    const { data: recipesData } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredientes:recipe_ingredients(*)
      `);

    // 4. Products (Join with Packaging)
    const { data: productsData } = await supabase
      .from('final_products')
      .select(`
        *,
        empaque_items:product_packaging(*)
      `);

    // 5. Users
    const { data: usersData } = await supabase.from('app_users').select('*');

    // 6. Tech Sheets
    const { data: sheetsData } = await supabase.from('technical_sheets').select('*');

    return {
      settings: settingsData as GlobalSettings || { costo_hora_operario: 5000 },
      materials: materialsData as RawMaterial[] || [],
      recipes: (recipesData as Recipe[]) || [],
      products: (productsData as FinalProduct[]) || [],
      users: (usersData as User[]) || [],
      techSheets: (sheetsData as TechnicalDataSheet[]) || []
    };
  } catch (error) {
    console.error('Error loading initial data:', error);
    throw error;
  }
};

// --- SAVERS ---

export const saveSettings = async (settings: GlobalSettings) => {
  const { error } = await supabase
    .from('global_settings')
    .upsert({ id: 1, ...settings });
  if (error) throw error;
};

export const saveRawMaterial = async (material: RawMaterial) => {
  // Remove generated props if any (supabase handles default dates if null)
  const { error } = await supabase
    .from('raw_materials')
    .upsert(material);
  if (error) throw error;
};

export const deleteRawMaterial = async (id: string) => {
  const { error } = await supabase
    .from('raw_materials')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const saveRecipe = async (recipe: Recipe) => {
  // 1. Save Recipe Base
  const { ingredientes, ...recipeBase } = recipe;
  const { error: recipeError } = await supabase
    .from('recipes')
    .upsert(recipeBase);
  
  if (recipeError) throw recipeError;

  // 2. Handle Ingredients (Delete old, Insert new)
  // Only if ingredients array is provided
  if (ingredientes) {
      await supabase.from('recipe_ingredients').delete().eq('receta_id', recipe.id);
      
      if (ingredientes.length > 0) {
          // FIX: Generate new unique IDs for ingredients to avoid Primary Key collisions
          // from legacy/local data where IDs like 'i1' might be reused across recipes.
          const ingredientsToInsert = ingredientes.map(i => ({
              ...i,
              id: crypto.randomUUID()
          }));

          const { error: ingError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsToInsert);
          if (ingError) throw ingError;
      }
  }
};

export const deleteRecipe = async (id: string) => {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) throw error;
};

export const saveProduct = async (product: FinalProduct) => {
  // 1. Save Product Base
  const { empaque_items, ...productBase } = product;
  const { error: prodError } = await supabase
    .from('final_products')
    .upsert(productBase);
  
  if (prodError) throw prodError;

  // 2. Handle Packaging Items
  if (empaque_items) {
      await supabase.from('product_packaging').delete().eq('producto_id', product.id);
      
      if (empaque_items.length > 0) {
          // FIX: Generate new unique IDs for packaging items to avoid collisions
          const itemsToSave = empaque_items.map(item => ({
              id: crypto.randomUUID(), // Always new ID
              producto_id: product.id,
              materia_prima_id: item.materia_prima_id,
              cantidad: item.cantidad
          }));

          const { error: pkgError } = await supabase
            .from('product_packaging')
            .insert(itemsToSave);
          if (pkgError) throw pkgError;
      }
  }
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('final_products').delete().eq('id', id);
  if (error) throw error;
};

export const saveUser = async (user: User) => {
  const { error } = await supabase.from('app_users').upsert(user);
  if (error) throw error;
};

export const saveTechSheet = async (sheet: TechnicalDataSheet) => {
  const { error } = await supabase.from('technical_sheets').upsert(sheet);
  if (error) throw error;
};

// --- MIGRATION UTILS ---

export const migrateFromBackup = async (data: any) => {
    console.log("Iniciando migración a Supabase...");
    let errors = 0;
    
    // 1. Settings
    if (data.settings) {
        try { await saveSettings(data.settings); } 
        catch (e) { console.error("Error migrando Settings:", e); errors++; }
    }

    // 2. Materials
    if (data.materials) {
        for (const m of data.materials) {
            try { await saveRawMaterial(m); } 
            catch (e) { console.error(`Error migrando Material ${m.nombre_item}:`, e); errors++; }
        }
    }

    // 3. Recipes
    if (data.recipes) {
        for (const r of data.recipes) {
            try { await saveRecipe(r); } 
            catch (e) { console.error(`Error migrando Receta ${r.nombre_producto}:`, e); errors++; }
        }
    }

    // 4. Products
    if (data.products) {
        for (const p of data.products) {
            try { await saveProduct(p); } 
            catch (e) { console.error(`Error migrando Producto ${p.nombre_producto_final}:`, e); errors++; }
        }
    }

    // 5. Users
    if (data.users) {
        for (const u of data.users) {
            try { await saveUser(u); } 
            catch (e) { console.error(`Error migrando Usuario ${u.email}:`, e); errors++; }
        }
    }

    // 6. Tech Sheets
    if (data.techSheets) {
        for (const t of data.techSheets) {
            try { await saveTechSheet(t); } 
            catch (e) { console.error(`Error migrando Ficha Técnica ${t.codigo}:`, e); errors++; }
        }
    }
    
    if (errors > 0) {
        alert(`Migración finalizada con ${errors} errores. Revise la consola (F12) para más detalles.`);
    } else {
        console.log("Migración completada sin errores.");
    }
};
