import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';

function App() {
  useEffect(() => {
    // Убираем скролл у body
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    return () => {
      // Возвращаем при размонтировании (на всякий случай)
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;