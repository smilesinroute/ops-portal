import { useState } from 'react';

interface ComplianceDoc {
  id: string;
  name: string;
  type: 'contract' | 'mbe' | 'insurance' | 'permit' | 'certification' | 'policy';
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  uploadDate: string;
  expiryDate?: string;
  size: string;
  uploadedBy: string;
  description: string;
}

export default function ComplianceDocs() {
  const [selectedType, setSelectedType] = useState<'all' | 'contract' | 'mbe' | 'insurance' | 'permit' | 'certification' | 'policy'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents: ComplianceDoc[] = [
    {
      id: 'doc_001',
      name: 'MBE Certification 2024',
      type: 'mbe',
      status: 'valid',
      uploadDate: '2024-01-15',
      expiryDate: '2025-01-15',
      size: '2.3 MB',
      uploadedBy: 'admin@smilesinroute.com',
      description: 'Minority Business Enterprise certification for 2024-2025'
    },
    {
      id: 'doc_002',
      name: 'General Liability Insurance',
      type: 'insurance',
      status: 'expiring',
      uploadDate: '2024-03-01',
      expiryDate: '2025-10-01',
      size: '1.8 MB',
      uploadedBy: 'admin@smilesinroute.com',
      description: 'Commercial general liability insurance policy'
    },
    {
      id: 'doc_003',
      name: 'Driver Contract Template',
      type: 'contract',
      status: 'valid',
      uploadDate: '2024-02-10',
      size: '456 KB',
      uploadedBy: 'legal@smilesinroute.com',
      description: 'Standard independent contractor agreement for drivers'
    },
    {
      id: 'doc_004',
      name: 'Commercial Vehicle Permit',
      type: 'permit',
      status: 'valid',
      uploadDate: '2024-01-20',
      expiryDate: '2025-12-31',
      size: '1.2 MB',
      uploadedBy: 'operations@smilesinroute.com',
      description: 'City commercial vehicle operation permit'
    },
    {
      id: 'doc_005',
      name: 'Data Privacy Policy',
      type: 'policy',
      status: 'valid',
      uploadDate: '2024-05-15',
      size: '890 KB',
      uploadedBy: 'compliance@smilesinroute.com',
      description: 'Customer and driver data privacy and protection policy'
    },
    {
      id: 'doc_006',
      name: 'DOT Safety Certification',
      type: 'certification',
      status: 'expired',
      uploadDate: '2023-06-01',
      expiryDate: '2024-06-01',
      size: '3.1 MB',
      uploadedBy: 'safety@smilesinroute.com',
      description: 'Department of Transportation safety compliance certification'
    },
    {
      id: 'doc_007',
      name: 'Workers Compensation Insurance',
      type: 'insurance',
      status: 'pending',
      uploadDate: '2024-08-30',
      size: '2.7 MB',
      uploadedBy: 'hr@smilesinroute.com',
      description: 'Workers compensation insurance policy renewal application'
    }
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesSearch = searchTerm === '' ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return '#22c55e';
      case 'expiring': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'pending': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mbe': return '#8b5cf6';
      case 'contract': return '#3b82f6';
      case 'insurance': return '#22c55e';
      case 'permit': return '#f59e0b';
      case 'certification': return '#ef4444';
      case 'policy': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mbe': return '🏆';
      case 'contract': return '📄';
      case 'insurance': return '🛡️';
      case 'permit': return '📋';
      case 'certification': return '🎓';
      case 'policy': return '📝';
      default: return '📁';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return '✅';
      case 'expiring': return '⚠️';
      case 'expired': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const isExpiryWarning = (doc: ComplianceDoc) => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
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
          📋 Compliance Documents
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
              Filter by Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#f8fafc',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="mbe">MBE Documents</option>
              <option value="insurance">Insurance</option>
              <option value="contract">Contracts</option>
              <option value="permit">Permits</option>
              <option value="certification">Certifications</option>
              <option value="policy">Policies</option>
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Search Documents:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
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
              📤 Upload
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
              📊 Report
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {Object.entries({
            valid: documents.filter(d => d.status === 'valid').length,
            expiring: documents.filter(d => d.status === 'expiring').length,
            expired: documents.filter(d => d.status === 'expired').length,
            pending: documents.filter(d => d.status === 'pending').length
          }).map(([status, count]) => (
            <div key={status} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${getStatusColor(status)}40`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {getStatusIcon(status)}
              </div>
              <div style={{ color: getStatusColor(status), fontSize: '1.25rem', fontWeight: 'bold' }}>
                {count}
              </div>
              <div style={{ color: '#f8fafc', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {status}
              </div>
            </div>
          ))}
        </div>

        {/* Expiry Warnings */}
        {documents.some(doc => isExpiryWarning(doc)) && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #f59e0b',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
              ⚠️ Expiry Alerts
            </h3>
            <div style={{ color: '#fbbf24', fontSize: '0.875rem' }}>
              {documents.filter(doc => isExpiryWarning(doc)).length} document(s) expiring within 30 days
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div style={{
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {filteredDocs.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#94a3b8' 
          }}>
            No documents found matching the current filters.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto auto',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* Type & Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(doc.type)}</span>
                <span style={{ fontSize: '1rem' }}>{getStatusIcon(doc.status)}</span>
              </div>
              
              {/* Document Info */}
              <div>
                <div style={{ color: '#f8fafc', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {doc.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {doc.description}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>📁 {doc.size}</span>
                  <span>👤 {doc.uploadedBy}</span>
                  <span>📅 Uploaded: {doc.uploadDate}</span>
                </div>
              </div>
              
              {/* Type Badge */}
              <div style={{
                background: `${getTypeColor(doc.type)}20`,
                color: getTypeColor(doc.type),
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                {doc.type}
              </div>
              
              {/* Status & Expiry */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: `${getStatusColor(doc.status)}20`,
                  color: getStatusColor(doc.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}>
                  {doc.status}
                </div>
                {doc.expiryDate && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: isExpiryWarning(doc) ? '#f59e0b' : '#94a3b8' 
                  }}>
                    Expires: {doc.expiryDate}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid #3b82f6',
                  color: '#60a5fa',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  👁️ View
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
                <button style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  🗑️ Delete
                </button>
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
        Showing {filteredDocs.length} of {documents.length} documents
      </div>
    </div>
  );
}
