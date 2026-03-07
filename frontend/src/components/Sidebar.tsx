import React from "react";
import { X, Plus, MessageSquare } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 w-64 h-screen bg-primary text-white transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
<div className="flex items-center justify-center py-6 border-b border-primary">
  <img
    src="/wildcare.jpg"
    alt="CITU CARE Logo"
    className="w-32 h-32 object-contain"
    onError={(e) => (e.target.style.display = "none")}
  />
</div>


        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="m-5 flex items-center justify-center gap-2 bg-secondary hover:bg-gray-50 text-black rounded-lg px-3 py-3 font-medium transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>

        {/* Scrollable middle section */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {categories.length > 0 && (
            <div className="py-4 border-t border-gray-800">
              <p className="text-xs font-semibold text-gray-400 mb-3">
                CATEGORIES
              </p>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelectCategory(category);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-red-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="text-sm">{category.categoryName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer intentionally left empty – no Settings/Admin buttons */}
      </div>
    </>
  );
};

export default Sidebar;
