import React from 'react';
import AdminRoute from "./routes/AdminRoute";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatContainer from './components/ChatContainer';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './components/LoginPage'; 
import ErrorBoundary from './components/ErrorBoundary';
import { ChatProvider } from './context/ChatContext';
import RegisterPage from "./components/RegisterPage";
import UserLoginPage from "./components/UserLoginPage";

function App() {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <Router>
          <Routes>

            {/* Default page */}
            <Route path="/" element={<UserLoginPage />} />

            {/* Registration */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Chatbot */}
            <Route
              path="/chat"
              element={
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
                  <ChatContainer />
                </div>
              }
            />

            {/* Admin login */}
            <Route path="/admin-login" element={<LoginPage />} />

            {/* Admin panel */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

          </Routes>
        </Router>
      </ChatProvider>
    </ErrorBoundary>
  );
}

export default App;
