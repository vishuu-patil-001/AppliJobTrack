
import React, { useState, useEffect } from 'react';

const STAGES = ['Saved', 'Applied', 'OA', 'Phone Screen', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Accepted'];
const SOURCES = ['LinkedIn', 'Indeed', 'Company Site', 'Referral', 'Naukri', 'Internshala', 'Other'];

const EMPTY = {
  company: '', role: '', location: '', jobUrl: '', source: 'LinkedIn',
  salaryNote: '', stage: 'Saved', statusNote: '', appliedDate: '',
  interviewDate: '', deadlineDate: '', notes: '', tags: '', priority: false,
};

export default function ApplicationModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY,
        ...initial,
        appliedDate:   initial.appliedDate   ? initial.appliedDate.slice(0, 10)   : '',
        interviewDate: initial.interviewDate ? initial.interviewDate.slice(0, 10) : '',
        deadlineDate:  initial.deadlineDate  ? initial.deadlineDate.slice(0, 10)  : '',
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [initial, open]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{initial ? '✏️ Edit Application' : '➕ Add Application'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Company */}
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input className="form-input" name="company" placeholder="Google, Microsoft…" value={form.company} onChange={handle} required />
              </div>

              {/* Role */}
              <div className="form-group">
                <label className="form-label">Role / Title *</label>
                <input className="form-input" name="role" placeholder="SDE Intern, Frontend Dev…" value={form.role} onChange={handle} required />
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" name="location" placeholder="Remote / Bangalore…" value={form.location} onChange={handle} />
              </div>

              {/* Source */}
              <div className="form-group">
                <label className="form-label">Source</label>
                <select className="form-select" name="source" value={form.source} onChange={handle}>
                  {SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Stage */}
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select className="form-select" name="stage" value={form.stage} onChange={handle}>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label">Salary Note</label>
                <input className="form-input" name="salaryNote" placeholder="₹12 LPA / $90k…" value={form.salaryNote} onChange={handle} />
              </div>

              {/* Job URL */}
              <div className="form-group form-full">
                <label className="form-label">Job URL</label>
                <input className="form-input" name="jobUrl" type="url" placeholder="https://…" value={form.jobUrl} onChange={handle} />
              </div>

              {/* Dates */}
              <div className="form-group">
                <label className="form-label">Applied Date</label>
                <input className="form-input" type="date" name="appliedDate" value={form.appliedDate} onChange={handle} />
              </div>

              <div className="form-group">
                <label className="form-label">Interview Date</label>
                <input className="form-input" type="date" name="interviewDate" value={form.interviewDate} onChange={handle} />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" name="deadlineDate" value={form.deadlineDate} onChange={handle} />
              </div>

              {/* Priority */}
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 24 }}>
                  <input type="checkbox" name="priority" checked={form.priority} onChange={handle} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                  ⭐ Mark as Priority
                </label>
              </div>

              {/* Status note */}
              <div className="form-group form-full">
                <label className="form-label">Status Note</label>
                <input className="form-input" name="statusNote" placeholder="Heard back from HR…" value={form.statusNote} onChange={handle} />
              </div>

              {/* Tags */}
              <div className="form-group form-full">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" name="tags" placeholder="react, fullstack, remote…" value={form.tags} onChange={handle} />
              </div>

              {/* Notes */}
              <div className="form-group form-full">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" name="notes" rows={3} placeholder="Interview prep notes, contacts, next steps…" value={form.notes} onChange={handle} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : initial ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}