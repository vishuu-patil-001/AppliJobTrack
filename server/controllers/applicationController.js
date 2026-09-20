// controllers/applicationController.js — Full CRUD for Job Applications

const JobApplication = require('../models/JobApplication');

// ── @GET /api/applications ────────────────────────────────────
// Supports: ?stage=Applied&search=google&sort=-createdAt&priority=true
const getApplications = async (req, res) => {
  try {
    const { stage, search, sort, priority, source } = req.query;
    const filter = { user: req.user._id };

    if (stage && stage !== 'All') filter.stage = stage;
    if (source && source !== 'All') filter.source = source;
    if (priority === 'true') filter.priority = true;

    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role:    { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption = sort || '-createdAt';

    const applications = await JobApplication.find(filter)
      .sort(sortOption)
      .lean();

    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/applications/:id ────────────────────────────────
const getApplication = async (req, res) => {
  try {
    const app = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/applications ───────────────────────────────────
const createApplication = async (req, res) => {
  try {
    const {
      company, role, location, jobUrl, source, salaryNote,
      stage, statusNote, appliedDate, interviewDate, deadlineDate,
      notes, tags, priority,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const application = await JobApplication.create({
      user: req.user._id,
      company, role, location, jobUrl, source, salaryNote,
      stage: stage || 'Saved',
      statusNote, appliedDate, interviewDate, deadlineDate,
      notes, tags, priority,
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/applications/:id ────────────────────────────────
const updateApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/applications/:id ────────────────────────────
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PATCH /api/applications/:id/stage ───────────────────────
const updateStage = async (req, res) => {
  try {
    const { stage, statusNote } = req.body;
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { stage, statusNote },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication, updateStage };