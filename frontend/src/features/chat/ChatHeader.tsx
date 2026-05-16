import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

type ChatHeaderProps = {
  onMenuClick: () => void;
  onProfileClick: () => void;
};

const ChatHeader = ({ onMenuClick, onProfileClick }: ChatHeaderProps) => {
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [initial, setInitial] = useState("U");

  const loadAvatar = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fullName = `${user?.fname || ""} ${user?.lname || ""}`.trim();
    const displayName = fullName || user?.email || "User";

    setInitial(displayName.charAt(0).toUpperCase() || "U");

    if (user?.profile_photo) {
      setAvatar(user.profile_photo);
      return;
    }

    if (user?.userId) {
      setAvatar(
        `https://bnygvxesmbiumvwrjjmy.supabase.co/storage/v1/object/public/profile-photos/avatars/${user.userId}.jpg?t=${Date.now()}`
      );
      return;
    }

    setAvatar("/default-avatar.png");
  };

  useEffect(() => {
    loadAvatar();

    const handleProfileUpdate = () => {
      loadAvatar();
    };

    window.addEventListener("storage", handleProfileUpdate);
    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleProfileUpdate);
      window.removeEventListener("profile-updated", handleProfileUpdate);
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
            <h1 className="text-2xl font-bold text-gray-900">CITU-CARE</h1>
            <p className="text-xs text-gray-500">Chat Assistant</p>
          </div>
        </div>

        {/* RIGHT SIDE - PROFILE AVATAR */}
        <button
          type="button"
          onClick={onProfileClick}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-100 shadow-sm transition hover:scale-105 hover:shadow-md"
          title="Open settings"
        >
          <img
            src={avatar}
            alt="Profile"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
            className="h-full w-full rounded-full object-cover"
          />

          <span className="absolute inset-0 hidden items-center justify-center rounded-full text-sm font-bold text-primary group-has-[img[style*='display: none']]:flex">
            {initial}
          </span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;