import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User} from 'lucide-react';
import Button from '../common/Button';
import NotificationBell from '../NotificationBell';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, user } = useAuth();

    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/login');
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">
                <Link to="/">
                    <h1 className="text-xl font-bold text-blue-600 tracking-tight cursor-pointer">
                        HPMS Portal
                    </h1>
                </Link>

                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100">
                    {user?.role || 'Guest'}
                </span>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-6">
                <NotificationBell />

                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">

                    {/* User Info */}
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-800 leading-none">
                            {email || user?.email}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase">
                            Active Session
                        </p>
                    </div>

                    {/* Profile Icon */}
                    <div
                        onClick={() => navigate('/patients/me')}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-blue-100 transition"
                        title="My Profile"
                    >
                        <User size={18} />
                    </div>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-500 hover:bg-red-50"
                    >
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;