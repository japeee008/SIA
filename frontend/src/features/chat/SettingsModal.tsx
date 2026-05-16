import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  Shield,
  LogOut,
  Mail,
  CreditCard,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(storedUser);

  const [activeTab, setActiveTab] = useState<"account" | "security">("account");

  const fullName = `${user?.fname || ""} ${user?.lname || ""}`.trim();
  const displayName = fullName || user?.email || "User";

  const avatarUrl = user?.userId
    ? `https://bnygvxesmbiumvwrjjmy.supabase.co/storage/v1/object/public/profile-photos/avatars/${user.userId}.jpg`
    : "";

  const [profilePhoto, setProfilePhoto] = useState(
    user?.profile_photo ||
      (avatarUrl ? `${avatarUrl}?t=${Date.now()}` : "/default-avatar.png")
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user?.fname || "");
  const [lastName, setLastName] = useState(user?.lname || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const roleLabel =
    localStorage.getItem("isAdmin") === "true"
      ? "Administrator"
      : user?.role === "USER"
      ? "Student"
      : user?.role || "Student";

  const institutionalId =
    user?.institutionalId ||
    user?.institutional_id ||
    user?.studentId ||
    "Not available";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/", { replace: true });
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("First name and last name are required.");
      return;
    }

    if (!user?.userId) {
      alert("User not found.");
      return;
    }

    try {
      setIsSavingProfile(true);

      const res = await fetch(
        `https://citucare-backend.onrender.com/api/users/${user.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fname: firstName.trim(),
            lname: lastName.trim(),
            email: user.email,
            role: user.role
          })
        }
      );

      if (!res.ok) {
        const text = await res.text();
        alert(text || "Failed to update profile.");
        return;
      }

      const updatedUser = {
        ...user,
        fname: firstName.trim(),
        lname: lastName.trim()
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingProfile(false);

      window.dispatchEvent(new Event("profile-updated"));

      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (!user?.userId) {
      alert("User not found.");
      return;
    }

    try {
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

      const updatedUser = {
        ...user,
        profile_photo: photoUrl
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfilePhoto(photoUrl);

      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile photo.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      setIsChangingPassword(true);

      const res = await fetch(
        "https://citucare-backend.onrender.com/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.userId,
            currentPassword,
            newPassword
          })
        }
      );

      const text = await res.text();

      if (!res.ok) {
        alert(text || "Failed to update password.");
        return;
      }

      alert("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderPasswordInput = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string,
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
        />

        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-[620px] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={21} />
        </button>

        {/* LEFT NAV */}
        <aside className="flex w-[245px] flex-col bg-primary p-5 text-white">
          <div className="mb-7">
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="mt-1 text-xs text-white/70">Manage your account</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activeTab === "account"
                  ? "bg-white text-primary shadow"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <User size={18} />
              Account
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activeTab === "security"
                  ? "bg-white text-primary shadow"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <Shield size={18} />
              Security
            </button>
          </div>

          <div className="mt-auto border-t border-white/15 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-secondary transition hover:bg-white/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {activeTab === "account" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Account</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your profile information.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="relative h-24 w-24 shrink-0">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.png";
                      }}
                      className="h-24 w-24 rounded-full border-4 border-yellow-400 object-cover shadow-sm"
                    />

                    <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow transition hover:opacity-90">
                      <Camera size={17} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xl font-bold text-gray-900">
                      {displayName}
                    </h4>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {roleLabel}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <CreditCard size={14} />
                          Institutional ID
                        </div>
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {institutionalId}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <Mail size={14} />
                          Email
                        </div>
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user?.email || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Profile Details
                    </h4>
                    <p className="text-sm text-gray-500">
                      Update your displayed first and last name.
                    </p>
                  </div>

                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setFirstName(user?.fname || "");
                        setLastName(user?.lname || "");
                        setIsEditingProfile(false);
                      }}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      <Save size={16} />
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Change your password to keep your account secure.
                </p>
              </div>

              <div className="max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-primary">
                    <Lock size={21} />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Change Password
                    </h4>
                    <p className="text-sm text-gray-500">
                      Use a strong password you do not use elsewhere.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {renderPasswordInput(
                    currentPassword,
                    setCurrentPassword,
                    "Current password",
                    showCurrentPassword,
                    setShowCurrentPassword
                  )}

                  {renderPasswordInput(
                    newPassword,
                    setNewPassword,
                    "New password",
                    showNewPassword,
                    setShowNewPassword
                  )}

                  {renderPasswordInput(
                    confirmPassword,
                    setConfirmPassword,
                    "Confirm new password",
                    showConfirmPassword,
                    setShowConfirmPassword
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsModal;