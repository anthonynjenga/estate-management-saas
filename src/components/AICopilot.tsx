import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { Sparkles, X, Send, Bot, User, ArrowRight, Minus } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionSuggest?: {
    type: 'open_tab' | 'view_unit';
    target: string;
    label: string;
  };
}

export const AICopilot: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, units, payments, expenses, estate, setActiveTab } = useEstate();

  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am **Estate Assistant**. I've analyzed **${estate.name}** context:\n\n• **${units.filter(u => u.paymentStatus === 'Overdue').length} units** currently have overdue balances.\n• Highest risk defaulter: **${units.find(u => u.riskCategory === 'Critical')?.ownerName || 'Unit V-02'}**.\n• Overall collection rate is standing at **${Math.round((payments.reduce((a, p) => a + p.amountPaid, 0) / units.reduce((a, u) => a + u.monthlyServiceCharge, 0)) * 100)}%**.\n\nHow can I assist your property management team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isCopilotOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate Smart Response based on query keywords
    setTimeout(() => {
      let aiText = '';
      let action: ChatMessage['actionSuggest'] = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('arrears') || lower.includes('overdue') || lower.includes('defaulter')) {
        const criticals = units.filter(u => u.riskCategory === 'Critical' || u.riskCategory === 'High');
        aiText = `Based on Risk Analysis, there are **${criticals.length} high-risk delinquent accounts**:\n\n` +
          criticals.map(c => `• **${c.unitNumber} (${c.ownerName})**: Overdue by ${c.daysOverdue} days (Balance: ${estate.currency} ${c.currentBalance.toLocaleString()}) - Risk Score: ${c.riskScore}/100`).join('\n') +
          `\n\n*Recommendation*: Issue a formal pre-legal demand letter to unit V-02 and B-203 immediately.`;
        action = { type: 'open_tab', target: 'defaulters', label: 'View Defaulter Classification' };
      } else if (lower.includes('budget') || lower.includes('expense') || lower.includes('spending')) {
        const totalExp = expenses.reduce((a, e) => a + e.amount, 0);
        aiText = `Total estate expenses logged for September: **${estate.currency} ${totalExp.toLocaleString()}**.\n\n` +
          `• Security: ${estate.currency} ${expenses.filter(e => e.category === 'Security').reduce((a, e) => a + e.amount, 0).toLocaleString()}\n` +
          `• Utilities: ${estate.currency} ${expenses.filter(e => e.category === 'Utilities').reduce((a, e) => a + e.amount, 0).toLocaleString()}\n` +
          `• Maintenance: ${estate.currency} ${expenses.filter(e => e.category === 'Repairs & Maintenance').reduce((a, e) => a + e.amount, 0).toLocaleString()}\n\n` +
          `*Note*: Utility bills are running 3.1% above budget due to increased borehole generator diesel consumption.`;
        action = { type: 'open_tab', target: 'expenses', label: 'Open Expense Tracker' };
      } else if (lower.includes('notice') || lower.includes('letter') || lower.includes('reminder')) {
        aiText = `I have pre-populated a **Formal Payment Notice** tailored for overdue units with variable placeholders (Resident Name, Unit No, Amount Due, Paybill). You can copy or export it as PDF directly from the Payment Notice module.`;
        action = { type: 'open_tab', target: 'reminders', label: 'Go to Notice Generator' };
      } else {
        aiText = `I can help you perform automated estate operations! Ask me to:\n1. Show critical defaulters & generate legal letters\n2. Calculate service charge formula updates\n3. Summarize monthly committee AGM report\n4. Analyze budget vs actual variance.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggest: action
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Render Compact Floating Button when minimized
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5), var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.2s ease-in-out'
        }}
        className="btn-primary"
        title="Expand Assistant"
      >
        <Sparkles size={22} color="#ffffff" />
        
        {/* Unread indicator badge */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#10b981',
          color: '#ffffff',
          fontSize: '0.7rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 8px #10b981'
        }}>
          {messages.length}
        </div>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      width: '420px',
      height: '620px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color-glow)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), var(--shadow-glow)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden',
      backdropFilter: 'var(--backdrop-blur)'
    }}>
      {/* Copilot Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--accent-gradient)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Estate Copilot</h3>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>Smart Assistant • Property Operations</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Minimize to Floating Button"
          >
            <Minus size={18} />
          </button>

          {/* Close Button */}
          <button
            onClick={() => setIsCopilotOpen(false)}
            style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        <button
          onClick={() => handleSend('Show critical defaulters list')}
          style={{ padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          🚨 Critical Defaulters
        </button>
        <button
          onClick={() => handleSend('Summarize monthly expenses')}
          style={{ padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          📊 Expense Summary
        </button>
        <button
          onClick={() => handleSend('Draft notice for overdue units')}
          style={{ padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          ✍️ Draft Demand Notice
        </button>
      </div>

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: msg.sender === 'ai' ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {msg.sender === 'ai' ? <Bot size={18} color="#ffffff" /> : <User size={18} color="var(--text-main)" />}
            </div>

            <div style={{ maxWidth: '80%' }}>
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: msg.sender === 'ai' ? 'var(--bg-card)' : 'var(--accent-primary)',
                color: msg.sender === 'ai' ? 'var(--text-main)' : '#ffffff',
                border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                fontSize: '0.85rem',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}

                {msg.actionSuggest && (
                  <button
                    onClick={() => {
                      setActiveTab(msg.actionSuggest!.target);
                    }}
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid var(--accent-primary)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{msg.actionSuggest.label}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Ask Copilot Assistant anything about your estate..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="btn btn-primary"
          style={{ padding: '0 16px' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
