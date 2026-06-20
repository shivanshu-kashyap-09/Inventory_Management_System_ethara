import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { Users, Plus, Trash2 } from "lucide-react";

const emptyCustomer = {
  full_name: "",
  email: "",
  phone_number: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyCustomer);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/customers/");
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openCreate = () => {
    setForm(emptyCustomer);
    setError("");
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setForm(emptyCustomer);
    setIsModalOpen(false);
  };

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submitCustomer = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/customers/", form);
      closeForm();
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save customer.");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer? This cannot be undone.")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete customer.");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Customers
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage your customer list and contact details.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={20} />
          Add Customer
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
              <th className="p-5">Full Name</th>
              <th className="p-5">Email Address</th>
              <th className="p-5">Phone Number</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-500">
                  Loading customers…
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-500">
                  <Users className="mx-auto mb-3 text-slate-300" size={44} />
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-5 font-bold text-slate-800">{customer.full_name}</td>
                  <td className="p-5 text-slate-600">{customer.email}</td>
                  <td className="p-5 text-slate-600">{customer.phone_number}</td>
                  <td className="p-5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => deleteCustomer(customer.id)}
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
        <Modal title="Add Customer" onClose={closeForm}>
          <form onSubmit={submitCustomer} className="grid grid-cols-1 gap-4">
            <Input
              label="Full Name"
              name="full_name"
              required
              value={form.full_name}
              onChange={updateField}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={updateField}
            />
            <Input
              label="Phone Number"
              name="phone_number"
              required
              value={form.phone_number}
              onChange={updateField}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">Create Customer</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
