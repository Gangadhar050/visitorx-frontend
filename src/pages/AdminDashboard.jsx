import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVisitors } from "../services/visitorService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("adminAuthToken") === "active_admin"
  );

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchDashboardData() {
      try {
        const databaseRecords = await getAllVisitors();
        console.log("VISITORS DATA:",databaseRecords);
        setVisitors(databaseRecords.reverse());
      } catch (err) {
        console.error("Failed to stream live visitor logs from database.", err);
      }
    }

    fetchDashboardData();
  }, [isAuthenticated]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (
      loginForm.username.trim() === "admin" &&
      loginForm.password.trim() === "admin123"
    ) {
      sessionStorage.setItem("adminAuthToken", "active_admin");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0ecff, #f8fbff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "#0a1128",
            borderRadius: "22px",
            padding: "38px 34px",
            boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
            color: "#fff",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "26px",
              fontWeight: "900",
              marginBottom: "8px",
            }}
          >
            Visitor<span style={{ color: "#3b82f6" }}>X</span>
          </div>

          <h2
            style={{
              textAlign: "center",
              margin: "18px 0 8px",
              fontSize: "28px",
              fontWeight: "900",
            }}
          >
            Admin Login
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              marginBottom: "28px",
              fontSize: "14px",
            }}
          >
            Enter credentials to access dashboard panel
          </p>

          <form onSubmit={handleAdminLogin}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={loginForm.username}
              onChange={handleLoginChange}
              placeholder="Enter username"
              style={{
                width: "100%",
                marginTop: "8px",
                marginBottom: "18px",
                padding: "14px 15px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#111827",
                color: "#fff",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            <label style={{ fontSize: "14px", fontWeight: "700" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="Enter password"
              style={{
                width: "100%",
                marginTop: "8px",
                marginBottom: "12px",
                padding: "14px 15px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#111827",
                color: "#fff",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            {loginError && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "14px",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "800",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Login to Dashboard →
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              marginTop: "18px",
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ← Back to Visitor Screen
          </button>
        </div>
      </div>
    );
  }
const handleExportCSV = () => {
    if (visitors.length === 0) {
      alert("There are no visitor records available to export yet.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Mobile Number",
      "Purpose of Visit",
      "Check-In Time",
    ];

    const csvRows = [
      headers.join(","),
      ...visitors.map((v) =>
        [
          '"${v.id || ""}"',
          '"${v.name || ""}"',
          '"${v.phone || ""}"',
          '"${v.purpose || ""}"',
          '"${v.checkInTime || "—"}"',
        ].join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");

    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute(
      "download",
      'Visitor_Logs_Export_${new Date().toISOString().split("T")[0]}.csv'
    );

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleNavigateToRegister = () => navigate("/register");
  const handleNavigateToCapture = () => navigate("/capture");

  const handleEdit = (visitor) => {
  navigate("/register", {
    state: {
      editMode: true,
      visitorData: visitor,
    },
  });
};

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      "🗑️ Delete ${name}'s check-in record completely from logs?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch('/api/visitors/${id}', {
          method: "DELETE",
        });

        if (response.ok) {
          setVisitors(visitors.filter((v) => v.id !== id));
        } else {
          alert("Could not remove record from the backend server.");
        }
      } catch (err) {
        console.error("Error executing delete operations:", err);
      }
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const query = searchQuery.toLowerCase();

    return (
      (visitor.name && visitor.name.toLowerCase().includes(query)) ||
      (visitor.phone && visitor.phone.includes(query))
    );
  });

  const getBadgeStyle = (purpose) => {
    const checkPurpose = purpose ? purpose.toLowerCase() : "";

    if (checkPurpose.includes("interview"))
      return { background: "#e8f5e9", color: "#2e7d32" };

    if (checkPurpose.includes("meeting"))
      return { background: "#e3f2fd", color: "#1565c0" };

    if (checkPurpose.includes("internship"))
      return { background: "#f3e5f5", color: "#6a1b9a" };

    return { background: "#f3f4f6", color: "#374151" };
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          width: "260px",
          background: "#0a1128",
          color: "#fff",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "40px",
            color: "#fff",
            letterSpacing: "0.5px",
          }}
        >
          Visitor<span style={{ color: "#1a73e8" }}>X</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#1a73e8",
              padding: "14px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            📊 &nbsp;Dashboard
          </div>

          <div
            onClick={handleNavigateToRegister}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "8px",
              color: "#94a3b8",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            📝 &nbsp;Register Form View
          </div>

          <div
            onClick={handleNavigateToCapture}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "8px",
              color: "#94a3b8",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            🏠 &nbsp;Client Facing Screen
          </div>

          <div
            onClick={handleExportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "8px",
              color: "#94a3b8",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            💾 &nbsp;Export Data
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            borderTop: "1px solid #1e293b",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ⚙️ &nbsp;Settings
          </div>

          <div
            style={{
              color: "#f87171",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={handleLogout}
          >
            🚪 &nbsp;Log Out
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            position: "relative",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
Dashboard
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                fontSize: "14px",
                color: "#4b5563",
                fontWeight: "700",
              }}
            >
              📅 25 May 2026
            </div>

            <div
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              style={{
                fontSize: "14px",
                color: "#4b5563",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                userSelect: "none",
              }}
            >
              👤 Admin ▾
            </div>

            {isAdminMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: "0",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  width: "160px",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#374151",
                    cursor: "pointer",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                  onClick={() => alert("Profile Settings Coming Soon")}
                >
                  My Profile
                </div>

                <div
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#ef4444",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={handleLogout}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {[
            {
              label: "TODAY'S VISITORS",
              count: visitors.length,
              color: "#1a73e8",
              icon: "👥",
            },
            { label: "THIS WEEK", count: "128", color: "#111827", icon: "📅" },
            { label: "THIS MONTH", count: "528", color: "#111827", icon: "📈" },
            {
              label: "TOTAL VISITORS",
              count: "2,345",
              color: "#111827",
              icon: "📊",
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "16px",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)",
                position: "relative",
                border: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                }}
              >
                {card.label}
              </div>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  marginTop: "6px",
                  color: card.color,
                }}
              >
                {card.count}
              </div>

              <span
                style={{
                  position: "absolute",
                  right: "24px",
                  bottom: "24px",
                  fontSize: "24px",
                  opacity: 0.3,
                }}
              >
                {card.icon}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "400px",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              color: "#111827",
              fontWeight: "600",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "#fff",
            }}
          />

          <div style={{ display: "flex", gap: "14px" }}>
            <button
              onClick={handleExportCSV}
              style={{
                padding: "12px 24px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontWeight: "700",
                color: "#334155",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              📥 Export Excel
            </button>

            <button
              onClick={handleNavigateToRegister}
              style={{
                padding: "12px 24px",
                background: "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              + Add Visitor
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.02)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                }}
              >
                <th style={{ padding: "18px 24px" }}>#</th>
                <th style={{ padding: "18px 24px" }}>PHOTO</th>
                <th style={{ padding: "18px 24px" }}>NAME</th>
                <th style={{ padding: "18px 24px" }}>MOBILE NUMBER</th>
                <th style={{ padding: "18px 24px" }}>PURPOSE</th>
                <th style={{ padding: "18px 24px" }}>CHECK-IN TIME</th>
                <th style={{ padding: "18px 24px", textAlign: "center" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody style={{ color: "#0f172a", fontSize: "15px" }}>
              {filteredVisitors.map((visitor, index) => {
                const badgeStyle = getBadgeStyle(visitor.purpose);

                return (
                  <tr
                    key={visitor.id || index}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td
                      style={{
                        padding: "18px 24px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <img
                        src={
                          visitor.photo ||
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'><circle cx='12' cy='12' r='12' fill='%23cbd5e1'/><circle cx='12' cy='10' r='4' fill='%23475569'/><path d='M6 19c0-2.5 4-3.5 6-3.5s6 1 6 3.5v1H6v-1z' fill='%23475569'/></svg>"
                        }
                        alt="Profile"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#f1f5f9",
                        }}
                      />
                    </td>

                    <td
                      style={{
                        padding: "18px 24px",
                        fontWeight: "800",
                        color: "#0f172a",
                      }}
                    >
                      {visitor.name}
                    </td>

                    <td
                      style={{
                        padding: "18px 24px",
                        fontWeight: "600",
                        color: "#334155",
                      }}
                    >
                      {visitor.phone}
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <span
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          backgroundColor: badgeStyle.background,
                          color: badgeStyle.color,
                        }}
                      >
                        {visitor.purpose || "Visitor"}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "18px 24px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {visitor.checkInTime &&
                      visitor.checkInTime !== "—"
                        ? visitor.checkInTime
                        : "11:33 AM"}
                    </td>

                    <td style={{ padding: "18px 24px", textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(visitor)}
                        style={{
                          color: "#1a73e8",
                          background: "none",
                          border: "none",
                          fontWeight: "800",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginRight: "12px",
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(visitor.id, visitor.name)}
                        style={{
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          fontWeight: "800",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredVisitors.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    No matching logs found in active dashboard list dataset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}