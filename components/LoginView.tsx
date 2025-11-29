
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (email: string, pass: string) => void;
  error?: string;
}

export const LoginView: React.FC<Props> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ 
                backgroundImage: 'linear-gradient(#38E0FF 1px, transparent 1px), linear-gradient(90deg, #38E0FF 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}>
      </div>
      
      <div className="w-full max-w-md bg-bg-elevated border border-border-intense rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 pb-6 border-b border-border-soft bg-bg-highlight/20 text-center">
            <h1 className="text-3xl font-header font-bold text-white tracking-tight flex items-center justify-center gap-2">
                <span className="text-brand-primary">■</span> CERDO VA!
            </h1>
            <p className="text-xs font-mono text-text-muted mt-2 tracking-widest uppercase">Sistema de Costos & Operaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
                <div className="bg-status-error/10 border border-status-error/50 rounded p-3 text-center">
                    <p className="text-xs font-bold text-status-error uppercase">{error}</p>
                </div>
            )}

            <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2">Email Corporativo</label>
                <input 
                    type="email" 
                    required
                    autoFocus
                    className="w-full bg-bg-base border border-border-intense rounded px-4 py-3 text-white outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                    placeholder="usuario@cerdova.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2">Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                        type="password" 
                        required
                        className="w-full bg-bg-base border border-border-intense rounded pl-10 pr-4 py-3 text-white outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all font-mono"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-brand-primary text-white font-bold py-3 rounded hover:bg-brand-primaryHover transition shadow-[0_0_20px_rgba(255,75,125,0.3)] flex items-center justify-center gap-2 group"
            >
                INICIAR SESIÓN
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="p-4 bg-bg-base text-center text-[10px] text-text-muted font-mono border-t border-border-soft">
            <p>ACCESO RESTRINGIDO // SOLO PERSONAL AUTORIZADO</p>
        </div>
      </div>
    </div>
  );
};
