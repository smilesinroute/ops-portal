import { useState } from 'react';

interface BackupRecord {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'database' | 'files';
  size: string;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  location: string;
  duration: string;
  triggeredBy: 'scheduled' | 'manual' | 'system';
}

export default function BackupRestore() {
  const [activeTab, setActiveTab] = useState<'backups' | 'restore' | 'schedule'>('backups');

  const backups: BackupRecord[] = [
    {
      id: 'backup_001',
      name: 'Daily Full Backup - 2025-09-08',
      type: 'full',
      size: '2.8 GB',
      createdAt: '2025-09-08 02:00:00',
      status: 'completed',
      location: 'AWS S3 / backup-bucket',
      duration: '1h 23m',
      triggeredBy: 'scheduled'
    },
    {
      id: 'backup_002',
      name: 'Database Backup - Orders',
      type: 'database',
      size: '456 MB',
      createdAt: '2025-09-08 14:30:00',
      status: 'completed',
      location: 'AWS S3 / db-backup',
      duration: '8m 12s',
      triggeredBy: 'manual'
    },
    {
      id: 'backup_003',
      name: 'Incremental Backup - Files',
      type: 'incremental',
      size: '89 MB',
      createdAt: '2025-09-08 12:00:00',
      status: 'completed',
      location: 'Local Storage / backup',
      duration: '3m 45s',
      triggeredBy: 'scheduled'
    },
    {
      id: 'backup_004',
      name: 'Emergency Backup - System',
      type: 'full',
      size: '3.2 GB',
      createdAt: '2025-09-07 23:45:00',
      status: 'failed',
      location: 'AWS S3 / emergency',
      duration: '2h 15m',
      triggeredBy: 'system'
    },
    {
      id: 'backup_005',
      name: 'Photo Storage Backup',
      type: 'files',
      size: '1.2 GB',
      createdAt: '2025-09-08 15:00:00',
      status: 'in_progress',
      location: 'Google Cloud / photos',
      duration: '45m (ongoing)',
      triggeredBy: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'failed': return '#ef4444';
      case 'in_progress': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return '#8b5cf6';
      case 'incremental': return '#3b82f6';
      case 'database': return '#22c55e';
      case 'files': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return '🗄️';
      case 'incremental': return '📊';
      case 'database': return '🗃️';
      case 'files': return '📁';
      default: return '💾';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'in_progress': return '⏳';
      default: return '❓';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'scheduled': return '⏰';
      case 'manual': return '👤';
      case 'system': return '🤖';
      default: return '❓';
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
          💾 Backup & Restore
        </h2>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          {[
            { id: 'backups', label: 'Backup History', icon: '📦' },
            { id: 'restore', label: 'Restore', icon: '🔄' },
            { id: 'schedule', label: 'Schedule', icon: '⏰' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem 0.375rem 0 0',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === tab.id ? '2px solid #60a5fa' : '2px solid transparent'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'backups' && (
        <div>
          {/* Quick Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { label: 'Total Backups', value: backups.length, color: '#3b82f6' },
              { label: 'Successful', value: backups.filter(b => b.status === 'completed').length, color: '#22c55e' },
              { label: 'Failed', value: backups.filter(b => b.status === 'failed').length, color: '#ef4444' },
              { label: 'In Progress', value: backups.filter(b => b.status === 'in_progress').length, color: '#f59e0b' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${stat.color}40`,
                textAlign: 'center'
              }}>
                <div style={{ color: stat.color, fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#f8fafc', fontSize: '0.875rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid #22c55e',
              color: '#4ade80',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ▶️ Start Manual Backup
            </button>
            <button style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              🔄 Verify Integrity
            </button>
            <button style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              📊 View Reports
            </button>
          </div>

          {/* Backup List */}
          <div style={{
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {backups.map((backup) => (
              <div key={backup.id} style={{
                padding: '1rem',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto auto',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {/* Type & Status Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(backup.type)}</span>
                  <span style={{ fontSize: '1rem' }}>{getStatusIcon(backup.status)}</span>
                  <span style={{ fontSize: '0.875rem' }}>{getTriggerIcon(backup.triggeredBy)}</span>
                </div>
                
                {/* Backup Info */}
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {backup.name}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>📁 {backup.size}</span>
                    <span>📍 {backup.location}</span>
                    <span>⏱️ {backup.duration}</span>
                  </div>
                </div>
                
                {/* Type Badge */}
                <div style={{
                  background: `${getTypeColor(backup.type)}20`,
                  color: getTypeColor(backup.type),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {backup.type}
                </div>
                
                {/* Status & Time */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    background: `${getStatusColor(backup.status)}20`,
                    color: getStatusColor(backup.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    marginBottom: '0.25rem'
                  }}>
                    {backup.status}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {backup.createdAt}
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {backup.status === 'completed' && (
                    <>
                      <button style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        color: '#60a5fa',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}>
                        🔄 Restore
                      </button>
                      <button style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid #22c55e',
                        color: '#4ade80',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}>
                        📥 Download
                      </button>
                    </>
                  )}
                  {backup.status === 'failed' && (
                    <button style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>
                      🔍 Details
                    </button>
                  )}
                  {backup.status === 'in_progress' && (
                    <button style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>
                    ⏹️ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'restore' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Restore System</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            Select a backup to restore from the backup history, or upload a backup file.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              📁 Upload Backup File
            </button>
            <button style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid #22c55e',
              color: '#4ade80',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              🔍 Browse Remote Backups
            </button>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Backup Schedule</h3>
          <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#f8fafc', fontWeight: '600', marginBottom: '0.5rem' }}>
                📅 Current Schedule:
              </div>
              <ul style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
                <li>🗄️ Full backup: Daily at 2:00 AM</li>
                <li>📊 Incremental backup: Every 6 hours</li>
                <li>🗃️ Database backup: Every 4 hours</li>
                <li>📁 File backup: Every 12 hours</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                ✏️ Edit Schedule
              </button>
              <button style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                color: '#4ade80',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                ▶️ Test Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
