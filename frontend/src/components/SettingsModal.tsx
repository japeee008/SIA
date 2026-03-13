import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/", { replace: true });
  };

  const handleClearChat = () => {
    alert("Chat history cleared");
  };

  if (!isOpen) return null;

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >

      {/* Modal */}
      <div
        className="bg-white w-[900px] h-[520px] rounded-lg shadow-xl flex overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X size={20}/>
        </button>

        {/* LEFT MENU */}
        <div className="w-[260px] bg-primary text-white flex flex-col p-6 space-y-6">

          <button
            onClick={() => setActiveTab("general")}
            className={`text-left transition ${
              activeTab === "general"
                ? "font-semibold underline"
                : "hover:underline"
            }`}
          >
            General
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`text-left transition ${
              activeTab === "account"
                ? "font-semibold underline"
                : "hover:underline"
            }`}
          >
            Account
          </button>

          <button
            onClick={() => setActiveTab("personalization")}
            className={`text-left transition ${
              activeTab === "personalization"
                ? "font-semibold underline"
                : "hover:underline"
            }`}
          >
            Personalization
          </button>

          <button
            onClick={handleLogout}
            className="text-left text-secondary font-semibold hover:underline"
          >
            Logout
          </button>

        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* GENERAL */}
          {activeTab === "general" && (
            <div>

              <h2 className="text-xl font-semibold mb-6">
                General Settings
              </h2>

              <button
                onClick={handleClearChat}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Clear Chat History
              </button>

              <div className="mt-8">

                <label className="block mb-2 font-medium">
                  Language Preference
                </label>

                <select className="border px-3 py-2 rounded">
                  <option>English</option>
                  <option>Filipino</option>
                </select>

              </div>

            </div>
          )}

          {/* ACCOUNT */}
          {activeTab === "account" && (
            <div>

              <h2 className="text-xl font-semibold mb-6">
                Account
              </h2>

              <p className="mb-2">
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>

              <p className="mb-6">
                <strong>Role:</strong>{" "}
                {localStorage.getItem("isAdmin") === "true"
                  ? "Administrator"
                  : "Student"}
              </p>

              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={() => alert("Change password coming soon")}
              >
                Change Password
              </button>

            </div>
          )}

          {/* PERSONALIZATION */}
          {activeTab === "personalization" && (
            <div>

              <h2 className="text-xl font-semibold mb-6">
                Personalization
              </h2>

              <div className="mb-6">

                <label className="block mb-2 font-medium">
                  Chat Theme
                </label>

                <select className="border px-3 py-2 rounded">
                  <option>Default</option>
                  <option>Dark</option>
                  <option>CIT-U Red</option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Font Size
                </label>

                <select className="border px-3 py-2 rounded">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>

  );
};

export default SettingsModal;