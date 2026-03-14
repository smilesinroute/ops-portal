import { useState, useEffect } from 'react';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'warning' | 'error';
  lastCheck: string;
  details?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
  details?: any;
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { service: 'API Gateway', status: 'healthy', lastCheck: '2025-09-08 15:08:00' },
    { service: 'Database', status: 'healthy', lastCheck: '2025-09-08 15:08:00' },
    { service: 'Driver App', status: 'healthy', lastCheck: '2025-09-08 15:07:30' },
    { service: 'Admin Portal', status: 'healthy', lastCheck: '2025-09-08 15:07:45' },
    { service: 'GPS Tracking', status: 'warning', lastCheck: '2025-09-08 15:05:12', details: 'Intermittent connection' },
    { service: 'Payment Gateway', status: 'healthy', lastCheck: '2025-09-08 15:08:00' },
    { service: 'SMS Notifications', status: 'healthy', lastCheck: '2025-09-08 15:07:20' },
    { service: 'File Storage', status: 'healthy', lastCheck: '2025-09-08 15:08:00' }
  ]);

  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2025-09-08 15:07:45',
      level: 'info',
      service: 'Delivery',
      message: 'Order ORD-1234 completed successfully',
      details: { orderId: 'ORD-1234', driverId: 'driver_001' }
    },
    {
      id: '2',
      timestamp: '2025-09-08 15:05:12',
      level: 'warning',
      service: 'GPS',
      message: 'GPS signal weak for driver_002',
      details: { driverId: 'driver_002', lastKnownLocation: '40.7128,-74.0060' }
    },
    {
      id: '3',
      timestamp: '2025-09-08 15:03:28',
      level: 'info',
      service: 'Payment',
      message: 'Payment processed for order ORD-1230',
      details: { orderId: 'ORD-1230', amount: '$45.50' }
    },
    {
      id: '4',
      timestamp: '2025-09-08 15:01:15',
      level: 'error',
      service: 'Delivery',
      message: 'Failed delivery attempt for ORD-1225',
      details: { orderId: 'ORD-1225', reason: 'Customer not available' }
    },
    {
      id: '5',
      timestamp: '2025-09-08 14:58:32',
      level: 'info',
      service: 'Driver',
      message: 'Driver driver_003 went online',
      details: { driverId: 'driver_003', location: 'Downtown Hub' }
    }
  ]);

  const [activeUsers, setActiveUsers] = useState({
    drivers: 8,
    admins: 2,
    customers: 24
  });

  const [systemMetrics, setSystemMetrics] = useState({
    apiCalls: 1247,
    dbQueries: 3892,
    storageUsed: '67%',
    uptime: '99.8%'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics slightly
      setSystemMetrics(prev => ({
        ...prev,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 5),
        dbQueries: prev.dbQueries + Math.floor(Math.random() * 10)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.5rem', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      
      {/* System Health Overview */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        gridColumn: '1 / -1'
      }}>
        <h2 style={{ 
          color: '#60a5fa', 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          🖥️ System Health
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '1rem' 
        }}>
          {systemStatus.map((item, index) => (
            <div key={index} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${getStatusColor(item.status)}40`
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500' }}>
                  {item.service}
                </span>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(item.status)
                }} />
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                {item.lastCheck}
              </div>
              {item.details && (
                <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {item.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Users */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <h3 style={{ 
          color: '#60a5fa', 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}>
          👥 Active Users
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>🚛 Drivers</span>
            <span style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {activeUsers.drivers}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>👨‍💼 Admins</span>
            <span style={{ color: '#60a5fa', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {activeUsers.admins}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>📱 Customers</span>
            <span style={{ color: '#f59e0b', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {activeUsers.customers}
            </span>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <h3 style={{ 
          color: '#60a5fa', 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}>
          📊 System Metrics
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>API Calls</span>
            <span style={{ color: '#22c55e', fontSize: '1.125rem', fontWeight: 'bold' }}>
              {systemMetrics.apiCalls.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>DB Queries</span>
            <span style={{ color: '#60a5fa', fontSize: '1.125rem', fontWeight: 'bold' }}>
              {systemMetrics.dbQueries.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>Storage</span>
            <span style={{ color: '#f59e0b', fontSize: '1.125rem', fontWeight: 'bold' }}>
              {systemMetrics.storageUsed}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f8fafc' }}>Uptime</span>
            <span style={{ color: '#22c55e', fontSize: '1.125rem', fontWeight: 'bold' }}>
              {systemMetrics.uptime}
            </span>
          </div>
        </div>
      </div>

      {/* Recent System Logs */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        gridColumn: '1 / -1'
      }}>
        <h3 style={{ 
          color: '#60a5fa', 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}>
          📝 Recent System Logs
        </h3>
        
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)'
        }}>
          {recentLogs.map((log) => (
            <div key={log.id} style={{
              padding: '0.75rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getLevelColor(log.level),
                marginTop: '0.25rem',
                flexShrink: 0
              }} />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.25rem' 
                }}>
                  <span style={{ 
                    color: '#f8fafc', 
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    [{log.service}] {log.message}
                  </span>
                  <span style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    marginLeft: '1rem'
                  }}>
                    {log.timestamp}
                  </span>
                </div>
                
                {log.details && (
                  <div style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    marginTop: '0.5rem'
                  }}>
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '1rem', 
          display: 'flex', 
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <button style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid #3b82f6',
            color: '#60a5fa',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            📄 Export Logs
          </button>
          <button style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            color: '#4ade80',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            🔄 Refresh
          </button>
          <button style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            🧹 Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}