import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

type ChatHeaderProps = {
  onMenuClick: () => void;
};

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {

  const [avatar, setAvatar] = useState("/default-avatar.png");

  const loadAvatar = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.profile_photo) {
      setAvatar(user.profile_photo);
    } else if (user?.userId) {
      setAvatar(
        `https://bnygvxesmbiumvwrjjmy.supabase.co/storage/v1/object/public/profile-photos/avatars/${user.userId}.jpg?t=${Date.now()}`
      );
    } else {
      setAvatar("/default-avatar.png");
    }
  };

  useEffect(() => {

    loadAvatar();

    const handleStorageChange = () => {
      loadAvatar();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };

  }, []);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              CITU-CARE
            </h1>
            <p className="text-xs text-gray-500">
              Chat Assistant
            </p>
          </div>

        </div>

        {/* RIGHT SIDE - PROFILE AVATAR */}
        <div className="flex items-center">

          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer hover:opacity-90 transition"
          />

        </div>

      </div>
    </header>
  );
};

export default ChatHeader;