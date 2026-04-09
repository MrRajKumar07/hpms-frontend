import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, MessageCircle, Paperclip, FileCheck, ShieldCheck, Stethoscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axiosBase from '../../api/axiosBase';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AIChatWidget = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role || 'PATIENT';
    const isAdmin = role === 'ADMIN';
    const isDoctor = role === 'DOCTOR';

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    // --- 🤖 Professional Role-Based Welcome Logic ---
    useEffect(() => {
        let welcomeMsg = "";
        if (isAdmin) {
            welcomeMsg = "Welcome to the **HPMS Knowledge Controller**. System is synchronized. You can now ingest new medical protocols or query the vector database for clinical insights.";
        } else if (isDoctor) {
            welcomeMsg = `Greetings, **Dr. ${user?.lastName || 'Consultant'}**. Clinical Intelligence Hub is active. I can assist with differential diagnosis, ICD-10 coding, or patient summary analysis.`;
        } else {
            welcomeMsg = "Welcome to **HPMS Patient Support**. I can help you with health queries, symptom guidance, or general wellness. How can I assist you today?";
        }
        setMessages([{ role: 'bot', content: welcomeMsg }]);
    }, [role, user, isAdmin, isDoctor]);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

    // --- 📄 Admin PDF Ingest Logic ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: `Uploading System Document: ${file.name}` }]);

        try {
            await axiosBase.post('/rag/ingest', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Knowledge Base Updated!");
            setMessages(prev => [...prev, {
                role: 'bot',
                content: `### Ingestion Success\nFile \`${file.name}\` has been successfully synchronized with the Vector Store. Clinical queries will now include this context.`
            }]);
        } catch (err) {
            console.error("Ingestion Error:", err);
            toast.error("Upload Failed");
            setMessages(prev => [...prev, { role: 'bot', content: "❌ **System Error:** Failed to ingest document. Please verify the RAG service status." }]);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userQuery = input;
        setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
        setInput("");
        setLoading(true);

        try {
            // Smart Endpoint Selection
            let endpoint = '/ai/patient/chat';
            let payload = { message: userQuery };

            if (isAdmin) {
                endpoint = '/rag/search';
                payload = { query: userQuery };
            } else if (isDoctor) {
                endpoint = '/ai/doctor/ask';
            }

            const res = await axiosBase.post(endpoint, payload);

            let responseText = "";
            if (isAdmin) {
                const results = res.data.data;
                responseText = results.length > 0
                    ? "### 🔍 Vector Search Matches:\n" + results.join("\n\n---\n\n")
                    : "No matching clinical data found in the current knowledge base.";
            } else {
                responseText = res.data.data.answer;
            }

            setMessages(prev => [...prev, { role: 'bot', content: responseText }]);
        } catch (err) {
            console.error("AI Communication Error:", err);
            setMessages(prev => [...prev, { role: 'bot', content: "Connection interrupted. Please ensure the AI microservice is reachable." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {isOpen && (
                <div className="mb-4 w-85 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* --- Dynamic Header --- */}
                    <div className={`p-4 text-white flex justify-between items-center shadow-md ${isAdmin ? 'bg-slate-800' : isDoctor ? 'bg-indigo-700' : 'bg-blue-600'
                        }`}>
                        <div className="flex items-center gap-2">
                            {isAdmin ? <ShieldCheck size={20} /> : isDoctor ? <Stethoscope size={20} /> : <Bot size={20} />}
                            <span className="font-bold text-[10px] uppercase tracking-widest">
                                {isAdmin ? "Admin Knowledge Controller" : isDoctor ? "Clinical Decision Support" : "HPMS Health Buddy"}
                            </span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1">
                            <X size={18} />
                        </button>
                    </div>

                    {/* --- Messages Area --- */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[92%] p-3 rounded-2xl text-xs shadow-sm ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                    }`}>
                                    <div className="prose prose-slate prose-xs max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                // Icon injection inside markdown if needed
                                                FileCheck: () => <FileCheck size={14} className="text-green-500 inline mr-1" />
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start items-center gap-2 px-2">
                                <Loader2 className="animate-spin text-blue-600" size={14} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">AI Processing Request...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* --- Input & Tools --- */}
                    <form onSubmit={handleSend} className="p-3 border-t bg-white">
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Synchronize PDF with Knowledge Base"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                </>
                            )}
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isAdmin ? "Query clinical database..." : isDoctor ? "Analyze medical symptoms..." : "Ask your health buddy..."}
                                className="flex-1 text-xs bg-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 border-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className={`${isAdmin ? 'bg-slate-800' : isDoctor ? 'bg-indigo-700' : 'bg-blue-600'} text-white p-2.5 rounded-xl shadow-md hover:brightness-110 disabled:opacity-50 transition-all`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- Trigger Button --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isAdmin ? 'bg-slate-800' : isDoctor ? 'bg-indigo-700' : 'bg-blue-600'} text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all border-4 border-white group`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />}
            </button>
        </div>
    );
};

export default AIChatWidget;