// controllers/dashboardController.js — Analytics & summary data

const JobApplication = require('../models/JobApplication');

// ── @GET /api/dashboard/summary ───────────────────────────────
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total count
    const total = await JobApplication.countDocuments({ user: userId });

    // Count per stage
    const stageAgg = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const stageCounts = {};
    stageAgg.forEach(({ _id, count }) => (stageCounts[_id] = count));

    // Applications per week (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyAgg = await JobApplication.aggregate([
      { $match: { user: userId, createdAt: { $gte: eightWeeksAgo } } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$createdAt' },
            week: { $isoWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    // Recent applications
    const recent = await JobApplication.find({ user: userId })
      .sort('-createdAt')
      .limit(5)
      .lean();

    // Priority count
    const priorityCount = await JobApplication.countDocuments({ user: userId, priority: true });

    // Source breakdown
    const sourceAgg = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);
    const sourceCounts = {};
    sourceAgg.forEach(({ _id, count }) => (sourceCounts[_id] = count));

    // Response rate: (non-Saved, non-Applied vs total Applied)
    const appliedCount = (stageCounts['Applied'] || 0);
    const responses = (stageCounts['OA'] || 0) + (stageCounts['Phone Screen'] || 0) +
      (stageCounts['Interview'] || 0) + (stageCounts['Offer'] || 0) + (stageCounts['Accepted'] || 0);
    const responseRate = appliedCount > 0 ? Math.round((responses / appliedCount) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        stageCounts,
        weeklyTrend: weeklyAgg,
        recent,
        priorityCount,
        sourceCounts,
        responseRate,
        offerCount: stageCounts['Offer'] || 0,
        rejectedCount: stageCounts['Rejected'] || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSummary };