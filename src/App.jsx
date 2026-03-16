import { useSelector } from 'react-redux';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/layout/Layout';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not logged in, show Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If logged in, show the Dashboard Layout
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Hospital Control Center</h1>
        <p className="text-slate-400">Welcome back, <span className="text-blue-400">{user.name}</span>. You are authorized as <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">{user.role}</span>.</p>
      </div>
    </Layout>
  );
}

export default App;