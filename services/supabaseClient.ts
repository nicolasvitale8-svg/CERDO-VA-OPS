
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DIRECTA (NUCLEAR) ---
// Escribimos las claves aquí para asegurar que la app conecte
// independientemente de si el archivo .env funciona o no.

const SUPABASE_URL = 'https://mixyhfdlzjarvszinytk.supabase.co';
// Nota: Usamos la clave que proporcionaste. Si tienes una clave 'anon' larga (JWT), úsala aquí.
const SUPABASE_KEY = 'sb_publishable_pV7BKkbzgVf476KrJPhL4Q_bJqZBQUO'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const isSupabaseConfigured = () => {
    // Retornamos true forzado porque ya pusimos las claves arriba
    return true; 
};
