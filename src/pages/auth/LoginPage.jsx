import { useDispatch } from 'react-redux';
import { setLogin } from '../../store/authSlice';
import { LogIn, ShieldCheck, UserCircle, HeartPulse } from 'lucide-react';

const LoginPage = () => {
    const dispatch = useDispatch();

    // Mock Login Function for Phase 1 (Testing Redux)
    const handleMockLogin = (role) => {
        const mockUser = {
            name: 'Raj Kumar',
            email: 'raj@hpms.in',
            role: role
        };
        dispatch(setLogin(mockUser));
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">

            {/* --- MODERN BACKGROUND DESIGN --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            {/* --- GLASSMORPHISM CARD --- */}
            <div className="relative w-full max-w-[420px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl transition-all hover:border-white/20">

                {/* LOGO & BRANDING */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-4">
                        <HeartPulse className="text-white w-10 h-10 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">HPMS</h1>
                    <p className="text-slate-400 mt-2 text-sm">Vital Care. Digital Precision.</p>
                </div>

                {/* INPUT FIELDS */}
                <div className="space-y-5">
                    <div className="group relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Medical ID / Email"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="group relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <LogIn size={18} /> Authenticate
                    </button>
                </div>

                {/* --- PHASE 1 DEV TOOLS: ROLE SWITCHER --- */}
                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-4 italic">Dev 1 Sandbox: Mock Login</span>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => handleMockLogin('ADMIN')}
                            className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                        >
                            ADMIN
                        </button>
                        <button
                            onClick={() => handleMockLogin('DOCTOR')}
                            className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-all"
                        >
                            DOCTOR
                        </button>
                        <button
                            onClick={() => handleMockLogin('PATIENT')}
                            className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all"
                        >
                            PATIENT
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;