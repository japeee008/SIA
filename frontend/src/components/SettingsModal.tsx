import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ---------------- AVATAR ---------------- */

  const avatarUrl = user?.userId
    ? `https://bnygvxesmbiumvwrjjmy.supabase.co/storage/v1/object/public/profile-photos/avatars/${user.userId}.jpg`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [profilePhoto, setProfilePhoto] = useState(
    `${avatarUrl}?t=${Date.now()}`
  );

  /* ---------------- PROFILE EDIT ---------------- */

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [firstName, setFirstName] = useState(user?.fname || "");
  const [lastName, setLastName] = useState(user?.lname || "");

  const handleSaveProfile = async () => {

  try {

    const res = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fname: firstName,
        lname: lastName,
        email: user.email,
        role: user.role
      })
    });

    if (!res.ok) {
      const text = await res.text();
      alert(text);
      return;
    }

    const updatedUser = {
      ...user,
      fname: firstName,
      lname: lastName
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated");
    setIsEditingProfile(false);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }

};

  /* ---------------- PASSWORD STATES ---------------- */

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/", { replace: true });
  };

  /* ---------------- CHAT ---------------- */

  const handleClearChat = () => {
    alert("Chat history cleared");
  };

  /* ---------------- PHOTO UPLOAD ---------------- */

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (!user?.userId) {
      alert("User not found");
      return;
    }

    const filePath = `avatars/${user.userId}.jpg`;

    const { error } = await supabase.storage
      .from("profile-photos")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(filePath);

    const photoUrl = `${data.publicUrl}?t=${Date.now()}`;

    setProfilePhoto(photoUrl);
  };

  /* ---------------- CHANGE PASSWORD ---------------- */

  const handleChangePassword = async () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {

      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.userId,
          currentPassword,
          newPassword
        })
      });

      const text = await res.text();

      if (!res.ok) {
        alert(text);
        return;
      }

      alert("Password updated successfully");

      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (!isOpen) return null;

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >

      <div
        className="bg-white w-[900px] h-[520px] rounded-lg shadow-xl flex overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X size={20}/>
        </button>

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

        <div className="flex-1 p-8 overflow-y-auto">

          {activeTab === "account" && (
            <div>

              <h2 className="text-xl font-semibold mb-6">
                Account
              </h2>

              {/* PROFILE PHOTO */}

              <div className="mb-8">

                <label className="block font-medium mb-3">
                  Profile Photo
                </label>

                <div className="flex items-center gap-6">

                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border"
                  />

                  {isEditingProfile && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JPG or PNG recommended
                      </p>
                    </div>
                  )}

                </div>

              </div>

              {/* FULL NAME */}

              <div className="mb-4">

                <label className="block font-medium mb-2">
                  Full Name
                </label>

                {isEditingProfile ? (

                  <div className="flex gap-2">

                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="border px-3 py-2 rounded w-full"
                    />

                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="border px-3 py-2 rounded w-full"
                    />

                  </div>

                ) : (

                  <p className="text-gray-700">
                    {user?.fname} {user?.lname}
                  </p>

                )}

              </div>

              <p className="mb-2">
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>

              <p className="mb-6">
                <strong>Role:</strong>{" "}
                {localStorage.getItem("isAdmin") === "true"
                  ? "Administrator"
                  : "Student"}
              </p>

              {/* EDIT PROFILE BUTTONS */}

              {!isEditingProfile ? (

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded hover:opacity-90"
                >
                  Edit Profile
                </button>

              ) : (

                <div className="flex gap-3 mb-6">

                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveProfile}
                    className="bg-yellow-500 text-black px-4 py-2 rounded"
                  >
                    Save
                  </button>

                </div>

              )}

              {/* CHANGE PASSWORD */}

              {!showPasswordForm ? (

                <button
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>

              ) : (

                <div className="space-y-3 max-w-sm">

                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />

                  <div className="flex gap-2">

                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="border px-4 py-2 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                    >
                      Update Password
                    </button>

                  </div>

                </div>

              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default SettingsModal;