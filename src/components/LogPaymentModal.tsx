import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { X, CheckCircle2 } from 'lucide-react';

interface LogPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogPaymentModal: React.FC<LogPaymentModalProps> = ({ isOpen, onClose }) => {
  const { units, addPayment, estate } = useEstate();

  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [method, setMethod] = useState<'M-Pesa' | 'Bank Transfer' | 'Credit Card' | 'Direct Debit' | 'Cheque'>('M-Pesa');
  const [referenceNo, setReferenceNo] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const targetUnit = units.find(u => u.id === unitId) || units[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUnit) return;
    const amt = amountPaid > 0 ? amountPaid : targetUnit.currentBalance;
    if (amt <= 0) return;

    addPayment({
      unitId: targetUnit.id,
      unitNumber: targetUnit.unitNumber,
      residentName: targetUnit.ownerName,
      amountPaid: amt,
      paymentDate,
      method,
      referenceNo: referenceNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceMonth: '2026-09',
      status: 'Completed'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Record Service Charge Payment</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="input-label">Select Unit & Resident</label>
            <select
              className="input-field"
              value={unitId}
              onChange={(e) => {
                setUnitId(e.target.value);
                const selected = units.find(u => u.id === e.target.value);
                if (selected) setAmountPaid(selected.currentBalance);
              }}
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} - {u.ownerName} (Owed: {estate.currency} {u.currentBalance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Amount Paid ({estate.currency})</label>
              <input
                type="number"
                className="input-field"
                placeholder={targetUnit ? targetUnit.currentBalance.toString() : '0'}
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="input-label">Payment Channel</label>
              <select className="input-field" value={method} onChange={(e) => setMethod(e.target.value as any)}>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Direct Debit">Direct Debit</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Reference No / Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. RHS992019"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Payment Date</label>
              <input
                type="date"
                className="input-field"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
              <CheckCircle2 size={16} />
              <span>Confirm & Settle Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
