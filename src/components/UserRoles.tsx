import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'customer' | 'ops';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

export default function UserRoles() {
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'driver' | 'customer' | 'ops'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const users: User[] = [
    {
      id: 'admin_001',
      name: 'Sarah Johnson',
      email: 'sarah.j@smilesinroute.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-09-08 14:30',
      permissions: ['manage_orders', 'manage_drivers', 'view_analytics', 'manage_payments'],
      createdAt: '2024-01-15'
    },
    {
      id: 'driver_001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2025-09-08 15:05',
      permissions: ['view_orders', 'update_delivery_status', 'upload_photos'],
      createdAt: '2024-03-22'
    },
    {
      id: 'driver_002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2025-09-08 14:45',
      permissions: ['view_orders', 'update_delivery_status', 'upload_photos'],
      createdAt: '2024-05-10'
    },
    {
      id: 'customer_001',
      name: 'ABC Restaurant',
      email: 'orders@abcrestaurant.com',
      role: 'customer',
      status: 'active',
      lastLogin: '2025-09-08 13:20',
      permissions: ['place_orders', 'track_orders', 'view_history'],
      createdAt: '2024-02-01'
    },
    {
      id: 'ops_001',
      name: 'Tech Support',
      email: 'ops@smilesinroute.com',
      role: 'ops',
      status: 'active',
      lastLogin: '2025-09-08 15:10',
      permissions: ['view_logs', 'manage_system', 'backup_restore', 'user_management'],
      createdAt: '2024-01-10'
    },
    {
      id: 'driver_003',
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      role: 'driver',
      status: 'suspended',
      lastLogin: '2025-09-07 16:22',
      permissions: [],
      createdAt: '2024-04-15'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'ops': return '#8b5cf6';
      case 'driver': return '#22c55e';
      case 'customer': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'ops': return '⚙️';
      case 'driver': return '🚛';
      case 'customer': return '🏢';
      default: return '👤';
    }
  };

  const rolePermissions = {
    admin: ['manage_orders', 'manage_drivers', 'view_analytics', 'manage_payments', 'user_management'],
    ops: ['view_logs', 'manage_system', 'backup_restore', 'user_management', 'api_management'],
    driver: ['view_orders', 'update_delivery_status', 'upload_photos', 'gps_tracking'],
    customer: ['place_orders', 'track_orders', 'view_history', 'manage_profile']
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
          👥 User Role Management
        </h2>
        
        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Filter by Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#f8fafc',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="ops">Operations</option>
              <option value="driver">Drivers</option>
              <option value="customer">Customers</option>
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Search Users:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
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
              👤 Add User
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
              📊 Export
            </button>
          </div>
        </div>

        {/* Role Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {Object.entries({
            admin: users.filter(u => u.role === 'admin').length,
            ops: users.filter(u => u.role === 'ops').length,
            driver: users.filter(u => u.role === 'driver').length,
            customer: users.filter(u => u.role === 'customer').length
          }).map(([role, count]) => (
            <div key={role} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${getRoleColor(role)}40`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {getRoleIcon(role)}
              </div>
              <div style={{ color: getRoleColor(role), fontSize: '1.25rem', fontWeight: 'bold' }}>
                {count}
              </div>
              <div style={{ color: '#f8fafc', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {role}s
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {filteredUsers.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#94a3b8' 
          }}>
            No users found matching the current filters.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* User Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{getRoleIcon(user.role)}</span>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{user.email}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ID: {user.id}</div>
                </div>
              </div>
              
              {/* Role & Permissions */}
              <div>
                <div style={{ 
                  display: 'inline-block',
                  background: `${getRoleColor(user.role)}20`,
                  color: getRoleColor(user.role),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  {user.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {user.permissions.length} permissions
                </div>
                {user.permissions.length > 0 && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#94a3b8',
                    marginTop: '0.25rem'
                  }}>
                    {user.permissions.slice(0, 3).join(', ')}
                    {user.permissions.length > 3 && ` +${user.permissions.length - 3} more`}
                  </div>
                )}
              </div>
              
              {/* Status */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  background: `${getStatusColor(user.status)}20`,
                  color: getStatusColor(user.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}>
                  {user.status}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Last: {user.lastLogin}
                </div>
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid #3b82f6',
                  color: '#60a5fa',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  ✏️ Edit
                </button>
                {user.status === 'active' ? (
                  <button style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    color: '#f87171',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    🚫 Suspend
                  </button>
                ) : (
                  <button style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    color: '#4ade80',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    ✅ Activate
                  </button>
                )}
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
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
