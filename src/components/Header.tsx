import React from 'react';
import { useEstate } from '../context/EstateContext';
import { 
  Building2, 
  Search, 
  Sparkles, 
  Moon, 
  Sun, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign 
} from 'lucide-react';

interface HeaderProps {
  onOpenAddUnit: () => void;
  onOpenLogPayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddUnit, onOpenLogPayment }) => {
  const { 
    estate, 
    units, 
    searchQuery, 
    setSearchQuery, 
    isDarkMode, 
    toggleDarkMode, 
    isCopilotOpen, 
    setIsCopilotOpen, 
    resetAllData 
  } = useEstate();

  // Metrics summary for header pills
  const totalArrears = units.reduce((acc, u) => acc + u.currentBalance, 0);
  const criticalDefaulters = units.filter(u => u.riskCategory === 'Critical' || u.riskCategory === 'High').length;

  return (
    <header style={{
      height: '72px',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--backdrop-blur)',
      WebkitBackdropFilter: 'var(--backdrop-blur)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      {/* Left: Brand & Estate Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Building2 size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Estate<span className="gradient-text">Pro</span> <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', textTransform: 'uppercase' }}>Pro SaaS</span>
            </h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {estate.name} • {estate.totalUnits} Units
          </p>
        </div>
      </div>

      {/* Middle: Search Bar & Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, maxWidth: '580px', margin: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search unit (e.g. A-101), resident name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Quick KPI Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ef4444',
            whiteSpace: 'nowrap'
          }}>
            <AlertTriangle size={14} />
            <span>{criticalDefaulters} High Risk</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#10b981',
            whiteSpace: 'nowrap'
          }}>
            <DollarSign size={14} />
            <span>{estate.currency} {totalArrears.toLocaleString()} Arrears</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onOpenLogPayment}
          className="btn btn-secondary btn-sm"
          title="Record a payment"
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>Log Payment</span>
        </button>

        <button
          onClick={onOpenAddUnit}
          className="btn btn-primary btn-sm"
          title="Add new property unit"
        >
          <Plus size={16} />
          <span>Add Unit</span>
        </button>

        {/* Copilot Toggle Button */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className="btn"
          style={{
            background: isCopilotOpen ? 'var(--accent-gradient)' : 'rgba(99, 102, 241, 0.15)',
            color: isCopilotOpen ? '#ffffff' : '#6366f1',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '8px 14px'
          }}
        >
          <Sparkles size={18} className={isCopilotOpen ? '' : 'gradient-text'} />
          <span>Copilot Assistant</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="btn btn-secondary btn-sm"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-full)' }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to default initial state?')) {
              resetAllData();
            }
          }}
          className="btn btn-secondary btn-sm"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-full)', color: 'var(--text-dim)' }}
          title="Reset Demo Data"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
};
