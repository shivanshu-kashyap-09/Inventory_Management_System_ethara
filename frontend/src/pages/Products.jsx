import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { Edit, Package, Plus, Trash2 } from "lucide-react";

const emptyProduct = {
  name: "",
  sku: "",
  price: "",
  quantity_in_stock: "0",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products/");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreate = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setIsModalOpen(false);
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
      quantity_in_stock: Number(form.quantity_in_stock),
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products/", payload);
      closeForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete product.");
    }
  };

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
        <Button onClick={openCreate}>
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
        >
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-5">Product Name</th>
              <th className="p-5">SKU / Code</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock</th>
              <th className="p-5 text-right">Actions</th>
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
                  key={product.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-5 font-bold text-slate-800">{product.name}</td>
                  <td className="p-5 text-slate-600">{product.sku}</td>
                  <td className="p-5 font-bold text-slate-800">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="p-5">
                    <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                      {product.quantity_in_stock} in stock
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          title={editingId ? "Edit Product" : "Add Product"}
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
              label="SKU / Code"
              name="sku"
              required
              value={form.sku}
              onChange={updateField}
            />
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
              label="Quantity in stock"
              name="quantity_in_stock"
              type="number"
              min="0"
              required
              value={form.quantity_in_stock}
              onChange={updateField}
            />
            <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
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
