import React, { useState, useEffect } from 'react';
import { useEstate } from '../context/EstateContext';
import { Mail, Send, Copy, Eye, CheckCircle2, Laptop, Smartphone } from 'lucide-react';
import type { Unit } from '../types';

export const EmailReminderGenerator: React.FC = () => {
  const { units, estate } = useEstate();

  const overdueUnits = units.filter(u => u.currentBalance > 0);
  const [selectedUnitId, setSelectedUnitId] = useState(overdueUnits[0]?.id || units[0]?.id || '');
  const [tone, setTone] = useState<'Polite' | 'Firm' | 'Formal' | 'Legal'>('Formal');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isCopied, setIsCopied] = useState(false);
  const [isSentSimulated, setIsSentSimulated] = useState(false);

  const targetUnit = units.find(u => u.id === selectedUnitId) || units[0];

  // Subject line generator based on tone
  const getSubjectLine = (u: Unit, t: string) => {
    if (!u) return '';
    if (t === 'Polite') return `Friendly Reminder: Service Charge Statement for Unit ${u.unitNumber} - ${estate.name}`;
    if (t === 'Firm') return `Overdue Payment Notice: Unit ${u.unitNumber} (${estate.currency} ${u.currentBalance.toLocaleString()} Outstanding)`;
    if (t === 'Legal') return `FINAL LEGAL DEMAND: Delinquent Service Charge Account - Unit ${u.unitNumber}`;
    return `Statement of Account & Service Charge Demand - Unit ${u.unitNumber}`;
  };

  const [subject, setSubject] = useState('');
  const [emailBodyText, setEmailBodyText] = useState('');

  useEffect(() => {
    if (targetUnit) {
      setSubject(getSubjectLine(targetUnit, tone));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      setEmailBodyText(`Dear ${targetUnit.ownerName},

This is an official communication regarding your service charge account for Unit ${targetUnit.unitNumber} at ${estate.name}.

ACCOUNT STATUS SUMMARY:
• Unit Identifier: ${targetUnit.unitNumber} (${targetUnit.block})
• Current Total Balance: ${estate.currency} ${targetUnit.currentBalance.toLocaleString()}
• Overdue Duration: ${targetUnit.daysOverdue} Days

Service charge recovery funds crucial estate services including 24/7 security personnel, common electricity, elevator maintenance, and compound sanitation.

PAYMENT OPTIONS:
1. M-Pesa Paybill: ${estate.bankDetails.paybillNo} (Account: ${targetUnit.unitNumber})
2. Direct Bank Transfer:
   - Bank Name: ${estate.bankDetails.bankName}
   - Account Name: ${estate.bankDetails.accountName}
   - Account Number: ${estate.bankDetails.accountNumber}

Kindly remit payment on or before ${dueDateStr} to ensure continuous estate services.

Warm regards,

${estate.managerName}
Estate Managing Trustee | ${estate.name}
Phone: ${estate.managerPhone} • Email: ${estate.managerEmail}`);
    }
  }, [selectedUnitId, tone]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${emailBodyText}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendSimulated = () => {
    setIsSentSimulated(true);
    setTimeout(() => setIsSentSimulated(false), 3000);
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
            <Mail size={22} color="#6366f1" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Rich HTML Email Reminders
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Email Reminder & Statement Builder
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Craft professional HTML email statements with subject line generator, tone adjustment, and responsive email preview.
          </p>
        </div>

        {isSentSimulated && (
          <div style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Email Dispatched to {targetUnit?.ownerEmail}!</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Left Column: Email Composer */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Email Composer Settings
          </h3>

          <div>
            <label className="input-label">Target Resident</label>
            <select
              className="input-field"
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} - {u.ownerName} ({u.ownerEmail})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Tone & Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['Polite', 'Firm', 'Formal', 'Legal'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: tone === t ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                    color: tone === t ? '#ffffff' : 'var(--text-main)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Subject Line</label>
            <input
              type="text"
              className="input-field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Email Content Body</label>
            <textarea
              className="input-field"
              value={emailBodyText}
              onChange={(e) => setEmailBodyText(e.target.value)}
              rows={12}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCopyEmail} className="btn btn-secondary" style={{ flex: 1 }}>
              {isCopied ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{isCopied ? 'Copied!' : 'Copy Raw Text'}</span>
            </button>
            <button onClick={handleSendSimulated} className="btn btn-primary" style={{ flex: 1 }}>
              <Send size={16} />
              <span>Simulate Email Send</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Mock Email Client Preview */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Live Email Client Preview</h3>
            </div>

            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setPreviewDevice('desktop')}
                style={{ padding: '4px 10px', background: previewDevice === 'desktop' ? 'var(--accent-primary)' : 'transparent', color: previewDevice === 'desktop' ? '#ffffff' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Laptop size={16} />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                style={{ padding: '4px 10px', background: previewDevice === 'mobile' ? 'var(--accent-primary)' : 'transparent', color: previewDevice === 'mobile' ? '#ffffff' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          {/* Rendered Email Client Container */}
          <div style={{
            maxWidth: previewDevice === 'mobile' ? '340px' : '100%',
            margin: previewDevice === 'mobile' ? '0 auto' : '0',
            borderRadius: 'var(--radius-md)',
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            transition: 'max-width 0.3s ease'
          }}>
            {/* Fake Email Client Header */}
            <div style={{ padding: '12px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569' }}>
              <div><strong>From:</strong> {estate.managerName} &lt;{estate.managerEmail}&gt;</div>
              <div><strong>To:</strong> {targetUnit?.ownerName} &lt;{targetUnit?.ownerEmail}&gt;</div>
              <div style={{ marginTop: '4px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{subject}</div>
            </div>

            {/* Email Body */}
            <div style={{ padding: '24px', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {emailBodyText}

              {/* Call to Action Button */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a
                  href="#pay"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    background: '#6366f1',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Pay Service Charge Online ({estate.currency} {targetUnit?.currentBalance.toLocaleString()})
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
