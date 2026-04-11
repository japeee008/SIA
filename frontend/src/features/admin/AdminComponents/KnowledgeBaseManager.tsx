import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle, Search } from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

/** --- Types --- */
type AdminUser = {
  fname?: string;
  lname?: string;
  role?: string;
  isSuperAdmin?: boolean;
  departmentName?: string;
  departmentId?: number | string;
  department?: {
    departmentId?: number | string;
    deptName?: string;
  };
  [key: string]: any;
};

type Category = {
  id: number | string;
  categoryName?: string;
  name?: string;
  description?: string;
};

type Department = {
  departmentId?: number | string;
  id?: number | string;
  deptName?: string;
  name?: string;
  email?: string;
  createdAt?: any;
};

type KbRow = {
  kbId: number | string;
  id?: number | string; // fallback
  title: string;
  questionPattern: string;
  answer: string;
  isPublished: boolean;
  categoryId?: number | string;
  departmentId?: number | string;
  category?: { id?: number | string; categoryName?: string; name?: string } | null;
  department?: { departmentId?: number | string; deptName?: string; name?: string } | null;
  createdBy?: string;
  updatedBy?: string;
};

type FormDataState = {
  title: string;
  questionPattern: string;
  answer: string;
  categoryId: string;    // keep as string for <select>
  departmentId: string;  // keep as string for <select>
  isPublished: boolean;
  createdBy: string;
  updatedBy: string;
};

type AlertState = string | null;

type KBModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  isEditing: boolean;
  isLoading: boolean;
  categories: Category[];
  departments: Department[];
  isSuperAdmin: boolean;
  adminDeptId: number | string | null;
  adminDeptName: string;
};

const KnowledgeBaseManager: React.FC = () => {
  const [kbList, setKbList] = useState<KbRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AlertState>(null);
  const [success, setSuccess] = useState<AlertState>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  /** ---- current admin info from localStorage ---- */
  const adminUser: AdminUser | null = useMemo(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      return stored ? (JSON.parse(stored) as AdminUser) : null;
    } catch {
      return null;
    }
  }, []);

  const adminDeptId: number | string | null =
    adminUser?.department?.departmentId ?? adminUser?.departmentId ?? null;

  const adminDeptName: string =
    adminUser?.department?.deptName ?? adminUser?.departmentName ?? "My Department";

  const isSuperAdmin: boolean =
    adminUser?.role === "SuperAdmin" || adminUser?.isSuperAdmin === true;

  const displayName: string = adminUser
    ? `${adminUser.fname || ""} ${adminUser.lname || ""}`.trim() || "Admin"
    : "Admin";

  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    questionPattern: "",
    answer: "",
    categoryId: "",
    departmentId: isSuperAdmin ? "" : adminDeptId != null ? String(adminDeptId) : "",
    isPublished: false,
    createdBy: displayName,
    updatedBy: displayName,
  });

  useEffect(() => {
    fetchKB();
    fetchCategories();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeKbRow = (row: any): KbRow => ({
    kbId: row.kbId ?? row.kb_id ?? row.id,
    id: row.id,
    title: row.title ?? "",
    questionPattern: row.questionPattern ?? row.question_pattern ?? "",
    answer: row.answer ?? "",
    isPublished: row.isPublished ?? row.is_published ?? false,

    categoryId: row.categoryId ?? row.category_id,
    departmentId: row.departmentId ?? row.department_id,

    category:
      row.category ||
      (row.category_id
        ? { id: row.category_id, categoryName: row.categoryName || row.category_name }
        : null),

    department:
      row.department ||
      (row.department_id
        ? { departmentId: row.department_id, deptName: row.departmentName || row.department_name }
        : null),

    createdBy: row.createdBy ?? row.created_by ?? "Admin",
    updatedBy: row.updatedBy ?? row.updated_by ?? "Admin",
  });

  const fetchKB = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/kb`, {
        params: isSuperAdmin ? {} : { departmentId: adminDeptId },
      });

      let raw = res.data;
      if (Array.isArray(raw)) {
        // ok
      } else if (Array.isArray(raw?.data)) {
        raw = raw.data;
      } else if (Array.isArray(raw?.content)) {
        raw = raw.content;
      } else {
        raw = [];
      }

      const normalized: KbRow[] = raw.map(normalizeKbRow);

      const filtered =
        !isSuperAdmin && adminDeptId != null
          ? normalized.filter((kb) => String(kb.department?.departmentId ?? kb.departmentId) === String(adminDeptId))
          : normalized;

      setKbList(filtered);
    } catch (err) {
      console.error("KB fetch error:", err);
      const message =
        axios.isAxiosError(err) ? (err.response?.data as any)?.message : undefined;

      setError(message || "Failed to fetch knowledge base");
      setKbList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const handleOpenModal = (kb: KbRow | null = null) => {
    if (kb) {
      setEditingId(kb.kbId ?? kb.id ?? null);

      setFormData({
        title: kb.title || "",
        questionPattern: kb.questionPattern || "",
        answer: kb.answer || "",
        categoryId: String(kb.category?.id ?? kb.categoryId ?? ""),
        departmentId: isSuperAdmin
          ? String(kb.department?.departmentId ?? kb.departmentId ?? "")
          : adminDeptId != null
            ? String(adminDeptId)
            : "",
        isPublished: !!kb.isPublished,
        createdBy: kb.createdBy || displayName,
        updatedBy: displayName,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        questionPattern: "",
        answer: "",
        categoryId: "",
        departmentId: isSuperAdmin ? "" : adminDeptId != null ? String(adminDeptId) : "",
        isPublished: false,
        createdBy: displayName,
        updatedBy: displayName,
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

    if (!formData.title.trim() || !formData.questionPattern.trim() || !formData.answer.trim()) {
      setError("Title, Question Pattern, and Answer are required");
      return;
    }

    const effectiveDeptId = isSuperAdmin ? formData.departmentId : (adminDeptId != null ? String(adminDeptId) : "");

    if (!formData.categoryId || !effectiveDeptId) {
      setError("Category and Department are required");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        questionPattern: formData.questionPattern,
        answer: formData.answer,
        category: { id: Number(formData.categoryId) },
        department: { departmentId: Number(effectiveDeptId) },
        isPublished: formData.isPublished,
        createdBy: formData.createdBy || displayName,
        updatedBy: displayName,
      };

      if (editingId != null) {
        await axios.put(`${API_BASE_URL}/kb/${editingId}`, payload);
        setSuccess("Knowledge Base updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/kb`, payload);
        setSuccess("Knowledge Base created successfully");
      }

      handleCloseModal();
      fetchKB();
    } catch (err) {
      const message =
        axios.isAxiosError(err) ? (err.response?.data as any)?.message : undefined;

      setError(message || "Failed to save knowledge base");
      console.error(err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this knowledge base entry?")) return;

    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`${API_BASE_URL}/kb/${id}`);
      setSuccess("Knowledge Base entry deleted successfully");
      fetchKB();
    } catch (err) {
      setError("Failed to delete knowledge base entry");
      console.error(err);
    }
  };

  const getCategoryName = (kb: KbRow) => kb.category?.categoryName || kb.category?.name || "N/A";
  const getDepartmentName = (kb: KbRow) => kb.department?.deptName || kb.department?.name || "N/A";

  const filteredKbList = kbList.filter((kb) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (kb.title || "").toLowerCase().includes(term) ||
      (kb.questionPattern || "").toLowerCase().includes(term) ||
      getCategoryName(kb).toLowerCase().includes(term) ||
      getDepartmentName(kb).toLowerCase().includes(term)
    );
  });

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-gray-600 text-sm mt-1">
            {isSuperAdmin ? "Manage KB articles and responses" : `Manage KB for ${adminDeptName}`}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* KB Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading knowledge base...</p>
          </div>
        ) : filteredKbList.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {hasSearch ? "No KB entries match your search." : "No KB entries yet. Create your first one!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKbList.map((kb) => (
                  <tr key={String(kb.kbId ?? kb.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{kb.title}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        Q: {(kb.questionPattern || "").substring(0, 40)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{getCategoryName(kb)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{getDepartmentName(kb)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          kb.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {kb.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(kb)}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(kb.kbId ?? kb.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <KBModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEditing={editingId != null}
          isLoading={loading}
          categories={categories}
          departments={departments}
          isSuperAdmin={isSuperAdmin}
          adminDeptId={adminDeptId}
          adminDeptName={adminDeptName}
        />
      )}
    </div>
  );
};

const KBModal: React.FC<KBModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  isLoading,
  categories,
  departments,
  isSuperAdmin,
  adminDeptId,
  adminDeptName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{isEditing ? "Edit KB Entry" : "Create KB Entry"}</h3>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., How to reset password?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={String(cat.id)} value={String(cat.id)}>
                    {cat.categoryName || cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Department *</label>

              {isSuperAdmin ? (
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => {
                    const id = dept.departmentId ?? dept.id ?? "";
                    return (
                      <option key={String(id)} value={String(id)}>
                        {dept.deptName || dept.name}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <select
                  value={adminDeptId != null ? String(adminDeptId) : ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                >
                  <option value={adminDeptId != null ? String(adminDeptId) : ""}>{adminDeptName}</option>
                </select>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Question Pattern *</label>
              <textarea
                value={formData.questionPattern}
                onChange={(e) => setFormData({ ...formData, questionPattern: e.target.value })}
                placeholder="e.g., How do I reset my password? or reset password"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Used for matching user queries</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Answer *</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide a detailed answer or response..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Created By</label>
              <input
                type="text"
                value={formData.createdBy}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mt-8">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="h-4 w-4 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-900">Publish</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KnowledgeBaseManager;