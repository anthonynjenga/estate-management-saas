import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { Calculator, Save, CheckCircle2, Building2, Sliders, Shield, Zap } from 'lucide-react';
import type { PropertyType } from '../types';

export const ServiceChargeCalculator: React.FC = () => {
  const { formula, updateFormula, estate, units } = useEstate();

  // Local state for dynamic playground calculation
  const [baseRate, setBaseRate] = useState(formula.baseRatePerSqFt);
  const [sinkingFundPct, setSinkingFundPct] = useState(formula.sinkingFundPercentage);
  const maintenancePct = formula.maintenancePercentage;
  const [securityLevy, setSecurityLevy] = useState(formula.securityLevyFixed);
  const [wasteWaterLevy, setWasteWaterLevy] = useState(formula.wasteWaterLevyFixed);

  // Playground unit calculator state
  const [sampleType, setSampleType] = useState<PropertyType>('Apartment');
  const [sampleSizeSqFt, setSampleSizeSqFt] = useState<number>(1400);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Playground calculated output
  const sqFtComponent = sampleSizeSqFt * baseRate;
  const maintenanceComponent = (sqFtComponent * maintenancePct) / 100;
  const sinkingFundComponent = (sqFtComponent * sinkingFundPct) / 100;
  const totalCalculatedCharge = Math.round(sqFtComponent + securityLevy + wasteWaterLevy);

  const handleApplyToEstate = () => {
    updateFormula({
      baseRatePerSqFt: baseRate,
      sinkingFundPercentage: sinkingFundPct,
      maintenancePercentage: maintenancePct,
      securityLevyFixed: securityLevy,
      wasteWaterLevyFixed: wasteWaterLevy,
      tenantSurchargePercentage: 5
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={22} color="#6366f1" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Service Charge Rate Engine
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Estate Service Charge Calculator & Formula Builder
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Configure square footage rate multipliers, fixed utility levies, sinking fund reserves, and update estate unit rates.
          </p>
        </div>

        {isSavedNotice && (
          <div style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Applied & Saved to All {units.length} Estate Units!</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Left Column: Formula Parameters Control Panel */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sliders size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Formula Parameters</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Currency: {estate.currency}</span>
          </div>

          {/* Slider 1: Base Rate per Sq Ft */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="input-label" style={{ margin: 0 }}>Base Rate per Sq Ft / Sq M</label>
              <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{estate.currency} {baseRate} / sq ft</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="0.5"
              value={baseRate}
              onChange={(e) => setBaseRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Determines spatial maintenance weightage across units.</span>
          </div>

          {/* Slider 2: Sinking Fund Percentage */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="input-label" style={{ margin: 0 }}>Sinking Fund Reserve Allocation</label>
              <span style={{ fontWeight: 800, color: '#f59e0b' }}>{sinkingFundPct}% of spatial levy</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={sinkingFundPct}
              onChange={(e) => setSinkingFundPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Long-term capital improvement reserve fund (Elevators, Roofs, Generators).</span>
          </div>

          {/* Fixed Levy 1: Security Services */}
          <div>
            <label className="input-label">Fixed 24/7 Security Levy (per unit/mo)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--text-muted)" />
              <input
                type="number"
                className="input-field"
                value={securityLevy}
                onChange={(e) => setSecurityLevy(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Fixed Levy 2: Waste Water & Environment */}
          <div>
            <label className="input-label">Fixed Waste Management & Water Levy (per unit/mo)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--text-muted)" />
              <input
                type="number"
                className="input-field"
                value={wasteWaterLevy}
                onChange={(e) => setWasteWaterLevy(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={handleApplyToEstate} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Save size={20} />
              <span>Apply & Recalculate All Units</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Unit Simulator & Breakdown */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Sample Unit Calculation Playground</h3>
            </div>
            <span className="badge badge-low">Live Preview</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="input-label">Property Type</label>
              <select
                className="input-field"
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value as PropertyType)}
              >
                <option value="Apartment">Standard Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa / Townhouse</option>
                <option value="Commercial">Commercial Shop</option>
              </select>
            </div>

            <div>
              <label className="input-label">Unit Area (Sq Ft)</label>
              <input
                type="number"
                className="input-field"
                value={sampleSizeSqFt}
                onChange={(e) => setSampleSizeSqFt(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Breakdown Card Display */}
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Spatial Charge ({sampleSizeSqFt} sq ft × {baseRate}):</span>
              <span style={{ fontWeight: 700 }}>{estate.currency} {sqFtComponent.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>• Sinking Fund Portion ({sinkingFundPct}%):</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>{estate.currency} {sinkingFundComponent.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>• Operational Maintenance ({maintenancePct}%):</span>
              <span style={{ fontWeight: 600, color: '#6366f1' }}>{estate.currency} {maintenanceComponent.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fixed 24/7 Security Levy:</span>
              <span style={{ fontWeight: 700 }}>{estate.currency} {securityLevy.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fixed Waste & Utility Levy:</span>
              <span style={{ fontWeight: 700 }}>{estate.currency} {wasteWaterLevy.toLocaleString()}</span>
            </div>

            <div style={{
              marginTop: '8px',
              paddingTop: '12px',
              borderTop: '2px stroke var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Total Monthly Service Charge</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
                  {estate.currency} {totalCalculatedCharge.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Billed monthly on 1st
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estate Unit Rate Preview Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Estate Rate Distribution Matrix</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated service charges across all active units</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Type</th>
                <th>Size (sq ft)</th>
                <th>Base Area Charge</th>
                <th>Security & Waste Levy</th>
                <th>Total Calculated Monthly Service Charge</th>
              </tr>
            </thead>
            <tbody>
              {units.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700 }}>{u.unitNumber} ({u.block})</td>
                  <td><span className="badge badge-low">{u.propertyType}</span></td>
                  <td>{u.sizeSqFt} sq ft</td>
                  <td>{estate.currency} {(u.sizeSqFt * formula.baseRatePerSqFt).toLocaleString()}</td>
                  <td>{estate.currency} {(formula.securityLevyFixed + formula.wasteWaterLevyFixed).toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>
                    {estate.currency} {u.monthlyServiceCharge.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
