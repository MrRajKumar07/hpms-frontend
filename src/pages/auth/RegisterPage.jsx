import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { loginThunk } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { UserPlus, User, Stethoscope, Mail, Lock, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { role: 'PATIENT' }
    });

    const selectedRole = watch("role");
    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            // This 'data' object now includes confirmPassword to satisfy Spring Boot @NotBlank
            await authApi.register(data);
            toast.success("Account created! Logging you in...");

            const loginResult = await dispatch(loginThunk({
                email: data.email,
                password: data.password
            }));

            if (loginThunk.fulfilled.match(loginResult)) {
                const role = loginResult.payload.role;
                const dashboardMap = {
                    ADMIN: '/admin/dashboard',
                    DOCTOR: '/doctor/dashboard',
                    PATIENT: '/portal'
                };
                navigate(dashboardMap[role] || '/portal');
            }
        } catch (err) {
            // Displays the specific validation error from Spring Boot
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden">

                <div className="bg-blue-600 md:w-1/3 p-8 text-white flex flex-col justify-center items-center text-center">
                    <UserPlus size={48} className="mb-4 opacity-80" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Join HPMS</h2>
                    <p className="text-blue-100 text-xs mt-2 font-medium">Hospital Portal Management System</p>
                </div>

                <div className="p-8 md:w-2/3">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* FULL NAME */}
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-slate-700">
                                <User size={14} className="text-blue-600" />
                                <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
                            </div>
                            <Input {...register("name", { required: "Name is required" })} error={errors.name?.message} />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-slate-700">
                                <Mail size={14} className="text-blue-600" />
                                <label className="text-xs font-bold uppercase tracking-wider">Email</label>
                            </div>
                            <Input type="email" {...register("email", { required: "Email required" })} error={errors.email?.message} />
                        </div>

                        {/* PASSWORD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1 text-slate-700">
                                    <Lock size={14} className="text-blue-600" />
                                    <label className="text-xs font-bold uppercase tracking-wider">Password</label>
                                </div>
                                <Input type="password" {...register("password", { 
                                    required: "Password required",
                                    minLength: { value: 6, message: "Min 6 characters" } 
                                })} error={errors.password?.message} />
                            </div>

                            {/* CONFIRM PASSWORD - Fixed for Spring Boot Validation */}
                            <div>
                                <div className="flex items-center gap-2 mb-1 text-slate-700">
                                    <ShieldCheck size={14} className="text-blue-600" />
                                    <label className="text-xs font-bold uppercase tracking-wider">Confirm</label>
                                </div>
                                <Input type="password" {...register("confirmPassword", { 
                                    required: "Please confirm password",
                                    validate: value => value === password || "Passwords must match"
                                })} error={errors.confirmPassword?.message} />
                            </div>
                        </div>

                        <Select
                            label="Account Type"
                            {...register("role")}
                            options={[
                                { label: 'Patient', value: 'PATIENT' },
                                { label: 'Doctor', value: 'DOCTOR' }
                            ]}
                        />

                        {selectedRole === 'DOCTOR' && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 text-blue-700 font-bold text-[10px] uppercase">
                                    <Stethoscope size={14} />
                                    <span>Medical Credentials</span>
                                </div>
                                <Input label="License Number" {...register("licenseNo", { required: "License required for doctors" })} error={errors.licenseNo?.message} />
                                <Input label="Specialization" {...register("specialization", { required: "Specialization required" })} error={errors.specialization?.message} />
                            </div>
                        )}

                        <Button type="submit" className="w-full py-3 mt-4 font-bold uppercase tracking-widest shadow-lg shadow-blue-100">
                            Create Account
                        </Button>

                        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                            Already have an account?
                            <Link to="/login" className="ml-1 text-blue-600 font-black hover:underline uppercase">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;