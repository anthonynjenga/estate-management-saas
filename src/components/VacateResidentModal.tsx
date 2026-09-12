import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { X, UserMinus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Unit } from '../types';

interface VacateResidentModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VacateResidentModal: React.FC<VacateResidentModalProps> = ({ unit, isOpen, onClose }) => {
  const { updateUnit, deleteUnit, estate } = useEstate();

  const [vacateOption, setVacateOption] = useState<'mark_vacant' | 'assign_new' | 'delete_unit'>('mark_vacant');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [clearOutstandingBalance, setClearOutstandingBalance] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (vacateOption === 'delete_unit') {
      deleteUnit(unit.id);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
      return;
    }

    if (vacateOption === 'assign_new') {
      if (!newOwnerName.trim()) return;
      updateUnit(unit.id, {
        ownerName: newOwnerName.trim(),
        ownerPhone: newOwnerPhone.trim() || '+254 700 000 000',
        ownerEmail: newOwnerEmail.trim() || 'resident@estate-demo.invalid',
        currentBalance: clearOutstandingBalance ? 0 : unit.currentBalance,
        daysOverdue: clearOutstandingBalance ? 0 : unit.daysOverdue,
        paymentStatus: clearOutstandingBalance ? 'Paid' : unit.paymentStatus,
        riskScore: 5,
        riskCategory: 'Low',
        riskFactors: ['New resident assigned'],
        isRepeatDefaulter: false,
        notes: `New resident onboarded on ${new Date().toLocaleDateString()}. Previous resident departed.`
      });
    } else {
      // Mark Vacant
      updateUnit(unit.id, {
        ownerName: '[Vacant Unit - Resident Departed]',
        ownerPhone: 'N/A',
        ownerEmail: 'vacant@estate-demo.invalid',
        currentBalance: clearOutstandingBalance ? 0 : unit.currentBalance,
        daysOverdue: clearOutstandingBalance ? 0 : unit.daysOverdue,
        paymentStatus: clearOutstandingBalance ? 'Paid' : unit.paymentStatus,
        riskScore: 0,
        riskCategory: 'Low',
        riskFactors: ['Unit is currently vacant'],
        isRepeatDefaulter: false,
        notes: `Previous resident (${unit.ownerName}) departed on ${new Date().toLocaleDateString()}.`
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserMinus size={20} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Remove / Vacate Resident</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Unit {unit.unitNumber} ({unit.block}) • Current Resident: {unit.ownerName}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Warning Callout if Outstanding Balance exists */}
        {unit.currentBalance > 0 && (
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', marginBottom: '18px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Outstanding Arrears Warning:</strong> {unit.ownerName} currently has an unsettled balance of <strong>{estate.currency} {unit.currentBalance.toLocaleString()}</strong> ({unit.daysOverdue} days overdue).
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="input-label">Select Action for Departed Resident</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Option 1: Mark Vacant */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: vacateOption === 'mark_vacant' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-tertiary)',
                border: vacateOption === 'mark_vacant' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="vacate_opt"
                  checked={vacateOption === 'mark_vacant'}
                  onChange={() => setVacateOption('mark_vacant')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Archive & Mark Unit as Vacant</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sets resident as '[Vacant Unit]' until a new resident moves in.</div>
                </div>
              </label>

              {/* Option 2: Assign New Resident Immediately */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: vacateOption === 'assign_new' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                border: vacateOption === 'assign_new' ? '1px solid #10b981' : '1px solid var(--border-color)',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="vacate_opt"
                  checked={vacateOption === 'assign_new'}
                  onChange={() => setVacateOption('assign_new')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>Onboard & Assign New Incoming Resident</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Replace departed resident with new tenant/owner credentials.</div>
                </div>
              </label>

              {/* Option 3: Delete Unit */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: vacateOption === 'delete_unit' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-tertiary)',
                border: vacateOption === 'delete_unit' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="vacate_opt"
                  checked={vacateOption === 'delete_unit'}
                  onChange={() => setVacateOption('delete_unit')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444' }}>Delete Property Unit Entirely</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completely remove Unit {unit.unitNumber} from estate directory.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Form fields if assigning new resident */}
          {vacateOption === 'assign_new' && (
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#10b981' }}>New Resident Credentials:</div>
              <div>
                <label className="input-label">New Resident Full Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Ching Chang Wambui"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="+254 700 000 000"
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="new.resident@estate-demo.invalid"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Outstanding Balance Settlement Checkbox */}
          {unit.currentBalance > 0 && vacateOption !== 'delete_unit' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={clearOutstandingBalance}
                onChange={(e) => setClearOutstandingBalance(e.target.checked)}
              />
              <span>Clear previous arrears balance ({estate.currency} {unit.currentBalance.toLocaleString()}) for clean start</span>
            </label>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button
              type="submit"
              className={`btn ${vacateOption === 'delete_unit' ? 'btn-danger' : 'btn-primary'}`}
            >
              {vacateOption === 'delete_unit' ? <Trash2 size={16} /> : <UserMinus size={16} />}
              <span>
                {vacateOption === 'delete_unit'
                  ? 'Confirm Unit Deletion'
                  : (vacateOption === 'assign_new' ? 'Onboard New Resident' : 'Confirm Resident Departure')
                }
              </span>
            </button>
          </div>

          {isSuccess && (
            <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '6px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>Resident status successfully updated!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
