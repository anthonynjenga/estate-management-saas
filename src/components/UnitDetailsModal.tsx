import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { X, Send, CheckCircle2, UserMinus } from 'lucide-react';
import type { Unit } from '../types';

interface UnitDetailsModalProps {
  onOpenVacateModal?: (unit: Unit) => void;
}

export const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({ onOpenVacateModal }) => {
  const { selectedUnitForModal, setSelectedUnitForModal, estate, payments, addPayment, setActiveTab } = useEstate();

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Bank Transfer' | 'Credit Card' | 'Direct Debit' | 'Cheque'>('M-Pesa');
  const [refNo, setRefNo] = useState('');
  const [isLogSuccess, setIsLogSuccess] = useState(false);

  if (!selectedUnitForModal) return null;

  const unit = selectedUnitForModal;
  const unitPayments = payments.filter(p => p.unitId === unit.id || p.unitNumber === unit.unitNumber);

  const handleQuickLogPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = paymentAmount || unit.currentBalance;
    if (amt <= 0) return;

    addPayment({
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      residentName: unit.ownerName,
      amountPaid: amt,
      paymentDate: new Date().toISOString().split('T')[0],
      method: paymentMethod,
      referenceNo: refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceMonth: '2026-09',
      status: 'Completed'
    });

    setIsLogSuccess(true);
    setTimeout(() => {
      setIsLogSuccess(false);
      setSelectedUnitForModal(null);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedUnitForModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Unit {unit.unitNumber}</h2>
              <span className={`badge ${unit.riskCategory === 'Critical' ? 'badge-critical' : (unit.riskCategory === 'High' ? 'badge-high' : 'badge-low')}`}>
                {unit.riskCategory} Risk
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {unit.block} • {unit.propertyType} ({unit.sizeSqFt} sq ft)
            </p>
          </div>

          <button
            onClick={() => setSelectedUnitForModal(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Resident Info & Balance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Resident / Owner Details</span>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '4px' }}>{unit.ownerName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div>📞 {unit.ownerPhone}</div>
              <div>✉️ {unit.ownerEmail}</div>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Current Ledger Account</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: unit.currentBalance > 0 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
              {estate.currency} {unit.currentBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Monthly Charge: {estate.currency} {unit.monthlyServiceCharge.toLocaleString()} ({unit.daysOverdue} days overdue)
            </div>
          </div>
        </div>

        {/* AI Risk Score Breakdown */}
        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Risk Evaluation Score: {unit.riskScore}/100</span>
            {unit.isRepeatDefaulter && <span className="badge badge-high">Repeat Defaulter Tag</span>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {unit.riskFactors.map((rf, idx) => (
              <span key={idx} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                • {rf}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Payment Settlement Box */}
        {unit.currentBalance > 0 && (
          <form onSubmit={handleQuickLogPayment} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 10px 0' }}>Log Quick Settlement Payment</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="number"
                className="input-field"
                placeholder={`Amount (${unit.currentBalance})`}
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
              />
              <select
                className="input-field"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Direct Debit">Direct Debit</option>
                <option value="Cheque">Cheque</option>
              </select>
              <input
                type="text"
                className="input-field"
                placeholder="Ref Code (e.g. QKS99201)"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <CheckCircle2 size={16} />
              <span>Confirm & Record Payment</span>
            </button>

            {isLogSuccess && (
              <div style={{ marginTop: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                Payment successfully registered to unit ledger!
              </div>
            )}
          </form>
        )}

        {/* Payment History List */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 10px 0' }}>Recent Payment History</h4>
          {unitPayments.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No recent payments logged for this unit.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {unitPayments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <span>{p.paymentDate} • {p.method} ({p.referenceNo})</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>+{estate.currency} {p.amountPaid.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          {onOpenVacateModal && (
            <button
              onClick={() => {
                const target = unit;
                setSelectedUnitForModal(null);
                onOpenVacateModal(target);
              }}
              className="btn btn-danger btn-sm"
            >
              <UserMinus size={16} />
              <span>Remove / Vacate Resident</span>
            </button>
          )}

          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
            <button onClick={() => setSelectedUnitForModal(null)} className="btn btn-secondary">
              Close Window
            </button>
            {unit.currentBalance > 0 && (
              <button
                onClick={() => {
                  setSelectedUnitForModal(unit);
                  setActiveTab('reminders');
                }}
                className="btn btn-primary"
              >
                <Send size={16} />
                <span>Generate Notice for {unit.unitNumber}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
