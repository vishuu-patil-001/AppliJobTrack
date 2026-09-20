// pages/ApplicationsPage.js — Full CRUD table with filters

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ApplicationModal from '../components/ApplicationModal';

const STAGES = ['All', 'Saved', 'Applied', 'OA', 'Phone Screen', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Accepted'];
const SOURCES = ['All', 'LinkedIn', 'Indeed', 'Company Site', 'Referral', 'Naukri', 'Internshala', 'Other'];

function StageBadge({ stage }) {
  return <span className={`stage-badge stage-${stage.replace(' ', '')}`}>{stage}</span>;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (stageFilter !== 'All') params.stage = stageFilter;
      if (sourceFilter !== 'All') params.source = sourceFilter;
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get('/applications', { params });
      setApps(data.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [stageFilter, sourceFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchApps, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchApps]);

  const handleSave = async (formData) => {
    try {
      if (editTarget) {
        await api.put(`/applications/${editTarget._id}`, formData);
        toast.success('Application updated!');
      } else {
        await api.post('/applications', formData);
        toast.success('Application added! 🎯');
      }
      fetchApps();
      setEditTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
      throw err;
    }
  };

  const handleEdit = (app) => {
    setEditTarget(app);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Deleted');
      fetchApps();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleStageChange = async (app, newStage) => {
    try {
      await api.patch(`/applications/${app._id}/stage`, { stage: newStage });
      toast.success(`Moved to ${newStage}`);
      fetchApps();
    } catch {
      toast.error('Update failed');
    }
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{apps.length} application{apps.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Application</button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-wrap">
          {/* Toolbar */}
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search company, role, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {(stageFilter !== 'All' || sourceFilter !== 'All' || search) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setStageFilter('All'); setSourceFilter('All'); setSearch(''); }}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* Table body */}
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : apps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">No applications found</div>
              <div className="empty-subtext">Try adjusting filters or add your first application.</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>Add Application</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Company / Role</th>
                    <th>Stage</th>
                    <th>Source</th>
                    <th>Applied</th>
                    <th>Interview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {app.priority && <span title="Priority" style={{ color: 'var(--accent)', fontSize: 14 }}>⭐</span>}
                          <div>
                            <div className="company-cell">{app.company}</div>
                            <div className="role-cell">{app.role}{app.location ? ` · ${app.location}` : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* Inline stage changer */}
                        <select
                          value={app.stage}
                          onChange={(e) => handleStageChange(app, e.target.value)}
                          style={{
                            background: 'transparent', border: 'none', color: 'inherit',
                            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14,
                          }}
                        >
                          {STAGES.slice(1).map((s) => <option key={s} style={{ background: 'var(--bg-card)' }}>{s}</option>)}
                        </select>
                        <StageBadge stage={app.stage} />
                      </td>
                      <td><span className="source-tag">{app.source || '—'}</span></td>
                      <td><span className="date-cell">{formatDate(app.appliedDate)}</span></td>
                      <td><span className="date-cell">{formatDate(app.interviewDate)}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn icon-btn-edit" onClick={() => handleEdit(app)} title="Edit">✏️</button>
                          <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(app._id)} title="Delete">🗑️</button>
                          {app.jobUrl && (
                            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                              <button className="icon-btn" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }} title="Open JD">🔗</button>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  );
}