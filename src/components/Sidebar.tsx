import React from 'react';
import { useEstate } from '../context/EstateContext';
import { 
  LayoutDashboard, 
  Calculator, 
  Clock, 
  ShieldAlert, 
  FileText, 
  MessageSquareText, 
  Mail, 
  FileCheck2, 
  PieChart, 
  Receipt,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, units } = useEstate();

  const overdueCount = units.filter(u => u.paymentStatus === 'Overdue').length;
  const criticalRiskCount = units.filter(u => u.riskCategory === 'Critical').length;

  const menuItems = [
    { id: 'dashboard', label: 'Monthly Collection Dashboard', icon: LayoutDashboard, badge: null, category: 'Overview' },
    { id: 'calculator', label: 'Service-Charge Calculator', icon: Calculator, badge: null, category: 'Financial Tools' },
    { id: 'arrears', label: 'Arrears Tracker & Ledger', icon: Clock, badge: overdueCount > 0 ? `${overdueCount}` : null, category: 'Financial Tools' },
    { id: 'defaulters', label: 'Defaulter Risk Classification', icon: ShieldAlert, badge: criticalRiskCount > 0 ? `${criticalRiskCount} Critical` : null, category: 'Risk Engine' },
    { id: 'reminders', label: 'Payment Notice Generator', icon: FileText, badge: null, category: 'Communications' },
    { id: 'sms', label: 'SMS & WhatsApp Templates', icon: MessageSquareText, badge: 'Quick Copy', category: 'Communications' },
    { id: 'email', label: 'Email Reminder Generator', icon: Mail, badge: null, category: 'Communications' },
    { id: 'committee', label: 'Committee Report Generator', icon: FileCheck2, badge: 'Executive', category: 'Reporting' },
    { id: 'budget', label: 'Budget Calculator & Forecast', icon: PieChart, badge: null, category: 'Planning' },
    { id: 'expenses', label: 'Expense Tracker (Receipt Scanner)', icon: Receipt, badge: null, category: 'Planning' },
  ];

  // Group by category
  const categories = ['Overview', 'Financial Tools', 'Risk Engine', 'Communications', 'Reporting', 'Planning'];

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: '72px',
      overflowY: 'auto',
      padding: '20px 12px'
    }}>
      <div style={{ padding: '0 8px 16px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            10 Management Modules Ready
          </span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {categories.map(cat => {
          const items = menuItems.filter(item => item.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-dim)',
                padding: '0 12px 6px 12px'
              }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'var(--accent-primary)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.88rem'
                      }}
                      className={isActive ? '' : 'sidebar-item-hover'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={18} color={isActive ? '#ffffff' : (item.id === 'defaulters' ? '#ef4444' : 'var(--text-muted)')} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: isActive ? 'rgba(255, 255, 255, 0.25)' : (item.badge.includes('Critical') ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)'),
                          color: isActive ? '#ffffff' : (item.badge.includes('Critical') ? '#ef4444' : 'var(--text-muted)')
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Promo Box */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#6366f1" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Smart Risk Predictor</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          Automated payment delay forecasting reduces arrears by up to 38%.
        </p>
      </div>
    </aside>
  );
};
