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
      ownerEmail: ownerEmail || 'owner@estate.com',
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Add New Estate Unit</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Unit Number (e.g. A-305)</label>
              <input
                type="text"
                className="input-field"
                placeholder="A-305"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Block / Phase</label>
              <select className="input-field" value={block} onChange={(e) => setBlock(e.target.value)}>
                <option value="Block A (Azure)">Block A (Azure)</option>
                <option value="Block B (Crestview)">Block B (Crestview)</option>
                <option value="Block C (Horizon)">Block C (Horizon)</option>
                <option value="Villa Zone (Royal Oaks)">Villa Zone (Royal Oaks)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Owner / Resident Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Jane Doe"
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
                placeholder="+254 712 345 678"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="resident@gmail.com"
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
