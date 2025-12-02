
import React from 'react';
import { ViewState, User } from '../types';
import { canManageUsers, canEditCosts } from '../services/authService';
import { LayoutDashboard, Scale, ChefHat, Package, Menu, ShoppingBag, Users, LogOut, Shield, Settings, BookOpen } from 'lucide-react';

interface Props {
  currentView: ViewState;
  setView: (v: ViewState) => void;
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
}

export const Layout: React.FC<Props> = ({ currentView, setView, children, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'RAW_MATERIALS', label: 'MATERIAS PRIMAS', icon: Package },
    { id: 'RECIPES', label: 'RECETAS BASE', icon: ChefHat },
    { id: 'FINAL_PRODUCTS', label: 'PRODUCTOS', icon: ShoppingBag },
    { id: 'SCALER', label: 'ESCALADOR / PROD', icon: Scale },
    { id: 'LABOR', label: 'MANO DE OBRA', icon: Users },
  ];

  if (canManageUsers(currentUser.rol)) {
      navItems.push({ id: 'USERS', label: 'USUARIOS', icon: Shield });
  }

  if (canEditCosts(currentUser.rol)) {
      navItems.push({ id: 'TOOLS', label: 'HERRAMIENTAS', icon: Settings });
  }

  // Manual for everyone
  navItems.push({ id: 'MANUAL', label: 'MANUAL', icon: BookOpen });

  return (
    <div className="min-h-screen bg-bg-base text-text-main flex flex-col md:flex-row relative overflow-hidden">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ 
                backgroundImage: 'linear-gradient(#38E0FF 1px, transparent 1px), linear-gradient(90deg, #38E0FF 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}>
       </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-bg-elevated border-b border-border-soft z-20">
         <h1 className="text-xl font-header font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-brand-primary">■</span> CERDO VA!
         </h1>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-text-secondary">
            <Menu />
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-bg-elevated border-r border-border-intense transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:flex-shrink-0 no-print
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-border-soft hidden md:block">
          <h1 className="text-2xl font-header font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-brand-primary">■</span> CERDO VA!
          </h1>
          <p className="text-xs font-mono text-text-muted mt-2 tracking-widest">SYSTEM V1.3 // ONLINE</p>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border-soft bg-bg-highlight/20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-bg-base border border-border-intense flex items-center justify-center font-bold text-brand-secondary">
                    {currentUser.nombre.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{currentUser.nombre}</p>
                    <p className="text-[10px] font-mono text-text-muted truncate uppercase">{currentUser.rol}</p>
                </div>
                <button onClick={onLogout} className="text-text-muted hover:text-white" title="Cerrar Sesión">
                    <LogOut size={14} />
                </button>
            </div>
        </div>
        
        <nav className="p-4 space-y-2 mt-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id || 
                             (item.id === 'RECIPES' && currentView === 'RECIPE_DETAIL') ||
                             (item.id === 'FINAL_PRODUCTS' && currentView === 'FINAL_PRODUCT_DETAIL');
            return (
              <button
                key={item.id}
                onClick={() => {
                    setView(item.id as ViewState);
                    setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-header text-sm tracking-wide ${
                  isActive
                    ? 'bg-bg-highlight border-l-2 border-brand-secondary text-brand-secondary shadow-[0_0_15px_rgba(56,224,255,0.1)]'
                    : 'text-text-secondary hover:bg-bg-highlight hover:text-white'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-brand-secondary' : 'text-text-muted'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};