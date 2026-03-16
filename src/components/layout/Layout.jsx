/* eslint-disable react/prop-types */
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-[#0f172a] min-h-screen font-sans antialiased">
            <Sidebar />
            <main className="flex-1 p-8 text-white">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;