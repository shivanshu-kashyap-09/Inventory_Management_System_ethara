import { useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/auth";
import { Edit, Plus, Tags, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

const Categories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const canManage = user?.role === "admin";
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(fetchCategories);
  }, [fetchCategories]);
  const save = async (event) => {
    event.preventDefault();
    try {
      if (form._id) await api.put(`/categories/${form._id}`, form);
      else await api.post("/categories", form);
      setForm(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save category.");
    }
  };
  const remove = async (category) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    try {
      await api.delete(`/categories/${category._id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete category.");
    }
  };
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Product Categories
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Organize your inventory with clear categories.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setForm({ name: "", description: "" })}>
            <Plus size={20} />
            Add Category
          </Button>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
        >
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="col-span-full p-10 text-center text-slate-500">
            Loading categories…
          </p>
        ) : categories.length === 0 ? (
          <div className="col-span-full rounded-2xl border bg-white p-12 text-center text-slate-500">
            <Tags className="mx-auto mb-3 text-slate-300" size={44} />
            No categories yet.
          </div>
        ) : (
          categories.map((category) => (
            <article
              key={category._id}
              className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <Tags className="mb-4 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">
                {category.name}
              </h2>
              <p className="mt-2 min-h-10 text-sm text-slate-500">
                {category.description || "No description provided."}
              </p>
              {canManage && (
                <div className="mt-5 flex justify-end gap-1 border-t pt-4">
                  <button
                    aria-label={`Edit ${category.name}`}
                    onClick={() => setForm(category)}
                    className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    aria-label={`Delete ${category.name}`}
                    onClick={() => remove(category)}
                    className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
      {form && (
        <Modal
          title={form._id ? "Edit category" : "Add category"}
          onClose={() => setForm(null)}
        >
          <form onSubmit={save} className="space-y-4">
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Description
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="4"
                className="rounded-xl border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save category</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default Categories;
