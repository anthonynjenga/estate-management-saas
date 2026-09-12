import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { MessageSquareText, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { Unit } from '../types';

export const SMSReminderTemplates: React.FC = () => {
  const { templates, units, estate } = useEstate();

  const overdueUnits = units.filter(u => u.currentBalance > 0);
  const [selectedUnitId, setSelectedUnitId] = useState(overdueUnits[0]?.id || units[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const targetUnit: Unit | undefined = units.find(u => u.id === selectedUnitId) || units[0];

  // Helper to replace ALL dynamic tags robustly
  const interpolateTemplate = (content: string, u?: Unit) => {
    if (!u) return content;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    const dateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const currentDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return content
      .replace(/{{resident_name}}/g, u.ownerName || 'Resident')
      .replace(/{{unit_no}}/g, u.unitNumber || 'Unit')
      .replace(/{{amount_due}}/g, Math.max(0, u.currentBalance).toLocaleString())
      .replace(/{{currency}}/g, estate.currency || 'KES')
      .replace(/{{due_date}}/g, dateStr)
      .replace(/{{current_date}}/g, currentDateStr)
      .replace(/{{days_overdue}}/g, u.daysOverdue.toString())
      .replace(/{{paybill}}/g, estate.bankDetails.paybillNo || '522XXX')
      .replace(/{{bank_name}}/g, estate.bankDetails.bankName || 'Demo National Bank')
      .replace(/{{account_no}}/g, estate.bankDetails.accountNumber || '0000-XXXX-XXXX')
      .replace(/{{account_name}}/g, estate.bankDetails.accountName || 'HOA Account')
      .replace(/{{estate_name}}/g, estate.name)
      .replace(/{{manager_email}}/g, estate.managerEmail)
      .replace(/{{manager_phone}}/g, estate.managerPhone)
      .replace(/{{manager_name}}/g, estate.managerName);
  };

  const handleCopySMS = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenWhatsApp = (text: string, phone: string = '') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  const smsTemplates = templates.filter(t => t.channel === 'SMS' || t.channel === 'Notice');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquareText size={22} color="#10b981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Instant Mobile Messaging Studio
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            SMS & WhatsApp Reminder Templates
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Ready-to-send SMS and WhatsApp messages with 1-click copy and direct WhatsApp Web dispatch.
          </p>
        </div>
      </div>

      {/* Target Unit Selector Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Select Resident:</span>
        <select
          className="input-field"
          value={selectedUnitId}
          onChange={(e) => setSelectedUnitId(e.target.value)}
          style={{ width: '320px' }}
        >
          {units.map(u => (
            <option key={u.id} value={u.id}>
              {u.unitNumber} - {u.ownerName} ({u.ownerPhone}) - Balance: {estate.currency} {u.currentBalance.toLocaleString()}
            </option>
          ))}
        </select>

        {targetUnit && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
            <span>Target Phone: <strong>{targetUnit.ownerPhone}</strong></span>
            <span className={`badge ${targetUnit.currentBalance > 0 ? 'badge-high' : 'badge-low'}`}>
              {targetUnit.currentBalance > 0 ? `${targetUnit.daysOverdue} Days Overdue` : 'Account Clear'}
            </span>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {smsTemplates.map(tpl => {
          const renderedContent = interpolateTemplate(tpl.content, targetUnit);
          const charCount = renderedContent.length;
          const smsPages = Math.ceil(charCount / 160);

          return (
            <div key={tpl.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>{tpl.title}</span>
                  <span className={`badge ${tpl.tone === 'Polite' ? 'badge-low' : (tpl.tone === 'Firm' ? 'badge-medium' : 'badge-high')}`}>
                    {tpl.tone}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {charCount} chars ({smsPages} SMS {smsPages > 1 ? 'parts' : 'part'})
                </span>
              </div>

              {/* Formatted Message Bubble */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'pre-line'
              }}>
                {renderedContent}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleCopySMS(tpl.id, renderedContent)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  {copiedId === tpl.id ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copiedId === tpl.id ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleOpenWhatsApp(renderedContent, targetUnit?.ownerPhone)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, background: '#25D366', borderColor: '#25D366' }}
                >
                  <ExternalLink size={16} />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
