import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import chatService from "../../services/chatService";

/* ================= TYPES ================= */

type Category = {
  id: number | string;
  categoryName: string;
  description?: string | null;
  createdAt?: string | Date | null;
  [key: string]: any;
};

type CategoryFormData = {
  categoryName: string;
  description: string;
};

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  isEditing: boolean;
  isLoading: boolean;
};

/* ================= COMPONENT ================= */

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    description: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await chatService.getCategories();
      setCategories(Array.isArray(data) ? (data as Category[]) : []);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODAL ================= */

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        categoryName: category.categoryName ?? "",
        description: category.description ?? "",
      });
    } else {
      setEditingId(null);
      setFormData({ categoryName: "", description: "" });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ categoryName: "", description: "" });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        await chatService.updateCategory(editingId, formData);
        setSuccess("Category updated successfully");
      } else {
        await chatService.createCategory(formData);
        setSuccess("Category created successfully");
      }

      handleCloseModal();
      fetchCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save category";
      setError(message);
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number | string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await chatService.deleteCategory(id);
      setSuccess("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    }
  };

  /* ================= FILTER ================= */

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage chatbot categories
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 font-medium">
                    {category.categoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-red-700 hover:bg-red-50 rounded"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
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
        <CategoryModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingId}
          isLoading={loading}
        />
      )}
    </div>
  );
};

/* ================= MODAL ================= */

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, categoryName: e.target.value })
            }
            placeholder="Category Name"
            className="w-full px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />

          <textarea
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-red-700 text-white py-2 rounded-lg">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryManager;