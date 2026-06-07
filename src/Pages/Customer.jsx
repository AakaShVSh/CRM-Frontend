import React, { useEffect, useState } from "react";
import {
  searchCustomerApi,
  addCustomerApi,
  getCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../apis/customerApi";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomerModal from "./CustomerModal";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const statusStyles = {
  New: "bg-green-100 text-green-700",
  Contacted: "bg-blue-100 text-blue-700",
  Qualified: "bg-purple-100 text-purple-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Lost: "bg-red-100 text-red-700",
};

const ITEMS_PER_PAGE = 10;

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const setCurrentPage = (page) => setSearchParams({ page });

  const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await getCustomerApi();
      setCustomers(customersData.data);
      setFiltered(customersData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        let result = [];
        if (search.trim()) {
          const res = await searchCustomerApi(search);
          result = res.data ?? res;
        } else {
          result = [...customers];
        }
        if (statusFilter)
          result = result.filter((c) => c.LeadStatus === statusFilter);
        if (sort === "Ascending")
          result.sort((a, b) => a.Name?.localeCompare(b.Name));
        if (sort === "Descending")
          result.sort((a, b) => b.Name?.localeCompare(a.Name));
        setCurrentPage(1);
        setFiltered(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search, statusFilter, sort, customers]);
const handleSave = async (form) => {
  try {
    setSaving(true);
    if (form._id) {
      const { _id, ...rest } = form; 
      await updateCustomerApi(_id, rest); 
    } else {
      await addCustomerApi(form);
    }
    await fetchCustomers();
    setModal(null);
    toast.success(form._id ? "Customer updated!" : "Customer added!");
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setSaving(false);
  }
};
 
const handleStatusChange = async (customer, newStatus) => {
  const updated = { ...customer, LeadStatus: newStatus };

  const updateList = (prev) =>
    prev.map((c) => (c._id === customer._id ? updated : c));

  setCustomers(updateList);
  setFiltered(updateList);

  try {
    const { _id, ...rest } = updated; 
    await updateCustomerApi(_id, rest); 
    toast.success("Status updated");
  } catch {
    const revert = (prev) =>
      prev.map((c) => (c._id === customer._id ? customer : c));
    setCustomers(revert);
    setFiltered(revert);
    toast.error("Failed to update status");
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomerApi(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      toast.success("Customer deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
      ))}
    </div>
  );

  const Pagination = ({ mobile = false }) => (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 ${!mobile ? "border-t border-slate-100" : "mt-3"}`}
    >
      <p className="text-xs text-slate-400">
        {mobile
          ? `Page ${currentPage} of ${totalPages}`
          : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} customers`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>

        {!mobile &&
          Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1,
            )
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
              acc.push(page);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`e-${idx}`} className="px-2 text-slate-400 text-xs">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`w-8 h-8 text-xs rounded-lg border transition font-medium
                  ${
                    currentPage === item
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  );

  return (
<div className="min-h-screen bg-slate-100 p-3 sm:p-4 pt-3 sm:pt-4 lg:pt-4">
      {modal !== null && (
        <CustomerModal
          initial={modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">
              All Customers
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Manage and track all customer leads
            </p>
          </div>
          <button
            onClick={() => setModal({})}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium text-sm transition whitespace-nowrap shrink-0"
          >
            + Add Customer
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, email, company..."
            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm flex-1 sm:flex-none"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm flex-1 sm:flex-none"
            >
              <option value="">Sort</option>
              <option value="Ascending">A → Z</option>
              <option value="Descending">Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET — cards ── */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : paginated?.length === 0 ? (
          <div className="bg-white rounded-2xl py-16 text-center text-slate-400 text-sm">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🔍</span>
              No customers found.
            </div>
          </div>
        ) : (
          paginated.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {e.Name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {e.Name}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[180px]">
                      {e.Email}
                    </p>
                  </div>
                </div>
                <select
                  value={e.LeadStatus}
                  onChange={(event) =>
                    handleStatusChange(e, event.target.value)
                  }
                  className={`text-xs font-medium px-2 py-1 rounded-lg border-0 outline-none cursor-pointer shrink-0 ${statusStyles[e.LeadStatus]}`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
                <div>
                  <p className="text-slate-400 font-medium">Phone</p>
                  <p className="text-slate-700">{e.PhoneNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Company</p>
                  <p className="text-slate-700 truncate">
                    {e.CompanyName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Created</p>
                  <p className="text-slate-700">
                    {new Date(e.CreatedDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Notes</p>
                  <p className="text-slate-700 truncate">{e.Notes || "—"}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setModal(e)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-xs font-medium transition"
                >
                  <FaEdit size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-medium transition"
                >
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && filtered.length > 0 && <Pagination mobile />}
      </div>

      {/* ── DESKTOP — table ── */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Notes</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated?.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-16 text-center text-slate-400 text-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">🔍</span>
                      No customers found.
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((e, i) => (
                  <tr
                    key={e._id}
                    className="border-b hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400">
                      {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {e.Name}
                    </td>
                    <td
                      className="px-4 py-3 max-w-[150px] truncate text-slate-500"
                      title={e.Email}
                    >
                      {e.Email}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {e.PhoneNumber}
                    </td>
                    <td
                      className="px-4 py-3 max-w-[150px] truncate text-slate-600"
                      title={e.CompanyName}
                    >
                      {e.CompanyName}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.LeadStatus}
                        onChange={(event) =>
                          handleStatusChange(e, event.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${statusStyles[e.LeadStatus]}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className="px-4 py-3 max-w-[200px] truncate text-slate-500"
                      title={e.Notes}
                    >
                      {e.Notes || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(e.CreatedDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal(e)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && <Pagination />}
      </div>
    </div>
  );
};

export default Customer;
