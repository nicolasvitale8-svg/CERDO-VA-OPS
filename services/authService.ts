
import { User, UserRole } from '../types';

export const canEditCosts = (role: UserRole): boolean => {
  return ['ADMIN', 'COSTOS'].includes(role);
};

export const canViewFinancials = (role: UserRole): boolean => {
  return ['ADMIN', 'COSTOS'].includes(role);
};

export const canManageUsers = (role: UserRole): boolean => {
  return role === 'ADMIN';
};

export const canProduce = (role: UserRole): boolean => {
    return ['ADMIN', 'COSTOS', 'PRODUCCION'].includes(role);
}

// Simulated backend login
export const loginUser = (users: User[], email: string, pass: string): User | null => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.activo);
    if (user && user.password_hash === pass) {
        return { ...user, ultimo_login: new Date().toISOString() };
    }
    return null;
};
