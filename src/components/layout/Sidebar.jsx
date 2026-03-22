import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import {
    LayoutDashboard, Users, Calendar, ClipboardList,
    Settings, CreditCard, Activity, ShieldCheck,
    Stethoscope, Pill, Microscope, UserSquare
} from 'lucide-react';

const Sidebar = () => {
    const { currentRole, hasRole } = useRole();
    const location = useLocation();

    // Unified Menu Configuration mapping to your Backend Roles
    const menuConfig = [
        // ADMIN ONLY
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, visible: hasRole('ADMIN') },
        { label: 'Staff Management', path: '/admin/staff', icon: ShieldCheck, visible: hasRole('ADMIN') },

        // DOCTOR / NURSE
        { label: 'Doctor Dashboard', path: '/doctor/dashboard', icon: Stethoscope, visible: hasRole('DOCTOR') },
        { label: 'Nurse Station', path: '/nurse/dashboard', icon: Activity, visible: hasRole('NURSE') },
        { label: 'Medical Records', path: '/records', icon: ClipboardList, visible: hasRole(['DOCTOR', 'NURSE']) },

        // PATIENT
        { label: 'Patient Portal', path: '/portal', icon: UserSquare, visible: hasRole('PATIENT') },
        { label: 'My Bills', path: '/portal/bills', icon: CreditCard, visible: hasRole('PATIENT') },

        // SPECIALIZED ROLES
        { label: 'Pharmacy', path: '/pharmacy', icon: Pill, visible: hasRole('PHARMACIST') },
        { label: 'Lab Reports', path: '/lab', icon: Microscope, visible: hasRole('LAB_TECHNICIAN') },

        // SHARED
        { label: 'Appointments', path: '/appointments', icon: Calendar, visible: hasRole(['ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST']) },
        { label: 'User Directory', path: '/users', icon: Users, visible: hasRole(['ADMIN', 'RECEPTIONIST']) },
    ];

    const links = menuConfig.filter(link => link.visible);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] p-4 flex flex-col justify-between">
            <div>
                <div className="px-4 mb-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded inline-block">
                        {currentRole} Access
                    </p>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                    <Settings size={18} />
                    Settings
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;