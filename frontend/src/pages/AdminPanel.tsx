import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import CategoryManager from "../components/AdminComponents/CategoryManager";
import AdminDashboard from "../components/AdminComponents/AdminDashboard";
import DepartmentManager from "../components/AdminComponents/DepartmentManager";
import KnowledgeBaseManager from "../components/AdminComponents/KnowledgeBaseManager";
import UserManager from "../components/AdminComponents/UserManager";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab: string) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "departments" && <DepartmentManager />}
          {activeTab === "knowledge-base" && <KnowledgeBaseManager />}
          {activeTab === "users" && <UserManager />}
        </div>
      </div>
    </div>
  );
};

type AdminHeaderProps = {
  onMenuClick: () => void;
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
        >
          ☰
        </button>

        <div className="flex-1 flex items-center gap-2">
          <img
            src="/wildcare.jpg"
            alt="CITU-CARE Logo"
            className="h-8 w-8 object-contain rounded-full"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">CITU-CARE Admin</h1>
            <p className="text-sm text-gray-500">Manage your chatbot</p>
          </div>
        </div>

        <a
          href="/"
          className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          ← Back to Chat
        </a>
      </div>
    </header>
  );
};

export default AdminPanel;