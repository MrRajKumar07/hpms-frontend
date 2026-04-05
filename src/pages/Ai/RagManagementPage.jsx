import { useState } from 'react'; // React hata diya (Warning 1 Fixed)
import axiosBase from '../../api/axiosBase';
import { Upload, Database, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RagManagementPage = () => {
    const [file, setFile] = useState(null);
    const [ingesting, setIngesting] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [statusType, setStatusType] = useState(null); // 'success' or 'error'

    const handleUpload = async () => {
        if (!file) return toast.error("Please select a PDF file first.");

        const formData = new FormData();
        formData.append('file', file);
        setIngesting(true);
        setStatusType(null);

        try {
            await axiosBase.post('/rag/ingest', formData);
            toast.success("Knowledge Base Updated Successfully!");
            setStatusType('success'); // CheckCircle use karne ke liye
            setFile(null);
        } catch (err) {
            console.error(err); // err use ho gaya (Warning 4 Fixed)
            toast.error("Ingestion failed. Check file size and format.");
            setStatusType('error'); // AlertCircle use karne ke liye
        } finally {
            setIngesting(false);
        }
    };

    const handleTestSearch = async () => {
        try {
            const res = await axiosBase.get(`/rag/search?query=${query}&topK=3`);
            setResults(res.data.data);
        } catch (err) {
            console.error(err); // err use ho gaya (Warning 5 Fixed)
            toast.error("Search test failed.");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-slate-50">
            <header className="mb-10 border-l-4 border-indigo-600 pl-4">
                <h1 className="text-3xl font-black text-slate-800 uppercase">AI Knowledge Management</h1>
                <p className="text-sm text-slate-500 font-medium">Train your RAG system with medical manuals.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* UPLOAD CARD */}
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-indigo-600">
                            <Upload size={20} /> <span className="font-black text-xs uppercase tracking-widest">Ingest Knowledge</span>
                        </div>
                        <div className="border-4 border-dashed border-slate-100 rounded-3xl p-10 text-center mb-6">
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-xs text-slate-500 mb-4 block w-full" accept=".pdf" />

                            {/* CheckCircle & AlertCircle use ho gaye (Warning 2 & 3 Fixed) */}
                            {statusType === 'success' && (
                                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                                    <CheckCircle size={16} /> File Ingested!
                                </div>
                            )}
                            {statusType === 'error' && (
                                <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-xs">
                                    <AlertCircle size={16} /> Upload Failed!
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={ingesting}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {ingesting ? <><Loader2 className="animate-spin" /> Training System...</> : "Ingest PDF to Vector Store"}
                    </button>
                </div>

                {/* SEARCH TEST CARD */}
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 text-emerald-600">
                        <Database size={20} /> <span className="font-black text-xs uppercase tracking-widest">Vector Search Test</span>
                    </div>
                    <div className="flex gap-2 mb-6">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search query..." className="flex-1 bg-slate-50 border-none rounded-xl text-sm px-4 h-12 focus:ring-2 focus:ring-emerald-500" />
                        <button onClick={handleTestSearch} className="bg-emerald-600 text-white p-3 rounded-xl shadow-md hover:bg-emerald-700"><Search size={20} /></button>
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-60">
                        {results.length === 0 && (
                            <p className="text-[10px] text-center text-slate-400 uppercase font-bold py-10 italic">
                                {"No chunks retrieved. Try searching \"hypertension\"."}
                            </p>
                        )}                        
                        {results.map((r, i) => (
                            <div key={i} className="p-3 bg-slate-50 border rounded-xl text-[10px] font-medium leading-relaxed text-slate-600">
                                <b className="text-emerald-700 uppercase block mb-1">CHUNK {i + 1}</b> {r.substring(0, 200)}...
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RagManagementPage;