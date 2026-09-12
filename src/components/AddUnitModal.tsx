import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { X, Plus, Building } from 'lucide-react';
import type { PropertyType } from '../types';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose }) => {
  const { addUnit, formula } = useEstate();

  const [unitNumber, setUnitNumber] = useState('');
  const [block, setBlock] = useState('Block A (Azure)');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [sizeSqFt, setSizeSqFt] = useState<number>(1200);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !ownerName) return;

    // Calculate initial service charge
    const sqFtCharge = sizeSqFt * formula.baseRatePerSqFt;
    const monthlyCharge = Math.round(sqFtCharge + formula.securityLevyFixed + formula.wasteWaterLevyFixed);

    addUnit({
      unitNumber,
      block,
      ownerName,
      ownerPhone: ownerPhone || '+254 700 000 000',
      ownerEmail: ownerEmail || 'resident@estate-demo.invalid',
      propertyType,
      sizeSqFt,
      monthlyServiceCharge: monthlyCharge,
      currentBalance: 0,
      paymentStatus: 'Paid',
      daysOverdue: 0,
      riskCategory: 'Low',
      riskScore: 5,
      riskFactors: ['Newly added unit'],
      isRepeatDefaulter: false
    });

    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '540px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Register New Unit</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Add property details to service charge billing</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Unit Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. B-402"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Block / Wing</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Block B"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Owner / Resident Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ching Chang Wambui"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="+254 700 000 000"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="resident@estate-demo.invalid"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Property Type</label>
              <select className="input-field" value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)}>
                <option value="Apartment">Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="input-label">Size (Sq Ft)</label>
              <input
                type="number"
                className="input-field"
                value={sizeSqFt}
                onChange={(e) => setSizeSqFt(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              <span>Save Property Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
