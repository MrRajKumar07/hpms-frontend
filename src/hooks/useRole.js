import { useAuth } from './useAuth';

export const useRole = () => {
    const { user } = useAuth();
    const currentRole = user?.role || null; 

    const hasRole = (role) => {
        if (Array.isArray(role)) return role.includes(currentRole);
        return currentRole === role;
    };

    const hasAnyRole = (roles) => roles.includes(currentRole);

    return {
        hasRole,
        hasAnyRole,
        currentRole,
        isAdmin: currentRole === 'ADMIN',
        isDoctor: currentRole === 'DOCTOR',
        isPatient: currentRole === 'PATIENT',
        isStaff: ['NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'].includes(currentRole)
    };
};