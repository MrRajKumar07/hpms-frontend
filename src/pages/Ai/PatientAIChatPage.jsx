import { useState } from 'react'; 
import axiosBase from '../../api/axiosBase';
import { HeartPulse, MessageCircle, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientAIChatPage = () => {
    const [messages, setMessages] = useState([{ role: 'bot', content: "Hi! I'm your health buddy. How are you feeling today?" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSymptomAnalysis = async () => {
        const symptoms = prompt("Tell me your symptoms (e.g. Headache, Fever):");
        if (!symptoms) return;

        setLoading(true);
        try {
            const res = await axiosBase.post('/ai/patient/symptoms', {
                symptoms: symptoms.split(","),
                age: 25,
                gender: "Male"
            });
            setMessages(prev => [...prev, { role: 'bot', content: res.data.data.answer }]);
        } catch (err) {
            console.error(err); 
            toast.error("Could not analyze symptoms.");
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const currentInput = input;
        setInput("");
        setLoading(true);

        try {
            const res = await axiosBase.post('/ai/patient/chat', { message: currentInput });
            setMessages(prev => [...prev, { role: 'bot', content: res.data.data.answer }]);
        } catch (err) {
            console.error(err); 
            toast.error("Assistant is unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-screen bg-slate-50 shadow-2xl">
            {/* Header */}
            <div className="bg-teal-600 p-6 text-white text-center rounded-b-[40px] shadow-lg">
                <HeartPulse size={32} className="mx-auto mb-2 animate-pulse" />
                <h1 className="text-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <MessageCircle size={20} /> Health Buddy AI {/* MessageCircle use ho gaya (Warning 2 Fixed) */}
                </h1>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <button onClick={handleSymptomAnalysis} className="w-full py-4 bg-white border-2 border-dashed border-teal-200 rounded-3xl text-teal-700 font-black uppercase text-xs hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
                    <AlertTriangle size={16} /> Analyze My Symptoms
                </button>

                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm ${m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {/* Loader2 use ho gaya (Warning 3 Fixed) */}
                {loading && (
                    <div className="flex items-center gap-2 text-teal-600 font-bold text-[10px] uppercase tracking-widest">
                        <Loader2 className="animate-spin" size={14} /> Analyzing...
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t rounded-t-[40px]">
                <form onSubmit={handleChat} className="flex gap-2 items-center bg-slate-100 rounded-full px-4 py-1">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about diet, exercise..."
                        className="flex-1 bg-transparent border-none text-sm py-3 focus:ring-0"
                    />
                    <button type="submit" className="bg-teal-600 text-white p-2 rounded-full shadow-md hover:scale-110">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientAIChatPage;