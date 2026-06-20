import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { ShoppingCart, Plus, Trash2, Eye } from "lucide-react";

const emptyOrder = {
  customer_id: "",
  product_id: "",
  quantity: "1",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyOrder);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        api.get("/orders/"),
        api.get("/customers/"),
        api.get("/products/"),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openCreate = () => {
    setForm({
      customer_id: customers[0]?.id || "",
      product_id: products[0]?.id || "",
      quantity: "1",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setForm(emptyOrder);
    setIsModalOpen(false);
  };

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submitOrder = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        customer_id: Number(form.customer_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
      };
      await api.post("/orders/", payload);
      closeForm();
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create order.");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete order.");
    }
  };

  const getCustomerName = (id) => {
    const cust = customers.find((c) => c.id === id);
    return cust ? cust.full_name : "Unknown Customer";
  };

  const getProductName = (id) => {
    const prod = products.find((p) => p.id === id);
    return prod ? prod.name : "Unknown Product";
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Orders
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Create and track customer orders.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={20} />
          Create Order
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
              <th className="p-5">Order ID</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Product</th>
              <th className="p-5">Quantity</th>
              <th className="p-5">Total Amount</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500">
                  Loading orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500">
                  <ShoppingCart className="mx-auto mb-3 text-slate-300" size={44} />
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-5 font-bold text-slate-800">#{order.id}</td>
                  <td className="p-5 text-slate-600">{getCustomerName(order.customer_id)}</td>
                  <td className="p-5 text-slate-600">{getProductName(order.product_id)}</td>
                  <td className="p-5 text-slate-600">{order.quantity}</td>
                  <td className="p-5 font-bold text-slate-800">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
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
        <Modal title="Create Order" onClose={closeForm}>
          <form onSubmit={submitOrder} className="grid grid-cols-1 gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Customer
              <select
                name="customer_id"
                required
                value={form.customer_id}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled>Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Product
              <select
                name="product_id"
                required
                value={form.product_id}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled>Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </select>
            </label>

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              required
              value={form.quantity}
              onChange={updateField}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">Place Order</Button>
            </div>
          </form>
        </Modal>
      )}

      {viewOrder && (
        <Modal title="Order Details" onClose={() => setViewOrder(null)}>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Order ID</h3>
              <p className="text-lg font-bold text-slate-800">#{viewOrder.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Customer</h3>
              <p className="text-lg text-slate-800">{getCustomerName(viewOrder.customer_id)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Product</h3>
              <p className="text-lg text-slate-800">{getProductName(viewOrder.product_id)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Quantity</h3>
              <p className="text-lg text-slate-800">{viewOrder.quantity}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500">Total Amount</h3>
              <p className="text-2xl font-bold text-indigo-600">${Number(viewOrder.total_amount).toFixed(2)}</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={() => setViewOrder(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
