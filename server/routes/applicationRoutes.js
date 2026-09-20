// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getApplications, getApplication, createApplication,
  updateApplication, deleteApplication, updateStage,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require auth

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router.patch('/:id/stage', updateStage);

module.exports = router;