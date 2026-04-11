// frontend/src/components/AdminComponents/UserManager.tsx

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

type Id = string | number;

type Department = {
  departmentId?: Id;
  id?: Id;
  deptName?: string;
  name?: string;
};

type User = {
  userId?: Id;
  id?: Id;
  fname?: string;
  lname?: string;
  email?: string;
  role?: string;
  department?: Department | null;
};

type UserFormData = {
  fname: string;
  lname: string;
  email: string;
  password: string;
  departmentId: string;
};

type UserPayload = {
  fname: string;
  lname: string;
  email: string;
  role: string;
  department: { departmentId: number };
  password?: string;
};

const getId = (obj: { id?: Id; userId?: Id }): Id | undefined =>
  obj.userId ?? obj.id;

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    departmentId: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    setError(null);
    setSuccess(null);

    if (user) {
      setEditingId(getId(user) ?? null);

      const deptId =
        user.department?.departmentId ??
        user.department?.id ??
        "";

      setFormData({
        fname: user.fname ?? "",
        lname: user.lname ?? "",
        email: user.email ?? "",
        password: "",
        departmentId: deptId ? String(deptId) : "",
      });
    } else {
      setEditingId(null);

      setFormData({
        fname: "",
        lname: "",
        email: "",
        password: "",
        departmentId: "",
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!formData.fname || !formData.lname || !formData.email) {
      setError("Name and Email are required");
      return;
    }

    if (!formData.departmentId) {
      setError("Department is required");
      return;
    }

    if (!editingId && !formData.password) {
      setError("Password is required");
      return;
    }

    const payload: UserPayload = {
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      email: formData.email.trim(),
      role: "ADMIN",
      department: { departmentId: Number(formData.departmentId) },
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/users/${editingId}`, payload);
        setSuccess("User updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/users`, payload);
        setSuccess("User created successfully");
      }

      handleCloseModal();
      fetchUsers();
    } catch (err) {
      const ax = err as AxiosError<any>;
      setError(ax.response?.data?.message || "Failed to save user");
    }
  };

  const handleDelete = async (id?: Id) => {
    if (!id) return;

    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      setSuccess("User deleted");
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  const getDepartmentName = (user: User) =>
    user.department?.deptName ||
    user.department?.name ||
    "N/A";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Users</h2>
          <p className="text-gray-600 text-sm">Manage admin accounts</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex gap-3">
          <AlertCircle className="text-red-600" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 p-4 flex gap-3">
          <CheckCircle className="text-green-600" />
          <p>{success}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-8 text-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">No users yet</div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {users.map((user) => (
                <tr key={String(getId(user))}>

                  <td className="px-6 py-4">
                    {user.fname} {user.lname}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {user.role}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {getDepartmentName(user)}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(getId(user))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        )}

      </div>

      {showModal && (
        <UserModal
          formData={formData}
          setFormData={setFormData}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isEditing={editingId != null}
          departments={departments}
        />
      )}
    </div>
  );
};

type ModalProps = {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isEditing: boolean;
  departments: Department[];
};

const UserModal: React.FC<ModalProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
  departments
}) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-full max-w-md">

        <h3 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Admin" : "Create Admin"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">

          <input
            placeholder="First Name"
            value={formData.fname}
            onChange={(e) =>
              setFormData((p) => ({ ...p, fname: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Last Name"
            value={formData.lname}
            onChange={(e) =>
              setFormData((p) => ({ ...p, lname: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded"
          />

          {!isEditing && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />
          )}

          <select
            value={formData.departmentId}
            onChange={(e) =>
              setFormData((p) => ({ ...p, departmentId: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Department</option>

            {departments.map((d) => {
              const id = d.departmentId ?? d.id;
              return (
                <option key={String(id)} value={String(id)}>
                  {d.deptName || d.name}
                </option>
              );
            })}
          </select>

          <div className="flex gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-red-700 text-white px-4 py-2 rounded"
            >
              {isEditing ? "Update" : "Create"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UserManager;