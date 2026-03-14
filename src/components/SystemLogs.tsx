import { useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  service: string;
  message: string;
  details?: any;
  userId?: string;
  ip?: string;
}

export default function SystemLogs() {
  const [logLevel, setLogLevel] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const logs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-09-08 15:12:34',
      level: 'error',
      service: 'Payment Gateway',
      message: 'Payment processing failed for order ORD-1245',
      details: { orderId: 'ORD-1245', errorCode: 'CARD_DECLINED', amount: '$67.50' },
      userId: 'customer_789',
      ip: '192.168.1.105'
    },
    {
      id: '2',
      timestamp: '2025-09-08 15:11:22',
      level: 'warning',
      service: 'GPS Tracking',
      message: 'Driver location update timeout',
      details: { driverId: 'driver_004', lastKnown: '40.7282,-74.0776', timeout: '30s' },
      ip: '10.0.1.23'
    },
    {
      id: '3',
      timestamp: '2025-09-08 15:10:15',
      level: 'info',
      service: 'Delivery Service',
      message: 'Order successfully delivered',
      details: { orderId: 'ORD-1243', driverId: 'driver_002', deliveryTime: '14:45' },
      userId: 'driver_002'
    },
    {
      id: '4',
      timestamp: '2025-09-08 15:09:45',
      level: 'error',
      service: 'Authentication',
      message: 'Multiple failed login attempts detected',
      details: { attempts: 5, username: 'admin@test.com', blocked: true },
      ip: '203.45.67.89'
    },
    {
      id: '5',
      timestamp: '2025-09-08 15:08:33',
      level: 'warning',
      service: 'File Storage',
      message: 'Storage usage approaching limit',
      details: { currentUsage: '89%', threshold: '85%', totalSpace: '500GB' }
    },
    {
      id: '6',
      timestamp: '2025-09-08 15:07:12',
      level: 'info',
      service: 'Driver Management',
      message: 'New driver registered and verified',
      details: { driverId: 'driver_007', name: 'Alex Johnson', vehicle: 'Toyota Prius' },
      userId: 'admin_001'
    },
    {
      id: '7',
      timestamp: '2025-09-08 15:06:55',
      level: 'debug',
      service: 'API Gateway',
      message: 'Rate limiting triggered for client',
      details: { clientId: 'mobile_app_v2.1', requests: 1000, window: '1hour' },
      ip: '10.0.2.45'
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'debug': return '⚫';
      default: return '⚪';
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: '#60a5fa', 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          📝 System Logs
        </h2>
        
        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Filter by Level:
            </label>
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value as any)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#f8fafc',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Levels</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="info">Info Only</option>
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Search Logs:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages, services..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#f8fafc',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
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
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              📥 Export
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
              🧹 Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {filteredLogs.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#94a3b8' 
          }}>
            No logs found matching the current filters.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
              {/* Level indicator */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                flexShrink: 0 
              }}>
                <span style={{ fontSize: '1rem' }}>{getLevelBadge(log.level)}</span>
                <span style={{ 
                  color: getLevelColor(log.level),
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {log.level}
                </span>
              </div>
              
              {/* Main content */}
              <div style={{ minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem' 
                }}>
                  <div>
                    <span style={{ 
                      color: '#60a5fa',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      [{log.service}]
                    </span>
                    <span style={{ 
                      color: '#f8fafc', 
                      fontSize: '0.875rem',
                      marginLeft: '0.5rem'
                    }}>
                      {log.message}
                    </span>
                  </div>
                </div>
                
                {/* Details */}
                {log.details && (
                  <div style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    marginTop: '0.5rem',
                    overflowX: 'auto'
                  }}>
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                  </div>
                )}
                
                {/* Metadata */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  {log.userId && (
                    <span>👤 User: {log.userId}</span>
                  )}
                  {log.ip && (
                    <span>🌐 IP: {log.ip}</span>
                  )}
                </div>
              </div>
              
              {/* Timestamp */}
              <div style={{ 
                color: '#94a3b8', 
                fontSize: '0.75rem',
                textAlign: 'right',
                flexShrink: 0
              }}>
                {log.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ 
        marginTop: '1rem', 
        fontSize: '0.875rem', 
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        Showing {filteredLogs.length} of {logs.length} log entries
      </div>
    </div>
  );
}
