import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIChatWidget from "../../pages/Ai/AIChatWidget";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* 2. AI Chat Floating Button yahan add kiya */}
            <AIChatWidget />
        </div>
    );
};

export default Layout;