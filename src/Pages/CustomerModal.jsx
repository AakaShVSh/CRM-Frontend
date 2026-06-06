import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const emptyForm = {
  Name: "",
  Email: "",
  PhoneNumber: "",
  CompanyName: "",
  LeadStatus: "New",
  Notes: "Initial contact made. Follow up required.",
};

const CustomerModal = ({ initial, onSave, onClose,saving }) => {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const isEdit = !!initial?._id;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.Name.trim()) return toast.error("Customer name is required");
    if (!form.Email.trim()) return toast.error("Email address is required");
    if (!form.PhoneNumber.trim())
      return toast.error("Phone number is required");
    if (!form.CompanyName.trim())
      return toast.error("Company name is required");

    onSave(form);
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {isEdit ? "Edit Customer" : "Add Customer"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEdit
                  ? "Update customer details"
                  : "Create and manage customer leads"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Name
                </label>
                <input
                  name="Name"
                  value={form.Name}
                  onChange={handle}
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email
                </label>
                <input
                  name="Email"
                  value={form.Email}
                  onChange={handle}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone
                </label>
                <input
                  name="PhoneNumber"
                  value={form.PhoneNumber}
                  onChange={handle}
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Company
                </label>
                <input
                  name="CompanyName"
                  value={form.CompanyName}
                  onChange={handle}
                  type="text"
                  placeholder="ABC Pvt Ltd"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Lead Status
              </label>
              <select
                name="LeadStatus"
                value={form.LeadStatus}
                onChange={handle}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">🟢 New</option>
                <option value="Contacted">🔵 Contacted</option>
                <option value="Qualified">🟣 Qualified</option>
                <option value="Converted">✅ Converted</option>
                <option value="Lost">🔴 Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Notes
              </label>
              <textarea
                name="Notes"
                value={form.Notes}
                onChange={handle}
                rows={3}
                placeholder="Enter customer notes..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 font-medium hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Customer"
                  : "Save Customer"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;
