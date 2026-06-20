import { useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import {
  AlertTriangle,
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const emptyProduct = {
  name: "",
  sku: "",
  description: "",
  category: "",
  price: "",
  currentStock: "0",
  lowStockThreshold: "10",
};

const Products = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { page, search: query },
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
  }, [fetchProducts]);
  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setForm({ ...emptyProduct, category: categories[0]?._id || "" });
    setEditingId(null);
    setError("");
  };
  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category?._id || product.category,
      price: String(product.price),
      currentStock: String(product.currentStock),
      lowStockThreshold: String(product.lowStockThreshold),
    });
    setError("");
  };
  const closeForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };
  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submitProduct = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      currentStock: Number(form.currentStock),
      lowStockThreshold: Number(form.lowStockThreshold),
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      closeForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product.");
    }
  };
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };
  const canManage = user?.role === "admin";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Products Inventory
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage your catalog, stock levels, and pricing.
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreate}>
            <Plus size={20} />
            Add Product
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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(search);
        }}
        className="flex max-w-md gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            aria-label="Search products"
            className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-5">Product</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock</th>
              {canManage && <th className="p-5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  Loading products…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  <Package className="mx-auto mb-3 text-slate-300" size={44} />
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-5">
                    <p className="font-bold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  </td>
                  <td className="p-5 text-sm text-slate-600">
                    {product.category?.name || "Uncategorized"}
                  </td>
                  <td className="p-5 font-bold text-slate-800">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="p-5">
                    <span
                      className={
                        product.currentStock <= product.lowStockThreshold
                          ? "inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700"
                          : "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                      }
                    >
                      {product.currentStock <= product.lowStockThreshold && (
                        <AlertTriangle size={13} />
                      )}{" "}
                      {product.currentStock} in stock
                    </span>
                  </td>
                  {canManage && (
                    <td className="p-5">
                      <div className="flex justify-end gap-1">
                        <button
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          aria-label={`Delete ${product.name}`}
                          onClick={() => deleteProduct(product._id)}
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
      {(editingId || form.category) && (
        <Modal
          title={editingId ? "Edit product" : "Add product"}
          onClose={closeForm}
        >
          <form
            onSubmit={submitProduct}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Input
              label="Name"
              name="name"
              required
              value={form.name}
              onChange={updateField}
            />
            <Input
              label="SKU"
              name="sku"
              required
              value={form.sku}
              onChange={updateField}
            />
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Category
              <select
                name="category"
                required
                value={form.category}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={updateField}
            />
            <Input
              label="Opening stock"
              name="currentStock"
              type="number"
              min="0"
              required
              value={form.currentStock}
              onChange={updateField}
            />
            <Input
              label="Low-stock threshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              required
              value={form.lowStockThreshold}
              onChange={updateField}
            />
            <label className="sm:col-span-2 flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Description
              <textarea
                name="description"
                required
                value={form.description}
                onChange={updateField}
                rows="3"
                className="rounded-xl border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Save changes" : "Create product"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
