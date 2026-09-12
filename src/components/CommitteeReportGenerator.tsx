import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { FileCheck2, Sparkles, Printer } from 'lucide-react';

export const CommitteeReportGenerator: React.FC = () => {
  const { estate, units, payments, expenses } = useEstate();

  const [periodMonth] = useState('September 2026');
  const [isGenerating, setIsGenerating] = useState(false);

  // Financial calculations
  const totalBilled = units.reduce((acc, u) => acc + u.monthlyServiceCharge, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalArrears = units.reduce((acc, u) => acc + u.currentBalance, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netSurplus = totalCollected - totalExpenses;
  const criticalDefaulters = units.filter(u => u.riskCategory === 'Critical' || u.riskCategory === 'High');

  // AI Narrative Summary Text
  const [executiveSummary, setExecutiveSummary] = useState(
    `EXECUTIVE FINANCIAL & OPERATIONAL SUMMARY - ${periodMonth.toUpperCase()}

1. FINANCIAL PERFORMANCE & SERVICE CHARGE RECOVERY:
During the ${periodMonth} billing cycle, ${estate.name} billed a total of ${estate.currency} ${totalBilled.toLocaleString()} across ${units.length} registered estate units. Total actual collections stood at ${estate.currency} ${totalCollected.toLocaleString()}, representing a collection recovery efficiency rate of ${collectionRate}%.

Accumulated outstanding arrears total ${estate.currency} ${totalArrears.toLocaleString()} across ${units.filter(u => u.currentBalance > 0).length} delinquent accounts. ${criticalDefaulters.length} units are classified under High/Critical Risk (>60 days default).

2. EXPENDITURE & CAPITAL BUDGET VARIANCE:
Total operational expenditures incurred during the period totaled ${estate.currency} ${totalExpenses.toLocaleString()}. Major cost drivers included 24/7 Gate & Patrol Security (${estate.currency} ${expenses.filter(e => e.category === 'Security').reduce((a, e) => a + e.amount, 0).toLocaleString()}), Common Electricity (${estate.currency} ${expenses.filter(e => e.category === 'Utilities').reduce((a, e) => a + e.amount, 0).toLocaleString()}), and Elevator Servicing.

Net operational surplus for the month stands at ${estate.currency} ${netSurplus.toLocaleString()}, which has been allocated to the Sinking Fund High-Yield Reserve.

3. COMMITTEE RECOMMENDATIONS FOR AGM ACTION:
• Issue formal pre-legal demand notices to Unit V-02 and Unit A-103.
• Authorize deactivation of gate barrier access tags for default accounts >90 days per HOA Bylaw 14.2.
• Approve scheduled Q4 solar lighting installation quote to reduce monthly KPLC power bills by 18%.`
  );

  const handleRegenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>HOA Committee Financial & Operational Report - ${periodMonth}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { text-align: center; border-bottom: 3px double #334155; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
              .header p { margin: 4px 0 0 0; color: #64748b; font-size: 14px; }
              .kpi-row { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 15px; }
              .kpi-box { flex: 1; padding: 15px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center; }
              .kpi-box h3 { margin: 0; font-size: 20px; color: #0f172a; }
              .kpi-box p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
              .section-title { font-size: 16px; font-weight: bold; border-left: 4px solid #6366f1; padding-left: 10px; margin: 25px 0 15px 0; text-transform: uppercase; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
              th { background: #f1f5f9; font-weight: bold; text-transform: uppercase; font-size: 11px; }
              .footer { margin-top: 50px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; }
              .sig-block { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${estate.name}</h1>
              <p>HOA BOARD OF DIRECTORS & COMMITTEE MONTHLY REPORT • ${periodMonth.toUpperCase()}</p>
            </div>

            <div class="kpi-row">
              <div class="kpi-box">
                <h3>${estate.currency} ${totalBilled.toLocaleString()}</h3>
                <p>Total Billed</p>
              </div>
              <div class="kpi-box">
                <h3>${estate.currency} ${totalCollected.toLocaleString()}</h3>
                <p>Actual Collected (${collectionRate}%)</p>
              </div>
              <div class="kpi-box">
                <h3>${estate.currency} ${totalArrears.toLocaleString()}</h3>
                <p>Outstanding Arrears</p>
              </div>
              <div class="kpi-box">
                <h3>${estate.currency} ${totalExpenses.toLocaleString()}</h3>
                <p>Monthly Expenses</p>
              </div>
            </div>

            <div class="section-title">1. Executive Summary & Operational Highlights</div>
            <pre>${executiveSummary}</pre>

            <div class="section-title">2. Priority Delinquent Defaulters Roster</div>
            <table>
              <thead>
                <tr>
                  <th>Unit Number</th>
                  <th>Resident / Owner</th>
                  <th>Overdue Days</th>
                  <th>Outstanding Balance</th>
                  <th>Risk Category</th>
                </tr>
              </thead>
              <tbody>
                ${units.filter(u => u.currentBalance > 0).map(u => `
                  <tr>
                    <td><strong>${u.unitNumber} (${u.block})</strong></td>
                    <td>${u.ownerName}</td>
                    <td>${u.daysOverdue} Days</td>
                    <td>${estate.currency} ${u.currentBalance.toLocaleString()}</td>
                    <td>${u.riskCategory}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <div class="sig-block">
                Prepared By:<br><strong>${estate.managerName}</strong><br>Lead Property Manager
              </div>
              <div class="sig-block">
                Approved By:<br><strong>HOA Board Chairman</strong><br>${estate.name}
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={22} color="#8b5cf6" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase' }}>
              Board & AGM Reporting Studio
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Monthly Committee Report Generator
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Smart executive narrative summary generator for HOA board meetings, financial breakdowns, and PDF/Print publishing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleRegenerateAI} className="btn btn-secondary" disabled={isGenerating}>
            <Sparkles size={18} color="#8b5cf6" />
            <span>{isGenerating ? 'Generating Narrative...' : 'Regenerate Narrative'}</span>
          </button>
          <button onClick={handlePrintReport} className="btn btn-primary">
            <Printer size={18} />
            <span>Print / Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Billed</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>
            {estate.currency} {totalBilled.toLocaleString()}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Actual Collections</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {estate.currency} {totalCollected.toLocaleString()} ({collectionRate}%)
          </div>
        </div>
        <div className="glass-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Expenses</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {estate.currency} {totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Net Monthly Surplus</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: netSurplus >= 0 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
            {estate.currency} {netSurplus.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Narrative Summary Editor */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Executive Narrative & Recommendations</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fully Editable Text</span>
        </div>

        <textarea
          className="input-field"
          value={executiveSummary}
          onChange={(e) => setExecutiveSummary(e.target.value)}
          rows={16}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.6, padding: '16px', borderRadius: 'var(--radius-md)' }}
        />
      </div>
    </div>
  );
};
