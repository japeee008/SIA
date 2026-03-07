import React from 'react';
import { Menu } from 'lucide-react';

type ChatHeaderProps = {
  onMenuClick: () => void;
};
const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          {/* <div className="flex items-center gap-3">
            {/* <img 
              src="/wildcare.jpg" 
              alt="CITU-CARE Logo" 
              className="h-10 w-10 object-contain rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            /> */} 
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CITU-CARE</h1>
              <p className="text-xs text-gray-500">Chat Assistant</p>
            </div>
          {/* </div> */}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Always here to help</p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
