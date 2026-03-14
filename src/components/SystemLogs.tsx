import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  service: string;
  message: string;
  details?: any;
  userId?: string;
  ip?: string;
}

export default function SystemLogs() {

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logLevel, setLogLevel] = useState<"all" | "error" | "warning" | "info">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "https://api-backend-vmlt.onrender.com";

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {

      const res = await fetch(`${API_URL}/api/logs`);

      if (!res.ok) throw new Error("Failed to load logs");

      const data = await res.json();

      setLogs(data);

    } catch (err) {

      console.error("Log fetch failed:", err);

      // fallback example if API not ready
      setLogs([
        {
          id: "1",
          timestamp: new Date().toISOString(),
          level: "error",
          service: "System",
          message: "Log API unavailable",
          details: "Could not fetch logs from backend"
        }
      ]);
    }
  }

  const filteredLogs = logs.filter((log) => {

    const matchesLevel = logLevel === "all" || log.level === logLevel;

    const matchesSearch =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      case "debug":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return "🔴";
      case "warning":
        return "🟡";
      case "info":
        return "🔵";
      case "debug":
        return "⚫";
      default:
        return "⚪";
    }
  };

  return (
    <div
      style={{
        background: "rgba(30,41,59,0.8)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        border: "1px solid rgba(148,163,184,0.2)"
      }}
    >

      <h2 style={{ color: "#60a5fa", marginTop: 0 }}>📝 System Logs</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>

        <select
          value={logLevel}
          onChange={(e) => setLogLevel(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>

        <input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={loadLogs}>
          🔄 Refresh
        </button>

      </div>

      {filteredLogs.map((log) => (
        <div key={log.id} style={{ marginBottom: "10px" }}>

          <span
            style={{
              color: getLevelColor(log.level),
              marginRight: "8px"
            }}
          >
            {getLevelBadge(log.level)}
          </span>

          <span style={{ color: "#f8fafc" }}>
            [{log.service}] {log.message}
          </span>

          <span
            style={{
              marginLeft: "10px",
              fontSize: "0.75rem",
              color: "#94a3b8"
            }}
          >
            {log.timestamp}
          </span>

        </div>
      ))}

      <div style={{ marginTop: "1rem", color: "#94a3b8" }}>
        Showing {filteredLogs.length} logs
      </div>

    </div>
  );
}