import React from 'react';
import AdminRoute from "./features/admin/AdminRoute";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ChatContainer from './features/chat/ChatContainer';
import AdminPanel from './features/admin/AdminPanel';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from "./features/auth/RegisterPage";
import UserLoginPage from "./features/auth/UserLoginPage";

import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";

import ErrorBoundary from './components/ErrorBoundary';
import { ChatProvider } from './features/chat/ChatContext';

function App() {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <Router>

          <Routes>

            {/* Default user login */}
            <Route path="/" element={<UserLoginPage />} />

            {/* Registration */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Forgot password */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Reset password */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

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