import ReactDOM from 'react-dom/client'; // React hata diya, sirf ReactDOM rakha
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* Global Toast Configuration for AI Notifications */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1e293b', // Dark Slate for professional look
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 20px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' }, // Emerald for Success
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' }, // Rose for Errors
        }
      }}
    />
    <App />
  </Provider>
);