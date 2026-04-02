import { useState, useEffect, useRef } from 'react';
import axiosBase from '../../api/axiosBase';
import { Send, Bot, User, BookOpen, Activity, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DoctorAIChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axiosBase.post('/ai/doctor/ask', { message: input });
            const botMsg = {
                role: 'bot',
                content: res.data.data.answer,
                sources: res.data.data.sources || [],
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error occurred");
        } finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col h-[calc(100-64px)] bg-slate-50">
            {/* Header Actions */}
            <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg text-white"><Bot size={20} /></div>
                    <h1 className="font-bold text-slate-800 uppercase tracking-tight">Clinical Decision Support AI</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-100 uppercase transition">
                        <Activity size={14} /> Suggest Diagnosis
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <BookOpen size={48} className="mb-4" />
                        <p className="text-sm font-medium">Ask about symptoms, dosages, or medical protocols.</p>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'}`}>
                            <div className="flex items-center gap-2 mb-2 opacity-70">
                                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                <span className="text-[10px] font-bold uppercase">{m.role} • {m.timestamp}</span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                            {m.sources && m.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                    <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Verified RAG Sources:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {m.sources.map((s, idx) => (
                                            <span key={idx} className="bg-blue-50 text-blue-700 text-[9px] px-2 py-1 rounded flex items-center gap-1 border border-blue-100">
                                                <FileText size={10} /> {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border p-4 rounded-2xl flex items-center gap-3">
                            <Loader2 className="animate-spin text-blue-600" size={18} />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analyzing Knowledge Base...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleAsk} className="p-4 bg-white border-t">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe patient case or ask medical question..."
                        className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50">
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorAIChatPage;