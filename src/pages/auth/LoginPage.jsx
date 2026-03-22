import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginThunk } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { LogIn, User, Lock } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const result = await dispatch(loginThunk(data));
        if (loginThunk.fulfilled.match(result)) {
            const role = result.payload.role;
            toast.success(`Welcome back, ${result.payload.name}`);

            // Role-Based Navigation Map
            const dashboardMap = {
                ADMIN: '/admin/dashboard',
                DOCTOR: '/doctor/dashboard',
                PATIENT: '/portal',
                NURSE: '/nurse/dashboard',
                RECEPTIONIST: '/receptionist/dashboard',
                PHARMACIST: '/pharmacy',
                LAB_TECHNICIAN: '/lab'
            };
            navigate(dashboardMap[role] || '/');
        } else {
            toast.error(result.payload?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-xl text-white mb-4">
                        <LogIn size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">HPMS Portal</h1>
                    <p className="text-slate-500 text-sm">Hospital Patient Management System</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 text-slate-700">
                            <User size={16} className="text-blue-600" />
                            <label className="text-sm font-bold">Email Address</label>
                        </div>
                        <Input
                            type="email"
                            placeholder="name@hcltech.com"
                            {...register("email", { required: "Email is required" })}
                            error={errors.email?.message}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1.5 text-slate-700">
                            <Lock size={16} className="text-blue-600" />
                            <label className="text-sm font-bold">Password</label>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...register("password", { required: "Password is required" })}
                            error={errors.password?.message}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3" loading={loading}>
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-slate-500 pt-4">
                        New to the team?
                        <Link to="/register" className="ml-1 text-blue-600 font-bold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;