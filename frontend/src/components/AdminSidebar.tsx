import React from 'react';
import {
  X,
  LayoutDashboard,
  Layers,
  Briefcase,
  BookOpen,
  Users,
  LogOut
} from 'lucide-react';
type AdminSidebarProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

const AdminSidebar = ({ activeTab, onTabChange, isOpen, onClose }: AdminSidebarProps) => {
  // Read logged-in admin from localStorage
  let adminUser = null;
  try {
    const stored = localStorage.getItem('adminUser');
    adminUser = stored ? JSON.parse(stored) : null;
  } catch (e) {
    adminUser = null;
  }

  // Superadmin check: by role or explicit flag
  const isSuperAdmin =
  adminUser?.role?.toUpperCase() === 'SUPER_ADMIN' ||
  adminUser?.isSuperAdmin === true;

  // Full menu definition (for superadmin)
  const allMenuItems = [
    { id: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'categories',     label: 'Categories',     icon: Layers },
    { id: 'departments',    label: 'Departments',    icon: Briefcase },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'users',          label: 'Users',          icon: Users },
  ];

  // Dept admins: only Dashboard + Knowledge Base
  const visibleMenuItems = isSuperAdmin
    ? allMenuItems
    : allMenuItems.filter(item =>
        ['dashboard', 'knowledge-base'].includes(item.id)
      );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static md:translate-x-0 w-64 h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img
              src="/wildcare.jpg"
              alt="CITU-CARE Logo"
              className="h-8 w-8 object-contain rounded-full"
            />
            <h1 className="text-lg font-bold">Admin</h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
            onClick={() => {
              localStorage.removeItem('adminUser');
              localStorage.removeItem('isAdmin');
              window.location.href = '/';
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
