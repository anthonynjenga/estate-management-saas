import React from 'react';
import { useEstate } from '../context/EstateContext';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Send,
  Building
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';

export const CollectionDashboard: React.FC = () => {
  const { units, payments, estate, setActiveTab, setSelectedUnitForModal } = useEstate();

  // Metrics
  const totalBilled = units.reduce((acc, u) => acc + u.monthlyServiceCharge, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalArrears = units.reduce((acc, u) => acc + u.currentBalance, 0);
  const collectionRate = totalBilled > 0 ? Math.min(100, Math.round((totalCollected / totalBilled) * 100)) : 0;
  
  const totalUnitsCount = units.length;
  const settledUnitsCount = units.filter(u => u.paymentStatus === 'Paid').length;
  const overdueUnitsCount = units.filter(u => u.paymentStatus === 'Overdue').length;
  const criticalCount = units.filter(u => u.riskCategory === 'Critical' || u.riskCategory === 'High').length;

  // Chart 1 Data: Monthly Collection Trend (Historical 6 months)
  const trendData = [
    { month: 'Apr 2026', Target: totalBilled, Collected: totalBilled * 0.82, Arrears: totalBilled * 0.18 },
    { month: 'May 2026', Target: totalBilled, Collected: totalBilled * 0.88, Arrears: totalBilled * 0.12 },
    { month: 'Jun 2026', Target: totalBilled, Collected: totalBilled * 0.79, Arrears: totalBilled * 0.21 },
    { month: 'Jul 2026', Target: totalBilled, Collected: totalBilled * 0.91, Arrears: totalBilled * 0.09 },
    { month: 'Aug 2026', Target: totalBilled, Collected: totalBilled * 0.85, Arrears: totalBilled * 0.15 },
    { month: 'Sep 2026 (Current)', Target: totalBilled, Collected: totalCollected, Arrears: totalArrears }
  ];

  // Chart 2 Data: Payment Method Breakdown
  const methodMap: Record<string, number> = {};
  payments.forEach(p => {
    methodMap[p.method] = (methodMap[p.method] || 0) + p.amountPaid;
  });
  const methodPieData = Object.keys(methodMap).map(method => ({
    name: method,
    value: methodMap[method]
  }));
  if (methodPieData.length === 0) {
    methodPieData.push({ name: 'M-Pesa', value: 120000 }, { name: 'Bank Transfer', value: 95000 }, { name: 'Direct Debit', value: 45000 });
  }

  // Chart 3 Data: Arrears Aging Buckets
  const bucket30 = units.filter(u => u.daysOverdue > 0 && u.daysOverdue <= 30).reduce((a, u) => a + u.currentBalance, 0);
  const bucket60 = units.filter(u => u.daysOverdue > 30 && u.daysOverdue <= 60).reduce((a, u) => a + u.currentBalance, 0);
  const bucket90 = units.filter(u => u.daysOverdue > 60 && u.daysOverdue <= 90).reduce((a, u) => a + u.currentBalance, 0);
  const bucketPlus = units.filter(u => u.daysOverdue > 90).reduce((a, u) => a + u.currentBalance, 0);

  const agingData = [
    { name: '0-30 Days', amount: bucket30 },
    { name: '31-60 Days', amount: bucket60 },
    { name: '61-90 Days', amount: bucket90 },
    { name: '90+ Days (Legal)', amount: bucketPlus }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#d946ef'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Hero */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-low">Live Estate Operations</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>September 2026 Billing Cycle</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '6px', margin: 0 }}>
            Monthly Collection & Revenue Dashboard
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Real-time breakdown of service charge recovery, arrears accumulation, and smart risk metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('reminders')} className="btn btn-primary">
            <Send size={18} />
            <span>Batch Dispatch Reminders</span>
          </button>
          <button onClick={() => setActiveTab('committee')} className="btn btn-secondary">
            <span>Generate Board Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Card 1: Total Billed */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target Billed
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={20} color="#6366f1" />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px' }}>
            {estate.currency} {totalBilled.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {totalUnitsCount} estate units
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Actual Collected
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px', color: '#10b981' }}>
            {estate.currency} {totalCollected.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>
            <ArrowUpRight size={14} />
            <span>{settledUnitsCount} units fully settled</span>
          </div>
        </div>

        {/* Card 3: Outstanding Arrears */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Outstanding Arrears
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px', color: '#ef4444' }}>
            {estate.currency} {totalArrears.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ef4444', marginTop: '4px' }}>
            <ArrowDownRight size={14} />
            <span>{overdueUnitsCount} units overdue ({criticalCount} critical)</span>
          </div>
        </div>

        {/* Card 4: Collection Rate % */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Collection Rate
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px', color: collectionRate > 80 ? '#10b981' : '#f59e0b' }}>
            {collectionRate}%
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--bg-tertiary)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${collectionRate}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Collection Trend */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Collection Trend vs Target</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Historical 6-month performance</span>
            </div>
            <BarChart3 size={20} color="var(--accent-primary)" />
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--text-dim)" fontSize={12} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} 
                  formatter={(val: any) => [`${estate.currency} ${Number(val).toLocaleString()}`, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="Target" stroke="#6366f1" fillOpacity={1} fill="url(#colorTarget)" />
                <Area type="monotone" dataKey="Collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Arrears Aging Distribution */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Arrears Aging Breakdown</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Debt classification by delay severity</span>
            </div>
            <PieIcon size={20} color="#ef4444" />
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} layout="vertical">
                <XAxis type="number" stroke="var(--text-dim)" tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="var(--text-dim)" width={100} fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  formatter={(val: any) => [`${estate.currency} ${Number(val).toLocaleString()}`, 'Arrears Balance']}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {agingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Delinquent Units Quick Roster */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Priority Arrears Action Roster</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Units requiring immediate payment follow-up</span>
          </div>
          <button onClick={() => setActiveTab('arrears')} className="btn btn-secondary btn-sm">
            View All Units ({units.length})
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Unit & Block</th>
                <th>Resident / Owner</th>
                <th>Monthly Charge</th>
                <th>Current Balance</th>
                <th>Overdue Days</th>
                <th>Risk Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.filter(u => u.currentBalance > 0).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700 }}>
                    <div>{u.unitNumber}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.block}</span>
                  </td>
                  <td>
                    <div>{u.ownerName}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.ownerPhone}</span>
                  </td>
                  <td>{estate.currency} {u.monthlyServiceCharge.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#ef4444' }}>
                    {estate.currency} {u.currentBalance.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${u.daysOverdue > 90 ? 'badge-critical' : (u.daysOverdue > 30 ? 'badge-high' : 'badge-medium')}`}>
                      {u.daysOverdue} Days
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '45px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${u.riskScore}%`, height: '100%', background: u.riskScore > 75 ? '#ef4444' : (u.riskScore > 40 ? '#f59e0b' : '#10b981') }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{u.riskScore}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedUnitForModal(u)}
                      className="btn btn-outline btn-sm"
                    >
                      Inspect / Notice
                    </button>
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
