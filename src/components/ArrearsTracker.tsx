import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { Clock, Filter, Send, UserMinus } from 'lucide-react';
import type { Unit } from '../types';

interface ArrearsTrackerProps {
  onOpenVacateModal?: (unit: Unit) => void;
}

export const ArrearsTracker: React.FC<ArrearsTrackerProps> = ({ onOpenVacateModal }) => {
  const { 
    units, 
    estate, 
    selectedBlockFilter, 
    setSelectedBlockFilter, 
    selectedRiskFilter, 
    setSelectedRiskFilter,
    searchQuery, 
    setSelectedUnitForModal,
    setActiveTab
  } = useEstate();

  const [agingFilter, setAgingFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Blocks list
  const blocks = ['All', ...Array.from(new Set(units.map(u => u.block)))];

  // Filtering units
  const filteredUnits = units.filter(u => {
    // Block filter
    if (selectedBlockFilter !== 'All' && u.block !== selectedBlockFilter) return false;

    // Status filter
    if (statusFilter !== 'All' && u.paymentStatus !== statusFilter) return false;

    // Risk filter
    if (selectedRiskFilter !== 'All' && u.riskCategory !== selectedRiskFilter) return false;

    // Aging filter
    if (agingFilter === '0-30' && (u.daysOverdue <= 0 || u.daysOverdue > 30)) return false;
    if (agingFilter === '31-60' && (u.daysOverdue <= 30 || u.daysOverdue > 60)) return false;
    if (agingFilter === '61-90' && (u.daysOverdue <= 60 || u.daysOverdue > 90)) return false;
    if (agingFilter === '90+' && u.daysOverdue <= 90) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesUnit = u.unitNumber.toLowerCase().includes(q);
      const matchesName = u.ownerName.toLowerCase().includes(q);
      const matchesPhone = u.ownerPhone.toLowerCase().includes(q);
      const matchesEmail = u.ownerEmail.toLowerCase().includes(q);
      if (!matchesUnit && !matchesName && !matchesPhone && !matchesEmail) return false;
    }

    return true;
  });

  // KPI summaries for filtered view
  const totalArrearsBalance = filteredUnits.reduce((acc, u) => acc + u.currentBalance, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} color="#ef4444" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>
              Estate Ledger & Aging Buckets
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Arrears & Payment Ledger Tracker
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Track pending service charges, aging debt buckets (30/60/90+ days), and take batch collection actions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Filtered Debt Total</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444' }}>
              {estate.currency} {totalArrearsBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Block Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} color="var(--text-dim)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Block:</span>
          <select
            className="input-field"
            value={selectedBlockFilter}
            onChange={(e) => setSelectedBlockFilter(e.target.value)}
            style={{ width: '160px', padding: '6px 12px' }}
          >
            {blocks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '140px', padding: '6px 12px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Settled (Paid)</option>
            <option value="Pending">Pending Grace</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Aging Bucket Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Aging:</span>
          <select
            className="input-field"
            value={agingFilter}
            onChange={(e) => setAgingFilter(e.target.value)}
            style={{ width: '160px', padding: '6px 12px' }}
          >
            <option value="All">All Aging Buckets</option>
            <option value="0-30">0 - 30 Days</option>
            <option value="31-60">31 - 60 Days</option>
            <option value="61-90">61 - 90 Days</option>
            <option value="90+">90+ Days (Legal)</option>
          </select>
        </div>

        {/* Risk Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Risk:</span>
          <select
            className="input-field"
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            style={{ width: '140px', padding: '6px 12px' }}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk 🟢</option>
            <option value="Medium">Medium Risk 🟡</option>
            <option value="High">High Risk 🔴</option>
            <option value="Critical">Critical Defaulter 💜</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredUnits.length}</strong> of {units.length} units
          </span>
        </div>
      </div>

      {/* Arrears Ledger Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Unit & Location</th>
                <th>Resident / Owner Info</th>
                <th>Monthly Charge</th>
                <th>Arrears Balance</th>
                <th>Aging Bucket</th>
                <th>Last Payment Date</th>
                <th>Risk Category</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map(u => {
                const getRiskBadge = (category: string) => {
                  if (category === 'Critical') return <span className="badge badge-critical">Critical 💜</span>;
                  if (category === 'High') return <span className="badge badge-high">High Risk 🔴</span>;
                  if (category === 'Medium') return <span className="badge badge-medium">Medium 🟡</span>;
                  return <span className="badge badge-low">Low Risk 🟢</span>;
                };

                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>
                      <div>{u.unitNumber}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.block}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.ownerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {u.ownerPhone} • {u.ownerEmail}
                      </div>
                    </td>
                    <td>{estate.currency} {u.monthlyServiceCharge.toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: u.currentBalance > 0 ? '#ef4444' : '#10b981' }}>
                      {estate.currency} {u.currentBalance.toLocaleString()}
                    </td>
                    <td>
                      {u.daysOverdue > 0 ? (
                        <span className={`badge ${u.daysOverdue > 90 ? 'badge-critical' : (u.daysOverdue > 30 ? 'badge-high' : 'badge-medium')}`}>
                          {u.daysOverdue} Days Overdue
                        </span>
                      ) : (
                        <span className="badge badge-low">Current / Clear</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{u.lastPaymentDate || 'No record'}</td>
                    <td>{getRiskBadge(u.riskCategory)}</td>
                    <td>
                        <button
                          onClick={() => setSelectedUnitForModal(u)}
                          className="btn btn-outline btn-sm"
                          title="View statement & details"
                        >
                          View Unit
                        </button>

                        {onOpenVacateModal && (
                          <button
                            onClick={() => onOpenVacateModal(u)}
                            className="btn btn-danger btn-sm"
                            title="Remove / Vacate Resident"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}

                        {u.currentBalance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedUnitForModal(u);
                              setActiveTab('reminders');
                            }}
                            className="btn btn-primary btn-sm"
                            title="Generate reminder notice"
                          >
                            <Send size={14} />
                          </button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
