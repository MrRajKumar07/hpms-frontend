import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Bell } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
    const dispatch = useDispatch();
    const { email, user } = useAuth();

    return (
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-blue-600 tracking-tight">HPMS Portal</h1>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100">
                    {user?.role}
                </span>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-800 leading-none">{email}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase">Active Session</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <User size={18} />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(setLogout())}
                        className="ml-2 text-red-500 hover:bg-red-50"
                    >
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;