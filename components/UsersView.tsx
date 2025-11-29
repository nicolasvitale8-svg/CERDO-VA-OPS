
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Plus, Edit2, Shield, User as UserIcon } from 'lucide-react';

interface Props {
  users: User[];
  onSaveUser: (u: User) => void;
}

export const UsersView: React.FC<Props> = ({ users, onSaveUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User>>({});

    const handleNew = () => {
        setEditingUser({
            id: crypto.randomUUID(),
            activo: true,
            rol: 'LECTURA',
            email: '',
            nombre: '',
            password_hash: ''
        });
        setIsEditing(true);
    };

    const handleEdit = (u: User) => {
        setEditingUser({ ...u });
        setIsEditing(true);
    };

    const saveForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser.email && editingUser.rol) {
            onSaveUser(editingUser as User);
            setIsEditing(false);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        switch(role) {
            case 'ADMIN': return 'bg-brand-primary/20 text-brand-primary border-brand-primary/50';
            case 'COSTOS': return 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/50';
            case 'PRODUCCION': return 'bg-status-warning/20 text-status-warning border-status-warning/50';
            default: return 'bg-text-muted/20 text-text-muted border-text-muted/50';
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
                <div>
                    <h2 className="text-3xl font-header font-bold text-white uppercase tracking-wide">Usuarios</h2>
                    <p className="text-text-secondary text-sm mt-1 font-mono">SEGURIDAD // ROLES & ACCESOS</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-text-main text-bg-base px-5 py-2.5 rounded hover:bg-white transition font-medium tracking-wide font-bold"
                >
                    <Plus size={18} />
                    <span>NUEVO USUARIO</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                    <div key={u.id} className="bg-bg-elevated border border-border-soft rounded p-6 hover:border-text-secondary transition group relative">
                        {!u.activo && <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-[1px] z-10 flex items-center justify-center font-bold text-text-muted uppercase tracking-widest border border-dashed border-text-muted rounded">Inactivo</div>}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`px-2 py-1 rounded border text-[10px] font-bold font-mono uppercase tracking-wider ${getRoleBadge(u.rol)}`}>
                                {u.rol}
                            </div>
                            <button onClick={() => handleEdit(u)} className="text-text-muted hover:text-white p-1 z-20">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <UserIcon size={18} /> {u.nombre}
                        </h3>
                        <p className="text-sm text-text-secondary font-mono mt-1">{u.email}</p>
                        <div className="mt-4 pt-4 border-t border-border-soft flex justify-between items-center text-[10px] font-mono text-text-muted">
                            <span>ULTIMO LOGIN</span>
                            <span className={u.ultimo_login ? 'text-text-main' : ''}>{u.ultimo_login ? new Date(u.ultimo_login).toLocaleDateString() : 'NUNCA'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                     <div className="bg-bg-elevated border border-border-intense rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-border-intense bg-bg-highlight flex justify-between items-center">
                            <h3 className="font-header font-bold text-white uppercase">
                                {editingUser.id ? '>> EDITAR USUARIO' : '>> NUEVO USUARIO'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-white">&times;</button>
                        </div>
                        <form onSubmit={saveForm} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Nombre</label>
                                <input
                                    required
                                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none focus:border-brand-secondary"
                                    value={editingUser.nombre}
                                    onChange={e => setEditingUser({ ...editingUser, nombre: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none focus:border-brand-secondary"
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Rol</label>
                                    <select
                                        className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none focus:border-brand-secondary"
                                        value={editingUser.rol}
                                        onChange={e => setEditingUser({ ...editingUser, rol: e.target.value as UserRole })}
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="COSTOS">COSTOS</option>
                                        <option value="PRODUCCION">PRODUCCION</option>
                                        <option value="LECTURA">LECTURA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-text-secondary mb-1 uppercase">Contraseña</label>
                                    <input
                                        type="text"
                                        placeholder={editingUser.id ? "Sin cambios" : "Requerido"}
                                        className="w-full bg-bg-base border border-border-intense rounded px-3 py-2 text-white outline-none focus:border-brand-secondary font-mono"
                                        value={editingUser.password_hash}
                                        onChange={e => setEditingUser({ ...editingUser, password_hash: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox"
                                    checked={editingUser.activo}
                                    onChange={e => setEditingUser({...editingUser, activo: e.target.checked})}
                                    className="accent-brand-primary"
                                />
                                <label className="text-xs font-mono text-white uppercase">Usuario Activo</label>
                            </div>

                             <div className="flex gap-3 pt-4 border-t border-border-soft mt-2">
                                <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 border border-border-intense text-text-secondary rounded hover:bg-bg-highlight font-medium transition-colors"
                                >
                                CANCELAR
                                </button>
                                <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-text-main text-bg-base rounded hover:bg-white font-bold transition-colors tracking-wide"
                                >
                                GUARDAR
                                </button>
                            </div>
                        </form>
                     </div>
                </div>
            )}
        </div>
    );
};
