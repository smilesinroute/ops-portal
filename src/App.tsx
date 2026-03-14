import { useState } from "react";
import Dashboard from "./components/Dashboard";
import SystemLogs from "./components/SystemLogs";
import UserRoles from "./components/UserRoles";
import ComplianceDocs from "./components/ComplianceDocs";
import BackupRestore from "./components/BackupRestore";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'logs', label: 'System Logs', icon: '📝' },
    { id: 'api', label: 'API Health', icon: '🔗' },
    { id: 'users', label: 'User Roles', icon: '👥' },
    { id: 'compliance', label: 'Compliance', icon: '📋' },
    { id: 'backup', label: 'Backup/Restore', icon: '💾' }
  ];

  // Simple API Health component
  const APIHealth = () => (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    }}>
      <h2 style={{ color: '#60a5fa', marginTop: 0 }}>🔗 API Health Checks</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {[
          { name: 'Driver API', status: 'healthy', response: '45ms' },
          { name: 'Admin API', status: 'healthy', response: '32ms' },
          { name: 'Payment API', status: 'warning', response: '128ms' },
          { name: 'GPS Tracking', status: 'healthy', response: '67ms' },
          { name: 'Notification API', status: 'healthy', response: '23ms' }
        ].map((api, index) => (
          <div key={index} style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: `1px solid ${api.status === 'healthy' ? '#22c55e' : '#f59e0b'}40`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#f8fafc', fontWeight: '500' }}>{api.name}</span>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: api.status === 'healthy' ? '#22c55e' : '#f59e0b'
              }} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Response: {api.response}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'logs':
        return <SystemLogs />;
      case 'api':
        return <APIHealth />;
      case 'users':
        return <UserRoles />;
      case 'compliance':
        return <ComplianceDocs />;
      case 'backup':
        return <BackupRestore />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ 
      fontFamily: "\"Inter\", \"Segoe UI\", \"Roboto\", sans-serif", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Ops Portal Header */}
      <header style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        padding: "1rem 2rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img 
              src="/assets/smiles_logo.png" 
              alt="Smiles in Route Logo"
              style={{ 
                height: "40px", 
                width: "auto"
              }}
            />
            <h1 style={{ 
              color: "#f8fafc", 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              margin: 0 
            }}>
              ⚙️ Operations Portal
            </h1>
          </div>
          
          <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{ 
                  color: activeSection === item.id ? "#60a5fa" : "#cbd5e1",
                  background: activeSection === item.id ? "rgba(96, 165, 250, 0.1)" : "transparent",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ 
        flex: "1",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer style={{
        background: "rgba(15, 23, 42, 0.95)",
        color: "#94a3b8",
        textAlign: "center",
        padding: "1rem",
        borderTop: "1px solid rgba(148, 163, 184, 0.1)"
      }}>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          © 2024 Smiles in Route Transportation LLC - Operations Portal | System monitoring and backend management
        </p>
      </footer>
    </div>
  );
}

export default App;
