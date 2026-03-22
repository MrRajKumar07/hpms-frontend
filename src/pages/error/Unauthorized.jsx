import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-6">
            <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <ShieldAlert size={48} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Access Denied</h1>
            <p className="text-slate-500 mt-2 mb-8 max-w-sm font-medium">
                Your current role does not have permission to access this department or resource.
            </p>
            <div className="flex gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
                <Button onClick={() => navigate('/')}>Dashboard Home</Button>
            </div>
        </div>
    );
};

export default Unauthorized;