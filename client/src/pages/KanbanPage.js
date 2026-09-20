
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ApplicationModal from '../components/ApplicationModal';

const COLUMNS = [
  { key: 'Saved',        color: '#64748b', emoji: '🗂️' },
  { key: 'Applied',      color: '#3b82f6', emoji: '📤' },
  { key: 'OA',           color: '#8b5cf6', emoji: '📝' },
  { key: 'Phone Screen', color: '#06b6d4', emoji: '📞' },
  { key: 'Interview',    color: '#f59e0b', emoji: '🎤' },
  { key: 'Offer',        color: '#10b981', emoji: '🏆' },
  { key: 'Rejected',     color: '#ef4444', emoji: '❌' },
];

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function KanbanPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/applications');
      setApps(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleStageChange = async (appId, newStage) => {
    try {
      await api.patch(`/applications/${appId}/stage`, { stage: newStage });
      toast.success(`Moved to ${newStage}`);
      fetchApps();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleSave = async (formData) => {
    try {
      await api.post('/applications', formData);
      toast.success('Application added!');
      fetchApps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
      throw err;
    }
  };

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = apps.filter((a) => a.stage === col.key);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Pipeline Board</h1>
          <p className="page-subtitle">Visual overview of your job pipeline · {apps.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>➕ Add Application</button>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : (
        <div className="kanban-wrap">
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <div key={col.key} className="kanban-col">
                {/* Column header */}
                <div className="kanban-col-header">
                  <div className="kanban-col-title" style={{ color: col.color }}>
                    {col.emoji} {col.key}
                  </div>
                  <div className="kanban-col-count">{grouped[col.key].length}</div>
                </div>

                {/* Cards */}
                <div className="kanban-cards">
                  {grouped[col.key].length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                      Empty
                    </div>
                  )}
                  {grouped[col.key].map((app) => (
                    <div key={app._id} className="kanban-card">
                      <div className="kc-company">
                        {app.priority && <span style={{ color: 'var(--accent)', marginRight: 4 }}>⭐</span>}
                        {app.company}
                      </div>
                      <div className="kc-role">{app.role}</div>
                      {app.location && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>📍 {app.location}</div>
                      )}
                      <div className="kc-meta">
                        <span className="kc-date">{formatDate(app.appliedDate) || formatDate(app.createdAt)}</span>
                        {app.source && <span className="source-tag">{app.source}</span>}
                      </div>

                      {/* Quick move buttons */}
                      <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {COLUMNS.filter((c) => c.key !== col.key).slice(0, 3).map((c) => (
                          <button
                            key={c.key}
                            onClick={() => handleStageChange(app._id, c.key)}
                            style={{
                              fontSize: 10, padding: '2px 7px', border: `1px solid ${c.color}33`,
                              borderRadius: 99, background: `${c.color}11`, color: c.color,
                              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600,
                            }}
                          >
                            → {c.key}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={null}
      />
    </div>
  );
}