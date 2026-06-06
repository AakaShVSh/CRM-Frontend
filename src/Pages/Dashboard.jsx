import { useEffect, useRef, useState, useCallback } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getCustomerApi } from "../apis/customerApi";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
);

// ── Constants ────────────────────────────────────────────────────────
const STATUS_LIST = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const STATUS_COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981", "#EF4444"];
const BADGE = {
  New: { bg: "#EFF6FF", color: "#1E40AF" },
  Contacted: { bg: "#FFFBEB", color: "#92400E" },
  Qualified: { bg: "#F5F3FF", color: "#5B21B6" },
  Converted: { bg: "#ECFDF5", color: "#065F46" },
  Lost: { bg: "#FEF2F2", color: "#991B1B" },
};

// ── Helpers ──────────────────────────────────────────────────────────
const toArr = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.customers)) return data.customers;
  return [];
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutInst = useRef(null);
  const barInst = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    const raw = await getCustomerApi();
    setCustomers(toArr(raw));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Derived stats ──────────────────────────────────────────────────
  const total = customers.length;
  const statusCounts = STATUS_LIST.reduce((acc, s) => {
    acc[s] = customers.filter((c) => c.LeadStatus === s).length;
    return acc;
  }, {});
  const convRate = total
    ? ((statusCounts.Converted / total) * 100).toFixed(1)
    : "0.0";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const nowMonth = new Date().getMonth();
  const monthLabels = months.slice(0, nowMonth + 1);
  const monthCounts = monthLabels.map(
    (_, i) =>
      customers.filter((c) => new Date(c.CreatedDate).getMonth() === i).length,
  );

  const recent = [...customers]
    .sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate))
    .slice(0, 5);

  // ── Charts ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !donutRef.current) return;
    if (donutInst.current) donutInst.current.destroy();
    donutInst.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: STATUS_LIST,
        datasets: [
          {
            data: STATUS_LIST.map((s) => statusCounts[s]),
            backgroundColor: STATUS_COLORS,
            borderWidth: 3,
            borderColor: "#fff",
            hoverOffset: 5,
          },
        ],
      },
      options: {
        cutout: "65%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` },
          },
        },
      },
    });
    return () => donutInst.current?.destroy();
  }, [loading, customers]); // ✅ FIXED: added customers

  useEffect(() => {
    if (loading || !barRef.current) return;
    if (barInst.current) barInst.current.destroy();
    barInst.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "Customers Added",
            data: monthCounts,
            backgroundColor: "#3B82F6",
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94A3B8", font: { size: 12 } },
          },
          y: {
            grid: { color: "#F1F5F9" },
            ticks: { color: "#94A3B8", font: { size: 12 } },
            beginAtZero: true,
          },
        },
      },
    });
    return () => barInst.current?.destroy();
  }, [loading, customers]); // ✅ FIXED: added customers

  // ── UI helpers ─────────────────────────────────────────────────────
  const Card = ({ children, style = {} }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 180,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid #E2E8F0",
          borderTop: "3px solid #3B82F6",
          borderRadius: "50%",
          animation: "spin .7s linear infinite",
        }}
      />
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "Segoe UI, sans-serif",
        padding: "24px 20px",
        boxSizing: "border-box",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#94A3B8",
              fontWeight: 600,
              letterSpacing: "0.07em",
            }}
          >
            CRM SYSTEM
          </p>
          <h1
            style={{
              margin: "2px 0 0",
              fontSize: 22,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Customer Dashboard
          </h1>
        </div>
        <button
          onClick={fetchData}
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            padding: "7px 14px",
            fontSize: 13,
            color: "#475569",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ↺ Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[
          { label: "Total", value: total, color: "#3B82F6", icon: "👥" },
          {
            label: "New",
            value: statusCounts.New,
            color: "#3B82F6",
            icon: "⚡",
          },
          {
            label: "Contacted",
            value: statusCounts.Contacted,
            color: "#F59E0B",
            icon: "📞",
          },
          {
            label: "Qualified",
            value: statusCounts.Qualified,
            color: "#8B5CF6",
            icon: "🎯",
          },
          {
            label: "Converted",
            value: statusCounts.Converted,
            color: "#10B981",
            icon: "✅",
          },
          {
            label: "Lost",
            value: statusCounts.Lost,
            color: "#EF4444",
            icon: "❌",
          },
        ].map((s) => (
          <Card key={s.label}>
            <p style={{ margin: "0 0 8px", fontSize: 20 }}>{s.icon}</p>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                color: "#94A3B8",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {s.label.toUpperCase()}
            </p>
            {loading ? (
              <div
                style={{
                  height: 26,
                  width: 48,
                  background: "#F1F5F9",
                  borderRadius: 6,
                }}
              />
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {s.value}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Donut */}
        <Card>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0F172A",
            }}
          >
            Lead Status
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#94A3B8" }}>
            By stage
          </p>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div style={{ position: "relative", height: 190 }}>
                <canvas ref={donutRef} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginTop: 14,
                }}
              >
                {STATUS_LIST.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: STATUS_COLORS[i],
                          display: "inline-block",
                        }}
                      />
                      <span style={{ color: "#475569" }}>{s}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>
                      {statusCounts[s]}
                      <span
                        style={{
                          color: "#CBD5E1",
                          fontWeight: 400,
                          marginLeft: 4,
                        }}
                      >
                        (
                        {total
                          ? Math.round((statusCounts[s] / total) * 100)
                          : 0}
                        %)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Bar */}
        <Card>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0F172A",
            }}
          >
            Customers Added per Month
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#94A3B8" }}>
            Based on CreatedDate
          </p>
          {loading ? (
            <Spinner />
          ) : (
            <div style={{ position: "relative", height: 240 }}>
              <canvas ref={barRef} />
            </div>
          )}
        </Card>
      </div>

      {/* Recent Customers Table */}
      <Card>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: 14,
            fontWeight: 600,
            color: "#0F172A",
          }}
        >
          Recent Customers
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#94A3B8" }}>
          Last 5 added — sorted by date
        </p>
        {loading ? (
          <Spinner />
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {["Name", "Email", "Company", "Phone", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0 10px 10px 0",
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "24px 0",
                      textAlign: "center",
                      color: "#CBD5E1",
                    }}
                  >
                    No customers yet
                  </td>
                </tr>
              ) : (
                recent.map((c, i) => {
                  const badge = BADGE[c.LeadStatus] || {
                    bg: "#F1F5F9",
                    color: "#475569",
                  };
                  const avatarColors = [
                    ["#EFF6FF", "#1E40AF"],
                    ["#FFFBEB", "#92400E"],
                    ["#F5F3FF", "#5B21B6"],
                    ["#ECFDF5", "#065F46"],
                    ["#FEF2F2", "#991B1B"],
                  ];
                  const [abg, atx] = avatarColors[i % avatarColors.length];
                  return (
                    <tr
                      key={c._id || i}
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <td style={{ padding: "11px 10px 11px 0" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: abg,
                              color: atx,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(c.Name)}
                          </div>
                          <span style={{ fontWeight: 600, color: "#0F172A" }}>
                            {c.Name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "11px 10px 11px 0",
                          color: "#64748B",
                        }}
                      >
                        {c.Email}
                      </td>
                      <td
                        style={{
                          padding: "11px 10px 11px 0",
                          color: "#64748B",
                        }}
                      >
                        {c.CompanyName}
                      </td>
                      <td
                        style={{
                          padding: "11px 10px 11px 0",
                          color: "#64748B",
                        }}
                      >
                        {c.PhoneNumber}
                      </td>
                      <td style={{ padding: "11px 10px 11px 0" }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 6,
                          }}
                        >
                          {c.LeadStatus}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 0",
                          color: "#94A3B8",
                          fontSize: 12,
                        }}
                      >
                        {fmtDate(c.CreatedDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
