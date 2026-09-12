import React, { useState, useEffect } from 'react';
import { useEstate } from '../context/EstateContext';
import { FileText, Copy, Sparkles, Printer, CheckCircle2 } from 'lucide-react';
import type { Unit } from '../types';

export const PaymentReminderGenerator: React.FC = () => {
  const { units, estate, selectedUnitForModal } = useEstate();

  // Unit Selector
  const overdueUnits = units.filter(u => u.currentBalance > 0);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    selectedUnitForModal?.id || (overdueUnits.length > 0 ? overdueUnits[0].id : units[0]?.id || '')
  );

  useEffect(() => {
    if (selectedUnitForModal) {
      setSelectedUnitId(selectedUnitForModal.id);
    }
  }, [selectedUnitForModal]);

  const targetUnit = units.find(u => u.id === selectedUnitId) || units[0];

  // Tone state
  const [tone, setTone] = useState<'Gentle' | 'Firm' | 'Formal' | 'Legal'>('Formal');
  const [isCopied, setIsCopied] = useState(false);

  // Template tone presets generator
  const generateNoticeText = (tUnit: Unit, selectedTone: string) => {
    if (!tUnit) return '';

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const currentDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (selectedTone === 'Gentle') {
      return `MEMORANDUM & GENTLE SERVICE CHARGE REMINDER

DATE: ${currentDateStr}
TO: ${tUnit.ownerName} (Unit ${tUnit.unitNumber}, ${tUnit.block})
FROM: Management Office, ${estate.name}

Dear ${tUnit.ownerName},

We hope this message finds you well. 

This is a courtesy reminder regarding the monthly service charge account for Unit ${tUnit.unitNumber}. According to our estate financial ledger, there is a current outstanding balance of ${estate.currency} ${tUnit.currentBalance.toLocaleString()}.

Service charges directly fund 24/7 security guard services, common area electricity, water pumps, elevator maintenance, and compound landscaping.

PAYMENT DETAILS:
- Account / Paybill: ${estate.bankDetails.paybillNo}
- Bank Transfer: ${estate.bankDetails.bankName} | Acc: ${estate.bankDetails.accountNumber} (${estate.bankDetails.accountName})
- Reference: ${tUnit.unitNumber}

Kindly submit payment on or before ${formattedDueDate}. If you have already executed payment within the last 24 hours, please disregard this reminder and send your M-Pesa or bank reference code to ${estate.managerEmail}.

Warm regards,
${estate.managerName}
Estate Management Office`;
    }

    if (selectedTone === 'Firm') {
      return `OFFICIAL NOTICE: OVERDUE SERVICE CHARGE ACCOUNT

DATE: ${currentDateStr}
TO: ${tUnit.ownerName} (Unit ${tUnit.unitNumber}, ${tUnit.block})
FROM: Board of Directors & Management, ${estate.name}

TAKE NOTICE that service charge account for Unit ${tUnit.unitNumber} is now ${tUnit.daysOverdue} DAYS OVERDUE with a total balance of ${estate.currency} ${tUnit.currentBalance.toLocaleString()}.

Under Clause 8 of the Estate Bylaws, timely service charge payments are mandatory for all property owners and residents to ensure continuous estate operations.

REQUIRED ACTION:
Please settle the full balance of ${estate.currency} ${tUnit.currentBalance.toLocaleString()} by ${formattedDueDate}.

PAYMENT INSTRUCTIONS:
- M-Pesa Paybill: ${estate.bankDetails.paybillNo} (Account: ${tUnit.unitNumber})
- Direct Bank: ${estate.bankDetails.bankName} | Acc: ${estate.bankDetails.accountNumber}

Failure to settle balance by ${formattedDueDate} will result in late interest penalties (5% p.a.) added to your ledger.

Sincerely,
Management Committee | ${estate.name}`;
    }

    if (selectedTone === 'Legal') {
      return `FORMAL FINAL DEMAND NOTICE BEFORE LEGAL PROCEEDINGS & ACCESS SUSPENSION

DATE: ${currentDateStr}
REGISTERED NOTICE TO: ${tUnit.ownerName}
PROPERTY UNIT: Unit ${tUnit.unitNumber} (${tUnit.block}, ${estate.name})
TOTAL DELINQUENT ARREARS: ${estate.currency} ${tUnit.currentBalance.toLocaleString()}
DAYS IN DEFAULT: ${tUnit.daysOverdue} Days

TAKE FORMAL NOTICE that despite multiple previous written reminders, your service charge account for Unit ${tUnit.unitNumber} remains severely in default.

CONSEQUENCES OF CONTINUED NON-PAYMENT ON OR BEFORE ${formattedDueDate}:
1. IMMEDIATE DEACTIVATION of automated vehicle gate access tags / remote control codes.
2. SUSPENSION of access to non-essential common facilities (Gym, Swimming Pool, Clubhouse).
3. INCLUSION of Unit ${tUnit.unitNumber} on the Estate Public Defaulter Roster published to all HOA members.
4. IMMEDIATE INSTRUCTION of external advocates to initiate debt recovery court proceedings, with all associated advocate fees and court costs charged directly to your unit account.

We strongly urge you to settle the outstanding ${estate.currency} ${tUnit.currentBalance.toLocaleString()} via M-Pesa Paybill ${estate.bankDetails.paybillNo} or Bank Acc ${estate.bankDetails.accountNumber} on or before ${formattedDueDate} to avoid enforcement procedures.

DATED at Nairobi this ${currentDateStr}.

BY ORDER OF THE HOA BOARD OF DIRECTORS
____________________________________
${estate.managerName}
Managing Trustee | ${estate.name}`;
    }

    // Default Formal Tone
    return `FORMAL STATEMENT OF ACCOUNT & PAYMENT DEMAND

DATE: ${currentDateStr}
TO: ${tUnit.ownerName} (Unit ${tUnit.unitNumber}, ${tUnit.block})
FROM: HOA Executive Committee, ${estate.name}

STATEMENT SUMMARY:
- Property Unit: ${tUnit.unitNumber}
- Owner / Resident: ${tUnit.ownerName}
- Monthly Charge: ${estate.currency} ${tUnit.monthlyServiceCharge.toLocaleString()}
- Total Accumulated Balance Due: ${estate.currency} ${tUnit.currentBalance.toLocaleString()}
- Account Status: OVERDUE (${tUnit.daysOverdue} Days)

We write to request immediate settlement of the outstanding service charge balance of ${estate.currency} ${tUnit.currentBalance.toLocaleString()} for Unit ${tUnit.unitNumber}.

Estate service charges fund critical operations including security, elevator servicing, generator diesel, and borehole water infrastructure.

REMITTANCE METHOD:
• M-Pesa Paybill: ${estate.bankDetails.paybillNo} (Account: ${tUnit.unitNumber})
• Bank Account: ${estate.bankDetails.bankName} | Acc No: ${estate.bankDetails.accountNumber}

Please remit payment on or before ${formattedDueDate} and send receipt confirmation to ${estate.managerEmail}.

Thank you for your cooperation.

Sincerely,
${estate.managerName}
Estate Management Office`;
  };

  const [noticeText, setNoticeText] = useState('');

  useEffect(() => {
    if (targetUnit) {
      setNoticeText(generateNoticeText(targetUnit, tone));
    }
  }, [selectedUnitId, tone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(noticeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Demand Notice - Unit ${targetUnit?.unitNumber}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #111; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${estate.name}</h2>
              <p>${estate.location} • Contact: ${estate.managerPhone}</p>
            </div>
            <pre>${noticeText}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
            <FileText size={22} color="#6366f1" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Notice & Demand Letter Studio
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Payment Reminder & Demand Notice Generator
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Generate formal legal demand letters, gentle reminders, and customizable overdue notices with dynamic tag replacement.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Left Column: Generator Controls */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Notice Settings & Parameters
          </h3>

          {/* Unit Selector */}
          <div>
            <label className="input-label">Target Estate Unit</label>
            <select
              className="input-field"
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} - {u.ownerName} ({estate.currency} {u.currentBalance.toLocaleString()} {u.currentBalance > 0 ? 'Overdue' : 'Paid'})
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="input-label">Communication Tone</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(['Gentle', 'Firm', 'Formal', 'Legal'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: tone === t ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                    color: tone === t ? '#ffffff' : 'var(--text-main)',
                    border: tone === t ? 'none' : '1px solid var(--border-color)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t === 'Gentle' && '🟢 Gentle Friendly'}
                  {t === 'Firm' && '🟡 Firm Notice'}
                  {t === 'Formal' && '🔵 Formal Statement'}
                  {t === 'Legal' && '💜 Legal Demand'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tags Cheat Sheet */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Dynamic Variable Injection:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {['{{resident_name}}', '{{unit_no}}', '{{amount_due}}', '{{due_date}}', '{{days_overdue}}', '{{paybill}}'].map(tag => (
                <span key={tag} style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Formatted Notice Preview */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Generated Document Preview</h3>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                {isCopied ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <button onClick={handlePrint} className="btn btn-primary btn-sm">
                <Printer size={16} />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>

          {/* Textarea preview */}
          <textarea
            className="input-field"
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            rows={18}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    </div>
  );
};
