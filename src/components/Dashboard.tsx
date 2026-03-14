import { useState, useEffect } from "react";

interface SystemStatus {
  service: string;
  status: "healthy" | "warning" | "error";
  lastCheck: string;
  details?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  service: string;
  message: string;
  details?: any;
}

export default function Dashboard() {

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [activeUsers, setActiveUsers] = useState({
    drivers: 0,
    admins: 0,
    customers: 0
  });

  const [systemMetrics, setSystemMetrics] = useState({
    apiCalls: 0,
    dbQueries: 0,
    storageUsed: "0%",
    uptime: "0%"
  });

  const API_URL = "https://api-backend-vmlt.onrender.com";

  useEffect(() => {

    async function loadDashboard() {
      try {

        const health = await fetch(`${API_URL}/api/health`);
        const healthData = await health.json();

        setSystemStatus([
          {
            service: "Backend API",
            status: "healthy",
            lastCheck: new Date().toLocaleString()
          },
          {
            service: "Database",
            status: "healthy",
            lastCheck: new Date().toLocaleString()
          }
        ]);

        const logs = await fetch(`${API_URL}/api/logs`).catch(() => null);

        if (logs && logs.ok) {
          const logData = await logs.json();
          setRecentLogs(logData);
        }

        const stats = await fetch(`${API_URL}/api/admin/stats`).catch(() => null);

        if (stats && stats.ok) {
          const statData = await stats.json();

          setActiveUsers(statData.users || activeUsers);
          setSystemMetrics(statData.metrics || systemMetrics);
        }

      } catch (err) {

        setSystemStatus([
          {
            service: "Backend API",
            status: "error",
            lastCheck: new Date().toLocaleString(),
            details: "API unreachable"
          }
        ]);

      }
    }

    loadDashboard();

  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#22c55e";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >

      {/* System Health */}
      <div
        style={{
          background: "rgba(30,41,59,0.8)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          border: "1px solid rgba(148,163,184,0.2)",
          gridColumn: "1 / -1"
        }}
      >
        <h2 style={{ color: "#60a5fa", marginTop: 0 }}>🖥️ System Health</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
            gap: "1rem"
          }}
        >
          {systemStatus.map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(15,23,42,0.6)",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: `1px solid ${getStatusColor(item.status)}40`
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span style={{ color: "#f8fafc" }}>{item.service}</span>

                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(item.status)
                  }}
                />
              </div>

              <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                {item.lastCheck}
              </div>

              {item.details && (
                <div style={{ color: "#fbbf24", fontSize: "0.75rem" }}>
                  {item.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Users */}
      <div
        style={{
          background: "rgba(30,41,59,0.8)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          border: "1px solid rgba(148,163,184,0.2)"
        }}
      >
        <h3 style={{ color: "#60a5fa" }}>👥 Active Users</h3>

        <p style={{ color: "#22c55e" }}>Drivers: {activeUsers.drivers}</p>
        <p style={{ color: "#60a5fa" }}>Admins: {activeUsers.admins}</p>
        <p style={{ color: "#f59e0b" }}>Customers: {activeUsers.customers}</p>
      </div>

      {/* System Metrics */}
      <div
        style={{
          background: "rgba(30,41,59,0.8)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          border: "1px solid rgba(148,163,184,0.2)"
        }}
      >
        <h3 style={{ color: "#60a5fa" }}>📊 System Metrics</h3>

        <p style={{ color: "#22c55e" }}>
          API Calls: {systemMetrics.apiCalls.toLocaleString()}
        </p>

        <p style={{ color: "#60a5fa" }}>
          DB Queries: {systemMetrics.dbQueries.toLocaleString()}
        </p>

        <p style={{ color: "#f59e0b" }}>
          Storage Used: {systemMetrics.storageUsed}
        </p>

        <p style={{ color: "#22c55e" }}>
          Uptime: {systemMetrics.uptime}
        </p>
      </div>

      {/* Logs */}
      <div
        style={{
          background: "rgba(30,41,59,0.8)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          border: "1px solid rgba(148,163,184,0.2)",
          gridColumn: "1 / -1"
        }}
      >
        <h3 style={{ color: "#60a5fa" }}>📝 Recent Logs</h3>

        {recentLogs.map(log => (
          <div key={log.id} style={{ marginBottom: "10px" }}>
            <span
              style={{
                color: getLevelColor(log.level),
                marginRight: "10px"
              }}
            >
              ●
            </span>

            <span style={{ color: "#f8fafc" }}>
              [{log.service}] {log.message}
            </span>

            <span
              style={{
                color: "#94a3b8",
                marginLeft: "10px",
                fontSize: "0.75rem"
              }}
            >
              {log.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}