
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STAGE_ORDER = ['Applied', 'OA', 'Phone Screen', 'Interview', 'Offer', 'Accepted'];

function StageBadge({ stage }) {
  const cls = `stage-badge stage-${stage.replace(' ', '')}`;
  return <span className={cls}>{stage}</span>;
}

function FunnelChart({ stageCounts }) {
  const total = stageCounts['Applied'] || 1;
  return (
    <div className="funnel-list">
      {STAGE_ORDER.map((s) => {
        const count = stageCounts[s] || 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={s} className="funnel-row">
            <span className="funnel-label">{s}</span>
            <div className="funnel-bar-wrap">
              <div className="funnel-bar" style={{ width: `${pct}%` }} />
            </div>
            <span className="funnel-count">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;

  const sc = data?.stageCounts || {};
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 8 }}>
        <div>
          <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's your job search overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/applications')}>
          ➕ Add Application
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-number">{data?.total || 0}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#3b82f6' }}>
          <div className="stat-icon">📤</div>
          <div className="stat-number">{sc['Applied'] || 0}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#f59e0b' }}>
          <div className="stat-icon">🎤</div>
          <div className="stat-number">{sc['Interview'] || 0}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#10b981' }}>
          <div className="stat-icon">🏆</div>
          <div className="stat-number">{(sc['Offer'] || 0) + (sc['Accepted'] || 0)}</div>
          <div className="stat-label">Offers</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#ef4444' }}>
          <div className="stat-icon">❌</div>
          <div className="stat-number">{sc['Rejected'] || 0}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#8b5cf6' }}>
          <div className="stat-icon">📊</div>
          <div className="stat-number">{data?.responseRate || 0}%</div>
          <div className="stat-label">Response Rate</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        {/* Funnel */}
        <div className="chart-card">
          <div className="chart-title">🔻 Application Funnel</div>
          <FunnelChart stageCounts={sc} />
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(sc).map(([s, c]) => (
              <span key={s} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{c}</span> {s}
              </span>
            ))}
          </div>
        </div>

        {/* Recent applications */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="chart-title" style={{ marginBottom: 0 }}>🕐 Recent Applications</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/applications')}>View all →</button>
          </div>

          {data?.recent?.length === 0 && (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-icon">📭</div>
              <div className="empty-text">No applications yet</div>
              <div className="empty-subtext">Start by adding your first application!</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data?.recent?.map((app) => (
              <div key={app._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onClick={() => navigate('/applications')}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{app.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.role}</div>
                </div>
                <StageBadge stage={app.stage} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source breakdown */}
      {data?.sourceCounts && Object.keys(data.sourceCounts).length > 0 && (
        <div style={{ padding: '0 32px 32px' }}>
          <div className="chart-card">
            <div className="chart-title">🔗 Applications by Source</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              {Object.entries(data.sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => (
                <div key={src} style={{
                  padding: '8px 16px', background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{cnt}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}