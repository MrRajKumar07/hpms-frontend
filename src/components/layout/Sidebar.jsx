import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../store/authSlice';
import { LayoutDashboard, Users, Calendar, LogOut, Activity } from 'lucide-react';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const menuItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
        { title: 'Manage Users', icon: <Users size={20} />, roles: ['ADMIN'] },
        { title: 'Appointments', icon: <Calendar size={20} />, roles: ['DOCTOR', 'PATIENT'] },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-white/10 flex flex-col p-4 text-slate-300">
            <div className="flex items-center gap-3 mb-10 px-2">
                <Activity className="text-blue-500" />
                <span className="text-xl font-bold text-white tracking-tight">HPMS</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems
                    .filter(item => item.roles.includes(user?.role))
                    .map((item, index) => (
                        <button key={index} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group">
                            <span className="group-hover:text-blue-400 transition-colors">{item.icon}</span>
                            {item.title}
                        </button>
                    ))}
            </nav>

            <button
                onClick={() => dispatch(setLogout())}
                className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium mt-auto"
            >
                <LogOut size={20} /> Logout
            </button>
        </div>
    );
};

export default Sidebar;