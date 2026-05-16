import React from "react";
import { Plus, MessageSquare } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  categories,
  selectedCategory,
  onSelectCategory,
  openSettings,
  chatHistory,
  onSelectHistory
}: any) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 w-64 h-screen bg-primary text-white transition-transform duration-300 ease-in-out z-50 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center py-6 border-b border-primary">
          <img
            src="/wildcare.jpg"
            alt="CITU CARE Logo"
            className="w-32 h-32 object-contain"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        </div>

        {/* New Chat */}
        <div className="flex-shrink-0 px-5 py-5">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-gray-50 text-black rounded-lg px-3 py-3 font-medium transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Scrollable middle section */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sidebar-scroll">
          {/* Chat History */}
          {chatHistory?.length > 0 && (
            <div className="pb-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">
                RECENT CHATS
              </p>

              <div className="space-y-1">
                {chatHistory.map((chat: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectHistory(chat);
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
                  >
                    <MessageSquare size={16} className="flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {categories?.length > 0 && (
            <div className="py-4 border-t border-gray-800">
              <p className="text-xs font-semibold text-gray-400 mb-3">
                EXPLORE TOPICS
              </p>

              <div className="space-y-2">
                {categories.map((category: any) => (
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
            </div>
          )}
        </div>

        {/* Settings - fixed at bottom */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-800 bg-primary">
          <button
            onClick={openSettings}
            className="w-full bg-yellow-400 text-black rounded-lg px-4 py-3 font-medium hover:bg-yellow-300 transition"
          >
            Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;