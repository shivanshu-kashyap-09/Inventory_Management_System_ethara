import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import {
  ArrowDownRight,
  ArrowRightLeft,
  ArrowUpRight,
  Download,
  Plus,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/transactions", {
        params: { limit: 100 },
      });
      setTransactions(data.transactions);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load transaction history.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(fetchTransactions);
    api
      .get("/products", { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products))
      .catch(() => {});
  }, [fetchTransactions]);
  const save = async (event) => {
    event.preventDefault();
    try {
      await api.post("/transactions", {
        ...form,
        quantity: Number(form.quantity),
      });
      setForm(null);
      fetchTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to record inventory movement.",
      );
    }
  };
  const exportCsv = () => {
    const rows = [
      ["Date", "Product", "SKU", "Type", "Quantity", "Processed by", "Remarks"],
      ...transactions.map((tx) => [
        new Date(tx.createdAt).toLocaleString(),
        tx.product?.name || "",
        tx.product?.sku || "",
        tx.type,
        tx.quantity,
        tx.user?.name || "",
        tx.remarks || "",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Transaction History
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Track and record all inventory movements.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download size={18} />
            Export CSV
          </Button>
          <Button
            onClick={() =>
              setForm({
                product: products[0]?._id || "",
                type: "IN",
                quantity: "1",
                remarks: "",
              })
            }
          >
            <Plus size={18} />
            Record movement
          </Button>
        </div>
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
              <th className="p-5">Date</th>
              <th className="p-5">Product</th>
              <th className="p-5">Movement</th>
              <th className="p-5">Quantity</th>
              <th className="p-5">Processed by</th>
              <th className="p-5">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500">
                  Loading transactions…
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500">
                  <ArrowRightLeft
                    className="mx-auto mb-3 text-slate-300"
                    size={44}
                  />
                  No transactions recorded.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-5 text-sm text-slate-600">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-slate-800">
                      {tx.product?.name || "Unknown product"}
                    </p>
                    <p className="text-xs text-slate-500">{tx.product?.sku}</p>
                  </td>
                  <td className="p-5">
                    {tx.type === "IN" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        <ArrowDownRight size={14} />
                        STOCK IN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                        <ArrowUpRight size={14} />
                        STOCK OUT
                      </span>
                    )}
                  </td>
                  <td className="p-5 font-bold text-slate-800">
                    {tx.type === "IN" ? "+" : "-"}
                    {tx.quantity}
                  </td>
                  <td className="p-5 text-sm text-slate-700">
                    {tx.user?.name || "System"}
                  </td>
                  <td className="p-5 text-sm text-slate-500">
                    {tx.remarks || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {form && (
        <Modal title="Record inventory movement" onClose={() => setForm(null)}>
          <form onSubmit={save} className="space-y-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Product
              <select
                required
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white p-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="" disabled>
                  Select product
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.currentStock} in stock)
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Movement type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white p-3 font-normal outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="IN">Stock in</option>
                <option value="OUT">Stock out</option>
              </select>
            </label>
            <Input
              label="Quantity"
              type="number"
              min="1"
              step="1"
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Remarks (optional)
              <textarea
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                rows="3"
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
              <Button type="submit">Record movement</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default Transactions;
