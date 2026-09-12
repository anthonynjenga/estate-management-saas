import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import { PieChart, Save } from 'lucide-react';

export const BudgetCalculator: React.FC = () => {
  const { budgets, updateBudget, estate } = useEstate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<number>(0);

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.budgetedAmount, 0);
  const totalActual = budgets.reduce((acc, b) => acc + b.actualAmount, 0);
  const totalVariance = totalBudgeted - totalActual;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={22} color="#6366f1" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Estate Budgeting & Capital Forecasting
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Estate Budget Calculator & Variance Tracker
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Annual and monthly operational budgeting, actual vs budget variance tracking, and sinking fund reserve projection.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Budget Allocated</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6366f1' }}>
              {estate.currency} {totalBudgeted.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Budget Target</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            {estate.currency} {totalBudgeted.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Allocated across 6 categories</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Actual Monthly Spend</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px', color: totalActual > totalBudgeted ? '#ef4444' : '#10b981' }}>
            {estate.currency} {totalActual.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Logged expenses to date</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Net Budget Variance</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px', color: totalVariance >= 0 ? '#10b981' : '#ef4444' }}>
            {totalVariance >= 0 ? '+' : ''}{estate.currency} {totalVariance.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: totalVariance >= 0 ? '#10b981' : '#ef4444' }}>
            {totalVariance >= 0 ? 'Under budget (Surplus)' : 'Over budget (Deficit)'}
          </span>
        </div>
      </div>

      {/* Budget Breakdown Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Category Budget Allocations</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click 'Edit' to update allocation</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budgeted Amount</th>
                <th>Actual Spend</th>
                <th>Variance (Diff)</th>
                <th>% Utilized</th>
                <th>Notes / Allocation Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(b => {
                const diff = b.budgetedAmount - b.actualAmount;
                const pctSpent = b.budgetedAmount > 0 ? Math.round((b.actualAmount / b.budgetedAmount) * 100) : 0;
                const isEditing = editingId === b.id;

                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700 }}>{b.category}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          className="input-field"
                          value={tempAmount}
                          onChange={(e) => setTempAmount(Number(e.target.value))}
                          style={{ width: '130px', padding: '4px 8px' }}
                        />
                      ) : (
                        <span>{estate.currency} {b.budgetedAmount.toLocaleString()}</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{estate.currency} {b.actualAmount.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: diff >= 0 ? '#10b981' : '#ef4444' }}>
                      {diff >= 0 ? '+' : ''}{estate.currency} {diff.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, pctSpent)}%`, height: '100%', background: pctSpent > 100 ? '#ef4444' : '#6366f1' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pctSpent > 100 ? '#ef4444' : 'var(--text-main)' }}>{pctSpent}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.notes}</td>
                    <td>
                      {isEditing ? (
                        <button
                          onClick={() => {
                            updateBudget(b.id, tempAmount);
                            setEditingId(null);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(b.id);
                            setTempAmount(b.budgetedAmount);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
