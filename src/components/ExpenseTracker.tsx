import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { Receipt, Plus, UploadCloud, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import type { ExpenseCategory } from '../types';

export const ExpenseTracker: React.FC = () => {
  const { expenses, addExpense, deleteExpense, estate } = useEstate();

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Security');
  const [amount, setAmount] = useState<number>(0);
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [isOCRSimulating, setIsOCRSimulating] = useState(false);

  // Simulated AI OCR scanner trigger
  const handleSimulateOCRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      setIsOCRSimulating(true);

      // Simulate AI OCR reading invoice data
      setTimeout(() => {
        setIsOCRSimulating(false);
        if (file.name.toLowerCase().includes('fuel') || file.name.toLowerCase().includes('diesel')) {
          setTitle('Emergency Generator Diesel Refill');
          setCategory('Utilities');
          setAmount(84500);
          setVendor('Rubis Energy Westlands');
        } else if (file.name.toLowerCase().includes('clean') || file.name.toLowerCase().includes('sanit')) {
          setTitle('Common Area Disinfection & Bin Sanitization');
          setCategory('Landscaping');
          setAmount(32000);
          setVendor('CleanMax Hygiene Services');
        } else {
          setTitle(`Invoice Log: ${file.name.replace(/\.[^/.]+$/, '')}`);
          setCategory('Repairs & Maintenance');
          setAmount(45000);
          setVendor('Apex Technical Contractors');
        }
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    addExpense({
      title,
      category,
      amount,
      vendor: vendor || 'General Vendor',
      date,
      paymentMethod,
      status: 'Paid',
      receiptFileName: receiptFileName || undefined
    });

    // Reset form
    setTitle('');
    setAmount(0);
    setVendor('');
    setReceiptFileName('');
  };

  const totalExpenseSum = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={22} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
              Receipt & Expense Logger
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Estate Expense Tracker & Vendor Audit Log
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Log operational expenditures, scan receipts with built-in OCR, and track category spending.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent This Month</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>
            {estate.currency} {totalExpenseSum.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Left Form: Log Expense */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Log New Expense</h3>
            <span className="badge badge-low">OCR Scanner Ready</span>
          </div>

          {/* AI OCR Simulated Receipt Scanner Drag/Drop */}
          <div style={{
            border: '2px dashed var(--border-color-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
            background: 'var(--bg-tertiary)',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              onChange={handleSimulateOCRUpload}
              accept="image/*,.pdf"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={28} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {receiptFileName ? `Attached: ${receiptFileName}` : 'Drop Receipt / Invoice to Auto-Scan with Smart OCR'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Supports PDF, PNG, JPG (Simulates automatic extraction of Vendor, Amount & Category)
              </span>
            </div>
          </div>

          {isOCRSimulating && (
            <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              <span>OCR Analyzing Invoice document structure...</span>
            </div>
          )}

          <div>
            <label className="input-label">Expense Title / Description</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Monthly Security Guard Services"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="input-label">Expense Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                <option value="Security">Security</option>
                <option value="Utilities">Utilities</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Repairs & Maintenance">Repairs & Maintenance</option>
                <option value="Administrative">Administrative</option>
                <option value="Sinking Fund Capital">Sinking Fund Capital</option>
              </select>
            </div>

            <div>
              <label className="input-label">Amount ({estate.currency})</label>
              <input
                type="number"
                className="input-field"
                placeholder="0.00"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label className="input-label">Vendor / Supplier</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. G4S Secure Ltd"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Payment Method</label>
              <select className="input-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="input-label">Payment Date</label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '6px' }}>
            <Plus size={18} />
            <span>Record Expense Entry</span>
          </button>
        </form>

        {/* Right Table: Expense Audit Log */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Logged Expenditures Roster ({expenses.length})
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title & Vendor</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{exp.title}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vendor: {exp.vendor}</span>
                    </td>
                    <td><span className="badge badge-low">{exp.category}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{exp.date}</td>
                    <td style={{ fontWeight: 800, color: '#f59e0b' }}>
                      {estate.currency} {exp.amount.toLocaleString()}
                    </td>
                    <td>
                      {exp.receiptFileName ? (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> {exp.receiptFileName}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No receipt</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
