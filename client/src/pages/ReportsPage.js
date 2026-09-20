
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../utils/api';

const STAGE_COLORS = {
  Saved: '#64748b', Applied: '#3b82f6', OA: '#8b5cf6',
  'Phone Screen': '#06b6d4', Interview: '#f59e0b',
  Offer: '#10b981', Rejected: '#ef4444',
  Accepted: '#22c55e', Withdrawn: '#6b7280',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  const sc = data?.stageCounts || {};

  // Build chart data
  const stageData = Object.entries(sc).map(([name, value]) => ({ name, value }));
  const pieData = stageData.filter((d) => d.value > 0);

  const weeklyData = (data?.weeklyTrend || []).map((w) => ({
    week: `W${w._id.week}`,
    count: Number(w.count),
  }));

  const total = data?.total || 0;
  const appliedCount = sc['Applied'] || 0;
  const interviewCount = sc['Interview'] || 0;
  const offerCount = (sc['Offer'] || 0) + (sc['Accepted'] || 0);
  const rejectedCount = sc['Rejected'] || 0;

  const conversionRate = appliedCount > 0 ? ((offerCount / appliedCount) * 100).toFixed(1) : 0;
  const interviewRate = appliedCount > 0 ? ((interviewCount / appliedCount) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Insights from your job search journey</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-number">{data?.responseRate || 0}%</div>
          <div className="stat-label">Response Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎤</div>
          <div className="stat-number">{interviewRate}%</div>
          <div className="stat-label">Interview Conversion</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">{conversionRate}%</div>
          <div className="stat-label">Offer Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-number">{data?.priorityCount || 0}</div>
          <div className="stat-label">Priority Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-number">{rejectedCount}</div>
          <div className="stat-label">Rejections</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar — stage distribution */}
        <div className="chart-card">
          <div className="chart-title">📊 Applications by Stage</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Applications" radius={[4, 4, 0, 0]}>
                {stageData.map((entry) => (
                  <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie — stage breakdown */}
        <div className="chart-card">
          <div className="chart-title">🥧 Stage Breakdown</div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-text">No data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Weekly trend */}
        <div className="chart-card" style={{ gridColumn: weeklyData.length > 0 ? '1 / -1' : undefined }}>
          <div className="chart-title">📈 Applications per Week (Last 8 Weeks)</div>
          {weeklyData.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <div className="empty-text">Not enough data yet</div>
              <div className="empty-subtext">Keep adding applications to see trends.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Applications" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Source table */}
      {data?.sourceCounts && Object.keys(data.sourceCounts).length > 0 && (
        <div style={{ padding: '0 32px 32px' }}>
          <div className="chart-card">
            <div className="chart-title">🔗 Source Performance</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Source</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Applications</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => (
                  <tr key={src} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 0', fontSize: 14 }}>{src}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)' }}>{cnt}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>
                      {total > 0 ? `${Math.round((cnt / total) * 100)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}