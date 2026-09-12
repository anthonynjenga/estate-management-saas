import React from 'react';
import { useEstate } from '../context/EstateContext';
import { ShieldAlert, Sparkles, AlertOctagon, CheckCircle2, Send, Activity, FileText, UserMinus } from 'lucide-react';
import type { Unit } from '../types';

interface DefaulterClassificationProps {
  onOpenVacateModal?: (unit: Unit) => void;
}

export const DefaulterClassification: React.FC<DefaulterClassificationProps> = ({ onOpenVacateModal }) => {
  const { units, estate, setSelectedUnitForModal, setActiveTab } = useEstate();

  const criticalUnits = units.filter(u => u.riskCategory === 'Critical');
  const highUnits = units.filter(u => u.riskCategory === 'High');
  const mediumUnits = units.filter(u => u.riskCategory === 'Medium');
  const lowUnits = units.filter(u => u.riskCategory === 'Low');

  const repeatDefaulters = units.filter(u => u.isRepeatDefaulter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
        border: '1px solid rgba(217, 70, 239, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#d946ef" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d946ef', textTransform: 'uppercase' }}>
              Automated Risk Engine
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Defaulter Risk Classification & Recovery Insights
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Smart classification of overdue accounts based on delay duration, debt ratio, and historical repeat patterns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '12px 18px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Repeat Defaulters</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d946ef' }}>
              {repeatDefaulters.length} Units
            </div>
          </div>
        </div>
      </div>

      {/* 4 Risk Category Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Critical Risk Card */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #d946ef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d946ef' }}>CRITICAL RISK (85-100)</span>
            <AlertOctagon size={20} color="#d946ef" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {criticalUnits.length} Units
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {estate.currency} {criticalUnits.reduce((a, u) => a + u.currentBalance, 0).toLocaleString()} balance
          </span>
        </div>

        {/* High Risk Card */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>HIGH RISK (65-84)</span>
            <ShieldAlert size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {highUnits.length} Units
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {estate.currency} {highUnits.reduce((a, u) => a + u.currentBalance, 0).toLocaleString()} balance
          </span>
        </div>

        {/* Medium Risk Card */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>MEDIUM RISK (35-64)</span>
            <Activity size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {mediumUnits.length} Units
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {estate.currency} {mediumUnits.reduce((a, u) => a + u.currentBalance, 0).toLocaleString()} balance
          </span>
        </div>

        {/* Low Risk Card */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>LOW RISK (0-34)</span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {lowUnits.length} Units
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On time or minor grace period</span>
        </div>
      </div>

      {/* AI Risk Analysis & Action Recommendations Grid */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Defaulter Risk Roster</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated risk scoring breakdown & custom recovery strategy</span>
          </div>
          <button onClick={() => setActiveTab('reminders')} className="btn btn-primary">
            <Send size={16} />
            <span>Generate Demand Notices</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {units.filter(u => u.currentBalance > 0).sort((a, b) => b.riskScore - a.riskScore).map(u => (
            <div
              key={u.id}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: u.riskCategory === 'Critical' ? '1px solid rgba(217, 70, 239, 0.4)' : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: u.riskCategory === 'Critical' ? 'rgba(217, 70, 239, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: u.riskCategory === 'Critical' ? '#d946ef' : '#ef4444'
                  }}>
                    {u.riskScore}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{u.unitNumber}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({u.block})</span>
                      <span className={`badge ${u.riskCategory === 'Critical' ? 'badge-critical' : (u.riskCategory === 'High' ? 'badge-high' : 'badge-medium')}`}>
                        {u.riskCategory} Risk
                      </span>
                      {u.isRepeatDefaulter && (
                        <span className="badge badge-high" style={{ background: 'rgba(217, 70, 239, 0.2)', color: '#d946ef' }}>
                          Repeat Defaulter
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Resident: <strong>{u.ownerName}</strong> • Contact: {u.ownerPhone} • {u.ownerEmail}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Balance Due</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
                    {estate.currency} {u.currentBalance.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.daysOverdue} days overdue</span>
                </div>
              </div>

              {/* Identified Risk Factors & Recovery Strategy */}
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Factors Detected:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {u.riskFactors.map((rf, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                        • {rf}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Recommended Action Strategy:</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: '4px 0 0 0', fontWeight: 500 }}>
                    {u.riskCategory === 'Critical'
                      ? 'Issue Formal Demand Notice with 7-day legal escalation clause and suspend gate remote control access.'
                      : (u.riskCategory === 'High'
                        ? 'Dispatch Firm Overdue Notice via SMS & WhatsApp. Follow up with telephone call.'
                        : 'Send polite friendly check-in reminder before next billing cycle.')
                    }
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setSelectedUnitForModal(u)}
                  className="btn btn-secondary btn-sm"
                >
                  View Full History
                </button>

                {onOpenVacateModal && (
                  <button
                    onClick={() => onOpenVacateModal(u)}
                    className="btn btn-danger btn-sm"
                    title="Remove / Vacate Resident"
                  >
                    <UserMinus size={14} />
                    <span>Vacate Resident</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedUnitForModal(u);
                    setActiveTab('reminders');
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <FileText size={14} />
                  <span>Generate Notice for {u.unitNumber}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
